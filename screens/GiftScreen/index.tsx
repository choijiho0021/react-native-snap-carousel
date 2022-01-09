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
import i18n from '@/utils/i18n';

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
  const [checked, setChecked] = useState('kakao');
  const [msg, setMsg] = useState('');
  const [num, setNum] = useState(0);
  const [prevMsg, setPrevMsg] = useState('');
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const msgRef = useRef();
  const [toastPending, setToastPending] = useState(false);
  const bgImages = useMemo(
    () => (promotion.gift.bg || []).filter((v) => v?.image),
    [promotion.gift.bg],
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

  const sendLink = useCallback(
    async (method: string) => {
      const {item} = route.params;
      const imageUrl =
        'http://tb-esim.rokebi.com/sites/default/files/giftImage.png';

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

      const res = await API.Promotion.sendGift(webUrl, imageUrl);

      if (res) {
        setToastPending(true);
        action.toast.push('toast:sendSuccess');

        setTimeout(() => {
          setToastPending(false);
          navigation.goBack();
        }, 2000);
      }
    },
    [
      account,
      action.toast,
      bgImages,
      msg,
      navigation,
      num,
      promotion.stat.signupGift,
      route.params,
    ],
  );

  const method = useCallback(() => {
    return (
      <View>
        <View style={{marginVertical: 20, flexDirection: 'row', flex: 1}}>
          {['kakao', 'message'].map((v, idx) => {
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
        <AppText
          style={{
            ...appStyles.normal12Text,
            textAlign: 'left',
            color: colors.warmGrey,
            lineHeight: 18,
          }}>
          {i18n.t(`gift:${checked}Info`)}
        </AppText>
      </View>
    );
  }, [checked]);

  const onContentSizeChange = useCallback(
    (e) => {
      if (e?.nativeEvent?.contentSize?.height <= 120) {
        setPrevMsg(msg);
      }
      if (e?.nativeEvent?.contentSize?.height > 120 && msgRef?.current) {
        const msgArr = msg.split('\n').slice(0, 4);
        let text = '';
        if (msg.split('\n').length > 4) {
          text = msgArr.reduce((arr, cur, idx) => {
            if (idx !== 3 || cur !== '\n') return `${arr}${cur}\n`;
            return `${arr}${cur}`;
          }, '');
        } else text = msg.length < prevMsg.length ? msg : prevMsg;

        setMsg(text);
        msgRef.current.setNativeProps({
          maxHeight: 120,
          text,
          textAlign: 'center',
        });
      }
    },
    [msg, prevMsg],
  );

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
              onChangeText={(txt) => setMsg(txt)}
              scrollEnabled={false}
              maxLength={80}
              onContentSizeChange={(e) => onContentSizeChange(e)}
              style={styles.msg}
            />
            <AppText style={styles.msgLength}>
              {`${msg.length} ${i18n.t('gift:maxLength')}`}
            </AppText>
          </View>

          {num > 0 && (
            <AppButton
              style={[{position: 'absolute', bottom: 116, left: 30}]}
              iconName="arrowLeft"
              onPress={() => setNum(num - 1)}
            />
          )}
          {num < bgImages.length - 1 && (
            <AppButton
              style={[{position: 'absolute', bottom: 116, right: 30}]}
              iconName="arrowRight"
              onPress={() => setNum(num + 1)}
            />
          )}
        </View>
      </ImageBackground>
    );
  }, [bgImages, msg.length, num, onContentSizeChange]);

  const {item} = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        {cardDesign()}
        <AppText
          style={[
            appStyles.bold16Text,
            {marginVertical: 25, marginHorizontal: 20},
          ]}>
          {item.prodName}
        </AppText>
        <View style={{height: 10, backgroundColor: colors.whiteTwo}} />
        <View style={{margin: 20, marginBottom: 30}}>
          <AppText style={appStyles.bold18Text}>
            {i18n.t('esim:method')}
          </AppText>
          {method()}
        </View>
        <AppActivityIndicator visible={toastPending} />
      </KeyboardAwareScrollView>
      <AppButton
        style={[appStyles.confirm]}
        title={i18n.t('esim:sendGift')}
        onPress={() => sendLink(checked)}
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
    },
  }),
)(GiftScreen);
