import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
  },
});

const Footer = () => {
  return (
    <View style={styles.container}>
      <AppText
        style={[appStyles.medium16, {color: colors.warmGrey, lineHeight: 24}]}>
        {i18n.t('talk:tariff:footer')}
      </AppText>
    </View>
  );
};

export default memo(Footer);
