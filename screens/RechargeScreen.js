import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux'

import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import * as accountActions from '../redux/modules/account'
import utils from '../utils/utils';
import paymentApi from '../utils/api/paymentApi';
import { bindActionCreators } from 'redux'
import { colors } from '../constants/Colors';
import LabelText from '../components/LabelText';
import AppButton from '../components/AppButton';
import _ from 'underscore'
import { SafeAreaView } from 'react-navigation';
import AppBackButton from '../components/AppBackButton';

class RechargeScreen extends Component {
  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({navigation, title:i18n.t('recharge')}),
  })

  constructor(props) {
    super(props)

    this.state = {
      selected: "5000"
    }

    this._onSubmit = this._onSubmit.bind(this)
    this._onPress = this._onPress.bind(this)
    this._rechargeButton = this._rechargeButton.bind(this)
  }

  _onSubmit() {

    const pymReq = [
      {
        key: 'rch',
        title: i18n.t('sim:rechargeAmt'),
        amount: utils.stringToNumber( this.state.selected)
      }
    ]
    this.props.navigation.replace('PymMethod', {pymReq})
    /*
    const { auth} = this.props.account,
      rch = { amount : this.state.selected }

    // recharge
    paymentApi.recharge( rch, auth).then( resp => {
      if ( resp.result == 0) {
        console.log('recharge successful')
      }

    }).catch(err => {
      Alert.alert( i18n.t('error'), err.message, [ {text: 'OK'} ]);
    })

    this.props.navigation.goBack()
    */
  }

  _onPress = (key) => () => {
    this.setState({
      selected: key
    })
  }

  _rechargeButton(value) {

    const { selected } = this.state

    return (
      <View key={value[0]+ ""} style={styles.row}>
      {
        value.map(v => <AppButton 
          key={v+""} 
          title={utils.numberToCommaString(v)} 
          style={styles.button}
          onPress={this._onPress(v+"")}
          checked={v == selected}
          checkedColor={colors.clearBlue}
          titleStyle={styles.buttonText}/>)
      }
      </View>
    )
  }

  render() {
    const {iccid = "", balance} = this.props.account
    const { selected } = this.state
    const seg = [0, 5, 10, 15].map(v => iccid.substring(v, v+5))
    const amount = [[5000, 10000], [15000, 20000], [25000, 30000]]

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.upper}>
          <View style={styles.card}>
          </View>
          <View style={styles.iccidBox}>
            <Text style={styles.iccidTitle}>ICCID</Text>
            <View style={styles.iccidRow}>
            {
              seg.map((s,i) => [<Text key={i} style={styles.iccid}>{s}</Text>, i < 3 ? <Text key={i+"-"}>-</Text> : null])
            }
            </View>
            <LabelText label={i18n.t('sim:remainingBalance')} 
              style={{marginTop:15}}
              value={balance} 
              format="price" color={colors.clearBlue}/>
          </View>
        </View>
        <View style={styles.divider}></View>
        <View >
          {
            amount.map(v => this._rechargeButton(v))
          }
        </View>
        <AppButton title={i18n.t('rch:recharge')} 
          titleStyle={appStyles.confirmText}
          disabled={_.isEmpty(selected)}
          onPress={this._onSubmit}
          style={styles.confirm}/>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  confirm: {
    ... appStyles.confirm,
    marginTop: 40
  },
  container: {
    flex: 1,
  },
  upper: {
    flex:1,
    justifyContent: 'space-evenly'
  },
  card: {
    height: 168,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    marginHorizontal: 20,
    marginTop: 20
  },
  iccidTitle: {
    ... appStyles.bold12Text,
    color: colors.clearBlue
  },
  iccidRow: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  iccid: {
    ... appStyles.roboto16Text,
    color: colors.black,
  },
  iccidBox: {
    marginHorizontal: 68,
    marginTop: 15
  },
  divider: {
    marginTop: 30,
    marginBottom: 5,
    height: 10,
    backgroundColor: "#f5f5f5"
  },
  row : {
    flexDirection: "row",
    justifyContent: 'space-around',
    marginTop: 20,
    marginHorizontal: 20,
  },
  button: {
    width: 150,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.warmGrey
  },
  buttonText: {
    ... appStyles.price,
    textAlign: 'center',
    color: colors.warmGrey
  },
});

const mapStateToProps = (state) => ({
  account: state.account.toJS()
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    AccountActions : bindActionCreators(accountActions, dispatch)
  })
)(RechargeScreen)