import _ from 'underscore';

//동의어 추가 ':'
const countryList = `GH,가나,Ghana,233
GA,가봉,Gabon,241
GY,가이아나,Guyana,592
GM,감비아,Gambia,220
GG,건지섬,Guernsey,44-1481
GP,과들루프,#N/A,
GT,과테말라,Guatemala,502
GU,괌,Guam,1-671
GD,그레나다,Grenada,1-473
GR,그리스,Greece,30
GL,그린란드,Greenland,299
GN,기니,Guinea,224
GW,기니비사우,Guinea-Bissau,245
NA,나미비아,Namibia,264
NR,나우루,Nauru,674
NG,나이지리아,Nigeria,234
AQ,남극,Antarctica,672
SS,남수단,South Sudan,211
ZA,남아프리카 공화국,South Africa,27
NL,네덜란드,Netherlands,31
NP,네팔,Nepal,977
NO,노르웨이,Norway,47
NF,노퍽섬,#N/A,
NC,누벨칼레도니,New Caledonia,687
NZ,뉴질랜드,New Zealand,64
NU,니우에,Niue,683
NE,니제르,Niger,227
NI,니카라과,Nicaragua,505
KR,대한민국:한국,South Korea,82
DK,덴마크,Denmark,45
DO,도미니카 공화국,Dominican Republic,1-809:1-829:1-849
DM,도미니카 연방,Dominica,1-767
TL,동티모르,East Timor,670
DE,독일,Germany,49
LA,라오스,Laos,856
LR,라이베리아,Liberia,231
LV,라트비아,Latvia,371
RU,러시아,Russia,7
LB,레바논,Lebanon,961
LS,레소토,Lesotho,266
RE,레위니옹,Reunion,262
RO,루마니아,Romania,40
LU,룩셈부르크,Luxembourg,352
RW,르완다,Rwanda,250
LY,리비아,Libya,218
LT,리투아니아,Lithuania,370
LI,리히텐슈타인,Liechtenstein,423
MG,마다가스카르,Madagascar,261
MQ,마르티니크,#N/A,
MH,마셜 제도,Marshall Islands,692
YT,마요트,Mayotte,262
MO,마카오,Macau,853
MW,말라위,Malawi,265
MY,말레이시아,Malaysia,60
ML,말리,Mali,223
IM,맨섬,Isle of Man,44-1624
MX,멕시코,Mexico,52
MC,모나코,Monaco,377
MA,모로코,Morocco,212
MU,모리셔스,Mauritius,230
MR,모리타니,Mauritania,222
MZ,모잠비크,Mozambique,258
ME,몬테네그로,Montenegro,382
MS,몬트세랫,Montserrat,1-664
MD,몰도바,Moldova,373
MV,몰디브,Maldives,960
MT,몰타,Malta,356
MN,몽골,Mongolia,976
US,미국,United States,1
UM,미국령 군소 제도,#N/A,
VI,미국령 버진아일랜드,U.S. Virgin Islands,1-340
MM,미얀마,Myanmar,95
FM,미크로네시아 연방,Micronesia,691
VU,바누아투,Vanuatu,678
BH,바레인,Bahrain,973
BB,바베이도스,Barbados,1-246
VA,바티칸 시국,Vatican,379
BS,바하마,Bahamas,1-242
BD,방글라데시,Bangladesh,880
BM,버뮤다,Bermuda,1-441
BJ,베냉,Benin,229
VE,베네수엘라,Venezuela,58
VN,베트남,Vietnam,84
BE,벨기에,Belgium,32
BY,벨라루스,Belarus,375
BZ,벨리즈,Belize,501
BQ,보네르섬,#N/A,
BA,보스니아 헤르체고비나,Bosnia and Herzegovina,387
BW,보츠와나,Botswana,267
BO,볼리비아,Bolivia,591
BI,부룬디,Burundi,257
BF,부르키나파소,Burkina Faso,226
BV,부베 섬,#N/A,
BT,부탄,Bhutan,975
MP,북마리아나 제도,Northern Mariana Islands,1-670
MK,북마케도니아,Macedonia,389
BG,불가리아,Bulgaria,359
BR,브라질,Brazil,55
BN,브루나이,Brunei,673
WS,사모아,Samoa,685
SA,사우디아라비아,Saudi Arabia,966
GS,사우스조지아 사우스샌드위치 제도,#N/A,
SM,산마리노,San Marino,378
ST,상투메 프린시페,Sao Tome and Principe,239
MF,생마르탱,Saint Martin,590
BL,생바르텔레미,Saint Barthelemy,590
PM,생피에르 미클롱,Saint Pierre and Miquelon,508
EH,서사하라,Western Sahara,212
SN,세네갈,Senegal,221
RS,세르비아,Serbia,381
SC,세이셸,Seychelles,248
LC,세인트루시아,Saint Lucia,1-758
VC,세인트빈센트 그레나딘,Saint Vincent and the Grenadines,1-784
KN,세인트키츠 네비스,Saint Kitts and Nevis,1-869
SH,세인트헬레나,Saint Helena,290
SO,소말리아,Somalia,252
SB,솔로몬 제도,Solomon Islands,677
SD,수단,Sudan,249
SR,수리남,Suriname,597
LK,스리랑카,Sri Lanka,94
SJ,스발바르 얀마옌,Svalbard and Jan Mayen,47
SE,스웨덴,Sweden,46
CH,스위스,Switzerland,41
ES,스페인,Spain,34
SK,슬로바키아,Slovakia,421
SI,슬로베니아,Slovenia,386
SY,시리아,Syria,963
SL,시에라리온,Sierra Leone,232
SX,신트마르턴,Sint Maarten,1-721
SG,싱가포르,Singapore,65
AE,아랍에미리트,United Arab Emirates,971
AW,아루바,Aruba,297
AM,아르메니아,Armenia,374
AR,아르헨티나,Argentina,54
AS,아메리칸사모아,American Samoa,1-684
IS,아이슬란드,Iceland,354
HT,아이티,Haiti,509
IE,아일랜드,Ireland,353
AZ,아제르바이잔,Azerbaijan,994
AF,아프가니스탄,Afghanistan,93
AD,안도라,Andorra,376
AL,알바니아,Albania,355
DZ,알제리,Algeria,213
AO,앙골라,Angola,244
AG,앤티가 바부다,Antigua and Barbuda,1-268
AI,앵귈라,Anguilla,1-264
ER,에리트레아,Eritrea,291
SZ,에스와티니,Swaziland,268
EE,에스토니아,Estonia,372
EC,에콰도르,Ecuador,593
ET,에티오피아,Ethiopia,251
SV,엘살바도르,El Salvador,503
GB,영국,United Kingdom,44
VG,영국령 버진아일랜드,British Virgin Islands,1-284
IO,영국령 인도양 지역,British Indian Ocean Territory,246
YE,예멘,Yemen,967
OM,오만,Oman,968
AU,오스트레일리아,Australia,61
AT,오스트리아,Austria,43
HN,온두라스,Honduras,504
AX,올란드 제도,#N/A,#N/A
WF,왈리스 퓌튀나,Wallis and Futuna,681
JO,요르단,Jordan,962
UG,우간다,Uganda,256
UY,우루과이,Uruguay,598
UZ,우즈베키스탄,Uzbekistan,998
UA,우크라이나,Ukraine,380
IQ,이라크,Iraq,964
IR,이란,Iran,98
IL,이스라엘,Israel,972
EG,이집트,Egypt,20
IT,이탈리아,Italy,39
IN,인도:인디아,India,91
ID,인도네시아,Indonesia,62
JP,일본,Japan,81
JM,자메이카,Jamaica,1-876
ZM,잠비아,Zambia,260
JE,저지섬,Jersey,44-1534
GQ,적도 기니,Equatorial Guinea,240
KP,조선민주주의인민공화국,North Korea,850
GE,조지아,Georgia,995
CN,중국,China,86
CF,중앙아프리카 공화국,Central African Republic,236
TW,대만,Taiwan,886
DJ,지부티,Djibouti,253
GI,지브롤터,Gibraltar,350
ZW,짐바브웨,Zimbabwe,263
TD,차드,Chad,235
CZ,체코,Czech Republic,420
CL,칠레,Chile,56
CM,카메룬,Cameroon,237
CV,카보베르데,Cape Verde,238
KZ,카자흐스탄,Kazakhstan,7
QA,카타르,Qatar,974
KH,캄보디아,Cambodia,855
CA,캐나다,Canada,1
KE,케냐,Kenya,254
KY,케이맨 제도,Cayman Islands,1-345
KM,코모로,Comoros,269
CR,코스타리카,Costa Rica,506
CC,코코스 제도,Cocos Islands,61
CI,코트디부아르,Ivory Coast,225
CO,콜롬비아,Colombia,57
CG,콩고 공화국,Republic of the Congo,242
CD,콩고 민주 공화국,Democratic Republic of the Congo,243
CU,쿠바,Cuba,53
KW,쿠웨이트,Kuwait,965
CK,쿡 제도,Cook Islands,682
CW,퀴라소,Curacao,599
HR,크로아티아,Croatia,385
CX,크리스마스 섬,Christmas Island,61
KG,키르기스스탄,Kyrgyzstan,996
KI,키리바시,Kiribati,686
CY,키프로스,Cyprus,357
TJ,타지키스탄,Tajikistan,992
TZ,탄자니아,Tanzania,255
TH,태국,Thailand,66
TC,터크스 케이커스 제도,Turks and Caicos Islands,1-649
TR,터키,Turkey,90
TG,토고,Togo,228
TK,토켈라우,Tokelau,690
TO,통가,Tonga,676
TM,투르크메니스탄,Turkmenistan,993
TV,투발루,Tuvalu,688
TN,튀니지,Tunisia,216
TT,트리니다드 토바고,Trinidad and Tobago,1-868
PA,파나마,Panama,507
PY,파라과이,Paraguay,595
PK,파키스탄,Pakistan,92
PG,파푸아뉴기니,Papua New Guinea,675
PW,팔라우,Palau,680
PS,팔레스타인,Palestine,970
FO,페로 제도,Faroe Islands,298
PE,페루,Peru,51
PT,포르투갈,Portugal,351
FK,포클랜드 제도,Falkland Islands,500
PL,폴란드,Poland,48
PR,푸에르토리코,Puerto Rico,1-787:1-939
FR,프랑스,France,33
GF,프랑스령 기아나,#N/A,#N/A
TF,프랑스령 남방 및 남극,#N/A,#N/A
PF,프랑스령 폴리네시아,French Polynesia,689
FJ,피지,Fiji,679
FI,핀란드,Finland,358
PH,필리핀,Philippines,63
PN,핏케언 제도,Pitcairn,64
HM,허드 맥도널드 제도,#N/A,#N/A
HU,헝가리,Hungary,36
HK,홍콩,Hong Kong,852`;

const ccode: Record<string, {[key: string]: string[]}> = {};

countryList.split('\n').forEach((line) => {
  const seg = line.split(',');
  ccode[seg[0].toLowerCase()] = {
    ko: seg[1].split(':'),
    en: seg[2].split(':'),
  };
});

const getCode = (name: string, lang = 'ko') => {
  return Object.keys(ccode)
    .map((k) => {
      return ccode[k][lang].includes(name) ? k : '';
    })
    .filter((item) => item !== '')
    .join('+');
};

// return telephone prefix
const getPfx = (code?: string) => {
  const cc = (code || '').toLowerCase();
  return typeof ccode[cc] === 'undefined' ? '' : this.ccode[cc].pfx;
};

const getCountryName = (code?: string, lang = 'ko') => {
  const cc = code ? code.toLowerCase() : '';
  return typeof ccode[cc] === 'undefined' ? 'N/A' : ccode[cc][lang][0];
};

const getName = (code: string[] = [], lang = 'ko') => {
  if (typeof code === 'string') {
    return getCountryName(code, lang);
  }

  if (_.isEmpty(code)) {
    return ['N/A'];
  }

  return code.map((elm) => getCountryName(elm));
};

export default {
  getCode,
  getName,
  getCountryName,
  getPfx,
};
