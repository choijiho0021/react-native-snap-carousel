import CryptoJS from 'crypto-js';
import Env from '@/environment';
import {PaymentParams} from '@/navigation/navigation';

const {payment, isProduction, scheme, apiUrl} = Env.get();

export const debugScript = isProduction
  ? ''
  : `const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(JSON.stringify({'type': 'Console', 'data': {'type': type, 'log': log}}));
    console = {
        log: (log) => consoleLog('log', log),
        debug: (log) => consoleLog('debug', log),
        info: (log) => consoleLog('info', log),
        warn: (log) => consoleLog('warn', log),
        error: (log) => consoleLog('error', log),
      };`;

export const configInicis = {
  confirmUrl: (pymId: string) =>
    `${scheme}://${apiUrl}/rokebi/payment/inicis?v2`,
  notiUrl: `${scheme}://${apiUrl}/rokebi/payment/inicis?noti`,
  WEBVIEW_ENDPOINT: 'https://mobile.inicis.com/smart/payment/',
  WEBVIEW_ENDPOINT_CERT: 'https://sa.inicis.com/auth',
};

const opt: Record<string, string> = {
  kakaopay: '&d_kakaopay=Y',
  tosspay: '&d_tosspay=Y',
  payco: '&d_payco=Y',
  naverpay: '&d_npay=Y',
  ssgpay: '&d_ssgpay=Y',
  lpay: '&d_lpay=Y',
  samsung: '&d_samsungpay=Y',
  applepay: '&d_applepay=Y',
};

export const inicisWebviewHtml = (info: PaymentParams) => {
  let reserved = opt[info.pay_method] || '';
  if (info.card) {
    // reserved += `&d_card=${info.card}&d_quota=0&cardshowopt=${info.card}:3`;
    reserved += `&d_card=${info.card}&d_quota=${info.installmentMonths || '0'}`;
  }

  const timestamp = Date.now();
  const hash = CryptoJS.SHA512(
    info.amount.toString() +
      info.merchant_uid +
      timestamp +
      payment.inicis.HASHKEY,
  ).toString(CryptoJS.enc.Base64);

  return `<html>
  <head>
    <meta http-equiv='content-type' content='text/html; charset=utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <script type='text/javascript'>
    ${debugScript}
    function start_script() {
      const myform = document.mobileweb;
      myform.action = "${configInicis.WEBVIEW_ENDPOINT}";
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
      <input type="hidden" name="P_MID" value="${payment.inicis.MID}" />
      <input type="hidden" name="P_OID" value="${info.merchant_uid}" />
      <input type="hidden" name="P_AMT" value="${info.amount}" />
      <input type="hidden" name="P_CHARSET" value="utf8" />
      <input type="hidden" name="P_GOODS" value="${info.name}" />
      <input type="hidden" name="P_UNAME" value="${info.buyer_name}" />
      <input type="hidden" name="P_MOBILE" value="${info.buyer_tel}" />
      <input type="hidden" name="P_EMAIL" value="${info.buyer_email}" />
      <input type="hidden" name="P_NOTI_URL" value="${configInicis.notiUrl}" />
      <input type="hidden" name="P_NEXT_URL" value="${configInicis.confirmUrl(
        info.merchant_uid,
      )}" />
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

export const inicisButton = (accountId: string) => {
  const info = {
    amount: 2200,
    app_scheme: 'RokebiEsim',
    card: '',
    digital: true,
    escrow: false,
    installmentMonths: '0',
    isSave: true,
    language: 'ko',
    merchant_uid: 'r_01010002003_1724225714104',
    mode: 'roaming_product',
    name: '로밍도깨비',
    pay_method: 'kakaopay',
    paymentRule: {
      '01': 'I',
      '02': 'I',
      '03': 'I',
      '04': 'I',
      '06': 'I',
      '11': 'I',
      '12': 'I',
      '14': 'I',
      '32': 'I',
      '33': 'I',
      '35': 'I',
      '41': 'I',
      '43': 'I',
      '48': 'I',
      '51': 'I',
      '52': 'I',
      '54': 'I',
      '55': 'I',
      '56': 'I',
      '71': 'I',
      ccard: [],
      inicis_enabled: '1',
      kakaopay: 'I',
      maintenance: {message: 'test', state: '0'},
      naverpay: 'I',
      payco: 'I',
      timestamp_dev: '2023-03-25T17:24:11',
      timestamp_prod: '2024-08-21T14:12:00',
    },
    pg: 'html5_inicis',
    pymMethod: 'pym:kakao',
    receipt: undefined,
    rokebi_cash: undefined,
    selected: 'pym:kakao',
  };

  const mid = 'INIiasTest'; // 테스트 MID 입니다. 계약한 상점 MID 로 변경 필요
  const apiKey = 'TGdxb2l3enJDWFRTbTgvREU3MGYwUT09'; // 테스트 MID 에 대한 apiKey
  const timestamp = Date.now();
  const mTxId = `t_${timestamp}_00001111${accountId}`;
  const reservedMsg = 'isUseToken=Y'; // 결과조회 응답시 개인정보 SEED 암호화 처리 요청

  // 등록가맹점 확인
  const authHash_plainText = mid + mTxId + apiKey;

  const flgFixedUser = 'Y'; // 특정 사용자 고정 사용, 미사용시 N

  // const timestamp = Date.now();
  // const mid = 'INIpayTest';
  // const mTxId = timestamp;
  // const key = 'ItEQKi3rY7uvDS8l';
  const userName = '최지호'; // 사용자 이름
  const userPhone = '01021035030'; // 사용자 전화번호
  const userBirth = '19961115'; // 사용자 생년월일
  const reqSvcCd = '01'; // 요청구분코드 ["01":간편인증, "02":전자서명]

  // const userHash = CryptoJS.SHA256(
  //   userName + mid + userPhone + mTxId + userBirth + reqSvcCd,
  // ).toString(CryptoJS.enc.Base64);

  const userHash = CryptoJS.SHA256(
    userName + mid + userPhone + mTxId + userBirth + reqSvcCd,
  ).toString();

  let reserved = opt[info.pay_method] || '';
  if (info.card) {
    // reserved += `&d_card=${info.card}&d_quota=0&cardshowopt=${info.card}:3`;
    reserved += `&d_card=${info.card}&d_quota=${info.installmentMonths || '0'}`;
  }
  // const hash = CryptoJS.SHA512(mid + mTxId + key).toString(CryptoJS.enc.Base64);

  // const hash = CryptoJS.SHA256(authHash_plainText).toString(
  //   CryptoJS.enc.Base64,
  // );

  const hash = CryptoJS.SHA256(authHash_plainText).toString();

  return `<html> 
<head> 
    <meta http-equiv='content-type' content='text/html; charset=utf-8'/> 
    <title>통합본인인증 요청</title> 
    <style>
    		html, body, input, textarea{font-family:FontAwesome; font-size:13px; line-height:18px; color: #000;}
    		h1{font-size:28px;text-align: center;}
    		table{width: 380px;margin:0 auto;text-align: center;}
    
    		.btnBox{margin-top: 30px;text-align: left;}
    		.Btn{display:inline-block;*display:inline;zoom:1;font-size: 17px;color: #fff;font-weight:bold;text-align: center;vertical-align: middle;background: #333;height: 48px;line-height: 44px;min-width:380px;}
    		input {padding:7px;width:500px;margin-bottom:10px;}
    		h4 {width:150px;}
    </style>
    
    <script type='text/javascript'>
      ${debugScript}
      function start_script() {
        const myform = document.saForm;
        myform.action = "${configInicis.WEBVIEW_ENDPOINT_CERT}";
        myform.target = "_self";
        myform.submit();
        }
      function callSa()
    	{
        document.saForm.setAttribute("target", "_self");
        document.saForm.setAttribute("post", "post");
        document.saForm.setAttribute("action", "https://sa.inicis.com/auth"); 
        document.saForm.submit();
    	}
    	function popupCenter() {
    		let _width = 400;
    		let _height = 620;
    		var xPos = (document.body.offsetWidth/2) - (_width/2); // 가운데 정렬
    		xPos += window.screenLeft; // 듀얼 모니터일 때
    
    		return window.open("", "sa_popup", "width="+_width+", height="+_height+", left="+xPos+", menubar=yes, status=yes, titlebar=yes, resizable=yes");
    	}
    </script>
</head>
<body>

    <h1 style="margin:50px 0px 50px 0px">통합본인인증 Sample</h1>
	
    <form name="saForm" method="post" accept-charset="utf-8">
	
	    <table>
	    	<tr>
                <td><h4>mid</h4></td>
	    	    <td><input type="text" name="mid" value="${mid}"</td>
	    	</tr>
	    	<tr>
                <td><h4>reqSvcCd</h4></td>
	    	    <td><input type="text" name="reqSvcCd" value="01"></td>           
            </tr>
	    	<tr>  
	    	    <td><h4>identifier</h4></td>
	    	    <td><input type="text" name="identifier" value="테스트서명입니다."></td>
            </tr>
	    	<tr>   
	    	    <td><h4>mTxId</h4></td>
	    	    <td><input type="text" name="mTxId" value="${mTxId}"></td>
            </tr>
        <tr>
	    	<tr>   
	    	    <td><h4>flgFixedUser</h4></td>
	    	    <td><input type="text" name="flgFixedUser" value="${flgFixedUser}"></td>
            </tr>
        <tr>
          <td><h4>userName</h4></td>
          <td><input type="text" name="userName" value="${userName}"></td>
          </tr>
        <tr>
          <td><h4>userPhone</h4></td>
          <td><input type="text" name="userPhone" value="${userPhone}"></td>
          </tr>
        <tr>
          <td><h4>userBirth</h4></td>
          <td><input type="text" name="userBirth" value="${userBirth}"></td>
        </tr>
        <tr>
          <td><h4>userHash</h4></td>
          <td><input type="text" name="userHash" value="${userHash}"></td>
        </tr> 
	    	<tr>    
	    	    <td><h4>authHash</h4></td>
	    	    <td><input type="text" name="authHash" value="${hash}"></td>
            </tr>
	    	<tr>    
	    	    <td><h4>flgFixedUser</h4></td>
	    	    <td><input type="text" name="flgFixedUser" value="N"></td>
            </tr> 
	    	<tr>    
	    	    <td><h4>reservedMsg</h4></td>
	    	    <td><input type="text" name="reservedMsg" value="${reservedMsg}"></td>
            </tr>
	    	<tr>    
                <td><h4>successUrl</h4></td>
	    	    <td><input type="text" name="successUrl" value="http://64.110.75.203/api/v1/pvd/auth/realName"></td>
             </tr>
	    	<tr>   
	    	    <td><h4>failUrl</h4></td>
	    	    <td><input type="text" name="failUrl" value="http://64.110.75.203/api/v1/pvd/auth/realName"></td>
                <!-- successUrl/failUrl 은 분리하여도 됩니다. !-->
        	</tr>
	    	
	    </table>
    </form>	

</body>
</html>`;
};

export const successHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Success</title>
</head>
<body>
    <h1>Success Page</h1>
    <p>인증 수신</p>
    
    <!-- Example static content based on JSP logic -->
    <p>resultCode: 0000</p>
    <p>resultMsg: 인증 성공</p>
    
    <!-- Simulating what would happen in JSP -->
    <script>
        // Assume that the JSP dynamic content is processed here
        // This is a placeholder to represent how the content might be filled in
        function displayResult() {
            // Assuming resultCode and resultMsg are received dynamically
            const resultCode = "0000"; // Mock result code
            const resultMsg = "인증 성공"; // Mock result message
            
            document.body.innerHTML += "<p>인증 결과: " + resultMsg + "</p>";
            
            if (resultCode === "0000") {
                document.body.innerHTML += "<p>인증 성공?</p>";
                // Add logic to handle a successful result
            } else {
                document.body.innerHTML += "<p>인증 실패?</p>";
                // Add logic to handle a failed result
            }
        }

        displayResult();
    </script>
</body>
</html>
`;
