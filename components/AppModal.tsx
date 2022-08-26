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
  buttonTitle: {
    ...appStyles.normal18Text,
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
    paddingTop: 25,
    backgroundColor: 'white',
  },
  icon: {
    marginVertical: 15,
  },
  titleViewStyle: {
    marginBottom: 20,
    alignSelf: 'center',
  },
});

export interface AppModalProps {
  visible: boolean;
  type?: 'normal' | 'close' | 'info' | 'redirect';
  justifyContent?: 'center' | 'flex-end';
  title?: string;
  titleStyle?: TextStyle;
  titleViewStyle?: ViewStyle;
  titleIcon?: string;
  closeButtonTitle?: string;
  infoText?: string;
  contentStyle?: ViewStyle;
  buttonBackgroundColor?: ColorValue;
  buttonTitleColor?: ColorValue;
  disableOkButton?: boolean;
  onOkClose?: (v?: string) => void;
  onCancelClose?: () => void;
  bottom?: () => React.ReactNode;
}

const AppModal: React.FC<PropsWithChildren<AppModalProps>> = ({
  title,
  titleStyle,
  titleViewStyle,
  titleIcon,
  children,
  type = 'normal',
  closeButtonTitle = i18n.t('close'),
  contentStyle,
  buttonBackgroundColor,
  buttonTitleColor,
  justifyContent,
  visible,
  disableOkButton,
  onOkClose = () => {},
  onCancelClose = () => {},
  bottom,
}) => {
  const getButtonType = useCallback(() => {
    switch (type) {
      case 'close':
        return (
          <View
            style={
              titleViewStyle || {height: 92, padding: !contentStyle && 20}
            }>
            <AppButton
              style={{
                height: 52,
                backgroundColor: buttonBackgroundColor || colors.clearBlue,
              }}
              type="primary"
              onPress={onOkClose}
              title={closeButtonTitle || i18n.t('close')}
              titleStyle={[
                styles.closeButtonTitle,
                {color: buttonTitleColor || colors.white},
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
              title={i18n.t('close')}
              titleStyle={[styles.closeButtonTitle, {color: colors.black}]}
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
              title={closeButtonTitle}
              titleStyle={[
                styles.closeButtonTitle,
                buttonTitleColor ? {color: buttonTitleColor} : undefined,
              ]}
            />
          </View>
        );

      default:
        return (
          // type == normal or info
          <View style={styles.row}>
            {type === 'normal' && (
              <AppButton
                style={styles.button}
                onPress={onCancelClose}
                title={i18n.t('cancel')}
                titleStyle={styles.buttonTitle}
              />
            )}
            <AppButton
              style={styles.button}
              disabled={disableOkButton}
              onPress={onOkClose}
              title={i18n.t('ok')}
              disableBackgroundColor={colors.white}
              disableColor={colors.warmGrey}
              titleStyle={{
                ...styles.buttonTitle,
                color: disableOkButton ? colors.warmGrey : colors.clearBlue,
              }}
            />
          </View>
        );
    }
  }, [
    buttonBackgroundColor,
    buttonTitleColor,
    closeButtonTitle,
    contentStyle,
    disableOkButton,
    onCancelClose,
    onOkClose,
    titleViewStyle,
    type,
  ]);

  return visible ? (
    <Modal animationType="fade" transparent visible={visible}>
      <SafeAreaView
        style={[
          appStyles.modal,
          justifyContent ? {justifyContent} : undefined,
        ]}>
        <View style={{alignItems: 'center', marginHorizontal: 20}}>
          <View style={[contentStyle || styles.inner, {maxWidth: MAX_WIDTH}]}>
            {titleIcon && (
              <AppIcon
                name={titleIcon}
                style={[styles.icon, !contentStyle && {paddingHorizontal: 20}]}
              />
            )}
            {title && (
              <View style={titleViewStyle || styles.titleViewStyle}>
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
