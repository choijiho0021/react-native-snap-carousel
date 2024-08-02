/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import React, {memo, useMemo} from 'react';
import {
  View,
  Image,
  ViewStyle,
  StyleProp,
  ImageResizeMode,
  ImageStyle,
} from 'react-native';
import _ from 'underscore';
import AppSvgIcon from './AppSvgIcon';

const mainPath = '../assets/images/main/';
const paymentPath = '../assets/images/payment/';
const esimPath = '../assets/images/esim/';
const invitePath = '../assets/images/invite/';
const giftPath = '../assets/images/gift/';

const images: Record<string, any[]> = {
  updateImg: [require(`${mainPath}update.png`)],
  earth: [require(`${mainPath}earth.png`)],
  rokebiLogo: [require(`${mainPath}rokebiLogo.png`)],

  kakao: [require(`${paymentPath}logoKakao.png`)],
  naver: [require(`${paymentPath}logoNaver.png`)],
  payco: [require(`${paymentPath}logoPayco.png`)],
  ssgpay: [require(`${paymentPath}logoSsg.png`)],
  toss: [require(`${paymentPath}logoToss.png`)],
  lpay: [require(`${paymentPath}logoLpay.png`)],

  guideHomeLogo: [require(`${esimPath}logoHomeGuide.png`)], // filter element를 사용하고 있어서 SVG로 대체 불가
  guideModalIcon: [require(`${esimPath}iconGuideModal.png`)],

  coin: [require(`${invitePath}coin.png`)], // filter element included
  inviteBanner: [require(`${invitePath}banner_img.png`)],

  giftModalBg: [require(`${giftPath}img_bg.png`)],
  giftGuideTop: [require(`${giftPath}img_top.png`)],
  giftGuideStep1: [require(`${giftPath}img_step1.png`)],
  giftGuideStep2: [require(`${giftPath}img_step2.png`)],
  giftGuideStep3: [require(`${giftPath}img_step3.png`)],
  giftGuideStep4: [require(`${giftPath}img_step4.png`)],
  gift: [require(`${giftPath}img_gift.png`)],
  fortuneBtnSmall: [require(`${esimPath}banner_lucky_s.png`)],
  fortuneBtnBig: [require(`${esimPath}banner_lucky_l.png`)],
  loadingLucky: [require(`${esimPath}loading_lucky.png`)],
  mainLucky: [require(`${esimPath}main_lucky.png`)],

  DeviceRegN: [require(`${esimPath}Device_reg_N.png`)],
  DeviceRegR: [require(`${esimPath}Device_reg_R.png`)],
  DeviceRegE: [require(`${esimPath}Device_reg_E.png`)],
  DeviceRegDE: [require(`${esimPath}Device_reg_E.png`)],
  DeviceRegD: [require(`${esimPath}Device_reg_D.png`)],
  oneTouch: [require(`${esimPath}oneTouch.png`)],
};

interface AppIconProps {
  name: string;
  focused?: boolean;
  style?: StyleProp<ViewStyle>;
  imgStyle?: StyleProp<ImageStyle>;
  size?: number | number[];
  checked?: boolean;
  mode?: ImageResizeMode;
}

const AppIcon: React.FC<AppIconProps> = ({
  name,
  focused,
  style,
  imgStyle,
  size,
  checked,
  mode,
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
        resizeMode={mode || 'cover'}
        style={[sz, imgStyle]}
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
