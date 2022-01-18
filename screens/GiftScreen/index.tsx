import {
  AppState,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {bindActionCreators} from 'redux';
import * as reactRedux from 'react-redux';
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
import api from '@/redux/api/api';
import {AccountModelState} from '@/redux/modules/account';
import {
  actions as promotionActions,
  PromotionAction,
  PromotionModelState,
} from '@/redux/modules/promotion';
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import i18n from '@/utils/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  // 여기부터
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

const GiftScreen: React.FC<GiftScreenProps> = ({
  navigation,
  route,
  promotion,
  account,
  pending,
  action,
}) => {
  const [msg, setMsg] = useState(i18n.t('gift:default'));
  const [num, setNum] = useState(0);
  const [prevMsg, setPrevMsg] = useState('');
  const [contHeight, setContHeight] = useState(30);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
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
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [account.userId, route.params.item.prodId]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('gift:title')} />,
    });
  }, [navigation]);

  const sendLink = useCallback(async () => {
    const {item} = route.params;
    if (!account?.userId) return;

    const link = await API.Promotion.buildLink(
      account.userId,
      promotion.stat.signupGift,
      imageUrl,
      item.uuid, // subscription Id
    );

    // gift content 생성
    const contRes = await API.Promotion.createContent({
      msg,
      nid: item?.nid,
      image: bgImages[num].title,
      token: account.token,
      link,
    });

    const webUrl = `${api.httpUrl(api.path.gift.web)}/${
      contRes.objects[0].uuid
    }`;

    API.Promotion.sendGift(webUrl, imageUrl).then((res) => {
      if (res) {
        setToastPending(true);
        action.order.updateSubsGiftStatus({
          uuid: item.uuid,
          giftStatus: 'S',
          token: account.token,
        });
        action.toast.push('toast:sendSuccess');
        setTimeout(() => {
          setToastPending(false);
          navigation.goBack();
        }, 2000);
      }
    });
  }, [
    account,
    action,
    bgImages,
    imageUrl,
    msg,
    navigation,
    num,
    promotion.stat.signupGift,
    route.params,
  ]);

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
          <View style={[styles.msgBox]}>
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
        <View style={{marginVertical: 30, marginHorizontal: 20}}>
          <AppText style={appStyles.bold18Text}>
            {i18n.t('gift:giftInfo')}
          </AppText>
          <AppText style={[appStyles.normal16Text, {marginTop: 20}]}>
            {item.prodName}
          </AppText>
        </View>
        <View style={styles.infoBox}>
          <AppText style={appStyles.bold18Text}>{i18n.t('esim:info')}</AppText>
          <View style={styles.divider} />
          {info()}
        </View>
        <AppActivityIndicator visible={toastPending} />
      </KeyboardAwareScrollView>
      <AppButton
        style={[appStyles.confirm]}
        title={i18n.t('esim:sendGift')}
        onPress={sendLink}
      />
    </SafeAreaView>
  );
};

export default reactRedux.connect(
  ({account, promotion}: RootState) => ({
    account,
    promotion,
  }),
  (dispatch) => ({
    action: {
      promotion: bindActionCreators(promotionActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
    },
  }),
)(GiftScreen);
