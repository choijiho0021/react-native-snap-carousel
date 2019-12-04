import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {appStyles} from '../constants/Styles'
import utils from '../utils/utils';
import i18n from '../utils/i18n';

const styles = StyleSheet.create({
  label: {
    ... appStyles.normal12Text,
  },
  container: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  value: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end'
  },
  singleValue: {
    flex: 1,
    textAlign: 'right'
  }
});

export default function LabelText({label, value, style, format, color, labelStyle, valueStyle}) {

  return (
    <View style={[styles.container, style]}>
      <Text style={labelStyle || styles.label}>{label}</Text>
      {
        ( format == 'price') ?
          <View style={styles.value}>
            <Text style={[valueStyle|| appStyles.price, {color}]}>{utils.numberToCommaString(value)}</Text>
            <Text style={appStyles.normal14Text}>{' ' + i18n.t('won')}</Text>
          </View>
          : <Text style={valueStyle || styles.singleValue}>{value}</Text>
      }
    </View>
  )
}

