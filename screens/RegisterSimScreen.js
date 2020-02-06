import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Keyboard
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
import { isDeviceSize } from '../constants/SliderEntry.style';

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
      iccid: ['','','',''],
      actCode: undefined,
      focusInputIccid: false
    }

    this._onSubmit = this._onSubmit.bind(this)
    this._onCamera = this._onCamera.bind(this)
    this._onScan = this._onScan.bind(this)
    this._updateIccid = this._updateIccid.bind(this)

    this.inputIccid = [...Array(4)].map( () =>  React.createRef() )
    this.defaultIccid = "12345"
  }

  _updateIccid(iccid) {
    console.log('update ICCID', iccid)

    let arr = []

    for ( let i=0; i < _.size(iccid)/5 && i < 4 ;) {
      arr.push( iccid.substring(i*5, ++i*5) )
    }

    this.setState({
      iccid: arr
    })

    this.props.action.sim.addIccid(iccid)
  }

  _onSubmit() {
    const {actCode} = this.state,
      iccid = this.state.iccid.join('')

    accountApi.validateActCode(iccid, actCode).then( resp => {

      if ( resp.result == 0) {
        // activation code is valid
        const uuid = resp.objects[0].uuid

        // 서버의 account에 mobile 번호를 등록한다.
        this.props.action.account.registerMobile(uuid, this.props.account.mobile, this.props.auth).then( resp => {
          if ( resp.result == 0) {
            //signup, update를 모두 성공한 경우, 화면에 성공으로 표시 
            AppAlert.info(i18n.t('reg:success'), i18n.t('appTitle'), () => this.props.navigation.popToTop())
          }
          else {
            console.log('Failed to register mobile')
            AppAlert.error(i18n.t('reg:fail'))
          }
        })

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

  _onScan = ({data, rawData, type}) => {
    this.setState({
      scan: false,
    })
    alert(`${i18n.t('scanned')} ${data}`)
    this._updateIccid(data)
  }

  _onChangeText = (key, idx) => (value) => {
    //if (key == 'iccid') value = value.replace(/[ -]/g, '')

    if (key == 'iccid') {
      const { iccid } = this.state

      this.setState({
        iccid: iccid.map((elm,i) => i === idx ? value : elm )
      })

      if ( _.size(value) === 5 && idx < 3 ) {
        this.inputIccid[idx+1].current.focus()
      }
      else {
        if ( iccid.map((elm,i) => i === idx ? value : elm ).every(elm => _.size(elm) === 5) && idx === 3 ) {
          Keyboard.dismiss()
        }
      }

      return;
    }

    this.setState({
      [key]: value
    })
  }

  render() {
    const {scan, iccid, actCode, querying, focusInputIccid} = this.state
    const disabled = _.size(iccid) !== 4 || ! iccid.every( elm => _.size(elm) === 5 ) ||
      _.isEmpty(actCode) || actCode.length < 4
    let iccidIdx = iccid.findIndex(elm => _.size(elm) !== 5)
    if (iccidIdx < 0) iccidIdx = 3

    return (
      <SafeAreaView style={{flex:1}}>
        <AppActivityIndicator visible={querying}/>

        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.container}
          extraScrollHeight={50} 
          scrollEnabled={isDeviceSize('small')}>

          <TouchableOpacity style={styles.card} onPress={() => this._onCamera(!scan)}>
            <ScanSim scan={scan} onScan={this._onScan}/>
          </TouchableOpacity>

          <Text style={styles.title}>{i18n.t('mysim:title')}</Text>
          <TouchableOpacity onPress={() => this.inputIccid[ iccidIdx ].current.focus() } 
            activeOpacity={1.0} style={styles.iccidBox}>

            <Text style={styles.iccid}>ICCID</Text>
            <View style={styles.inputBox}>
              {
                iccid.reduce((acc,cur) => acc.concat([cur, '-']), [])
                  .map(( elm, idx ) =>
                  ( elm == '-' ? 
                      (idx + 1 === _.size(iccid)*2 ? null :
                        <Text key={idx+""} style={[styles.delimiter, { color: _.size(elm) === 5 ? colors.black : colors.greyish } ]}>-</Text>):
                      <TextInput style={styles.input} key={idx+""}
                        ref={this.inputIccid[idx/2]}
                        placeholder={this.defaultIccid}
                        placeholderTextColor={colors.greyish}
                        onChangeText={this._onChangeText('iccid', idx/2)}
                        keyboardType='numeric'
                        returnKeyType='done'
                        enablesReturnKeyAutomatically={true}
                        maxLength={5}
                        value={ elm }
                        focus={focusInputIccid}
                        blurOnSubmit={false}
                        onFocus={() => {}} />
                  ))
              }
            </View>
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
                placeholder='1234'
                placeholderTextColor={colors.greyish}
                enablesReturnKeyAutomatically={true}
                maxLength={4}
                clearTextOnFocus={true}
                onFocus={() => this.setState({actCode: ''})}
                value={actCode} />
            </View>
          </View>

        </KeyboardAwareScrollView>

        <AppButton style={appStyles.confirm} 
          title={i18n.t('reg:confirm')} titleStyle={appStyles.confirmText}
          onPress={this._onSubmit} disabled={disabled}/>
      </SafeAreaView>
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
    marginBottom: 30,
    marginHorizontal: 35,
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
    marginHorizontal: 20,
    justifyContent: 'flex-start'
  },
  inputBox: {
    marginTop: 13,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  input: {
    ... appStyles.roboto16Text,
    paddingHorizontal: 5,
    paddingVertical: 0,
    width: 60
  },
  inputRow: {
    flexDirection: 'row',
  },
  iccidBox: {
    marginVertical: 12,
    marginHorizontal: 20,
    paddingHorizontal: isDeviceSize('small') ? 10 : 20,
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
  delimiter: {
    paddingVertical: 3
  },
  container: {
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
    marginTop: isDeviceSize('small') ? 20 : 40,
    marginHorizontal: 20,
  }
});

const mapStateToProps = (state) => ({
  account: state.account.toJS(),
  auth: accountActions.auth(state.account)
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action: {
      sim : bindActionCreators(simActions, dispatch),
      account : bindActionCreators(accountActions, dispatch)
    }
  })
)(RegisterSimScreen)