import React from 'react';
import { Image, TouchableWithoutFeedback, View, Text } from 'react-native'
import { appStyles } from '../constants/Styles';

export default function AppBackButton({navigation, title}) {
  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigation.goBack()}>
      <View style={{flexDirection: "row", alignItems:"flex-end"}}>
        <Image style={{marginLeft: 20}} source={require('../assets/images/header/btnBack.png')} />
        <Text style={[appStyles.subTitle, {marginLeft:16}]}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>)
}