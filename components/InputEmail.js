import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Picker } from 'react-native'
import i18n from '../utils/i18n'
import RNPickerSelect from 'react-native-picker-select';
import { colors } from '../constants/Colors';
import _ from 'underscore'
import Triangle from './Triangle';
import { appStyles } from '../constants/Styles';

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

  render() {
    const {domain, email, domainIdx} = this.state

    return (
      <View style={[styles.container, this.props.style]}>
        <View style={[styles.textInputWrapper, email? {} : styles.emptyInput]}>
          <TextInput style={[styles.textInput, email? {} : styles.emptyInput]} 
            placeholder={i18n.t('reg:email')}
            returnKeyType='next'
            enablesReturnKeyAutomatically={true}
            clearTextOnFocus={true}
            onChangeText={this._onChangeText('email')}
            value={email} /> 
        </View>

        <Text style={[appStyles.normal12Text, styles.textInput, email? {} : styles.emptyInput]}>@</Text>

        <View style={[styles.textInputWrapper, domain? {} : styles.emptyInput, {flex:1, marginLeft:10}]}>
          <TextInput style={[styles.textInput, domain? {} : styles.emptyInput]} 
            returnKeyType='next'
            enablesReturnKeyAutomatically={true}
            clearTextOnFocus={true}
            editable={domainIdx == DIRECT_INPUT}
            onChangeText={this._onChangeText('domain')}
            value={domain} /> 
        </View>

        <View style={[styles.pickerWrapper, domainIdx === DIRECT_INPUT ? styles.emptyInput : {}]}>
          <RNPickerSelect style={{
            placeholder: styles.placeholder,
            inputIOS: domainIdx === DIRECT_INPUT ? styles.directInput : styles.noDirectInput,
            inputAndroid: domainIdx === DIRECT_INPUT ? styles.directInput : styles.noDirectInput,
            iconContainer: {
              bottom: 5,
              right: 10,
            },}}
            placeholder={{}}
            onValueChange={this._onChangeText("domainIdx")}
            items={domains}
            value={domainIdx}
            Icon={() => {return (<Triangle width={8} height={6} color={colors.warmGrey}/>)}}
          />
        </View>

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
    paddingTop: 9,
    color: colors.black,
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
    borderColor: colors.black
  },
  placeholder: {
    ... appStyles.normal14Text
  },
});


export default InputEmail