import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import {appStyles} from '../constants/Styles'
import i18n from '../utils/i18n';
import utils from '../utils/utils'
import { colors } from '../constants/Colors';
import api from '../utils/api/api';
import AppIcon from './AppIcon';
import AppButton from './AppButton';
import InputNumber from './InputNumber';

const styles = StyleSheet.create({
  container: {
    height: 148,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20
  },
  checker: {
    marginHorizontal: 20
  },
  slide: {
    width: 90,
    height: 90
  },
  desc: {
    marginLeft: 30,
    marginRight: 20,
    flex: 1
  },
  itemTitle: {
    ... appStyles.bold16Text,
    color: colors.black
  },
  itemPrice: {
    ... appStyles.normal14Text,
    color: colors.warmGrey
  },
  input: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemRch: {
    ... appStyles.normal12Text
  },
  balance: {
    marginTop: 12,
  },
  touch: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  delete: {
    width: 32,
    height: 32,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.lightGrey
  }
});

export default function CartItem({name, price, image, qty, onChange, onChecked, checked, onDelete}) {

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onChecked} style={styles.touch}>
        <View style={styles.checker}>
          <AppIcon name="btnCheck" checked={checked}/>
        </View>

        <Image source={{uri:api.httpImageUrl(image)}} style={styles.slide}/>
      </TouchableOpacity>

      <View style={styles.desc}>
        <Text style={styles.itemTitle}>{name}</Text>
        <View style={styles.input}>
          <Text style={styles.itemPrice}>{utils.price(price)}</Text>
          <InputNumber value={qty} onChange={onChange} />
        </View>
        <View style={[styles.input, {marginTop:20}]}>
          <Text style={appStyles.price}>{utils.numberToCommaString(price * qty)}</Text>
          <Text style={[appStyles.normal14Text, {flex:1}]}>{i18n.t('won')}</Text>
          <AppButton style={styles.delete} iconName="iconTrash" onPress={onDelete}/>
        </View>
      </View>
    </View>
  )
}

