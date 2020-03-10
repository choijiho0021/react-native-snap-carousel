import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native'
import api from '../utils/api/api'
import AppIcon from './AppIcon';

export default function AppUserPic({style, url, icon, onPress}) {
  return ( 
    <View style={[style, {alignSelf:'center'}]}>
      <TouchableOpacity onPress={onPress}>
        {
          url ?
          <Image source={{uri:api.httpImageUrl(url)}} style={[style, {borderRadius: style.width/2}]}/> :
          <AppIcon name={icon}/>
        }
      </TouchableOpacity>
    </View>
  )
}
