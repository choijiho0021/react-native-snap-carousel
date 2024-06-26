import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {
  AccountAction,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import i18n from '@/utils/i18n';
import AppButton from '@/components/AppButton';
import Env from '@/environment';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import ScreenHeader from '@/components/ScreenHeader';
import AppSvgIcon from '@/components/AppSvgIcon';
import InputEmail, {InputEmailRef} from '@/components/InputEmail';

const {isIOS} = Env.get();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  title: {
    ...appStyles.semiBold14Text,
    lineHeight: 20,
    color: colors.warmGrey,
  },
  oldEmail: {
    height: 50,
    marginTop: 6,
    marginBottom: 24,
    backgroundColor: colors.backGrey,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    paddingHorizontal: 16,
    paddingVertical: 13,
    justifyContent: 'center',
  },
  oldEmailText: {
    ...appStyles.normal16Text,
    lineHeight: 22,
    color: colors.black,
  },
  button: {
    ...appStyles.normal16Text,
    height: 52,
    textAlign: 'center',
    color: '#ffffff',
    justifyContent: 'flex-end',
  },
  buttonTitle: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    margin: 5,
  },
  caution: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: colors.backGrey,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 3,
  },
  inner: {
    paddingHorizontal: 20,
    marginTop: 24,
    flex: 1,
  },
});

type ChangeEmailScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Settings'
>;

type ChangeEmailScreenRouteProp = RouteProp<HomeStackParamList, 'SimpleText'>;

type ChangeEmailScreenProps = {
  navigation: ChangeEmailScreenNavigationProp;
  route: ChangeEmailScreenRouteProp;
  email?: string;

  actions: {
    account: AccountAction;
    modal: ModalAction;
    toast: ToastAction;
  };
};

const ChangeEmailScreen: React.FC<ChangeEmailScreenProps> = ({
  navigation,
  actions,
  email,
}) => {
  const [newEmail, setNewEmail] = useState<string>('');
  const [domain, setDomain] = useState('');
  const emailRef = useRef<InputEmailRef>(null);

  const changeEmail = useCallback(() => {
    actions.account.changeEmail(newEmail).then((rsp) => {
      if (rsp?.payload?.result === 0) {
        actions.toast.push('changeEmail:saveInfo');
        navigation.goBack();
      } else {
        Keyboard.dismiss();
        actions.toast.push('changeEmail:fail');
      }
    });
  }, [actions.account, actions.toast, navigation, newEmail]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={isIOS ? 'padding' : undefined}>
        <ScreenHeader title={i18n.t('set:changeMail')} />
        <View style={styles.inner}>
          <View style={styles.caution}>
            <AppSvgIcon name="emailIcon" />
            <AppText style={[appStyles.medium14, {marginLeft: 8}]}>
              {i18n.t('changeEmail:info')}
            </AppText>
          </View>
          <AppText style={styles.title}>{i18n.t('changeEmail:using')}</AppText>
          <View style={styles.oldEmail}>
            <AppText style={styles.oldEmailText}>{email}</AppText>
          </View>

          <AppText
            style={[
              appStyles.bold16Text,
              {marginBottom: 6, lineHeight: undefined},
            ]}>
            {i18n.t('changeEmail:new')}
          </AppText>

          <InputEmail
            inputRef={emailRef}
            currentEmail={email}
            domain={domain}
            onChange={setNewEmail}
            placeholder={i18n.t('chg:email')}
            setDomain={setDomain}
          />
        </View>

        <AppButton
          style={[
            styles.button,
            {backgroundColor: newEmail ? colors.clearBlue : colors.lightGrey},
          ]}
          titleStyle={[
            styles.buttonTitle,
            {color: newEmail ? colors.white : colors.warmGrey},
          ]}
          disabled={!newEmail}
          title={i18n.t('changeEmail:save')}
          onPress={changeEmail}
          type="primary"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default connect(
  ({account}: RootState) => ({
    account,
    email: account.email,
  }),
  (dispatch) => ({
    actions: {
      account: bindActionCreators(accountActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(ChangeEmailScreen);
