import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import i18n from '../utils/i18n'
import {appStyles} from '../constants/Styles'
import * as simActions from '../redux/modules/sim'
import * as accountActions from '../redux/modules/account'
import * as notiActions from '../redux/modules/noti'
import * as infoActions from '../redux/modules/info'
import * as cartActions from '../redux/modules/cart'
import _ from 'underscore'
import AppActivityIndicator from '../components/AppActivityIndicator'
import { Animated } from 'react-native';
import { colors } from '../constants/Colors';
import AppButton from '../components/AppButton';
import utils from '../utils/utils';
import LabelText from '../components/LabelText';

class UsimScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <Text style={styles.title}>{i18n.t('appTitle')}</Text>
    )
  })

  constructor(props) {
    super(props)

    this.state = {

    }

 }

  componentDidMount() {

  }

  componentDidUpdate( prevProps) {
    
  }

  render() {
    const { account: {iccid, mobile, balance, expDate, email, userPictureUrl, loggedIn}} = this.props

    return(
      <ScrollView style={styles.container}>
        <View style={{backgroundColor: colors.clearBlue, paddingHorizontal: 20}}>
          <View style={{flexDirection: 'row', marginTop: 30, marginBottom:10, justifyContent: 'space-between'}}>
            <Text style={[appStyles.bold16Text, {color: colors.white, height: 16, alignSelf: 'center'}]}>로깨비 캐시</Text>
            <AppButton title={i18n.t('menu:change')} 
              titleStyle={[appStyles.normal12Text, {color: colors.white}]}
              style={{borderWidth:1, borderColor: colors.white, paddingHorizontal: 4, paddingTop: 3, borderRadius: 11.5, height: 25}}
              iconName={'iconRefresh'} direction={'row'}
              size={16}
              iconStyle={{margin:3}}/>
          </View>
          {
            iccid &&
            <View style={{flexDirection: 'row', marginBottom: 25}}>
              <Text style={[appStyles.bold30Text, {color: colors.white}]}>{utils.numberToCommaString(balance)}</Text>
              <Text style={[appStyles.normal22Text, {color: colors.white}]}>{i18n.t('won')}</Text>
            </View>  
          }
          {
            iccid &&
            <LabelText key='iccid' 
              style={styles.box}
              format={'shortDistance'}
              label={'ICCID'} labelStyle={[styles.iccid, {fontWeight: 'bold', marginRight: 10}]} 
              value={iccid ? utils.toICCID(iccid) : i18n.t('reg:card')} valueStyle={styles.iccid}/>
          }
          {
            iccid && 
            <LabelText key='expDate' 
              style={styles.box}
              format={'shortDistance'}
              label={i18n.t('acc:expDate')} labelStyle={[styles.expDate, {fontWeight: 'bold', marginRight: 10}]} 
              value={expDate} valueStyle={styles.expDate}/>
          } 
          <AppButton
            style={styles.rechargeBtn}
            title={i18n.t('recharge')}
            titleStyle={styles.rechargeBtnTitle}/>
        </View>
        <AppActivityIndicator visible={this.props.loginPending}/>
        
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    ... appStyles.title,
    marginLeft: 20,
    
  },
  box: {
    marginBottom: 5,
  },
  iccid: {
    ... appStyles.normal14Text,
    color: colors.white,
  },
  expDate: {
    ... appStyles.normal12Text,
    color: colors.white
  },
  rechargeBtn: {
    width: 160,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 24,
    marginBottom: 40,
    marginTop: 25
  },
  rechargeBtnTitle: {
    ... appStyles.bold16Text,
    textAlign: 'center',
    color:colors.clearBlue
  },
});

const mapStateToProps = (state) => ({
  account : state.account.toJS(),
  auth: accountActions.auth(state.account),
  noti : state.noti.toJS(),
  info : state.info.toJS(),
  loginPending: state.pender.pending[accountActions.LOGIN] || false,
  sync : state.sync.toJS()
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      sim: bindActionCreators(simActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      info: bindActionCreators(infoActions, dispatch)
    }
  })
)(UsimScreen)