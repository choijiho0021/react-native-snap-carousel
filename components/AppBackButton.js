import React, { PureComponent } from 'react';
import { Image, TouchableWithoutFeedback, View, Text, BackHandler } from 'react-native'
import {connect} from 'react-redux'
import { appStyles } from '../constants/Styles';
import _ from 'underscore'

class AppBackButton extends PureComponent {
  constructor(props) {
    super(props)

    this._goBack = this._goBack.bind(this)
    this.backHandler = null
  }
  
  componentDidMount(){
    const {back} = this.props

    if(back){
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._goBack)
    }
  }

  _goBack() {
    const {navigation, back, lastTab} = this.props

    //Android Backbutton Handler 초기화
    if(this.backHandler){
      this.backHandler.remove()
      this.backHandler = undefined
    }

    var tab = ''
    if ( back == 'top') return navigation.popToTop()
    if ( back == 'lastTab') {
      if( lastTab[0] == 'MyPageStack' || 'UsimStack'){
        tab = 'Home'
      }else{
        tab = (lastTab[0] == 'CartStack') ? lastTab[1] : lastTab[0]
      }
      return navigation.navigate(tab)
    }

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