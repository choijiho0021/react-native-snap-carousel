import React, {memo} from 'react';
import {View} from 'react-native';

function Triangle({width, height, color}) {
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        borderTopWidth: height,
        borderTopColor: color || '#7777',
        borderRightWidth: width / 2,
        borderRightColor: 'transparent',
        borderLeftWidth: width / 2,
        borderLeftColor: 'transparent',
        width: 0,
        height: 0,
      }}
    />
  );
}

export default memo(Triangle);
