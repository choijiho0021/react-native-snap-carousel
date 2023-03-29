import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Image,
  Platform,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ShortcutBadge from 'react-native-app-badge';
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
          <Image
            style={{
              marginTop: 52,
              marginRight: 32,
              justifyContent: 'flex-end',
            }}
            source={require('../assets/images/esim/imgResignDokebi.png')}
            resizeMode="stretch"
          />
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
