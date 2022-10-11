import _ from 'underscore';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  getTrackingStatus,
  TrackingStatus,
} from 'react-native-tracking-transparency';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Settings} from 'react-native-fbsdk-next';
import {
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Map as ImmutableMap} from 'immutable';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import analytics, {firebase} from '@react-native-firebase/analytics';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import InputEmail, {InputEmailRef} from '@/components/InputEmail';
import InputMobile, {InputMobileRef} from '@/components/InputMobile';
import InputPinInTime, {InputPinRef} from '@/components/InputPinInTime';
import Profile from '@/components/Profile';
import SocialLogin, {SocialAuthInfo} from '@/components/SocialLogin';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {RkbImage} from '@/redux/api/accountApi';
import {ApiResult} from '@/redux/api/api';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';
import validationUtil from '@/utils/validationUtil';
import {eventToken} from '@/constants/Adjust';
import {LinkModelState} from '../redux/modules/link';

const {esimGlobal, isProduction, isIOS} = Env.get();
// const esimGlobal = false;

const styles = StyleSheet.create({
  helpText: {
    ...appStyles.normal14Text,
    color: colors.clearBlue,
    marginTop: 13,
    marginLeft: 30,
  },
  title: {
    ...appStyles.bold30Text,
    paddingHorizontal: 20,
    paddingTop: 50,
    lineHeight: 40,
  },
  mobileAuth: {
    ...appStyles.h1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  confirmList: {
    flexDirection: 'row',
    height: 46,
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 0.5,
    paddingHorizontal: 20,
  },
  confirm: {
    width: '100%',
    height: 52,
    backgroundColor: colors.clearBlue,
    justifyContent: 'flex-end',
  },
  divider: {
    marginTop: 30,
    width: '100%',
    height: 10,
    backgroundColor: '#f5f5f5',
  },
  field: {
    width: '100%',
  },
  button: {
    width: '70%',
  },
  text: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    color: colors.white,
  },
  container: {
    paddingTop: 20,
    flex: 1,
    alignContent: 'stretch',
    flexDirection: 'column',
    backgroundColor: colors.white,
  },
  smsButtonText: {
    ...appStyles.normal14Text,
    textAlign: 'center',
    color: colors.white,
  },
  inputStyle: {
    flex: 1,
    marginRight: 10,
    paddingBottom: 9,
  },
  emptyInput: {
    borderBottomColor: colors.lightGrey,
  },
  confirmItem: {
    ...appStyles.normal14Text,
    textAlignVertical: 'bottom',
    lineHeight: 19,
  },
  rowStyle: {
    flexDirection: 'row',
    flex: 1,
  },
  id: {
    ...appStyles.normal22Text,
    marginTop: 30,
    paddingHorizontal: 20,
  },
  flexStyle: {
    flex: 1,
  },
});

type ConfirmItem = {
  key: string;
  list: {color: string; text: string}[];
  navi: {
    route: string;
    param: {key: string; title: string};
  };
};

const RegisterMobileListItem0 = ({
  item,
  confirm,
  onPress,
  onMove,
}: {
  item: ConfirmItem;
  onPress: (k: string) => void;
  onMove: (
    k: string,
    route: string,
    param: {key: string; title: string},
  ) => () => void;
  confirm: ImmutableMap<string, boolean>;
}) => {
  const confirmed = confirm.get(item.key);
  const navi = item.navi || {};

  return (
    <View style={styles.confirmList}>
      <TouchableOpacity
        onPress={() => onPress(item.key)}
        activeOpacity={1}
        style={{paddingVertical: 13}}>
        <AppIcon
          style={{marginRight: 10}}
          name="btnCheck2"
          checked={confirmed}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onMove(item.key, navi.route, navi.param)}
        activeOpacity={1}
        style={[styles.rowStyle, {paddingVertical: 13}]}>
        <View style={styles.rowStyle}>
          {item.list.map((elm, idx) => (
            <AppText
              key={`${idx}`}
              style={[styles.confirmItem, {color: elm.color}]}>
              {elm.text}
            </AppText>
          ))}
        </View>
        <AppIcon
          style={{marginRight: 10, marginTop: 5}}
          name="iconArrowRight"
        />
      </TouchableOpacity>
    </View>
  );
};

const RegisterMobileListItem = memo(RegisterMobileListItem0);

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
  lastTab: string[];
  pending: boolean;

  navigation: RegisterMobileScreenNavigationProp;
  route: RegisterMobileScreenRouteProp;

  actions: {
    account: AccountAction;
    cart: CartAction;
  };
};

const RegisterMobileScreen: React.FC<RegisterMobileScreenProps> = ({
  account: {loggedIn, deviceModel},
  link,
  navigation,
  route,
  actions,
  pending,
  lastTab,
}) => {
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [mobile, setMobile] = useState('');
  const [authorized, setAuthorized] = useState<boolean | undefined>();
  const [authNoti, setAuthNoti] = useState(false);
  const [timeoutFlag, setTimeoutFlag] = useState(false);
  const [confirm, setConfirm] = useState(
    ImmutableMap({
      0: false,
      1: false,
      2: false,
    }),
  );
  const [newUser, setNewUser] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>('');
  const [socialLogin, setSocialLogin] = useState(false);
  const [isKeyboardShow, setIsKeyboardShow] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<TrackingStatus>();
  const controller = useRef(new AbortController());
  const mounted = useRef(false);
  const emailRef = useRef<InputEmailRef>(null);
  const mobileRef = useRef<InputMobileRef>(null);
  const inputRef = useRef<InputPinRef>(null);

  const recommender = useMemo(() => link.recommender, [link.recommender]);
  const confirmList = useMemo(
    () =>
      [
        ['contract', 'required', 'setting:contract'],
        ['personalInfo', 'required', 'setting:privacy'],
      ]
        .concat(
          (!esimGlobal && [['marketing', 'optional', 'mkt:agreement']]) || [],
        )
        .map((v, i) => ({
          key: `${i}`,
          list: [
            {
              color: colors.warmGrey,
              text: i18n.t(`cfm:${v[0]}`),
            },
            {
              color: v[1] === 'required' ? colors.clearBlue : colors.warmGrey,
              text: i18n.t(`cfm:${v[1]}`),
            },
          ],
          navi: {
            route: 'SimpleTextForAuth',
            param: {key: v[2], title: i18n.t(`cfm:${v[0]}`)},
          },
        })),
    [],
  );

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
      analytics().logEvent(`${esimGlobal ? 'global' : 'esim'}_recommender`);
    }
  }, [recommender, status]);

  useEffect(() => {
    if (loggedIn) {
      if (link?.url?.includes('gift')) {
        navigation.navigate('EsimStack', {
          screen: 'Esim',
        });
      } else if (!newUser && !link?.url?.includes('recommender')) {
        navigation.navigate('Main', {
          screen: 'HomeStack',
          params: {
            screen: 'Home',
          },
        });
      } else {
        navigation.navigate('Main', {
          screen: 'MyPageStack',
          params: {
            screen: 'MyPage',
          },
        });
      }
      setAuthorized(true);
    }
    // AppAlert.error(i18n.t('reg:failedToLogIn'));
  }, [link?.url, loggedIn, navigation, newUser]);

  useEffect(() => {
    return () => {
      mounted.current = false;
      controller.current?.abort();
    };
  }, []);

  const initState = useCallback(() => {
    setLoading(false);
    setPin('');
    setMobile('');
    setAuthorized(false);
    setAuthNoti(false);
    setTimeoutFlag(false);
    setConfirm(
      ImmutableMap({
        0: false,
        1: false,
        2: false,
      }),
    );
    setNewUser(false);
    setIsValidEmail(false);
    setEmailError('');
    setSocialLogin(false);

    inputRef.current?.reset();
    mobileRef.current?.reset();
  }, []);

  const signIn = useCallback(
    async (auth: {mobile?: string; pin?: string}): Promise<ApiResult<any>> => {
      const {payload: resp} = await actions.account.logInAndGetAccount(auth);

      if (resp?.result === 0) {
        utils.adjustEventadd(eventToken.Login);
        actions.cart.cartFetch();
        const profileImage: RkbImage = await utils.convertURLtoRkbImage(
          profileImageUrl!,
        );
        if (profileImage) {
          actions.account.uploadAndChangePicture(profileImage);
        }
      }
      return resp;
    },
    [actions.account, actions.cart, profileImageUrl],
  );

  const submitHandler = useCallback(async () => {
    const error = validationUtil.validate('email', email);
    let isValid = true;

    if (loading || pending) return;

    setLoading(true);

    try {
      if (!_.isEmpty(error)) {
        isValid = false;
        setIsValidEmail(isValid);
        setEmailError(error?.email[0]);
      } else {
        const resp = await API.User.confirmEmail({email});

        if (!mounted.current) return;

        isValid = resp.result === 0;
        if (resp.result !== 0) {
          // duplicated email error
          if (
            resp.result !== API.default.E_RESOURCE_NOT_FOUND ||
            !resp.message?.includes('Duplicate')
          ) {
            // dulicated email 이외의 에러인 경우, throw error
            console.log('confirm email failed', resp);
            throw new Error('failed to confirm email');
          }
        }
        console.log('@@@ confirm email', resp);

        // 정상이거나, duplicated email 인 경우는 화면 상태 갱신 필요
        setIsValidEmail(isValid);
        setEmailError(isValid ? undefined : i18n.t('acc:duplicatedEmail'));
      }

      if (isValid && mounted.current) {
        const resp = await API.User.signUp({
          user: mobile,
          pass: pin,
          email,
          mktgOptIn: confirm.get('2'),
          deviceModel,
          recommender,
        });

        if (resp.result === 0 && !_.isEmpty(resp.objects)) {
          if (status === 'authorized') {
            utils.adjustEventadd(eventToken.SignUp);
            await firebase.analytics().setAnalyticsCollectionEnabled(true);
            await Settings.setAdvertiserTrackingEnabled(true);
            analytics().logEvent(`${esimGlobal ? 'global' : 'esim'}_sign_up`);
          }

          signIn({mobile, pin});
        } else {
          console.log('sign up failed', resp);
          throw new Error('failed to login');
        }
      }
    } catch (err) {
      console.log('sign up failed', err);
      AppAlert.error(i18n.t('reg:fail'));
    }

    if (mounted.current) {
      setLoading(false);
    }
  }, [
    confirm,
    deviceModel,
    email,
    loading,
    mobile,
    pending,
    pin,
    recommender,
    signIn,
    status,
  ]);

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
        setPin('');
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
            setNewUser(_.isEmpty(resp.objects));
            setPin(value);

            if (!_.isEmpty(resp.objects)) {
              signIn({mobile, pin: value});
            } else {
              emailRef.current?.focus();
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
    [mobile, signIn],
  );

  const onMove = useCallback(
    (key: string, route: string, param: object) => () => {
      if (!_.isEmpty(route)) {
        navigation.navigate(route, param);
      }
    },
    [navigation],
  );

  const onAuth = useCallback(
    async ({
      authorized,
      user,
      pass,
      email,
      mobile,
      token,
      profileImageUrl: profile,
      kind,
    }: SocialAuthInfo) => {
      setLoading(true);

      const resp = await API.User.socialLogin({
        user,
        pass,
        kind,
        token,
        mobile,
      });

      setLoading(false);

      if (resp.result === 0) {
        const {mobile: drupalId, newUser} = resp.objects[0];

        setNewUser(newUser);
        setMobile(drupalId);
        setPin(pass);
        setAuthorized(authorized);
        setEmail(email);
        setSocialLogin(true);
        setProfileImageUrl(profile);

        if (newUser) {
          // new login
          // create account
          emailRef.current?.focus();
        } else {
          // account exist. try login
          signIn({mobile: drupalId, pin: pass});
        }
      }
    },
    [signIn],
  );

  const renderItem = useCallback(
    ({item}: {item: ConfirmItem}) => {
      return (
        <RegisterMobileListItem
          key={item.key}
          item={item}
          confirm={confirm}
          onPress={(key) =>
            setConfirm((prev) => prev.update(key, (value) => !value))
          }
          onMove={onMove}
        />
      );
    },
    [confirm, onMove],
  );

  const renderInput = useCallback(() => {
    const editablePin = !!mobile && authNoti && !authorized && !loading;

    return (
      <View key="mobile">
        <AppText style={styles.mobileAuth}>
          {i18n.t('mobile:easyLogin')}
        </AppText>
        <InputMobile
          style={{marginTop: 30, paddingHorizontal: 20}}
          onPress={sendSms}
          authNoti={authNoti}
          disabled={(authNoti && authorized) || loading}
          authorized={authorized}
          inputRef={mobileRef}
        />

        <InputPinInTime
          style={{marginTop: 20, paddingHorizontal: 20}}
          clickable={editablePin || !isProduction}
          authorized={mobile ? authorized : undefined}
          countdown={authNoti && !authorized && !timeoutFlag}
          onTimeout={() => setTimeoutFlag(true)}
          onPress={onPressPin}
          duration={180}
          inputRef={inputRef}
        />
      </View>
    );
  }, [authNoti, authorized, loading, mobile, sendSms, onPressPin, timeoutFlag]);

  const renderLogin = useCallback(() => {
    return (
      <View>
        <AppText style={styles.title}>{i18n.t('mobile:title')}</AppText>
        {!esimGlobal && renderInput()}
      </View>
    );
  }, [renderInput]);

  const disableButton = useMemo(
    () => !authorized || (newUser && !(confirm.get('0') && confirm.get('1'))),
    [authorized, confirm, newUser],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <AppBackButton
        title={i18n.t('mobile:header')}
        onPress={() => {
          initState();

          const screen = route?.params?.screen;

          if (!socialLogin) navigation.goBack();

          if (screen === 'Invite') {
            if (loggedIn) navigation.replace(screen);
            else navigation.popToTop();
          }
        }}
      />
      <KeyboardAwareScrollView
        enableOnAndroid
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps="handled">
        {socialLogin ? (
          <View style={{marginTop: 30}}>
            <Profile
              email={email}
              mobile={mobile}
              userPictureUrl={profileImageUrl}
            />
          </View>
        ) : (
          renderLogin()
        )}

        {newUser && authorized && (
          <View>
            <InputEmail
              style={{
                marginTop: socialLogin ? 20 : 38,
                paddingHorizontal: 20,
              }}
              inputRef={emailRef}
              value={email}
              onChange={(v) => setEmail(v.replace(/ /g, ''))}
            />

            <AppText style={[styles.helpText, {color: colors.errorBackground}]}>
              {isValidEmail ? null : emailError}
            </AppText>
            <View key="divider" style={styles.divider} />

            {confirmList.map((item) => renderItem({item}))}
          </View>
        )}
      </KeyboardAwareScrollView>
      {!newUser && !isKeyboardShow && (
        <View style={{justifyContent: 'center', marginBottom: 36}}>
          <SocialLogin onAuth={onAuth} />
        </View>
      )}
      {esimGlobal && (
        <View
          key="imgRokebi"
          style={{justifyContent: 'flex-end', paddingBottom: 52}}>
          <AppIcon name="textLogo" />
        </View>
      )}
      {newUser && authorized && (
        <AppButton
          style={styles.confirm}
          title={i18n.t('ok')}
          titleStyle={styles.text}
          disabled={disableButton}
          disableColor={colors.black}
          disableBackgroundColor={colors.lightGrey}
          onPress={submitHandler}
          type="primary"
        />
      )}

      <AppActivityIndicator visible={pending || loading} />
    </SafeAreaView>
  );
};

export default connect(
  ({cart, account, link, status}: RootState) => ({
    lastTab: cart.lastTab.toArray(),
    account,
    link,
    pending:
      status.pending[accountActions.logInAndGetAccount.typePrefix] || false,
  }),
  (dispatch) => ({
    actions: {
      account: bindActionCreators(accountActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
    },
  }),
)(RegisterMobileScreen);
