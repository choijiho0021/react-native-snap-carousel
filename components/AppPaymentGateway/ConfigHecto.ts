import moment from 'moment';
import CryptoJS from 'crypto-js';
import {encryptAES256} from './crypt';
import Env from '@/environment';
import {PaymentParams} from '@/navigation/navigation';
import {debugScript} from './ConfigInicis';
import {pgWebViewConfig} from '.';

const {payment, scheme, apiUrl, isProduction} = Env.get();

export const configHecto = {
  notiUrl: `${scheme}://${apiUrl}/rokebi/payment/hecto?noti`,
  nextUrl: `${scheme}://${apiUrl}/rokebi/payment/hecto`,

  // PAYMENT_SERVER: isProduction
  //   ? 'https://npg.settlebank.co.kr' //운영서버 url
  //   : 'https://tbnpg.settlebank.co.kr', //테스트서버 url

  PAYMENT_SERVER: 'https://npg.settlebank.co.kr', //운영서버 url

  /** 세틀뱅크 API통신 Connect Timeout 설정(ms) */
  CONN_TIMEOUT: 5000,

  /** 세틀뱅크 API통신 Read Timeout 설정(ms) */
  READ_TIMEOUT: 25000,

  ROKEBI_HOST_IP: '',

  cardGb: {
    '03': 'LTC', //  '롯데카드',
    '04': 'HDC', //  '현대카드',
    '06': 'KBC', // '국민카드',
    '11': 'BCC', // '비씨카드',
    '12': 'SSC', //  '삼성카드',
    '14': 'SHN', //  '신한카드(구.LG카드 포함)',
    '32': '034', //  '광주카드',
    '33': '037', //  '전북카드',
    '34': 'HNC', //  '하나카드',
    '35': '002', //  '산업카드',
    '38': 'WRI', //  '우리카드 (44 사용 시 변경필요)',
    '41': 'NHC', //  'NH카드',
    '43': '027', //  '씨티카드',
    '48': '048', //  '신협체크카드',
    '51': '007', //  '수협카드',
    '52': '035', //  '제주카드',
    // '54' : 'MG새마을금고체크',
    '55': '089', //  '케이뱅크카드',
    '56': '090', //  '카카오뱅크',
    '71': '071', //  '우체국체크',
    '95': '050', //  '저축은행체크',
  } as Record<string, string>,

  /*
BCC	비씨	KBC	국민
HNC	하나(외환)	SSC	삼성
SHN	신한	WRI	우리
HDC	현대	LTC	롯데
007	수협	NHC	NH농협
035	제주	034	광주
037	전북	027	시티
// 218	KB증권	
050	저축은행
071	우체국	048	신협
002	산업	090	카카오뱅크
089	케이뱅크	KBP	KBPay
SSP	삼성페이		
*/
};

const pymMethod: Record<string, string[]> = {
  card: ['card', '', payment.hecto.PG_MID],
  payco: ['corp', 'PAC', 'nxca_payco'],
  kakaopay: ['corp', 'KKP', 'nxca_kakao'],
  naverpay: ['corp', 'NVP', 'hecto_test', 'CARD'],
};

export const hectoWebViewHtml = (info: PaymentParams) => {
  const now = moment();
  const pym = pymMethod[info.pay_method];
  if (!pym) return '';

  const [method, corpPayCode, mchtId, corpPayType] = pym;

  const data = {
    env: configHecto.PAYMENT_SERVER,
    method,
    corpPayCode,
    corpPayType,
    mchtId,
    trdDt: now.format('YYYYMMDD'),
    trdTm: now.format('HHmmss'),
    mchtTrdNo: info.merchant_uid,
    mchtName: info.name,
    mchtEName: 'UANGEL',
    pmtPrdtNm: info.name,
    mchtCustNm: info.buyer_name,

    trdAmt: encryptAES256(info.amount.toString(), payment.hecto.AES256_KEY),
    notiUrl: configHecto.notiUrl,
    nextUrl: configHecto.nextUrl,
    cancUrl: pgWebViewConfig.cancelUrl,
    pktHash: '',
    ui: {
      type: 'self',
    },
  };

  if (info.card && configHecto.cardGb[info.card]) {
    // show payment page of credit card company directly
    data.methodSub = 'direct';
    data.cardGb = configHecto.cardGb[info.card];
  }

  data.pktHash = CryptoJS.SHA256(
    data.mchtId +
      data.method +
      data.mchtTrdNo +
      data.trdDt +
      data.trdTm +
      info.amount.toString() +
      payment.hecto.LICENSE_KEY,
  ).toString(CryptoJS.enc.Hex);

  return `<html>
  <head>
    <meta http-equiv='content-type' content='text/html; charset=utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <script type="text/javascript" src="${
      data.env
    }/resources/js/v1/SettlePG_v1.2.js"></script>
    <script type='text/javascript'>
    ${debugScript}
    function start_script() {
      window.SETTLE_PG.pay(
        ${JSON.stringify(data)}
        ,function (rsp) {
            console.log(rsp);
          }
        );
    }
    </script>
  </head>
  <body>
  </body>
</html>`;
};
