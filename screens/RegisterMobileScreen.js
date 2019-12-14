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
import AppTextInput from '../components/AppTextInput';
import AppAlert from '../components/AppAlert';
import AppIcon from '../components/AppIcon';
import { bindActionCreators } from 'redux'
import InputMobile from '../components/InputMobile';
import InputEmail from '../components/InputEmail';
import { colors } from '../constants/Colors';
import { Map } from 'immutable'
import validationUtil from '../utils/validationUtil';

class RegisterMobileScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('mobile:header')} />
  })

  constructor(props) {
    super(props)

    this.state = {
      querying: false,
      pin: undefined,
      mobile: undefined,
      authorized: undefined,
      authNoti: false,
      confirm: Map({
        "0": false,
        "1": false,
        "2": false,
      }),
      newUser: false
    }

    this.confirmList = [
      {
        key: "0",
        list: [ 
          {color: colors.warmGrey, text:i18n.t('cfm:contract')}, 
          {color: colors.clearBlue, text: i18n.t('cfm:mandatory')}
        ],
        navi: { 
          route: 'SimpleText', 
          param: { key: 'Contract', title: i18n.t('cfm:contract'), mode: 'confirm' } 
        }
      },
      {
        key: "1",
        list: [ 
          {color: colors.warmGrey, text:i18n.t('cfm:personalInfo')}, 
          {color: colors.clearBlue, text: i18n.t('cfm:mandatory')}
        ],
        navi: { 
          route: 'SimpleText', 
          param: { key: 'Privacy', title: i18n.t('cfm:personalInfo'), mode: 'confirm' } 
        }
      },
      {
        key: "2",
        list: [ 
          {color: colors.warmGrey, text:i18n.t('cfm:marketing')}, 
          {color: colors.warmGrey, text: i18n.t('cfm:optional')}
        ],
        navi: { 
          route: 'SimpleText', 
          param: { key: 'Privacy', title: i18n.t('cfm:marketing'), mode: 'confirm' } 
        }
      }
    ]

    this.email = React.createRef()

    this._onSubmit = this._onSubmit.bind(this)
    this._onCancel = this._onCancel.bind(this)
    this._renderItem = this._renderItem.bind(this)
    this._focusAuthInput = this._focusAuthInput.bind(this)

    this.authInputRef = React.createRef()
  } 


  componentDidUpdate(prevProps) {
    if ( this.props.account != prevProps.account) {
      if ( this.props.account.loggedIn) this.props.navigation.navigate('RegisterSim')
    }
  }

  _onSubmit = () => {

    const {email, domain} = this.email.current.state,
      { pin, mobile } = this.state

    const error = validationUtil.validate('email', `${email}@${domain}`)
    if ( ! _.isEmpty(error)) {
      return AppAlert.error(error.email[0])
    }

    userApi.signUp({ user: mobile, pass: pin, email: `${email}@${domain}`})
      .then( resp => {
        if (resp.result === 0 && ! _.isEmpty(resp.objects) ) {
          this._signIn({ mobile, pin })
        }
        else {
          console.log('sign up failed', resp)
          throw new Error('failed to login')
        }
      })
      .catch(err => {
        console.log('sign up failed', err)
        AppAlert.error(i18n.t('reg:fail'))
      })
  }

  _onCancel = () => {
    this.props.onSubmit()
  }

  _focusAuthInput() {
    if ( this.authInputRef.current) this.authInputRef.current.focus()
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
        authorized: undefined
      })

      this._focusAuthInput()

      userApi.sendSms({ user: value })
        .then( resp => {
          if (resp.result === 0) {
            this.setState({
              authNoti: true
            })
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

  _onPress = (key) => () => {
    if ( key == 'pin') {
      const { mobile, pin, authorized } = this.state
      // PIN이 맞는지 먼저 확인한다. 

      if ( authorized ) return;

      return userApi.confirmSmsCode({ user: mobile, pass: pin })
        .then( resp => {
          if (resp.result === 0) {
            this.setState({
              authorized: true,
              newUser: _.isEmpty(resp.objects)
            })

            if ( ! _.isEmpty(resp.objects) ) {
              this._signIn({mobile, pin})
            }
          }
          else {
            console.log('sms confirmation failed', resp)
            throw new Error('failed to send sms')
          }
        })
        .catch(err => {
          console.log('sms confirmation failed', err)
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

    if ( confirm.get(key) ) {
      this._onPress(key)()
    }
    else {
      this.props.navigation.navigate(route, { ...param, onOk: this._onPress(key) })
    }
  }

  _signIn = ({ mobile, pin }) => {
    this.props.action.account.logInAndGetUserId( mobile, pin)

    this.props.navigation.replace('RegisterSim')
  }

  _renderItem({item}) {
    const confirmed = this.state.confirm.get(item.key)

    return (
      <TouchableOpacity onPress={
          item.navi && (item.navi || {}).route ?  
          this._onMove(item.key, item.navi.route, item.navi.param) : 
          this._onPress(item.key)
        }>
        <View style={styles.confirmList}>
          <AppIcon style={{marginRight:10}} name="btnCheck2" checked={confirmed}/>
          <View style={{flexDirection:"row", flex:1}}>
          {
            item.list.map((elm,idx) => (
              <Text key={idx+""} style={[appStyles.normal14Text, {color:elm.color}]}>{elm.text}</Text>
            ))
          }
          </View>
          <AppIcon style={{marginRight:10, marginTop:5}} name="iconArrowRight"/>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { mobile, authorized, disable, pin, confirm, authNoti, newUser } = this.state
    const disableButton = ! authorized || ( newUser && !(confirm.get("0") && confirm.get("1")) ),
      disablePin = ! mobile || ! authNoti || authorized,
      clickablePin = mobile && authNoti && _.size(pin) === 6

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{i18n.t('mobile:title')}</Text>

        <InputMobile style={{marginTop:30, paddingHorizontal:20}}
          onPress={this._onChangeText('mobile')}
          authNoti={authNoti }
          disabled={authNoti &&  authorized}/>

        {
          <AppTextInput 
            style={{marginTop:26, paddingHorizontal:20}}
            ref={this.authInputRef}
            placeholder={i18n.t('mobile:auth')}
            keyboardType="numeric"
            enablesReturnKeyAutomatically={true}
            maxLength={6}
            clearTextOnFocus={true}
            disabled={ disablePin }
            clickable={ clickablePin }
            autoFocus={true}
            onChangeText={this._onChangeText('pin')}
            onPress={this._onPress('pin')}
            value={pin}
            titleStyle={styles.smsButtonText}
            titleDisableColor={colors.white}
            inputStyle={[styles.inputStyle, pin ? {} : styles.emptyInput ]}
            textContentType="oneTimeCode" />
        }

        {
          mobile && (typeof authorized == 'undefined' ? null : 
            <Text style={[styles.helpText, {color: authorized ? colors.clearBlue : colors.tomato}]}>
              {i18n.t( authorized ? 'mobile:authMatch' : 'mobile:authMismatch')}
            </Text>
            )
        }


        <View style={{flex:1}}>
          {
            newUser && authorized &&

            <View style={{flex:1}}>

              <InputEmail style={{marginTop:38, paddingHorizontal:20}} ref={this.email}/>
              
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
    paddingVertical: 13,
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