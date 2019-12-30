import React, { PureComponent } from 'react';
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
import LabelText from './LabelText';
import InputNumber from './InputNumber';
import { isDeviceSize } from '../constants/SliderEntry.style';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: 20
  },
  divider: {
    width: 335,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,    
  },  
  checker: {
    marginRight: 20
  },
  slide: {
    width: 90,
    height: 90
  },
  desc: {
    marginLeft: 30,
    marginRight: 0,
    flex: 1
  },
  itemTitle: {
    ... appStyles.bold16Text,
    color: colors.black
  },
  itemPrice: {
    ... appStyles.normal14Text,
    color: colors.clearBlue,
    marginTop: 2
  },
  input: {
    marginTop: 10,
    alignItems: 'flex-end'
  },
  itemRch: {
    ... appStyles.normal12Text
  },
  balance: {
    marginTop: 12,
  },
  touch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default class SimCard extends PureComponent {
  render() {
    const {name, price, balance, imageUrl, qty, onChange, onChecked, checked, last} = this.props

    return (
      <View style={[styles.container, 
        ! last && {
          borderBottomWidth: 1,
          borderBottomColor: colors.lightGrey,        
        }]}>
        <TouchableOpacity onPress={onChecked} style={styles.touch}>
          <View style={styles.checker}>
            <AppIcon name="btnCheck" checked={checked}/>
          </View>

          <Image source={{uri:api.httpImageUrl(imageUrl)}} style={styles.slide}/>
        </TouchableOpacity>

        <View style={styles.desc}>
          <Text style={styles.itemTitle}>{name}</Text>
          <Text style={styles.itemPrice}>{utils.price(price)}</Text>
          <View style={styles.input}>
            <InputNumber value={qty} onChange={onChange}/>
          </View>
          <LabelText style={{... styles.balance, flexDirection: isDeviceSize('small') ? 'column' : 'row'}}
            label={i18n.t('sim:rechargeAmt')}
            format="price"
            value={balance} />
        </View>
        {/* <View style={styles.divider,{flex:1, flexDirection:'flex-end'}}/> */}
      </View>
    )
  }
}

