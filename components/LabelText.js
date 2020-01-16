import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {appStyles} from '../constants/Styles'
import utils from '../utils/utils';
import i18n from '../utils/i18n';
import { colors } from '../constants/Colors';

const styles = StyleSheet.create({
  label: {
    ... appStyles.normal14Text,
    color: colors.warmGrey
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  value: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  singleValue: {
    flex: 1,
    textAlign: 'right'
  }
});

export default class LabelText extends PureComponent {
  render() {
    const {label, value = 0, deduct, style, format, color = colors.black, labelStyle, valueStyle} = this.props

    return (
      <View style={[styles.container, style]} >
        <Text style={labelStyle || styles.label}>{label}</Text>
        {
          ( format == 'price') ?
            (label == i18n.t('cart:deductBalance')) ? 
              <View style={styles.value}>
                <Text style={styles.label}>{`(${i18n.t('cart:currentBalance')}:${utils.numberToCommaString(value) + ' ' + i18n.t('won')}) `}</Text>
                <Text style={[valueStyle|| appStyles.price, {color}]}>{utils.numberToCommaString(deduct)}</Text>
                <Text style={appStyles.normal14Text}>{' ' + i18n.t('won')}</Text>
              </View>
              :
              <View style={styles.value}>
                <Text style={[valueStyle|| appStyles.price, {color}]}>{utils.numberToCommaString(value)}</Text>
                <Text style={appStyles.normal14Text}>{' ' + i18n.t('won')}</Text>
              </View>
          : <Text style={valueStyle || styles.singleValue}>{value}</Text>
        }
      </View>
    )
  }
}

