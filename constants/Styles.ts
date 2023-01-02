import {StyleSheet, Platform, ViewStyle} from 'react-native';
import {isDeviceSize} from './SliderEntry.style';
import {colors} from './Colors';
import {StyledText} from '@/components/AppTextJoin';

export const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomWidth: 0.5,
  },
  itemColumn: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
  },
  itemTitle: {
    fontSize: 18,
    padding: 12,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  itemValue: {
    fontSize: 18,
    padding: 12,
    textAlign: 'left',
  },
  button: {
    height: 45,
    padding: 10,
    marginVertical: 12,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: 'skyblue',
  },
  listForward: {
    padding: 5,
    width: '10%',
  },

  h1: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0.25,
    color: colors.black,
  },
  h2: {
    width: '100%',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
  },
  indicator: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  title: {
    height: 28,
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 24,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 28,
    letterSpacing: 0.33,
    marginLeft: 20,
    color: colors.black,
  },

  header: {
    flexDirection: 'row',
    height: 44,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  headerTitle: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 20,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0.28,
    color: colors.black,
  },

  subTitle: {
    lineHeight: 30,
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 24,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0.28,
    textAlign: 'left',
    color: colors.black,
  },

  borderWrapper: {
    height: 36,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.black, // "#d8d8d8"
  },

  borderUnderscore: {
    height: 36,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#d8d8d8',
  },

  textInputWrapper: {
    marginRight: 10,
    paddingLeft: 10,
  },

  textInput: {
    paddingTop: 9,
  },

  normal12Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 19,
    letterSpacing: 0.15,
    textAlign: 'center',
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  normal13: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 19,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  medium13: {
    // fontFamily: "AppleSDGothicNeo",
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
  },
  bold12Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0.17,
    color: colors.warmGrey,
    padding: 0,
    margin: 0,
  },
  medium14: {
    // fontFamily: "AppleSDGothicNeo",
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
  },
  normal14Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: -0.03,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  normal15Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.03,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  medium16: {
    // fontFamily: "AppleSDGothicNeo",
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
  },
  bold13Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 13,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 19,
    letterSpacing: -0.03,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  semiBold13Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  bold14Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 19,
    letterSpacing: -0.03,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  roboto16Text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 19,
    letterSpacing: 0.22,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  normal16Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0.22,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  bold15Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  bold16Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.black,
    padding: 0,
    margin: 0,
    marginRight: 8,
  },
  semiBold16Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  bold17: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 17,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  normal17: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 17,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0.25,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  normal18Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0.25,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  normal20Text: {
    // fontFamily: "Roboto",
    fontSize: 20,
    fontStyle: 'normal',
    // lineHeight: 24,
    letterSpacing: 0.19,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  normal22Text: {
    // fontFamily: "Roboto",
    fontSize: 22,
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0.33,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  normal24: {
    // fontFamily: "Roboto",
    fontSize: 24,
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0.33,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  mobileNo: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0.22,
    color: colors.black,
  },
  price: {
    fontFamily: 'Roboto-Bold',
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0.21,
    textAlign: 'right',
    color: colors.black,
  },
  bold18Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0.25,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  bold20Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0.25,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  bold22Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0.25,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  semiBold20Text: {
    // fontFamily: "AppleSDGothicNeo",
    fontSize: 20,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
  },
  extraBold12: {
    // fontFamily: 'AppleSDGothicNeo',
    fontSize: 12,
    fontWeight: '800',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: 'left',
  },
  extraBold20: {
    // fontFamily: 'AppleSDGothicNeo',
    fontSize: 20,
    fontWeight: '800',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'left',
  },
  extraBold24: {
    // fontFamily: 'AppleSDGothicNeo',
    fontSize: 24,
    fontWeight: '800',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'left',
  },
  bold24Text: {
    // fontFamily: "AppleSDGothicNeo",
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.black,
  },

  semiBold24Text: {
    // fontFamily: "AppleSDGothicNeo",
    fontSize: 24,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 30,
    letterSpacing: 0,
  },
  bold26Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 26,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0.29,
    // lineHeight: 30,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  bold28Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0.29,
    // lineHeight: 30,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  bold30Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 30,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0.29,
    // lineHeight: 30,
    color: colors.black,
    padding: 0,
    margin: 0,
  },
  bold32Text: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0.29,
    lineHeight: 40,
  },
  robotoBold16Text: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.clearBlue,
  },
  robotoBold32Text: {
    fontFamily: 'Roboto',
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.clearBlue,
  },
  robotoBold36Text: {
    fontFamily: 'Roboto',
    fontSize: 36,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 42,
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.black,
  },
  robotoBold38: {
    fontFamily: 'Roboto',
    fontSize: 38,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 45,
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.black,
  },
  confirm: {
    height: 52,
    backgroundColor: colors.clearBlue,
  },
  medium18: {
    //        fontFamily: "AppleSDGothicNeo",
    fontSize: 18,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0.25,
    color: colors.white,
    textAlign: 'center',
  },
  robotoMedium16Text: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.black,
  },
  underline: {
    borderStyle: 'solid',
    borderBottomWidth: 10,
    borderBottomColor: '#b8d1f5',
  },
});

// document.body.clientWidth : 화면의 너비
// document.documentElement.clientHeight : 문서의 총 높이
// getBoundingClientRect().y : 각 div의 시작 위치 y position

const basicScript = `<script>
window.onload = function () {
  window.location.hash = 1;
  var cmd = {
    key: 'dimension',
    value: document.body.clientWidth + ',' + document.documentElement.clientHeight + ',' + 
      ['prodInfo', 'tip', 'caution'].map(item => {
        var rect = document.getElementById(item).getBoundingClientRect();
        return rect.y;
      }).join(',')
    };
  window.ReactNativeWebView.postMessage(JSON.stringify(cmd));
}
function copy(CopyTxtNumber) {
  var copyTxt = document.getElementById('copyTxt' + CopyTxtNumber).firstChild.innerHTML;
  var txtArea = document.createElement("textarea");
  document.body.appendChild(txtArea);
  txtArea.value = copyTxt;
  txtArea.select();
  document.execCommand("copy");
  document.body.removeChild(txtArea);

  var cmd = {
    key: 'copy'
  }  
  window.ReactNativeWebView.postMessage(JSON.stringify(cmd));
}
function go(key , className){
  var cmd = {
    key: key,
    value: document.getElementsByClassName(className)[0].getAttribute('value')
  };
  window.ReactNativeWebView.postMessage(JSON.stringify(cmd));
}
function send() {
  window.ReactNativeWebView.postMessage('APN Value have to insert into this', '*');
  window.alert('copy');
}
</script>`;

export const htmlWithCss = (title, body) => {
  return `
<html>
<head>
<title>${title}</title>
<style>
h2 {
  font-size: 60px;
  font-family: "맑은 고딕";
}
h3 {
  font-size: 55px;
  font-family: "맑은 고딕";
}
h4 {
  font-size: 45px;
  font-family: "맑은 고딕";
}
p, li, table {
  font-size: 40px;
  font-family: "맑은 고딕";

}
.main-content {
  padding: 30px;
}
td {
  padding: 10px 20px;
}
.Table {
    margin: 0 auto;
}
</style>
</head>
<body>
<div class="main-content">
${body}
</div>
</body>
</html>
`;
};

export const htmlDetailWithCss = (body, script = basicScript) => {
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

    li {
      color: ${colors.warmGrey};
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
        margin-bottom: 30px;
    }
    .tab div:not(.noMargin) {
        margin-left: 20px;
        margin-right: 20px;
    }
    .noMargin {
        margin-bottom: 30px;
    }
    .blueBox, .copyBox,  .moveToBox {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .blueBox {
        height: 50px;
        border-radius: 5px 5px 0px 0px;
        background-color: ${colors.clearBlue};
        padding-right: 10px;
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
        border-bottom-width:0px;
        justify-content: space-between;
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
        // display: flex;
        margin-right: 20px;
        justify-content: flex-end;
        align-items: center;
        height: 40px;
        width: 55px;
        color: ${colors.warmGrey};
        border: solid 1px ${colors.whiteThree};
        background-color: ${colors.whiteTwo};
    }
    .copyBtn:active{
        background-color: ${colors.whiteThree};
    }
    .copyTextLine {
        // margin-right: 20px;
        justify-content: flex-start;
    }
    .copyTextLine font{
        line-height: 60px;
        font-size: ${isDeviceSize('small') ? '9px' : '14px'};
    }
    .moveToBox {
        font-size: 24px;
        height: 56px;
        border-radius: 0px 0px 5px 5px;
        background-color: ${colors.white};
        border: 1px solid ${colors.greyish};
        // border-top-width: 0px;
    }
    .moveToBox button{
        width: 100%; 
        height: 100%;
        background-color: ${colors.white};
        font-size: 16px;
        border: none;
    }
    .moveToBox button:active{
        background-color: ${colors.whiteThree};
    }
    .moveToBox button:focus{
        outline: none;
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
    .settings.${Platform.OS === 'ios' ? 'android' : 'ios'} {
        display: none;
    }
    .horizontalLine {
      border-bottom: 1px solid black;
      border-top: 1px solid black;
      border-collapse: collapse;
    }
    </style>
    ${script}
    </head>
    <body>
    ${body}
    </body>
    </html>
`;
};

export const formatText = (
  key: string,
  {text, textStyle, viewStyle}: StyledText,
  style?: ViewStyle,
): StyledText[] => {
  const idx = text.indexOf(`<${key}>`);
  const idx2 = text.indexOf(`</${key}>`);
  if (idx >= 0 && idx2 > idx) {
    return [
      {
        text: text.substring(0, idx),
        viewStyle: style,
      },
      {
        text: text.substring(idx + key.length + 2, idx2),
        textStyle,
        viewStyle,
      },
    ]
      .concat(
        formatText(
          key,
          {
            text: text.substring(idx2 + key.length + 3),
            textStyle,
            viewStyle,
          },
          style,
        ),
      )
      .filter((t) => !!t.text);
  }

  return [{text, viewStyle: style}];
};
