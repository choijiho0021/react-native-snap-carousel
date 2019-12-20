import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
} from 'react-native';
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import { colors } from '../constants/Colors';
import AppButton from './AppButton';
import validationUtil from '../utils/validationUtil';
import _ from 'underscore'

class AppModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.default,
      error: undefined
    }

    this._onChangeText = this._onChangeText.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
    this._renderError = this._renderError.bind(this)
  }

  componentDidUpdate(prevProps) {
    if ( this.props.visible && this.props.visible != prevProps.visible) {
      this.setState({
        value: this.props.default
      })
    }
  }

  _onChangeText = (key) => (value) => {
    const val = {
      [key] : value
    }
    const error = validationUtil.validateAll(val)

    this.setState({
      ... val,
      error
    })
  }

  async _onSubmit() {
    const { value } = this.state
    const validated = (this.props.validate && this.props.validate(value)) ||
      (this.props.validateAsync && await this.props.validateAsync(value))

    console.log('validated', validated)

    if ( _.isUndefined(validated)) {
      this.setState({
        showModal: false
      })

      this.props.onOkClose(value)
    }
    else {
      this.setState({
        error: validated
      })
    }
  }

  _renderError() {
    const { error } = this.state

    if ( this.props.mode == 'edit' ) {
      if ( _.isArray(error)) return (
        <View>
        {
          error.map((err,idx) => <Text key={idx+""} style={styles.error}>{err}</Text>)
        }
        </View>
      )

      if ( ! _.isEmpty(error)) return <Text style={styles.error}>{error}</Text>
    }
    return null
  }

  render() {
    const { value, error } = this.state
    const { title } = this.props

    return (
      <Modal animationType="fade"
        transparent={false}
        visible={this.props.visible} >

        <View style={appStyles.modal}>
          <View style={styles.inner}>
            {
              title && <Text style={styles.title}>{title}</Text>
            }

            {
              this.props.mode == 'edit' && <View style={styles.inputBox}>
                  <TextInput style={styles.textInput} 
                    returnKeyType='done'
                    enablesReturnKeyAutomatically={true}
                    onChangeText={this._onChangeText('value')}
                    value={value} /> 

                  <AppButton style={styles.cancelButton} iconName="btnCancel" onPress={() => this._onChangeText('value')('')}/>
                </View>
            }
            {
              this._renderError()
            }

            <View style={styles.row}>
              <AppButton style={styles.button} 
                onPress={this.props.onCancelClose}
                title={i18n.t('cancel')} 
                titleStyle={styles.buttonTitle}/>

              <AppButton style={styles.button} 
                disabled={! _.isEmpty(error)}
                onPress={this._onSubmit}
                title={i18n.t('ok')} 
                titleStyle={{... styles.buttonTitle, color: _.isEmpty(error) ? colors.clearBlue : colors.warmGrey}}/>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  error: {
    ... appStyles.normal14Text,
    color: colors.tomato,
    marginHorizontal: 30,
    marginTop: 10
  },
  cancelButton: {
    width: 20,
    height: 20,
    backgroundColor: colors.white
  },
  button: {
    backgroundColor: colors.white,
    width:65,
    height: 36
  },
  buttonTitle: {
    ... appStyles.normal16Text,
    textAlign: 'right'
  },
  row: {
    marginTop: 40,
    marginHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginTop: 30,
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  textInput: {
    ... appStyles.normal16Text,
    flex: 1,
    paddingVertical: 12,
  },
  title: {
    ... appStyles.normal18Text,
    marginHorizontal: 30
  },
  inner: {
    ... appStyles.modalInner,
    paddingVertical: 25
  }
})

export default AppModal