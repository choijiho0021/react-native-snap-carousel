import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {API} from 'RokebiESIM/submodules/rokebi-utils';
import {appStyles} from '../constants/Styles';
import utils from '../utils/utils';
import {colors} from '../constants/Colors';
import AppIcon from './AppIcon';
import LabelText from './LabelText';
import InputNumber from './InputNumber';
import {isDeviceSize} from '../constants/SliderEntry.style';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: isDeviceSize('small') ? 15 : 20,
    paddingVertical: 20,
  },
  divider: {
    width: 335,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  checker: {
    marginRight: isDeviceSize('small') ? 15 : 20,
  },
  slide: {
    width: isDeviceSize('small') ? 70 : 90,
    height: isDeviceSize('small') ? 70 : 90,
  },
  desc: {
    marginLeft: 30,
    marginRight: 0,
    flex: 1,
  },
  itemTitle: {
    ...appStyles.bold16Text,
    color: colors.black,
  },
  itemPrice: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
    marginTop: 2,
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  itemRch: {
    ...appStyles.normal12Text,
  },
  balance: {
    marginTop: 20,
  },
  touch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default class SimCard extends PureComponent {
  render() {
    const {
      name,
      price,
      imageUrl,
      qty,
      onChange,
      onChecked,
      checked,
      last,
      simPrice,
    } = this.props;

    return (
      <View
        style={[
          styles.container,
          !last && {
            borderBottomWidth: 1,
            borderBottomColor: colors.lightGrey,
          },
        ]}>
        <TouchableOpacity onPress={onChecked} style={styles.touch}>
          <View style={styles.checker}>
            <AppIcon name="btnCheck" checked={checked} />
          </View>
          <Image
            source={{uri: API.default.httpImageUrl(imageUrl)}}
            resizeMode="contain"
            style={[styles.slide, {marginRight: 0}]}
          />
        </TouchableOpacity>

        <View style={styles.desc}>
          <Text style={styles.itemTitle}>{name}</Text>
          <View style={styles.input}>
            <Text style={styles.itemPrice}>{utils.price(price)}</Text>
            <InputNumber value={qty} onChange={onChange} />
          </View>
          <LabelText
            style={{...styles.balance}}
            format="price"
            value={simPrice}
          />
        </View>
      </View>
    );
  }
}
