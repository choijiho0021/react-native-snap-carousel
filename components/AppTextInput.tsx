import React, {memo, PropsWithChildren} from 'react';
import {TextInput, TextInputProps, View, ViewStyle} from 'react-native';
import AppButton from './AppButton';

const AppTextInput = React.forwardRef<
  any,
  PropsWithChildren<TextInputProps> & {
    containerStyle?: ViewStyle;
    cancelButtonStyle?: ViewStyle;
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
      cancelButtonStyle,
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
              style={cancelButtonStyle || {paddingHorizontal: 18}}
              iconName="btnSearchCancel"
              onPress={() => onCancel?.()}
            />
          )}
        </View>
      );
    }

    return containerStyle ? (
      <View style={containerStyle}>
        <TextInput
          ref={ref}
          value={value}
          {...props}
          allowFontScaling={allowFontScaling}>
          {props.children}
        </TextInput>
      </View>
    ) : (
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
