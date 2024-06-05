import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {bindActionCreators} from 'redux';
import React, {memo, useCallback, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
} from 'react-native-permissions';
import ViewShot from 'react-native-view-shot';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import ScreenHeader from '@/components/ScreenHeader';
import i18n from '@/utils/i18n';
import AppSvgIcon from '@/components/AppSvgIcon';
import {ToastAction, actions as toastActions} from '@/redux/modules/toast';
import AppText from '@/components/AppText';
import AppAlert from '@/components/AppAlert';
import {API} from '@/redux/api';
import AppModal from '@/components/AppModal';
import {LotteryCouponType} from '..';
import LinearGradient from 'react-native-linear-gradient';
import {captureScreen, hasAndroidPermission, utils} from '@/utils/utils';

const styles = StyleSheet.create({
  modalContainer: {
    paddingTop: 0,
    marginTop: 0,
    marginBottom: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: 'transparent',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
  },
  btnCnter: {
    width: 40,
    height: 40,
    marginHorizontal: 18,
  },
  btnSave: {
    backgroundColor: colors.clearBlue,
    paddingHorizontal: 16,
    paddingVertical: 13,
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: 130,
    height: 52,
    borderRadius: 3,
  },
  couponContent: {
    backgroundColor: colors.clearBlue,
    alignItems: 'center',
    borderRadius: 20,
    paddingTop: 23,
    paddingBottom: 35,
    paddingHorizontal: 20,
    borderStyle: 'solid',
    width: 239,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.32)',
  },
  couponTail: {
    marginTop: -1,
    borderRadius: 20,
    backgroundColor: colors.clearBlue,
    paddingVertical: 20,
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.32)',
  },
  couponCount: {
    position: 'absolute',
    top: -16,
    right: -16,
    width: 66,
    height: 66,
    backgroundColor: '#194C94',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bodyContainer: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    ...appStyles.bold24Text,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 24,
  },
  gradientContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    borderRadius: 20,
  },
  textContainer: {
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 30,
    alignItems: 'center',
    borderColor: 'rgb(38, 203, 149)',
    borderWidth: 1,
  },
  titleText: {
    ...appStyles.bold20Text,
    textAlign: 'center',
    lineHeight: 28,
    color: 'rgb(0,102,71)',
    marginBottom: 17,
  },
  saveText: {
    ...appStyles?.medium18,
    textAlign: 'center',
    color: colors.white,
    height: 26,
    lineHeight: 26,
    justifyContent: 'center',
    letterSpacing: 0,
  },

  winTitleText: {
    ...appStyles.bold24Text,
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 40,
    color: colors.white,
    lineHeight: 32,
  },
});

type LotteryModalProps = {
  visible: boolean;
  action: {
    // order: OrderAction;
    toast: ToastAction;
  };
  coupon: LotteryCouponType;
  onClose: () => void;
};

const LotteryModal: React.FC<LotteryModalProps> = ({
  action,
  visible = false,
  coupon,
  onClose,
}) => {
  const route = useRoute();
  const navigation = useNavigation();
  const ref = useRef<ViewShot>();

  const renderBody = useCallback(() => {
    if (coupon?.cnt === 0) {
      return (
        <View style={styles.bodyContainer}>
          <View style={styles.titleContainer}>
            <AppText style={styles.title}>
              {i18n.t('esim:lottery:modal:lose')}
            </AppText>
          </View>
          <ViewShot
            ref={ref}
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <LinearGradient
              // Background Linear Gradient
              colors={['rgb(169,241,208)', 'rgb(10 ,144 ,104)']}
              style={styles.gradientContainer}
            />
            <View style={styles.textContainer}>
              <AppText style={styles.titleText}>
                {i18n.t('esim:lottery:modal:lose:text')}
              </AppText>
              <Image
                source={{
                  uri: API.default.httpImageUrl(coupon?.charm),
                }}
                style={{width: 180, height: 180}}
                resizeMode="contain"
              />
              <AppSvgIcon name="boldRokebiLogo" />
            </View>
          </ViewShot>
          <View style={{gap: 10, marginTop: 24}}>
            <Pressable
              onPress={() => captureScreen(ref, action.toast)}
              style={styles.btnSave}>
              <AppSvgIcon
                style={{width: 20, justifyContent: 'center'}}
                name="btnSave"
              />
              <AppText style={styles.saveText}>
                {i18n.t('esim:lottery:modal:save')}
              </AppText>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: 239,
        }}>
        <AppText style={styles.winTitleText}>
          {i18n.t('esim:lottery:modal:win')}
          <Image
            source={require('@/assets/images/esim/emojiCelebration.png')}
            style={{width: 28, height: 28}}
            resizeMode="contain"
          />
        </AppText>

        <View>
          <View style={styles.couponContent}>
            {coupon?.cnt > 1 && (
              <View style={styles.couponCount}>
                <View style={{flexDirection: 'row', gap: 2}}>
                  <AppText style={[appStyles.robotoBold24Text]}>{`X`}</AppText>

                  <AppText
                    style={[
                      appStyles.robotoBold24Text,
                    ]}>{`${coupon.cnt}`}</AppText>
                </View>
              </View>
            )}
            <AppSvgIcon style={{marginBottom: 30}} name="boldRokebiLogo" />
            <AppText
              style={[
                appStyles.bold32Text,
                {color: colors.white, marginBottom: 9, textAlign: 'center'},
              ]}>
              {coupon.title}
            </AppText>
            <AppText
              style={[
                appStyles.bold16Text,
                {
                  opacity: 0.64,
                  color: colors.white,
                },
              ]}>
              {coupon.desc}
            </AppText>
          </View>
          <View style={styles.couponTail}>
            <AppText
              style={[
                appStyles.bold20Text,
                {
                  color: colors.white,
                  opacity: 0.64,
                },
              ]}>
              {i18n.t('esim:lottery:modal:win:coupon')}
            </AppText>
          </View>
        </View>
        <AppText
          style={[
            appStyles.medium18,
            {color: 'rgba(255, 255, 255, 0.72)', marginTop: 20},
          ]}>
          {i18n.t('esim:lottery:modal:win:text')}
        </AppText>
      </View>
    );
  }, [coupon]);

  return (
    <AppModal
      contentStyle={styles.modalContainer}
      safeAreaColor="rgba(0, 0, 0, 0.7)"
      titleViewStyle={{marginTop: 20}}
      okButtonTitle={i18n.t('redirect')}
      type="division"
      onOkClose={() => {
        onClose();
      }}
      bottom={() => <View></View>}
      onCancelClose={() => {
        onClose();
      }}
      visible={visible}>
      {renderBody()}
    </AppModal>
  );
};

export default memo(
  connect(
    ({account}: RootState) => ({account}),
    (dispatch) => ({
      action: {
        toast: bindActionCreators(toastActions, dispatch),
      },
    }),
  )(LotteryModal),
);
