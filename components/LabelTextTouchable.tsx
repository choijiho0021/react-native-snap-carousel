import React, {memo} from 'react';
import {StyleProp, Pressable, View, ViewStyle} from 'react-native';
import _ from 'underscore';
import AppIcon from './AppIcon';
import LabelText, {LabelTextProps} from './LabelText';

const LabelTextTouchable = ({
  onPress,
  arrow,
  style,
  disabled,
  format,
  labelStyle,
  arrowStyle,
  ...props
}: {
  onPress: () => void;
  arrow?: string;
  arrowStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
} & LabelTextProps) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View style={[style, {flexDirection: 'row', alignItems: 'center'}]}>
        <LabelText
          labelStyle={labelStyle}
          style={{flex: 1}}
          format={format}
          {...props}
        />
        {arrow && (
          <AppIcon
            style={[arrowStyle, {alignSelf: 'center', marginLeft: 10}]}
            name={arrow}
          />
        )}
      </View>
    </Pressable>
  );
};

export default memo(LabelTextTouchable);
