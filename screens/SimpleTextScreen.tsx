import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  Linking,
  Platform,
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
  actions as productActions,
  ProductAction,
} from '@/redux/modules/product';
import {
  actions as infoActions,
  InfoAction,
  InfoModelState,
} from '@/redux/modules/info';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import i18n from '@/utils/i18n';
import AppAlert from '@/components/AppAlert';
import {parseJson} from '@/utils/utils';
import AppModalContent from '@/components/ModalContent/AppModalContent';
import BackbuttonHandler from '@/components/BackbuttonHandler';

const {scheme, apiUrl} = Env.get();
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },

  buttonBox: {
    flexDirection: 'row',
  },

  btnClose: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.lightGrey,
  },
  btnDonate: {
    flex: 1,
    height: 52,
    backgroundColor: colors.clearBlue,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    marginTop: 24,
    // marginHorizontal: 10,
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
  divider: {
    borderBottomWidth: 1,
    margin: 16,
    marginBottom: 0,
    borderBottomColor: colors.lightGrey,
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
    product: ProductAction;
    modal: ModalAction;
  };
};

const SimpleTextScreen: React.FC<SimpleTextScreenProps> = (props) => {
  const {
    navigation,
    route: {
      params: {
        rule,
        mode = 'html',
        text,
        bodyTitle = '',
        key,
        image,
        showIcon,
        showCloseModal,
        btnStyle,
        notiType = 'noti',
        created,
      } = {},
    },
    info: {infoMap},
    account: {iccid, token, loggedIn},
    eventStatus,
    isProdEvent,
    pending,
    action,
  } = props;

  const [body, setBody] = useState('');
  // const [bodyTitle, setBodyTitle] = useState('');
  const [infoMapKey, setInfoMapKey] = useState('');
  const [loading, setLoading] = useState(false);
  // const [mode, setMode] = useState<SimpleTextScreenMode>('html');
  const [promoResult, setPromoResult] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);

  BackbuttonHandler({
    navigation,
    onBack: () => {
      navigation.goBack();
      return true;
    },
  });

  useEffect(() => {
    if (infoMap) setBody(infoMap.get(infoMapKey, [])[0]?.body || '');
  }, [infoMap, infoMapKey]);

  const onMessage = useCallback(
    ({nativeEvent: {data}}) => {
      const cmd = parseJson(data);
      let partnerList: string[] = [];
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
        case 'openLink':
          if (cmd.value) {
            Linking.openURL(cmd.value);
          }
          break;
        case 'moveToCountry':
          if (cmd.ios && Platform.OS === 'ios')
            partnerList = cmd.ios.split(',');
          else if (cmd.aos && Platform.OS === 'android')
            partnerList = cmd.aos.split(',');
          else if (cmd.value) partnerList = cmd.value.split(',');

          if (cmd.value || cmd.ios || cmd.aos) {
            action.product.getProdOfPartner(partnerList);
            navigation.navigate('Country', {
              partner: partnerList,
              type: cmd.type,
              volume: cmd.volume,
              scroll: cmd.scroll,
            });
          }

          break;
        case 'moveToEvent':
          if (!loggedIn) {
            action.modal.renderModal(() => (
              <AppModalContent
                title={i18n.t('event:login')}
                type="normal"
                onOkClose={() => {
                  navigation.navigate('Auth', {
                    screen: 'RegisterMobile',
                  });
                  action.modal.closeModal();
                }}
                onCancelClose={() => {
                  action.modal.closeModal();
                }}
              />
            ));
          } else {
            navigation.navigate('EventBoard', {index: 0, nid: cmd.value});
          }
          break;
        default:
          console.log('@@@ on message', cmd);
          break;
      }
    },
    [action.info, action.modal, action.product, loggedIn, navigation],
  );

  const onPress = useCallback(async () => {
    if (
      rule &&
      isProdEvent &&
      (eventStatus === 'open' || eventStatus === 'unknown')
    ) {
      if (!loggedIn) {
        // 로그인 화면으로 이동
        navigation.navigate('Auth', {
          screen: 'RegisterMobile',
          params: rule?.skuNavigate,
        });
      } else if (rule?.sku.includes('event')) {
        navigation.navigate('EventBoard', {
          index: 0,
          nid: rule?.sku.split('-')[1],
        });
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
    } else if (rule?.navigate?.startsWith('http')) {
      Linking.openURL(rule.openLink);
    } else {
      navigation.goBack();
    }
  }, [eventStatus, iccid, isProdEvent, loggedIn, navigation, rule, token]);

  const getContent = useCallback(
    ({
      key: contentKey,
      bodyTitle: title,
    }: {
      key: string;
      bodyTitle?: string;
    }) => {
      const infoKey = contentKey === 'noti' && title ? title : contentKey;
      setInfoMapKey(infoKey);
      if (infoMap.has(infoKey)) {
        setBody(infoMap.get(infoMapKey, [])[0]?.body || '');
      } else if (contentKey === 'noti' && title) {
        action.info.getInfoByTitle(infoMapKey);
      } else {
        action.info.getInfoList(infoMapKey);
      }
    },
    [action.info, infoMap, infoMapKey],
  );

  const getIds = useCallback((input: string) => {
    const parts = input.split('/');
    const idsString = parts[1];
    return idsString.split(',').map((id: string) => parseInt(id, 10));
  }, []);

  const defineSource = useCallback(
    (m: SimpleTextScreenMode) => {
      if (m === 'text')
        return (
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
              {bodyTitle && (
                <AppText style={styles.bodyTitle}>
                  {`${bodyTitle}\n\n`}m
                </AppText>
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
            onLoadEnd={({nativeEvent: {loading: webViewLoading}}) =>
              setLoading(webViewLoading)
            }
          />
        );

      return (
        <WebView
          style={styles.container}
          containerStyle={mode === 'page' ? {marginHorizontal: 10} : undefined}
          originWhitelist={['*']}
          onMessage={onMessage}
          source={{
            html: htmlDetailWithCss(body),
            baseUrl: `${scheme}://${apiUrl}`,
          }}
          onLoadEnd={({nativeEvent: {loading: webViewLoading}}) =>
            setLoading(webViewLoading)
          }
        />
      );
    },
    [body, bodyTitle, mode, onMessage],
  );

  useEffect(() => {
    setLoading(mode !== 'text');
  }, [mode, navigation]);

  useEffect(() => {
    if (text) {
      setBody(text);
      // setBodyTitle(bodyTitle || '');
    } else if (key) {
      getContent({key, bodyTitle});
    } else {
      setBody(i18n.t('err:body'));
    }
  }, [bodyTitle, getContent, key, text]);

  const title = useMemo(() => {
    if (props?.route?.params?.title) {
      return props?.route?.params?.title;
    }

    if (isProdEvent) {
      return i18n.t(loggedIn ? `promo:join:${eventStatus}` : 'promo:login');
    }

    return 'ok';
  }, [eventStatus, isProdEvent, loggedIn, props?.route?.params?.title]);

  const disabled =
    ['joined', 'invalid'].includes(eventStatus) ||
    ['promo:join:ing', 'promo:join:fail'].includes(promoResult);

  const donate = useCallback(() => {
    API.Account.donateCash({
      iccid,
      token,
      ids: getIds(notiType),
    }).then((resp) => {
      setBtnDisabled(true);

      if (resp.result === 0) {
        const isDonated = resp?.objects?.total === 0;

        action.account.getAccount({
          iccid,
          token,
        });

        AppAlert.info(
          i18n.t(isDonated ? 'promo:donate:already' : 'promo:donate:success'),
          '',
          () => {
            if (!isDonated) {
              navigation.popToTop();
              navigation.navigate('MyPageStack', {
                screen: 'CashHistory',
                initial: false,
              });
            }
          },
        );
      } else {
        AppAlert.info(i18n.t('promo:donate:fail'));
      }
    });
  }, [action.account, getIds, iccid, navigation, notiType, token]);

  const renderContentTitle = useCallback(() => {
    return (
      <>
        <View
          style={{
            marginHorizontal: 20,
            gap: 8,
            marginTop: 24,
          }}>
          <AppText style={appStyles.bold24Text}>{bodyTitle}</AppText>
          <AppText
            style={[
              appStyles.semiBold14Text,
              {color: colors.warmGrey, lineHeight: 22},
            ]}>
            {created?.format('MM월 DD일')}
          </AppText>
        </View>
        <View style={styles.divider} />
      </>
    );
  }, [bodyTitle, created]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={appStyles.header}>
        <AppBackButton
          title={title}
          showIcon={showIcon}
          showCloseModal={showCloseModal}
        />
      </View>
      {renderContentTitle()}
      {defineSource(mode)}
      <AppActivityIndicator visible={pending || loading} />
      {!rule?.sku?.startsWith('event-multi') &&
        (notiType.startsWith('dona') ? (
          <View style={styles.buttonBox}>
            <AppButton
              style={styles.btnClose}
              titleStyle={appStyles.medium18}
              title={i18n.t('close')}
              onPress={() => navigation.goBack()}
            />
            <AppButton
              style={styles.btnDonate}
              title={i18n.t('promo:donate')}
              disabled={btnDisabled}
              onPress={() => {
                donate();
              }}
            />
          </View>
        ) : (
          <AppButton
            style={[styles.button, btnStyle]}
            type="primary"
            title={
              rule?.btnTitle
                ? rule?.btnTitle
                : isProdEvent
                ? title
                : i18n.t('ok')
            }
            disabled={disabled}
            onPress={onPress}
          />
        ))}

      <AppModal
        type="close"
        visible={!!promoResult && promoResult !== 'promo:join:ing'}
        // children과 wrapper view 사이에 padding 간격이 있는데, 찾을 수 없어서 padding:5를 적용하여 layour을 맞춤
        contentStyle={{
          marginHorizontal: (width - 333) / 2,
        }}
        okButtonTitle={i18n.t(
          promoResult === 'promo:join:joined' ? 'redirect' : 'close',
        )}
        buttonBackgroundColor={colors.white}
        buttonTitleColor={colors.black}
        onOkClose={() => {
          setPromoResult('');
          if (promoResult === 'promo:join:joined') {
            const sku = rule?.sku;
            if (sku?.startsWith('rch-') || sku?.startsWith('pnt-')) {
              action.account.getAccount({iccid, token});
              // go to MyPage after recharge & point promotion
              navigation.navigate('MyPageStack', {
                screen: 'MyPage',
              });
            } else if (sku?.startsWith('cpn-')) {
              if (props?.account?.loggedIn) {
                navigation.navigate('Coupon');
              } else {
                navigation.navigate('RegisterMobile', {});
              }
            } else {
              navigation.navigate('EsimStack', {
                screen: 'Esim',
                params: {
                  actionStr: 'reload',
                },
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
          if (!props?.account?.loggedIn) {
            setEventStatus('unknown');
          } else if (rule?.sku.includes('event')) {
            setEventStatus('open');
          } else {
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
        }
      };
      getPromo();
    }, [props?.account?.loggedIn, props.route.params]),
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
      product: bindActionCreators(productActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(memo(SimpleTextScreen0));
