import {Image, Pressable, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {API} from '@/redux/api';
import utils from '@/redux/api/utils';
import {Currency} from '@/redux/api/productApi';
import AppButton from './AppButton';
import AppIcon from './AppIcon';
import AppPrice from './AppPrice';
import AppText from './AppText';
import InputNumber from './InputNumber';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: isDeviceSize('small') ? 15 : 20,
  },
  checker: {
    marginRight: 16,
  },
  slide: {
    width: 100,
    height: 100,
  },
  desc: {
    marginLeft: 16,
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
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  const uri = API.default.httpImageUrl(image);
  return (
    <View style={styles.container}>
      <Pressable onPress={onChecked} style={styles.touch}>
        <View style={styles.checker}>
          <AppIcon name="btnCheck" checked={checked} />
        </View>

        <View style={styles.slide}>
          {uri ? <Image source={{uri}} style={styles.slide} /> : null}
        </View>
      </Pressable>

      <View style={styles.desc}>
        <AppText style={styles.itemTitle}>{name}</AppText>
        <View style={styles.input}>
          <AppText style={styles.itemPrice}>{utils.price(price)}</AppText>
          <InputNumber value={qty} onChange={onChange} boldIcon />
        </View>
        <View style={[styles.input, {marginTop: 12}]}>
          <AppPrice
            price={utils.toCurrency(
              Math.round(price.value * qty * 100) / 100,
              price.currency,
            )}
            balanceStyle={appStyles.bold20Text}
            currencyStyle={appStyles.bold18Text}
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
