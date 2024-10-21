import React, {memo, useCallback, useMemo, useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';

const small = isDeviceSize('medium') || isDeviceSize('small');

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: small ? 60 : 100,
    right: 20,
  },
  triangle: {
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  triangleBottom: {
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
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
  containerStyle,
  iconStyle,
  textStyle,
  textFrame,
  arrow = 'top',
  text,
  icon,
  arrowPos,
  updateTooltip,
}: {
  containerStyle?: ViewStyle;
  iconStyle?: ViewStyle;
  textStyle?: TextStyle;
  textFrame?: ViewStyle;
  arrow?: string;
  text: string;
  icon?: string;
  arrowPos?: string;
  updateTooltip: (t: boolean) => void;
}) => {
  const [visible, setVisible] = useState(true);

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
    setVisible(false);
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
