import React, {memo} from 'react';
import {StyleSheet, ActivityIndicator, ViewStyle} from 'react-native';
import {colors} from '@/constants/Colors';

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    zIndex: 100,
    alignSelf: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

type AppActivityIndicatorProps = {
  visible?: boolean;
  size?: 'large' | 'small';
  style?: ViewStyle;
};

const AppActivityIndicator: React.FC<AppActivityIndicatorProps> = ({
  visible = true,
  size = 'large',
  style,
}) => {
  return (
    <ActivityIndicator
      style={[styles.indicator, style]}
      size={size}
      color={colors.clearBlue}
      animating={visible}
    />
  );
};

export default memo(AppActivityIndicator);
