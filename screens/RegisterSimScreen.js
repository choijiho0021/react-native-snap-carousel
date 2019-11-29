import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView
} from 'react-native';
import {connect} from 'react-redux'

import i18n from '../utils/i18n'
import * as simActions from '../redux/modules/sim'
import * as accountActions from '../redux/modules/account'
import ScanSim from '../components/ScanSim'
import _ from 'underscore'
import accountApi from '../utils/api/accountApi';
import AppActivityIndicator from '../components/AppActivityIndicator'
import AppButton from '../components/AppButton';
import AppAlert from '../components/AppAlert';
import AppBackButton from '../components/AppBackButton';
import { bindActionCreators } from 'redux'
import { colors } from '../constants/Colors';
import { appStyles } from '../constants/Styles';
import utils from '../utils/utils';
import userApi from '../utils/api/userApi';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class RegisterSimScreen extends Component {
  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({navigation, title:i18n.t('sim:reg')}),
  })

  constructor(props) {
    super(props)

    this.state = {
      scan: false,
      showRegisterSimModal: false,
      loggedIn: false,
      querying: false,
      iccid: undefined,
      actCode: undefined
    }

    this._onSubmit = this._onSubmit.bind(this)
    this._onCamera = this._onCamera.bind(this)
    this._onScan = this._onScan.bind(this)
    this._updateIccid = this._updateIccid.bind(this)
  }

  _updateIccid(iccid) {
    console.log('update ICCID', iccid)

    this.setState({
      iccid
    })

    this.props.action.sim.addIccid(iccid)
  }

  _onSubmit() {
    const {iccid, actCode} = this.state

    accountApi.validateActCode(iccid, actCode).then( resp => {
      console.log('valid act code', resp)

      if ( resp.result == 0) {
        // activation code is valid
        utils.storeData( userApi.KEY_ICCID, iccid)
        const uuid = resp.objects[0].uuid

        // redux store도 갱신한다. (actCode)
        this.props.action.account.updateAccount({
          iccid,
          uuid
        })

        // 서버의 account에 mobile 번호를 등록한다.
        this.props.action.account.registerMobile(uuid, this.props.account.mobile)

        //signup, update를 모두 성공한 경우, 화면에 성공으로 표시 
        AppAlert.info(i18n.t('reg:success'), i18n.t('appTitle'), () => this.props.navigation.popToTop())
      }
      else {
        // invalid activation code
        AppAlert.error(i18n.t('reg:wrongActCode'))
      }
    }).catch(err => {
      console.log('failed to update', err)
      AppAlert.error(i18n.t('reg:fail'))
    }).finally(() => {
      this.setState({
        querying: false,
        disable: false
      })
    })
  }

  _onCamera(flag) {
    this.setState({
      scan: flag
    })
  }

  _onScan({type, data}) {
    this.setState({
      scan: false,
    })
    alert(`${i18n.t('scanned')} ${data}`)
    this._updateIccid(data)
  }

  _onChangeText = (key) => (value) => {
    if (key == 'iccid') value = value.replace(/[ -]/g, '')
    this.setState({
      [key]: value
    })
  }

  render() {
    const {scan, iccid, actCode, querying} = this.state
    const disabled = _.isEmpty(iccid) || iccid.replace(/[ -]/g, '').length < 20 ||
      _.isEmpty(actCode) || actCode.length < 4

    return (
      <KeyboardAvoidingView
        contentContainerStyle={styles.container}>

        <SafeAreaView style={styles.container}>
          <AppActivityIndicator visible={querying}/>
          <View style={styles.card}>
            <ScanSim scan={scan} onScan={this._onScan}/>
          </View>
          <Text style={styles.title}>{i18n.t('mysim:title')}</Text>
          <View style={styles.iccidBox}>
            <Text style={styles.iccid}>ICCID</Text>
            <TextInput style={styles.input}
              onChangeText={this._onChangeText('iccid')}
              keyboardType="numeric"
              returnKeyType='next'
              enablesReturnKeyAutomatically={true}
              maxLength={29}
              clearTextOnFocus={true}
              value={utils.toICCID(iccid, ' - ')} />
          </View>
          <AppButton iconName="iconCamera" 
            style={styles.scanButton}
            title={i18n.t('reg:scan')} titleStyle={styles.scanTitle}
            direction="row"/>
          <View style={styles.actCodeBox}>
            <Text style={styles.actCodeTitle}>{i18n.t('reg:actCode')}</Text>
            <TextInput style={styles.actCodeInput}
              onChangeText={this._onChangeText('actCode')}
              keyboardType="numeric"
              returnKeyType='done'
              enablesReturnKeyAutomatically={true}
              maxLength={4}
              clearTextOnFocus={true}
              value={actCode} />
          </View>
          <AppButton style={appStyles.confirm} 
            title={i18n.t('reg:confirm')} titleStyle={appStyles.confirmText}
            onPress={this._onSubmit} disabled={disabled}/>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  actCodeTitle: {
    ... appStyles.bold12Text,
    flex: 1,
    textAlign: 'center'
  },
  actCodeInput: {
    flex: 1,
    height: 36,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.lightGrey,
    paddingHorizontal: 30,
    textAlign: 'center'
  },
  actCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    marginHorizontal: 15,
    flex: 1
  },
  scanTitle: {
    ... appStyles.normal14Text,
    marginHorizontal: 10
  },
  scanButton: {
    marginTop: 10,
    height: 20,
    marginHorizontal: 20,
    justifyContent: 'flex-start'
  },
  input: {
    ... appStyles.normal16Text,
    marginTop: 12,
    textAlign : 'center'
  },
  iccidBox: {
    marginVertical: 12,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    height: 80,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.clearBlue
  },
  iccid: {
    ... appStyles.bold12Text,
    color: colors.clearBlue,
    marginTop: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  card: {
    marginHorizontal: 20,
    marginVertical: 20,
    height: 200,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  title: {
    ... appStyles.normal14Text, 
    color: colors.warmGrey,
    marginTop: 40,
    marginHorizontal: 20,
  }
});

const mapStateToProps = (state) => ({
    account: state.account.toJS(),
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action: {
      sim : bindActionCreators(simActions, dispatch),
      account : bindActionCreators(accountActions, dispatch)
    }
  })
)(RegisterSimScreen)