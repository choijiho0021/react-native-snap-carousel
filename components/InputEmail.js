import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Picker } from 'react-native'
import i18n from '../utils/i18n'
import RNPickerSelect from 'react-native-picker-select';
import { colors } from '../constants/Colors';
import _ from 'underscore'
import Triangle from './Triangle';
import { appStyles } from '../constants/Styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

const DIRECT_INPUT = 'direct'
const domains = [
  {
    label: i18n.t('email:input'), 
    value: DIRECT_INPUT
  },
  {
    label: 'Gmail',
    value: 'gmail.com'
  },
  {
    label: 'Naver',
    value: 'naver.com'
  },
]

class InputEmail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: "",
      domain: "",
      domainIdx: DIRECT_INPUT
    }

    this._onChangeText = this._onChangeText.bind(this)
    this._focusInput = this._focusInput.bind(this)
    this._openPicker = this._openPicker.bind(this)
    this.emailRef = React.createRef()
    this.domainRef = React.createRef()
    this.pickerRef = React.createRef()
  }

  componentDidMount() {
    if ( this.props.onRef) {
      this.props.onRef(this)
    }
  }

  _onChangeText = (key) => (value) => {
    this.setState({
      [key]: value
    })

    if ( key == 'domainIdx' && value != DIRECT_INPUT) {
      // update domain name
      this.setState({
        domain: value
      })
    }
  }

  _focusInput = () => {
    if (this.emailRef.current) this.emailRef.current.focus()
  }

  _openPicker = () => {
    if ( this.pickerRef.current ) this.pickerRef.current.togglePicker()
  }

  render() {
    const {domain, email, domainIdx} = this.state

    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableOpacity style={[styles.textInputWrapper, email? {} : styles.emptyInput, {flex: 1}]}
          onPress={this._focusInput}
          activeOpacity={1}>
          <TextInput style={[styles.textInput, email? {} : styles.emptyInput]} 
            placeholder={i18n.t('reg:email')}
            returnKeyType='next'
            enablesReturnKeyAutomatically={true}
            onChangeText={this._onChangeText('email')}
            autoCapitalize = 'none'
            ref={this.emailRef}
            value={email} /> 
        </TouchableOpacity>

        <Text style={[appStyles.normal12Text, styles.textInput, email? {} : styles.emptyInput]}>@</Text>

        <TouchableOpacity style={[styles.textInputWrapper, domain? {} : styles.emptyInput, {flex:1, marginLeft:10}]}
          onPress={() => { if (this.domainRef.current) this.domainRef.current.focus() }}
          activeOpacity={1}>
          <TextInput style={[styles.textInput, domain? {} : styles.emptyInput]} 
            returnKeyType='next'
            enablesReturnKeyAutomatically={true}
            editable={domainIdx == DIRECT_INPUT}
            onChangeText={this._onChangeText('domain')}
            autoCapitalize = 'none'
            ref={this.domainRef}
            value={domain} /> 
        </TouchableOpacity>

        <TouchableOpacity style={[styles.pickerWrapper, domainIdx === DIRECT_INPUT ? styles.emptyInput : {}]}
          onPress={this._openPicker}
          activeOpacity={1}>
          <RNPickerSelect style={{
            placeholder: styles.placeholder,
            inputIOS: domainIdx === DIRECT_INPUT ? styles.directInput : styles.noDirectInput,
            inputAndroid: [styles.placeholder, domainIdx === DIRECT_INPUT ? styles.directInput : styles.noDirectInput],
            iconContainer: {
              bottom: 5,
              right: 10,
            },
            inputAndroidContainer: {
              bottom: -1
            }}}
            placeholder={{}}
            onValueChange={this._onChangeText("domainIdx")}
            items={domains}
            value={domainIdx}
            useNativeAndroidPickerStyle={false}
            ref={this.pickerRef}
            Icon={() => {return (<Triangle width={8} height={6} color={colors.warmGrey}/>)}}
          />
        </TouchableOpacity>

      </View>
      )
  }
}

const styles = StyleSheet.create({
  noDirectInput: {
    color: colors.black
  },
  directInput: {
    color: colors.warmGrey
  }, 
  emptyInput: {
    ... appStyles.normal16Text,
    borderBottomColor: colors.lightGrey,
    borderColor: colors.lightGrey,
    color: colors.lightGrey
  },
  textInputWrapper: {
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    width: 106,
    marginRight: 10,
    paddingLeft: 10
  },
  textInput: {
    ... appStyles.normal16Text,
    paddingTop: 9,
    color: colors.black,
    paddingBottom: 7,
    textAlignVertical: 'center'
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "stretch"
  },
  pickerWrapper: {
    ... appStyles.borderWrapper,
    width: 96,
    paddingLeft: 10,
    paddingVertical: 8,
    borderColor: colors.black,
    marginTop: 5
  },
  placeholder: {
    ... appStyles.normal14Text,
    lineHeight: 19
  },
});


export default InputEmail