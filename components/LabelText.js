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
  constructor(props) {
    super(props)
    this.state = {
      flexDirection: 'row'
    }

    this._onLayout = this._onLayout.bind(this)
  }

  _onLayout(event) {
    const {width} = event.nativeEvent.layout;
    console.log('label text width', width, this.props.label, this.props.value)
    if ( width < 200) {
      this.setState({
        flexDirection: 'column'
      })
    }
  }
  render() {
    const {label, value, style, format, color, labelStyle, valueStyle} = this.props
    const {flexDirection} = this.state

    return (
      <View style={[styles.container, {flexDirection}, style]} onLayout={this._onLayout} >
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
}

