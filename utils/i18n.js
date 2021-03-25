import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';

const locales = RNLocalize.getLocales();

const en = {
  select: 'Select',
  store: 'Store',
  home: 'Home',
  setting: 'Setting',
  usim: 'Usim',
  esim: 'eSIM',
  esimList: 'eSIM Purchase List',
  product: 'Roaming Product',
  sim: 'SIM Card',
  setDate: 'Set Date',
  none: 'None',
  error: 'Error',
  settings: 'Settings',
  won: '₩',
  recharge: 'Recharge',
  day: 'Day',
  scanned: 'Scanned : ',
  cart: 'Cart',
  purchase: 'Purchase',
  total: 'Total',
  package: 'Package',
  add: 'Add More',
  signup: 'Sign Up',
  reg: 'Registration',
  pym: 'Payment History',
  newSim: 'Purchase New SIM',
  qty: 'Unit',
  sum: 'Sum',
  payment: 'Payment',
  appTitle: 'Rokebi',
  ok: 'OK',
  loggingIn: 'Trying to login...',
  cancel: 'Cancel',
  mypage: 'My Page',
  change: 'Change',
  delete: 'Delete',
  modify: 'Modify',
  save: 'Save',
  notice: 'Notice',
  name: 'Name',
  title: 'Title',
  content: 'Content',
  from: 'from',
  price: 'price',
  noti: 'Notification',
  done: 'Done',
  lowest: 'lowest',
  min: 'min',
  sec: 'sec',
  now: 'now',
  latest: 'latest',
  sale: 'Sale',
  hot: 'Hot',
  copy: 'Copy',
  close: 'Close',

  'home:exitApp': 'Exit App',
  'home:guide': 'User Guide',
  'home:checkGuide': 'Check',
  'home:unsupportedTitle': 'eSIM cannot be unsupported',
  'home:supportedDevice': 'Supported Device',
  'home:supportedDeviceBody': '',
  'home:unsupportedBody1': '',
  'home:unsupportedBody2': '',
  'home:unsupportedBody3':
    'This service is only available on supported devices.',
  'home:unsupportedBody4':
    'For devices that do not support eSIM, please use the roaming goblin USIM service, which will be serviced later.',

  'store:dest': 'Destination',
  'store:partnerName': 'Local Operator',
  'store:network': 'Network',
  'store:apn': 'APN Setting',
  'store:name': 'Selected Product',
  'store:startDate': 'Start Date',
  'store:search': '여행국가를 입력하세요',
  'store:asia': 'Asia',
  'store:middle': 'Middle East',
  'store:america': 'America',
  'store:africa': 'Africa',
  'store:multi': 'Multi',
  'store:europe': 'EU',
  'store:usa/au': 'US/AU',

  'country:detail': 'Detail',
  'country:empty': 'There is no search result',

  'view:detail': 'Detail Info',

  'reg:actCode': 'Activation Code',
  'reg:inputActCode': 'Input Activation Code.',
  'reg:email': 'E-mail',
  'reg:ICCID': 'Register SIM Card',
  'reg:cntry': 'Country',
  'reg:mobile': 'Mobile',
  'reg:noEmail': '^Please input email',
  'reg:invalidEmail': '^Invalid e-mail format',
  'reg:noICCID':
    '^Please purchase data product after registering ICCID.\nPress ok button to register SIM card',
  'reg:noActCode': '^Please input Activation Code',
  'reg:noMobile': '^Please input mobile number',
  'reg:invalidMobile': '^Please input 11 digits',
  'reg:invalidActCode': '^Please input 4 digits',
  'reg:wrongActCode': 'Activation code does not match',
  'reg:expiredIccid': 'ICCID expired',
  'reg:invalidStatus': 'Invalid ICCID status',
  'reg:success': 'Your SIM is registered',
  'reg:fail': 'Failed to register SIM',
  'reg:guide': 'Please, purchase and register SIM Card',
  'reg:card': 'Please register SIM Card',
  'reg:cardScan': 'Please show the front of the SIM Card inside the area',
  'reg:inputIccid': 'Input the digits printed on the front of the SIM Card',
  'reg:noPerm': 'No permission to camera',
  'reg:address': 'Register Address',
  'reg:authNoti': 'Auth code sent',
  'reg:scan': 'Scan card',
  'reg:scanOff': 'Scan off',
  'reg:confirm': 'Confirm',
  'reg:reserveToUse': 'Reserve to use',
  'reg:registerToUse': 'Register to use',
  'reg:cancelReservation': 'Cancel Reservation',
  'reg:toRokebiCash': 'Change to Rokebi cash',
  'reg:used': 'Used',
  'reg:expired': 'Expired',
  'reg:canceled': 'Canceled',
  'reg:failedToSendSms': 'Failed to send sms',
  'reg:unableToSendSms': 'Unable to send sms',
  'reg:invalidTelephone':
    'Please input the number correctly to verify the code',
  'reg:failedToLogIn': 'Failed to sign in. Please try again.',
  'reg:toCash':
    'Make the status of current product "Used" and convert it into a Rokebi cash with the same amount as the purchase amount.',
  'reg:activateProduct':
    "current data product is completed and this product will be activated.\nPress the 'OK' button and call 0000# to activate it.",

  'menu:purchase': 'Purchase',
  'menu:card': 'Register',
  'menu:change': 'Change',

  'mysim:title': 'Please, Register ICCID of your SIM',
  'mysim:accNo': 'Account No',
  'mysim:name': 'Provider',
  'mysim:mccmnc': 'MCC/MNC',
  'mysim:operator': 'Network Operator',
  'mysim:permCamera': 'Please, grant the permission to use CAMERA',

  'acc:title': 'My Page',
  'acc:subTitle': 'Purchase & Usage History',
  'acc:accountId': 'Account No',
  'acc:mobile': 'Mobile No',
  'acc:expDate': 'Expiration Date',
  'acc:actDate': 'Activation Date',
  'acc:balance': 'Balance',
  'acc:remain': 'Rokebi Cash Balance',
  'acc:mysim': 'My SIM Info',
  'acc:recharge': 'Recharge',
  'acc:purchaseHistory': 'Purchase',
  'acc:usageHistory': 'Usage',
  'acc:rechargeHistory': 'Recharge History',
  'acc:chat': 'Online Chat (24/7)',
  'acc:notfound': 'ICCID is not found',
  'acc:changeEmail': 'Input new email',
  'acc:permPhoto': 'Please, grant the permission to read photos',
  'acc:permCamera': 'Please, grant the permission to camera',
  'acc:duplicatedEmail': 'Duplicated email',
  'acc:disconnectSim':
    'Disconnect SIM card because another user used the same SIM card',

  // "set:info" : "My SIM Info",
  'set:noti': 'Noti',
  'set:notice': 'Notice',
  'set:contract': 'User Guide',
  'set:privacy': 'Privacy',
  'set:version': 'Version',
  'set:aboutus': 'About Us',
  'set:logout': 'Log Out',
  'set:login': 'Log In',
  'set:fail': 'Failed to connect to the server. Please try again later',
  'set:confirmLogout': 'Please, confirm logout',
  'set:sendAlimTalk': 'The KakaoTalk message has been sent',
  'set:failedToSendAlimTalk':
    'Failed to send a KakaoTalk message. Please try again later',
  'set:pushnoti': 'Push Notifications',

  'rch:recharge': 'Recharge',

  'sim:purchase': 'Purchase SIM',
  'sim:reg': 'Register SIM',
  'sim:price': 'Price',
  'sim:cardPrice': 'SIM Price',
  'sim:deductFromBalance': 'Deduct from the Balance',
  'sim:remainingBalance': 'Balance',
  'sim:rechargeBalance': 'Recharge Balance',

  'mobile:header': 'Login',
  'mobile:title': 'Simple Login',
  'mobile:input': 'Input only numbers',
  'mobile:auth': 'Input auth code',
  'mobile:sendAuth': 'Send code',
  'mobile:resendAuth': 'Resend',
  'mobile:authMatch': 'Auth code matches',
  'mobile:authMismatch': 'Auth code mismatches',
  'mobile:timeout': 'Auth code has expired. Please try again.',
  'mobile:inputInTime': '* Please enter the auth code within 3 minutes',

  'email:input': 'Input',

  'cfm:contract': 'Confirm contract terms',
  'cfm:mandatory': '(Mandatory)',
  'cfm:personalInfo': 'Cofirm collecting personal info',
  'cfm:marketing': 'Confirm marketing',
  'cfm:optional': '(Optional)',
  'cfm:accept': 'Accept',

  'purchase:address': 'Delivery Address',
  'purchase:addrName': 'Alias',
  'purchase:recipient': 'Recipient',
  'purchase:noAddr': 'No Registered Address',
  'purchase:findAddr': 'Find',
  'purchase:zip': 'ZIP',
  'purchase:noAddrName': '^Input the recipient',
  'purchase:delAddr': 'Confirm to delete delivery address',
  'purchase:failedToDelete': 'Failed to delete',
  'purchase:failedToSave': 'Failed to save',
  'purchase:finished': 'Purchased successfully',
  'purchase:failed': 'Purchase failed',

  'addr:road': 'Road',
  'addr:jibun': 'Jibun',
  'addr:details': 'Detail',
  'addr:totalCnt': 'Total %%',
  'addr:search': 'Search',
  'addr:addrAlias': 'Alias',
  'addr:recipient': 'Recipient',
  'addr:recipientNumber': 'Phone Number',
  'addr:address': 'Address',
  'addr:selectBasicAddr': 'Select as Default Address',
  'addr:basicAddr': 'Default Address',
  'addr:enterWithin50': 'Input the value within 50',
  'addr:noAlias': 'Input the alias',
  'addr:noTelephone': 'Input the telephone number',
  'addr:noRecipient': 'Input the recipient',
  'addr:noAddress': 'Click and search the address',
  'addr:noDetails': 'Input the details of address',
  'addr:noHyphen': 'Input without hyphen',
  'addr:invalidAlias': 'Input the value at least 2 characters',
  'addr:invalidTelephone': 'Input the number correctly',
  'addr:invalidRecipient': 'Input the value at least 2 characters',
  'addr:invalidAddress': 'Search the address',
  'addr:invalidDetails': 'Input the details of address correctly',
  'addr:noProfile': '^No Address to select',

  'his:detail': 'Details >',
  'his:etcCnt': '%% case',
  'his:purchaseDate': 'Purchase Date',
  'his:activationDate': 'Activation Date',
  'his:termDate': 'Termination Date',
  'his:expireDate': 'Expiration Date',
  'his:purchaseId': 'Purchase ID',
  'his:pymAmount': 'Payment Amount',
  'his:productAmount': 'Product Amount',
  'his:purchaseList': 'List',
  'his:noPurchase': 'No purchase list',
  'his:noUsage': 'No usage list',
  'his:orderId': 'Order No.',
  'his:inactive': 'Inactive',
  'his:active': 'Active',
  'his:used': 'Used',
  'his:expired': 'Expired',
  'his:reserved': 'Reserved',
  'his:canceled': 'Canceled',
  'his:timeStd': 'Based on KST',

  'his:cancel': 'Cancel Payment',
  'his:paymentDetail': 'Payment Detail',
  'his:shipmentInfo': 'Shipment Info',
  'his:shipmentState': 'Shipment Status',
  'his:memo': 'Delivery Memo',
  'his:input': 'Input',
  'his:notSelected': 'Nothing Selected',
  'his:paymentCompleted': 'Payment Completed',
  'his:ready': 'Preparation',
  'his:shipped': 'Shipment completed',
  'his:trackingCompany': 'Tracking Company',
  'his:tel': 'Tel',
  'his:trackingCode': 'Tracking Code',
  'his:cancelAlert': 'Are you sure you want to cancel the payment?',
  'his:cancelSuccess': 'Payment canceled',
  'his:cancelFail': 'Payment cancellation failed',
  'his:alreadyCanceled': 'Payment already canceled.',
  'his:refresh': 'Please refresh.',
  'his:deliveryProgress': 'Delivery in progress.',
  'his:cancelError': 'An error occurred while canceling payment.',
  'his:afterCancelInfo':
    '• Depending on the payment method, it takes 3 to 7 business days on a weekday to get a refund after a cancellation request.',
  'his:simCancelInfo':
    '• Once the product has been prepared, you cannot change the delivery address or cancel the payment. \n• Please use the 1: 1 inquiry for return and refund requests after receipt of the product.',
  'his:usedOrExpiredInfo':
    '• The product has been used or the deadline for canceling payment has expired.',
  'his:dataCancelInfo':
    '• If all products included in the payment are not in use, you can cancel them within 7 days after payment.',

  'contact:title': 'Contact Center',
  'contact:notice': 'Notice',
  'contact:noticeDetail': 'Notice Detail',
  'contact:faq': 'FAQ',
  'contact:board': 'Help Center',
  'contact:ktalk': 'Request Support by KakaoTalk',
  'contact:call': 'Direct call to call center',

  'faq:general': 'General',
  'faq:payment': 'Payment',
  'faq:config': 'Config',
  'faq:etc': 'ETC',

  'board:title': 'Help Center',
  'board:new': 'New Reqeust',
  'board:list': 'My Requests',
  'board:open': 'Open',
  'board:closed': 'Closed',
  'board:processing': 'Handling',
  'board:noName': '^Input name',
  'board:noMobile': 'Input Mobile number',
  'board:noEmail': 'Input email address',
  'board:noTitle': '^Input title',
  'board:noMsg': '^Input content',
  'board:save': 'Request is registered',
  'board:agree': 'Agree',
  'board:resp': 'Response',
  'board:contact': 'Contact',
  'board:attach': 'Attachment',
  'board:noti':
    '- The response shall be notified by the Rokebi App or KakaoTalk.\n- To check the response later it is necessary to input the contact number registered.',
  'board:pass': 'PIN',
  'board:inputPass': 'Input PIN',
  'board:mylist': 'My Requests',
  'board:nolist': 'No Requests',
  'board:pinMismatch': 'PIN mismatch',
  'board:loading': 'Loading',
  'board:Closed': 'Closed',
  'board:Open': 'Open',

  'cart:totalCnt': 'Total count',
  'cart:totalPrice': 'Total price',
  'cart:deductBalance': 'Rokebi Cash Deduction',
  'cart:currentBalance': 'Current balance',
  'cart:afterDeductBalance': 'After Deduct Balance',
  'cart:dlvCost': 'Delivery cost',
  'cart:totalCost': 'Total payment',
  'cart:totalCntX': 'Total %% pieces',
  'cart:dlvCostNotice':
    '* Free delivery if the purchase is bigger than 30,000 ₩',
  'cart:toCart': 'To Cart',
  'cart:buy': 'Purchase',
  'cart:pymAmount': 'Payment Amount',
  'cart:purchase': 'Purchase',
  'cart:empty': 'Cart is Empty',
  'cart:remove': 'The Discontinued products have been removed from the list.',
  'cart:soldOut':
    'Inventory is exhausted and cannot be purchased at this time.',
  'cart:notToCart': 'Inventory is exhausted and cannot be added to the cart.',
  'cart:systemError':
    'The service is not smooth due to system circumstances. \nPlease try again later.',

  'usim:toRokebiCash': 'Conversion amount\n',
  'usim:balance': 'Rokebi Cash',
  'usim:remainAmount': 'Remain Amount',
  'usim:usageAmount': 'Usage Amount',
  'usim:remainData': 'Remain Data',
  'usim:dataUsageList': 'Data Usage List',
  'usim:esimList': 'eSIM Purchase List',
  'usim:remain': 'Remain',
  'usim:used': 'Used',
  'usim:usablePeriod': 'Usable Period',
  'usim:warning': '※ It may not exactly match your actual usage.',
  'usim:checkUsage': 'Usage Check',
  'usim:failSnackBar':
    "You can't see usage temporarily. Please try again after a few minutes.",
  'usim:usingTime': 'Service active time',
  'usim:until': 'until',

  'esim:usablePeriod': 'Usable Period',
  'esim:expired': 'Expired',
  'esim:notice': 'Products for call can be used in the RokkaebiTalk app.',
  'esim:showQR': 'Show QR',
  'esim:showQR:title': 'QR Code',
  'esim:showQR:nothing': 'QR Code is missing',
  'esim:showQR:frontBody': 'Show QR code',
  'esim:showQR:endBody': '',
  'esim:smdp': 'SM-DP+ Address',
  'esim:actCode': 'Activation code',
  'esim:manualInput': 'Manual Input',
  'esim:manualInput:title': 'eSIM Info',
  'esim:manualInput:bodyPart1': '',
  'esim:manualInput:bodyPart2': '',
  'esim:manualInput:bodyPart3': '',
  'esim:manualInput:bodyPart4': 'eSIM info insert manually',

  'pym:esimInfo':
    '* Please note that eSIM products cannot be canceled as the product Info is sent to the customer via email and app at the same time as payment.',
  'pym:title': 'Payment Info',
  'pym:delivery': 'Shipping Info',
  'pym:deliveryMemo': 'Shipping Memo',
  'pym:method': 'Payment Method',
  'pym:ccard': 'Credit Card',
  'pym:bank': 'Bank',
  'pym:mobile': 'Mobile phone',
  // "pym:toss": "TOSS",
  // "pym:syrup": "Syrup",
  'pym:kakao': 'Kakao Pay',
  'pym:naver': 'Naver Pay',
  'pym:payco': 'Payco',
  'pym:samsung': 'Samsung Pay',
  'pym:ssgpay': 'SSG Pay',
  'pym:lpay': 'L.Pay',
  'pym:balPurchase': 'Pay with Balance.',
  'pym:balance': 'Balance Payment',
  'pym:success': 'Payment successful',
  'pym:fail': 'Payment failed',
  'pym:toOrderList': 'Go To Order List',
  'pym:toHome': 'Go To Home',
  'pym:selectMemo': 'Please select a delivery note.',
  'pym:IputMemo': 'Please enter a delivery note.',
  'pym:notSelected': 'Nothing Selected',
  'pym:tel': 'Please call me',
  'pym:toTel': 'In case of absence, please contact me.',
  'pym:frontDoor': 'In front of the house.',
  'pym:atFrontDoor': 'Please put it in front of the house.',
  'pym:deliveryBox': 'Delivery Box',
  'pym:toDeliveryBox': 'Please put it in the delivery box.',
  'pym:security': 'Security Office',
  'pym:toSecurity': 'Please leave it at the security office.',
  'pym:input': 'Direct Input',
  'pym:tossInfo': "* Toss Pay can be used within the 'Credit Card' menu.",
  'pym:kakaoInfo': 'Kakao Pay Payment Benefits',
  'pym:kakaoInfoContent':
    '- Save ₩5,000 for the first time in your life(4/1 ~ 4/30, Once within the period)\n- Kakao Pay is available in the latest version. Please update.',
  'pym:consentEssential': 'Accept payment requirements',
  'pym:privacy': 'Collection and use of personal information',
  'pym:paymentAgency': 'Terms of use of payment agency service',
  'pym:mandatory': ' (Mandatory)',
  'pym:detail': 'Check Details',
  'pym:systemError': 'Payment failed due to system circumstances',

  'err:login': 'Please login first',
  'err:body': 'There is no body to show',

  'guide:title': 'Guide',
  'guide:buy': 'Please, purchase Rokebi USIM, firstly.',
  'guide:tip': 'Tip',
  'guide:detail': 'More Detail',

  'noti:empty': 'There is no notification',

  'search:list': 'Search List',
  'search:err': 'There is no search list',
  'search:recommend': 'recommendation',

  'codepush:title': 'A new update exists',
  'codepush:body': 'Do you want to update now?',
  'codepush:continue': 'Continue',
  'codepush:mandatory': 'You must install an update to use the app.',
  'codepush:later': 'Later',
  'codepush:update': 'Update',
  'codepush:checking': 'Checking for update.',
  'codepush:download': 'Downloading package.',
  'codepush:awaiting': 'Awaiting user action.',
  'codepush:install': 'Installing update.',
  'codepush:uptodate': 'App up to date.',
  'codepush:ignore': 'Update cancelled by user.',
  'codepush:nextresume':
    'Update installed and will be run when the app next resumes.',
  'codepush:error': 'An unknown error occurred.',
  'codepush:failedToUpdate': 'Failed to update',

  'tutorial:skip': 'skip',
  'tutorial:next': 'next',
  'tutorial:close': 'close',

  'util:storeDataFailed': 'Failed to store data:',
  'util:retrieveDataFailed': 'Failed to retrieve data:',
  'util:removeDataFailed': 'Failed to remove data:',

  'appCenter:cart': "Click the 'to Cart' button",
  'appCenter:purchase': "Click the 'buy' button",
  'appCenter:searchWord': 'Search_Country',
  'appCenter:payment': 'Payment',

  'prodDetail:ProdInfo': 'Info',
  'prodDetail:Caution': 'Caution',
  'prodDetail:Tip': 'Tip',
  'prodDetail:Ask with KakaoTalk': 'Ask With KakaoTalk',
  'prodDetail:Rokebi': 'Rokebi',
  'prodDetail:On': '',
  'prodDetail:Question': 'Is there any question?',
  'prodDetail:KakaoPlus': 'Ask KakaoTalk Plus as a friend!',

  'loading:error': 'Loading Error',
  'loading:terminate':
    'This application has experienced an error during loading and will terminate.',
  'loading:failedToExec':
    'The app cannot be launched because an error occurred during loading.',

  'toast:failedToUpdate':
    'Failed to change settings.\nPlease check your network connection.',
  'toast:failedToLoad':
    'Failed to load the data.\nPlease check your network connection.',
  'toast:failedToOpen': 'Failed to open the KakaoTalk Channel.',
  'toast:copySuccess': 'Copied Successfully.',

  'mypage:idCheckTitle': 'Check the RokebiTalk ID',
  'mypage:manualInput:body': 'You can use below ID to login RokebiTalk service',
  'mypage:iccid': 'ICCID',
  'mypage:activationCode': 'Activation Code',
  'mypage:openRokebiTalk': 'Open RokebiTalk ＞',
  'mypage:preparing': 'Preparing for Service',
  'mypage:mailInfo':
    'The eSIM product you have purchased will be sent to this email.',
};

const ko = {
  select: '선택',
  store: '스토어',
  home: '홈',
  setting: '설정',
  usim: '유심',
  esim: 'eSIM',
  esimList: '구매 eSIM 목록',
  product: '로밍 상품',
  sim: 'SIM 카드',
  setDate: '날짜 선택',
  none: '없음',
  error: '에러',
  settings: '설정',
  won: '원',
  recharge: '충전',
  day: '일',
  scanned: '스캔 완료 : ',
  cart: '카트',
  purchase: '구매',
  total: '총',
  package: '패키지',
  add: '추가',
  signup: '가입',
  pym: '구매 이력',
  newSim: 'SIM 카드 구매',
  qty: '개',
  sum: '합계',
  payment: '결제',
  appTitle: '로밍도깨비',
  ok: '확인',
  loggingIn: '로그인 시도 중...',
  cancel: '취소',
  mypage: '내 계정',
  change: '변경',
  delete: '삭제',
  modify: '수정',
  save: '저장',
  notice: '공지 사항',
  name: '이름',
  title: '제목',
  content: '내용',
  from: 'from',
  price: '가격',
  noti: '알림',
  done: '완료',
  lowest: '최저',
  min: '분',
  sec: '초',
  now: '현재',
  latest: '최신',
  sale: '할인',
  hot: '추천',
  copy: '복사',
  close: '닫기',

  'home:exitApp': '앱 종료',
  'home:guide': '로밍도깨비 사용가이드 !',
  'home:checkGuide': '확인하기',
  'home:unsupportedTitle': 'eSIM 미지원 단말',
  'home:supportedDevice': '서비스 이용 가능 단말',
  'home:supportedDeviceBody': '이외 해외 구매한 eSIM 사용가능 단말',
  'home:unsupportedBody1': '로밍도깨비 ',
  'home:unsupportedBody2': 'eSIM은 eSIM 지원 단말에서만 이용할 수 있는 서비스 ',
  'home:unsupportedBody3': '입니다',
  'home:unsupportedBody4':
    'eSIM 미지원단말은 추후 서비스 될 로밍도깨비 USIM 서비스를 이용해주세요.',

  'store:dest': '목적지',
  'store:partnerName': '로컬 사업자',
  'store:network': '네트워크',
  'store:apn': 'APN 설정',
  'store:name': '선택한 상품',
  'store:startDate': '시작 날짜',
  'store:search': '여행국가를 입력하세요',
  'store:asia': '아시아',
  'store:middle': '중동',
  'store:america': '아메리카',
  'store:africa': '아프리카',
  'store:multi': '복수국가',
  'store:europe': '유럽',
  'store:usa/au': '미주/호주',

  'country:detail': '상세보기',
  'country:empty': '상품검색 결과가 없습니다',
  'country:addCart': '장바구니에 담겼습니다.',

  'view:detail': '상세보기',

  'reg:actCode': 'Activation Code',
  'reg:inputActCode': 'Activation Code를 입력하세요.',
  'reg:email': '이메일',
  'reg:ICCID': 'ICCID 카드 등록',
  'reg:cntry': '국가',
  'reg:mobile': '휴대전화',
  'reg:phone': '일반전화',
  'reg:noEmail': '^E-mail 주소를 입력하세요',
  'reg:invalidEmail': '^E-mail 주소가 아닙니다',
  'reg:noICCID':
    'ICCID 카드 등록 후 \n데이터상품 구매가 가능합니다.\n카드등록화면으로 이동하시겠습니까?',
  'reg:noActCode': '^Activation Code를 입력하세요',
  'reg:noMobile': '^휴대전화 번호를 입력하세요',
  'reg:invalidMobile': '^휴대전화 번호 11자리를 입력하세요',
  'reg:invalidActCode': '^Activation Code 4자리를 입력하세요',
  'reg:wrongActCode': 'Activation Code가 일치하지 않습니다',
  'reg:expiredIccid':
    '사용 기한이 만료된 유심입니다. 사용 가능한 유심을 등록해주세요.',
  'reg:invalidStatus':
    '사용할 수 없는 유심입니다. 사용 가능한 유심을 등록해주세요.',
  'reg:success': '등록이 완료되었습니다',
  'reg:fail': '시스템 사정으로 등록에 실패했습니다.',
  'reg:guide': '유심 구매 후 등록해 주세요',
  'reg:card': '유심을 등록해 주세요',
  'reg:cardScan': '카드 앞면을 영역 안쪽에 비춰주세요',
  'reg:inputIccid': '카드 앞면의 숫자를 입력해주세요',
  'reg:noPerm': '카메라 접근 권한 부족',
  'reg:address': '주소 등록하기',
  'reg:authNoti': '인증 번호를 보냈습니다',
  'reg:scan': '카메라 자동 스캔',
  'reg:scanOff': '스캔 중단',
  'reg:confirm': '등록',
  'reg:reserveToUse': '사용 예약',
  'reg:registerToUse': '사용 등록',
  'reg:cancelReservation': '사용 예약 취소',
  'reg:toRokebiCash': '로깨비캐시 전환',
  'reg:used': '사용 완료',
  'reg:expired': '사용 기한 만료',
  'reg:canceled': '취소 완료',
  'reg:failedToSendSms': 'SMS 인증번호 발송 실패',
  'reg:unableToSendSms': 'SMS 발송 불가',
  'reg:invalidTelephone':
    '인증번호를 확인할 수 있는 휴대폰 번호를 입력해주세요.',
  'reg:failedToLogIn':
    '로깨비 로그인이 실패하였습니다. 다시 시도해주시기 바랍니다.',
  'reg:toCash':
    '현재 상품을 사용 완료 처리하고 구매 금액과 동일한 금액의 캐시로 전환합니다.',
  'reg:activateProduct':
    '현 사용 중인 데이터 상품 사용이 완료되고 해당 상품이 등록되며,\n확인 버튼 누른 후 0000# 통화버튼을 눌러주시면 활성화 됩니다.',

  'menu:purchase': '유심 구매',
  'menu:card': '유심 등록',
  'menu:change': '유심 변경',

  'mysim:title': '도깨비 유심 ICCID를 등록해 주세요',
  'mysim:accNo': 'Account No',
  'mysim:name': '공급자 이름',
  'mysim:mccmnc': 'MCC/MNC',
  'mysim:operator': '네트워크 사업자 이름',
  'mysim:permCamera': '카메라 권한을 허가해 주세요',

  'acc:title': '내 계정',
  'acc:subTitle': '구매 및 사용 이력',
  'acc:accountId': 'Account No',
  'acc:mobile': '휴대전화 번호',
  'acc:expDate': '만료일',
  'acc:actDate': '시작일',
  'acc:balance': '로깨비캐시',
  'acc:remain': '로깨비캐시 잔액',
  'acc:mysim': '유심 정보',
  'acc:recharge': '충전',
  'acc:purchaseHistory': '구매 내역',
  'acc:usageHistory': '사용 내역',
  'acc:rechargeHistory': '충전/차감 내역',
  'acc:chat': '채팅 상담 (24/7)',
  'acc:notfound': '등록되지 않은 ICCID 입니다.',
  'acc:changeEmail': '이메일 변경',
  'acc:permPhoto': '사진 앨범 권한을 허가해 주세요',
  'acc:permCamera': '카메라 권한을 허가해 주세요',
  'acc:duplicatedEmail': '이미 등록된 이메일 입니다',
  'acc:disconnectSim':
    '사용 중인 유심이 새로운 계정에서 등록되어 기존 계정과 연결이 해제되었습니다.',

  // "set:info" : "유심 정보",
  'set:noti': '알림',
  'set:notice': '공지 사항',
  'set:contract': '이용 약관',
  'set:privacy': '개인 정보 처리 방침',
  'set:version': '버전 정보',
  'set:aboutus': 'About Us',
  'set:logout': '로그아웃',
  'set:login': '로그인',
  'set:fail': '시스템 연동에 실패했습니다. 나중에 다시 이용해 주세요',
  'set:confirmLogout': '로그아웃 하시겠습니까?',
  'set:sendAlimTalk': '알림톡이 발송되었습니다',
  'set:failedToSendAlimTalk':
    '알림톡 발송에 실패했습니다. 나중에 다시 시도해 주세요',
  'set:pushnoti': 'Push 알림 받기',

  'rch:recharge': '충전 하기',

  'sim:purchase': '유심 구매',
  'sim:reg': '유심 등록',
  'sim:price': '가격',
  // "sim:rechargeAmt" : "충전 금액",
  'sim:cardPrice': '카드 가격',
  'sim:deductFromBalance': '충전 금액 차감',
  'sim:remainingBalance': '로깨비캐시',
  'sim:rechargeBalance': '로깨비캐시',

  'mobile:header': '로그인',
  'mobile:title': '휴대폰 간편 인증 로그인',
  'mobile:input': '- 없이 숫자만 입력',
  'mobile:auth': '인증번호 입력',
  'mobile:sendAuth': '인증번호 전송',
  'mobile:resendAuth': '재전송',
  'mobile:authMatch': '인증번호가 확인되었습니다',
  'mobile:authMismatch': '잘못된 인증번호 입니다',
  'mobile:timeout': '인증번호가 만료되었습니다. 다시 시도해주세요.',
  'mobile:inputInTime': '* 3분 이내로 인증번호(6자리)를 입력해주세요.',

  'email:input': '직접 입력',

  'cfm:contract': '이용 약관 동의',
  'cfm:mandatory': ' (필수)',
  'cfm:personalInfo': '개인정보 수집목적 및 이용동의',
  'cfm:marketing': '맞춤안내 및 마케팅 정보 수신동의',
  'cfm:optional': ' (선택)',
  'cfm:accept': '동의',

  'purchase:address': '배송 주소',
  'purchase:addrName': '주소 별칭',
  'purchase:recipient': '받는 사람',
  'purchase:noAddr': '등록된 주소 없음',
  'purchase:findAddr': '도로명, 지번, 건물명을 입력하세요',
  'purchase:searchEx': '빠른 검색 방법',
  'purchase:roadBuildingNo': '도로명 + 건물번호',
  'purchase:areaBunji': '지역명 + 번지',
  'purchase:areaBuilding': '지역명 + 건물명',
  'purchase:zip': '우편 번호',
  'purchase:noAddrName': '^받는 사람을 입력하세요',
  'purchase:invalidAddrName': '^받는 사람을 2자 이상 입력하세요',
  'purchase:delAddr': '배송 주소를 삭제합니다',
  'purchase:failedToDelete': '삭제 실패',
  'purchase:failedToSave': '저장 실패',
  'purchase:finished': '상품이 모두 구매되었습니다',
  'purchase:failed': '상품 구매 실패하였습니다',

  'addr:road': '도로명',
  'addr:jibun': '지번',
  'addr:details': '상세 주소',
  'addr:totalCnt': '총 %% 건',
  'addr:search': '주소검색',
  'addr:addrAlias': '배송지명',
  'addr:recipient': '받는사람',
  'addr:recipientNumber': '연락처',
  'addr:address': '배송지',
  'addr:selectBasicAddr': '기본배송지로 선택',
  'addr:basicAddr': '기본배송지',
  'addr:enterWithin50': '50자 이내로 입력하세요',
  'addr:noAlias': '^배송지명을 입력하세요',
  'addr:noTelephone': '^연락처를 입력하세요',
  'addr:noRecipient': '^받는 사람을 입력하세요',
  'addr:noAddress': '^배송지 주소를 검색하세요',
  'addr:noDetails': '^상세 주소를 입력하세요',
  'addr:noHyphen': '"-" 없이 입력하세요',
  'addr:invalidAlias': '^배송지명을 2자 이상 입력하세요',
  'addr:invalidTelephone': '^연락처를 정확히 입력하세요',
  'addr:invalidRecipient': '^받는 사람을 2자 이상 입력하세요',
  'addr:invalidAddress': '^배송지 주소를 먼저 검색하세요',
  'addr:invalidDetails': '^상세 주소를 정확히 입력하세요',
  'addr:noProfile': '저장된 배송주소가 없습니다.',
  'addr:mandatory': '*',

  'his:detail': '상세 내역',
  'his:etcCnt': '외 %% 건',
  'his:purchaseDate': '구매 시각',
  'his:activationDate': '서비스 시작일',
  'his:termDate': '서비스 종료일',
  'his:expireDate': '사용 기한 종료일',
  'his:purchaseId': '주문 번호',
  'his:pymAmount': '결제 금액',
  'his:productAmount': '상품 금액',
  'his:purchaseList': '구매 품목',
  'his:noPurchase': '구매 내역이 없습니다',
  'his:noUsage': '사용 내역이 없습니다',
  'his:orderId': '주문 번호',
  'his:inactive': '미사용',
  'his:active': '사용 중',
  'his:used': '사용 완료',
  'his:expired': '사용 기한 종료',
  'his:reserved': '사용 대기중',
  'his:canceled': '취소 완료',
  'his:timeStd': '한국 시각 기준',

  'his:cancel': '결제취소',
  'his:paymentDetail': '결제 상세',
  'his:shipmentInfo': '배송 정보',
  'his:shipmentState': '배송 상태',
  'his:memo': '배송 메모',
  'his:input': '직접 입력',
  'his:notSelected': '선택 안함',
  'his:paymentCompleted': '결제 완료',
  'his:ready': '상품 준비중',
  'his:shipped': '출고 완료',
  'his:addressInfo': '배송지 정보',
  'his:companyInfo': '배송업체 정보',
  'his:trackingCompany': '택배사',
  'his:tel': '대표번호',
  'his:trackingCode': '송장번호',
  'his:cancelAlert': '결제를 취소하시겠습니까?',
  'his:cancelSuccess': '결제 취소 처리가 완료되었습니다.',
  'his:cancelFail': '결제 취소 요청이 실패했습니다.',
  'his:alreadyCanceled': '이미 취소된 상품입니다.',
  'his:refresh': '새로 고침 해주세요.',
  'his:deliveryProgress': '배송이 진행중입니다.',
  'his:cancelError': '결제 취소 중 오류가 발생했습니다.',
  'his:afterCancelInfo':
    '• 결제 수단에 따라 취소 요청 후 환불까지 평일 기준 3~7일이 소요됩니다.',
  'his:simCancelInfo':
    '• 상품 준비가 시작되면 결제 취소할 수 없습니다.\n• 유심 수령 후 반품 및 환불 요청은 1:1문의를 이용해주세요.',
  'his:usedOrExpiredInfo':
    '• 상품이 사용처리되었거나, \n   결제 취소 가능 기한이 만료되었습니다.',
  'his:dataCancelInfo':
    '• 결제건에 포함된 상품 모두 미사용 상태일 시, \n   결제 후 7일간 취소할 수 있습니다.',

  'contact:title': '고객센터',
  'contact:notice': '공지사항',
  'contact:noticeDetail': '공지사항 상세',
  'contact:faq': '자주하는 질문',
  'contact:board': '1:1 문의',
  'contact:ktalk': '1:1 카카오톡 상담',
  'contact:call': '고객 센터 전화 연결',

  'faq:general': '사용방법',
  'faq:config': '설정',
  'faq:payment': '결제',
  'faq:etc': '기타',

  'board:title': '1:1 문의',
  'board:new': '문의 하기',
  'board:open': '접수중',
  'board:closed': '답변 완료',
  'board:processing': '처리중',
  'board:noName': '이름을 입력하세요',
  'board:noMobile': '휴대폰 번호를 입력하세요',
  'board:noEmail': '이메일 주소를 입력하세요',
  'board:noTitle': '^제목을 입력하세요',
  'board:noMsg': '^내용을 입력하세요',
  'board:save': '문의 사항이 등록 되었습니다',
  'board:agree': '수신 동의',
  'board:resp': '답변',
  'board:contact': '연락처',
  'board:attach': '사진 첨부',
  'board:noti':
    '- 문의하신 내용의 답변 등록 시 로깨비앱 알림과 가입하신 E-Mail 주소를 통해 알려 드립니다.',
  'board:pass': '비밀 번호',
  'board:inputPass': '비밀 번호를 입력하세요',
  'board:list': '문의 내역',
  'board:mylist': '내 문의 내역',
  'board:nolist': '문의 내역이 없습니다',
  'board:pinMismatch': '비밀 번호가 일치하지 않습니다',
  'board:loading': '문의내역을 불러오고 있습니다.',
  'board:Closed': '답변 완료',
  'board:Open': '답변 대기',

  'cart:totalCnt': '총 상품 수',
  'cart:totalPrice': '상품 금액 합계',
  'cart:deductBalance': '로깨비캐시 차감',
  'cart:currentBalance': '현재 로깨비캐시',
  'cart:afterDeductBalance': '남은 로깨비캐시',
  'cart:dlvCost': '배송비',
  'cart:totalCost': '총 결제 금액',
  'cart:totalCntX': '총 %% 개',
  'cart:dlvCostNotice': '* 3만원 이상 구매시 배송료 무료',
  'cart:toCart': '카트에 넣기',
  'cart:buy': '바로 구매',
  'cart:pymAmount': '결제 금액',
  'cart:purchase': '구매하기',
  'cart:empty': '카트가 비어있습니다.',
  'cart:remove': '판매 중지된 상품이 목록에서 삭제되었습니다.',
  'cart:soldOut': '재고가 모두 소진되어 \n현재 구매할 수 없습니다.',
  'cart:notToCart': '재고가 모두 소진되어 \n카트에 담을 수 없습니다.',
  'cart:systemError':
    '시스템 사정으로 서비스가 원활하지 않습니다. \n잠시 후 다시 시도 하십시요.',

  'usim:toRokebiCash': '전환금액',
  'usim:balance': '로깨비캐시',
  'usim:remainAmount': '잔여량',
  'usim:usageAmount': '사용량',
  'usim:remainData': '잔여 데이터',
  'usim:dataUsageList': '데이터 사용 내역',
  'usim:esimList': 'eSIM 구매 내역',
  'usim:remain': '남음',
  'usim:used': '사용',
  'usim:usablePeriod': '사용기간',
  'usim:warning': '※ 실 사용량과 정확히 일치하지 않을 수 있습니다.',
  'usim:checkUsage': '사용량 확인',
  'usim:failSnackBar':
    '일시적으로 사용량을 조회할 수 없습니다. 잠시 후 다시 시도해주세요.',
  'usim:usingTime': '서비스 이용 시간',

  'usim:until': '까지',

  'esim:usablePeriod': '사용기한',
  'esim:expired': '기한만료',
  'esim:notice': '통화 상품은 로깨비톡 앱에서 사용할 수 있습니다.',
  'esim:showQR': 'QR 코드 보기',
  'esim:manualInput': '수동 입력 정보',
  'esim:showQR:title': 'QR 코드 보기',
  'esim:showQR:nothing': 'QR 코드가 없습니다.',
  'esim:showQR:frontBody': '설정>셀룰러>셀룰러요금제 추가',
  'esim:showQR:endBody': '에서 화면에 다음 QR코드를 캡쳐하여 비춰주세요.',
  'esim:smdp': 'SM-DP+ 주소',
  'esim:actCode': '활성화 코드',
  'esim:manualInput:title': 'eSIM 정보 수동 입력',
  'esim:manualInput:bodyPart1': '설정>셀룰러>셀룰러요금제 추가',
  'esim:manualInput:bodyPart2': '에서 ',
  'esim:manualInput:bodyPart3': '세부사항 직접 입력',
  'esim:manualInput:bodyPart4': '을 선택하여 다음 내용을 붙여넣기 해 주세요',

  'pym:esimInfo':
    '* eSIM 상품은 결제와 동시에 상품이 이메일과 앱으로 고객님께 전송되는 관계로 결제 취소가 불가하오니, 유의하시기 바랍니다.',
  'pym:title': '결제 정보',
  'pym:delivery': '배송 정보',
  'pym:deliveryMemo': '배송 메모',
  'pym:method': '결제 방법',
  'pym:ccard': '신용카드',
  'pym:bank': '계좌이체',
  'pym:mobile': '휴대폰결제',
  // "pym:toss": "토스",
  // "pym:syrup": "시럽",
  'pym:kakao': '카카오페이',
  'pym:naver': '네이버페이',
  'pym:payco': '페이코',
  'pym:samsung': '삼성페이',
  'pym:ssgpay': 'SSG페이',
  'pym:lpay': 'L.Pay',
  'pym:balPurchase': '로깨비캐시에서 결제됩니다.\n구매하시겠습니까?',
  'pym:balance': '로깨비캐시',
  'pym:success': '결제가 완료되었습니다.',
  'pym:fail': '결제에 실패하였습니다',
  'pym:toOrderList': '구매내역 보기',
  'pym:toHome': '홈으로 이동',
  'pym:selectMemo': '배송 메모를 선택해 주세요.',
  'pym:IputMemo': '배송 메모를 입력하세요.',
  'pym:notSelected': '선택 안함',
  'pym:tel': '연락 바랍니다.',
  'pym:toTel': '부재시 휴대폰으로 연락주세요.',
  'pym:frontDoor': '집 앞',
  'pym:atFrontDoor': '집 앞에 놓아주세요.',
  'pym:deliveryBox': '택배함',
  'pym:toDeliveryBox': '택배함에 넣어주세요.',
  'pym:security': '경비실',
  'pym:toSecurity': '경비실에 맡겨주세요.',
  'pym:input': '직접 입력',
  'pym:tossInfo': "* 토스 결제는'신용카드'메뉴 내에서 이용할 수 있습니다.",
  'pym:kakaoInfo': '카카오페이 결제 혜택',
  'pym:kakaoInfoContent':
    '- 생애 첫 결제시 5천원 적립(4월 1일 ~ 4월 30일, 기간 내 1회)\n- 카카오페이는 앱 최신버전에서 가능합니다. 업데이트해주세요.',
  'pym:consentEssential': '결제 진행 필수사항 동의',
  'pym:privacy': '개인정보 수집 및 이용',
  'pym:paymentAgency': '결제대행 서비스 이용약관',
  'pym:mandatory': ' (필수)',
  'pym:detail': '자세히 보기',
  'pym:systemError': '시스템 사정으로 결제에 실패하였습니다.',

  'err:login': '로그인 후 이용해 주세요',
  'err:body': '본문이 없습니다',

  'guide:title': '사용 가이드',
  'guide:buy':
    '먼저 로깨비 유심을 구매해 주세요.\n다양한 채널로 구매 가능합니다.',
  'guide:tip': 'Special 꿀팁',
  'guide:detail': '더 자세히 알고 싶다면?',

  'noti:empty': '알림이 없습니다',

  'search:list': '최근 검색',
  'search:err': '최근 검색이 없습니다',
  'search:recommend': '인기 국가',

  'codepush:title': '새로운 업데이트가 존재합니다.',
  'codepush:body': '지금 업데이트하시겠습니까?',
  'codepush:continue': '계속',
  'codepush:mandatory': '업데이트를 설치해야 사용할 수 있습니다.',
  'codepush:later': '나중에',
  'codepush:update': '업데이트',
  'codepush:checking': '업데이트 확인 중',
  'codepush:download': '패키지 다운로드 중',
  'codepush:awaiting': '사용자 작업 대기 중',
  'codepush:install': '업데이트 설치 중',
  'codepush:uptodate': '현재 최신 버전입니다',
  'codepush:ignore': '업데이트가 취소되었습니다',
  'codepush:nextresume':
    '업데이트 완료했습니다. 최신 버전으로 사용하려면 앱을 재기동해주세요.',
  'codepush:error': '알 수 없는 에러가 발생했습니다',
  'codepush:failedToUpdate': '업데이트 과정에 오류가 발생했습니다.',

  'tutorial:skip': '건너뛰기',
  'tutorial:next': '다음',
  'tutorial:close': '완료',

  'util:storeDataFailed': '데이터 저장 실패:',
  'util:retrieveDataFailed': '데이터 조회 실패:',
  'util:removeDataFailed': '데이터 삭제 실패:',

  'appCenter:cart': '카트에 담기 클릭',
  'appCenter:purchase': '바로구매 클릭',

  'prodDetail:ProdInfo': '상품정보',
  'prodDetail:Caution': '주의사항',
  'prodDetail:Tip': '사용팁',
  'prodDetail:Ask with KakaoTalk': '물어보기',
  'prodDetail:Rokebi': '로밍도깨비',
  'prodDetail:On': '에',
  'prodDetail:Question': '궁금하신점이 있으신가요?',
  'prodDetail:KakaoPlus': '카카오톡 플러스 친구로\n 편하게 물어보세요!',
  'set:failedOpenKakao':
    '카카오 상담 연결에 실패했습니다.\n 잠시 후 다시 시도해주세요.',

  'loading:error': '로딩 불가',
  'loading:terminate': '로딩 중 오류가 발생하여 앱을 종료합니다.',
  'loading:failedToExec': '로딩 중 오류가 발생하여 앱을 실행할 수 없습니다.',

  'toast:failedToUpdate':
    '설정 변경에 실패했습니다.\n네트워크 연결 상태를 확인해주세요.',
  'toast:failedToLoad':
    '데이터 로딩에 실패했습니다.\n네트워크 연결 상태를 확인해주세요.',
  'toast:failedToOpen': '카카오톡 채널에 연결할 수 없습니다.',
  'toast:copySuccess': '복사되었습니다.',

  'mypage:idCheckTitle': '로깨비톡 ID 확인',
  'mypage:manualInput:body':
    '아래의 정보를 사용하여 로깨비톡에 로그인할 수 있습니다',
  'mypage:iccid': 'ICCID',
  'mypage:activationCode': 'Activation Code',
  'mypage:openRokebiTalk': '로깨비톡 바로가기 ＞',
  'mypage:preparing': '서비스 준비중',
  'mypage:mailInfo': '구매하신 eSIM 상품이 본 이메일로 발송됩니다.',
};

if (Array.isArray(locales)) {
  i18n.locale = locales[0].languageTag;
  i18n.lang = i18n.locale.substr(0, 2);
}

i18n.fallbacks = true;
i18n.translations = {ko, en};
export default i18n;
