import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import utils from '../utils/utils';
import moment from 'moment'
import AppBackButton from '../components/AppBackButton';
import { colors } from '../constants/Colors';
import LabelText from '../components/LabelText';

class PurchaseDetailScreen extends Component {
  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({navigation, title:i18n.t('his:detail')}),
  })

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const detail = this.props.navigation.getParam('detail')
    console.log('detail', detail)
    this.setState(detail)
  }

  _renderItem = ({key, title, value}) => {
    return (
      <View key={key} style={appStyles.itemRow}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemValue}>{value}</Text>
      </View>
    )
  }

  render() {
    const {orderId, orderDate, totalPrice, orderItems} = this.state || {}

    /*
    const data = [
      {key: 'nid', title:i18n.t('his:purchaseId'), value: nid},
      {key: 'purchaseDate', title:i18n.t('his:purchaseDate'), value: moment(created).format('YYYY-MM-DD HH:mm:ss')},
      {key: 'detail', title:i18n.t('his:purchaseList'), value: list},
      {key: 'pymAmount', title:i18n.t('his:pymAmount'), value: amount + directPayment},
    ]
    */

    return (
      <View style={styles.container}>
        <Text style={styles.date}>{moment(orderDate).format('YYYY-MM-DD hh:mm:ss')}</Text>
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
              label={item.title} labelStyle={styles.label}
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
    alignItems: 'baseline',
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

  buttonBox: {
    flex: 2
  },
  button: {
    padding: 10,
    margin: 10,
    height: 50,
    width: 150,
    fontSize: 20,
    backgroundColor: "skyblue"
  },
  buttonRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  itemTitle: {
    ... appStyles.itemTitle,
    padding: 5,
    width: "40%",
  },
  itemValue: {
    ... appStyles.itemValue,
    padding: 5,
    width: "60%",
    textAlign: "right"
  },
  account : {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  field: {
    width: "100%"
  },
  picker: {
    flex: 1,
    width: "100%",
    height: "100%"
  }
});

export default PurchaseDetailScreen