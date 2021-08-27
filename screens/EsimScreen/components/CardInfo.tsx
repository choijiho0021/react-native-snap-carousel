import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  notice: {
    flex: 1,
    backgroundColor: colors.whiteThree,
    padding: 20,
    flexDirection: 'row',
  },
  normal14WarmGrey: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
});

const CardInfo = () => {
  return (
    <View style={styles.notice}>
      <AppIcon style={{marginRight: 10}} name="imgAlarm" />
      <AppText style={styles.normal14WarmGrey}>{i18n.t('esim:notice')}</AppText>
    </View>
  );
};

export default memo(CardInfo);
