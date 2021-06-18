import React, {memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import {API} from 'RokebiESIM/submodules/rokebi-utils';
import {appStyles} from '../constants/Styles';
import i18n from '../utils/i18n';
import {colors} from '../constants/Colors';
import AppIcon from './AppIcon';

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
  size?: number;
  title?: string;
  iconName?: string;
  uri?: string;
  onPress?: () => void;
  titleStyle?: TextStyle;
  checkedStyle?: ViewStyle;
  checked?: boolean;
  disableColor?: string;
  disableBackgroundColor?: string;
  direction?: string;
  checkedColor?: string;
  iconStyle?: ViewStyle;
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
}) => {
  const align =
    direction === 'row'
      ? {flexDirection: 'row', justifyContent: 'flex-start'}
      : {justifyContent: 'center'};

  return (
    <TouchableOpacity
      style={[
        style || styles.button,
        disabled && {
          backgroundColor: disableBackgroundColor || colors.warmGrey,
        },
        checked &&
          (checkedStyle || {borderColor: checkedColor || colors.clearBlue}),
      ]}
      disabled={disabled}
      onPress={onPress}>
      <View style={[styles.container, align]}>
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
          <Text
            style={[
              titleStyle || styles.text,
              disabled && {color: disableColor || colors.white},
              checked && {color: checkedColor || colors.clearBlue},
            ]}>
            {title || i18n.t('select')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(AppButton);
