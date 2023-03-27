import React, {memo, useCallback} from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {actions as modalActions} from '@/redux/modules/modal';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppStyledText from '@/components/AppStyledText';
import AppButton from '@/components/AppButton';

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  okBtnContainer: {
    backgroundColor: colors.white,
    marginBottom: 16,
    marginTop: 12,
  },
  okButton: {
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: '#ffffff',
  },
  localModalTitle: {
    marginBottom: 24,
  },
  localModalTitleText: {
    ...appStyles.bold24Text,
    lineHeight: 34,
  },
  localModalBody: {
    padding: 20,
    backgroundColor: colors.backGrey,
    marginBottom: 12,
    flexDirection: 'row',
    borderRadius: 3,
  },
  localModalBodyIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  localModalBodyTitle: {
    ...appStyles.bold20Text,
    color: colors.clearBlue,
    lineHeight: 24,
    marginBottom: 4,
  },
  localModalBodyText: {
    ...appStyles.medium16,
    fontSize: isDeviceSize('medium', true) ? 14 : 16,
    letterSpacing: isDeviceSize('medium', true) ? 0 : -0.48,
    lineHeight: isDeviceSize('medium', true) ? 20 : 22,
    color: colors.black,
  },
  localModalBodyTextBold: {
    ...appStyles.medium16,
    fontSize: isDeviceSize('medium', true) ? 14 : 16,
    letterSpacing: isDeviceSize('medium', true) ? 0 : -0.48,
    lineHeight: isDeviceSize('medium', true) ? 20 : 22,
    color: colors.black,
    fontWeight: 'bold',
  },
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  underLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  bottomText: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.warmGrey,
  },
  popupNotice: {
    marginTop: 16,
  },
  popupNoticeTitle: {
    ...appStyles.bold16Text,
    lineHeight: 24,
    color: colors.darkBlue,
    marginBottom: 2,
  },
  localNoticePopupIcon: {
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: colors.whiteFive,
    borderRadius: 10,

    ...Platform.select({
      ios: {
        shadowColor: 'rgb(52, 62, 95)',
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowOffset: {
          height: 1,
          width: 1,
        },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  localNoticePopupText: {
    ...appStyles.semiBold14Text,
    lineHeight: 20,
    color: colors.warmGrey,
    alignSelf: 'center',
    marginBottom: 2,
  },
});

type LocalModalProps = {
  localOpName: string;
  ccode: string[];
  localOpKey: string;
  onPress: () => void;
};

const LocalModal: React.FC<LocalModalProps> = ({
  localOpName,
  ccode,
  localOpKey,
  onPress,
}) => {
  const dispatch = useDispatch();
  const okHandler = useCallback(() => {
    dispatch(modalActions.closeModal());
    onPress?.();
  }, [dispatch, onPress]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Pressable
        style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}
        onPress={() => dispatch(modalActions.closeModal())}>
        <Pressable
          onPress={() => {}}
          style={{
            marginTop: 'auto',
            paddingTop: 32,
            paddingHorizontal: 20,
            backgroundColor: 'white',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}>
          <View style={styles.localModalTitle}>
            <AppText style={styles.localModalTitleText}>
              {i18n.t('local:modal:title', {
                localOpName,
              })}
            </AppText>
          </View>
          {(ccode.includes('TH') ? [1, 2] : [1]).map((k) => (
            <View style={styles.localModalBody} key={k}>
              <View style={{flex: 1}}>
                <View style={styles.row}>
                  <AppSvgIcon
                    style={styles.localModalBodyIcon}
                    name={k === 1 ? 'localNotice1' : 'localNotice2'}
                  />
                  <AppText style={styles.localModalBodyTitle}>
                    {i18n.t(
                      `local:modal:notice${k}${k === 2 ? ':th' : ''}:title`,
                    )}
                  </AppText>
                </View>
                <AppStyledText
                  text={i18n.t(
                    `local:modal:notice${k}${k === 2 ? ':th' : ''}:body`,
                  )}
                  textStyle={styles.localModalBodyText}
                  format={{b: styles.localModalBodyTextBold}}
                />
                {!ccode.includes('TH') && (
                  <View style={styles.popupNotice}>
                    <AppText style={styles.popupNoticeTitle}>
                      {i18n.t('local:modal:notice2:title')}
                    </AppText>
                    <AppStyledText
                      text={i18n.t('local:modal:notice2:body')}
                      textStyle={styles.localModalBodyText}
                      format={{b: styles.localModalBodyTextBold}}
                    />

                    <View style={styles.localNoticePopupIcon}>
                      <AppSvgIcon name="localNoticePopup" />
                    </View>

                    <AppText style={styles.localNoticePopupText}>
                      {i18n.t('local:modal:popup:notice')}
                    </AppText>
                  </View>
                )}
              </View>
            </View>
          ))}
          <View style={styles.okBtnContainer}>
            <AppButton
              style={styles.okButton}
              title={i18n.t('local:ok')}
              type="primary"
              onPress={() => {
                okHandler();
              }}
            />
          </View>
          <Pressable
            style={styles.bottom}
            onPress={() => {
              AsyncStorage.setItem(
                `esim.show.local.modal.${localOpKey}`,
                moment().format('YYYY-MM-DD HH:mm:ss'),
              );
              okHandler();
            }}>
            <View style={styles.underLine}>
              <AppText style={styles.bottomText}>{i18n.t('close:day')}</AppText>
            </View>
          </Pressable>
        </Pressable>
      </Pressable>
    </SafeAreaView>
  );
};

export default memo(LocalModal);
