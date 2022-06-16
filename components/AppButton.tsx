import React, {memo, useState} from 'react';
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {API} from '@/redux/api';
import i18n from '@/utils/i18n';
import AppIcon from './AppIcon';
import AppText from './AppText';

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 36,
    borderRadius: 3,
    backgroundColor: colors.clearBlue,
  },
  text: {
    ...appStyles.normal18Text,
    color: colors.white,
    textAlign: 'center',
    margin: 5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

interface AppButtonProps {
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  size?: number | number[];
  title?: string;
  iconName?: string;
  uri?: string;
  onPress?: () => void;
  titleStyle?: StyleProp<TextStyle>;
  checkedStyle?: ViewStyle;
  checked?: boolean;
  disableColor?: string;
  disableBackgroundColor?: string;
  direction?: string;
  checkedColor?: string;
  iconStyle?: ViewStyle;
  viewStyle?: ViewStyle;
  pressedStyle?: ViewStyle;
}

const AppButton: React.FC<AppButtonProps> = ({
  style,
  disabled = false,
  size,
  title,
  iconName,
  uri,
  onPress,
  titleStyle,
  checkedStyle,
  checked,
  disableColor,
  disableBackgroundColor,
  direction,
  checkedColor,
  iconStyle,
  viewStyle,
  pressedStyle,
}) => {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      style={[
        style || styles.button,
        disabled && {
          backgroundColor: disableBackgroundColor || colors.warmGrey,
        },
        checked &&
          (checkedStyle || {borderColor: checkedColor || colors.clearBlue}),
        pressed && pressedStyle,
      ]}
      disabled={disabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}>
      <View
        style={[
          viewStyle || styles.container,
          direction === 'row'
            ? {flexDirection: 'row', justifyContent: 'flex-start'}
            : {justifyContent: 'center'},
        ]}>
        {uri ? (
          <Image source={{uri: API.default.httpImageUrl(uri)}} />
        ) : (
          iconName && (
            <AppIcon
              name={iconName}
              size={size}
              checked={checked}
              style={iconStyle}
            />
          )
        )}
        {title && (
          <AppText
            style={[
              titleStyle || styles.text,
              disabled && {color: disableColor || colors.white},
              checked && {color: checkedColor || colors.clearBlue},
            ]}>
            {title || i18n.t('select')}
          </AppText>
        )}
      </View>
    </Pressable>
  );
};

export default memo(AppButton);
