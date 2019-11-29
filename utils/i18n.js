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
  'won': 'WON',
  'recharge': 'Recharge',
  'day': 'Day',
  'lowest': 'Best',
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
  'appTitle': '이심전심',
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
  'store:multi' : 'Multiple countries',
  'store:europe' : "Europe",

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
  'reg:guide' : 'Please register SIM Card',
  'reg:address': "Register Address",
  'reg:authNoti': 'Auth code sent',
  'reg:scan': 'Scan card',
  'reg:confirm': 'Confirm',
  'reg:failedToSendSms': 'Failed to send sms',

  'menu:purchase' : 'Purchase',
  'menu:card' : 'Register',

  'mysim:title': 'Please, Register MySIM ICCID',
  'mysim:accNo': 'Account No',
  'mysim:name': 'Provider',
  'mysim:mccmnc': 'MCC/MNC',
  'mysim:operator': 'Network Operator',

  'acc:title': 'My Page',
  'acc:subTitle': 'Purchase & Recharge History',
  'acc:accountId': 'Account No',
  'acc:mobile': 'Mobile No',
  'acc:expDate': 'Expiration Date',
  'acc:actDate': 'Activation Date',
  'acc:balance': 'Balance',
  'acc:mysim': 'My SIM Info',
  'acc:recharge': 'Recharge',
  'acc:purchaseHistory': 'Purchase History',
  'acc:usageHistory': 'Usage History',
  'acc:rechargeHistory': 'Recharge History',
  'acc:chat': 'Online Chat (24/7)',
  'acc:notfound': 'ICCID is not found',
  'acc:changeEmail': 'Input new email',

  "set:info" : "My SIM Info",
  "set:noti" : "Noti",
  "set:notice" : "Notice",
  "set:contract" : "User Guide",
  "set:privacy" : "Privacy",
  "set:version" : "Version",
  "set:aboutus" : "About Us",
  "set:logout" : "Log Out",
  "set:fail" : "Failed to connect to the server. Please try again later",
  "set:confirmLogout": "Please, confirm logout",

  "rch:recharge" : "Recharge",

  "sim:purchase" : "Purchase SIM",
  "sim:reg" : "Register SIM",
  "sim:price" : "Price",
  "sim:rechargeAmt" : "Recharge Amount",
  "sim:cardPrice" : "SIM Price",
  "sim:deductFromBalance" : "Deduct from the Balance",
  "sim:remainingBalance" : "Remaining Balance",
  
  "mobile:header": "Login",
  "mobile:title": "Simple Login",
  "mobile:input": "Input only numbers",
  "mobile:auth": "Input auth code",
  "mobile:sendAuth": "Send auth code",
  "mobile:resendAuth": "Resend auth code",
  "mobile:authMatch": "Auth code matches",
  "mobile:authMismatch": "Auth code mismatches",

  "email:input": "Input",

  "cfm:contract": "Confirm contract terms",
  "cfm:mandatory": "(Mandatory)",
  "cfm:personalInfo": "Cofirm collecting personal info",
  "cfm:marketing": "Confirm marketing (Optional)",

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

  "his:detail" : "Details >",
  "his:etcCnt" : "%% case",
  "his:purchaseDate" : "Purchase Date",
  "his:purchaseId" : "Purchase ID",
  "his:pymAmount" : "Payment Amount",
  "his:purchaseList" : "List",
  "his:noPurchase" : "No purchase list",
  "his:orderId" : "Order No.",

  "contact:title" : "Customer Center",
  "contact:notice" : "Notice",
  "contact:faq" : "FAQ",
  "contact:board" : "1:1 Contact Board",
  "contact:ktalk" : "1:1 Kakao Talk",
  "contact:call" : "Direct call to call center",

  "faq:general": "General",
  "faq:payment": "Payment",
  "faq:lost": "Lost",
  "faq:refund": "Refund",

  "board:title" : "1:1 Contact Board",
  "board:new" : "New Case",
  "board:list" : "List",
  "board:open" : "Open",
  "board:closed" : "Closed",
  "board:processing" : "Handling",
  "board:noName" : "^Input name",
  "board:noMobile" : "Input Mobile number",
  "board:noEmail" : "Input email address",
  "board:noTitle" : "^Input title",
  "board:noMsg" : "^Input content",
  "board:save" : "Issue registered",
  "board:agree" : "Agree",
  "board:resp" : "Response",
  "board:contact" : "Contact",
  "board:noti" : "- Input notice",

  "cart:totalCnt" : "Total count",
  "cart:totalPrice" : "Total price",
  "cart:dlvCost" : "Delivery cost",
  "cart:totalCost" : "Total payment",
  "cart:totalCntX" : "Total %% pieces",
  "cart:dlvCostNotice" : "Free Delivery condition",
  "cart:purchase" : "Purchase",

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

  "err:login" : "Please login first"
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
  'lowest': '최저',
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
  'appTitle': '로밍 도깨비',
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

  'home:guide': '사용가이드',
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
  'reg:guide' : '카드 구매 후 등록해 주세요',
  'reg:address': '주소 등록하기',
  'reg:authNoti': '인증 번호를 보냈습니다',
  'reg:scan': '카드 스캔',
  'reg:confirm': '등록',
  'reg:failedToSendSms': 'SMS 인증번호 발송 실패',

  'menu:purchase' : '카드 구매',
  'menu:card' : '카드 등록',

  'mysim:title': '도깨비 유심 ICCID를 등록해 주세요',
  'mysim:accNo': 'Account No',
  'mysim:name': '공급자 이름',
  'mysim:mccmnc': 'MCC/MNC',
  'mysim:operator': '네트워크 사업자 이름',

  'acc:title': '마이 페이지',
  'acc:subTitle': '구매 및 사용 이력',
  'acc:accountId': 'Account No',
  'acc:mobile': '휴대전화 번호',
  'acc:expDate': '만료일',
  'acc:actDate': '시작일',
  'acc:balance': '잔액',
  'acc:mysim': '내 SIM 정보',
  'acc:recharge': '충전',
  'acc:purchaseHistory': '구매 내역',
  'acc:usageHistory': '사용 내역',
  'acc:rechargeHistory': '충전/차감 내역',
  'acc:chat': '채팅 상담 (24/7)',
  'acc:notfound': '등록되지 않은 ICCID 입니다.',
  'acc:changeEmail': '이메일 변경',

  "set:info" : "내 SIM 정보",
  "set:noti" : "알림",
  "set:notice" : "공지 사항",
  "set:contract" : "이용 안내",
  "set:privacy" : "개인 정보 처리 방침",
  "set:version" : "버전 정보",
  "set:aboutus" : "About Us",
  "set:logout" : "로그 아웃",
  "set:fail" : "시스템 연동에 실패했습니다. 나중에 다시 이용해 주세요",
  "set:confirmLogout": "로그아웃 하시겠습니까?",

  "rch:recharge" : "충전 하기",

  "sim:purchase" : "카드 구매",
  "sim:reg" : "카드 등록",
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

  "email:input": "직접 입력",

  "cfm:contract": "이용 약관 동의",
  "cfm:mandatory": " (필수)",
  "cfm:personalInfo": "개인정보 수집목적 및 이용동의",
  "cfm:marketing": "맞춤안내 및 마케팅 정보 수신동의 (선택)",

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

  "his:detail" : "상세 내역",
  "his:etcCnt" : "외 %% 건",
  "his:purchaseDate" : "구매 시각",
  "his:purchaseId" : "주문 번호",
  "his:pymAmount" : "결제 금액",
  "his:purchaseList" : "구매 품목",
  "his:noPurchase" : "구매 내역이 없습니다",
  "his:orderId" : "주문 번호",

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
  "board:list" : "문의 내역 확인",
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
  "board:noti" : "- 문의내역 확인 시 작성한 연락처 정보 입력이 필요합니다.\n- 문의한 내용의 답변유무를 알림 혹은 카카오톡 알림톡으로 발송해 드립니다.",

  "cart:totalCnt" : "총 상품 수",
  "cart:totalPrice" : "총 상품 금액",
  "cart:dlvCost" : "배송비",
  "cart:totalCost" : "총 결제 금액",
  "cart:totalCntX" : "총 %% 개",
  "cart:dlvCostNotice" : "* 3만원 이상 구매시 배송료 무료",
  "cart:toCart" : "카트에 넣기",
  "cart:buy" : "바로 구매",
  "cart:purchase" : "구매하기",

  "pym:title": "결제 정보",
  "pym:delivery": "주문 및 배송정보",
  "pym:method": "결제 방법",
  "pym:naver": "네이버 페이",
  "pym:ccard": "신용 카드",
  "pym:mobile": "휴대폰 결제",
  "pym:toss": "토스",
  "pym:kakao": "카카오 페이",
  "pym:payco": "페이코",
  "pym:syrup": "시럽",

  "err:login" : "로그인 후 이용해 주세요"
};

i18n.fallbacks = true;
i18n.translations = { ko, en };
i18n.locale = Localization.locale || 'ko_KR';
i18n.lang = i18n.locale.substr(0,2);

export default i18n;