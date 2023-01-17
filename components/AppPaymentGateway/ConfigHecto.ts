import moment from 'moment';
import {encryptAES256, encryptSHA256} from './crypt';
import {pgWebViewConfig} from './ConfigInicis';
import {PaymentParams} from '@/navigation/navigation';

export const configHecto = {
  /**
    ===== MID(상점아이디) =====
    상점아이디는 세틀뱅크에서 상점으로 발급하는 상점의 고유한 식별자입니다.
    테스트환경에서의 MID는 다음과 같습니다.
        nx_mid_il : 문화/도서/해피/스마트문상/틴캐시/계좌이체/가상계좌/티머니
        nxca_jt_il : 신용카드 인증 결제
        nxca_jt_bi : 신용카드 비인증 결제
        nxca_jt_gu : 신용카드 구인증 결제
       	nxca_payco : 페이코 간편결제
       	nxca_kakao : 카카오 간편결제
        nxhp_pl_il : 휴대폰 일반 결제
        nxhp_pl_hd : 휴대폰 인증/승인 분리형
        nxhp_pl_ma : 휴대폰 월 자동 결제
        nxpt_kt_il : 포인트 결제
    상용서비스시에는 세틀뱅크에서 발급한 상점 고유 MID를 설정하십시오.
*/
  PG_MID: 'nx_mid_il',

  /**
    ===== 라이센스키 =====  
    회원사 mid당 하나의 라이센스키가 발급되며 SHA256 해시체크 용도로 사용됩니다. 이 값은 외부에 노출되어서는 안 됩니다.
    테스트환경에서는 ST1009281328226982205 값을 사용하시면 되며,
    상용서비스시에는 세틀뱅크에서 발급한 상점 고유 라이센스키를 설정하십시오.
*/
  LICENSE_KEY: 'ST1009281328226982205',

  /**
    ===== AES256 암호화 키 =====    
    파라미터 AES256암/복호화에 사용되는 키 입니다. 이 값은 외부에 노출되어서는 안 됩니다.
    테스트환경에서는 pgSettle30y739r82jtd709yOfZ2yK5K를 사용하시면 됩니다.
    상용서비스시에는 세틀뱅크에서 발급한 상점 고유 암호화키를 설정하십시오.
*/
  AES256_KEY: 'pgSettle30y739r82jtd709yOfZ2yK5K',

  /** 
    ===== 결제 서버 URL =====
    세틀뱅크 결제 서버 URL입니다. 이 값은 변경하지 마십시오. 
    필요에 따라 주석 on/off 하여 사용하십시오.
*/
  PAYMENT_SERVER: 'https://tbnpg.settlebank.co.kr', //테스트서버 url
  //final String PAYMENT_SERVER = "https://npg.settlebank.co.kr";//운영서버 url

  /**
    ===== 취소 서버 URL =====
    세틀뱅크 취소 서버 URL입니다. 이 값은 변경하지 마십시오.
    필요에 따라 주석 on/off 하여 사용하십시오.
    
*/
  CANCEL_SERVER: 'https://tbgw.settlebank.co.kr', //테스트서버 url
  //final String CANCEL_SERVER = "https://gw.settlebank.co.kr";//운영서버 url

  /** 세틀뱅크 API통신 Connect Timeout 설정(ms) */
  CONN_TIMEOUT: 5000,

  /** 세틀뱅크 API통신 Read Timeout 설정(ms) */
  READ_TIMEOUT: 25000,

  ROKEBI_HOST_IP: '',
};

const pymMethod: Record<string, string[]> = {
  card: ['card', '', 'nxca_jt_il'],
  payco: ['corp', 'PAC', 'nxca_payco'],
  kakaopay: ['corp', 'KKP', 'nxca_kakao'],
  naverpay: ['corp', 'NVP', 'hecto_test'],
};

export const hectoWebViewScript = (info: PaymentParams) => {
  const now = moment();
  const pym = pymMethod[info.pay_method];
  if (!pym) return '';

  const [method, corpPayCode, mchtId] = pym;
  const data = {
    env: configHecto.PAYMENT_SERVER,
    method,
    corpPayCode,
    mchtId,
    trdDt: now.format('YYYYMMDD'),
    trdTm: now.format('HHmmss'),
    mchtTrdNo: info.merchant_uid,
    mchtName: info.name,
    mchtEName: 'UANGEL',
    pmtPrdtNm: 'eSIM 상품',

    trdAmt: encryptAES256(info.amount.toString(), configHecto.AES256_KEY),
    notiUrl: 'https://example.com/notiUrl',
    nextUrl: pgWebViewConfig.nextUrl,
    cancUrl: pgWebViewConfig.cancelUrl,
    pktHash: '',
    ui: {
      type: 'self',
    },
  };

  data.pktHash = encryptSHA256(
    data.mchtId +
      data.method +
      data.mchtTrdNo +
      data.trdDt +
      data.trdTm +
      info.amount.toString() +
      configHecto.LICENSE_KEY,
  );

  console.log('@@@ script', data);

  return pgWebViewConfig.htmlTemplate.replace(
    '##SCRIPT##',
    `window.SETTLE_PG.pay(
      ${JSON.stringify(data)}
      function (rsp) {
          console.log(rsp);
        }
      );`,
  );
};
