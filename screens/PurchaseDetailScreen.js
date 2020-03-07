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
    const {orderId, orderDate, orderItems, iamportPayment, totalPrice} = this.state || {}

    const pg = !_.isEmpty(iamportPayment) && this.method[0].find(item => item.key == iamportPayment[0].pg).title
    const paidAmount = !_.isEmpty(iamportPayment) ? (iamportPayment[0].totalPrice) : 0
    const paymentList = this.props.navigation.getParam('detail').paymentList[0]

    return (
      <View style={styles.container}>
        <LabelText 
          key="orderId" style={styles.item}
          label={i18n.t('his:orderId')} labelStyle={styles.label2}
          value={orderId} valueStyle={styles.label}/>
        <LabelText
          key="purchaseDate" style={styles.item}
          label={i18n.t('his:purchaseDate')} labelStyle={styles.label2}
          value={utils.toDateString(orderDate)} valueStyle={styles.label}/>
        <View style={styles.divider} />
        <Text style={styles.title}>{i18n.t('pym:title')}</Text>
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
        <LabelText 
          key="dvlCost" style={styles.item}
          label={i18n.t('cart:dlvCost')} labelStyle={styles.label}
          format="price"
          valueStyle={appStyles.roboto16Text}
          value={paymentList.dlvCost}/>     
        <View style={styles.bar}/>
        <Text style={[styles.title, {marginTop: 10}]}>{i18n.t('pym:method')}</Text>
        {
          !_.isEmpty(iamportPayment) &&
            <LabelText 
              key={"paymentMethod"} style={styles.item}
              label={pg} labelStyle={styles.label2}
              format="price"
              valueStyle={appStyles.roboto16Text}
              value={paidAmount}/>
        }
        {
          paymentList.balanceCharge != 0 &&
            <LabelText 
              key={"pymBalance"} style={styles.item}
              label={i18n.t("pym:balance")} labelStyle={styles.label2}
              format="price"
              valueStyle={appStyles.roboto16Text}
              value={paymentList.balanceCharge}/>
        }
        <View style={[styles.row, styles.total, styles.brdrBottom0]}>
          <Text style={[appStyles.normal14Text]}>{i18n.t('cart:totalCost')} </Text>
          <Text style={[appStyles.normal16Text, styles.colorClearBlue, styles.fontWeightNormal]}>{utils.numberToCommaString(paidAmount)+ ' ' + i18n.t('won')}</Text>
        </View>
      </View>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20
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
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 10,
  },
  bar: {
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 0.5, 
    marginHorizontal: 20,
    marginVertical: 15,
  },
  item: {
    marginHorizontal: 20,
    height: 36,
    alignItems: 'center',
  },
  label: {
    ... appStyles.normal16Text,
    color: colors.black,
  },
  divider: {
    marginVertical: 27,
    height: 10,
    backgroundColor: colors.whiteTwo
  },
  label2: {
    ... appStyles.normal14Text,
    color: colors.warmGrey
  },
  row: {
    ... appStyles.itemRow,
    marginTop: 27,
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
    alignItems: 'center',
  },
  mrgBottom0: {
    marginBottom: 0
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