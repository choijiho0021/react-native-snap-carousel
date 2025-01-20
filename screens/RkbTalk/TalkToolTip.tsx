import React, {memo, useCallback, useMemo} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginRight: 20,
  },
  triangle: {
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderColor: colors.black92,
  },
  triangleBottom: {
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderColor: colors.black92,
  },
  textFrame: {
    borderRadius: 3,
    flexDirection: 'row',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.black92,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.white,
  },
});

const TalkToolTip = ({
  visible = false,
  containerStyle,
  iconStyle,
  textStyle,
  textFrame,
  arrow = 'top',
  text,
  icon,
  arrowPos,
  top = 50,
  updateTooltip,
}: {
  visible: boolean;
  containerStyle?: ViewStyle;
  iconStyle?: ViewStyle;
  textStyle?: TextStyle;
  textFrame?: ViewStyle;
  arrow?: string;
  text: string;
  icon?: string;
  arrowPos?: string;
  top?: number;
  updateTooltip: (t: boolean) => void;
}) => {
  const insets = useSafeAreaInsets();

  const position = useMemo(() => {
    switch (arrowPos) {
      case 'start':
        return 'flex-start';
      case 'center':
        return 'center';
      default:
        return 'flex-end';
    }
  }, [arrowPos]);

  const onClose = useCallback(() => {
    updateTooltip(false);
  }, [updateTooltip]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}>
      <Pressable
        style={{flex: 1}}
        onPress={onClose} // Close modal when background is pressed
      >
        <View
          style={{
            ...styles.container,
            alignItems: position,
            marginTop: insets.top + top,
            ...containerStyle,
          }}>
          {arrow === 'top' && (
            <View
              style={{
                ...styles.triangle,
                marginLeft: position === 'flex-start' ? 20 : 0,
                marginRight: position === 'flex-end' ? 20 : 0,
              }}
            />
          )}
          <View style={[styles.textFrame, {...textFrame}]}>
            {icon && (
              <AppSvgIcon key={icon} name={icon} style={{...iconStyle}} />
            )}
            <AppText style={[styles.text, textStyle]}>{text}</AppText>
          </View>
          {arrow === 'bottom' && (
            <View
              style={{
                ...styles.triangleBottom,
                marginLeft: position === 'flex-start' ? 40 : 0,
                marginRight: position === 'flex-end' ? 40 : 0,
              }}
            />
          )}
        </View>
      </Pressable>
    </Modal>
  );
};
export default memo(TalkToolTip);
