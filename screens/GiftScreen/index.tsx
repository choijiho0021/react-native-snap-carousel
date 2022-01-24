import {ImageBackground, SafeAreaView, StyleSheet, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {bindActionCreators} from 'redux';
import SendSMS from 'react-native-sms';
import {connect} from 'react-redux';
import KakaoShareLink from 'react-native-kakao-share-link';
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
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import api from '@/redux/api/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  // 여기부터
  kakao: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: colors.lightGrey,
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
    height: 120,
    paddingTop: 0,
    paddingBottom: 0,
    padding: 0,
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
    toast: ToastAction;
    order: OrderAction;
  };
};

const KAKAO = 'kakao';
const MESSAGE = 'message';

const GiftScreen: React.FC<GiftScreenProps> = ({
  navigation,
  route,
  promotion,
  account,
  pending,
  action,
}) => {
  const [msg, setMsg] = useState(i18n.t('gift:default'));
  const [checked, setChecked] = useState(KAKAO);
  const [num, setNum] = useState(0);
  const [prevMsg, setPrevMsg] = useState('');
  const [contHeight, setContHeight] = useState(30);
  const msgRef = useRef();
  const [toastPending, setToastPending] = useState(false);
  const bgImages = useMemo(
    () => (promotion.gift.bg || []).filter((v) => v?.image),
    [promotion.gift.bg],
  );
  const imageUrl = useMemo(
    () => promotion?.gift?.imageUrl,
    [promotion?.gift?.imageUrl],
  );

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
          if (updateStatus) action.toast.push('toast:sendSuccess');
          setToastPending(false);
          navigation.goBack();
        },
        updateStatus ? 2000 : 4000,
      );
    },
    [account.token, action.order, action.toast, navigation],
  );

  const sendLink = useCallback(
    async (method: string, item: RkbSubscription) => {
      // 사용자에게 보낼 링크
      const giftId = await createLink(item);
      const webUrl = `${api.httpUrl(api.path.gift.web)}/${giftId}`;

      const body = `${i18n.t('gift:msgBody1')}${
        item.prodName
      }\n${webUrl}${i18n.t('gift:msgBody2')}  `;

      switch (method) {
        case MESSAGE: {
          SendSMS.send(
            {
              body,
              successTypes: ['sent', 'queued'],
            },
            (success, cancel, err) => {
              console.log(`SMS success:${success} cancel:${cancel} err:${err}`);
              if (success) {
                afterSend(item, true);
              }
            },
          );
          break;
        }
        default: // kakao
        {
          try {
            const response = await KakaoShareLink.sendCustom({
              templateId: 67017,
              templateArgs: [
                {
                  key: 'gift',
                  value: giftId,
                },
                {key: 'recommender', value: account?.userId},
                {key: 'item', value: item.uuid},
              ],
            });

            // kakao 앱 이동 성공
            if (response.result) {
              afterSend(item);
            }
          } catch (e) {
            console.error(e);
          }
          break;
        }
      }
    },
    [account?.userId, afterSend, createLink],
  );

  const info = useCallback(() => {
    return (
      <View>
        {Array.from({length: 6}, (_, i) => i + 1).map((v) => {
          return (
            <AppText key={`info${v}`} style={styles.info}>
              {i18n.t(`gift:info${v}`)}
            </AppText>
          );
        })}
      </View>
    );
  }, []);

  const method = useCallback(() => {
    return (
      <View>
        <View style={styles.method}>
          {[KAKAO, MESSAGE].map((v, idx) => {
            return (
              <AppButton
                key={v}
                title={i18n.t(`gift:${v}`)}
                titleStyle={[appStyles.bold16Text, {color: colors.warmGrey}]}
                checked={checked === v}
                checkedColor={colors.black}
                onPress={() => setChecked(v)}
                style={styles.kakao}
              />
            );
          })}
        </View>
        <AppText style={styles.methodInfo}>
          {i18n.t(`gift:${checked}Info`)}
        </AppText>
      </View>
    );
  }, [checked]);

  const cardDesign = useCallback(() => {
    return (
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
                if (contHeight <= 120) setMsg(txt);
              }}
              scrollEnabled={false}
              maxLength={80}
              defaultValue={msg}
              onContentSizeChange={({nativeEvent: {contentSize}}) => {
                const {height} = contentSize;
                setContHeight(height);
                if (height > 120) setMsg(prevMsg);
              }}
              onKeyPress={({nativeEvent: {key: keyValue}}) => {
                if (contHeight <= 120) setPrevMsg(msg);
                if (contHeight >= 120 && keyValue === 'Enter') setPrevMsg(msg);
              }}
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
              iconName="arrowRight"
              onPress={() => setNum(num + 1)}
            />
          )}
        </View>
      </ImageBackground>
    );
  }, [bgImages, contHeight, msg, num, prevMsg]);

  const {item} = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        {cardDesign()}
        <View style={{marginVertical: 25, marginHorizontal: 20}}>
          <AppText style={appStyles.bold16Text}>{item.prodName}</AppText>
        </View>
        <View style={styles.thickDivider} />
        <View style={{margin: 20, marginBottom: 30}}>
          <AppText style={appStyles.bold18Text}>
            {i18n.t('gift:method')}
          </AppText>
          {method()}
        </View>
        <View style={styles.infoBox}>
          <AppText style={appStyles.bold18Text}>{i18n.t('esim:info')}</AppText>
          <View style={styles.divider} />
          {info()}
        </View>
        <AppActivityIndicator visible={toastPending || pending} />
      </KeyboardAwareScrollView>
      <AppButton
        style={[appStyles.confirm]}
        title={i18n.t('esim:sendGift')}
        onPress={() => sendLink(checked, item)}
      />
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
      toast: bindActionCreators(toastActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
    },
  }),
)(GiftScreen);
