

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
            // 인천
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
            // 광주
            province: "Gwangju",
            "20": "Gwangsan-gu",
            "155": "Nam-gu", // 3
            "11": "Dong-gu",
            "17": "Buk-gu",
            "14": "Seo-gu",            
            },
        "30":{
            // 대전
            province: "Daejeon",
            "23": "Daedeok-gu",
            "11": "Dong-gu",
            "17": "Seo-gu",
            "20": "Yuseong-gu",
            "14": "Jung-gu",            
            },      
        "31":{
            // 울산
            province: "Ulsan",
            "14": "Nam-gu",
            "17": "Dong-gu",
            "20": "Buk-gu",
            "71": "Ulju-gun",
            "11": "Jung-gu",            
            },      
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
        "31":{
            province: "Ulsan",
            "14": "Nam-gu",
            "17": "Dong-gu",
            "20": "Buk-gu",
            "71": "Ulju-gun",
            "11": "Jung-gu",            
            },  
        "31":{
            province: "Ulsan",
            "14": "Nam-gu",
            "17": "Dong-gu",
            "20": "Buk-gu",
            "71": "Ulju-gun",
            "11": "Jung-gu",            
            },                                                                                 

        }
/*
    // 대구 : 27, 8개
    Daegu:{
	"20": "Nam-gu",
    "29": "Dalseo-gu",
    "71": "Dalseong-gun",
    "14": "Dong-gu",
    "23": "Buk-gu",
    "17": "Seo-gu",
    "26": "Suseong-gu",
	"11": "Jung-gu"},

    // 인천 : 28, 10개
    Incheon:{
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

	// 광주 : 29, 5개
    "20": "Gwangsan-gu",
    "155": "Nam-gu", // 3
    "11": "Dong-gu",
    "17": "Buk-gu",
	"14": "Seo-gu",

	// 대전 : 30, 5개
    "23": "Daedeok-gu",
    "11": "Dong-gu",
    "17": "Seo-gu",
    "20": "Yuseong-gu",
	"14": "Jung-gu",

	// 울산 : 31, 5개
    "14": "Nam-gu",
    "17": "Dong-gu",
    "20": "Buk-gu",
    "71": "Ulju-gun",
	"11": "Jung-gu",


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

	// 강원도 : 42, 18개
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

	// 충청북도 : 43, 15개
    "76": "Goesan-gun",
    "80": "Danyang-gun",
    "72": "Boeun-gun",
    "74": "Yeongdong-gun",
    "73": "Okcheon-gun",
    "77": "Eumseong-gun",
    "15": "Jecheon-si",
    "745": "Jeungpyeong-gun",
	"75": "Jincheon-gun",
	//"청주시": "Cheongju-si",
	"111": "Sangdang-gu", // 청주시 상당구
	"112": "Seowon-gu", // 청주시 상당구
	"114": "Cheongwon-gu", // 청주시 청원구
    "113": "Heungdeok-gu", // 청주시 흥덕구
	"130": "Chungju-si",

	// 충청남도 : 44, 16개
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
	//"천안시": "Cheonan-si",
    "131": "Dongnam-gu", // 천안시 동남구
    "133": "Seobuk-gu",	// 천안시 서북구
    "79": "Cheongyang-gun",
    "825": "Taean-gun",
	"80": "Hongseong-gun",


    "덕진구": "Deokjin-gu",
    "완산구": "Wansan-gu",
    "고창군": "Gochang-gun",
    "군산시": "Gunsan-si",
    "": "Gimje-si",
    "": "Namwon-si",
    "": "Muju-gun",
    "": "Buan-gun",
    "": "Sunchang-gun",
    "": "Wanju-gun",
    "": "Iksan-si",
    "": "Imsil-gun",
    "": "Jangsu-gun",
    "": "Jeonju-si",
    "": "Jeongeup-si",
    "": "Jinan-gun",
    "": "Gangjin-gun",
    "": "Goheung-gun",
    "": "Gokseong-gun",
    "": "Gwangyang-si",
    "": "Gurye-gun",
    "": "Naju-si",
    "": "Damyang-gun",
    "": "Mokpo-si",
    "": "Muan-gun",
    "": "Boseong-gun",
    "": "Suncheon-si",
    "": "Sinan-gun",
    "": "Yeosu-si",
    "": "Yeonggwang-gun",
    "": "Yeongam-gun",
    "": "Wando-gun",
    "": "Jangseong-gun",
    "": "Jangheung-gun",
    "": "Jindo-gun",
    "": "Hampyeong-gun",
    "": "Haenam-gun",
    "": "Hwasun-gun",
    "": "Nam-gu",
    "": "Buk-gu",
    "": "Gyeongsan-si",
    "": "Gyeongju-si",
    "": "Goryeong-gun",
    "": "Gumi-si",
    "": "Gunwi-gun",
    "": "Gimcheon-si",
    "": "Mungyeong-si",
    "": "Bonghwa-gun",
    "": "Sangju-si",
    "": "Seongju-gun",
    "": "Andong-si",
    "": "Yeongdeok-gun",
    "": "Yeongyang-gun",
    "": "Yeongju-si",
    "": "Yeongcheon-si",
    "": "Yecheon-gun",
    "": "Ulleung-gun",
    "": "Uljin-gun",
    "": "Uiseong-gun",
    "": "Cheongdo-gun",
    "": "Cheongsong-gun",
    "": "Chilgok-gun",
    "": "Pohang-si",
    "": "Masanhappo-gu",
    "": "Masanhoewon-gu",
    "": "Seongsan-gu",
    "": "Uichang-gu",
    "": "Jinhae-gu",
    "": "Geoje-si",
    "": "Geochang-gun",
    "": "Goseong-gun",
    "": "Gimhae-si",
    "": "Namhae-gun",
    "": "Miryang-si",
    "": "Sacheon-si",
    "": "Sancheong-gun",
    "": "Yangsan-si",
    "": "Uiryeong-gun",
    "": "Jinju-si",
    "": "Changnyeong-gun",
    "": "Changwon-si",
    "": "Tongyeong-si",
    "": "Hadong-gun",
    "": "Haman-gun",
    "": "Hamyang-gun",
    "": "Hapcheon-gun",
    "": "Seogwipo-si",
    "": "Jeju-si",
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
    "": "Jeju-do",
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