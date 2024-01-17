import React, {memo, PropsWithChildren, useCallback} from 'react';
import {
  ColorValue,
  Modal,
  SafeAreaView,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AppButton from './AppButton';
import AppIcon from './AppIcon';
import AppText from './AppText';
import {MAX_WIDTH} from '@/constants/SliderEntry.style';

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.white,
    marginBottom: 20,
    width: 65,
    height: 36,
  },
  closeButton: {
    height: 55,
    marginVertical: 20,
    flex: 1,
  },
  closeButtonTitle: {
    ...appStyles.medium18,
    color: colors.white,
    textAlign: 'center',
    width: '100%',
  },
  normalBtnTitle: {
    ...appStyles.normal16Text,
    textAlign: 'right',
    width: '100%',
  },
  row: {
    marginTop: 40,
    marginHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  title: {
    ...appStyles.normal18Text,
    marginHorizontal: 30,
  },
  inner: {
    maginHorizontal: 20,
    width: '90%',
    paddingTop: 25,
    backgroundColor: 'white',
  },
  icon: {
    marginVertical: 15,
  },
});

export interface AppModalProps {
  visible: boolean;
  maxWidth?: string | number;
  type?: 'normal' | 'close' | 'info' | 'redirect';
  justifyContent?: 'center' | 'flex-end';
  title?: string;
  titleStyle?: TextStyle;
  titleViewStyle?: ViewStyle;
  titleIcon?: string;
  okButtonTitle?: string;
  okButtonStyle?: TextStyle;
  cancelButtonTitle?: string;
  cancelButtonStyle?: TextStyle;
  contentStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  buttonBackgroundColor?: ColorValue;
  buttonTitleColor?: ColorValue;
  disableOkButton?: boolean;
  safeAreaColor?: ColorValue;
  onOkClose?: (v?: string) => void;
  onCancelClose?: () => void;
  onRequestClose?: () => void;
  bottom?: () => React.ReactNode;
}

const AppModal: React.FC<PropsWithChildren<AppModalProps>> = ({
  maxWidth,
  title,
  titleStyle,
  titleViewStyle,
  titleIcon,
  children,
  type = 'normal',
  okButtonTitle = i18n.t('ok'),
  okButtonStyle = {},
  cancelButtonTitle = i18n.t('close'),
  cancelButtonStyle = {},
  buttonStyle,
  contentStyle,
  buttonBackgroundColor,
  buttonTitleColor,
  justifyContent,
  visible,
  disableOkButton,
  safeAreaColor = 'rgba(0,0,0,0.5)',
  onOkClose = () => {},
  onCancelClose = () => {},
  onRequestClose = () => {
    if (onCancelClose) onCancelClose();
    else onOkClose();
  },
  bottom,
}) => {
  const getButtonType = useCallback(() => {
    switch (type) {
      case 'close':
        return (
          <View
            style={
              titleViewStyle || {
                height: 92,
                padding: contentStyle ? undefined : 20,
              }
            }>
            <AppButton
              style={{
                height: 52,
                backgroundColor: buttonBackgroundColor || colors.clearBlue,
              }}
              type="primary"
              onPress={onOkClose}
              title={okButtonTitle}
              titleStyle={[
                styles.closeButtonTitle,
                {color: buttonTitleColor || colors.white},
                okButtonStyle,
              ]}
            />
          </View>
        );

      case 'redirect':
        return (
          <View style={{flexDirection: 'row'}}>
            <AppButton
              style={[
                styles.closeButton,
                {
                  marginLeft: 20,
                  marginRight: 0,
                  borderWidth: 1,
                  borderColor: colors.lightGrey,
                },
              ]}
              type="secondary"
              onPress={onCancelClose}
              title={cancelButtonTitle}
              titleStyle={[
                styles.closeButtonTitle,
                {color: colors.black},
                cancelButtonStyle,
              ]}
            />

            <AppButton
              style={[
                styles.closeButton,
                {
                  marginLeft: 12,
                  marginRight: 20,
                  backgroundColor: buttonBackgroundColor || colors.clearBlue,
                },
              ]}
              type="primary"
              onPress={onOkClose}
              title={okButtonTitle}
              titleStyle={[
                styles.closeButtonTitle,
                buttonTitleColor ? {color: buttonTitleColor} : undefined,
                okButtonStyle,
              ]}
            />
          </View>
        );

      default:
        return (
          // type == normal or info
          <View style={[styles.row, buttonStyle]}>
            {type === 'normal' && (
              <AppButton
                style={styles.button}
                onPress={onCancelClose}
                title={cancelButtonTitle}
                titleStyle={[styles.normalBtnTitle, cancelButtonStyle]}
              />
            )}
            <AppButton
              style={styles.button}
              disabled={disableOkButton}
              onPress={onOkClose}
              title={okButtonTitle}
              disableBackgroundColor={colors.white}
              disableColor={colors.warmGrey}
              titleStyle={[
                {
                  ...styles.normalBtnTitle,
                  color: disableOkButton ? colors.warmGrey : colors.clearBlue,
                },
                okButtonStyle,
              ]}
            />
          </View>
        );
    }
  }, [
    buttonBackgroundColor,
    buttonStyle,
    buttonTitleColor,
    cancelButtonStyle,
    cancelButtonTitle,
    contentStyle,
    disableOkButton,
    okButtonStyle,
    okButtonTitle,
    onCancelClose,
    onOkClose,
    titleViewStyle,
    type,
  ]);

  return visible ? (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        onRequestClose();
      }}>
      <SafeAreaView
        style={[
          appStyles.modal,
          justifyContent ? {justifyContent} : undefined,
          {backgroundColor: safeAreaColor},
        ]}>
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: contentStyle?.marginHorizontal,
          }}>
          <View
            style={[
              contentStyle || styles.inner,
              {maxWidth: maxWidth || MAX_WIDTH},
            ]}>
            {titleIcon && (
              <AppIcon
                name={titleIcon}
                style={[styles.icon, !contentStyle && {paddingHorizontal: 20}]}
              />
            )}
            {title && (
              <View
                style={
                  titleViewStyle || {marginBottom: bottom ? undefined : 20}
                }>
                <AppText style={titleStyle || styles.title}>{title}</AppText>
              </View>
            )}
            {children}

            {bottom ? bottom() : getButtonType()}
          </View>
        </View>
      </SafeAreaView>
      {justifyContent === 'flex-end' && (
        <SafeAreaView style={{backgroundColor: 'white'}} />
      )}
    </Modal>
  ) : null;
};

export default memo(AppModal);
