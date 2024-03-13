import React, {memo, PropsWithChildren} from 'react';
import {TextInput, TextInputProps, View, ViewStyle} from 'react-native';
import AppButton from './AppButton';

const AppTextInput = React.forwardRef<
  any,
  PropsWithChildren<TextInputProps> & {
    containerStyle?: ViewStyle;
    showCancel?: boolean;
    onCancel?: () => void;
  }
>(
  (
    {
      allowFontScaling = false,
      showCancel = false,
      value,
      onCancel,
      containerStyle,
      ...props
    },
    ref,
  ) => {
    if (showCancel) {
      return (
        <View
          style={[
            containerStyle,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}>
          <TextInput
            ref={ref}
            {...props}
            value={value}
            allowFontScaling={allowFontScaling}
          />
          {value && value.length > 0 && (
            <AppButton
              style={{paddingHorizontal: 18}}
              iconName="btnSearchCancel"
              onPress={() => onCancel?.()}
            />
          )}
        </View>
      );
    }

    return (
      <TextInput
        ref={ref}
        value={value}
        {...props}
        allowFontScaling={allowFontScaling}>
        {props.children}
      </TextInput>
    );
  },
);

export default memo(AppTextInput);
