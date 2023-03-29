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

  kakao: [require(`${paymentPath}logoKakao.png`)],
  naver: [require(`${paymentPath}logoNaver.png`)],
  payco: [require(`${paymentPath}logoPayco.png`)],
  ssgpay: [require(`${paymentPath}logoSsg.png`)],
  toss: [require(`${paymentPath}logoToss.png`)],
  lpay: [require(`${paymentPath}logoLpay.png`)],

  guideHomeLogo: [require(`${esimPath}logoHomeGuide.png`)],
  guideModalIcon: [require(`${esimPath}iconGuideModal.png`)],

  inviteRokebi1: [require(`${invitePath}inviteRokebi1.png`)],
  inviteRokebi2: [require(`${invitePath}inviteRokebi2.png`)],
  iconShare: [require(`${invitePath}iconShare.png`)],
  iconCopy: [require(`${invitePath}iconCopy.png`)],
  coin: [require(`${invitePath}coin.png`)],
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
