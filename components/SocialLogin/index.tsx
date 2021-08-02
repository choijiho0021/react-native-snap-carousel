import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import i18n from '../../utils/i18n';
import AppleLogin from './AppleLogin';

const styles = StyleSheet.create({
  title: {
    marginTop: 10,
    textAlign: 'center',
  },
});

const SocialLogin = () => {
  return (
    <View>
      <Text style={styles.title}>{i18n.t('login:easyLogin')}</Text>
      <AppleLogin />
    </View>
  );
};

export default memo(SocialLogin);
