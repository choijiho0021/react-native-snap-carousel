import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

const en = {
  'select': 'Select',
  'store': 'Store',
  'home': 'Home',
  'setting': 'Setting',
  'product': 'Roaming Product',
  'sim': 'SIM Card',
  'setDate': 'Set Date',
  'none': 'None',
  'error': 'Error',
  'settings': 'Settings',
  'won': '₩',
  'recharge': 'Recharge',
  'day': 'Day',
  'scanned': 'Scanned : ',
  'cart': 'Cart',
  'purchase': 'Purchase',
  'total': 'Total',
  'package': 'Package',
  'add': 'Add More',
  'signup': 'Sign Up',
  'reg': 'Registration',
  'pym': 'Payment History',
  'newSim': 'Purchase New SIM',
  'qty': 'Unit',
  'sum': 'Sum',
  'payment': 'Payment',
  'appTitle': 'Rokebi',
  'ok': 'OK',
  'loggingIn': 'Trying to login...',
  'cancel': 'Cancel',
  'mypage': 'My Page',
  'change' : 'Change',
  'delete' : 'Delete',
  'modify' : 'Modify',
  'save' : 'Save',
  'notice' : 'Notice',
  'name' : 'Name',
  'title' : 'Title',
  'content' : 'Content',
  'from' : 'from',
  'price': 'price',
  'noti' : 'Notification',
  'done' : 'Done',
  'lowest' : 'lowest',
  'min' : 'min',
  'sec' : 'sec',
  'now' : 'now',
  'latest' : 'latest',

  'home:guide': 'User Guide',
  'home:checkGuide': 'Check',

  'store:dest': 'Destination',
  'store:partnerName': 'Local Operator',
  'store:network': 'Network', 
  'store:apn' : 'APN Setting', 
  'store:name' : 'Selected Product',
  'store:startDate' : 'Start Date',
  'store:search' : '여행국가를 입력하세요',
  'store:asia' : 'Asia',
  'store:middle' : 'Middle East',
  'store:america' : 'America',
  'store:africa' : 'Africa',
  'store:multi' : 'Multi',
  'store:europe' : "EU",
  'store:usa/au' : "US/AU",

  'country:detail' : "Detail",
  'country:empty' : "There is no search result",

  'view:detail' : 'Detail Info',

  'reg:actCode' : 'Activation Code',
  'reg:inputActCode' : 'Input Activation Code.',
  'reg:email' : 'E-mail',
  'reg:cntry' : 'Country',
  'reg:mobile' : 'Mobile',
  'reg:noEmail' : '^Please input email',
  'reg:invalidEmail' : '^Invalid e-mail format',
  'reg:noActCode' : '^Please input Activation Code',
  'reg:noMobile' : '^Please input mobile number',
  'reg:invalidMobile' : '^Please input 11 digits',
  'reg:invalidActCode' : '^Please input 4 digits',
  'reg:wrongActCode' : 'Activation code does not match',
  'reg:success' : 'Your SIM is registered',
  'reg:fail' : 'Failed to register SIM',
  'reg:guide' : 'Please, purchase and register SIM Card',
  'reg:card' : 'Please register SIM Card',
  'reg:noPerm' : 'No permission to camera',
  'reg:address': "Register Address",
  'reg:authNoti': 'Auth code sent',
  'reg:scan': 'Scan card',
  'reg:scanOff': 'Scan off',
  'reg:confirm': 'Confirm',
  'reg:ReserveToUse': 'Reserve to use',
  'reg:RegisterToUse': 'Register to use',
  'reg:CancelReservation': 'Cancel Reservation',
  'reg:failedToSendSms': 'Failed to send sms',
  'reg:failedToLogIn': 'Failed to sign in. Please try again.',

  'menu:purchase' : 'Purchase',
  'menu:card' : 'Register',
  'menu:change' : 'Change',

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

  "set:info" : "My SIM Info",
  "set:noti" : "Noti",
  "set:notice" : "Notice",
  "set:contract" : "User Guide",
  "set:privacy" : "Privacy",
  "set:version" : "Version",
  "set:aboutus" : "About Us",
  "set:logout" : "Log Out",
  "set:login" : "Log In",
  "set:fail" : "Failed to connect to the server. Please try again later",
  "set:confirmLogout": "Please, confirm logout",
  "set:sendAlimTalk" : "The KakaoTalk message has been sent",
  "set:failedToSendAlimTalk" : "Failed to send a KakaoTalk message. Please try again later",
  "reg:activateProduct": "current data product is completed and this product will be activated.\nPress the 'OK' button and call 0000# to activate it.",

  "rch:recharge" : "Recharge",

  "sim:purchase" : "Purchase SIM",
  "sim:reg" : "Register SIM",
  "sim:price" : "Price",
  "sim:rechargeAmt" : "Recharge Amount",
  "sim:cardPrice" : "SIM Price",
  "sim:deductFromBalance" : "Deduct from the Balance",
  "sim:remainingBalance" : "Balance",
  
  "mobile:header": "Login",
  "mobile:title": "Simple Login",
  "mobile:input": "Input only numbers",
  "mobile:auth": "Input auth code",
  "mobile:sendAuth": "Send code",
  "mobile:resendAuth": "Resend",
  "mobile:authMatch": "Auth code matches",
  "mobile:authMismatch": "Auth code mismatches",
  "mobile:timeout": "Auth code has expired. Please try again.",
  "mobile:inputInTime": "* Please enter the auth code within 3 minutes",

  "email:input": "Input",

  "cfm:contract": "Confirm contract terms",
  "cfm:mandatory": "(Mandatory)",
  "cfm:personalInfo": "Cofirm collecting personal info",
  "cfm:marketing": "Confirm marketing",
  "cfm:optional": "(Optional)",
  "cfm:accept": "Accept",

  "purchase:address" : "Delivery Address",
  "purchase:addrName" : "Alias",
  "purchase:recipient" : "Recipient",
  "purchase:noAddr" : "No Registered Address",
  "purchase:findAddr" : "Find",
  "purchase:zip" : "ZIP",
  'purchase:noAddrName' : '^Input the recipient',
  'purchase:delAddr' : 'Confirm to delete delivery address',
  'purchase:failedToDelete' : 'Failed to delete',
  'purchase:failedToSave' : 'Failed to save',
  'purchase:finished' : 'Purchased successfully',
  'purchase:failed' : 'Purchase failed',

  "addr:road" : "Road",
  "addr:jibun" : "Jibun",
  "addr:details" : "Detail",
  "addr:totalCnt" : "Total %%",
  "addr:search" : "Search",
  'addr:addrAlias' : 'Alias',
  'addr:recipient' : 'Recipient',
  'addr:recipientNumber' : 'Phone Number',
  'addr:address' : 'Address',
  'addr:selectBasicAddr' : 'Select as Default Address',
  'addr:basicAddr' : 'Default Address',
  'addr:enterWithin50' : 'Input the value within 50',
  'addr:noAlias' : 'Input the alias',
  'addr:noTelephone' : 'Input the telephone number',
  'addr:noRecipient' : 'Input the recipient',
  'addr:noAddress' : 'Click and search the address',
  'addr:noDetails' : 'Input the details of address',
  'addr:noHyphen' : 'Input without hyphen',
  'addr:invalidAlias' : 'Input the value at least 2 characters',
  'addr:invalidTelephone' : 'Input the number correctly',
  'addr:invalidRecipient' : 'Input the value at least 2 characters',
  'addr:invalidAddress' : 'Search the address',
  'addr:invalidDetails' : 'Input the details of address correctly',  
  'addr:noProfile' : '^No Address to select',

  "his:detail" : "Details >",
  "his:etcCnt" : "%% case",
  "his:purchaseDate" : "Purchase Date",
  "his:activationDate" : "Activation Date",
  "his:termDate" : "Termination Date",
  "his:expireDate" : "Expiration Date",
  "his:purchaseId" : "Purchase ID",
  "his:pymAmount" : "Payment Amount",
  "his:productAmount" : "Product Amount",
  "his:purchaseList" : "List",
  "his:noPurchase" : "No purchase list",
  "his:noUsage" : "No usage list",
  "his:orderId" : "Order No.",
  "his:inactive" : "Inactive",
  "his:active" : "Active",
  "his:used" : "Used",
  "his:expired" : "Expired",
  "his:reserved" : "Reserved",
  "his:timeStd" : "Based on KST",

  "contact:title" : "Contact Center",
  "contact:notice" : "Notice",
  "contact:faq" : "FAQ",
  "contact:board" : "Help Center",
  "contact:ktalk" : "Request Support by KakaoTalk",
  "contact:call" : "Direct call to call center",

  "faq:general": "General",
  "faq:payment": "Payment",
  "faq:lost": "Lost",
  "faq:refund": "Refund",

  "board:title" : "Help Center",
  "board:new" : "New Reqeust",
  "board:list" : "My Requests",
  "board:open" : "Open",
  "board:closed" : "Closed",
  "board:processing" : "Handling",
  "board:noName" : "^Input name",
  "board:noMobile" : "Input Mobile number",
  "board:noEmail" : "Input email address",
  "board:noTitle" : "^Input title",
  "board:noMsg" : "^Input content",
  "board:save" : "Request is registered",
  "board:agree" : "Agree",
  "board:resp" : "Response",
  "board:contact" : "Contact",
  "board:attach" : "Attachment",
  "board:noti" : "- The response shall be notified by the Rokebi App or KakaoTalk.\n- To check the response later it is necessary to input the contact number registered.",
  "board:pass" : "PIN",
  "board:inputPass" : "Input PIN",
  "board:mylist" : "My Requests",
  "board:nolist" : "No Requests",
  "board:pinMismatch" : "PIN mismatch",

  "cart:totalCnt" : "Total count",
  "cart:totalPrice" : "Total price",
  "cart:deductBalance" : "Total balance",
  "cart:currentBalance" : "Current balance",
  "cart:afterDeductBalance" : "After Deduct Balance",
  "cart:dlvCost" : "Delivery cost",
  "cart:totalCost" : "Total payment",
  "cart:totalCntX" : "Total %% pieces",
  "cart:dlvCostNotice" : "* Free delivery if the purchase is bigger than 30,000 ₩",
  "cart:toCart" : "To Cart",
  "cart:buy" : "Purchase",
  "cart:pymAmount" : "Payment Amount",
  "cart:purchase" : "Purchase",
  "cart:empty" : "Cart is Empty",

  "pym:title": "Payment Info",
  "pym:delivery": "Shipping Info",
  "pym:method": "Payment Method",
  "pym:naver": "Naver Pay",
  "pym:ccard": "Credit Card",
  "pym:mobile": "Mobile phone",
  "pym:toss": "TOSS",
  "pym:syrup": "Syrup",
  "pym:kakao": "Kakao Pay",
  "pym:payco": "Payco",
  "pym:balPurchase": "Pay with Balance.",
  "pym:balance": "Balance Payment",
  "pym:success": "Payment successful",
  "pym:fail": "Payment failed",

  "err:login" : "Please login first",
  "err:body"  : "There is no body to show",

  "guide:title": "Guide",
  "guide:buy": "Please, purchase Rokebi USIM, firstly.",
  "guide:tip": "Tip",

  "noti:empty" : "There is no notification",

  "search:list" : "Search List",
  "search:err" : "There is no search list",
  "search:recommend" : "recommendation",

  "codepush:title" : "A new update exists",
  "codepush:body" : "Do you want to update now?", 
  "codepush:continue" : "Continue",
  "codepush:mandatory" : "You must install an update to use the app.",
  "codepush:later" : "Later", 
  "codepush:update" : "Update", 
  "codepush:checking" : "Checking for update.", 
  "codepush:download" : "Downloading package.",
  "codepush:awaiting" : "Awaiting user action.",
  "codepush:install" : "Installing update.", 
  "codepush:uptodate" : "App up to date.",
  "codepush:ignore" : "Update cancelled by user.", 
  "codepush:nextresume" : "Update installed and will be run when the app next resumes.",
  "codepush:error" : "An unknown error occurred.",
  "codepush:failedToUpdate" : "Failed to update",

  "tutorial:skip" : "skip",
  "tutorial:next" : "next",
  "tutorial:close" : "close",

  "util:storeDataFailed": "Failed to store data:",
  "util:retrieveDataFailed": "Failed to retrieve data:",
  "util:removeDataFailed": "Failed to remove data:",
};

const ko = {
  'select': '선택',
  'store': '스토어',
  'home': '홈',
  'setting': '설정',
  'product': '로밍 상품',
  'sim': 'SIM 카드',
  'setDate': '날짜 선택',
  'none': '없음',
  'error': '에러',
  'settings': '설정',
  'won': '원',
  'recharge': '충전',
  'day': '일',
  'scanned': '스캔 완료 : ',
  'cart': '카트',
  'purchase': '구매',
  'total': '총',
  'package': '패키지',
  'add': '추가',
  'signup': '가입',
  'pym': '구매 이력',
  'newSim': 'SIM 카드 구매',
  'qty': '개',
  'sum': '합계',
  'payment': '결제',
  'appTitle': '로밍도깨비',
  'ok': '확인',
  'loggingIn': '로그인 시도 중...',
  'cancel': '취소',
  'mypage': '내 계정',
  'change': '변경',
  'delete' : '삭제',
  'modify' : '수정',
  'save' : '저장',
  'notice' : '공지 사항',
  'name' : '이름',
  'title' : '제목',
  'content' : '내용',
  'from' : 'from',
  'price': '가격',
  'noti' : '알림',
  'done' : '완료',
  'lowest': '최저',
  'min' : '분',
  'sec' : '초',
  'now' : '현재',
  'latest' : '최신',

  'home:guide': '로밍도깨비 사용가이드 !',
  'home:checkGuide': '확인하기',

  'store:dest': '목적지',
  'store:partnerName': '로컬 사업자',
  'store:network': '네트워크', 
  'store:apn' : 'APN 설정', 
  'store:name' : '선택한 상품',
  'store:startDate' : '시작 날짜',
  'store:search' : '여행국가를 입력하세요',
  'store:asia' : '아시아',
  'store:middle' : '중동',
  'store:america' : '아메리카',
  'store:africa' : '아프리카',
  'store:multi' : '복수국가',
  'store:europe' : "유럽",
  'store:usa/au' : "미주/호주",

  'country:detail' : "상세보기",
  'country:empty' : "상품검색 결과가 없습니다",

  'view:detail' : '상세보기',

  'reg:actCode' : 'Activation Code',
  'reg:inputActCode' : 'Activation Code를 입력하세요.',
  'reg:email' : '이메일',
  'reg:cntry' : '국가',
  'reg:mobile' : '휴대전화',
  'reg:phone' : '일반전화',
  'reg:noEmail' : '^E-mail 주소를 입력하세요',
  'reg:invalidEmail' : '^E-mail 주소가 아닙니다',
  'reg:noActCode' : '^Activation Code를 입력하세요',
  'reg:noMobile' : '^휴대전화 번호를 입력하세요',
  'reg:invalidMobile' : '^휴대전화 번호 11자리를 입력하세요',
  'reg:invalidActCode' : '^Activation Code 4자리를 입력하세요',
  'reg:wrongActCode' : 'Activation Code가 일치하지 않습니다',
  'reg:success' : '등록이 완료되었습니다',
  'reg:fail' : '시스템 사정으로 등록에 실패했습니다.',
  'reg:guide' : '유심 구매 후 등록해 주세요',
  'reg:card' : '유심을 등록해 주세요',
  'reg:noPerm' : '카메라 접근 권한 부족',
  'reg:address': '주소 등록하기',
  'reg:authNoti': '인증 번호를 보냈습니다',
  'reg:scan': '유심 카드 스캔',
  'reg:scanOff': '스캔 중단',
  'reg:confirm': '등록',
  'reg:ReserveToUse': '사용 예약',
  'reg:RegisterToUse': '사용 등록',
  'reg:CancelReservation': '예약 취소',
  'reg:failedToSendSms': 'SMS 인증번호 발송 실패',
  'reg:failedToLogIn': '로깨비 로그인이 실패하였습니다. 다시 시도해주시기 바랍니다.',
  "reg:activateProduct": "현 사용 중인 데이터 상품 사용이 완료되고 해당 상품이 등록되며,\n확인 버튼 누른 후 0000# 통화버튼을 눌러주시면 활성화 됩니다.",

  'menu:purchase' : '유심 구매',
  'menu:card' : '유심 등록',
  'menu:change' : '유심 변경',

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
  'acc:balance': '잔액',
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

  "set:info" : "유심 정보",
  "set:noti" : "알림",
  "set:notice" : "공지 사항",
  "set:contract" : "이용 안내",
  "set:privacy" : "개인 정보 처리 방침",
  "set:version" : "버전 정보",
  "set:aboutus" : "About Us",
  "set:logout" : "로그 아웃",
  "set:login" : "로그인",
  "set:fail" : "시스템 연동에 실패했습니다. 나중에 다시 이용해 주세요",
  "set:confirmLogout": "로그아웃 하시겠습니까?",
  "set:sendAlimTalk" : "알림톡이 발송되었습니다",
  "set:failedToSendAlimTalk" : "알림톡 발송에 실패했습니다. 나중에 다시 시도해 주세요",

  "rch:recharge" : "충전 하기",

  "sim:purchase" : "유심 구매",
  "sim:reg" : "유심 등록",
  "sim:price" : "가격",
  "sim:rechargeAmt" : "충전 금액",
  "sim:cardPrice" : "카드 가격",
  "sim:deductFromBalance" : "충전 금액 차감",
  "sim:remainingBalance" : "남은 금액",

  "mobile:header": "로그인",
  "mobile:title": "간편 인증 로그인",
  "mobile:input": "- 없이 숫자만 입력",
  "mobile:auth": "인증번호 입력",
  "mobile:sendAuth": "인증번호 전송",
  "mobile:resendAuth": "재전송",
  "mobile:authMatch": "인증번호가 확인되었습니다",
  "mobile:authMismatch": "잘못된 인증번호 입니다",
  "mobile:timeout": "인증번호가 만료되었습니다. 다시 시도해주세요.",
  "mobile:inputInTime": "* 3분 이내로 인증번호(6자리)를 입력해주세요.",

  "email:input": "직접 입력",

  "cfm:contract": "이용 약관 동의",
  "cfm:mandatory": " (필수)",
  "cfm:personalInfo": "개인정보 수집목적 및 이용동의",
  "cfm:marketing": "맞춤안내 및 마케팅 정보 수신동의",
  "cfm:optional": " (선택)",
  "cfm:accept": "동의",

  "purchase:address" : "배송 주소",
  "purchase:addrName" : "주소 별칭",
  "purchase:recipient" : "받는 사람",
  "purchase:noAddr" : "등록된 주소 없음",
  "purchase:findAddr" : "도로명, 지번, 건물명을 입력하세요",
  "purchase:searchEx" : "빠른 검색 방법",
  "purchase:roadBuildingNo" : "도로명 + 건물번호",
  "purchase:areaBunji" : "지역명 + 번지",
  "purchase:areaBuilding" : "지역명 + 건물명",
  "purchase:zip" : "우편 번호",
  'purchase:noAddrName' : '^받는 사람을 입력하세요',
  'purchase:invalidAddrName' : '^받는 사람을 2자 이상 입력하세요',
  'purchase:delAddr' : '배송 주소를 삭제합니다',
  'purchase:failedToDelete' : '삭제 실패',
  'purchase:failedToSave' : '저장 실패',
  'purchase:finished' : '상품이 모두 구매되었습니다',
  'purchase:failed' : '상품 구매 실패하였습니다',
  
  "addr:road" : "도로명",
  "addr:jibun" : "지번",
  "addr:details" : "상세 주소",
  "addr:totalCnt" : "총 %% 건",
  "addr:search" : "주소검색",
  'addr:addrAlias' : '배송지명',
  'addr:recipient' : '받는사람',
  'addr:recipientNumber' : '연락처',
  'addr:address' : '배송지',
  'addr:selectBasicAddr' : '기본배송지로 선택',
  'addr:basicAddr' : '기본배송지',
  'addr:enterWithin50' : '50자 이내로 입력하세요',
  'addr:noAlias' : '^배송지명을 입력하세요',
  'addr:noTelephone' : '^연락처를 입력하세요',
  'addr:noRecipient' : '^받는 사람을 입력하세요',
  'addr:noAddress' : '^배송지 주소를 검색하세요',
  'addr:noDetails' : '^상세 주소를 입력하세요',
  'addr:noHyphen' : '"-" 없이 입력하세요',
  'addr:invalidAlias' : '^배송지명을 2자 이상 입력하세요',
  'addr:invalidTelephone' : '^연락처를 정확히 입력하세요',
  'addr:invalidRecipient' : '^받는 사람을 2자 이상 입력하세요',
  'addr:invalidAddress' : '^배송지 주소를 먼저 검색하세요',
  'addr:invalidDetails' : '^상세 주소를 정확히 입력하세요',
  'addr:noProfile' : '저장된 배송주소가 없습니다.',
  'addr:mandatory': '*',
  

  "his:detail" : "상세 내역",
  "his:etcCnt" : "외 %% 건",
  "his:purchaseDate" : "구매 시각",
  "his:activationDate" : "서비스 시작일",
  "his:termDate" : "서비스 종료일",
  "his:expireDate" : "사용 기한 종료일",
  "his:purchaseId" : "주문 번호",
  "his:pymAmount" : "결제 금액",
  "his:productAmount" : "상품 금액",
  "his:purchaseList" : "구매 품목",
  "his:noPurchase" : "구매 내역이 없습니다",
  "his:noUsage" : "사용 내역이 없습니다",
  "his:orderId" : "주문 번호",
  "his:inactive" : "미사용",
  "his:active" : "사용 중",
  "his:used" : "사용 완료",
  "his:expired" : "사용 기한 종료",
  "his:reserved" : "사용 대기중",
  "his:timeStd" : "한국 시각 기준",

  "contact:title" : "고객 센터",
  "contact:notice" : "공지 사항",
  "contact:faq" : "자주하는 질문",
  "contact:board" : "1:1 게시판 문의",
  "contact:ktalk" : "1:1 카카오톡 상담",
  "contact:call" : "고객 센터 전화 연결",

  "faq:general": "일반/주문",
  "faq:payment": "결제/장애",
  "faq:lost": "분실/취소",
  "faq:refund": "환불/기타",

  "board:title" : "1:1 게시판",
  "board:new" : "문의 하기",
  "board:open" : "접수중",
  "board:closed" : "답변완료",
  "board:processing" : "처리중",
  "board:noName" : "이름을 입력하세요",
  "board:noMobile" : "휴대폰 번호를 입력하세요",
  "board:noEmail" : "이메일 주소를 입력하세요",
  "board:noTitle" : "^제목을 입력하세요",
  "board:noMsg" : "^내용을 입력하세요",
  "board:save" : "문의 사항이 등록 되었습니다",
  "board:agree" : "수신 동의",
  "board:resp" : "답변",
  "board:contact" : "연락처",
  "board:attach" : "사진 첨부",
  "board:noti" : "- 문의한 내용의 답변유무를 알림 혹은 카카오톡 알림톡으로 발송해 드립니다.\n- 문의내역 확인 시 작성한 연락처 정보 입력이 필요합니다.",
  "board:pass" : "비밀 번호",
  "board:inputPass" : "비밀 번호를 입력하세요",
  "board:list" : "문의 내역",
  "board:mylist" : "나의 문의 내역",
  "board:nolist" : "문의 내역이 없습니다",
  "board:pinMismatch" : "비밀 번호가 일치하지 않습니다",

  "cart:totalCnt" : "총 상품 수",
  "cart:totalPrice" : "총 상품 금액",
  "cart:deductBalance" : "차감 잔액",
  "cart:currentBalance" : "현재 잔액",
  "cart:afterDeductBalance" : "결제 후 잔액",
  "cart:dlvCost" : "배송비",
  "cart:totalCost" : "총 결제 금액",
  "cart:totalCntX" : "총 %% 개",
  "cart:dlvCostNotice" : "* 3만원 이상 구매시 배송료 무료",
  "cart:toCart" : "카트에 넣기",
  "cart:buy" : "바로 구매",
  "cart:pymAmount" : "결제 금액",
  "cart:purchase" : "구매하기",
  "cart:empty" : "카트가 비어있습니다.",

  "pym:title": "결제 정보",
  "pym:delivery": "주문 및 배송정보",
  "pym:method": "결제 방법",
  "pym:naver": "네이버 페이",
  "pym:ccard": "신용 카드",
  "pym:mobile": "휴대폰",
  "pym:toss": "토스",
  "pym:kakao": "카카오 페이",
  "pym:payco": "페이코",
  "pym:syrup": "시럽",
  "pym:balPurchase": "잔액에서 결제 됩니다.\n구매 하시겠습니까?",
  "pym:balance": "잔액 차감",
  "pym:success": "결제에 성공하였습니다",
  "pym:fail": "결제에 실패하였습니다",

  "err:login" : "로그인 후 이용해 주세요",
  "err:body"  : "본문이 없습니다",

  "guide:title": "사용 가이드",
  "guide:buy": "먼저 로깨비 유심을 구매해 주세요.\n다양한 채널로 구매 가능합니다.",
  "guide:tip": "Special 꿀팁",

  "noti:empty" : "알림이 없습니다",

  "search:list" : "최근 검색",
  "search:err" : "최근 검색이 없습니다",
  "search:recommend" : "인기 국가",

  "codepush:title" : "새로운 업데이트가 존재합니다.",
  "codepush:body" : "지금 업데이트하시겠습니까?",
  "codepush:continue" : "계속", 
  "codepush:mandatory" : "업데이트를 설치해야 사용할 수 있습니다.", 
  "codepush:later" : "나중에",
  "codepush:update" : "업데이트", 
  "codepush:checking" : "업데이트 확인 중", 
  "codepush:download" : "패키지 다운로드 중",
  "codepush:awaiting" : "사용자 작업 대기 중",
  "codepush:install" : "업데이트 설치 중",
  "codepush:uptodate" : "현재 최신 버전입니다",
  "codepush:ignore" : "업데이트가 취소되었습니다",
  "codepush:nextresume" : "업데이트 완료했습니다. 최신 버전으로 사용하려면 앱을 재기동해주세요.",
  "codepush:error" : "알 수 없는 에러가 발생했습니다",
  "codepush:failedToUpdate" : "업데이트 과정에 오류가 발생했습니다.",

  "tutorial:skip" : "건너뛰기",
  "tutorial:next" : "다음",
  "tutorial:close" : "완료",

  "util:storeDataFailed": "데이터 저장 실패:",
  "util:retrieveDataFailed": "데이터 조회 실패:",
  "util:removeDataFailed": "데이터 삭제 실패:",
};

i18n.fallbacks = true;
i18n.translations = { ko, en };
i18n.locale = Localization.locale || 'ko_KR';
i18n.lang = i18n.locale.substr(0,2);

export default i18n;