import React, {PureComponent} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import _ from 'underscore';
import {colors} from '../../../constants/Colors';
import i18n from '../../../utils/i18n';
import AppIcon from '../../../components/AppIcon';

const styles = StyleSheet.create({
  notice: {
    backgroundColor: colors.whiteThree,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
  },
  // normal14WarmGrey: {
  //   ...appStyles.normal14Text,
  //   color: colors.warmGrey,
  //   fontSize: isDeviceSize('small') ? 12 : 14,
  // },
});

export default class CardInfo extends PureComponent {
  render() {
    return (
      <View style={styles.notice}>
        <AppIcon style={{marginRight: 10}} name={'imgAlarm'} />
        <Text style={styles.normal14WarmGrey}>{i18n.t('esim:notice')}</Text>
      </View>
    );
  }
}
