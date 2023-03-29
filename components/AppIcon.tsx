/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import React, {memo, useMemo} from 'react';
import {View, Image, ViewStyle, StyleProp} from 'react-native';
import _ from 'underscore';
import AppSvgIcon from './AppSvgIcon';

const mainPath = '../assets/images/main/';
const paymentPath = '../assets/images/payment/';
const esimPath = '../assets/images/esim/';
const invitePath = '../assets/images/invite/';
const giftPath = '../assets/images/gift/';
const mypagePath = '../assets/images/mypage/';

const images: Record<string, any[]> = {
  imgMark: [require(`${mainPath}imgMark.png`)],

  updateImg: [require(`${mainPath}update.png`)],
  btnCheck: [
    require(`${mainPath}btnCheckNon.png`),
    require(`${mainPath}btnCheckSel.png`),
  ],
  iconCheckSmall: [require(`${mainPath}iconCheckSmall.png`)],
  openKakao: [require(`${mainPath}imgKakao.png`)],
  openKakaoEng: [require(`${mainPath}imgKakaoEng.png`)],
  openFacebook: [require(`${mainPath}imgFacebook.png`)],
  openFacebookEng: [require(`${mainPath}imgFacebookEng.png`)],
  textLogo: [require(`${mainPath}rokebiLogoText1ColorEn.png`)],
  kakaoLogin: [require(`${mainPath}img_kakao.png`)],
  appleLogin: [require(`${mainPath}img_apple.png`)],
  naverLogin: [require(`${mainPath}LoginImgNaver.png`)],
  facebookLogin: [require(`${mainPath}LoginImgFacebook.png`)],
  googleLogin: [require(`${mainPath}LoginImgGoogle.png`)],
  imgRokebiChar: [require(`${mainPath}imgRokebiChar.png`)],
  imgQuestion: [require(`${mainPath}imgQuestion.png`)],
  radioBtn: [
    require(`${mainPath}radioBtn.png`),
    require(`${mainPath}radioBtnCheck.png`),
  ],
  kakao: [require(`${paymentPath}logoKakao.png`)],
  naver: [require(`${paymentPath}logoNaver.png`)],
  payco: [require(`${paymentPath}logoPayco.png`)],
  samsung: [require(`${paymentPath}logoSamsung.png`)],
  ssgpay: [require(`${paymentPath}logoSsg.png`)],
  toss: [require(`${paymentPath}logoToss.png`)],
  lpay: [require(`${paymentPath}logoLpay.png`)],
  paypal: [require(`${paymentPath}logo_paypal.png`)],
  guideHomeLogo: [require(`${esimPath}logoHomeGuide.png`)],
  guideModalIcon: [require(`${esimPath}iconGuideModal.png`)],
  imgAlarm: [require(`${esimPath}imgAlarm.png`)],
  btnPen: [require(`${esimPath}btnPen.png`)],
  naverIcon: [require(`${esimPath}naverIcon.png`)],
  btnReload: [require(`${esimPath}btnReload.png`)],
  imgNotiDokebi: [require(`${esimPath}imgNotiDokebi.png`)],
  rokIcon: [require(`${esimPath}icon.png`)],
  emptyCart: [require(`${esimPath}imgCart.png`)],
  emptyESIM: [require(`${esimPath}img_airplane.png`)],
  usageU: [require(`${esimPath}usageU.png`)],
  usageR: [require(`${esimPath}usageR.png`)],
  imgFaq: [require(`${esimPath}imgFaq.png`)],
  imgGuide: [require(`${esimPath}imgGuide.png`)],

  inviteRokebi1: [require(`${invitePath}inviteRokebi1.png`)],
  inviteRokebi2: [require(`${invitePath}inviteRokebi2.png`)],
  iconShare: [require(`${invitePath}iconShare.png`)],
  iconCopy: [require(`${invitePath}iconCopy.png`)],
  coin: [require(`${invitePath}coin.png`)],
  arrowRight: [require(`${giftPath}arrowRight.png`)],
  arrowLeft: [require(`${giftPath}arrowLeft.png`)],
  inviteBanner: [require(`${invitePath}banner_img.png`)],
  giftModalBg: [require(`${giftPath}img_bg.png`)],
  giftGuideTop: [require(`${giftPath}img_top.png`)],
  giftGuideStep1: [require(`${giftPath}img_step1.png`)],
  giftGuideStep2: [require(`${giftPath}img_step2.png`)],
  giftGuideStep3: [require(`${giftPath}img_step3.png`)],
  giftCoin: [require(`${giftPath}coin.png`)],
  profileImg: [require(`${mypagePath}img_rokebi_profile_2.png`)],
};

interface AppIconProps {
  name: string;
  focused?: boolean;
  style?: StyleProp<ViewStyle>;
  size?: number | number[];
  checked?: boolean;
}

const AppIcon: React.FC<AppIconProps> = ({
  name,
  focused,
  style,
  size,
  checked,
}) => {
  const source = useMemo(() => images[name], [name]);
  const sz = useMemo(() => {
    if (typeof size === 'number') return {width: size, height: size};
    if (_.isArray(size) && size.length === 2)
      return {width: size[0], height: size[1]};
    return undefined;
  }, [size]);

  return source ? (
    <View style={style || {justifyContent: 'center', alignItems: 'center'}}>
      <Image
        resizeMode="cover"
        style={sz}
        source={
          (focused || checked) && source.length > 1 ? source[1] : source[0]
        }
      />
    </View>
  ) : (
    <AppSvgIcon name={name} focused={focused || checked} style={style} />
  );
};

export default memo(AppIcon);
