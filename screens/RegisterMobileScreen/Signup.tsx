import _ from 'underscore';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
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
import AsyncStorage from '@react-native-community/async-storage';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import {
  actions as toastActions,
  ToastAction,
  Toast,
} from '@/redux/modules/toast';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import InputEmail, {InputEmailRef} from '@/components/InputEmail';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {RkbImage} from '@/redux/api/accountApi';
import {ApiResult} from '@/redux/api/api';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';
import {LinkModelState} from '@/redux/modules/link';
import ScreenHeader from '@/components/ScreenHeader';
import {emailDomainList} from '@/components/DomainListModal';
import ConfirmPolicy from './ConfirmPolicy';
import AppSnackBar from '@/components/AppSnackBar';
import AppAlert from '@/components/AppAlert';

const styles = StyleSheet.create({
  title: {
    marginTop: 24,
    paddingHorizontal: 20,
    display: 'flex',
    gap: 8,
    flexDirection: 'column',
  },
  titleWelcome: {
    ...appStyles.bold24Text,
    lineHeight: 28,
    color: colors.black,
  },
  titleInfo: {
    ...appStyles.medium16,
    lineHeight: 24,
    letterSpacing: -0.16,
    color: colors.black,
  },
  email: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  subTitle: {
    ...appStyles.semiBold14Text,
    lineHeight: 20,
    marginBottom: 6,
  },
  confirm: {
    width: '100%',
    height: 52,
    backgroundColor: colors.clearBlue,
    justifyContent: 'flex-end',
  },
  text: {
    ...appStyles.medium18,
    lineHeight: 26,
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
  mobile: {
    flex: 1,
    marginTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  mobileBox: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: colors.backGrey,
    borderColor: colors.lightGrey,
    borderRadius: 3,
  },
  mobileText: {
    ...appStyles.medium16,
    lineHeight: 24,
    letterSpacing: -0.16,
    color: colors.black,
  },
});

type RegisterMobileScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Signup'
>;

type RegisterMobileScreenRouteProp = RouteProp<HomeStackParamList, 'Signup'>;

type RegisterMobileScreenProps = {
  account: AccountModelState;
  link: LinkModelState;
  pending: boolean;

  navigation: RegisterMobileScreenNavigationProp;
  route: RegisterMobileScreenRouteProp;

  actions: {
    account: AccountAction;
    modal: ModalAction;
    toast: ToastAction;
  };
};

const SignupScreen: React.FC<RegisterMobileScreenProps> = ({
  account: {loggedIn, deviceModel, isNewUser},
  link,
  navigation,
  route,
  actions,
  pending,
}) => {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState({mandatory: false, optional: false});
  const [email, setEmail] = useState(
    route?.params?.email ? route?.params?.email : '',
  );
  const emailRef = useRef<InputEmailRef>(null);
  const [domain, setDomain] = useState(
    route?.params?.email?.split('@')?.[1]
      ? emailDomainList.includes(route?.params?.email?.split('@')?.[1])
        ? route?.params?.email?.split('@')?.[1]
        : 'input'
      : '',
  );
  const [showSnackBar, setShowSnackBar] = useState(false);
  const kind = useMemo(
    () => route?.params?.kind || 'normal',
    [route?.params?.kind],
  );

  const {profileImageUrl, pin, status, mobile} = useMemo(
    () => route?.params || {},
    [route?.params],
  );

  const recommender = useMemo(
    () => link?.params?.recommender,
    [link?.params?.recommender],
  );

  useEffect(() => {
    setTimeout(() => {
      if (!route?.params?.email) {
        if (emailRef?.current) {
          emailRef?.current?.focus();
        }
      }
    }, 100);
  }, [route?.params?.email]);

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
    }
  }, [
    isNewUser,
    link.url,
    loggedIn,
    navigation,
    route?.params,
    route?.params?.rule,
  ]);

  const signIn = useCallback(
    async (
      auth: {mobile?: string; pin?: string},
      imageUrl?: string,
    ): Promise<ApiResult<any>> => {
      const {payload: resp} = await actions.account.logInAndGetAccount(auth);

      if (resp?.result === 0) {
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
    [actions.account],
  );

  const submitHandler = useCallback(async () => {
    Keyboard.dismiss();
    let isValid = true;

    if (loading || pending) return;

    setLoading(true);

    try {
      const resp = await API.User.confirmEmail({email});

      isValid = resp.result === 0;
      if (resp.result !== 0) {
        if (resp.message?.includes('Duplicate')) {
          throw new Error('Duplicated email');
        }

        throw new Error('network error');
      }

      if (isValid) {
        const payload = {
          user: mobile,
          pass: pin,
          email,
          mktgOptIn: confirm.optional,
          deviceModel,
          recommender,
        };

        const rsp = await API.User.signUp(payload);

        if (rsp.result === 0 && !_.isEmpty(rsp.objects)) {
          if (status === 'authorized') {
            await firebase.analytics().setAnalyticsCollectionEnabled(true);
            await Settings.setAdvertiserTrackingEnabled(true);
            analytics().logEvent('esim_sign_up');
          }
          AsyncStorage.setItem('login.hist', kind);
          signIn({mobile, pin}, profileImageUrl);
        } else {
          setShowSnackBar(true);
          console.log('sign up failed', resp);
          throw new Error('failed to login');
        }
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('Duplicated')) {
        actions.toast.push('reg:usingEmail');
      } else actions.toast.push(Toast.FAIL_NETWORK);
      console.log('sign up failed', err);
    }

    setLoading(false);
  }, [
    actions.toast,
    confirm.optional,
    deviceModel,
    email,
    kind,
    loading,
    mobile,
    pending,
    pin,
    profileImageUrl,
    recommender,
    signIn,
    status,
  ]);

  const onMove = useCallback(
    (param: Record<string, string>) => {
      navigation.navigate('SimpleTextForAuth', param);
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader
        backHandler={() =>
          navigation.reset({index: 0, routes: [{name: 'RegisterMobile'}]})
        }
      />
      <KeyboardAwareScrollView
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        enableOnAndroid
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.title}>
          <AppText style={styles.titleWelcome}>
            {i18n.t('signup:title:welcome')}
          </AppText>
          <AppText style={styles.titleInfo}>
            {i18n.t('signup:title:info')}
          </AppText>
        </View>

        <View style={styles.email}>
          <AppText style={styles.subTitle}>{i18n.t('mobile:email')}</AppText>
          <InputEmail
            inputRef={emailRef}
            socialEmail={email?.split('@')?.[0]}
            domain={domain}
            setDomain={setDomain}
            onChange={setEmail}
            placeholder={i18n.t('reg:email')}
          />
        </View>

        <View style={styles.mobile}>
          <AppText style={styles.subTitle}>
            {i18n.t(mobile?.startsWith('100') ? 'signup:id' : 'signup:mobile')}
          </AppText>
          <View style={styles.mobileBox}>
            <AppText style={styles.mobileText}>
              {utils.toPhoneNumber(mobile)}
            </AppText>
          </View>
        </View>
        <ConfirmPolicy onMove={onMove} onChange={setConfirm} />
        <AppButton
          style={styles.confirm}
          title={i18n.t('mobile:signup')}
          titleStyle={styles.text}
          disabled={!confirm.mandatory || !email}
          disableColor={colors.greyish}
          disableBackgroundColor={colors.lightGrey}
          onPress={submitHandler}
          type="primary"
        />
      </KeyboardAwareScrollView>

      <AppActivityIndicator visible={pending || loading} />
      <AppSnackBar
        visible={showSnackBar}
        textMessage={i18n.t('promo:donate:fail')}
        bottom={20}
        preIcon="cautionRed"
        onClose={() => setShowSnackBar(false)}
        hideCancel
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
      modal: bindActionCreators(modalActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(SignupScreen);
