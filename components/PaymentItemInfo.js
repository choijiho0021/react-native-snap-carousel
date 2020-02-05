import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {appStyles} from '../constants/Styles';
import utils from '../utils/utils';
import i18n from '../utils/i18n';
import { colors } from '../constants/Colors';
import _ from 'underscore';
import { isDeviceSize } from '../constants/SliderEntry.style';

const styles = StyleSheet.create({
  // container: {
  //   justifyContent: 'space-between',
  //   width: '63%'
  // },
  title: {
    ... appStyles.bold18Text,
    height: 21,
    //fontFamily: "AppleSDGothicNeo",
    marginVertical: isDeviceSize('small') ? 10 : 20,
    marginHorizontal: 20,
    color: colors.black
  },
  row: {
    ... appStyles.itemRow,
    height: isDeviceSize('small') ? 30 : 36,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0
  },
  total: {
    height: 52,
    paddingHorizontal: 20,
    borderTopColor: colors.blackack,
    borderTopWidth: 1,
    backgroundColor: colors.whiteTwo,
    alignItems: 'center'
  },
  mrgBottom0: {
    marginBottom: 0
  },
  brdrBottom0: {
    borderBottomWidth: 0
  },
  colorClearBlue: {
    color: colors.clearBlue
  },
  fontWeightNormal: {
    fontWeight: 'normal'
  },
  productPriceInfo: {
    paddingVertical: isDeviceSize('small') ? 13 : 11,
    marginTop: isDeviceSize('small') ? 0 : 9,
    marginHorizontal: 20, 
    borderBottomColor: colors.lightGrey, 
    borderBottomWidth: 1
  },
  priceInfo: {
    marginVertical: 11, 
    marginHorizontal: 20
  },
  normalText14: {
    ... appStyles.normal14Text,
    fontWeight: 'normal',
    color: colors.warmGrey
  },
  normalText16: {
    ... appStyles.normal16Text,
    fontWeight: 'normal',
    fontSize: isDeviceSize('small') ? 14 : 16
  },
  productPriceTitle: { 
    ... appStyles.normal16Text, 
    lineHeight: 36, 
    letterSpacing: 0.26,
    fontWeight: 'normal',
    fontSize: isDeviceSize('small') ? 14 : 16,
    maxWidth: '70%',
    // flexDirection: 'row', 
    // flexWrap: 'wrap'
  },
  divider: {
    marginTop: 30,
    height: 10,
    backgroundColor: colors.whiteTwo
  },
});

class PaymentItemInfo extends PureComponent {

  render() {
    const { cart, pymReq, balance=0, deduct, pymPrice, isRecharge, screen } = this.props

    return (
      <View>
        <Text style={[styles.title, styles.mrgBottom0]}>{i18n.t('pym:title')}</Text>
        <View style={styles.productPriceInfo}>        
        {
          cart.map(item => {
            const [qty, price] = _.isUndefined(item.qty) ? ['', item.price] : [` x ${item.qty}${i18n.t('qty')}`, item.price * item.qty]
            return (
              <View style={styles.row} key={item.key}>
                {/* <View style={{maxWidth: '70%'}}> */}
                <Text key="title" style={styles.productPriceTitle}>{item.title + qty}</Text>
                {/* </View> */}
                <Text key="price" style={styles.normalText16}>{utils.price(price)}</Text>
              </View>)
          })
        }
        </View> 
        
        {
          !isRecharge &&
          <View style={styles.priceInfo}>
            {
              pymReq.map(item =>                      
                <View style={styles.row} key={item.title}>
                  <Text key="title" style={styles.normalText14}>{item.title}</Text>
                  <Text key="amount" style={styles.normalText16}>{utils.price(item.amount)}</Text>
                </View>) 
            }
            <View style={styles.row} key="balance">
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <Text key="title" style={styles.normalText14}>{i18n.t('cart:deductBalance')}</Text>
                {
                  screen != 'PaymentResult' &&
                  <Text key="currentBal" style={[styles.normalText14, {marginLeft: 18}]}>{`(${i18n.t('cart:currentBalance')}:${utils.numberToCommaString(balance) + ' ' + i18n.t('won')}) `}</Text>
                }
              </View>
              <Text key="amount" style={styles.normalText16}>{utils.price(deduct)}</Text>
            </View>
          </View>
        }

        <View style={[styles.row, styles.total, styles.brdrBottom0]}>
          <Text style={[styles.normalText14]}>{i18n.t('cart:totalCost')} </Text>
          <Text style={[styles.normalText16, styles.colorClearBlue, styles.fontWeightNormal]}>{utils.numberToCommaString(pymPrice)+ ' ' + i18n.t('won')}</Text>
        </View>
        {
          screen == 'PaymentResult' &&
          <View style={[styles.row, styles.total, {borderTopWidth: 0, backgroundColor: colors.white}]}>
            <Text style={[styles.normalText14]}>{i18n.t('cart:afterDeductBalance')} </Text>
            <Text style={[styles.normalText16, styles.fontWeightNormal]}>{utils.numberToCommaString(balance)+ ' ' + i18n.t('won')}</Text>
          </View>
        }
        <View style={[styles.divider, screen == 'PaymentResult' && { marginTop: 0} ]}>
        </View>
      </View>
    )
  }
}

export default PaymentItemInfo