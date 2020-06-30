import React, { PureComponent } from 'react';
import { Image, TouchableWithoutFeedback, View, Text, BackHandler } from 'react-native'
import {connect} from 'react-redux'
import { appStyles } from '../constants/Styles';
import _ from 'underscore'

class AppBackButton extends PureComponent {
  constructor(props) {
    super(props)

    this._goBack = this._goBack.bind(this)
    this.backHandler = undefined
  }

  _goBack() {
    const {navigation, back, lastTab=[0,1]} = this.props

    //활성화 안된 AppBackButton의 핸들러가 작동하지 않도록 추가
    if(!navigation.isFocused()) {
      return
    }

    if ( back == 'Home') return navigation.navigate('Home')
    // if ( back == 'home') return navigation.reset({routes: [{ name: 'Home' }] });
    if ( back == 'top') return navigation.popToTop()
    if ( back == 'lastTab') return navigation.navigate(lastTab[1])

    return navigation.goBack()
  }

  render() {
    const { title, isPaid=false } = this.props

    return (
      <TouchableWithoutFeedback onPress={isPaid ? null : this._goBack} disabled={isPaid}>
        <View style={{flexDirection: "row", alignItems:'center'}}>
          {
            !isPaid ? 
            <Image style={{marginLeft: 20}} source={require('../assets/images/header/btnBack.png')} />
            :<View style={{marginLeft: 15}}/>
          }
          <Text style={[appStyles.subTitle, {marginLeft:16}]}>{title}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default connect((state) => ({
  lastTab: state.cart.get('lastTab').toJS()
}))(AppBackButton)