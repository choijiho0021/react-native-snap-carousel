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
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import InputEmail, {InputEmailRef} from '@/components/InputEmail';
import Profile from '@/components/Profile';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
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
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';
import {LinkModelState} from '@/redux/modules/link';
import ScreenHeader from '@/components/ScreenHeader';
import DomainListModal from '@/components/DomainListModal';
import ConfirmPolicy from './ConfirmPolicy';

const styles = StyleSheet.create({
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
  const [email, setEmail] = useState('');
  const emailRef = useRef<InputEmailRef>(null);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [domain, setDomain] = useState('');

  const {profileImageUrl, pin, status, mobile} = useMemo(
    () => route?.params || {},
    [route?.params],
  );

  const recommender = useMemo(
    () => link?.params?.recommender,
    [link?.params?.recommender],
  );

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
        // duplicated email error
        if (
          resp.result !== API.default.E_RESOURCE_NOT_FOUND ||
          !resp.message?.includes('Duplicate')
        ) {
          // 정상이거나, duplicated email 인 경우는 화면 상태 갱신 필요
          throw new Error('Duplicated email');
        }
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

    setLoading(false);
  }, [
    confirm.optional,
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
        title={i18n.t('signup:title')}
        backHandler={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{flex: 1}}
        contentContainerStyle={{flex: 1}}
        enableOnAndroid
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps="handled">
        <View style={{marginTop: 40}}>
          <Profile
            email={email}
            mobile={mobile}
            userPictureUrl={profileImageUrl}
          />
        </View>

        <View
          style={{
            marginTop: 20,
            paddingHorizontal: 20,
            flex: 1,
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
      </KeyboardAwareScrollView>
      <AppButton
        style={styles.confirm}
        title={i18n.t('mobile:signup')}
        titleStyle={styles.text}
        disabled={!confirm.mandatory || !email}
        disableColor={colors.black}
        disableBackgroundColor={colors.lightGrey}
        onPress={submitHandler}
        type="primary"
      />

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
    actions: {account: bindActionCreators(accountActions, dispatch)},
  }),
)(SignupScreen);
