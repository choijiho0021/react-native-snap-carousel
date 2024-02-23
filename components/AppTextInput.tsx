import React, {memo, PropsWithChildren} from 'react';
import {TextInput, TextInputProps} from 'react-native';

const AppTextInput = React.forwardRef<any, PropsWithChildren<TextInputProps>>(
  ({allowFontScaling = false, ...props}, ref) => {
    return (
      <TextInput ref={ref} {...props} allowFontScaling={allowFontScaling}>
        {props.children}
      </TextInput>
    );
  },
);

export default memo(AppTextInput);
