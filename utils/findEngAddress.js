

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
                "20": "Nam-gu",
                "29": "Dalseo-gu",
                "71": "Dalseong-gun",
                "14": "Dong-gu",
                "23": "Buk-gu",
                "17": "Seo-gu",
                "26": "Suseong-gu",
                "11": "Jung-gu"},     
        "28":{
                // 인천 : 28, 10개
                province: "Incheon",
                "71": "Ganghwa-gun",
                "245": "Gyeyang-gu", // 3자리
                //"남구": "Nam-gu",
                "20": "Namdong-gu",
                "14": "Dong-gu",
                "177": "Michuhol-gu", // 3자리
                "237": "Bupyeong-gu", // 3자리
                "26": "Seo-gu",
                "185": "Yeonsu-gu", // 3자리
                "72": "Ongjin-gun",
                "11": "Jung-gu"},         
        "29":{
                // 광주 : 29, 5개
                province: "Gwangju",
                "20": "Gwangsan-gu",
                "155": "Nam-gu", // 3
                "11": "Dong-gu",
                "17": "Buk-gu",
                "14": "Seo-gu",            
            },
        "30":{
                // 대전 : 30, 5개
                province: "Daejeon",
                "23": "Daedeok-gu",
                "11": "Dong-gu",
                "17": "Seo-gu",
                "20": "Yuseong-gu",
                "14": "Jung-gu",            
            },      
        "31":{
                // 울산 : 31, 5개
                province: "Ulsan",
                "14": "Nam-gu",
                "17": "Dong-gu",
                "20": "Buk-gu",
                "71": "Ulju-gun",
                "11": "Jung-gu",            
            },     
        "36110":{
                // 세종특별자치시 : "36110": "Sejong",
                province: "Sejong-si",
            },              
            // 경기도 
        "42":{
                // 강원도 : 42, 18개
                province: "Gangwon-do",
                "15": "Gangneung-si",
                "82": "Goseong-gun",
                "17": "Donghae-si",
                "23": "Samcheok-si",
                "21": "Sokcho-si",
                "80": "Yanggu-gun",
                "83": "Yangyang-gun",
                "75": "Yeongwol-gun",
                "13": "Wonju-si",
                "81": "Inje-gun",
                "77": "Jeongseon-gun",
                "78": "Cheorwon-gun",
                "11": "Chuncheon-si",
                "19": "Taebaek-si",
                "76": "Pyeongchang-gun",
                "72": "Hongcheon-gun",
                "79": "Hwacheon-gun",
                "73": "Hoengseong-gun",           
            },  
        "43":{
                // 충청북도 : 43, 14개(청주시 포함 15개)
                province: "Chungcheongbuk-do",
                "76": "Goesan-gun",
                "80": "Danyang-gun",
                "72": "Boeun-gun",
                "74": "Yeongdong-gun",
                "73": "Okcheon-gun",
                "77": "Eumseong-gun",
                "15": "Jecheon-si",
                "745": "Jeungpyeong-gun",
                "75": "Jincheon-gun",
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
                "25": "Gyeryong-si",
                "15": "Gongju-si",
                "71": "Geumsan-gun",
                "23": "Nonsan-si",
                "27": "Dangjin-si",
                "18": "Boryeong-si",
                "76": "Buyeo-gun",
                "21": "Seosan-si",
                "77": "Seocheon-gun",
                "29": "Asan-si",
                "81": "Yesan-gun",
                //"천안시": "Cheonan-si", // 코드 검색 불가 (결과없음)
                "131": "Dongnam-gu",    // 천안시 동남구
                "133": "Seobuk-gu",	    // 천안시 서북구
                "79": "Cheongyang-gun",
                "825": "Taean-gun",
                "80": "Hongseong-gun",                  
            },  
        "45":{
                // 전라북도 : 45, 15개(전주시 포함 16개)
                province: "Jeollabuk-do",
                "79": "Gochang-gun",
                "13": "Gunsan-si",
                "21": "Gimje-si",
                "19": "Namwon-si",
                "73": "Muju-gun",
                "80": "Buan-gun",
                "77": "Sunchang-gun",
                "71": "Wanju-gun",
                "14": "Iksan-si",
                "75": "Imsil-gun",
                "74": "Jangsu-gun",
                //"전주시": "Jeonju-si", // 코드검색불가
                "113": "Deokjin-gu",    // 전주시 덕진구
                "111": "Wansan-gu",     // 전주시 완산구
                "18": "Jeongeup-si",
                "72": "Jinan-gun",             
            },                                                                                             
        "46":{
                // 전라남도 : 46, 22개
                province: "Jeollanam-do",
                "81": "Gangjin-gun",
                "77": "Goheung-gun",
                "72": "Gokseong-gun",
                "23": "Gwangyang-si",
                "73": "Gurye-gun",
                "17": "Naju-si",
                "71": "Damyang-gun",
                "11": "Mokpo-si",
                "84": "Muan-gun",
                "78": "Boseong-gun",
                "15": "Suncheon-si",
                "91": "Sinan-gun",
                "13": "Yeosu-si",
                "87": "Yeonggwang-gun",
                "83": "Yeongam-gun",
                "89": "Wando-gun",
                "88": "Jangseong-gun",
                "80": "Jangheung-gun",
                "90": "Jindo-gun",
                "86": "Hampyeong-gun",
                "82": "Haenam-gun",
                "79": "Hwasun-gun",     
            },  
        "47":{
                // 경상북도 : 47, 25개
                province: "Gyeongsangbuk-do",
                "29": "Gyeongsan-si",
                "13": "Gyeongju-si",
                "80": "Goryeong-gun",
                "19": "Gumi-si",
                "72": "Gunwi-gun",
                "15": "Gimcheon-si",
                "28": "Mungyeong-si",
                "92": "Bonghwa-gun",
                "25": "Sangju-si",
                "84": "Seongju-gun",
                "17": "Andong-si",
                "77": "Yeongdeok-gun",
                "76": "Yeongyang-gun",
                "21": "Yeongju-si",
                "23": "Yeongcheon-si",
                "90": "Yecheon-gun",
                "94": "Ulleung-gun",
                "93": "Uljin-gun",
                "73": "Uiseong-gun",
                "82": "Cheongdo-gun",
                "75": "Cheongsong-gun",
                "85": "Chilgok-gun",
                "11": "Pohang-si",
                "111": "Nam-gu",    // 포항시 남구
                "113": "Buk-gu",    // 포항시 북구    
            },  
        "48":{
                // 경상남도 : 48, 22개(창원시 포함 23개)
                province: "Gyeongsangnam-do",
                "31": "Geoje-si",
                "88": "Geochang-gun",
                "82": "Goseong-gun",
                "25": "Gimhae-si",
                "84": "Namhae-gun",
                "27": "Miryang-si",
                "24": "Sacheon-si",
                "86": "Sancheong-gun",
                "33": "Yangsan-si",
                "72": "Uiryeong-gun",
                "17": "Jinju-si",
                "74": "Changnyeong-gun",
                // "창원시": "Changwon-si",      // 코드 검색 불가
                "125": "Masanhappo-gu",    // 창원시 마산합포구
                "127": "Masanhoewon-gu",   // 창원시 마산회원구
                "123": "Seongsan-gu",      // 창원시 성산구
                "121": "Uichang-gu",       // 창원시 의창구
                "129": "Jinhae-gu",        // 창원시 진해구
                "22": "Tongyeong-si",
                "85": "Hadong-gun",
                "73": "Haman-gun",
                "87": "Hamyang-gun",
                "89": "Hapcheon-gun",  
            },     
        "50":{
                // 제주도 : 50, 2개
                province: "Jeju-do",
                "13": "Seogwipo-si",
                "11": "Jeju-si",
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

	// 경기도 : 41 , 48개
	"82": "Gapyeong-gun",
	//"": "Goyang-si", // 고양시 (코드없음)
	"281": "Goyang-si", // 고양시 덕양구 이름변경필요
	"285": "Goyang-si", // 고양시 일산동구
	"287": "Goyang-si", // 고양시 일산서구
    "29": "Gwacheon-si",
    "21": "Gwangmyeong-si",
    "61": "Gwangju-si",
    "31": "Guri-si",
    "41": "Gunpo-si",
    "57": "Gimpo-si",
    "36": "Namyangju-si",
    "25": "Dongducheon-si",
    "19": "Bucheon-si",
	//"": "Seongnam-si", // 코드 없음
	"135": "Seongnam-si", // 성남시 분당구 이름변경필요
	"131": "Seongnam-si", // 성남시 수정구
	"133": "Seongnam-si", // 성남시 중원구
	//"": "Suwon-si", // 코드 없음
    "113": "Suwon-si",	// 수원시 권선구 이름변경필요
	"117": "Suwon-si",	// 수원시 영통구
	"111": "Suwon-si",	// 수원시 장안구
	"115": "Suwon-si",	// 수원시 팔달구
    "39": "Siheung-si",
	// "": "Ansan-si", // 코드 없음
	"273": "Ansan-si", // 안산시 단원구 이름변경필요
	"271": "Ansan-si", // 안산시 상록구
    "55": "Anseong-si",
	// "": "Anyang-si",
	"173": "Anyang-si", // 안양시 동안구 이름변경필요
	"171": "Anyang-si", // 안양시 만안구
    "63": "Yangju-si",
    "83": "Yangpyeong-gun",
    "67": "Yeoju-si",
    "80": "Yeoncheon-gun",
    "37": "Osan-si",
	// "용인시": "Yongin-si",
	"463": "Yongin-si", // 용인시 기흥구 이름변경필요
	"465": "Yongin-si", // 용인시 수지구
	"461": "Yongin-si", // 용인시 처인구
    "43": "Uiwang-si",
	"15": "Uijeongbu-si",
    "50": "Icheon-si",
    "48": "Paju-si",
    "22": "Pyeongtaek-si",
    "65": "Pocheon-si",
    "45": "Hanam-si",
	"59": "Hwaseong-si",


    // 전라남도
    "81": "Gangjin-gun",
    "77": "Goheung-gun",
    "72": "Gokseong-gun",
    "23": "Gwangyang-si",
    "73": "Gurye-gun",
    "17": "Naju-si",
    "71": "Damyang-gun",
    "11": "Mokpo-si",
    "84": "Muan-gun",
    "78": "Boseong-gun",
    "15": "Suncheon-si",
    "91": "Sinan-gun",
    "13": "Yeosu-si",
    "87": "Yeonggwang-gun",
    "83": "Yeongam-gun",
    "89": "Wando-gun",
    "88": "Jangseong-gun",
    "80": "Jangheung-gun",
    "90": "Jindo-gun",
    "86": "Hampyeong-gun",
    "82": "Haenam-gun",
    "79": "Hwasun-gun",


    // 경상북도
    "29": "Gyeongsan-si",
    "13": "Gyeongju-si",
    "80": "Goryeong-gun",
    "19": "Gumi-si",
    "72": "Gunwi-gun",
    "15": "Gimcheon-si",
    "28": "Mungyeong-si",
    "92": "Bonghwa-gun",
    "25": "Sangju-si",
    "84": "Seongju-gun",
    "17": "Andong-si",
    "77": "Yeongdeok-gun",
    "76": "Yeongyang-gun",
    "21": "Yeongju-si",
    "23": "Yeongcheon-si",
    "90": "Yecheon-gun",
    "94": "Ulleung-gun",
    "93": "Uljin-gun",
    "73": "Uiseong-gun",
    "82": "Cheongdo-gun",
    "75": "Cheongsong-gun",
    "85": "Chilgok-gun",
    "11": "Pohang-si",
    "111": "Nam-gu",    // 포항시 남구
    "113": "Buk-gu",    // 포항시 북구

    // 경상남도
    "31": "Geoje-si",
    "88": "Geochang-gun",
    "82": "Goseong-gun",
    "25": "Gimhae-si",
    "84": "Namhae-gun",
    "27": "Miryang-si",
    "24": "Sacheon-si",
    "86": "Sancheong-gun",
    "33": "Yangsan-si",
    "72": "Uiryeong-gun",
    "17": "Jinju-si",
    "74": "Changnyeong-gun",
    // "창원시": "Changwon-si",      // 코드 검색 불가
    "125": "Masanhappo-gu",    // 창원시 마산합포구
    "127": "Masanhoewon-gu",   // 창원시 마산회원구
    "123": "Seongsan-gu",      // 창원시 성산구
    "121": "Uichang-gu",       // 창원시 의창구
    "129": "Jinhae-gu",        // 창원시 진해구
    "22": "Tongyeong-si",
    "85": "Hadong-gun",
    "73": "Haman-gun",
    "87": "Hamyang-gun",
    "89": "Hapcheon-gun",

    "50": "Jeju-do",
    "13": "Seogwipo-si",
    "11": "Jeju-si",


    "": "Gangwon-do",

    "": "Gyeongsangnam-do",
    "": "Gyeongsangbuk-do",
    "": "Gwangju",
    "11": "Seoul",
	"26": "Busan",
	"27": "Daegu",
	"28": "Incheon",
	"29": "Gwangju",
	"30": "Daejeon",
    "31": "Ulsan",
    "36110": "Sejong", //
	"41": "Gyeonggi-do",

    "": "Jeollanam-do",
    "": "Jeollabuk-do",
    "50": "Jeju-do",
    "": "Chungcheongnam-do",
    "": "Chungcheongbuk-do"
    */
    

    findCity( provinceNumber, cityNumber) {
        const province = this.city[provinceNumber]
        if (province) return province[cityNumber]

        return ''
    }

    findProvince( provinceNumber) {
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