import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Picker } from 'react-native'
import i18n from '../utils/i18n'
import AppTextInput from './AppTextInput';
import RNPickerSelect from 'react-native-picker-select';
import { colors } from '../constants/Colors';
import _ from 'underscore'
import Triangle from './Triangle';
import { appStyles } from '../constants/Styles';
import utils from '../utils/utils';
import validationUtil from '../utils/validationUtil';

class InputMobile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      prefix: "010",
      mobile: "",
      errors: undefined
    }

    this._onChangeText = this._onChangeText.bind(this)
    this._validate = this._validate.bind(this)
    this._onPress = this._onPress.bind(this)
  }

  componentDidMount() {
    this._validate()

    if ( this.props.onRef) {
      this.props.onRef(this)
    }
  }

  _onChangeText = (key) => (value) => {
    this.setState({
      [key]: value
    })

    this._validate(key, value)
  }

  _validate = (key, value) => {
    const { mobile} = this.state
    const val = {
      mobile,
      [key]: value
    }

    const errors = validationUtil.validateAll( val)
    this.setState({
      errors
    })
    
    return errors
  }

  _error(key) {
    const {errors} = this.state
    return ( ! _.isEmpty(errors) && errors[key] ) ? errors[key][0] : ''
  }

  _onPress() {
    const {prefix, mobile} = this.state

    if ( typeof this.props.onPress === 'function') {
      this.props.onPress( (prefix + mobile).replace(/-/g, ''))
    }
  }

  render() {
    const {prefix, mobile} = this.state
    const {authNoti, completed} = this.props
    const disable = ! _.isEmpty(this._error('mobile'))

    return (
      <View>
        <View style={[styles.container, this.props.style]}>
          <View style={styles.pickerWrapper}>
            <RNPickerSelect style={{
              ... pickerSelectStyles,
              iconContainer: {
                bottom: 5,
                right: 10,
              },}}
              placeholder={{}}
              onValueChange={this._onChangeText("prefix")}
              items={["010", "011", "017", "018", "019"].map(item => ({
                label: item, value: item
              }))}
              value={prefix}
              Icon={() => {
                return (<Triangle width={8} height={6} color={colors.warmGrey}/>)
              }}
            />
          </View>

          <View style={{flex:1}}>
            <AppTextInput 
              placeholder={i18n.t('mobile:input')}
              keyboardType="numeric"
              // returnKeyType='done'
              enablesReturnKeyAutomatically={true}
              maxLength={9}
              blurOnSubmit={false}
              onChangeText={this._onChangeText('mobile')}
              error={this._error('mobile')}
              onPress={this._onPress}
              title={ 
                authNoti || completed ? 
                  i18n.t('mobile:resendAuth') :
                  i18n.t('mobile:sendAuth')
              }
              disabled={disable}
              completed={completed}
              titleStyle={styles.text}
              value={utils.toPhoneNumber(mobile)}/> 
          </View>
        </View>
        {
          authNoti && <Text style={styles.helpText}>{i18n.t('reg:authNoti')}</Text>
        }
      </View>
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
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "stretch"
  },
  pickerWrapper: {
    ... appStyles.borderWrapper,
    width: 76,
    paddingLeft: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  text: {
    ... appStyles.normal14Text,
    color: "#ffffff",
    lineHeight: 19,
    letterSpacing: 0.17,
  },
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    color: colors.black,
    // paddingVertical: 12,
    // paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: 'gray',
    // borderRadius: 4,
    // paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    color: colors.black,
    // paddingHorizontal: 10,
    // paddingVertical: 8,
    // borderWidth: 0.5,
    // borderColor: 'purple',
    // borderRadius: 8,
    // paddingRight: 30, // to ensure the text is never behind the icon
  },
});


export default InputMobile