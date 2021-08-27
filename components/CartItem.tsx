import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {API} from '@/redux/api';
import utils from '@/redux/api/utils';
import React, {memo} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Currency} from '../redux/api/productApi';
import AppButton from './AppButton';
import AppIcon from './AppIcon';
import AppPrice from './AppPrice';
import AppText from './AppText';
import InputNumber from './InputNumber';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: isDeviceSize('small') ? 15 : 20,
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
    fontSize: isDeviceSize('small') ? 15 : 16,
    color: colors.black,
  },
  itemPrice: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
  },
  input: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemRch: {
    ...appStyles.normal12Text,
  },
  balance: {
    marginTop: 12,
  },
  touch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  delete: {
    width: 32,
    height: 32,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
});

const CartItem = ({
  name,
  price,
  image,
  qty,
  onChange,
  onChecked,
  checked,
  onDelete,
}: {
  name: string;
  price: Currency;
  image?: string;
  qty: number;
  onChange: (v: number) => void;
  onChecked: () => void;
  checked: boolean;
  onDelete: () => void;
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onChecked} style={styles.touch}>
        <View style={styles.checker}>
          <AppIcon name="btnCheck" checked={checked} />
        </View>

        <View style={styles.slide}>
          <Image
            source={{uri: API.default.httpImageUrl(image)}}
            style={styles.slide}
            resizeMode="stretch"
          />
        </View>
      </TouchableOpacity>

      <View style={styles.desc}>
        <AppText style={styles.itemTitle}>{name}</AppText>
        <View style={styles.input}>
          <AppText style={styles.itemPrice}>{utils.price(price)}</AppText>
          <InputNumber value={qty} onChange={onChange} />
        </View>
        <View style={[styles.input, {marginTop: 20}]}>
          <AppPrice
            price={utils.toCurrency(
              Math.round(price.value * qty * 100) / 100,
              price.currency,
            )}
          />
          <View style={{flex: 1}} />
          <AppButton
            style={styles.delete}
            iconName="iconTrash"
            onPress={onDelete}
          />
        </View>
      </View>
    </View>
  );
};

export default memo(CartItem);
