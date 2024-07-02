import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SocialLoginHistType} from '.';
import AppText from '../AppText';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppSvgIcon from '../AppSvgIcon';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  textFrame: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 3,
  },
  text: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.white,
  },
});

const LoginToolTip = ({
  socialLoginHist,
  fromNaver,
}: {
  socialLoginHist: SocialLoginHistType;
  fromNaver: boolean;
}) => {
  const position = useMemo(() => {
    switch (true) {
      case fromNaver:
        return 'center';
      case socialLoginHist?.kakao:
        return 'flex-start';
      case socialLoginHist?.naver:
        return 'center';
      case socialLoginHist?.apple:
      case socialLoginHist?.google:
        return 'flex-end';
      default:
        return 'center';
    }
  }, [fromNaver, socialLoginHist]);

  return (
    <View style={{...styles.container, alignItems: position}}>
      <AppSvgIcon
        name={fromNaver ? 'arrowUpGreen12' : 'arrowUpBlack12'}
        style={{
          marginLeft: position === 'flex-start' ? 20 : 0,
          marginRight: position === 'flex-end' ? 20 : 0,
        }}
      />
      <View
        style={{
          ...styles.textFrame,
          backgroundColor: fromNaver ? colors.naverGreen : colors.black92,
        }}>
        <AppText style={styles.text}>
          {i18n.t(fromNaver ? 'socialLogin:from:naver' : 'socialLogin:hist')}
        </AppText>
      </View>
    </View>
  );
};
export default memo(LoginToolTip);
