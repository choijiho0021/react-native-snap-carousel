import React, {memo, useState} from 'react';
import {
  GestureResponderEvent,
  Insets,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import AppText from '../AppText';
import toggleIcons from './toggleIcon';
import pressIcons from './pressIcon';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';

const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...appStyles.normal18Text,
    color: colors.white,
    textAlign: 'center',
    margin: 5,
  },
});

interface AppSvgIconProps {
  name: string;
  focused?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  hitSlop?: Insets | number;
  titleStyle?: StyleProp<TextStyle>;
  title?: string;
}

const AppSvgIcon: React.FC<AppSvgIconProps> = ({
  name,
  focused,
  style,
  disabled = false,
  title,
  onPress,
  titleStyle,
  onLongPress,
  onPressIn = () => {},
  onPressOut = () => {},
  hitSlop = 10,
}) => {
  const [idx, setIdx] = useState(0);

  const icon = toggleIcons[name];
  if (icon) {
    if (disabled && icon[2]) {
      return <View style={style}>{icon[2]}</View>;
    }

    const svg = icon[focused || icon.length < 2 ? 0 : 1];
    return onPress ? (
      <Pressable
        style={[styles.icon, style]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onLongPress={onLongPress}
        disabled={disabled}
        hitSlop={hitSlop}>
        {svg}
      </Pressable>
    ) : (
      <View style={style}>{svg}</View>
    );
  }

  const icon2 = pressIcons[name];
  if (icon2) {
    if (disabled && icon2[2]) {
      return <View style={style}>{icon2[2]}</View>;
    }

    return onPress ? (
      <View style={title && {alignItems: 'center'}}>
        <Pressable
          style={[styles.icon, style]}
          onPress={onPress}
          onLongPress={onLongPress}
          hitSlop={hitSlop}
          onPressIn={() => icon2.length > 1 && setIdx(1)}
          onPressOut={() => setIdx(0)}
          disabled={disabled}>
          {icon2[idx] || icon2[0]}
        </Pressable>
        {title && (
          <AppText style={[titleStyle || styles.text]}>
            {title || i18n.t('select')}
          </AppText>
        )}
      </View>
    ) : (
      <View style={style}>{icon2[idx] || icon2[0]}</View>
    );
  }

  return <AppText>{name}</AppText>;
};

export default memo(AppSvgIcon);
