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
    paddingVertical: 10,
    flexDirection: 'row',
  },
  normal14WarmGrey: {
    ...appStyles.medium14,
    color: colors.warmGrey,
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
});

const CardInfo = () => {
  return (
    <View style={styles.notice}>
      <AppText style={styles.normal14WarmGrey}>
        {i18n.t('esim:refresh')}
      </AppText>
    </View>
  );
};

export default memo(CardInfo);
