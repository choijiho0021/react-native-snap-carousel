import {RouteProp} from '@react-navigation/native';
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
import {StackNavigationProp} from '@react-navigation/stack';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import ScreenHeader from '@/components/ScreenHeader';
import i18n from '@/utils/i18n';
import AppSvgIcon from '@/components/AppSvgIcon';
import {ToastAction, actions as toastActions} from '@/redux/modules/toast';
import AppText from '@/components/AppText';
import {HomeStackParamList} from '@/navigation/navigation';
import ViewShot from 'react-native-view-shot';
import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
} from 'react-native-permissions';
import AppAlert from '@/components/AppAlert';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {API} from '@/redux/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greyish,
    justifyContent: 'center',
  },
  btnCnter: {
    width: 40,
    height: 40,
    marginHorizontal: 18,
  },
});

type LotteryCouponScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'LotteryCoupon'
>;

type LotteryCouponScreenRouteProp = RouteProp<
  HomeStackParamList,
  'LotteryCoupon'
>;

type LotteryCouponScreenProps = {
  navigation: LotteryCouponScreenNavigationProp;
  route: LotteryCouponScreenRouteProp;

  action: {
    // order: OrderAction;
    toast: ToastAction;
  };
};

const LotteryCouponScreen: React.FC<LotteryCouponScreenProps> = ({
  route,
  navigation,
  action,
}) => {
  const {coupon} = route.params;
  const ref = useRef<ViewShot>();

  useEffect(() => {
    console.log('@@@ coupon : ', coupon);
  }, []);

  const hasAndroidPermission = useCallback(async () => {
    const permission =
      Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

    const hasPermission = await check(permission);
    if (hasPermission === RESULTS.GRANTED) {
      return true;
    }

    AppAlert.confirm(i18n.t('settings'), i18n.t('acc:permPhoto'), {
      ok: () => openSettings(),
    });

    return false;
  }, []);

  const capture = useCallback(async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      action.toast.push('toast:perm:gallery');
      return;
    }

    ref.current?.capture().then((uri) => {
      CameraRoll.save(uri, {type: 'photo', album: i18n.t('rcpt:album')}).then(
        () => action.toast.push('rcpt:saved'),
      );
    });
  }, [action.toast, hasAndroidPermission]);

  const renderBody = useCallback(() => {
    if (coupon?.cnt === 0) {
      return (
        <View style={{alignContent: 'center', justifyContent: 'center'}}>
          <View
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <AppText
              style={[
                appStyles.medium16,
                {color: colors.white, textAlign: 'center'},
              ]}>
              {i18n.t('esim:lottery:modal:lose')}
            </AppText>
          </View>
          <ViewShot
            ref={ref}
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              width: 200,
              height: 300,
            }}>
            {/* 임시 사진 */}
            <Image
              source={{
                uri: API.default.httpImageUrl(coupon?.charm),
              }}
              style={{width: 200, height: 300}}
              resizeMode="contain"
            />
          </ViewShot>
          <View style={{gap: 10}}>
            <Pressable
              onPress={capture}
              style={{
                backgroundColor: colors.white,
                marginHorizontal: 20,
                paddingVertical: 10,
                alignSelf: 'center',
              }}>
              <View>
                <AppText
                  style={[
                    appStyles?.bold16Text,
                    {textAlign: 'center', width: 200},
                  ]}>
                  {i18n.t('esim:lottery:modal:save')}
                </AppText>
              </View>
            </Pressable>
            <AppText
              style={[
                appStyles.normal14Text,
                {color: colors.white, alignSelf: 'center'},
              ]}>
              {i18n.t('esim:lottery:modal:notice2')}
            </AppText>
          </View>
        </View>
      );
    }

    return (
      <View
        style={{
          marginHorizontal: 20,
        }}>
        <AppText
          style={[
            appStyles.bold18Text,
            {
              alignSelf: 'center',
              marginBottom: 40,
              color: colors.white,
            },
          ]}>
          {i18n.t('esim:lottery:modal:win')}
        </AppText>

        <View style={{alignItems: 'flex-end'}}>
          {coupon?.cnt > 1 && (
            <AppText style={appStyles.bold18Text}>{`*${coupon.cnt}`}</AppText>
          )}
        </View>
        <View
          style={{
            backgroundColor: colors.white,
            alignItems: 'center',
            gap: 10,
            padding: 20,
          }}>
          <AppText style={[appStyles.bold16Text]}>{coupon.title}</AppText>
          <AppText style={appStyles.normal12Text}>{coupon.desc}</AppText>
        </View>
        <AppText
          style={[
            appStyles.normal12Text,
            {color: colors.white, marginTop: 20},
          ]}>
          {i18n.t('esim:lottery:modal:notice')}
        </AppText>
      </View>
    );
  }, [coupon.cnt, coupon.desc, coupon.title]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        isStackTop
        headerStyle={{backgroundColor: colors.greyish}}
        titleStyle={appStyles.bold18Text}
        renderRight={
          <AppSvgIcon
            name="closeModal"
            style={styles.btnCnter}
            onPress={() => {
              navigation.goBack();
            }}
          />
        }
      />
      <View style={styles.container}>{renderBody()}</View>
    </SafeAreaView>
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
  )(LotteryCouponScreen),
);
