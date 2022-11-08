import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';

const styles = StyleSheet.create({
  notice: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    marginVertical: 24,
    flexDirection: 'row',
  },
  normal14Gray: {
    ...appStyles.medium14,
    color: '#777777',
    fontSize: isDeviceSize('small') ? 12 : 14,
    lineHeight: 19,
  },
});

const CardInfo = () => {
  return (
    <View style={styles.notice}>
      <AppText style={styles.normal14Gray}>{i18n.t('esim:refresh')}</AppText>
    </View>
  );
};

export default memo(CardInfo);
