import React from 'react';
import { View } from 'react-native'

export default function Triangle({width, height, color}) {
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        borderTopWidth: height,
        borderTopColor: color || '#7777',
        borderRightWidth: width/2,
        borderRightColor: 'transparent',
        borderLeftWidth: width/2,
        borderLeftColor: 'transparent',
        width: 0,
        height: 0,
      }} />
  )
}