import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  findNodeHandle,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import {connect} from 'react-redux'

import i18n from '../utils/i18n'
import * as simActions from '../redux/modules/sim'
import * as accountActions from '../redux/modules/account'
import * as orderActions from '../redux/modules/order'
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { isDeviceSize } from '../constants/SliderEntry.style';
import { openSettings, check, PERMISSIONS } from 'react-native-permissions';
import Analytics from 'appcenter-analytics'

class RegisterSimScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} back={!_.isEmpty(navigation.state.params) && navigation.state.params.back || ''} 
                      title={navigation.getParam('title') || i18n.t('sim:reg')} />
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
      focusInputIccid: false,
      hasCameraPermission : false
    }

    this._onSubmit = this._onSubmit.bind(this)
    this._onCamera = this._onCamera.bind(this)
    this._onScan = this._onScan.bind(this)
    this._updateIccid = this._updateIccid.bind(this)
    this._scrolll = this._scrolll.bind(this)
    this.validIccid = this.validIccid.bind(this)

    this.inputIccid = [...Array(4)].map( () =>  React.createRef() )
    this.defaultIccid = "12345"
    this.defaultLastIccid = "1234"
    this.lastIccidIdx = 6

  }

  componentWillUnmount(){
    const iccid = this.props.account.iccid,
          auth = this.props.auth
    if(iccid && auth){
      this.props.action.order.getUsage(iccid, auth)
    }
  }

  componentDidMount() {
    Analytics.trackEvent('Page_View_Count', {page : 'Register Usim'})
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

    accountApi.validateActCode(iccid, actCode, this.props.auth).then( resp => {

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

  async _onCamera(flag) {

    const permission = Platform.OS == 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA
    const result = await check(permission)
    const hasCameraPermission = result === 'granted'

    if (hasCameraPermission === false) {
      // 카메라 권한을 요청한다.
      AppAlert.confirm( i18n.t('settings'), i18n.t('acc:permCamera'), {
        ok: () => openSettings()
      })
    }
    else{
      this.setState({
        scan: flag,
        hasCameraPermission
      })
    }
  }

  _onScan = ({data, rawData, type}) => {
    this.setState({
      scan: false,
    })
    alert(`${i18n.t('scanned')} ${data}`)
    this._updateIccid(data)
  }

  _scrolll = (event) => {
    this.scroll.props.scrollToFocusedInput(findNodeHandle(event.target));
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
        // if ( iccid.map((elm,i) => i === idx ? value : elm ).every(elm => _.size(elm) === 4) && idx === 3 ) {
          if ( value.length === 4 && idx === 3 ) {
          Keyboard.dismiss()
        }
      }

      return;
    }

    this.setState({
      [key]: value
    })
  }

  validIccid(iccid) {
    let valid = true

    iccid.map((elm,idx) => {
      if(idx == iccid.length-1 && elm.length != 4) valid = false
      else if(idx != iccid.length-1 && elm.length != 5) valid = false
    })
    return valid
  }

  render() {
    const {scan, iccid, actCode, querying, focusInputIccid, hasCameraPermission} = this.state
    const disabled = _.size(iccid) !== 4 || ! this.validIccid(iccid) ||
      _.isEmpty(actCode) || actCode.length < 6
    let iccidIdx = iccid.findIndex(elm => _.size(elm) !== 5)
    if (iccidIdx < 0) iccidIdx = 3

    return (
      <SafeAreaView style={{flex:1}}>
        <AppActivityIndicator visible={querying}/>

        <KeyboardAwareScrollView
          innerRef={ref => { this.scroll = ref; }}
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.container}
          enableOnAndroid={true}
          extraScrollHeight={50} 
          // scrollEnabled={isDeviceSize('small')}
          >

          <TouchableOpacity style={styles.card} onPress={() => this._onCamera(!scan)}>
            <ScanSim scan={scan} onScan={this._onScan} hasCameraPermission={hasCameraPermission}/>
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
                        placeholder={idx == this.lastIccidIdx ? this.defaultLastIccid : this.defaultIccid}
                        placeholderTextColor={colors.greyish}
                        onChangeText={this._onChangeText('iccid', idx/2)}
                        keyboardType='numeric'
                        returnKeyType='done'
                        enablesReturnKeyAutomatically={true}
                        maxLength={idx == this.lastIccidIdx ? 4 : 5}
                        value={ elm }
                        focus={focusInputIccid}
                        blurOnSubmit={false}
                        // onFocus={() => {}} 
                        />
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
                placeholder='123456'
                placeholderTextColor={colors.greyish}
                enablesReturnKeyAutomatically={true}
                maxLength={6}
                clearTextOnFocus={true}
                onFocus={() => this.setState({actCode: ''})}
                onContentSizeChange={this._scrolll}
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
    paddingTop:0,
    paddingBottom:0
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
    justifyContent: 'flex-start',
    width:150
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
    flexGrow: 1
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
  auth: accountActions.auth(state.account),
  order: state.order.toJS(),
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action: {
      sim : bindActionCreators(simActions, dispatch),
      account : bindActionCreators(accountActions, dispatch),
      order: bindActionCreators (orderActions, dispatch),
    }
  })
)(RegisterSimScreen)