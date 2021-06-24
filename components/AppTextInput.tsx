import React, {memo} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppButton from './AppButton';

const styles = StyleSheet.create({
  input: {
    ...appStyles.normal16Text,
    color: colors.black,
    paddingHorizontal: 10,
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    marginRight: 20,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});

type AppTextInputProps = {
  style: StyleProp<ViewStyle>;
  inputStyle: StyleProp<ViewStyle>;
  disabled: boolean;
  clickable: boolean;
  onPress: () => void;
  iconName: string;
  direction: string;
  buttonStyle: StyleProp<ViewStyle>;
  checked: boolean;
  titleStyle: StyleProp<TextStyle>;
  title?: string;
  titleDisableColor?: string;
};

const AppTextInput: React.FC<AppTextInputProps> = ({
  style,
  inputStyle,
  disabled,
  clickable,
  onPress,
  iconName,
  direction,
  buttonStyle,
  checked,
  titleStyle,
  title,
  titleDisableColor,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        {...props}
        style={[styles.input, inputStyle]}
        editable={!disabled}
        selectTextOnFocus={!disabled}
      />
      <AppButton
        disabled={typeof clickable === 'boolean' ? !clickable : disabled}
        onPress={onPress}
        iconName={iconName}
        direction={direction}
        style={buttonStyle}
        checked={checked}
        titleStyle={titleStyle}
        title={title || i18n.t('ok')}
        disableColor={titleDisableColor}
      />
    </View>
  );
};

export default memo(AppTextInput);
