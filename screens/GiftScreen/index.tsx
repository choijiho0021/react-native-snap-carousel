import {
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  Linking,
  StyleSheet,
  View,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import AppTextInput from '@/components/AppTextInput';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import subsApi, {RkbSubscription} from '@/redux/api/subscriptionApi';
import {AccountModelState} from '@/redux/modules/account';
import {
  actions as promotionActions,
  PromotionAction,
  PromotionModelState,
} from '@/redux/modules/promotion';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import Env from '@/environment';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppSnackBar from '@/components/AppSnackBar';
import KakaoSDK from '@/components/NativeModule/KakaoSDK';
import AppModal from '@/components/AppModal';
import AppStyledText from '@/components/AppStyledText';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  // 여기부터
  kakao: {
    flex: 1,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
  },
  method: {
    marginVertical: 20,
    flexDirection: 'row',
    flex: 1,
  },
  methodInfo: {
    ...appStyles.normal12Text,
    textAlign: 'left',
    color: colors.warmGrey,
    lineHeight: 18,
  },
  warn: {
    height: 42,
    backgroundColor: colors.whiteTwo,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 16,
    paddingLeft: 12,
  },
  info: {
    ...appStyles.normal12Text,
    textAlign: 'left',
    color: colors.warmGrey,
    lineHeight: 18,
    marginBottom: 3,
  },
  msg: {
    ...appStyles.normal16Text,
    flex: 1,
    lineHeight: 30,
    textAlign: 'center',
    textAlignVertical: 'top',
    height: 120,
    paddingTop: 0,
    paddingBottom: 0,
    padding: 0,
    letterSpacing: -1,
  },
  msgLength: {
    ...appStyles.normal12Text,
    color: colors.warmGrey,
    marginBottom: 14,
    textAlign: 'center',
  },
  bg: {
    height: 420,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  msgBox: {
    flex: 1,
    height: 217,
    margin: 20,
    paddingTop: 50,
    paddingHorizontal: 40,
  },
  arrowLeft: {
    position: 'absolute',
    bottom: 116,
    left: 30,
  },
  arrowRight: {
    position: 'absolute',
    bottom: 116,
    right: 30,
  },
  infoBox: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
    backgroundColor: colors.whiteTwo,
  },
  divider: {
    height: 1,
    backgroundColor: colors.black,
    marginVertical: 20,
  },
  thickDivider: {
    height: 10,
    backgroundColor: colors.whiteTwo,
  },
  modalBodyStyle: {
    paddingTop: 15,
    paddingHorizontal: 30,
  },
  textHeighlight: {
    ...appStyles.normal16Text,
    color: colors.clearBlue,
  },
  modalText: {
    ...appStyles.normal16Text,
    lineHeight: 26,
    letterSpacing: -0.5,
  },
});

type GiftScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Gift'>;

type GiftScreenRouteProp = RouteProp<HomeStackParamList, 'Gift'>;

type GiftScreenProps = {
  navigation: GiftScreenNavigationProp;
  route: GiftScreenRouteProp;

  promotion: PromotionModelState;
  account: AccountModelState;

  pending: boolean;

  action: {
    promotion: PromotionAction;
    order: OrderAction;
  };
};

const KAKAO = 'kakao';
const MESSAGE = 'message';
const {isProduction, esimGlobal, webViewHost, isIOS} = Env.get();

const numberOfLines = (txt: string) => {
  let lines = 0;
  for (let i = 0; i < txt.length; i++) {
    if (txt[i] === '\n' || txt[i] === '\r') lines++;
  }
  return lines;
};

const GiftScreen: React.FC<GiftScreenProps> = ({
  navigation,
  route,
  promotion,
  account,
  pending,
  action,
}) => {
  const deviceModel = useMemo(() => DeviceInfo.getModel(), []);
  const SMSDivider = useMemo(() => (Platform.OS === 'android' ? '?' : '&'), []);
  const methodList = useMemo(() => {
    // pixcel인 경우 sms로 선물하기 제거
    if (esimGlobal && !isIOS && !deviceModel.startsWith('SM')) return [];
    if (esimGlobal) return [MESSAGE];
    if (!isIOS && !deviceModel.startsWith('SM')) return [KAKAO];
    return [KAKAO, MESSAGE];
  }, [deviceModel]);
  const bgImages = useMemo(
    () => (promotion.gift.bg || []).filter((v) => v?.image),
    [promotion.gift.bg],
  );

  const {mainSubs} = route.params || {};
  const [msg, setMsg] = useState(i18n.t('gift:default'));
  const [num, setNum] = useState(0);
  const msgRef = useRef();
  const [toastPending, setToastPending] = useState(false);
  const [showSnackBar, setShowSnackbar] = useState(false);
  const [checked, setChecked] = useState(methodList[0]);
  const [showModal, setShowModal] = useState(false);
  const [gift, setGift] = useState('');

  useEffect(() => {
    API.Promotion.getStat().then((rsp) => {
      if (rsp.result === 0 && rsp.objects?.length > 0) {
        setGift(rsp.objects[0].recommenderGift);
      }
    });
  }, []);

  useEffect(() => {
    if (!promotion.stat.signupGift) promotionActions.getPromotionStat();
  }, [promotion.stat.signupGift]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('gift:title')} />,
    });
  }, [navigation]);

  const createLink = useCallback(
    async (item: RkbSubscription) => {
      const image = bgImages[num]?.title;
      return action.promotion
        .makeContentAndLink({
          msg,
          item,
          image,
        })
        .then((res) => res?.payload);
    },
    [action.promotion, bgImages, msg, num],
  );

  const afterSend = useCallback(
    (item: RkbSubscription, updateStatus: boolean = false) => {
      setToastPending(true);
      if (account?.token && updateStatus) {
        action.order.updateSubsGiftStatus({
          uuid: item.uuid,
          giftStatus: subsApi.GIFT_STATUS_SEND,
          token: account.token,
        });
      }
      setTimeout(
        () => {
          if (updateStatus) setShowSnackbar(true);
          setToastPending(false);
          navigation.goBack();
        },
        updateStatus ? 2000 : 4000,
      );
    },
    [account.token, action.order, navigation],
  );

  const sendLink = useCallback(
    async (method: string, item: RkbSubscription) => {
      // 사용자에게 보낼 링크
      const giftId = await createLink(item);
      if (giftId === undefined) {
        setShowModal(true);
        return;
      }

      const webUrl = `${webViewHost}/gift/${giftId}`;

      const body = `${i18n.t('gift:msgBody1')}${
        item.prodName
      }\n${webUrl}${i18n.t('gift:msgBody2')}  `;

      try {
        let result = null;
        let updateStatus = true;

        if (method === MESSAGE) {
          result = await Linking.openURL(`sms:${SMSDivider}body=${body}`);
        } else {
          // kakao
          const resp = await KakaoSDK.KakaoShareLink.sendCustom({
            // kakao template 상용: 67017, TB: 70053
            templateId: isProduction ? 67017 : 70053,
            templateArgs: [
              {
                key: 'gift',
                value: giftId,
              },
            ],
          });
          // eslint-disable-next-line prefer-destructuring
          result = resp?.result;
          updateStatus = false;
        }

        if (result) {
          afterSend(item, updateStatus);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [SMSDivider, afterSend, createLink],
  );

  const info = useCallback(
    () => (
      <View>
        {Array.from({length: 5}, (_, i) => i + 1).map((v) => (
          <AppText key={`info${v}`} style={styles.info}>
            {i18n.t(`gift:info${v}`)}
          </AppText>
        ))}
      </View>
    ),
    [],
  );

  const method = useCallback(() => {
    if (methodList.length === 0) return null;

    return (
      <View>
        <AppText style={appStyles.bold18Text}>{i18n.t('gift:method')}</AppText>
        <View style={styles.method}>
          {methodList.map((v, idx) => (
            <Pressable
              key={v}
              style={[styles.kakao, {marginRight: idx === 0 ? 25 : 0}]}
              onPress={() => setChecked(v)}>
              <AppSvgIcon name="btnCheck" focused={checked === v} />
              <AppText
                style={[
                  appStyles.bold16Text,
                  {color: colors.warmGrey, marginLeft: 8},
                ]}>
                {i18n.t(`gift:${v}`)}
              </AppText>
            </Pressable>
          ))}
        </View>
        <AppText key="info" style={styles.methodInfo}>
          {i18n.t(`gift:${checked}Info`)}
        </AppText>
        <View key="warn" style={styles.warn}>
          <AppText style={appStyles.normal12Text}>
            {i18n.t(`gift:warn`)}
          </AppText>
        </View>
      </View>
    );
  }, [checked, methodList]);

  const cardDesign = useCallback(
    () => (
      <ImageBackground
        style={styles.bg}
        resizeMode="stretch"
        imageStyle={{aspectRatio: 375 / 420}}
        source={{
          uri: API.default.httpImageUrl(bgImages[num]?.image).toString(),
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.msgBox}>
            <AppTextInput
              multiline
              ref={msgRef}
              value={msg}
              onChangeText={(txt) => {
                if (numberOfLines(txt) < 4) setMsg(txt);
              }}
              scrollEnabled={false}
              maxLength={80}
              numberOfLines={4}
              defaultValue={msg}
              style={styles.msg}
            />
            <AppText style={styles.msgLength}>
              {`${msg.length} ${i18n.t('gift:maxLength')}`}
            </AppText>
          </View>

          {num > 0 && (
            <AppButton
              style={styles.arrowLeft}
              iconName="arrowLeft"
              onPress={() => setNum(num - 1)}
            />
          )}
          {num < bgImages.length - 1 && (
            <AppButton
              style={styles.arrowRight}
              iconName="arrowRight24"
              onPress={() => setNum(num + 1)}
            />
          )}
        </View>
      </ImageBackground>
    ),
    [bgImages, msg, num],
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        {cardDesign()}
        <View style={{marginVertical: 30, marginHorizontal: 20}}>
          <AppText style={appStyles.bold18Text}>
            {i18n.t('gift:giftInfo')}
          </AppText>
          <AppText style={[appStyles.normal16Text, {marginTop: 20}]}>
            {mainSubs.prodName}
          </AppText>
        </View>
        <View style={styles.thickDivider} />
        <View style={{margin: 20, marginBottom: 30}}>{method()}</View>
        <View style={styles.infoBox}>
          <AppText style={appStyles.bold18Text}>{i18n.t('esim:info')}</AppText>
          <View style={styles.divider} />
          {info()}
        </View>
        <AppActivityIndicator visible={toastPending || pending} />
      </KeyboardAwareScrollView>
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackbar(false)}
        textMessage={i18n.t('toast:sendSuccess')}
        bottom={10}
      />
      <AppButton
        style={appStyles.confirm}
        title={i18n.t('esim:sendGift')}
        disabled={methodList.length === 0}
        onPress={() => sendLink(checked, mainSubs)}
      />
      <AppModal
        type="info"
        onOkClose={() => {
          setShowModal(false);
        }}
        visible={showModal}>
        <View style={styles.modalBodyStyle}>
          <AppStyledText
            text={i18n.t('gift:alert', {cash: gift})}
            textStyle={styles.modalText}
            format={{b: styles.textHeighlight}}
          />
        </View>
      </AppModal>
    </SafeAreaView>
  );
};

export default connect(
  ({account, promotion, status}: RootState) => ({
    account,
    promotion,
    pending:
      status.pending[promotionActions.makeContentAndLink.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      promotion: bindActionCreators(promotionActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
    },
  }),
)(GiftScreen);
