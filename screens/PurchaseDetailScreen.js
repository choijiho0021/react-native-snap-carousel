import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import utils from '../utils/utils';
import AppBackButton from '../components/AppBackButton';
import { colors } from '../constants/Colors';
import LabelText from '../components/LabelText';
import _ from 'underscore';
import { isDeviceSize } from '../constants/SliderEntry.style';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';

class PurchaseDetailScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('his:detail')} />
  })

  constructor(props) {
    super(props)
    this.state = {}
    this.method = [
      [
        {
          key: 'html5_inicis',
          title: i18n.t('pym:ccard')
        },
        {
          key: 'danal',
          title: i18n.t('pym:mobile')
        },
        {
          key: 'kakaopay',
          title: i18n.t('pym:kakao')
        },
        {
          key: 'payco',
          title: i18n.t('pym:payco')
        },
      ],
    ]
  }

  componentDidMount() {
    const detail = this.props.navigation.getParam('detail')
    this.setState(detail)
  }

  render() {
    // const {orderId, orderDate, orderItems, iamportPayment, totalPrice} = this.state || {}
    const {orderId, orderDate, orderItems, iamportPayment, totalPrice} = this.props.navigation.getParam('detail') || {}
    const label = `${orderItems[0].title}  ${orderItems.length > 1 ? i18n.t('his:etcCnt').replace('%%', orderItems.length - 1) : ''}`

    const pg = !_.isEmpty(iamportPayment) ? this.method[0].find(item => item.key == iamportPayment[0].pg).title : i18n.t("pym:balance")
    const paidAmount = !_.isEmpty(iamportPayment) ? (iamportPayment[0].totalPrice) : 0
    const paymentList = this.props.navigation.getParam('detail').paymentList[0]
    
    return (
      <ScrollView style={styles.container}>
        <SafeAreaView forceInset={{ top: 'never', bottom:"always"}}>
          <Text style={styles.date}>{utils.toDateString(orderDate)}</Text>
          <Text style={styles.price}>{label}</Text>
          <View style={styles.bar}/>
          <LabelText
            key="orderId" style={styles.item}
            label={i18n.t('his:orderId')} labelStyle={styles.label2}
            value={orderId} valueStyle={styles.labelValue}/>
          <LabelText
            key="pymMethod" style={styles.item}
            label={i18n.t('pym:method')} labelStyle={styles.label2}
            value={pg} valueStyle={styles.labelValue}/>
          <View style={styles.divider} />
          { 
            orderItems && orderItems.map((item,idx) =>
              <LabelText
                key={idx+""} style={styles.item}
                label={`${item.title}   X   ${item.qty} 개`} labelStyle={styles.label}
                format="price"
                valueStyle={appStyles.roboto16Text}
                value={item.price}/>
              )
          }
          <View style={styles.bar}/>
          <LabelText
            key="productAmount" style={styles.item}
            label={i18n.t('his:productAmount')} labelStyle={styles.label2}
            format="price"
            valueStyle={appStyles.roboto16Text}
            value={totalPrice}/>
          <LabelText
            key="dvlCost" style={styles.item}
            label={i18n.t('cart:dlvCost')} labelStyle={styles.label2}
            format="price"
            valueStyle={appStyles.roboto16Text}
            value={paymentList.dlvCost}/>
          {
            paymentList.balanceCharge != 0 &&
              <LabelText
                key={"pymBalance"} style={styles.item}
                label={i18n.t("pym:balance")} labelStyle={styles.label2}
                format="price"
                valueStyle={appStyles.roboto16Text}
                value={`(-) ${paymentList.balanceCharge}`}/>
          }
          <View style={styles.bar}/>
          <View style={styles.row}>
            <Text style={[appStyles.normal16Text]}>{i18n.t('cart:totalCost')} </Text>
            <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Text style={styles.priceTxt}>{i18n.t('total') +' '}</Text>
              <Text style={[appStyles.price, {fontWeight: 'bold', lineHeight:24, letterSpacing: 0.21}]}>{utils.numberToCommaString(paidAmount)}</Text>
              <Text style={styles.priceTxt}>{' ' + i18n.t('won')}</Text>

            {/* <Text style={[appStyles.normal16Text, styles.colorClearBlue, styles.fontWeightNormal]}>{utils.numberToCommaString(paidAmount)+ ' ' + i18n.t('won')}</Text> */}
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ... appStyles.bold18Text,
    height: 21,
    //fontFamily: "AppleSDGothicNeo",
    marginBottom: isDeviceSize('small') ? 10 : 20,
    marginHorizontal: 20,
    color: colors.black
  },
  date: {
    ... appStyles.normal14Text,
    marginTop: 40,
    marginLeft: 20,
    color: colors.warmGrey
  },
  price: {
    ... appStyles.bold18Text,
    lineHeight: 24,
    letterSpacing: 0.27,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginVertical: 10,
  },
  bar: {
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 0.5, 
    marginHorizontal: 20,
    marginVertical: 20,
  },
  item: {
    marginHorizontal: 20,
    height: 36,
    alignItems: 'center',
  },
  label: {
    ... appStyles.bold16Text,
    lineHeight: 36, 
    letterSpacing: 0.26,
    color: colors.black,
  },
  labelValue: {
    ... appStyles.normal16Text,
    lineHeight: 36, 
    letterSpacing: 0.22,
    color: colors.black,
  },
  divider: {
    marginVertical: 40,
    height: 10,
    backgroundColor: colors.whiteTwo
  },
  label2: {
    ... appStyles.normal14Text,
    lineHeight: 36,
    color: colors.warmGrey
  },
  priceTxt: {
    ... appStyles.normal16Text,
    lineHeight: 24,
    letterSpacing: 0.24
  },
  row: {
    ... appStyles.itemRow,
    paddingHorizontal: 20,
    height: isDeviceSize('small') ? 30 : 36,
    alignItems: 'center',
    borderBottomWidth: 0
  },
  fontWeightNormal: {
    fontWeight: 'normal'
  },
  fontWeightBold: {
    fontWeight: '500'
  },
  colorClearBlue: {
    color: colors.clearBlue
  }
});

export default PurchaseDetailScreen