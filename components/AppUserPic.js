import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native'
import api from '../utils/api/api'
import AppIcon from './AppIcon';

export default function AppUserPic({style, url, icon, onPress}) {
  return ( 
    <TouchableOpacity onPress={onPress}>
      <View style={[style, {alignSelf:'center'}]}>
        {
          url ?
          <Image source={{uri:api.httpImageUrl(url)}} style={[style, {borderRadius: style.width/2}]}/> :
          <AppIcon name={icon}/>
        }
      </View>
    </TouchableOpacity>
  )
}
