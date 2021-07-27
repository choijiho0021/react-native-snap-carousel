import React, {memo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import utils from '@/redux/api/utils';
import {Currency} from '@/redux/api/productApi';

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

const AppPrice = ({
  style,
  balanceStyle,
  wonStyle,
  price,
}: {
  style?: StyleProp<ViewStyle>;
  balanceStyle?: StyleProp<TextStyle>;
  wonStyle?: StyleProp<TextStyle>;
  price: Currency;
}) => {
  return (
    <View style={style || styles.container}>
      <Text key="balance" style={balanceStyle || styles.price}>
        {utils.numberToCommaString(price.value)}
      </Text>
      <Text key="won" style={wonStyle || styles.won}>
        {` ${i18n.t(price.currency)}`}
      </Text>
    </View>
  );
};

export default memo(AppPrice);
