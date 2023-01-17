import {PaymentParams} from '@/navigation/navigation';

export const pgWebViewConfig = {
  htmlTemplate: `
    const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(JSON.stringify({'type': 'Console', 'data': {'type': type, 'log': log}}));
    console = {
        log: (log) => consoleLog('log', log),
        debug: (log) => consoleLog('debug', log),
        info: (log) => consoleLog('info', log),
        warn: (log) => consoleLog('warn', log),
        error: (log) => consoleLog('error', log),
      };

    window.onload = function() {
    ##SCRIPT##
    };
    true;
    `,

  cancelUrl: 'https://localhost/canc',

  nextUrl: 'https://localhost/next',
};

export const configInicis = {
  PAYMENT_SERVER: 'https://stgstdpay.inicis.com',
  // 'https://stdpay.inicis.com'
  WEBVIEW_ENDPOINT: 'https://mobile.inicis.com/smart/payment/',

  MID: 'INIpayTest',
};

export const inicisWebviewHtml = (info: PaymentParams) => {
  return `<form name="mobileweb" id="" method="post" accept-charset="euc-kr">
      <input type="hidden" name="P_INI_PAYMENT" value="CARD" />
      <input type="hidden" name="P_MID" value="${configInicis.MID}" />
      <input type="hidden" name="P_OID" value="${info.merchant_uid}" />
      <input type="hidden" name="P_AMT" value="${info.amount}" />
      <input type="hidden" name="P_CHARSET" value="utf8" />
      <input type="hidden" name="P_GOODS" value="eSIM 상품" />
      <input type="hidden" name="P_UMANE" value="${info.buyer_name}" />
      <input type="hidden" name="P_MOBILE" value="${info.buyer_tel}" />
      <input type="hidden" name="P_EMAIL" value="${info.buyer_email}" />
      <input type="hidden" name="P_NEXT_URL" value="${pgWebViewConfig.cancelUrl}" />
      <input type="hidden" name="P_CHARSET" value="utf8" />
      <input type="hidden" name="P_RESERVED" value="below1000=Y&vbank_receipt=Y" />
    </form>`;
};

export const inicisWebViewScript = (info: PaymentParams) => {
  return pgWebViewConfig.htmlTemplate.replace(
    '##SCRIPT##',
    `const myform = document.mobileweb;
    myform.action = "https://mobile.inicis.com/smart/payment/";
    myform.target = "_self";
    myform.submit();`,
  );
};
