import {
    StyleSheet,
    Platform
} from 'react-native';

import {colors} from "./Colors"

export const appStyles = StyleSheet.create({
    container: {
        flex: 1,
        width:'100%',
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        borderBottomWidth: 0.5
    },
    itemColumn: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        borderBottomWidth: 0.5
    },
    itemTitle: {
        fontSize: 18, 
        padding: 12, 
        fontWeight: "bold",
        textAlign: "left",
    },
    itemValue: {
        fontSize: 18, 
        padding: 12, 
        textAlign: "left",
    },
    button: {
        height: 45,
        padding: 10,
        marginVertical: 12,
        borderRadius: 4,
        alignSelf: "center",
        backgroundColor: "skyblue"
    },
    listForward: {
        padding: 5,
        width: "10%"
    },

    h1: {
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 18,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0.25,
        color: colors.black
    },
    h2: {
        width: "100%",
        fontSize: 18, 
        fontWeight: "bold",
        padding: 5, 
    },
    indicator: {
        position: 'absolute',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    modal: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalInner: {
        marginHorizontal: 20,
        backgroundColor: 'white'
    },

    title: {
        height: 28,
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 24,
        fontWeight: "600",
        fontStyle: "normal",
        lineHeight: 28,
        letterSpacing: 0.33,
        marginLeft: 20,
        color: colors.black
    },

    headerTitle: {
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 20,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0.28,
        color: colors.black
    },

    subTitle: {
        lineHeight: 30,
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 24,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0.28,
        textAlign: "left",
        color: colors.black
    },

    borderWrapper: {
        height: 36,
        borderRadius: 3,
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: colors.black//"#d8d8d8"
    },

    borderUnderscore: {
        height: 36,
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: "#d8d8d8"
    },

    textInputWrapper : {
        marginRight: 10,
        paddingLeft: 10
    },

    textInput: {
        paddingTop: 9,
    }, 

    normal12Text: {
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 19,
        letterSpacing: 0.15,
        textAlign: "center",
        color: colors.black,
        padding: 0,
        margin: 0
    },
    bold12Text: {
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 12,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0.17,
        color: colors.warmGrey,
        padding: 0,
        margin: 0
    },
    normal14Text: {
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 16,
        letterSpacing: -0.03,
        color: colors.black,
        padding: 0,
        margin: 0
    },
    normal15Text: {
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 15,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: -0.03,
        color: colors.black,
        padding: 0,
        margin: 0
    },
    bold14Text: {
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 14,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 19,
        letterSpacing: -0.03,
        color: colors.black,
        padding: 0,
        margin: 0
    },
    roboto16Text: {
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 19,
        letterSpacing: 0.22,
        color: colors.black,
        padding: 0,
        margin: 0
    },
    normal16Text: {
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 16,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0.22,
        color: colors.black,
        padding: 0,
        margin: 0
    },
    bold16Text: {
        //        fontFamily: "AppleSDGothicNeo",
        fontSize: 16,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 19,
        letterSpacing: -0.03,
        color: colors.black,
        padding: 0,
        margin: 0
    },    
    normal18Text: {
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 18,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0.25,
        color: colors.black,
        padding: 0,
        margin: 0
    },
    normal20Text: {
        // fontFamily: "Roboto",
        fontSize: 20,
        fontStyle: "normal",
        lineHeight: 24,
        letterSpacing: 0.19,
        color: colors.black,
        padding: 0,
        margin: 0
    },
    normal22Text: {
        // fontFamily: "Roboto",
        fontSize: 22,
        fontStyle: "normal",
        lineHeight: 24,
        letterSpacing: 0.33,
        color: colors.black,
        padding: 0,
        margin: 0
    },    
    mobileNo: {
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0.22,
        color: colors.black
    },
    price: {
        fontFamily: "Roboto-Bold",
        fontSize: 22,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 24,
        letterSpacing: 0.21,
        textAlign: "right",
        color: colors.black
    },
    bold18Text: {
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 18,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0.25,
        color: colors.black,
        padding: 0,
        margin: 0
    },
    bold30Text: {
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 30,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0.29,
        lineHeight: 30,
        color: colors.black,
        padding: 0,
        margin: 0
    },
    confirm: {
        height: 52,
        backgroundColor: colors.clearBlue
    },
    confirmText: {
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 18,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0.25,
        color: colors.white,
        textAlign: 'center'
    }
})

export const htmlWithCss = (title, body) => {
    return `
<html>
<head>
<title>${title}</title>
<style>
h2 {
  font-size: 60px;
}
h3 {
  font-size: 55px;
}
h4 {
  font-size: 45px;
}
p, li, table {
  font-size: 40px;
}
.main-content {
  padding: 30px;
}
td {
  padding: 10px 20px;
}
</style>
</head>
<body>
<div class="main-content">
${body}
</div>
</body>
</html>
`}

export const htmlDetailWithCss = (body, script = '') => {
    return `
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>

    @font-face {
        font-family: NotoSansKR;
        font-style: normal;
        font-weight: 100;
        src: url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Thin.woff2) format('woff2'),
        url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Thin.woff) format('woff'),
        url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Thin.otf) format('opentype');
    }
    
    @font-face {
        font-family: NotoSansKR;
        font-style: normal;
        font-weight: 300;
        src: url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Light.woff2) format('woff2'),
        url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Light.woff) format('woff'),
        url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Light.otf) format('opentype');
    }
    
    @font-face {
        font-family: NotoSansKR;
        font-style: normal;
        font-weight: 400;
        src: url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Regular.woff2) format('woff2'),
        url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Regular.woff) format('woff'),
        url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Regular.otf) format('opentype');
    }
    
    @font-face {
        font-family: NotoSansKR-Medium;
        font-style: normal;
        font-weight: 500;
        src: url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Medium.woff2) format('woff2'),
        url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Medium.woff) format('woff'),
        url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Medium.otf) format('opentype');
    }
    
    @font-face {
        font-family: NotoSansKR;
        font-style: normal;
        font-weight: bold;
        src: url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Bold.woff2) format('woff2'),
        url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Bold.woff) format('woff'),
        url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Bold.otf) format('opentype');
    }
    
    
    @font-face {
        font-family: NotoSansKR;
        font-style: normal;
        font-weight: 900;
        src: url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Black.woff2) format('woff2'),
        url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Black.woff) format('woff'),
        url(//fonts.gstatic.com/ea/notosanskr/v2/NotoSansKR-Black.otf) format('opentype');
    }

    .main-title {
        font-family: NotoSansKR;
        font-size: 24px;
        color: ${colors.clearBlue};
        padding-bottom: 15px;
        margin-bottom: 10%;
        font-weight: bold;
        border-bottom: 3px solid ${colors.clearBlue};
    }
    .sub-title {
        font-family: NotoSansKR;
        font-size: 18px;
        padding: 0px;
        margin-bottom: 20px;
        font-weight: bold;
    }
    .content {
        font-family: NotoSansKR;
        font-size: 15px;
        margin-bottom: 30px;
    }
    .content .padding20Img img{
        margin: 20px 0px;
    }
    // #caution, #prodInfo, #tip
    .warmGrey {
        color: ${colors.warmGrey};
    }
    .tab {
        line-height: 1.6;
    }
    .tab div:not(.noMargin) {
        margin-left: 20px;
        margin-right: 20px;
    }
    .noMargin {
        margin-bottom: 66px;
    }
    .blueBox, .copyBox, .moveToBox {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;   
    }
    .blueBox {
        height: 50px;
        border-radius: 5px 5px 0px 0px;
        background-color: ${colors.clearBlue};
        color: ${colors.white};
    }
    .blueBox font{
        font-family: NotoSansKR-Medium;
        font-size: 20px;
    }
    .copyBox {
        height: 114px;
        background-color: ${colors.white};
        border: 1px solid ${colors.greyish};
        border-top-width: 0px;
        padding: 0px 20px;
    }
    .copyImg {
        width: 7%;
    }
    .copyBox font {
        font-family: NotoSansKR;
        font-size: 16px;
        line-height: normal;
    }
    .copyBtn{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        width: 55px;
        color: ${colors.warmGrey};
        border: solid 1px ${colors.whiteThree};
        background-color: ${colors.whiteTwo};
    }
    .copyTextLine {
        margin: 20px;
    }
    // .copyTextLine font{
    //     line-height: 60px;
    // }
    .moveToBox {
        font-size: 24px;
        height: 56px;
        border-radius: 0px 0px 5px 5px;
        background-color: ${colors.white};
        border: 1px solid ${colors.greyish};
        border-top-width: 0px;
    }
    .moveToBox button{
        width: 100%; 
        height: 100%;
        font-size: 16px;
        border: none;
    }
    .moveToBox img {
        width: 4%;
        margin-left: 5px;
        color: ${colors.black}
    }
    .settings {
        margin-top: 40px;
        margin-bottom: 40px;
    }
    .padding20Img {
        background-color: ${colors.paleGrey};
        padding: 20px;
    }
    .padding40Img {
        background-color: ${colors.paleGrey};
        padding: 20px;
    }
    .padding40Img img {
        margin: 20px 0px;
    }
    #iosLogo {
        width: 6%;
        margin: 20px;
    }
    #andLogo {
        width: 8%;
        margin: 20px;
    }
    .contentFont14{
        font-size: 14px;
    }
    #arrowDown {
        width: 10%;
        display: block;
        margin: 0 auto;
    }
    .noBackgroundImg {
        background-color: ${colors.white}
        margin-left: 30px;
        margin-right: 30px;
        margin-bottom: 66px;
    }
    .settings.${Platform.OS == 'ios' ? 'android' : 'ios'} {
        display: none;
    }
    </style>
    ${script}
    </head>
    <body>
    ${body}
    </body>
    </html>
`}