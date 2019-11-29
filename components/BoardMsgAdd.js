import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  findNodeHandle,
  TextInput
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
import AppTextInput from './AppTextInput';
import { colors } from '../constants/Colors';

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

    this.state = {
      querying: false,
      name: undefined,
      mobile: undefined,
      email: undefined,
      title: undefined,
      msg: undefined,
      disable: false,
      checkMobile: false,
      checkEmail: false,
      errors: undefined
    }

    this._onSubmit = this._onSubmit.bind(this)
    this._onCancel = this._onCancel.bind(this)
    this._validate = this._validate.bind(this)
    this._error = this._error.bind(this)
    this._scrolll = this._scrolll.bind(this)
  } 

  componentDidMount() {
    const { mobile, email} = this.props.account,
      number = utils.toPhoneNumber(mobile)

    this.setState({
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
    const { title, msg, mobile} = this.state
    const issue = {
      title, msg, mobile,
    }

    this.props.action.board.postAndGetList(issue)
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

  render() {
    const { disable, mobile, title, msg, errors = {}, checkMobile} = this.state
    // errors object의 모든 value 값들이 undefined인지 확인한다.
    const hasError = Object.values(errors).findIndex(val => ! _.isEmpty(val)) >= 0

    return (
      <KeyboardAwareScrollView 
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.modalInner}
        extraScrollHeight={60}
        innerRef={ref => { this.scroll = ref; }}>

        <View style={styles.container}>
          <Text style={styles.label}>{i18n.t('board:contact')}</Text>
          <TextInput style={styles.button}
            placeholder={i18n.t('board:noMobile')}
            returnKeyType='next'
            enablesReturnKeyAutomatically={true}
            maxLength={13}
            disabled={disable}
            onChangeText={this._onChangeText('mobile')}
            error={this._error('mobile')}
            defaultValue={utils.toPhoneNumber(mobile)} /> 

          <Text style={styles.noti}>{i18n.t('board:noti')}</Text>

          <View style={{flex:1}}>
            <TextInput style={styles.inputBox}
              placeholder={i18n.t('title')}
              returnKeyType='next'
              enablesReturnKeyAutomatically={true}
              clearTextOnFocus={false}
              disabled={disable}
              onChangeText={this._onChangeText('title')}
              error={this._error('title')}
              autoCapitalize='none'
              autoCorrect={false}
              value={title} /> 

            <TextInput style={[styles.inputBox, {height:208}]}
              placeholder={i18n.t('content')}
              multiline={true}
              numberOfLines={8}
              enablesReturnKeyAutomatically={true}
              clearTextOnFocus={false}
              disabled={disable}
              onChangeText={this._onChangeText('msg')}
              error={this._error('msg')}
              autoCapitalize='none'
              autoCorrect={false}
              onContentSizeChange={this._scrolll}
              value={msg} />
          </View>

          <AppButton style={[appStyles.confirm, {marginTop:30}]} 
            title={i18n.t('board:new')} 
            disabled={hasError}
            onPress={this._onSubmit}/>
        </View>

        <AppActivityIndicator visible={this.state.querying} />
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
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
    color: colors.greyish,
    paddingHorizontal: 10,
  },
  noti: {
    ... appStyles.normal12Text,
    flex: 1,
    height: 90,
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
    color: colors.greyish,
    borderBottomColor: colors.warmGrey,
    borderBottomWidth: 1
  },

  modalInner: {
    justifyContent: 'flex-start'
  }
});

const mapStateToProps = (state) => ({
  account: state.account.toJS(),
  auth: accountActions.auth(state.account),
  pending: state.pender.pending[boardActions.GET_ISSUE_LIST],
  success: state.pender.pending[boardActions.GET_ISSUE_LIST]
})

export default connect(mapStateToProps,
  (dispatch) => ({
    action: {
      board : bindActionCreators(boardActions, dispatch)
    }
  })
)(BoardMsgAdd)