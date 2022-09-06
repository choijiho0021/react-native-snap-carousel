import {useNavigation, useRoute} from '@react-navigation/native';
import {bindActionCreators} from 'redux';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  PermissionsAndroid,
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
  labelText: {
    height: 36,
    marginHorizontal: 10,
  },
  label: {
    ...appStyles.normal14Text,
    color: '#777777',
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
    ...appStyles.medium18,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: '#ffffff',
    flex: 1,
  },
});

type ReceiptScreenProps = {
  account: AccountModelState;
  action: {
    toast: ToastAction;
  };
};

type RkbReceipt = {
  amount: number;
  card_number: string;
  card_name: string;
  name: string;
};

const ReceiptScreen: React.FC<ReceiptScreenProps> = ({
  account: {mobile},
  action,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [order, setOrder] = useState<RkbOrder>();
  const [receipt, setReceipt] = useState<RkbReceipt>();
  const ref = useRef<ViewShot>();

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('pym:receipt')} />,
    });

    setOrder(route.params?.order);
    setReceipt(route.params?.receipt);
  }, [navigation, route.params]);

  const hasAndroidPermission = useCallback(async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }, []);

  const capture = useCallback(async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      action.toast.push('갤러리 접근 권한이 없어요');
      return;
    }

    ref.current?.capture().then((uri) => {
      CameraRoll.save(uri, {type: 'photo', album: i18n.t('rcpt:album')}).then(
        () => action.toast.push('rcpt:saved'),
      );
    });
  }, [action.toast, hasAndroidPermission]);

  const share = useCallback(async () => {
    try {
      ref.current?.capture().then(async (uri) => {
        const result = await Share.open({
          title: i18n.t('rcpt:title'),
          url: uri,
        });
        console.log('@@@ share reulst', result, uri);
      });
    } catch (e) {
      console.log('😻😻😻 snapshot failed', e);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{flex: 1}}>
        <ViewShot ref={ref} style={{backgroundColor: colors.whiteTwo}}>
          <View style={styles.title}>
            <AppText style={[appStyles.normal14Text, {color: colors.warmGrey}]}>
              {utils.toDateString(order?.orderDate)}
            </AppText>
            <AppText
              style={[
                appStyles.bold24Text,
                {color: colors.black, marginTop: 10, marginBottom: 30},
              ]}>
              {receipt?.name}
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
              // value={order?.totalPrice}
              value={receipt?.amount || 0}
              valueStyle={styles.value}
              color={colors.clearBlue}
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
              data={{date: utils.toDateString(order?.orderDate, 'LL')}}
            />
          </View>
        </ViewShot>
      </ScrollView>

      <View style={{flexDirection: 'row'}}>
        <AppButton
          style={{
            ...styles.button,
            backgroundColor: 'white',
            borderWidth: 1,
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
