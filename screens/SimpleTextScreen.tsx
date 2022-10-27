import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppModal from '@/components/AppModal';
import AppText from '@/components/AppText';
import AppUserPic from '@/components/AppUserPic';
import {colors} from '@/constants/Colors';
import {appStyles, htmlDetailWithCss} from '@/constants/Styles';
import Env from '@/environment';
import {
  HomeStackParamList,
  SimpleTextScreenMode,
} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import utils from '@/redux/api/utils';
import {
  AccountModelState,
  AccountAction,
  actions as accountActions,
} from '@/redux/modules/account';
import {
  actions as infoActions,
  InfoAction,
  InfoModelState,
} from '@/redux/modules/info';
import i18n from '@/utils/i18n';
import AppAlert from '@/components/AppAlert';
import {parseJson} from '@/utils/utils';

const {scheme, apiUrl} = Env.get();
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.whiteTwo,
  },
  text: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
  },
  bodyTitle: {
    ...appStyles.normal16Text,
    color: colors.black,
  },
  button: {
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: '#ffffff',
  },
});

type SimpleTextScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'SimpleText'
>;

type SimpleTextScreenRouteProp = RouteProp<HomeStackParamList, 'SimpleText'>;

type EventStatus = 'open' | 'closed' | 'joined' | 'invalid' | 'unknown';

type SimpleTextScreenProps = {
  navigation: SimpleTextScreenNavigationProp;
  route: SimpleTextScreenRouteProp;
  info: InfoModelState;
  account: AccountModelState;
  eventStatus: EventStatus;
  isProdEvent: boolean;

  pending: boolean;

  action: {
    info: InfoAction;
    account: AccountAction;
  };
};

const SimpleTextScreen: React.FC<SimpleTextScreenProps> = (props) => {
  const {
    navigation,
    route,
    info,
    account,
    eventStatus,
    isProdEvent,
    pending,
    action,
  } = props;

  const [body, setBody] = useState('');
  const [bodyTitle, setBodyTitle] = useState('');
  const [infoMapKey, setInfoMapKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<SimpleTextScreenMode>('html');
  const [promoResult, setPromoResult] = useState('');

  useEffect(() => {
    if (info.infoMap) setBody(info.infoMap.get(infoMapKey, [])[0]?.body || '');
  }, [info.infoMap, infoMapKey]);

  const onMessage = useCallback(
    ({nativeEvent: {data}}) => {
      const cmd = parseJson(data);

      switch (cmd.key) {
        // uuid를 받아서 해당 페이지로 이동 추가
        case 'moveToPage':
          if (cmd.value) {
            action.info.getItem(cmd.value).then(({payload: item}) => {
              if (item?.title && item?.body) {
                navigation.navigate('SimpleText', {
                  key: 'noti',
                  title: i18n.t('set:noti'),
                  bodyTitle: item?.title,
                  body: item?.body,
                  mode: 'html',
                });
              } else {
                AppAlert.error(i18n.t('info:init:err'));
              }
            });
          }
          break;
        // Faq로 이동
        case 'moveToFaq':
          if (cmd.value) {
            const moveTo = cmd.value.split('/');
            navigation.navigate('Faq', {
              key: moveTo[0],
              num: moveTo[1],
            });
          }
          break;
        default:
      }
    },
    [action.info, navigation],
  );

  const onPress = useCallback(async () => {
    const {rule} = route.params;
    const {iccid, token, loggedIn} = account;

    if (rule && isProdEvent && eventStatus === 'open') {
      if (!loggedIn) {
        // 로그인 화면으로 이동
        navigation.navigate('Auth');
      } else {
        setPromoResult('promo:join:ing');
        const resp = await API.Promotion.join({rule, iccid, token});
        setPromoResult(
          resp.result === 0 &&
            resp.objects[0]?.hold === 0 &&
            resp.objects[0]?.available > 0
            ? 'promo:join:joined'
            : 'promo:join:fail',
        );
      }
    } else if (eventStatus === 'unknown' && !loggedIn) {
      // 로그인 화면으로 이동
      navigation.navigate('Auth');
    } else {
      navigation.goBack();
    }
  }, [account, eventStatus, isProdEvent, navigation, route.params]);

  const getContent = useCallback(
    ({key, bodyTitle}: {key: string; bodyTitle?: string}) => {
      const {infoMap} = info;
      const infoKey = key === 'noti' && bodyTitle ? bodyTitle : key;
      setInfoMapKey(infoKey);
      if (infoMap.has(infoKey)) {
        setBody(infoMap.get(infoMapKey, [])[0]?.body || '');
      } else if (key === 'noti' && bodyTitle) {
        action.info.getInfoByTitle(infoMapKey);
      } else {
        action.info.getInfoList(infoMapKey);
      }
    },
    [action.info, info, infoMapKey],
  );

  const defineSource = useCallback(
    (m: SimpleTextScreenMode) => {
      if (m === 'text')
        return (
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
              {bodyTitle && (
                <AppText style={styles.bodyTitle}>{`${bodyTitle}\n\n`}</AppText>
              )}
              <AppText style={styles.text}>{utils.htmlToString(body)}</AppText>
            </View>
          </ScrollView>
        );

      if (m === 'uri')
        return (
          <WebView
            source={{uri: body}}
            style={styles.container}
            onMessage={onMessage}
            onLoadEnd={({nativeEvent: {loading}}) => setLoading(loading)}
          />
        );

      return (
        <WebView
          style={styles.container}
          originWhitelist={['*']}
          onMessage={onMessage}
          source={{
            html: htmlDetailWithCss(body),
            baseUrl: `${scheme}://${apiUrl}`,
          }}
          onLoadEnd={({nativeEvent: {loading}}) => setLoading(loading)}
        />
      );
    },
    [body, bodyTitle, onMessage],
  );

  useEffect(() => {
    const {params} = route;

    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={params?.title} />,
    });

    if (params.mode) setMode(params.mode);
    setLoading(params.mode !== 'text');
  }, [navigation, route]);

  useEffect(() => {
    const {key, text: body, bodyTitle = ''} = route.params || {};
    if (body) {
      setBody(body);
      setBodyTitle(bodyTitle);
    } else if (key) {
      getContent({key, bodyTitle});
    } else {
      setBody(i18n.t('err:body'));
    }
  }, [getContent, route.params]);

  const {loggedIn, iccid, token} = account;
  const {image} = route.params;
  const title = useMemo(() => {
    if (isProdEvent) {
      return loggedIn ? `promo:join:${eventStatus}` : 'promo:login';
    }
    return 'ok';
  }, [eventStatus, isProdEvent, loggedIn]);

  return (
    <SafeAreaView style={styles.screen}>
      {defineSource(mode)}
      <AppActivityIndicator visible={pending || loading} />
      <AppButton
        style={styles.button}
        type="primary"
        title={i18n.t(title)}
        disabled={eventStatus === 'joined' || promoResult === 'promo:join:ing'}
        onPress={onPress}
      />
      <AppModal
        type="close"
        visible={!!promoResult && promoResult !== 'promo:join:ing'}
        // children과 wrapper view 사이에 padding 간격이 있는데, 찾을 수 없어서 padding:5를 적용하여 layour을 맞춤
        contentStyle={{
          marginHorizontal: (width - 333) / 2,
        }}
        closeButtonTitle={i18n.t(
          promoResult === 'promo:join:joined' ? 'redirect' : 'close',
        )}
        buttonBackgroundColor={colors.white}
        buttonTitleColor={colors.black}
        onOkClose={() => {
          setPromoResult('');
          if (promoResult === 'promo:join:joined') {
            const sku = route.params?.rule?.sku;
            if (sku?.startsWith('rch-') || sku?.startsWith('pnt-')) {
              action.account.getAccount({iccid, token});
              // go to MyPage after recharge & point promotion
              navigation.navigate('MyPageStack', {
                screen: 'MyPage',
              });
            } else {
              navigation.navigate('EsimStack', {
                screen: 'Esim',
              });
            }
          } else navigation.goBack();
        }}>
        <AppUserPic
          url={
            promoResult === 'promo:join:joined'
              ? image?.success
              : image?.failure
          }
          style={{width: 333, height: 444}}
        />
      </AppModal>
    </SafeAreaView>
  );
};

const SimpleTextScreen0 = (props: SimpleTextScreenProps) => {
  const [eventStatus, setEventStatus] = useState<EventStatus>('closed');
  const [isProdEvent, setIsProdEvent] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const getPromo = async () => {
        const {nid, rule} = props.route.params;
        if (rule?.sku) {
          setIsProdEvent(true);
          const resp = await API.Promotion.check(nid);
          // available 값이 0보다 크면 프로모션 참여 가능하다.
          if (resp.result === 0) {
            if (resp.objects[0]?.hold > 0) setEventStatus('joined');
            else if (resp.objects[0]?.available > 0) setEventStatus('open');
            else setEventStatus('closed');
          } else {
            setEventStatus(resp.status === 403 ? 'unknown' : 'invalid');
          }
        }
      };
      getPromo();
    }, [props.route.params]),
  );

  return (
    <SimpleTextScreen
      {...props}
      eventStatus={eventStatus}
      isProdEvent={isProdEvent}
    />
  );
};

// export default SimpleTextScreen;
export default connect(
  ({info, account, status}: RootState) => ({
    info,
    account,
    pending:
      status.pending[infoActions.getInfoList.typePrefix] ||
      status.pending[infoActions.getInfoByTitle.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      info: bindActionCreators(infoActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(memo(SimpleTextScreen0));
