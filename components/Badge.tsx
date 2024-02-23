import React from 'react';
import {Pressable, Text, TextStyle, View, ViewStyle} from 'react-native';

const size = 18;

const Badge = ({
  containerStyle,
  badgeStyle,
  value,
  textStyle,
  onPress,
}: {
  containerStyle: ViewStyle | ViewStyle[];
  badgeStyle: ViewStyle;
  textStyle: TextStyle;
  value: number | string;
  onPress?: () => void;
}) => {
  const Component = onPress ? Pressable : View;
  return (
    <View style={containerStyle}>
      <Component
        onPress={onPress}
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
      </Component>
    </View>
  );
};

export default Badge;
