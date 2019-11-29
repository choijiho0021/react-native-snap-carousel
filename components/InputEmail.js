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
        <View style={[styles.textInputWrapper,
          email ? styles.completedTextInputWrapper : {}]}>
          <TextInput style={styles.textInput} 
            placeholder={i18n.t('reg:email')}
            returnKeyType='next'
            enablesReturnKeyAutomatically={true}
            clearTextOnFocus={true}
            onChangeText={this._onChangeText('email')}
            value={email} /> 
        </View>

        <Text style={[appStyles.normal12Text, styles.textInput]}>@</Text>

        <View style={[styles.textInputWrapper, {flex:1, marginLeft:10},
          domain ? styles.completedTextInputWrapper : {}]}>
          <TextInput style={styles.textInput} 
            returnKeyType='next'
            enablesReturnKeyAutomatically={true}
            clearTextOnFocus={true}
            editable={domainIdx == DIRECT_INPUT}
            onChangeText={this._onChangeText('domain')}
            value={domain} /> 
        </View>

        <View style={styles.pickerWrapper}>
          <RNPickerSelect style={{
            placeholder: styles.placeholder,
            inputIOS: {
              color: domainIdx === DIRECT_INPUT ? colors.warmGrey : colors.black,
            },
            inputAndroid: {
              color: domainIdx === DIRECT_INPUT ? colors.warmGrey : colors.black,
            },
            iconContainer: {
              bottom: 5,
              right: 10,
            },}}
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
  textInputWrapper: {
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
    width: 106,
    marginRight: 10,
    paddingLeft: 10
  },
  completedTextInputWrapper: {
    borderBottomColor: colors.black,
  },
  textInput: {
    paddingTop: 9,
    color: "#777777"
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
  },
  placeholder: {
    ... appStyles.normal14Text
  },
});


export default InputEmail