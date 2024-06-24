import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {SocialLoginHistType} from '.';
import AppText from '../AppText';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  triangle: {
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 11,
    borderBottomColor: 'rgba(44, 44, 44, 0.92)',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  textFrame: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(44, 44, 44, 0.92)',
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
}: {
  socialLoginHist: SocialLoginHistType;
}) => {
  const position = useMemo(() => {
    switch (true) {
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
  }, [socialLoginHist]);

  return (
    <View style={{...styles.container, alignItems: position}}>
      <View
        style={{
          ...styles.triangle,
          marginLeft: position === 'flex-start' ? 20 : 0,
          marginRight: position === 'flex-end' ? 20 : 0,
        }}
      />
      <View style={styles.textFrame}>
        <AppText style={styles.text}>{i18n.t('socialLogin:hist')}</AppText>
      </View>
    </View>
  );
};
export default memo(LoginToolTip);
