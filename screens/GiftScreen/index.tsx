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
import {SMSDivider} from '@/utils/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  box: {
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  method: {
    marginTop: 20,
    marginBottom: 18,
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  warn: {
    backgroundColor: colors.backGrey,
    paddingVertical: 16,
    paddingLeft: 16,
    borderRadius: 3,
    flexDirection: 'row',
    width: '100%',
  },
  info: {
    ...appStyles.normal14Text,
    textAlign: 'left',
    color: colors.warmGrey,
    lineHeight: 22,
  },
  msg: {
    ...appStyles.normal16Text,
    flex: 1,
    lineHeight: 30,
    textAlign: 'center',
    textAlignVertical: 'top',
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
    height: 224,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  msgBox: {
    flex: 1,
    margin: 20,
    paddingTop: 16,
    paddingHorizontal: 40,
    backgroundColor: colors.white,
    borderRadius: 3,
  },
  infoBox: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: colors.backGrey,
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
  confirm: {
    height: 52,
    backgroundColor: colors.clearBlue,
    marginBottom: 20,
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
  const methodList = useMemo(() => {
    // pixcel인 경우 sms로 선물하기 제거
    if (esimGlobal && !isIOS && !deviceModel.startsWith('SM')) return [];
    if (esimGlobal) return [MESSAGE];
    if (!isIOS && !deviceModel.startsWith('SM')) return [KAKAO];
    return [KAKAO, MESSAGE];
  }, [deviceModel]);
  const bgImages = useMemo(() => promotion.gift.bg || [], [promotion.gift.bg]);

  const {mainSubs} = route.params || {};
  const [msg, setMsg] = useState(i18n.t('gift:default0'));
  const [num, setNum] = useState(0);
  const [cardHeight, setCardHeight] = useState(120);
  const [toastPending, setToastPending] = useState(false);
  const [showSnackBar, setShowSnackbar] = useState(false);
  const [checked, setChecked] = useState(methodList[0]);
  const [showModal, setShowModal] = useState(false);
  const [gift, setGift] = useState('');
  const bgColor = useMemo(
    () => [colors.giftbg1, colors.giftbg2, colors.giftbg3][num],
    [num],
  );

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

      const body = `${i18n.t('gift:msgBody', {
        title: item.prodName,
        link: webUrl,
      })}`;

      try {
        let result = null;
        let updateStatus = true;

        if (method === MESSAGE) {
          result = await Linking.openURL(`sms:${SMSDivider()}body=${body}`);
        } else {
          // kakao
          const resp = await KakaoSDK.KakaoShareLink.sendCustom({
            // kakao template 상용: old : 67017, new : 115373, TB: 70053
            templateId: isProduction ? 115373 : 70053,

            templateArgs: [
              {
                key: 'gift',
                value: giftId,
              },
              {
                key: 'prod',
                value: item.prodName,
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
    [afterSend, createLink],
  );

  const info = useCallback(
    () => (
      <View style={{paddingRight: 20}}>
        {Array.from({length: 5}, (_, i) => i + 1).map((v) => (
          <View style={{flexDirection: 'row'}}>
            <AppText style={styles.info}>{i18n.t('middleDot')}</AppText>
            <AppText key={`info${v}`} style={styles.info}>
              {i18n.t(`gift:info${v}`)}
            </AppText>
          </View>
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
          {methodList.map((v, idx, arr) => (
            <Pressable
              key={v}
              style={[
                styles.box,
                {
                  borderColor:
                    checked === v ? colors.clearBlue : colors.lightGrey,
                  backgroundColor:
                    checked === v ? colors.clearBlue10 : colors.white,
                  borderRadius: 3,
                },
              ]}
              onPress={() => setChecked(v)}>
              <AppSvgIcon
                name="checkBox"
                focused={checked === v}
                style={{position: 'absolute', left: 16, top: 16}}
              />
              <View
                style={{
                  alignItems: 'center',
                }}>
                <AppSvgIcon
                  name={v === KAKAO ? 'kakaoIcon' : 'smsIcon'}
                  focused={checked === v}
                />
                <AppText
                  style={[
                    appStyles.normal16Text,
                    {color: colors.black, marginTop: 8},
                  ]}>
                  {i18n.t(`gift:${v}`)}
                </AppText>
              </View>
            </Pressable>
          ))}
          {methodList.length <= 1 && <View style={{flex: 1, marginLeft: 30}} />}
        </View>
        <View key="warn" style={styles.warn}>
          <AppSvgIcon name="warnGrey20" style={{marginRight: 8}} />

          <AppText
            style={[
              appStyles.normal14Text,
              {lineHeight: 22, flex: 1, paddingRight: 16},
            ]}>
            {i18n.t(`gift:warn:${checked}`)}
          </AppText>
        </View>
      </View>
    );
  }, [checked, methodList]);

  const onPressCard = useCallback(
    (key: number) => {
      setNum(key);
      if (
        [
          i18n.t('gift:default0'),
          i18n.t('gift:default1'),
          i18n.t('gift:default2'),
        ].includes(msg)
      )
        setMsg(i18n.t(`gift:default${key}`));
    },
    [msg],
  );

  const renderSelectDesign = useCallback(
    () => (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
          marginTop: 16,
          marginBottom: 24,
        }}>
        <AppButton
          iconName="giftImage1"
          style={{}}
          onPress={() => onPressCard(0)}
          checked={num === 0}
        />
        <AppButton
          iconName="giftImage2"
          style={{}}
          onPress={() => onPressCard(1)}
          checked={num === 1}
        />
        <AppButton
          iconName="giftImage3"
          style={{}}
          onPress={() => onPressCard(2)}
          checked={num === 2}
        />
      </View>
    ),
    [num, onPressCard],
  );

  const handleContentSizeChange = (contentSize: any) => {
    const {height} = contentSize;

    if (height <= 89) setCardHeight(120);
    else if (height <= 119) setCardHeight(150);
    else setCardHeight(180);
  };

  const cardDesign = useCallback(
    () => (
      <View>
        <ImageBackground
          style={styles.bg}
          resizeMode="stretch"
          imageStyle={{
            aspectRatio: 335 / 224,
            marginHorizontal: 20,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
          }}
          source={{
            uri: API.default.httpImageUrl(bgImages[num]?.image).toString(),
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: bgColor,
            marginHorizontal: 20,
            borderBottomRightRadius: 3,
            borderBottomLeftRadius: 3,
          }}>
          <View style={{...styles.msgBox, height: cardHeight}}>
            <AppTextInput
              multiline
              // ref={msgRef}
              value={msg}
              onChangeText={(txt) => {
                setMsg(txt);
              }}
              scrollEnabled
              maxLength={80}
              // defaultValue={msg}
              style={styles.msg}
              onContentSizeChange={(e) =>
                handleContentSizeChange(e.nativeEvent.contentSize)
              }
            />
            <AppText style={styles.msgLength}>
              {`${msg.length} ${i18n.t('gift:maxLength')}`}
            </AppText>
          </View>
        </View>
      </View>
    ),
    [bgColor, bgImages, cardHeight, msg, num],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={appStyles.header}>
        <AppBackButton title={i18n.t('gift:title')} />
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        <AppText
          style={[
            appStyles.bold18Text,
            {marginHorizontal: 20, marginBottom: 16, marginTop: 24},
          ]}>
          {i18n.t('gift:subtitle')}
        </AppText>
        {cardDesign()}
        {renderSelectDesign()}
        <View style={styles.thickDivider} />
        <View style={{marginVertical: 24, marginHorizontal: 20}}>
          <AppText style={appStyles.bold18Text}>
            {i18n.t('gift:giftInfo')}
          </AppText>
          <AppText style={[appStyles.normal16Text, {marginTop: 20}]}>
            {mainSubs.prodName}
          </AppText>
        </View>
        <View style={styles.thickDivider} />
        <View style={{margin: 20, marginBottom: 32}}>{method()}</View>
        <View style={styles.infoBox}>
          <View style={{flexDirection: 'row'}}>
            <AppSvgIcon name="warnRed24" style={{marginRight: 8}} />
            <AppText style={appStyles.bold18Text}>
              {i18n.t('gift:info')}
            </AppText>
          </View>
          <View style={{height: 13, width: '100%'}} />
          {info()}
        </View>
        <AppButton
          style={styles.confirm}
          title={i18n.t('esim:sendGift')}
          disabled={methodList.length === 0}
          onPress={() => sendLink(checked, mainSubs)}
        />
        <AppActivityIndicator visible={toastPending || pending} />
      </KeyboardAwareScrollView>
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackbar(false)}
        textMessage={i18n.t('toast:sendSuccess')}
        bottom={10}
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
