import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class RegisterSimScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('sim:reg')} />
  })

  constructor(props) {
    super(props)

    this.state = {
      scan: false,
      showRegisterSimModal: false,
      loggedIn: false,
      querying: false,
      iccid: undefined,
      actCode: undefined,
      focusInputIccid: false
    }

    this._onSubmit = this._onSubmit.bind(this)
    this._onCamera = this._onCamera.bind(this)
    this._onScan = this._onScan.bind(this)
    this._updateIccid = this._updateIccid.bind(this)

    this.inputIccid = React.createRef()
    this.defaultIccid = "12345123451234512345"
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
    const {scan, iccid, actCode, querying, focusInputIccid} = this.state
    const disabled = _.isEmpty(iccid) || iccid.replace(/[ -]/g, '').length < 20 ||
      _.isEmpty(actCode) || actCode.length < 4

    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
        extraScrollHeight={50}
        scrollEnabled={false}>

        <SafeAreaView style={styles.container}>
          <AppActivityIndicator visible={querying}/>
          <TouchableOpacity style={styles.card} onPress={() => this._onCamera(!scan)}>
            <ScanSim scan={scan} onScan={this._onScan}/>
          </TouchableOpacity>

          <Text style={styles.title}>{i18n.t('mysim:title')}</Text>
          <TouchableOpacity onPress={() => this.inputIccid.current.focus()} 
            activeOpacity={1.0}
            style={styles.iccidBox}>
            <Text style={styles.iccid}>ICCID</Text>
            <TextInput style={styles.input}
              ref={this.inputIccid}
              placeholder={utils.toICCID(this.defaultIccid, '  -  ')}
              onChangeText={this._onChangeText('iccid')}
              keyboardType="numeric"
              returnKeyType='done'
              enablesReturnKeyAutomatically={true}
              maxLength={35}
              clearTextOnFocus={true}
              focus={focusInputIccid}
              onFocus={() => this.setState({iccid: ''})}
              value={utils.toICCID(iccid, '  -  ')} />
          </TouchableOpacity>

          <AppButton iconName={scan ? "iconCameraCancel" : "iconCamera"}
            style={styles.scanButton}
            title={i18n.t(scan ? 'reg:scanOff' : 'reg:scan')} titleStyle={styles.scanTitle}
            onPress={() => this._onCamera(!scan)}
            direction="row"/>

          <View style={styles.actCodeBox}>
            <View style={styles.actCode}>
              <Text style={styles.actCodeTitle}>{i18n.t('reg:actCode')}</Text>
              <TextInput style={styles.actCodeInput}
                onChangeText={this._onChangeText('actCode')}
                keyboardType="numeric"
                returnKeyType='done'
                placeholder="1234"
                enablesReturnKeyAutomatically={true}
                maxLength={4}
                clearTextOnFocus={true}
                onFocus={() => this.setState({actCode: ''})}
                value={actCode} />
            </View>
          </View>

          <AppButton style={appStyles.confirm} 
            title={i18n.t('reg:confirm')} titleStyle={appStyles.confirmText}
            onPress={this._onSubmit} disabled={disabled}/>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  actCodeTitle: {
    ... appStyles.bold12Text,
    flex: 1,
    textAlign: 'center',
    color: colors.black
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
    textAlign: 'center',
    color: colors.black,
    marginLeft: 40,
  },
  actCodeBox: {
    marginTop: 50,
    marginHorizontal: 35,
    flex: 1,
  },
  actCode: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanTitle: {
    ... appStyles.normal14Text,
    marginHorizontal: 10
  },
  scanButton: {
    marginTop: 10,
    height: 20,
    marginHorizontal: 30,
    justifyContent: 'flex-start'
  },
  input: {
    ... appStyles.roboto16Text,
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