import React, {memo, PropsWithChildren} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextStyle,
  ViewStyle,
  ColorValue,
  SafeAreaView,
} from 'react-native';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import AppButton from './AppButton';
import AppIcon from './AppIcon';

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.white,
    width: 65,
    height: 36,
  },
  closeButton: {
    height: 50,
    backgroundColor: colors.clearBlue,
  },
  closeButtonTitle: {
    ...appStyles.normal18Text,
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
  blueCenter: {
    ...appStyles.normal18Text,
    marginHorizontal: 30,
    color: colors.clearBlue,
    alignSelf: 'center',
  },
  inner: {
    marginHorizontal: 20,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  icon: {
    marginVertical: 15,
  },
});

export interface AppModalProps {
  visible: boolean;
  type?: 'normal' | 'close' | 'info';
  justifyContent?: 'center' | 'flex-end';
  title?: string;
  titleStyle?: TextStyle;
  titleIcon?: string;
  toRokebiCash?: boolean;
  closeButtonTitle?: string;
  infoText?: string;
  contentStyle?: ViewStyle;
  buttonBackgroundColor?: ColorValue;
  buttonTitleColor?: ColorValue;
  disableOkButton?: boolean;
  onOkClose?: (v?: string) => void;
  onCancelClose?: () => void;
}

const AppModal: React.FC<PropsWithChildren<AppModalProps>> = ({
  title,
  titleStyle,
  titleIcon,
  children,
  type = 'normal',
  toRokebiCash = false,
  closeButtonTitle = i18n.t('close'),
  contentStyle,
  buttonBackgroundColor,
  buttonTitleColor,
  justifyContent,
  visible,
  disableOkButton,
  onOkClose = () => {},
  onCancelClose = () => {},
}) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <SafeAreaView
        style={[
          appStyles.modal,
          justifyContent ? {justifyContent} : undefined,
        ]}>
        <View style={contentStyle || styles.inner}>
          {titleIcon && <AppIcon name={titleIcon} style={styles.icon} />}
          {title && <Text style={titleStyle || styles.title}>{title}</Text>}
          {toRokebiCash && (
            <View style={{marginTop: 30}}>
              <Text style={styles.blueCenter}>
                {i18n.t('usim:toRokebiCash')}
              </Text>
              <Text style={styles.blueCenter}>
                {toRokebiCash} {i18n.t('usim:balance')}
              </Text>
            </View>
          )}
          {children}

          {type === 'close' ? (
            <AppButton
              style={[
                styles.closeButton,
                buttonBackgroundColor
                  ? {
                      backgroundColor: buttonBackgroundColor,
                    }
                  : undefined,
              ]}
              onPress={onOkClose}
              title={closeButtonTitle}
              titleStyle={[
                styles.closeButtonTitle,
                buttonTitleColor ? {color: buttonTitleColor} : undefined,
              ]}
            />
          ) : (
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
          )}
        </View>
      </SafeAreaView>
      {justifyContent === 'flex-end' && (
        <SafeAreaView style={{backgroundColor: 'white'}} />
      )}
    </Modal>
  );
};

export default memo(AppModal);
