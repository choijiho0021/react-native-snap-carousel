import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  findNodeHandle,
  TextInput,
  TouchableOpacity,
  Image,
  InputAccessoryView
} from 'react-native';
import {connect} from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import * as accountActions from '../redux/modules/account'
import * as boardActions from '../redux/modules/board'
import _ from 'underscore'
import utils from '../utils/utils'
import AppActivityIndicator from './AppActivityIndicator';
import AppButton from './AppButton';
import validationUtil from '../utils/validationUtil';
import { bindActionCreators } from 'redux'
import { colors } from '../constants/Colors';
import { SafeAreaView } from 'react-navigation';
import Constants from 'expo-constants'
import {List} from 'immutable'
import { attachmentSize } from '../constants/SliderEntry.style'
import AppAlert from './AppAlert'
import AppIcon from './AppIcon';
import { Platform } from '@unimodules/core';
import { openSettings, check, PERMISSIONS, RESULTS } from 'react-native-permissions';


let ImagePicker

if (Constants.appOwnership === 'expo') {
  ImagePicker = {
    openPicker : function() {
      return Promise.resolve(undefined)
    }
  }
}
else {
  ImagePicker = require('react-native-image-crop-picker').default
}

class BoardMsgAdd extends Component {
  static navigationOptions = {
    title: i18n.t('board:new')
  }

  static validation = {
    title: {
      presence: {
        message: i18n.t('board:noTitle')
      }
    },
    msg: {
      presence: {
        message: i18n.t('board:noMsg')
      }
    },
  }

  constructor(props) {
    super(props)

    this.initialState = {
      name: undefined,
      mobile: '',
      email: undefined,
      title: undefined,
      msg: undefined,
      disable: false,
      checkMobile: false,
      checkEmail: false,
      errors: {},
      pin: undefined,
      attachment: List(),
    }
 
    this.state = {
      ... this.initialState,
      extraHeight: 80,
      hasPhotoPermission: false,
    }

    this._onSubmit = this._onSubmit.bind(this)
    this._onCancel = this._onCancel.bind(this)
    this._validate = this._validate.bind(this)
    this._error = this._error.bind(this)
    this._scrolll = this._scrolll.bind(this)
    this._addAttachment = this._addAttachment.bind(this)
    this._rmAttachment = this._rmAttachment.bind(this)
    this._renderAttachment = this._renderAttachment.bind(this)
    this._renderContact = this._renderContact.bind(this)

    this._keybd = React.createRef()

  } 

  async componentDidMount() {
    const permission = Platform.OS == 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    const result = await check(permission),
      {mobile, email} = this.props.account,
      number = utils.toPhoneNumber(mobile)

    this.setState({
      hasPhotoPermission: result === RESULTS.GRANTED,
      mobile: number,
      email
    })

    const errors = validationUtil.validateAll({mobile: number}, BoardMsgAdd.validation)
    if ( errors) {
      this.setState({
        errors
      })
    }
  }

  componentDidUpdate(prevProps) {
    if ( this.props.success && this.props.success != prevProps.success) {
      // post가 완료되면 list 텝으로 전환한다. 
      this.props.jumpTo('list');
    }
  }

  _validate = (key, value) => {
    const {errors} = this.state,
      valid = validationUtil.validate(key, value, {[key]: BoardMsgAdd.validation[key]})

    errors[key] = _.isEmpty(valid) ? undefined : valid[key]
    this.setState({
      errors
    })
  }

  _onSubmit = () => {
    const { title, msg, mobile, attachment, pin} = this.state
    const issue = {
      title, msg, mobile, pin
    }

    // reset data
    setTimeout (() => {
      this.setState({
        msg: undefined,
        title: undefined,
        pin : undefined
      })
    }, 1000)

    this.props.action.board.postAndGetList(issue, attachment.toJS())
  }

  _onCancel = () => {
    this.props.onSubmit()
  }

  _onChangeText = (key) => (value) => {

    this.setState({
      [key] : value
    })

    this._validate(key, value)
  }

  _error(key) {
    const {errors} = this.state
    return ( ! _.isEmpty(errors) && errors[key] ) ? errors[key][0] : ''
  }

  _scrolll = (event) => {
    this.scroll.props.scrollToFocusedInput(findNodeHandle(event.target));
  }
  
  async _addAttachment() {

    let checkNewPermission = false

    if(!this.state.hasPhotoPermission){
      const permission = Platform.OS == 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      const result = await check(permission)

      checkNewPermission =  result === RESULTS.GRANTED
    }

    if ( this.state.hasPhotoPermission || checkNewPermission) {
      ImagePicker && ImagePicker.openPicker({
        width: 750,
        height: 1334,   // iphone 8 size
        cropping: true,
        includeBase64: true,
        writeTempFile: false,
        mediaType: 'photo',
        forceJpb: true,
        cropperChooseText: i18n.t('select'),
        cropperCancelText: i18n.t('cancel'),
      }).then(image => {
        this.setState({
          attachment: this.state.attachment.push(image)
        })
      }).catch(err => {
        console.log('failed to select', err)
      })
    }
    else {
      // 사진 앨범 조회 권한을 요청한다.
      AppAlert.confirm( i18n.t('settings'), i18n.t('acc:permPhoto'), {
        ok: () => openSettings()
      })
    }
  }

  _rmAttachment(idx) {
    this.setState({
      attachment: this.state.attachment.delete(idx)
    })
  }


  _renderPass() {
    const {pin} = this.state
    return (
      <View style={styles.passwordBox}>
        <Text style={[appStyles.normal14Text, {color:colors.tomato, marginRight:5, textAlignVertical:"center"}]}>*</Text>
        <Text style={[appStyles.normal14Text,{textAlignVertical:"center"}]}>{i18n.t('board:pass')}</Text>
        <TextInput style={styles.passwordInput}
          placeholder={i18n.t('board:inputPass')}
          placeholderTextColor={colors.greyish}
          keyboardType="numeric"
          returnKeyType='done'
          enablesReturnKeyAutomatically={true}
          maxLength={4}
          secureTextEntry={true}
          onChangeText={this._onChangeText('pin')} 
          value={pin}
          onFocus={() => this.setState({extraHeight: 20})}
          /> 
      </View>
    )
  }

  _renderAttachment() {
    const { attachment } = this.state
    return (
      <View>
        <Text style={styles.attachTitle}>{i18n.t('board:attach')}</Text>
        <View style={styles.attachBox}>
          {
            attachment.map((image,idx) => (
              <TouchableOpacity key={image.filename} 
                style={[styles.attach, idx < 2 && {marginRight:33}]} 
                onPress={() => this._rmAttachment(idx)}>
                <Image style={styles.imgSize} source={{uri:`data:${image.mime};base64,${image.data}`}} />
                <AppIcon name="btnBoxCancel" style={styles.attachCancel}/>
              </TouchableOpacity>
            ))
          }
          {
            attachment.size < 3 && <TouchableOpacity key="add" 
              style={[styles.attach, styles.plusButton]} onPress={this._addAttachment}>
                <AppIcon name="btnPhotoPlus"/>
              </TouchableOpacity>
          }
        </View>
      </View>
    )
  }

  _renderContact() {
    const { disable, mobile} = this.state

    return (
      <View>
        <Text style={styles.label}>{i18n.t('board:contact')}</Text>
        <TextInput style={styles.button}
          placeholder={i18n.t('board:noMobile')}
          placeholderTextColor={colors.greyish}
          keyboardType='numeric'
          returnKeyType='next'
          enablesReturnKeyAutomatically={true}
          maxLength={13}
          disabled={disable}
          onChangeText={(value) => this._onChangeText('mobile')(utils.toPhoneNumber(value))}
          onFocus={() => this.setState({extraHeight: 20})}
          error={this._error('mobile')}
          value = {mobile}
          /> 
      </View> 
    )
  }

  render() {
    const { disable, title, msg, extraHeight, pin, mobile, errors = {} } = this.state
    const inputAccessoryViewID = "doneKbd"
    // errors object의 모든 value 값들이 undefined인지 확인한다.
    const hasError = Object.values(errors).findIndex(val => ! _.isEmpty(val)) >= 0 ||
      (! this.props.isLoggedIn && _.isEmpty(pin)) || _.isEmpty(msg) || _.isEmpty(title) || _.isEmpty(mobile)

    return (
      <SafeAreaView style={styles.container}>
        <AppActivityIndicator visible={this.props.pending} />

        <KeyboardAwareScrollView 
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.modalInner}
          extraScrollHeight={extraHeight}
          innerRef={ref => { this.scroll = ref; }}>

          {
            this.props.isLoggedIn == false && this._renderContact()
          }

          <Text style={styles.noti}>{i18n.t('board:noti')}</Text>

          <View style={{flex:1}}>
            <TextInput style={[styles.inputBox, title && {borderColor: colors.black}]}
              placeholder={i18n.t('title')}
              placeholderTextColor={colors.greyish}
              returnKeyType='next'
              enablesReturnKeyAutomatically={true}
              clearTextOnFocus={false}
              disabled={disable}
              maxLength={25}
              onChangeText={this._onChangeText('title')}
              onFocus={() => this.setState({extraHeight: 20})}
              error={this._error('title')}
              autoCapitalize='none'
              autoCorrect={false}
              value={title} /> 

            <TextInput style={[styles.inputBox, {height:208, paddingTop:5, textAlignVertical:"top"}, msg && {borderColor: colors.black}]}
              ref={this._keybd}
              placeholder={i18n.t('content')}
              placeholderTextColor={colors.greyish}
              multiline={true}
              numberOfLines={8}
              inputAccessoryViewID={inputAccessoryViewID}
              enablesReturnKeyAutomatically={true}
              clearTextOnFocus={false}
              disabled={disable}
              maxLength={2000}
              onChangeText={this._onChangeText('msg')}
              onFocus={() => this.setState({extraHeight: 80})}
              error={this._error('msg')}
              autoCapitalize='none'
              autoCorrect={false}
              onContentSizeChange={this._scrolll}
              value={msg} />

            {
              this.props.isLoggedIn ? this._renderAttachment() : this._renderPass()
            }

          </View>
        </KeyboardAwareScrollView>

        {Platform.OS == 'ios' ? 
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <AppButton style={styles.inputAccessory} 
            title={i18n.t('done')} 
            titleStyle={[styles.inputAccessoryText, {color: _.isEmpty(this.state.msg) ? colors.white : colors.blue}]}
            onPress={() => this._keybd.current.blur()}/>
        </InputAccessoryView> : null }

        <AppButton style={styles.confirm}
          title={i18n.t('board:new')} 
          disabled={hasError}
          onPress={this._onSubmit}/>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  passwordInput: {
    borderBottomColor: colors.warmGrey,
    borderBottomWidth: 1,
    marginLeft: 15, 
    paddingBottom: 10,
    color:colors.black,
    flex: 1
  },
  passwordBox: {
    flexDirection: 'row',
    marginTop: 30,
    marginHorizontal: 20
  },
  inputAccessoryText: {
    ... appStyles.normal18Text,
    textAlign: "center",
    margin: 5,
  },
  inputAccessory: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: colors.lightGrey,
    padding: 5,
  },
  plusButton: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  attachCancel: {
    position: 'absolute',
    right: 0, 
    top: 0
  },
  attachBox: {
    marginHorizontal: 20,
    flexDirection: 'row',
  },
  attachTitle: {
    ... appStyles.normal14Text,
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 20
  },
  imgSize: {
    width: attachmentSize,
    height: attachmentSize,
  },
  attach: {
    width: attachmentSize,
    height: attachmentSize,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  confirm: {
    ... appStyles.normal18Text,
    ... appStyles.confirm,
    marginTop: 30
  },
  inputBox: {
    ... appStyles.normal14Text,
    marginTop: 30,
    marginHorizontal: 20,
    height: 50,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.lightGrey,
    color: colors.black,
    paddingHorizontal: 10,
  },
  noti: {
    ... appStyles.normal12Text,
    flex: 1,
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.whiteTwo,
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  container: {
    flex: 1
  },
  label: {
    ... appStyles.normal14Text,
    marginLeft: 20,
    marginTop: 20
  },
  button : {
    ... appStyles.normal16Text,
    height: 40,
    marginTop: 10,
    marginHorizontal: 20,
    color: colors.black,
    borderBottomColor: colors.warmGrey,
    borderBottomWidth: 1
  },

  modalInner: {
    justifyContent: 'space-between'
  }
});

const mapStateToProps = (state) => ({
  account: state.account.toJS(),
  auth: accountActions.auth(state.account),
  isLoggedIn: state.account.get('loggedIn') || false,
  success: state.pender.success[boardActions.POST_ISSUE],
  pending: state.pender.pending[boardActions.POST_ISSUE] || 
    state.pender.pending[boardActions.POST_ATTACH] || false
})

export default connect(mapStateToProps,
  (dispatch) => ({
    action: {
      board : bindActionCreators(boardActions, dispatch)
    }
  })
)(BoardMsgAdd)