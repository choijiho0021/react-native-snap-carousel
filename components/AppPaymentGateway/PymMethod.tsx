import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import AppText from '../AppText';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import AppButton from '../AppButton';

const styles = StyleSheet.create({
  title: {
    ...appStyles.bold18Text,
    marginTop: 20,
    marginBottom: isDeviceSize('small') ? 10 : 20,
    marginHorizontal: 20,
    color: colors.black,
  },
});

type PymMethodProps = {};

const PymMethod: React.FC<PymMethodProps> = () => {
  return (
    <View>
      <AppText style={styles.title}>{i18n.t('pym:method')}</AppText>
      <AppText style={styles.title}>{i18n.t('pym:method:vbank')}</AppText>
      <AppButton title={i18n.t('pym:method:vbank:input')} />
      <AppText style={styles.title}>{i18n.t('pym:vbank:receipt')}</AppText>
      {['1', '2', '3'].map((k) => (
        <AppText key={k}>{i18n.t(`pym:vbank:receipt:${k}`)}</AppText>
      ))}
      <AppText style={styles.title}>{i18n.t('pym:vbank:receipt')}</AppText>
    </View>
  );
};

export default memo(PymMethod);
