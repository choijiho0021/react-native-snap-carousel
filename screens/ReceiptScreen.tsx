import {RouteProp} from '@react-navigation/native';
import {bindActionCreators} from 'redux';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Share from 'react-native-share';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import ViewShot from 'react-native-view-shot';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  PERMISSIONS,
  check,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {RkbOrder} from '@/redux/api/orderApi';
import AppText from '@/components/AppText';
import utils from '@/redux/api/utils';
import {appStyles} from '@/constants/Styles';
import LabelText from '@/components/LabelText';
import AppStyledText from '@/components/AppStyledText';
import AppButton from '@/components/AppButton';
import {AccountModelState} from '@/redux/modules/account';
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import {HomeStackParamList} from '@/navigation/navigation';
import AppAlert from '@/components/AppAlert';
import Env from '@/environment';
import ScreenHeader from '@/components/ScreenHeader';
import {checkPhotoPermissionAlert} from '@/utils/utils';

const {esimGlobal} = Env.get();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    marginTop: 10,
    marginHorizontal: 10,
    paddingTop: 24,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  titleText: {
    ...appStyles.bold24Text,
    lineHeight: 24,
    color: colors.black,
    padding: 2,
    marginTop: 10,
    marginBottom: 30,
  },
  info: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    backgroundColor: colors.white,
  },
  bar: {
    height: 1,
    backgroundColor: colors.black,
  },
  labelText: {
    height: 36,
    marginHorizontal: 10,
  },
  label: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
    lineHeight: 36,
  },
  value: {
    ...appStyles.semiBold16Text,
    lineHeight: 24,
  },
  box: {
    padding: 20,
    backgroundColor: colors.white,
    marginHorizontal: 10,
  },
  button: {
    ...appStyles.medium18,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: colors.white,
    flex: 1,
  },
  balance: {
    ...appStyles.bold18Text,
    lineHeight: 36,
    letterSpacing: 0.22,
  },
  currency: {
    ...appStyles.semiBold16Text,
    lineHeight: 36,
    letterSpacing: 0.22,
  },
});

type ReceiptScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Receipt'
>;

type ReceiptScreenProps = {
  navigation: ReceiptScreenNavigationProp;
  route: RouteProp<HomeStackParamList, 'Receipt'>;
  account: AccountModelState;
  action: {
    toast: ToastAction;
  };
};

export type RkbReceipt = {
  amount: number;
  card_number: string;
  card_name: string;
  name: string;
};

const ReceiptScreen: React.FC<ReceiptScreenProps> = ({
  navigation,
  route: {params},
  account: {mobile},
  action,
}) => {
  const [order, setOrder] = useState<RkbOrder>();
  const [receipt, setReceipt] = useState<RkbReceipt>();
  const ref = useRef<ViewShot>();
  const [isShareDisabled, setIsShareDisabled] = useState(false);

  useEffect(() => {
    setOrder(params?.order);
    setReceipt(params?.receipt);
  }, [navigation, params?.order, params?.receipt]);

  const capture = useCallback(async () => {
    let checkNewPermission = false;

    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;

    const result = await check(permission);

    checkNewPermission = result === RESULTS.GRANTED;

    if (checkNewPermission) {
      try {
        ref.current?.capture().then((uri) => {
          CameraRoll.save(uri, {
            type: 'photo',
            album: i18n.t('rcpt:album'),
          }).then(() =>
            action.toast.push({
              msg: 'rcpt:saved',
              toastIcon: 'bannerMarkToastSuccess',
            }),
          );
        });
      } catch (e) {
        console.log('fail to capture : ', e);
      }
    } else {
      // 사진 앨범 조회 권한을 요청한다.
      checkPhotoPermissionAlert();
    }
  }, [action.toast]);

  const share = useCallback(async () => {
    if (!isShareDisabled) {
      setIsShareDisabled(true);

      setTimeout(() => {
        setIsShareDisabled(false);
      }, 1000);

      try {
        ref.current?.capture().then(async (uri) => {
          Share.open({
            title: i18n.t('rcpt:title'),
            url: uri,
          });
        });
      } catch (e) {
        console.log('😻😻😻 snapshot failed', e);
      }
    }
  }, [isShareDisabled]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={i18n.t('pym:receipt')} />
      <ScrollView style={{flex: 1}}>
        <ViewShot ref={ref} style={{backgroundColor: colors.whiteTwo}}>
          <View style={styles.title}>
            <AppText
              style={[appStyles.semiBold14Text, {color: colors.warmGrey}]}>
              {utils.toDateString(order?.orderDate, 'LLL')}
            </AppText>
            <AppText style={styles.titleText}>{i18n.t('appTitle')}</AppText>
          </View>
          <View style={styles.info}>
            <View style={styles.bar} />
            <LabelText
              style={{
                marginHorizontal: 10,
                marginVertical: 20,
              }}
              label={i18n.t('rcpt:buyer')}
              labelStyle={styles.label}
              value={mobile}
              valueStyle={styles.value}
            />
            <View style={[styles.bar, {backgroundColor: colors.lightGrey}]} />
            <LabelText
              style={{
                marginTop: 20,
                marginHorizontal: 10,
              }}
              label={i18n.t('his:pymAmount')}
              labelStyle={styles.label}
              // value={order?.totalPrice}
              value={receipt?.amount || 0}
              // valueStyle={styles.value}
              color={colors.clearBlue}
              balanceStyle={styles.balance}
              currencyStyle={styles.currency}
              format="price"
            />
            {Object.entries({
              pay_method: receipt?.card_name,
              pymNo: receipt?.card_number,
            }).map(([k, v]) => (
              <LabelText
                key={k}
                style={styles.labelText}
                label={i18n.t(`rcpt:${k}`)}
                labelStyle={styles.label}
                value={v}
                valueStyle={[styles.value, {fontWeight: '600'}]}
              />
            ))}
            {order && (
              <LabelText
                style={{
                  ...styles.labelText,
                  marginBottom: 26,
                }}
                label={i18n.t('rcpt:state')}
                labelStyle={styles.label}
                value={
                  order.state === 'canceled'
                    ? i18n.t('his:cancel')
                    : i18n.t('his:paymentCompleted')
                }
                valueStyle={{
                  ...styles.value,
                  color:
                    order.state === 'canceled' ? colors.tomato : colors.black,
                }}
              />
            )}
          </View>
          <View style={{height: 10}} />
          <View style={styles.box}>
            {Object.entries({
              name: i18n.t('rcpt:companyName'),
              companyRegNo: '129-81-29383',
              ceo: i18n.t('rcpt:ceoName'),
              address: i18n.t('rcpt:companyAddr'),
              tel: i18n.t('rcpt:telNo'),
            }).map(([k, v]) => (
              <LabelText
                key={k}
                style={{alignItems: 'flex-start'}}
                label={i18n.t(`rcpt:${k}`)}
                labelStyle={styles.label}
                value={v}
                valueStyle={[styles.value, {fontWeight: '400'}]}
              />
            ))}
          </View>
          <View style={{height: 10}} />
          <View style={[styles.box, {paddingBottom: 30, marginBottom: 10}]}>
            <AppStyledText
              textStyle={{
                ...appStyles.semiBold16Text,
                color: colors.warmGrey,
                lineHeight: 24,
                textAlign: 'right',
                fontWeight: '600',
              }}
              text={i18n.t('rcpt:tail')}
              format={{b: {color: colors.clearBlue}}}
              data={{
                date: utils.toDateString(
                  order?.orderDate,
                  esimGlobal ? 'YYYY-MM-DD' : 'YYYY년 MM월 DD일',
                ),
              }}
            />
          </View>
        </ViewShot>
      </ScrollView>

      <View style={{flexDirection: 'row'}}>
        <AppButton
          style={{
            ...styles.button,
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderColor: colors.lightGrey,
          }}
          titleStyle={{...appStyles.medium18, color: colors.black}}
          title={i18n.t('rcpt:image')}
          onPress={capture}
        />
        <AppButton
          style={styles.button}
          title={i18n.t('rcpt:share')}
          onPress={share}
        />
      </View>
    </SafeAreaView>
  );
};

export default connect(
  ({account}: RootState) => ({account}),
  (dispatch) => ({
    action: {
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(memo(ReceiptScreen));
