import _ from 'underscore';

// 동의어 추가 ':'
const countryList = `GH,가나,Ghana
GA,가봉,Gabon
GY,가이아나,Guyana
GM,감비아,Gambia
GG,건지섬,Guernsey
GP,과들루프,#N/A
GT,과테말라,Guatemala
GU,괌,Guam
GD,그레나다,Grenada
GR,그리스,Greece
GL,그린란드,Greenland
GN,기니,Guinea
GW,기니비사우,Guinea-Bissau
NA,나미비아,Namibia
NR,나우루,Nauru
NG,나이지리아,Nigeria
AQ,남극,Antarctica
SS,남수단,South Sudan
ZA,남아프리카 공화국,South Africa
NL,네덜란드,Netherlands
NP,네팔,Nepal
NO,노르웨이,Norway
NF,노퍽섬,#N/A
NC,누벨칼레도니,New Caledonia
NZ,뉴질랜드,New Zealand
NU,니우에,Niue
NE,니제르,Niger
NI,니카라과,Nicaragua
KR,대한민국:한국,South Korea
DK,덴마크,Denmark
DO,도미니카 공화국,Dominican Republic
DM,도미니카 연방,Dominica
TL,동티모르,East Timor
DE,독일,Germany
LA,라오스,Laos
LR,라이베리아,Liberia
LV,라트비아,Latvia
RU,러시아,Russia
LB,레바논,Lebanon
LS,레소토,Lesotho
RE,레위니옹,Reunion
RO,루마니아,Romania
LU,룩셈부르크,Luxembourg
RW,르완다,Rwanda
LY,리비아,Libya
LT,리투아니아,Lithuania
LI,리히텐슈타인,Liechtenstein
MG,마다가스카르,Madagascar
MQ,마르티니크,#N/A
MH,마셜 제도,Marshall Islands
YT,마요트,Mayotte
MO,마카오,Macau
MW,말라위,Malawi
MY,말레이시아,Malaysia
ML,말리,Mali
IM,맨섬,Isle of Man
MX,멕시코,Mexico
MC,모나코,Monaco
MA,모로코,Morocco
MU,모리셔스,Mauritius
MR,모리타니,Mauritania
MZ,모잠비크,Mozambique
ME,몬테네그로,Montenegro
MS,몬트세랫,Montserrat
MD,몰도바,Moldova
MV,몰디브,Maldives
MT,몰타,Malta
MN,몽골,Mongolia
US,미국,United States
UM,미국령 군소 제도,#N/A
VI,미국령 버진아일랜드,U.S. Virgin Islands
MM,미얀마,Myanmar
FM,미크로네시아 연방,Micronesia
VU,바누아투,Vanuatu
BH,바레인,Bahrain
BB,바베이도스,Barbados
VA,바티칸 시국,Vatican
BS,바하마,Bahamas
BD,방글라데시,Bangladesh
BM,버뮤다,Bermuda
BJ,베냉,Benin
VE,베네수엘라,Venezuela
VN,베트남,Vietnam
BE,벨기에,Belgium
BY,벨라루스,Belarus
BZ,벨리즈,Belize
BQ,보네르섬,#N/A
BA,보스니아 헤르체고비나,Bosnia and Herzegovina
BW,보츠와나,Botswana
BO,볼리비아,Bolivia
BI,부룬디,Burundi
BF,부르키나파소,Burkina Faso
BV,부베 섬,#N/A
BT,부탄,Bhutan
MP,북마리아나 제도,Northern Mariana Islands
MK,북마케도니아,Macedonia
BG,불가리아,Bulgaria
BR,브라질,Brazil
BN,브루나이,Brunei
WS,사모아,Samoa
SA,사우디아라비아,Saudi Arabia
GS,사우스조지아 사우스샌드위치 제도,#N/A
SM,산마리노,San Marino
ST,상투메 프린시페,Sao Tome and Principe
MF,생마르탱,Saint Martin
BL,생바르텔레미,Saint Barthelemy
PM,생피에르 미클롱,Saint Pierre and Miquelon
EH,서사하라,Western Sahara
SN,세네갈,Senegal
RS,세르비아,Serbia
SC,세이셸,Seychelles
LC,세인트루시아,Saint Lucia
VC,세인트빈센트 그레나딘,Saint Vincent and the Grenadines
KN,세인트키츠 네비스,Saint Kitts and Nevis
SH,세인트헬레나,Saint Helena
SO,소말리아,Somalia
SB,솔로몬 제도,Solomon Islands
SD,수단,Sudan
SR,수리남,Suriname
LK,스리랑카,Sri Lanka
SJ,스발바르 얀마옌,Svalbard and Jan Mayen
SE,스웨덴,Sweden
CH,스위스,Switzerland
ES,스페인,Spain
SK,슬로바키아,Slovakia
SI,슬로베니아,Slovenia
SY,시리아,Syria
SL,시에라리온,Sierra Leone
SX,신트마르턴,Sint Maarten
SG,싱가포르,Singapore
AE,아랍에미리트,United Arab Emirates
AW,아루바,Aruba
AM,아르메니아,Armenia
AR,아르헨티나,Argentina
AS,아메리칸사모아,American Samoa
IS,아이슬란드,Iceland
HT,아이티,Haiti
IE,아일랜드,Ireland
AZ,아제르바이잔,Azerbaijan
AF,아프가니스탄,Afghanistan
AD,안도라,Andorra
AL,알바니아,Albania
DZ,알제리,Algeria
AO,앙골라,Angola
AG,앤티가 바부다,Antigua and Barbuda
AI,앵귈라,Anguilla
ER,에리트레아,Eritrea
SZ,에스와티니,Swaziland
EE,에스토니아,Estonia
EC,에콰도르,Ecuador
ET,에티오피아,Ethiopia
SV,엘살바도르,El Salvador
GB,영국,United Kingdom
VG,영국령 버진아일랜드,British Virgin Islands
IO,영국령 인도양 지역,British Indian Ocean Territory
YE,예멘,Yemen
OM,오만,Oman
AU,오스트레일리아,Australia
AT,오스트리아,Austria
HN,온두라스,Honduras
AX,올란드 제도,#N/A
WF,왈리스 퓌튀나,Wallis and Futuna
JO,요르단,Jordan
UG,우간다,Uganda
UY,우루과이,Uruguay
UZ,우즈베키스탄,Uzbekistan
UA,우크라이나,Ukraine
IQ,이라크,Iraq
IR,이란,Iran
IL,이스라엘,Israel
EG,이집트,Egypt
IT,이탈리아,Italy
IN,인도:인디아,India
ID,인도네시아,Indonesia
JP,일본,Japan
JM,자메이카,Jamaica
ZM,잠비아,Zambia
JE,저지섬,Jersey
GQ,적도 기니,Equatorial Guinea
KP,조선민주주의인민공화국,North Korea
GE,조지아,Georgia
CN,중국,China
CF,중앙아프리카 공화국,Central African Republic
TW,대만,Taiwan
DJ,지부티,Djibouti
GI,지브롤터,Gibraltar
ZW,짐바브웨,Zimbabwe
TD,차드,Chad
CZ,체코,Czech Republic
CL,칠레,Chile
CM,카메룬,Cameroon
CV,카보베르데,Cape Verde
KZ,카자흐스탄,Kazakhstan
QA,카타르,Qatar
KH,캄보디아,Cambodia
CA,캐나다,Canada
KE,케냐,Kenya
KY,케이맨 제도,Cayman Islands
KM,코모로,Comoros
CR,코스타리카,Costa Rica
CC,코코스 제도,Cocos Islands
CI,코트디부아르,Ivory Coast
CO,콜롬비아,Colombia
CG,콩고 공화국,Republic of the Congo
CD,콩고 민주 공화국,Democratic Republic of the Congo
CU,쿠바,Cuba
KW,쿠웨이트,Kuwait
CK,쿡 제도,Cook Islands
CW,퀴라소,Curacao
HR,크로아티아,Croatia
CX,크리스마스 섬,Christmas Island
KG,키르기스스탄,Kyrgyzstan
KI,키리바시,Kiribati
CY,키프로스,Cyprus
TJ,타지키스탄,Tajikistan
TZ,탄자니아,Tanzania
TH,태국,Thailand
TC,터크스 케이커스 제도,Turks and Caicos Islands
TR,터키,Turkey
TG,토고,Togo
TK,토켈라우,Tokelau
TO,통가,Tonga
TM,투르크메니스탄,Turkmenistan
TV,투발루,Tuvalu
TN,튀니지,Tunisia
TT,트리니다드 토바고,Trinidad and Tobago
PA,파나마,Panama
PY,파라과이,Paraguay
PK,파키스탄,Pakistan
PG,파푸아뉴기니,Papua New Guinea
PW,팔라우,Palau
PS,팔레스타인,Palestine
FO,페로 제도,Faroe Islands
PE,페루,Peru
PT,포르투갈,Portugal
FK,포클랜드 제도,Falkland Islands
PL,폴란드,Poland
PR,푸에르토리코,Puerto Rico
FR,프랑스,France
GF,프랑스령 기아나,#N/A
TF,프랑스령 남방 및 남극,#N/A
PF,프랑스령 폴리네시아,French Polynesia
FJ,피지,Fiji
FI,핀란드,Finland
PH,필리핀,Philippines
PN,핏케언 제도,Pitcairn
HM,허드 맥도널드 제도,#N/A
HU,헝가리,Hungary
HK,홍콩,Hong Kong`;

class Country {
  constructor(list) {
    this.ccode = {};
    list.split('\n').forEach((line) => {
      const seg = line.split(',');
      this.ccode[seg[0].toLowerCase()] = {
        ko: seg[1].split(':'),
        en: seg[2].split(':'),
      };
    });
  }

  getCode(name, lang = 'ko') {
    return Object.keys(this.ccode)
      .map((k) => {
        return this.ccode[k][lang].includes(name) ? k : '';
      })
      .filter((item) => item !== '')
      .join('+');
  }

  getName(code = [], lang = 'ko') {
    if (_.isEmpty(code)) return ['N/A'];

    return code.map((elm) => {
      const cc = elm.toLowerCase();
      return typeof this.ccode[cc] === 'undefined'
        ? 'N/A'
        : this.ccode[cc][lang][0];
    });
  }
}

export default new Country(countryList);
