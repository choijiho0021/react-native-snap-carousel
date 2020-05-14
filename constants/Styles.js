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
    // <script>
    // function ChangeImageSrc() {
    //     var images = document.getElementsByClassName("prodImage")[0];
    //     // var images = div.getElementsByTagName("img");

    //     for (var i = 0; i < images.length; i++) {
    //         console.log('@@imagelength', i)
    //         images[i].setAttribute("src", '../assets/images/productDetail/img-1.png');
    //     }
    // }

    // window.onload = ChangeImageSrc;
    // </script>
export const htmlDetailWithCss = (body) => {
    return `
    <html>
    <head>
    <style>
    .main-title {
        font-size: 60px;
        color: ${colors.clearBlue};
        padding-bottom: 15px;
        margin-bottom: 80px;
        margin-top: 70px;
        border-bottom: 10px solid ${colors.clearBlue};
    }
    .sub-title {
        font-size: 50px;
        padding: 0px;
        margin-bottom: 20px;
    }
    .content {
        font-size: 40px;
        margin-bottom: 100px;
    }
    .caution, .ProdInfo, #tip {
        padding: 20px;
        line-height: 1.6;
    }
    .Tip {
        padding: 20px;
        line-height: 1.6;
    }
    #prodImg {
        background-color: ${colors.paleGrey};
        padding-top: 35px;
        padding-bottom: 40px !important;
        margin-bottom: 70px;
    }
    .settings{
        border-radius: 5px;
    }    
    .blueBox, .copyBox {
        text-align: center;

        // display: flex;
        // flex-direction: 'column';
        // border-radius: 5px;
        // justify-content: 'center';
        // align-self: 'center';        
    }
    .blueBox {
        height: '5%';
        background-color: ${colors.clearBlue};
    }
    .copyBox {
        background-color: ${colors.white};
        padding: 30px;
        height: 120px;
        vertical-align: middle;
    }
    .settings img {
        dispay: inline-block;
        width=4%;
        background-color: '#B404AE';
        padding: 0px;
    }
    .blueBox img {

    }
    #copyLogo {
        width=4%;
        height=17%;
    }
    .padding20Img {
        background-color: ${colors.paleGrey};
        padding: 40px;
        padding-bottom: 80px;
        margin-bottom: 120px;
    }
    img {
        padding-top: 80px;
        padding-bottom: 80px;

    }
    .noBackgroundImg {
        background-color: ${colors.white}
        margin-left: 60px;
        margin-right: 60px;
    }
    </style>
    </head>
    <body>
    ${body}
    </body>
    </html>
`}