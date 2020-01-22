import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux'

import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import * as accountActions from '../redux/modules/account'
import userApi from '../utils/api/userApi';
import _ from 'underscore'
import AppActivityIndicator from '../components/AppActivityIndicator';
import AppButton from '../components/AppButton';
import AppBackButton from '../components/AppBackButton';
import AppAlert from '../components/AppAlert';
import AppIcon from '../components/AppIcon';
import { bindActionCreators } from 'redux'
import InputMobile from '../components/InputMobile';
import InputEmail from '../components/InputEmail';
import { colors } from '../constants/Colors';
import { Map } from 'immutable'
import validationUtil from '../utils/validationUtil';
import InputPinInTime from '../components/InputPinInTime';
import api from '../utils/api/api';

class RegisterMobileScreen extends Component {
  static navigationOptions = ({navigation, state}) => ({
    headerLeft: <AppBackButton navigation={navigation} back={'lastTab'} title={i18n.t('mobile:header')} />
  })

  constructor(props) {
    super(props)

    this.state = {
      querying: false,
      pin: undefined,
      mobile: undefined,
      authorized: undefined,
      authNoti: false,
      timeout: false,
      confirm: Map({
        "0": false,
        "1": false,
        "2": false,
      }),
      newUser: false,
      emailValidation: {
        isValid: false,
        error: undefined
      }
    }

    this.confirmList = [
      {
        key: "0",
        list: [ 
          {color: colors.warmGrey, text:i18n.t('cfm:contract')}, 
          {color: colors.clearBlue, text: i18n.t('cfm:mandatory')}
        ],
        navi: { 
          route: 'SimpleTextForAuth', 
          param: { key: 'TNC', title: i18n.t('cfm:contract') } 
        }
      },
      {
        key: "1",
        list: [ 
          {color: colors.warmGrey, text:i18n.t('cfm:personalInfo')}, 
          {color: colors.clearBlue, text: i18n.t('cfm:mandatory')}
        ],
        navi: { 
          route: 'SimpleTextForAuth', 
          param: { key: 'PrivacyPolicy', title: i18n.t('cfm:personalInfo') } 
        }
      },
      {
        key: "2",
        list: [ 
          {color: colors.warmGrey, text:i18n.t('cfm:marketing')}, 
          {color: colors.warmGrey, text: i18n.t('cfm:optional')}
        ],
        navi: { 
          route: 'SimpleTextForAuth', 
          param: { key: 'MarketingAgreement', title: i18n.t('cfm:marketing') } 
        }
      }
    ]

    this.email = React.createRef()

    this._onSubmit = this._onSubmit.bind(this)
    this._onCancel = this._onCancel.bind(this)
    this._renderItem = this._renderItem.bind(this)
    this._focusAuthInput = this._focusAuthInput.bind(this)
    this._focusEmailInput = this._focusEmailInput.bind(this)

    this.authInputRef = React.createRef()
    this._isMounted = false
    this.controller = new AbortController()
  } 


  componentDidUpdate(prevProps) {
    if ( this.props.account != prevProps.account) {
      if ( this.props.account.loggedIn) {
        this.props.navigation.navigate('Main')
      }
    }
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
    this.controller.abort()
  }

  _onSubmit = async () => {

    const {email, domain} = this.email.current.state,
      { pin, mobile, confirm } = this.state

    let error = validationUtil.validate('email', `${email}@${domain}`),
      isValid = true

    try {
      if ( ! _.isEmpty(error) ) {
        isValid = false
        this.setState({ emailValidation: { isValid, error: error.email[0] } })
      }
      else {
        let resp = await userApi.confirmEmail({ email: `${email}@${domain}` })
        if ( resp.result !== 0 && resp.result !== api.INVALID_ARGUMENT ) {
          console.log('confirm email failed', resp)
          throw new Error('failed to confirm email')
        }

        isValid = resp.result === 0
        this.setState({ emailValidation: { isValid, error: isValid ? undefined : i18n.t('acc:duplicatedEmail') } })
      }

      if ( isValid && this._isMounted ) {
        let resp = await userApi.signUp({ user: mobile, pass: pin, email: `${email}@${domain}`, mktgOptIn: confirm.get('2')})

        if (resp.result === 0 && ! _.isEmpty(resp.objects) ) {
          this._signIn({ mobile, pin })
        }
        else {
          console.log('sign up failed', resp)
          throw new Error('failed to login')
        }

      }
    } catch(err) {
      console.log('sign up failed', err)
      AppAlert.error(i18n.t('reg:fail'))
    }
  }

  _onCancel = () => {
    this.props.onSubmit()
  }

  _focusAuthInput() {
    if ( this.authInputRef.current) this.authInputRef.current.focus()
  }

  _focusEmailInput() {
    if ( this.email.current )  this.email.current._focusInput()
  }

  _onChangeText = (key) => (value) => {
    const { authorized } = this.state

    const val = {
      [key]: value
    }

    if (key == 'mobile') {
      if ( authorized ) return;

      this.setState({ 
        pin: undefined,
        authorized: undefined,
        timeout: true
      })

      userApi.sendSms({ user: value, abortController: this.controller })
        .then( resp => {
          if (resp.result === 0) {
            this.setState({
              authNoti: true,
              timeout: false
            })

            this._focusAuthInput()
          }
          else {
            console.log('send sms failed', resp)
            throw new Error('failed to send sms')
          }
        })
        .catch(err => {
          console.log('send sms failed', err)
          AppAlert.error(i18n.t('reg:failedToSendSms'))
        })
    } 

    this.setState(val)
  }

  _onPress = (key) => (value) => {
    if ( key == 'pin') {
      const { mobile, authorized } = this.state,
        pin = value
      // PIN이 맞는지 먼저 확인한다. 

      if ( authorized ) return;

      return userApi.confirmSmsCode({ user: mobile, pass: pin, abortController: this.controller })
        .then( resp => {
          if (resp.result === 0 && this._isMounted) {
            this.setState({
              authorized: true,
              newUser: _.isEmpty(resp.objects),
              pin
            })

            if ( ! _.isEmpty(resp.objects) ) {
              this._signIn({mobile, pin})
            }
            else {
              this._focusEmailInput()
            }
          }
          else {
            console.log('sms confirmation failed', resp)
            throw new Error('failed to send sms')
          }
        })
        .catch(err => {
          console.log('sms confirmation failed', err)

          if ( ! this._isMounted ) return;

          this.setState({
            authorized: false
          })
        })
    }

    const { confirm } = this.state

    this.setState({
      confirm: confirm.update(key, value => ! value)
    })
  }

  _onMove = (key, route, param ) => () => {
    const { confirm } = this.state

    if ( ! _.isEmpty(route) ) {
      this.props.navigation.navigate(route, param)
    }
  }

  _signIn = ({ mobile, pin }) => {
    this.props.action.account.logInAndGetAccount( mobile, pin)
    this.props.navigation.navigate('Main')
  }

  _onTimeout = () => {
    this.setState({
      timeout: true
    })
  }

  _renderItem({item}) {
    const confirmed = this.state.confirm.get(item.key),
      navi = item.navi || {}

    return (
      <View style={styles.confirmList}>
        <TouchableOpacity onPress={this._onPress(item.key)} activeOpacity={1} style={{paddingVertical: 13}}>
          <AppIcon style={{marginRight:10}} name="btnCheck2" checked={confirmed}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._onMove(item.key, navi.route, navi.param)} activeOpacity={1}
          style={[styles.rowStyle, {paddingVertical: 13}]}>
          <View style={styles.rowStyle}>
            {
              item.list.map((elm,idx) => (
                <Text key={idx+""} style={[styles.confirmItem, {color:elm.color}]}>{elm.text}</Text>
              ))
            }
          </View>
          <AppIcon style={{marginRight:10, marginTop:5}} name="iconArrowRight"/>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { mobile, authorized, confirm, authNoti, newUser, timeout, emailValidation } = this.state,
      { isValid, error } = emailValidation || {}
    const disableButton = ! authorized || ( newUser && !(confirm.get("0") && confirm.get("1")) )

    return (
      <SafeAreaView style={styles.container} forceInset={{ top: 'never', bottom:"always"}}>
        <Text style={styles.title}>{i18n.t('mobile:title')}</Text>

        <InputMobile style={{marginTop:30, paddingHorizontal:20}}
          onPress={this._onChangeText('mobile')}
          authNoti={authNoti }
          disabled={authNoti &&  authorized}
          timeout={ timeout }/>

        <InputPinInTime style={{marginTop:26, paddingHorizontal:20}}
          forwardRef={this.authInputRef}
          editable={ mobile && authNoti && ! authorized }
          clickable={ mobile && authNoti && ! timeout && ! authorized }
          authorized={ mobile ? authorized : undefined }
          countdown={ authNoti && ! authorized && ! timeout }
          onTimeout={ this._onTimeout }
          onPress={this._onPress('pin')}
          duration={180}/>

        <View style={{flex:1}}>
          {
            newUser && authorized &&

            <View style={{flex:1}}>

              <InputEmail style={{marginTop:38, paddingHorizontal:20}} ref={this.email}/>

              {
                  isValid ? null :
                  <Text style={[styles.helpText, {color: colors.errorBackground}]}>
                      {error}
                  </Text>
              }
              
              <View style={styles.divider}/>

              <View style={{paddingHorizontal:20, flex:1}}>
                <FlatList data={this.confirmList} renderItem={this._renderItem} extraData={confirm}/>
              </View>


              <View>
                <AppButton style={styles.confirm}
                    title={i18n.t('ok')} 
                    titleStyle={styles.text}
                    disabled={disableButton}
                    disableColor={colors.black}
                    disableBackgroundColor={colors.lightGrey}
                    onPress={this._onSubmit}/>
              </View>

            </View>
          }
          
        </View>

        <AppActivityIndicator visible={this.props.pending} />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  helpText: {
    ... appStyles.normal14Text,
    color: colors.clearBlue,
    marginTop: 13,
    marginLeft: 30,
  },
  title: {
    ... appStyles.h1,
    paddingHorizontal: 20
  },
  confirmList: {
    flexDirection: "row",
    height: 46,
    borderBottomColor: colors.ligtyGrey,
    borderBottomWidth: 0.5,
    //paddingVertical: 13,
  },
  confirm: {
    width: "100%",
    height: 52,
    backgroundColor: colors.clearBlue
  },
  divider: {
    marginTop:30,
    width: "100%",
    height: 10,
    backgroundColor: "#f5f5f5"
  },
  field : {
    width: "100%"
  },
  button : {
    width: '70%'
  },
  text: {
    ... appStyles.normal18Text,
    textAlign: "center",
    color: colors.white
  },
  container: {
    marginTop: 20,
    flex:1,
    justifyContent: "flex-start",
  },
  smsButtonText: {
    ... appStyles.normal14Text,
    textAlign: "center",
    color: colors.white,
  },
  inputStyle: {
    flex: 1,
    marginRight: 10,
    paddingBottom: 9,
  },
  emptyInput: {
    borderBottomColor: colors.lightGrey
  },
  confirmItem: {
    ...appStyles.normal14Text,
    textAlignVertical: 'bottom',
    lineHeight: 19
  },
  rowStyle: {
    flexDirection:"row", 
    flex:1
  }
});

const mapStateToProps = (state) => ({
  account: state.account.toJS(),
  pending: state.pender.pending[accountActions.LOGIN] || false,
  loginSuccess: state.pender.success[accountActions.LOGIN],
  loginFailure: state.pender.failure[accountActions.LOGIN],
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action: {
      account : bindActionCreators(accountActions, dispatch)
    }
  })
)(RegisterMobileScreen)