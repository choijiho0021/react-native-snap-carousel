import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  DatePickerIOS,
} from 'react-native';
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import AppButton from '../components/AppButton'

class DateModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      chosenDate: new Date()
    }

    this.setDate = this.setDate.bind(this)
    this._onPress = this._onPress.bind(this)
  }

  setDate(newDate) {
    this.setState({
      chosenDate: newDate
    })
  }

  _onPress = () => {
    this.props.onPress( this.state.chosenDate.toISOString().split('T')[0])
  }

  render() {
    return (
      <Modal animationType="slide"
        transparent="false"
        visible={this.props.visible} >
        <View style={appStyles.modal}>
          <View style={appStyles.modalInner}>
            <DatePickerIOS date={this.state.chosenDate} 
              mode='date'
              locale={i18n.locale}
              onDateChange={this.setDate} />
            <AppButton containerStyle={appStyles.button} 
              onPress={this._onPress}>{i18n.t('select')}</AppButton>
          </View>
        </View>
      </Modal>
    )
  }
}


export default DateModal