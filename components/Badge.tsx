import React from 'react';
import {Text, TextStyle, View, ViewStyle} from 'react-native';

const size = 18;

const Badge = ({
  containerStyle,
  badgeStyle,
  value,
  textStyle,
}: {
  containerStyle: ViewStyle | ViewStyle[];
  badgeStyle: ViewStyle;
  textStyle: TextStyle;
  value: number | string;
}) => {
  return (
    <View style={containerStyle}>
      <View
        style={{
          alignSelf: 'center',
          minWidth: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: '#fff',
          ...badgeStyle,
        }}>
        <Text allowFontScaling={false} style={textStyle}>
          {value}
        </Text>
      </View>
    </View>
  );
};

export default Badge;
