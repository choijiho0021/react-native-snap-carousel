/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import React, {memo} from 'react';
import {View, Image, ViewStyle, StyleProp} from 'react-native';

const tabbarPath = '../assets/images/tabbar/';
const mainPath = '../assets/images/main/';
const headerPath = '../assets/images/header/';
const paymentPath = '../assets/images/payment/';
const esimPath = '../assets/images/esim/';
const guidePath = '../assets/images/guide/';
const images: Record<string, any[]> = {
  btnHome: [
    require(`${tabbarPath}btnHome.png`),
    require(`${tabbarPath}btnHomeSel.png`),
  ],
  btnStore: [
    // eslint-disable-next-line import/no-dynamic-require
    require(`${tabbarPath}btnStore.png`),
    require(`${tabbarPath}btnStoreSel.png`),
  ],
  btnCart: [
    require(`${tabbarPath}btnCart.png`),
    require(`${tabbarPath}btnCartSel.png`),
  ],
  btnUsim: [
    require(`${tabbarPath}btnUsim.png`),
    require(`${tabbarPath}btnUsimSel.png`),
  ],
  btnEsim: [
    require(`${tabbarPath}btnEsim.png`),
    require(`${tabbarPath}btnEsimSel.png`),
  ],
  btnMypage: [
    require(`${tabbarPath}btnMypage.png`),
    require(`${tabbarPath}btnMypageSel.png`),
  ],
  btnSetup: [
    require(`${tabbarPath}btnSetup.png`),
    require(`${tabbarPath}btnSetupSel.png`),
  ],
  btnCheck2: [
    require(`${mainPath}btnCheck2.png`),
    require(`${mainPath}btnCheck2Sel.png`),
  ],
  btnArrowRight2Blue: [require(`${mainPath}btnArrowRight2Blue.png`)],
  iconArrowRight: [require(`${mainPath}iconArrowRight.png`)],
  iconArrowUp: [require(`${mainPath}iconArrowUp.png`)],
  iconArrowDown: [require(`${mainPath}iconArrowDown.png`)],
  iconArrowRightWhite: [require(`${mainPath}iconArrowRightWhite.png`)],
  iconArrowRightBlue: [require(`${mainPath}iconArrowRightBlue.png`)],
  iconArrowLeftWhite: [require(`${mainPath}iconArrowLeftWhite.png`)],
  iconNotice: [require(`${mainPath}iconNotice.png`)],
  imgCheck: [require(`${mainPath}imgCheck.png`)],
  imgPeople: [require(`${mainPath}imgPeople.png`)],
  imgCard1: [require(`${mainPath}imgCard1.png`)],
  imgCard2: [require(`${mainPath}imgCard2.png`)],
  imgCard3: [require(`${mainPath}imgCard3.png`)],
  imgDokebi: [require(`${mainPath}imgDokebi.png`)],
  iconTrash: [require(`${mainPath}iconTrash.png`)],
  btnSearchOn: [require(`${mainPath}btnSearchOn.png`)],
  btnSearchOff: [require(`${mainPath}btnSearchOff.png`)],
  imgPeopleL: [require(`${mainPath}imgPeopleL.png`)],
  imgPeoplePlus: [require(`${mainPath}imgPeoplePlus.png`)],
  btnCancel: [require(`${mainPath}btnCancel.png`)],
  iconCamera: [require(`${mainPath}iconCamera.png`)],
  iconCameraCancel: [require(`${mainPath}iconCameraCancel.png`)],
  iconRefresh: [require(`${mainPath}iconRefresh.png`)],
  btnBoxCancel: [require(`${mainPath}btnBoxCancel.png`)],
  btnPhotoPlus: [require(`${mainPath}btnPhotoPlus.png`)],
  imgMark: [require(`${mainPath}imgMark.png`)],
  btnReply: [require(`${mainPath}btnReply.png`)],
  btnId: [require(`${mainPath}btnId.png`)],
  btnAlarm: [require(`${headerPath}btnAlarm.png`)],
  btnCnter: [require(`${headerPath}btnCnter.png`)],
  btnSearchTop: [require(`${headerPath}btnSearchTop.png`)],
  btnCheck: [
    require(`${mainPath}btnCheckNon.png`),
    require(`${mainPath}btnCheckSel.png`),
  ],
  openKakao: [require(`${mainPath}imgKakao.png`)],
  openKakaoEng: [require(`${mainPath}imgKakaoEng.png`)],
  openFacebook: [require(`${mainPath}imgFacebook.png`)],
  openFacebookEng: [require(`${mainPath}imgFacebookEng.png`)],
  textLogo: [require(`${mainPath}rokebiLogoText1ColorEn.png`)],
  kakaoLogin: [require(`${mainPath}LoginImgKako.png`)],
  appleLogin: [require(`${mainPath}LoginImgApple.png`)],
  naverLogin: [require(`${mainPath}LoginImgNaver.png`)],
  facebookLogin: [require(`${mainPath}LoginImgFacebook.png`)],
  imgRokebiChar: [require(`${mainPath}imgRokebiChar.png`)],
  imgQuestion: [require(`${mainPath}imgQuestion.png`)],
  kakao: [require(`${paymentPath}logoKakao.png`)],
  naver: [require(`${paymentPath}logoNaver.png`)],
  payco: [require(`${paymentPath}logoPayco.png`)],
  samsung: [require(`${paymentPath}logoSamsung.png`)],
  ssgpay: [require(`${paymentPath}logoSsg.png`)],
  toss: [require(`${paymentPath}logoToss.png`)],
  lpay: [require(`${paymentPath}logoLpay.png`)],
  specialTip: [require(`${guidePath}iconHoney.png`)],
  imgAlarm: [require(`${esimPath}imgAlarm.png`)],
  btnQr: [require(`${esimPath}btnQr.png`)],
  btnPen: [require(`${esimPath}btnPen.png`)],
  imgDokebi2: [require(`${esimPath}imgDokebi2.png`)],
  rokIcon: [require(`${esimPath}icon.png`)],
  emptyCart: [require(`${esimPath}imgCart.png`)],
  emptyESIM: [require(`${esimPath}imgAirplane.png`)],
};

interface AppIconProps {
  name: string;
  focused?: boolean;
  style?: StyleProp<ViewStyle>;
  size?: number;
  checked?: boolean;
}

const AppIcon: React.FC<AppIconProps> = ({
  name,
  focused,
  style,
  size,
  checked,
}) => {
  const source = images[name];

  return source ? (
    <View
      style={[
        style || {justifyContent: 'center', alignItems: 'center'},
        size ? {width: size, height: size} : undefined,
      ]}>
      <Image
        source={
          (focused || checked) && source.length > 1 ? source[1] : source[0]
        }
      />
    </View>
  ) : null;
};

export default memo(AppIcon);
