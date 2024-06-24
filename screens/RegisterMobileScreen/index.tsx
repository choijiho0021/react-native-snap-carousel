import _ from 'underscore';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  getTrackingStatus,
  TrackingStatus,
} from 'react-native-tracking-transparency';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-community/async-storage';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import InputMobile, {InputMobileRef} from '@/components/InputMobile';
import InputPinInTime, {InputPinRef} from '@/components/InputPinInTime';
import SocialLogin, {SocialAuthInfo} from '@/components/SocialLogin';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import i18n from '@/utils/i18n';
import validationUtil from '@/utils/validationUtil';
import {LinkModelState} from '@/redux/modules/link';
import ScreenHeader from '@/components/ScreenHeader';

const {isProduction, isIOS} = Env.get();

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    alignContent: 'stretch',
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  title: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    position: 'relative',
    paddingBottom: 217,
  },
  titleText: {
    ...appStyles.bold30Text,
    lineHeight: 36,
    letterSpacing: -0.6,
    color: colors.black,
  },
  mobileWithToolTip: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
  },
  mobileAuth: {
    marginTop: 12,
    ...appStyles.bold18Text,
    lineHeight: 22,
    color: colors.black,
  },
  tooltip: {
    display: 'flex',
    flexDirection: 'column',
  },
  tooltipBox: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.black92,
    borderRadius: 3,
  },
  tooltipText: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.white,
  },
  triangel: {
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 11,
    width: 11,
    marginLeft: 20,
    borderTopColor: colors.black92,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  row: {
    paddingtop: 40,
    paddingBottom: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyToolTip: {
    height: 47,
  },
});

type RegisterMobileScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'RegisterMobile'
>;

type RegisterMobileScreenRouteProp = RouteProp<
  HomeStackParamList,
  'RegisterMobile'
>;

type RegisterMobileScreenProps = {
  account: AccountModelState;
  link: LinkModelState;
  pending: boolean;

  navigation: RegisterMobileScreenNavigationProp;
  route: RegisterMobileScreenRouteProp;

  actions: {
    account: AccountAction;
  };
};

const RegisterMobileScreen: React.FC<RegisterMobileScreenProps> = ({
  account: {loggedIn, isNewUser},
  link,
  navigation,
  route,
  actions,
  pending,
}) => {
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState('');
  const [pinEditable, setPinEditable] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | undefined>();
  const [authNoti, setAuthNoti] = useState(false);
  const [timeoutFlag, setTimeoutFlag] = useState(false);
  const [isKeyboardShow, setIsKeyboardShow] = useState(false);
  const [status, setStatus] = useState<TrackingStatus>();
  const [recentNormal, setRecentNormal] = useState(false);
  const controller = useRef(new AbortController());
  const mounted = useRef(false);
  const mobileRef = useRef<InputMobileRef>(null);
  const inputRef = useRef<InputPinRef>(null);

  const recommender = useMemo(
    () => link?.params?.recommender,
    [link?.params?.recommender],
  );

  const referrer = useMemo(
    () => link?.params?.referrer,
    [link?.params?.referrer],
  );

  useEffect(() => {
    AsyncStorage.getItem('login.hist').then((v) => {
      if (v && v === 'normal') setRecentNormal(true);
    });
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      if (!isIOS) setIsKeyboardShow(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      if (!isIOS) setIsKeyboardShow(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    async function trackingStatus() {
      const st = await getTrackingStatus();
      setStatus(st);
    }

    trackingStatus();
    mounted.current = true;

    if (status === 'authorized' && recommender) {
      analytics().logEvent('esim_recommender');
    }
  }, [recommender, status]);

  useEffect(() => {
    if (loggedIn) {
      const {stack, screen, params, goBack} = route?.params || {};

      if (goBack) {
        navigation.goBack();
      } else if (stack && screen) {
        navigation.navigate(stack, {
          screen,
          initial: false,
          params,
        });
      } else if (!link.url && isNewUser) {
        navigation.navigate('Main', {
          screen: 'MyPageStack',
          params: {
            screen: 'MyPage',
          },
        });
      } else {
        navigation.navigate('Main');
      }
      setAuthorized(true);
    }
  }, [
    isNewUser,
    link.url,
    loggedIn,
    navigation,
    route?.params,
    route?.params?.rule,
  ]);

  useEffect(() => {
    const {current} = controller;

    return () => {
      mounted.current = false;
      current?.abort();
    };
  }, []);

  const initState = useCallback(() => {
    setLoading(false);
    setMobile('');
    setAuthorized(false);
    setAuthNoti(false);
    setTimeoutFlag(false);

    inputRef.current?.reset();
    mobileRef.current?.reset();
  }, []);

  const signIn = useCallback(
    (auth: {mobile?: string; pin?: string}) =>
      actions.account.logInAndGetAccount(auth),
    [actions.account],
  );

  const sendSms = useCallback(
    (value: string) => {
      setMobile(value);

      if (authorized) return;
      const error = validationUtil.validate('mobileSms', value);

      if (!_.isEmpty(error)) {
        AppAlert.error(
          i18n.t('reg:invalidTelephone'),
          i18n.t('reg:unableToSendSms'),
        );
      } else {
        setPinEditable(true);
        setAuthorized(undefined);
        setTimeoutFlag(true);

        API.User.sendSms({user: value, abortController: controller.current})
          .then((resp) => {
            if (resp.result === 0) {
              setAuthNoti(true);
              setTimeoutFlag(false);
              inputRef.current?.focus();
            } else {
              console.log('send sms failed', resp);
              throw new Error('failed to send sms');
            }
          })
          .catch((err) => {
            console.log('send sms failed', err);
            AppAlert.error(
              i18n.t('reg:failedToSendSms'),
              i18n.t('reg:unableToSendSms'),
            );
          });
      }
    },
    [authorized],
  );

  const onPressPin = useCallback(
    (value: string) => {
      // PIN이 맞는지 먼저 확인한다.
      Keyboard.dismiss();
      setLoading(true);

      API.User.confirmSmsCode({
        user: mobile,
        pass: value,
        abortController: controller.current,
      })
        .then((resp) => {
          if (mounted.current) {
            setLoading(false);
          }

          if (resp.result === 0 && mounted.current) {
            setAuthorized(_.isEmpty(resp.objects) ? true : undefined);
            if (!_.isEmpty(resp.objects)) {
              AsyncStorage.setItem('login.hist', 'normal');
              signIn({mobile, pin: value});
            } else {
              actions.account.updateAccount({isNewUser: true});
              navigation.navigate('Signup', {pin: value, status, mobile});
            }
          } else {
            console.log('sms confirmation failed', resp);
            throw new Error('failed to confirm sms');
          }
        })
        .catch((err) => {
          console.log('sms confirmation failed', err);

          if (!mounted.current) return;

          setAuthorized(false);
        });
    },
    [actions.account, mobile, navigation, signIn, status],
  );

  const onAuth = useCallback(
    async ({
      authorized: isAuthorized,
      user,
      pass,
      email,
      mobile: authMobile,
      token,
      profileImageUrl,
      kind,
    }: SocialAuthInfo) => {
      setLoading(true);

      const resp = await API.User.socialLogin({
        user,
        pass,
        kind,
        token,
        mobile: authMobile,
      });

      setLoading(false);

      if (resp.result === 0) {
        const {mobile: drupalId, newUser: isNew} = resp.objects[0];

        setMobile(drupalId);
        setAuthorized(isAuthorized);

        if (isNew) {
          // new login
          // create account
          navigation.navigate('Signup', {
            kind,
            profileImageUrl,
            pin: pass,
            status,
            mobile: drupalId,
            email,
          });
        } else {
          // account exist. try login
          AsyncStorage.setItem('login.hist', kind);
          signIn({mobile: drupalId, pin: pass});
        }
      }
    },
    [navigation, signIn, status],
  );

  const editablePin = !!mobile && authNoti && !authorized && !loading;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        backHandler={() => {
          initState();
          navigation.goBack();
        }}
      />
      <KeyboardAwareScrollView
        enableOnAndroid
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flexGrow: 1}}
        style={{flex: 1}}>
        <View style={styles.title}>
          <View style={styles.row}>
            <AppText style={styles.titleText}>{i18n.t('mobile:title')}</AppText>
            <AppIcon name="earth" />
          </View>
          <View style={styles.mobileWithToolTip}>
            <AppText style={styles.mobileAuth}>
              {i18n.t('mobile:easyLogin')}
            </AppText>
            {recentNormal && !referrer ? (
              <View style={styles.tooltip}>
                <View style={styles.tooltipBox}>
                  <AppText style={styles.tooltipText}>
                    {i18n.t('socialLogin:hist')}
                  </AppText>
                </View>
                <View style={styles.triangel} />
              </View>
            ) : (
              <View style={styles.emptyToolTip} />
            )}
          </View>

          <InputMobile
            onPress={sendSms}
            authNoti={authNoti}
            disabled={(authNoti && authorized) || loading}
            authorized={authorized}
            inputRef={mobileRef}
            marginTop={3}
          />
          <InputPinInTime
            style={{marginTop: 8, flex: 1}}
            clickable={editablePin || !isProduction}
            editable={pinEditable}
            authorized={mobile ? authorized : undefined}
            countdown={authNoti && !authorized && !timeoutFlag}
            onTimeout={() => setTimeoutFlag(true)}
            onPress={onPressPin}
            duration={180}
            inputRef={inputRef}
            referrer={referrer}
          />
        </View>
        {!isKeyboardShow && <SocialLogin onAuth={onAuth} referrer={referrer} />}
      </KeyboardAwareScrollView>
      <AppActivityIndicator visible={pending || loading} />
    </SafeAreaView>
  );
};

export default connect(
  ({account, link, status}: RootState) => ({
    account,
    link,
    pending:
      status.pending[accountActions.logInAndGetAccount.typePrefix] || false,
  }),
  (dispatch) => ({
    actions: {
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(RegisterMobileScreen);
