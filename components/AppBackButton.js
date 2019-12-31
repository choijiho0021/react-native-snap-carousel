import React, { PureComponent } from 'react';
import { Image, TouchableWithoutFeedback, View, Text } from 'react-native'
import {connect} from 'react-redux'
import { appStyles } from '../constants/Styles';
import _ from 'underscore'

class AppBackButton extends PureComponent {
  constructor(props) {
    super(props)

    this._goBack = this._goBack.bind(this)
  }

  _goBack() {
    const {navigation, back, lastTab} = this.props

    if ( back == 'top') return navigation.popToTop()
    if ( back == 'lastTab') {
      const tab = (lastTab[0] == 'CartStack') ? lastTab[1] : lastTab[0]
      return navigation.navigate(tab)
    }

    return navigation.goBack()
  }

  render() {
    const {title} = this.props

    return (
      <TouchableWithoutFeedback onPress={this._goBack} >
        <View style={{flexDirection: "row", alignItems:'center'}}>
          <Image style={{marginLeft: 20}} source={require('../assets/images/header/btnBack.png')} />
          <Text style={[appStyles.subTitle, {marginLeft:16, marginBottom:2}]}>{title}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default connect((state) => ({
  lastTab: state.cart.get('lastTab').toJS()
}))(AppBackButton)