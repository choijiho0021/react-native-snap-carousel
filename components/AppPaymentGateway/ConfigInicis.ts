import CryptoJS from 'crypto-js';
import Env from '@/environment';
import {PaymentParams} from '@/navigation/navigation';

const {payment, isProduction, scheme, apiUrl} = Env.get();

export const pgWebViewConfig = {
  cancelUrl: 'https://localhost/canc',

  nextUrl: 'https://localhost/next',

  confirmUrl: `${scheme}://${apiUrl}/rokebi/payment/inicis`,

  notiUrl: `${scheme}://${apiUrl}/rokebi/payment/inicis?noti`,
};

export const configInicis = {
  WEBVIEW_ENDPOINT: 'https://mobile.inicis.com/smart/payment/',
};

const opt: Record<string, string> = {
  kakaopay: '&d_kakaopay=Y',
  tosspay: '&d_tosspay=Y',
  payco: '&d_payco=Y',
  naverpay: '&d_npay=Y',
  ssgpay: '&d_ssgpay=Y',
  lpay: '&d_lpay=Y',
  samsung: '&d_samsungpay=Y',
};

export const inicisWebviewHtml = (info: PaymentParams) => {
  const inicis = isProduction
    ? payment.inicis
    : {
        MID: 'INIpayTest', // inicis test key
        HASHKEY: '3CB8183A4BE283555ACC8363C0360223',
      };
  const reserved = opt[info.pay_method] || '';
  const timestamp = Date.now();
  const hash = CryptoJS.SHA512(
    info.amount.toString() + info.merchant_uid + timestamp + inicis.HASHKEY,
  ).toString(CryptoJS.enc.Base64);

  const debugScript = isProduction
    ? ''
    : `const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(JSON.stringify({'type': 'Console', 'data': {'type': type, 'log': log}}));
    console = {
        log: (log) => consoleLog('log', log),
        debug: (log) => consoleLog('debug', log),
        info: (log) => consoleLog('info', log),
        warn: (log) => consoleLog('warn', log),
        error: (log) => consoleLog('error', log),
      };`;

  return `<html>
  <head>
    <meta http-equiv='content-type' content='text/html; charset=utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <script type='text/javascript'>
    ${debugScript}
    function goto_inicis() {
      const myform = document.mobileweb;
      myform.action = "https://mobile.inicis.com/smart/payment/";
      myform.target = "_self";
      myform.submit();
      }
    </script>
  </head>
  <body>
      <form name="mobileweb" id="" method="post" accept-charset="euc-kr">
      <input type="hidden" name="P_INI_PAYMENT" value="${
        info.pay_method === 'trans' ? 'VBANK' : 'CARD'
      }" />
      <input type="hidden" name="P_MID" value="${inicis.MID}" />
      <input type="hidden" name="P_OID" value="${info.merchant_uid}" />
      <input type="hidden" name="P_AMT" value="${info.amount}" />
      <input type="hidden" name="P_CHARSET" value="utf8" />
      <input type="hidden" name="P_GOODS" value="${info.name}" />
      <input type="hidden" name="P_UMANE" value="${info.buyer_name}" />
      <input type="hidden" name="P_MOBILE" value="${info.buyer_tel}" />
      <input type="hidden" name="P_EMAIL" value="${info.buyer_email}" />
      <input type="hidden" name="P_NOTI_URL" value="${
        pgWebViewConfig.notiUrl
      }" />
      <input type="hidden" name="P_NEXT_URL" value="${
        pgWebViewConfig.confirmUrl
      }" />
      <input type="hidden" name="P_CHARSET" value="utf8" />
      <input type="hidden" name="P_TIMESTAMP" value="${timestamp}" />
      <input type="hidden" name="P_CHKFAKE" value="${hash}" />
      <input type="hidden" name="P_RESERVED" value="amt_hash=Y&below1000=Y${reserved}&app_scheme=${
    info.app_scheme
  }://" />
    </form>
  </body>
</html>`;
};

export const inicisScript = () => {
  return 'goto_inicis();';
};
