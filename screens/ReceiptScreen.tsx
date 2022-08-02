import {useNavigation, useRoute} from '@react-navigation/native';
import {bindActionCreators} from 'redux';
import React, {memo, useEffect, useRef, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import AppBackButton from '@/components/AppBackButton';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteTwo,
  },
  title: {
    marginTop: 10,
    marginHorizontal: 10,
    paddingTop: 24,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
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
  label: {
    ...appStyles.normal14Text,
    lineHeight: 36,
  },
  value: {
    ...appStyles.semiBold16Text,
    lineHeight: 36,
  },
  box: {
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 10,
  },
  button: {
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: '#ffffff',
  },
});

type ReceiptScreenProps = {
  account: AccountModelState;
  action: {
    toast: ToastAction;
  };
};

const ReceiptScreen: React.FC<ReceiptScreenProps> = ({
  account: {mobile},
  action,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [order, setOrder] = useState<RkbOrder>();
  const [paymentMethod, setPaymentMethod] = useState('');
  const ref = useRef<ViewShot>();

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('pym:receipt')} />,
    });

    setOrder(route.params?.order);
    setPaymentMethod(
      route.params?.order?.paymentList.find(
        (p) => p.paymentGateway === 'iamport',
      )?.paymentMethod,
    );
  }, [navigation, route.params]);

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const capture = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      action.toast.push('갤러리 접근 권한이 없어요');
      return;
    }

    ref.current?.capture().then((uri) => {
      console.log('do something with ', uri);
      CameraRoll.save(uri).then((result) => action.toast.push('rcpt:saved'));
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{flex: 1}}>
        <ViewShot ref={ref}>
          <View style={styles.title}>
            <AppText style={[appStyles.normal14Text, {color: colors.warmGrey}]}>
              {utils.toDateString(order?.orderDate)}
            </AppText>
            <AppText
              style={[
                appStyles.bold24Text,
                {color: colors.black, marginTop: 10, marginBottom: 30},
              ]}>
              {order?.orderItems[0].title}
            </AppText>
          </View>
          <View style={styles.info}>
            <View style={styles.bar} />
            <LabelText
              style={{
                marginTop: 20,
                marginHorizontal: 10,
                paddingBottom: 18,
              }}
              label={i18n.t('rcpt:buyer')}
              labelStyle={styles.label}
              value={mobile}
              valueStyle={styles.value}
            />
            <View style={[styles.bar, {backgroundColor: colors.lightGrey}]} />
            <LabelText
              style={{
                marginTop: 21,
                marginHorizontal: 10,
              }}
              label={i18n.t('his:pymAmount')}
              labelStyle={styles.label}
              value={order?.totalPrice}
              valueStyle={styles.value}
              color={colors.clearBlue}
              format="price"
            />
            {Object.entries({
              pay_method: paymentMethod,
              pymNo: order?.orderNo,
              state:
                order?.state === 'canceled'
                  ? i18n.t('his:cancel')
                  : i18n.t('his.paymentCompleted'),
            }).map(([k, v]) => (
              <LabelText
                key={k}
                style={{
                  height: 36,
                  marginHorizontal: 10,
                  paddingBottom: k === 'state' ? 26 : 0,
                }}
                label={i18n.t(`rcpt:${k}`)}
                labelStyle={styles.label}
                value={v}
                valueStyle={styles.value}
              />
            ))}
          </View>
          <View style={{height: 10}} />
          <View style={styles.box}>
            {Object.entries({
              name: i18n.t('appTitle'),
              companyRegNo: '293586740',
              ceo: i18n.t('rcpt:ceoName'),
              address: i18n.t('rcpt:companyAddr'),
              tel: i18n.t('rcpt:telNo'),
            }).map(([k, v]) => (
              <LabelText
                key={k}
                label={i18n.t(`rcpt:${k}`)}
                labelStyle={styles.label}
                value={v}
                valueStyle={styles.value}
              />
            ))}
          </View>
          <View style={{height: 10}} />
          <View style={[styles.box, {paddingBottom: 30, marginBottom: 20}]}>
            <AppStyledText
              textStyle={{
                ...appStyles.semiBold16Text,
                color: colors.warmGrey,
                lineHeight: 24,
                textAlign: 'right',
              }}
              text={i18n.t('rcpt:tail')}
              format={{b: {color: colors.clearBlue}}}
            />
          </View>
        </ViewShot>
      </ScrollView>
      <AppButton
        style={styles.button}
        type="primary"
        title={i18n.t('rcpt:png')}
        onPress={capture}
      />
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
