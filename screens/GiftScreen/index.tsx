import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import AppTextInput from '@/components/AppTextInput';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {AccountModelState} from '@/redux/modules/account';
import {
  actions as promotionActions,
  PromotionAction,
  PromotionModelState,
} from '@/redux/modules/promotion';
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import i18n from '@/utils/i18n';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  AppState,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

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

type GiftScreenState = {
  checked: string;
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
  const [num, setNum] = useState(0);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const bgImages = useMemo(
    () => (promotion.giftImages || []).filter((v) => v?.image),
    [promotion.giftImages],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        API.Promotion.sendCheck(route.params.item.prodId, account.userId);
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

  // const kakaoCallback = (err?: Error, res?: SendResultType) => {
  //   console.log('@@ kakao callback', err, res);
  // };

  const sendLink = useCallback(
    async (method: string) => {
      const {item} = route.params;

      switch (method) {
        case 'message': {
          //     // sms 보내기 check 하는 module 추가
          //     SendSMS.send(
          //       {
          //         body: 'The default body of the SMS!',
          //         // recipients: ['0123456789', '9876543210'],
          //         successTypes: ['sent', 'queued'],
          //         // allowAndroidSendWithoutReadPermission: true
          //       },
          //       (completed, cancelled, error) => {
          //         console.log(
          //           `SMS Callback: completed: ${completed} cancelled: ${cancelled}error: ${error}`,
          //         );
          //       },
          //     );

          break;
        }
        default: // kakao

        {
          // KakaoSDK.Link.sendFeed({
          //   content: {
          //     title: '디저트 사진',
          //     desc: '아메리카노, 빵, 케익',
          //     imageURL:
          //       'http://mud-kage.kakao.co.kr/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg',
          //     link: {
          //       webURL: 'https://developers.kakao.com',
          //       mobileWebURL: 'https://developers.kakao.com',
          //     },
          //   },
          //   social: {
          //     likeCount: 10,
          //     commentCount: 20,
          //     sharedCount: 30,
          //     viewCount: 40,
          //   },
          //   buttons: [
          //     {
          //       title: '앱에서 보기',
          //       webURL: 'https://developers.kakao.com',
          //       mobileWebURL: 'https://developers.kakao.com',
          //       androidExecutionParams: 'key1=value1',
          //       iosExecutionParams: 'key1=value1',
          //     },
          //   ],
          //   // serverCallbackArgs: {

          //   // }
          // })
          //   .then((r) => console.log('success', r))
          //   .catch((e) => console.log(e));

          break;
        }
      }
    },
    [account.userId, route.params],
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

  const cardDesign = useCallback(() => {
    console.log('@@@ r num', num);
    return (
      <ImageBackground
        style={{
          width: '100%',
          height: 420,
          // height: '100%',
          // width: '100%',
          // flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
        imageStyle={{aspectRatio: 375 / 420}}
        source={{
          uri: API.default.httpImageUrl(bgImages[num]?.image).toString(),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
          }}>
          <View
            style={{
              flex: 1,
              height: 217,
              margin: 20,
              paddingTop: 50,
              paddingHorizontal: 40,
              // backgroundColor: colors.clearBlue,
            }}>
            <AppTextInput
              multiline
              numberOfLines={3}
              scrollEnabled={false}
              // maxHeight={150}
              style={{
                ...appStyles.normal16Text,
                lineHeight: 30,
                textAlign: 'center',
                textAlignVertical: 'center',
                // height: 120,
                // backgroundColor: colors.clearBlue,
              }}
            />
            <AppText
              style={{marginBottom: 15, marginTop: 10, textAlign: 'center'}}>
              / 최대 80 자
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
  }, [bgImages, num]);

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
          <AppText style={appStyles.bold18Text}>전송수단</AppText>
          {method()}
        </View>
      </KeyboardAwareScrollView>
      <AppButton
        style={[appStyles.confirm]}
        title="선물하기"
        onPress={() => sendLink(checked)}
      />
    </SafeAreaView>
  );
};

export default connect(
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
