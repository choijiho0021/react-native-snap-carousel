import React, {memo, PropsWithChildren, useCallback, useState} from 'react';
import {TextInput, TextInputProps, View, ViewStyle} from 'react-native';
import AppButton from './AppButton';

const AppTextInput = React.forwardRef<
  any,
  PropsWithChildren<TextInputProps> & {
    containerStyle?: ViewStyle;
    cancelButtonStyle?: ViewStyle;
    showCancel?: boolean;
    onCancel?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
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
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      if (onFocus) onFocus();
    }, [onFocus]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      if (onBlur) onBlur();
    }, [onBlur]);

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
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {isFocused && value && value.length > 0 && (
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
          allowFontScaling={allowFontScaling}
          onFocus={handleFocus}
          onBlur={handleBlur}>
          {props.children}
        </TextInput>
      </View>
    ) : (
      <TextInput
        ref={ref}
        value={value}
        {...props}
        allowFontScaling={allowFontScaling}
        onFocus={handleFocus}
        onBlur={handleBlur}>
        {props.children}
      </TextInput>
    );
  },
);

export default memo(AppTextInput);
