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
  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({navigation, title:i18n.t('mobile:header')}),
  })

  constructor(props) {
    super(props)

    this.state = {
      querying: false,
      pin: undefined,
      disable: true,
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
      },
      {
        key: "1",
        list: [ 
          {color: colors.warmGrey, text:i18n.t('cfm:personalInfo')}, 
          {color: colors.clearBlue, text: i18n.t('cfm:mandatory')}
        ],
      },
      {
        key: "2",
        list: [ 
          {color: colors.warmGrey, text:i18n.t('cfm:marketing')}, 
        ]
      }
    ]

    this.email = undefined

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

    const {email, domain} = this.email.state,
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
    const val = {
      [key]: value
    }

    if (key == 'mobile') {
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
    else if (key == 'pin') {
      const { mobile, authNoti } = this.state

      if ( mobile && authNoti && _.size(value) === 6 ) {
        this.setState({
          disable: false
        })
      }
    }

    this.setState(val)
  }

  _onPress = (key) => () => {
    if ( key == 'pin') {
      const { mobile, pin} = this.state
      // PIN이 맞는지 먼저 확인한다. 

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

  _signIn = ({ mobile, pin }) => {
    this.props.action.account.logInAndGetUserId( mobile, pin)

    this.props.navigation.replace('RegisterSim')
  }

  _renderItem({item}) {
    const confirmed = this.state.confirm.get(item.key)

    return (
      <TouchableOpacity onPress={this._onPress(item.key)}>
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
    const disableButton = ! authorized || ( newUser && !(confirm.get("0") && confirm.get("1")) )

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{i18n.t('mobile:title')}</Text>

        <InputMobile style={{marginTop:20, paddingHorizontal:20}}
          onPress={this._onChangeText('mobile')}
          authNoti={authNoti && typeof authorized == 'undefined'}
          completed={authNoti} />

        {
          authNoti && <AppTextInput 
            style={{marginTop:30, paddingHorizontal:20}}
            ref={this.authInputRef}
            placeholder={i18n.t('mobile:auth')}
            keyboardType="numeric"
            enablesReturnKeyAutomatically={true}
            maxLength={6}
            clearTextOnFocus={true}
            disabled={disable}
            onChangeText={this._onChangeText('pin')}
            onPress={this._onPress('pin')}
            value={pin}
            inputStyle={styles.inputText}
            titleStyle={styles.smsButtonText}
            titleDisableColor={colors.white}
            completed={authorized}  />
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

              <InputEmail style={{marginTop:38, paddingHorizontal:20}}
                onRef={ref => this.email = ref}/>
              
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
    marginLeft: 20,
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
  inputText: {
    ... appStyles.normal16Text,
    color: colors.black
  },
  smsButtonText: {
    ... appStyles.normal14Text,
    textAlign: "center",
    color: colors.white,
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