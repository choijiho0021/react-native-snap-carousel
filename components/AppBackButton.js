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
    const {navigation, back, cart} = this.props

    if ( back == 'top') return navigation.popToTop()
    if ( back == 'lastTab') {
      const parent = navigation.dangerouslyGetParent()
      if ( parent) parent.navigate(cart.lastTab)
    }

    return navigation.goBack()
  }

  render() {
    const {title} = this.props

    return (
      <TouchableWithoutFeedback onPress={this._goBack} >
        <View style={{flexDirection: "row", alignItems:"flex-end"}}>
          <Image style={{marginLeft: 20}} source={require('../assets/images/header/btnBack.png')} />
          <Text style={[appStyles.subTitle, {marginLeft:16}]}>{title}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default connect((state) => ({
  cart: state.cart.toJS()
}))(AppBackButton)