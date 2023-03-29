import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Platform,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ShortcutBadge from 'react-native-app-badge';
import Svg, {Path} from 'react-native-svg';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import {actions as notiActions, NotiAction} from '@/redux/modules/noti';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import AppButton from '@/components/AppButton';
import {API} from '@/redux/api';
import AppTextInput from '@/components/AppTextInput';
import {OrderModelState} from '../redux/modules/order';
import Env from '@/environment';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import AppModalContent from '@/components/ModalContent/AppModalContent';

const {esimGlobal} = Env.get();
const radioButtons = [
  {id: 'resign:reason1'},
  {id: 'resign:reason2'},
  {id: 'resign:reason3'},
  {id: 'resign:reason4'},
  {id: 'resign:reason5'},
  {id: 'resign:reason6'},
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  blueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 243,
    backgroundColor: colors.clearBlue,
  },
  radioBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 24,
    top: 156,
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: 2,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  resignTitle: {
    ...appStyles.bold24Text,
    marginTop: 72,
    marginLeft: 20,
  },
  resignWhy: {
    ...appStyles.bold16Text,
    marginBottom: 4,
  },
  confirmResign: {
    backgroundColor: colors.whiteTwo,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 48,
    marginTop: 480,
  },
  divider: {
    marginTop: 16,
    height: 2,
    marginBottom: 8,
    backgroundColor: colors.whiteTwo,
  },
  button: {
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    color: colors.white,
    textAlign: 'center',
  },
  buttonTitle: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    margin: 5,
    color: colors.white,
  },
  textInput: {
    padding: 16,
    height: 120,
    borderStyle: 'solid',
    borderWidth: 1,
    textAlignVertical: 'top',
  },
});

type ResignScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Settings'
>;

type ResignScreenRouteProp = RouteProp<HomeStackParamList, 'SimpleText'>;

type ResignScreenProps = {
  navigation: ResignScreenNavigationProp;
  route: ResignScreenRouteProp;
  account: AccountModelState;
  order: OrderModelState;
  pending: boolean;
  action: {
    account: AccountAction;
    cart: CartAction;
    order: OrderAction;
    noti: NotiAction;
    modal: ModalAction;
  };
};

const ImgResignDokebi = () => (
  <View style={{marginTop: 52, marginRight: 32}}>
    <Svg
      width="87"
      height="125"
      viewBox="0 0 87 125"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M73.667 63.223s8.672 19.979 10.356 37.926c.337 4.487-2.273 6.434-5.22 6.434-3.62 0-6.483-2.963-4.8-7.958 0 0-4.125-22.01-8.587-29.46 0 0-4.21-5.842.252-8.72 4.463-2.963 7.494.677 8 1.778z"
        fill="#fff"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M43.44 63.307h30.058s-2.357 28.36-8.925 55.957c0 0 2.526 1.101 2.526 4.318-3.873 0-15.66.084-16.924 0-1.347-.085-2.947-7.535-4.041-16.254-.421-2.794-1.516-3.64-2.695-3.64-1.178 0-2.273.846-2.694 3.64-1.095 8.719-2.779 16.254-4.042 16.254-1.347.084-13.05 0-16.924 0 0-3.302 2.526-4.318 2.526-4.318-6.567-27.682-8.925-55.957-8.925-55.957h30.06z"
        fill="#fff"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m12.791 65.423 1.095-3.132L17 77.868l-3.789 3.047-.421-15.492zM74.088 65.423l-1.095-3.132-3.115 15.577 3.789 3.047.42-15.492z"
        fill="#fff"
      />
      <Path
        d="M13.212 63.645s-6.736 15.662-2.526 22.942c0 0 1.852 3.386 5.726.339 3.873-3.048 1.515-17.355 1.515-17.355l-4.715-5.925zM17.338 39.096s-2.19-9.143-8.336-9.143c-6.146 0-8.504 6.35-7.914 11.767.589 5.334 4.546 14.223 14.566 13.884 0 0 3.789-3.979 1.684-16.508z"
        fill="#fff"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.654 41.888s-1.347-5.502-5.22-5.502c-3.873 0-5.389 3.894-4.968 7.11.421 3.218 2.863 8.636 9.262 8.382-.084-.085 2.273-2.455.926-9.99z"
        fill="#2A7FF6"
        stroke="#000"
        strokeMiterlimit="10"
      />
      <Path
        d="M69.541 39.096s2.19-9.143 8.336-9.143c6.146 0 8.504 6.35 7.914 11.767-.59 5.334-4.546 14.223-14.566 13.884 0 0-3.789-3.979-1.684-16.508z"
        fill="#fff"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M71.225 41.888s1.348-5.502 5.22-5.502c3.874 0 5.39 3.894 4.968 7.11-.42 3.218-2.862 8.636-9.261 8.382.084-.085-2.274-2.455-.927-9.99z"
        fill="#2A7FF6"
        stroke="#000"
        strokeMiterlimit="10"
      />
      <Path
        d="M43.44 76.174c11.282 0 21.555-3.555 25.175-5.84 3.62-2.287 5.052-5.419 5.052-9.313 0-20.318-3.789-29.037-3.789-29.037C62.721 14.037 43.44 15.307 43.44 15.307S24.158 14.12 17 31.984c0 0-3.789 8.72-3.789 29.037 0 3.894 1.432 7.026 5.052 9.312 3.62 2.286 13.893 5.841 25.176 5.841z"
        fill="#fff"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M25.336 27.835s6.4-2.2 9.262-2.454c1.6-.085 3.537.253 4.21 2.709.674 2.454-.926 3.386-3.452 4.317s-10.02 3.64-12.461 1.185c-2.442-2.455-.506-4.74 2.441-5.756zM52.551 32.128s6.4 2.201 9.262 2.455c1.6.085 3.536-.254 4.21-2.709.674-2.455-.926-3.386-3.452-4.317s-10.02-3.64-12.462-1.185c-2.441 2.455-.505 4.74 2.442 5.756z"
        fill="#000"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m21.463 35.879 15.914 1.016s-2.694 2.455-7.915 2.455c-5.22 0-7.914-1.863-7.999-3.471z"
        fill="#fff"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m28.536 36.386.337 3.047 2.526-.084.59-2.71-3.453-.253z"
        fill="#000"
      />
      <Path
        d="M29.294 45.952c-.253 2.116-3.2 3.47-6.568 3.047-3.367-.423-5.81-2.54-5.557-4.656.253-2.116 2.19-3.725 6.568-3.048 3.368.508 5.894 2.54 5.557 4.657z"
        fill="#ED4847"
      />
      <Path
        d="M29.042 46.883c-.927 1.608-3.453 2.454-6.231 2.116-3.368-.423-5.81-2.54-5.557-4.656"
        stroke="#000"
        strokeWidth=".5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m65.415 35.879-15.913 1.016s2.694 2.455 7.915 2.455c5.22 0 7.998-1.863 7.998-3.471z"
        fill="#fff"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m58.343 36.386-.337 3.047-2.526-.084-.59-2.71 3.453-.253z"
        fill="#000"
      />
      <Path
        d="M57.585 45.952c.252 2.116 3.2 3.47 6.567 3.047 3.368-.423 5.81-2.54 5.558-4.656-.253-2.116-2.19-3.725-6.568-3.048-3.368.508-5.81 2.54-5.557 4.657z"
        fill="#ED4847"
      />
      <Path
        d="M57.922 46.883c.926 1.608 3.452 2.454 6.23 2.116 3.368-.423 5.81-2.54 5.558-4.656"
        stroke="#000"
        strokeWidth=".5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M43.608 38.08c.337.676 1.263 2.539 1.516 3.724.084.254-.085.508-.337.508l-1.432.254c-.252.085-.505-.17-.505-.508 0-.847.169-2.709.59-3.979-.085-.17.084-.17.168 0z"
        fill="#000"
      />
      <Path
        d="M58.51 56.195c-2.778-3.302-8.503-5.588-15.155-5.588-6.652 0-12.377 2.286-15.156 5.588"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M43.44 19.37c6.82 0 8.167-2.285 8.167-2.285C50.765 4.048 43.44 1 43.44 1s-7.326 3.048-8.167 16.085c0-.085 1.347 2.285 8.167 2.285z"
        fill="#FFD300"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M43.439 21.826c14.398 0 12.546-8.212 11.367-9.82-1.263-1.609-3.368-1.524-4.715-.847-1.348.677-2.358.338-3.284-1.609-1.095-2.2-3.284-2.116-3.284-2.116s-2.189-.085-3.284 2.116c-1.01 2.032-1.936 2.37-3.283 1.609-1.348-.677-3.452-.762-4.715.846-1.348 1.694-3.2 9.82 11.198 9.82z"
        fill="#2A7FF6"
        stroke="#000"
        strokeMiterlimit="10"
      />
      <Path
        d="M72.91 63.985s-5.221 2.709-6.063 9.481c-.842 6.773 3.873 14.9 3.873 14.9l.252-4.148s0-7.28 5.558-13.376c1.6-1.778-.674-8.212-3.62-6.857z"
        fill="#000"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <Path
        d="M55.059 81H32.914a2.09 2.09 0 0 1-2.104-2.117V66.27a2.09 2.09 0 0 1 2.104-2.117H55.06a2.09 2.09 0 0 1 2.105 2.117v12.614c0 1.185-1.01 2.116-2.105 2.116z"
        fill="#FFD300"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M43.945 75.92c3.284 0 4.041-1.1 4.041-1.1-.42-6.349-4.041-7.873-4.041-7.873s-3.62 1.524-4.042 7.873c0 0 .674 1.1 4.042 1.1z"
        fill="#FFD300"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M43.945 77.106c7.073 0 6.146-3.98 5.557-4.826-.59-.846-1.6-.761-2.273-.423-.674.339-1.18.17-1.6-.847-.505-1.1-1.6-1.015-1.6-1.015s-1.095-.085-1.6 1.015c-.505.932-.926 1.186-1.6.847-.673-.338-1.683-.423-2.273.423-.59.847-1.684 4.826 5.389 4.826z"
        fill="#2A7FF6"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <Path
        d="M13.886 63.985s5.22 2.709 6.062 9.481c.842 6.773-3.873 14.9-3.873 14.9l-.253-4.148s0-7.28-5.557-13.376c-1.6-1.778.59-8.212 3.62-6.857z"
        fill="#000"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <Path
        d="M10.687 86.588c4.967 8.634 18.27-7.789 18.27-7.789s3.621.085 5.305-1.778c1.852-2.031.842-6.095-.758-7.365-2.189-1.693-4.883-1.693-9.009 1.609-4.63 3.555-10.188 8.889-10.188 8.889"
        fill="#fff"
      />
      <Path
        d="M10.687 86.588c4.967 8.634 18.27-7.789 18.27-7.789s3.621.085 5.305-1.778c1.852-2.031.842-6.095-.758-7.365-2.189-1.693-4.883-1.693-9.009 1.609-4.63 3.555-10.188 8.889-10.188 8.889"
        stroke="#000"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  </View>
);

const ResignScreen: React.FC<ResignScreenProps> = ({
  navigation,
  account,
  order,
  action,
  pending,
}) => {
  const [reasonIdx, setReasonIdx] = useState<number>(0);
  const [otherReason, setOtherReason] = useState<string>('');
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  const editable = useMemo(
    () => reasonIdx === radioButtons.length - 1,
    [reasonIdx],
  );
  const purchaseCnt = useMemo(() => {
    return order.subs.size;
  }, [order.subs.size]);

  const resignInfo = useMemo(() => {
    return purchaseCnt > 0
      ? i18n.t('resign:cntInfo', {count: purchaseCnt})
      : i18n.t('resign:noCnt');
  }, [purchaseCnt]);

  useEffect(() => {
    if (purchaseCnt <= 0) {
      const {iccid: initIccid, mobile: initMobile, token} = account;

      if (initIccid && token) {
        action.order.getSubsWithToast({iccid: initIccid, token});
      }
      if (initMobile && token && !esimGlobal) {
        action.order.getStoreSubsWithToast({
          mobile: initMobile,
          token,
        });
      }
    }
  }, [account, action.order, purchaseCnt]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('resign')} />,
    });
  }, [navigation]);

  const logout = useCallback(() => {
    action.modal.closeModal();
    Promise.all([
      action.cart.reset(),
      action.order.reset(),
      action.noti.init({mobile: undefined}),
      action.account.logout(),
    ]).then(async () => {
      if (Platform.OS === 'ios')
        PushNotificationIOS.setApplicationIconBadgeNumber(0);
      else {
        ShortcutBadge.setCount(0);
      }
    });
  }, [action.account, action.cart, action.modal, action.noti, action.order]);

  const showFinishModal = useCallback(() => {
    action.modal.showModal({
      content: (
        <AppModalContent
          title={i18n.t('resign:finished')}
          type="info"
          onOkClose={logout}
        />
      ),
    });
  }, [action.modal, logout]);

  const resign = useCallback(async () => {
    const {uid, token} = account;
    action.modal.closeModal();

    if (isConfirm) {
      const rsp = await API.User.resign(
        {uid, token},
        reasonIdx === radioButtons.length - 1
          ? otherReason
          : i18n.t(radioButtons[reasonIdx].id),
      );

      // 탈퇴 실패한 경우 무시
      if (rsp.result && rsp.result < 0) {
        console.log('@@@fail to resign');
      }
      showFinishModal();
    }
  }, [
    account,
    action.modal,
    isConfirm,
    otherReason,
    reasonIdx,
    showFinishModal,
  ]);

  const showConfirmModal = useCallback(() => {
    action.modal.showModal({
      content: (
        <AppModalContent
          title={i18n.t('resign:confirmModal', {
            info: resignInfo,
          })}
          type="normal"
          onCancelClose={resign}
          onOkClose={() => {
            navigation.popToTop();
            navigation.navigate('HomeStack', {screen: 'Home'});
            action.modal.closeModal();
          }}
          cancelButtonTitle={i18n.t('yes')}
          cancelButtonStyle={{color: colors.black, marginRight: 60}}
          okButtonTitle={i18n.t('no')}
          okButtonStyle={{color: colors.clearBlue}}
        />
      ),
    });
  }, [action.modal, navigation, resign, resignInfo]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <AppActivityIndicator visible={pending} />
        <View style={styles.blueContainer}>
          <AppText style={[styles.resignTitle, {color: colors.white}]}>
            {i18n.t('resign:title')}
          </AppText>
          <ImgResignDokebi />
        </View>
        <View style={styles.radioBtnContainer}>
          <View style={{width: '100%'}}>
            <AppText style={styles.resignWhy}>{i18n.t('resign:why')}</AppText>
            <AppText style={appStyles.normal14Text}>
              {i18n.t('resign:info')}
            </AppText>
            <View style={styles.divider} />
            {radioButtons.map(({id}, idx) => (
              <Pressable
                style={{flexDirection: 'row', paddingVertical: 16}}
                key={id}
                hitSlop={10}
                onPress={() => setReasonIdx(idx)}>
                <AppIcon
                  style={{marginRight: 6}}
                  name="btnCheck"
                  focused={idx === reasonIdx}
                />
                <AppText style={appStyles.normal16Text}>
                  {i18n.t(radioButtons[idx].id)}
                </AppText>
              </Pressable>
            ))}
            <AppTextInput
              style={[
                styles.textInput,
                {
                  borderColor: editable ? colors.black : colors.lightGrey,
                  backgroundColor: editable ? colors.white : colors.whiteTwo,
                },
              ]}
              multiline
              onChangeText={(v) => setOtherReason(v)}
              placeholder={i18n.t('resign:placeholder')}
              placeholderTextColor={colors.greyish}
              editable={editable}
              value={otherReason}
            />
          </View>
        </View>

        <View style={styles.confirmResign}>
          <AppText style={[appStyles.bold14Text, {marginBottom: 10}]}>
            {i18n.t('resign:note')}
          </AppText>
          {['1', '2', '3'].map((elm) => (
            <View key={elm} style={{flexDirection: 'row', paddingRight: 20}}>
              <AppText
                style={[
                  appStyles.normal14Text,
                  {width: 20, textAlign: 'center'},
                ]}>
                {'\u2022'}
              </AppText>
              <AppText style={appStyles.normal14Text}>
                {i18n.t(`resign:confirm${elm}`)}
              </AppText>
            </View>
          ))}

          <Pressable
            style={{flexDirection: 'row', paddingVertical: 16}}
            key={1}
            hitSlop={10}
            onPress={() => setIsConfirm((value) => !value)}>
            <AppIcon
              style={{marginRight: 6}}
              name="btnCheck2"
              focused={isConfirm}
            />
            <AppText style={appStyles.normal16Text}>
              {i18n.t(`resign:isConfirm`)}
            </AppText>
          </Pressable>
        </View>

        <AppButton
          style={styles.button}
          type="primary"
          titleStyle={styles.buttonTitle}
          disableColor={colors.warmGrey}
          disableBackgroundColor={colors.lightGrey}
          disabled={!isConfirm}
          title={i18n.t('resign')}
          onPress={() => showConfirmModal()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default connect(
  ({account, order, status}: RootState) => ({
    account,
    order,
    pending: status.pending[accountActions.logout.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(ResignScreen);
