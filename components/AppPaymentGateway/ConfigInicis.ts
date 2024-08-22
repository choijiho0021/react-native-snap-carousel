import CryptoJS from 'crypto-js';
import Env from '@/environment';
import {PaymentParams} from '@/navigation/navigation';
import moment from 'moment';

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

export const inicisButton = () => {
  const info = {
    amount: 2200,
    app_scheme: 'RokebiEsim',
    buyer_email: 'testadid@gmail.com',
    buyer_name: '01010002003',
    buyer_tel: '01010002003',
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

  console.log('@@@ hash : ', hash);

  return `<html> 
<head> 
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> 
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
    
    <script language="javascript"> 
    	function callSa()
    	{
    		let window = popupCenter();
    		if(window != undefined && window != null)
    		{
    			document.saForm.setAttribute("target", "sa_popup");
    			document.saForm.setAttribute("post", "post");
    			document.saForm.setAttribute("action", "https://sa.inicis.com/auth");
    			document.saForm.submit();
    		}
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
	
    <form name="saForm">
	
	    <table>
	    	<tr>
                <td><h4>mid</h4></td>
	    	    <td><input type="text" name="mid" value="${payment.inicis.MID}"</td>
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
	    	    <td><input type="text" name="mTxId" value="${moment().format(
              'mm:ss',
            )}"></td>
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
	    	    <td><h4>userName</h4></td>
	    	    <td><input type="text" name="userName" value="${info.name}"></td>
            </tr>
	    	<tr>    
	    	    <td><h4>userPhone</h4></td>
	    	    <td><input type="text" name="userPhone" value="${info.buyer_tel}"></td>
            </tr>
	    	<tr>    
	    	    <td><h4>userBirth</h4></td>
	    	    <td><input type="text" name="userBirth" value="${'19961115'}"></td>
            </tr>
	    	<tr>    
	    	    <td><h4>reservedMsg</h4></td>
	    	    <td><input type="text" name="reservedMsg" value="<%=reservedMsg %>"></td>
            </tr>
	    	<tr>    
	    	    <td><h4>directAgency</h4></td>
	    	    <td><input type="text" name="directAgency" value="PASS"></td>
	    	</tr>
	    	<tr>    
                <td><h4>successUrl</h4></td>
	    	    <td><input type="text" name="successUrl" value="https://www.rokebi.com/success.jsp"></td>
             </tr>
	    	<tr>   
	    	    <td><h4>failUrl</h4></td>
	    	    <td><input type="text" name="failUrl" value="https://www.rokebi.com/success.jsp"></td>
                <!-- successUrl/failUrl 은 분리하여도 됩니다. !-->
        	</tr>
	    	
	    </table>
    </form>	
	
    <table>
		<tr>
			<td>
				<div>
					<button class="Btn" onclick="callSa();">인증요청</button>
				</div>
			</td>
		</tr>
	</table>

</table>

</body>
</html>`;
};
