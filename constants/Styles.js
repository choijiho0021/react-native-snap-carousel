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
        height: 21,
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
        height: 24,
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 20,
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
        borderColor: "#d8d8d8"
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
        color: colors.black
    },
    bold12Text: {
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 12,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0.17,
        color: colors.warmGrey
    },
    normal14Text: {
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 16,
        letterSpacing: -0.03,
        color: colors.black
    },
    bold14Text: {
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 14,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 19,
        letterSpacing: -0.03,
        color: colors.black
    },
    roboto16Text: {
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 19,
        letterSpacing: 0.22,
        color: colors.black
    },
    normal16Text: {
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 16,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0.22,
        color: colors.black
    },
    bold16Text: {
        //        fontFamily: "AppleSDGothicNeo",
                fontSize: 16,
                fontWeight: "bold",
                fontStyle: "normal",
                lineHeight: 19,
                letterSpacing: -0.03,
                color: colors.black
            },    
    normal18Text: {
//        fontFamily: "AppleSDGothicNeo",
        fontSize: 18,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0.25,
        color: colors.black
    },
    normal20Text: {
        // fontFamily: "Roboto",
        fontSize: 20,
        fontStyle: "normal",
        lineHeight: 24,
        letterSpacing: 0.19,
        color: colors.black
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
        color: colors.black
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
