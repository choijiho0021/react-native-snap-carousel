import {
    StyleSheet,
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

export const htmlDetailWithCss = (body) => {
    return `
    <html>
    <head>
    <style>
    .main-title {
      font-size: 60px;
      color: ${colors.clearBlue};
      padding-bottom: 20px;
      margin-bottom: 50;
      border-bottom:10px solid ${colors.clearBlue};
    }
    .sub-title {
      font-size: 40px;
      padding: 0px;
    }
    .content {
      font-size: 30px;
      margin-bottom: 80px;
      padding: 0px;
    }
    .caution {
        padding : 40px;
    }
    .tip {
        padding : 40px;
    }
    .
    </style>
    </head>
    <body>
    ${body}
    </body>
    </html>
`}