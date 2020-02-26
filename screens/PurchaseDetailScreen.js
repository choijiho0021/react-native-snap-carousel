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

class PurchaseDetailScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('his:detail')} />
  })

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const detail = this.props.navigation.getParam('detail')
    this.setState(detail)
  }

  render() {
    const {orderId, orderDate, totalPrice, orderItems} = this.state || {}

    return (
      <View style={styles.container}>
        <Text style={styles.date}>{utils.toDateString(orderDate)}</Text>
        <View style={styles.price}>
          <Text style={appStyles.normal14Text}>{i18n.t('total') +' '}</Text>
          <Text style={appStyles.price}>{utils.numberToCommaString(totalPrice)}</Text>
          <Text style={appStyles.normal14Text}>{' ' + i18n.t('won')}</Text>
        </View>
        <View style={styles.bar}/>
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
        <View style={styles.divider} />
        <LabelText 
          key="orderId" style={styles.item}
          label={i18n.t('his:orderId')} labelStyle={styles.label2}
          value={orderId} valueStyle={styles.label}/>
      </View>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1
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
    marginTop: 30,
    marginBottom: 20
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
    marginTop: 50,
    marginBottom: 40,
    height: 10,
    backgroundColor: colors.whiteTwo
  },
  label2: {
    ... appStyles.normal14Text,
    color: colors.warmGrey
  },
});

export default PurchaseDetailScreen