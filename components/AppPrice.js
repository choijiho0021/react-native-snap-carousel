import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {appStyles} from '../constants/Styles';
import utils from '../utils/utils';
import i18n from '../utils/i18n';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    ...appStyles.price,
    textAlign: 'left',
  },
  won: {
    ...appStyles.normal14Text,
    marginLeft: 5,
  },
});

function AppPrice({style, balanceStyle, wonStyle, price}) {
  return (
    <View style={style || styles.container}>
      <Text key="balance" style={balanceStyle || styles.price}>
        {utils.numberToCommaString(price)}
      </Text>
      <Text key="won" style={wonStyle || styles.won}>
        {i18n.t('won')}
      </Text>
    </View>
  );
}

export default memo(AppPrice);
