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
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import analytics, {firebase} from '@react-native-firebase/analytics';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
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
import {LinkModelState} from '@/redux/modules/link';
import ScreenHeader from '@/components/ScreenHeader';
import DomainListModal from '@/components/DomainListModal';
import ConfirmPolicy from './ConfirmPolicy';

const {isProduction, isIOS} = Env.get();

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 20,
    paddingTop: 50,
    lineHeight: 40,
  },
  mobileAuth: {
    ...appStyles.h1,
    paddingTop: 50,
  },
  confirm: {
    width: '100%',
    height: 52,
    backgroundColor: colors.clearBlue,
    justifyContent: 'flex-end',
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
  row: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
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
    cart: CartAction;
  };
};

const RegisterMobileScreen: React.FC<RegisterMobileScreenProps> = ({
  account: {loggedIn, deviceModel, isNewUser},
  link,
  navigation,
  route,
  actions,
  pending,
}) => {
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [mobile, setMobile] = useState('');
  const [pinEditable, setPinEditable] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | undefined>();
  const [authNoti, setAuthNoti] = useState(false);
  const [timeoutFlag, setTimeoutFlag] = useState(false);
  const [confirm, setConfirm] = useState({mandatory: false, optional: false});
  const [newUser, setNewUser] = useState(false);
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
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [domain, setDomain] = useState('');

  const recommender = useMemo(
    () => link?.params?.recommender,
    [link?.params?.recommender],
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
    newUser,
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
    setPin('');
    setMobile('');
    setAuthorized(false);
    setAuthNoti(false);
    setTimeoutFlag(false);
    setConfirm({mandatory: false, optional: false});
    setNewUser(false);
    setSocialLogin(false);

    inputRef.current?.reset();
    mobileRef.current?.reset();
  }, []);

  const signIn = useCallback(
    async (
      auth: {mobile?: string; pin?: string},
      imageUrl?: string,
    ): Promise<ApiResult<any>> => {
      const {payload: resp} = await actions.account.logInAndGetAccount(auth);

      if (resp?.result === 0) {
        actions.cart.cartFetch();

        if (imageUrl) {
          utils
            .convertURLtoRkbImage(imageUrl)
            .then((profileImage: RkbImage) => {
              actions.account.uploadAndChangePicture(profileImage);
            })
            .catch((ex) =>
              console.log('@@@ failed to convert image', imageUrl, ex),
            );
        }
      }
      return resp;
    },
    [actions.account, actions.cart],
  );

  const submitHandler = useCallback(async () => {
    Keyboard.dismiss();
    let isValid = true;

    if (loading || pending) return;

    setLoading(true);

    try {
      const resp = await API.User.confirmEmail({email});

      if (!mounted.current) return;

      isValid = resp.result === 0;
      if (resp.result !== 0) {
        // duplicated email error
        if (
          resp.result !== API.default.E_RESOURCE_NOT_FOUND ||
          !resp.message?.includes('Duplicate')
        ) {
          // 정상이거나, duplicated email 인 경우는 화면 상태 갱신 필요
          throw new Error('Duplicated email');
        }
      }

      if (isValid && mounted.current) {
        const rsp = await API.User.signUp({
          user: mobile,
          pass: pin,
          email,
          mktgOptIn: confirm.optional,
          deviceModel,
          recommender,
        });

        if (rsp.result === 0 && !_.isEmpty(rsp.objects)) {
          if (status === 'authorized') {
            await firebase.analytics().setAnalyticsCollectionEnabled(true);
            await Settings.setAdvertiserTrackingEnabled(true);
            analytics().logEvent('esim_sign_up');
          }

          signIn({mobile, pin}, profileImageUrl);
        } else {
          console.log('sign up failed', resp);
          throw new Error('failed to login');
        }
      }
    } catch (err) {
      console.log('sign up failed', err);
      if (err instanceof Error && err.message.includes('Duplicated')) {
        AppAlert.info(i18n.t('reg:usingEmail'));
      } else {
        AppAlert.error(i18n.t('reg:fail'));
      }
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
    profileImageUrl,
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

          // for testing
          resp.result = 0;
          if (resp.result === 0 && mounted.current) {
            setAuthorized(_.isEmpty(resp.objects) ? true : undefined);
            setNewUser(_.isEmpty(resp.objects));
            setPin(value);

            if (!_.isEmpty(resp.objects)) {
              signIn({mobile, pin: value});
            } else {
              actions.account.updateAccount({isNewUser: true});
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
    [actions.account, mobile, signIn],
  );

  const onMove = useCallback(
    (param: Record<string, string>) => {
      navigation.navigate('SimpleTextForAuth', param);
    },
    [navigation],
  );

  const onAuth = useCallback(
    async ({
      authorized: isAuthorized,
      user,
      pass,
      email: authEmail,
      mobile: authMobile,
      token,
      profileImageUrl: url,
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

        setNewUser(isNew);
        setMobile(drupalId);
        setPin(pass);
        setAuthorized(isAuthorized);
        setEmail(authEmail || '');
        setSocialLogin(true);
        setProfileImageUrl(url || '');

        if (isNew) {
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

  const renderInput = useCallback(() => {
    const editablePin = !!mobile && authNoti && !authorized && !loading;

    return (
      <View key="mobile">
        <AppText style={styles.mobileAuth}>
          {i18n.t('mobile:easyLogin')}
        </AppText>
        <InputMobile
          onPress={sendSms}
          authNoti={authNoti}
          disabled={(authNoti && authorized) || loading}
          authorized={authorized}
          inputRef={mobileRef}
        />

        <InputPinInTime
          style={{marginTop: 20}}
          clickable={editablePin || !isProduction}
          editable={pinEditable}
          authorized={mobile ? authorized : undefined}
          countdown={authNoti && !authorized && !timeoutFlag}
          onTimeout={() => setTimeoutFlag(true)}
          onPress={onPressPin}
          duration={180}
          inputRef={inputRef}
        />
      </View>
    );
  }, [
    mobile,
    authNoti,
    authorized,
    loading,
    sendSms,
    pinEditable,
    timeoutFlag,
    onPressPin,
  ]);

  const renderLogin = useCallback(() => {
    return (
      <View style={styles.title}>
        <View style={styles.row}>
          <AppText style={appStyles.bold30Text}>
            {i18n.t('mobile:title')}
          </AppText>
          <AppIcon name="earth" />
        </View>
        {renderInput()}
      </View>
    );
  }, [renderInput]);

  const disableButton = useMemo(
    () => !authorized || (newUser && !confirm.mandatory) || !email,
    [authorized, confirm.mandatory, email, newUser],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        title={i18n.t('mobile:header')}
        backHandler={() => {
          initState();
          if (!socialLogin) {
            navigation.goBack();
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
            <View
              style={{
                marginTop: socialLogin ? 20 : 40,
                paddingHorizontal: 20,
                marginBottom: 64,
              }}>
              <AppText style={{...appStyles.semiBold14Text, marginBottom: 6}}>
                {i18n.t('mobile:email')}
              </AppText>
              <InputEmail
                inputRef={emailRef}
                domain={domain}
                onChange={setEmail}
                onPress={() => setShowDomainModal(true)}
                placeholder={i18n.t('reg:email')}
              />
            </View>

            <ConfirmPolicy onMove={onMove} onChange={setConfirm} />
          </View>
        )}
      </KeyboardAwareScrollView>
      {!newUser && !isKeyboardShow && (
        <View style={{justifyContent: 'center', marginBottom: 36}}>
          <SocialLogin onAuth={onAuth} />
        </View>
      )}
      {newUser && authorized && (
        <AppButton
          style={styles.confirm}
          title={i18n.t('mobile:signup')}
          titleStyle={styles.text}
          disabled={disableButton}
          disableColor={colors.black}
          disableBackgroundColor={colors.lightGrey}
          onPress={submitHandler}
          type="primary"
        />
      )}

      <AppActivityIndicator visible={pending || loading} />
      <DomainListModal
        style={{right: 20, top: 200}}
        visible={showDomainModal}
        onClose={(v) => {
          setDomain(v);
          setShowDomainModal(false);
        }}
      />
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
      cart: bindActionCreators(cartActions, dispatch),
    },
  }),
)(RegisterMobileScreen);
