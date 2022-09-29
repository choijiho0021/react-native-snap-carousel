/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import React, {memo, useMemo} from 'react';
import {View, Image, ViewStyle, StyleProp} from 'react-native';
import _ from 'underscore';
import AppSvgIcon from './AppSvgIcon';

const tabbarPath = '../assets/images/tabbar/';
const mainPath = '../assets/images/main/';
const headerPath = '../assets/images/header/';
const paymentPath = '../assets/images/payment/';
const esimPath = '../assets/images/esim/';
const guidePath = '../assets/images/guide/';
const invitePath = '../assets/images/invite/';
const giftPath = '../assets/images/gift/';
const mypagePath = '../assets/images/mypage/';

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
  iconArrowRightBlack: [require(`${mainPath}iconArrowRightBlack.png`)],
  iconArrowRightBlue: [require(`${mainPath}iconArrowRightBlue.png`)],
  iconArrowLeftWhite: [require(`${mainPath}iconArrowLeftWhite.png`)],
  iconNotice: [require(`${mainPath}iconNotice.png`)],
  btnNotice: [require(`${mainPath}btnNotice.png`)],
  imgCheck: [require(`${mainPath}imgCheck.png`)],
  imgFail: [require(`${mainPath}imgFail.png`)],
  imgPeople: [require(`${mainPath}imgPeople.png`)],
  imgCard1: [require(`${mainPath}imgCard1.png`)],
  imgCard2: [require(`${mainPath}imgCard2.png`)],
  imgCard3: [require(`${mainPath}imgCard3.png`)],
  imgDokebi: [require(`${mainPath}imgDokebi.png`)],
  iconTrash: [require(`${mainPath}iconTrash.png`)],
  btnSearchOn: [require(`${mainPath}btnSearchOn.png`)],
  btnSearchCancel: [require(`${mainPath}btnSearchCancel.png`)],
  btnSearchOff: [require(`${mainPath}btnSearchOff.png`)],
  btnSearchBlue: [require(`${mainPath}btnSearchBlue.png`)],
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
  btnSearchTop: [require(`${headerPath}btnSearchTop.png`)],

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
  specialTip: [require(`${guidePath}iconHoney.png`)],
  imgAlarm: [require(`${esimPath}imgAlarm.png`)],
  btnQr: [require(`${esimPath}btnQr.png`)],
  btnQr2: [require(`${esimPath}btnQr2.png`)],
  btnPen: [require(`${esimPath}btnPen.png`)],
  btnUsage: [require(`${esimPath}btnUsage.png`)],
  naverIcon: [require(`${esimPath}naverIcon.png`)],
  hkIcon: [require(`${esimPath}hkIcon.png`)],
  cautionIcon: [require(`${esimPath}cautionIcon.png`)],
  btnChargeable: [require(`${esimPath}btnChargeable.png`)],
  btnNonChargeable: [require(`${esimPath}btnNonChargeable.png`)],
  imgDokebi2: [require(`${esimPath}imgDokebi2.png`)],
  imgNotiDokebi: [require(`${esimPath}imgNotiDokebi.png`)],
  rokIcon: [require(`${esimPath}icon.png`)],
  emptyCart: [require(`${esimPath}imgCart.png`)],
  emptyESIM: [require(`${esimPath}img_airplane.png`)],
  usageU: [require(`${esimPath}usageU.png`)],
  usageR: [require(`${esimPath}usageR.png`)],
  imgFaq: [require(`${esimPath}imgFaq.png`)],
  imgGuide: [require(`${esimPath}imgGuide.png`)],
  kakaoChannel: [require(`${esimPath}kakaoChannel.png`)],
  imgBoard: [require(`${esimPath}imgBoard.png`)],

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
