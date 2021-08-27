import React, {memo, PropsWithChildren} from 'react';
import {Text, TextProps} from 'react-native';

const AppText = React.forwardRef<any, PropsWithChildren<TextProps>>(
  ({allowFontScaling = false, ...props}, ref) => {
    return (
      <Text ref={ref} {...props} allowFontScaling={allowFontScaling}>
        {props.children}
      </Text>
    );
  },
);

export default memo(AppText);
