import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  container: {
    marginTop: 48,
    marginHorizontal: 88,
  },
});

const Footer = () => {
  return (
    <View style={styles.container}>
      <AppText style={[appStyles.medium16, {lineHeight: 24}]}>
        {i18n.t('talk:tariff:footer')}
      </AppText>
    </View>
  );
};

export default memo(Footer);
