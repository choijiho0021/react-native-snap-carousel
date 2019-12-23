

class findEngAddress {
    
    city = {

        // 서울 : 11, 25개
        "11": {
                province: "Seoul",
                "680": "Gangnam-gu",
                "740": "Gangdong-gu",
                "300": "Gangbuk-gu",
                "500": "Gangseo-gu",
                "620": "Gwanak-gu",
                "210": "Gwangjin-gu",
                "530": "Guro-gu",
                "540": "Geumcheon-gu",
                "350": "Nowon-gu",
                "320": "Dobong-gu",
                "230": "Dongdaemun-gu",
                "590": "Dongjak-gu",
                "440": "Mapo-gu",
                "410": "Seodaemun-gu",
                "650": "Seocho-gu",
                "200": "Seongdong-gu",
                "290": "Seongbuk-gu",
                "710": "Songpa-gu",
                "470": "Yangcheon-gu",
                "560": "Yeongdeungpo-gu",
                "170": "Yongsan-gu",
                "380": "Eunpyeong-gu",
                "110": "Jongno-gu",
                "140": "Jung-gu",
                "260": "Jungnang-gu"},
        
            // 부산 : 26, 16개
        "26":{
                province: "Busan",    
                "440": "Gangseo-gu",
                "410": "Geumjeong-gu",
                "710": "Gijang-gun",
                "290": "Nam-gu",
                "170": "Dong-gu",
                "260": "Dongnae-gu",
                "230": "Busanjin-gu",
                "320": "Buk-gu",
                "530": "Sasang-gu",
                "380": "Saha-gu",
                "140": "Seo-gu",
                "500": "Suyeong-gu",
                "470": "Yeonje-gu",
                "200": "Yeongdo-gu",
                "110": "Jung-gu",
                "350": "Haeundae-gu"},

        "27":{    
            // 대구 : 27, 8개
                province:"Daegu",
                "200": "Nam-gu",
                "290": "Dalseo-gu",
                "710": "Dalseong-gun",
                "140": "Dong-gu",
                "230": "Buk-gu",
                "170": "Seo-gu",
                "260": "Suseong-gu",
                "110": "Jung-gu"},     
        "28":{
                // 인천 : 28, 10개
                province: "Incheon",
                "710": "Ganghwa-gun",
                "245": "Gyeyang-gu", 
                //"남구": "Nam-gu",
                "200": "Namdong-gu",
                "140": "Dong-gu",
                "177": "Michuhol-gu", 
                "237": "Bupyeong-gu", 
                "260": "Seo-gu",
                "185": "Yeonsu-gu", 
                "720": "Ongjin-gun",
                "110": "Jung-gu"},         
        "29":{
                // 광주 : 29, 5개
                province: "Gwangju",
                "200": "Gwangsan-gu",
                "155": "Nam-gu", 
                "110": "Dong-gu",
                "170": "Buk-gu",
                "140": "Seo-gu",            
            },
        "30":{
                // 대전 : 30, 5개
                province: "Daejeon",
                "230": "Daedeok-gu",
                "110": "Dong-gu",
                "170": "Seo-gu",
                "200": "Yuseong-gu",
                "140": "Jung-gu",            
            },      
        "31":{
                // 울산 : 31, 5개
                province: "Ulsan",
                "140": "Nam-gu",
                "170": "Dong-gu",
                "200": "Buk-gu",
                "710": "Ulju-gun",
                "110": "Jung-gu",            
            },     
        "36110":{
                // 세종특별자치시 : "36110": "Sejong",
                province: "Sejong-si",
                // "110": ""
            },              
        "41":{
                // 경기도 : 41 , 42개(주석 포함 48개)
                province: "Gyeonggi-do",
                "820": "Gapyeong-gun",
                //"": "Goyang-si",      // 고양시 (코드없음)
                "281": "Goyang-si",     // 고양시 덕양구 이름변경필요
                "285": "Goyang-si",     // 고양시 일산동구
                "287": "Goyang-si",     // 고양시 일산서구
                "290": "Gwacheon-si",
                "210": "Gwangmyeong-si",
                "610": "Gwangju-si",
                "310": "Guri-si",
                "410": "Gunpo-si",
                "570": "Gimpo-si",
                "360": "Namyangju-si",
                "250": "Dongducheon-si",
                "190": "Bucheon-si",
                //"": "Seongnam-si",    // 코드 없음
                "135": "Seongnam-si",   // 성남시 분당구 이름변경필요
                "131": "Seongnam-si",   // 성남시 수정구
                "133": "Seongnam-si",   // 성남시 중원구
                //"": "Suwon-si",       // 코드 없음
                "113": "Suwon-si",	    // 수원시 권선구 이름변경필요
                "117": "Suwon-si",	    // 수원시 영통구
                "111": "Suwon-si",	    // 수원시 장안구
                "115": "Suwon-si",	    // 수원시 팔달구
                "390": "Siheung-si",
                // "": "Ansan-si",      // 코드 없음
                "273": "Ansan-si",      // 안산시 단원구 이름변경필요
                "271": "Ansan-si",      // 안산시 상록구
                "550": "Anseong-si",
                // "": "Anyang-si",
                "173": "Anyang-si",     // 안양시 동안구 이름변경필요
                "171": "Anyang-si",     // 안양시 만안구
                "630": "Yangju-si",
                "830": "Yangpyeong-gun",
                "670": "Yeoju-si",
                "800": "Yeoncheon-gun",
                "370": "Osan-si",
                // "용인시": "Yongin-si",
                "463": "Yongin-si",     // 용인시 기흥구 이름변경필요
                "465": "Yongin-si",     // 용인시 수지구
                "461": "Yongin-si",     // 용인시 처인구
                "430": "Uiwang-si",
                "150": "Uijeongbu-si",
                "500": "Icheon-si",
                "480": "Paju-si",
                "220": "Pyeongtaek-si",
                "650": "Pocheon-si",
                "450": "Hanam-si",
                "590": "Hwaseong-si",                
            },             
        "42":{
                // 강원도 : 42, 18개
                province: "Gangwon-do",
                "150": "Gangneung-si",
                "820": "Goseong-gun",
                "170": "Donghae-si",
                "230": "Samcheok-si",
                "210": "Sokcho-si",
                "800": "Yanggu-gun",
                "830": "Yangyang-gun",
                "750": "Yeongwol-gun",
                "130": "Wonju-si",
                "810": "Inje-gun",
                "770": "Jeongseon-gun",
                "780": "Cheorwon-gun",
                "110": "Chuncheon-si",
                "190": "Taebaek-si",
                "760": "Pyeongchang-gun",
                "720": "Hongcheon-gun",
                "790": "Hwacheon-gun",
                "730": "Hoengseong-gun",           
            },  
        "43":{
                // 충청북도 : 43, 14개(청주시 포함 15개)
                province: "Chungcheongbuk-do",
                "760": "Goesan-gun",
                "800": "Danyang-gun",
                "720": "Boeun-gun",
                "740": "Yeongdong-gun",
                "730": "Okcheon-gun",
                "770": "Eumseong-gun",
                "150": "Jecheon-si",
                "745": "Jeungpyeong-gun",
                "750": "Jincheon-gun",
                // "청주시": "Cheongju-si", // 코드 검색 불가
                "111": "Sangdang-gu",   // 청주시 상당구
                "112": "Seowon-gu",     // 청주시 서원구
                "114": "Cheongwon-gu",  // 청주시 청원구
                "113": "Heungdeok-gu",  // 청주시 흥덕구
                "130": "Chungju-si",           
            },  
        "44":{
                // 충청남도 : 44, 16개(천안시 포함 17개)
                province: "Chungcheongnam-do",
                "250": "Gyeryong-si",
                "150": "Gongju-si",
                "710": "Geumsan-gun",
                "230": "Nonsan-si",
                "270": "Dangjin-si",
                "180": "Boryeong-si",
                "760": "Buyeo-gun",
                "210": "Seosan-si",
                "770": "Seocheon-gun",
                "290": "Asan-si",
                "810": "Yesan-gun",
                //"천안시": "Cheonan-si", // 코드 검색 불가 (결과없음)
                "131": "Dongnam-gu",    // 천안시 동남구
                "133": "Seobuk-gu",	    // 천안시 서북구
                "790": "Cheongyang-gun",
                "825": "Taean-gun",
                "800": "Hongseong-gun",                  
            },  
        "45":{
                // 전라북도 : 45, 15개(전주시 포함 16개)
                province: "Jeollabuk-do",
                "790": "Gochang-gun",
                "130": "Gunsan-si",
                "210": "Gimje-si",
                "190": "Namwon-si",
                "730": "Muju-gun",
                "800": "Buan-gun",
                "770": "Sunchang-gun",
                "710": "Wanju-gun",
                "140": "Iksan-si",
                "750": "Imsil-gun",
                "740": "Jangsu-gun",
                //"전주시": "Jeonju-si", // 코드검색불가
                "113": "Deokjin-gu",    // 전주시 덕진구
                "111": "Wansan-gu",     // 전주시 완산구
                "180": "Jeongeup-si",
                "720": "Jinan-gun",             
            },                                                                                             
        "46":{
                // 전라남도 : 46, 22개
                province: "Jeollanam-do",
                "810": "Gangjin-gun",
                "770": "Goheung-gun",
                "720": "Gokseong-gun",
                "230": "Gwangyang-si",
                "730": "Gurye-gun",
                "170": "Naju-si",
                "710": "Damyang-gun",
                "110": "Mokpo-si",
                "840": "Muan-gun",
                "780": "Boseong-gun",
                "150": "Suncheon-si",
                "910": "Sinan-gun",
                "130": "Yeosu-si",
                "870": "Yeonggwang-gun",
                "830": "Yeongam-gun",
                "890": "Wando-gun",
                "880": "Jangseong-gun",
                "800": "Jangheung-gun",
                "900": "Jindo-gun",
                "860": "Hampyeong-gun",
                "820": "Haenam-gun",
                "790": "Hwasun-gun",     
            },  
        "47":{
                // 경상북도 : 47, 25개
                province: "Gyeongsangbuk-do",
                "290": "Gyeongsan-si",
                "130": "Gyeongju-si",
                "800": "Goryeong-gun",
                "190": "Gumi-si",
                "720": "Gunwi-gun",
                "150": "Gimcheon-si",
                "280": "Mungyeong-si",
                "920": "Bonghwa-gun",
                "250": "Sangju-si",
                "840": "Seongju-gun",
                "170": "Andong-si",
                "770": "Yeongdeok-gun",
                "760": "Yeongyang-gun",
                "210": "Yeongju-si",
                "230": "Yeongcheon-si",
                "900": "Yecheon-gun",
                "940": "Ulleung-gun",
                "930": "Uljin-gun",
                "730": "Uiseong-gun",
                "820": "Cheongdo-gun",
                "750": "Cheongsong-gun",
                "850": "Chilgok-gun",
                "110": "Pohang-si",
                "111": "Nam-gu",    // 포항시 남구
                "113": "Buk-gu",    // 포항시 북구    
            },  
        "48":{
                // 경상남도 : 48, 22개(창원시 포함 23개)
                province: "Gyeongsangnam-do",
                "310": "Geoje-si",
                "880": "Geochang-gun",
                "820": "Goseong-gun",
                "250": "Gimhae-si",
                "840": "Namhae-gun",
                "270": "Miryang-si",
                "240": "Sacheon-si",
                "860": "Sancheong-gun",
                "330": "Yangsan-si",
                "720": "Uiryeong-gun",
                "170": "Jinju-si",
                "740": "Changnyeong-gun",
                // "창원시": "Changwon-si",      // 코드 검색 불가
                "125": "Masanhappo-gu",    // 창원시 마산합포구
                "127": "Masanhoewon-gu",   // 창원시 마산회원구
                "123": "Seongsan-gu",      // 창원시 성산구
                "121": "Uichang-gu",       // 창원시 의창구
                "129": "Jinhae-gu",        // 창원시 진해구
                "220": "Tongyeong-si",
                "850": "Hadong-gun",
                "730": "Haman-gun",
                "870": "Hamyang-gun",
                "890": "Hapcheon-gun",  
            },     
        "50":{
                // 제주도 : 50, 2개
                province: "Jeju-do",
                "130": "Seogwipo-si",
                "110": "Jeju-si",
            },                                       
        }
/*

    "소사구": "Sosa-gu",
    "오정구": "Ojeong-gu",
    "원미구": "Wonmi-gu",
    "분당구": "Bundang-gu",
    "수정구": "Sujeong-gu",
    "중원구": "Jungwon-gu",
    "동안구": "Dongan-gu",
    "만안구": "Manan-gu",
    "덕양구": "Deogyang-gu",
    "일산동구": "Ilsandong-gu",
    "일산서구": "Ilsanseo-gu",
    "기흥구": "Giheung-gu",
    "수지구": "Suji-gu",
    "처인구": "Cheoin-gu",
    "단원구": "Danwon-gu",
    "상록구": "Sangnok-gu",
    "권선구": "Gwonseon-gu",
    "영통구": "Yeongtong-gu",
    "장안구": "Jangan-gu",
	"팔달구": "Paldal-gu",

    */
    

    findCity(provinceNumber, cityNumber) {
        const province = this.city[provinceNumber]
        if (province) return province[cityNumber]

        return ''
    }

    findProvince(provinceNumber) {
        const province = this.city[provinceNumber]
        if (province) return province.province

        return ''
    }
    

    // constructor(list) {
    //     this.ccode = {}
    //     list
    //         .split('\n')
    //         .forEach(line => {
    //             const seg = line.split(',')
    //             this.ccode[seg[0].toLowerCase()] = {
    //                 'ko': seg[1],
    //                 'en': seg[2]
    //             }
    //         })
    // }

}
export default new findEngAddress();