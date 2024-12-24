import React, {memo, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import AppButton from '@/components/AppButton';
import {useKeyboard} from '@/components/AppKeyboard';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';

const MODAL_TITLE_HEIGHT = 68;
const MODAL_TITLE_MARGIN = 5;
export const MODAL_TITLE_TOTAL_HEIGHT =
  MODAL_TITLE_HEIGHT + MODAL_TITLE_MARGIN * 2;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  start: {
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  end: {
    justifyContent: 'flex-end',
    alignContent: 'center',
  },
  center: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  inner: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  innerTop: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  centerInner: {
    backgroundColor: colors.white,
    borderRadius: 8,
    // height: 325,
  },
  title: {
    marginTop: 4,
    alignItems: 'center',
    marginBottom: 26,
  },
  close: {
    alignItems: 'flex-end',
    marginTop: 18,
    marginRight: 18,
  },
});

interface AnimatedModalProps {
  containerStyle?: StyleProp<ViewStyle>;
  visible?: boolean;
  useCloseButton?: boolean;
  onClose?: () => void;
  position?: 'center' | 'end' | 'start';
  animationType?: 'slide' | 'none' | 'fade' | 'slideR' | undefined;
  children?: React.ReactNode;
  keyboardVerticalOffset?: number;
  keyboardFocused?: boolean;
  bottomColor?: string;
  topColor?: string;
  title?: string;
  titleViewStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  header?: () => React.ReactNode;
  actionSheet?: boolean;
  innerRadius?: number;
  noOpacity?: boolean;
}

const AnimatedModal: React.FC<AnimatedModalProps> = ({
  visible = false,
  containerStyle,
  useCloseButton = false,
  onClose = () => {},
  position = 'end',
  animationType,
  children,
  keyboardFocused,
  keyboardVerticalOffset = 0,
  bottomColor,
  topColor,
  title,
  titleViewStyle,
  titleStyle,
  header,
  actionSheet = false,
  innerRadius,
  noOpacity,
}) => {
  const ty = useRef(
    new Animated.Value(animationType === 'slideR' ? -1000 : 0),
  ).current;
  const [childrenHeight, setChildrenHeight] = useState<number>();
  const [kbHeight] = useKeyboard();

  useEffect(() => {
    if (typeof keyboardFocused !== 'undefined' && Platform.OS === 'ios') {
      Animated.timing(ty, {
        toValue: keyboardFocused ? -(kbHeight + keyboardVerticalOffset) : 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [keyboardFocused, keyboardVerticalOffset, ty, visible, kbHeight]);

  // useEffect(() => {
  //   if (visible) {
  //     onClose();
  //   }
  // }, [onClose, visible]);

  useLayoutEffect(() => {
    if (
      visible &&
      (animationType === 'slide' || animationType === 'slideR') &&
      childrenHeight
    ) {
      ty.setValue(animationType === 'slide' ? childrenHeight : -childrenHeight);
      Animated.timing(ty, {
        toValue: 0,
        duration: 250,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [animationType, childrenHeight, ty, visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}>
      {Platform.OS === 'ios' && topColor && (
        <SafeAreaView style={{backgroundColor: topColor, zIndex: 1}} />
      )}
      <SafeAreaView
        style={[
          styles.modal,
          containerStyle,
          {backgroundColor: noOpacity ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.6)'},
        ]}>
        <Pressable
          // eslint-disable-next-line no-nested-ternary
          style={[
            {flex: 1},
            position === 'end'
              ? styles.end
              : position === 'start'
              ? styles.start
              : styles.center,
          ]}
          onPress={onClose}>
          <Animated.View style={{transform: [{translateY: ty}]}}>
            <Pressable
              onLayout={({
                nativeEvent: {
                  layout: {height},
                },
              }) => setChildrenHeight(height)}>
              {actionSheet ? (
                children
              ) : (
                <View
                  style={[
                    // eslint-disable-next-line no-nested-ternary
                    position === 'end'
                      ? styles.inner
                      : position === 'start'
                      ? styles.innerTop
                      : styles.centerInner,
                    innerRadius
                      ? {
                          borderTopLeftRadius: innerRadius,
                          borderTopRightRadius: innerRadius,
                        }
                      : {},
                  ]}>
                  {useCloseButton && (
                    <View key="close" style={styles.close}>
                      <AppButton title="closeModal" onPress={onClose} />
                    </View>
                  )}
                  {(title || header) && (
                    <View key="title" style={titleViewStyle || styles.title}>
                      {title ? (
                        <AppText style={[appStyles.bold16Text, titleStyle]}>
                          {title}
                        </AppText>
                      ) : (
                        header && header()
                      )}
                    </View>
                  )}
                  {children}
                </View>
              )}
            </Pressable>
          </Animated.View>
        </Pressable>
      </SafeAreaView>
      {Platform.OS === 'ios' && bottomColor && (
        <SafeAreaView style={{backgroundColor: bottomColor}} />
      )}
    </Modal>
  );
};

export default memo(AnimatedModal);
