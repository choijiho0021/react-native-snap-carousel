import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {
  AccountAction,
  actions as accountActions,
} from '@/redux/modules/account';
import i18n from '@/utils/i18n';
import AppButton from '@/components/AppButton';
import validationUtil, {ValidationResult} from '@/utils/validationUtil';
import AppModal from '@/components/AppModal';
import {API} from '@/redux/api';
import InputEmail, {InputEmailRef} from '@/components/InputEmail';

const styles = StyleSheet.create({
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  cancelButton: {
    width: 20,
    height: 20,
    backgroundColor: colors.white,
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  textInput: {
    ...appStyles.normal16Text,
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  label: {
    ...appStyles.normal14Text,
    marginTop: 14,
    color: colors.clearBlue,
  },
  error: {
    ...appStyles.normal14Text,
    color: colors.tomato,
    marginHorizontal: 30,
    marginTop: 10,
  },
  oldEmail: {
    height: 46,
    marginTop: 4,
    marginBottom: 32,
    backgroundColor: colors.whiteTwo,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  helpText: {
    ...appStyles.normal14Text,
    color: colors.clearBlue,
    marginTop: 13,
    marginLeft: 30,
  },
  divider: {
    marginTop: 30,
    width: '100%',
    height: 10,
    backgroundColor: '#f5f5f5',
  },
  button: (isValid) => ({
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: isValid ? colors.clearBlue : colors.lightGrey,
    color: isValid ? colors.white : colors.warmGrey,
    textAlign: 'center',
    color: '#ffffff',
  }),
  buttonTitle: (isValid) => ({
    ...appStyles.normal18Text,
    textAlign: 'center',
    margin: 5,
    color: isValid ? colors.white : colors.warmGrey,
  }),
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
  };
};

const ChangeEmailScreen: React.FC<ChangeEmailScreenProps> = ({
  navigation,
  actions,
  email,
}) => {
  const [newEmail, setNewEmail] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [inValid, setInValid] = useState<ValidationResult>({});
  const emailRef = useRef<InputEmailRef>(null);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('set:changeMail')} />,
    });
  }, [navigation]);

  const onChangeText = useCallback((v: string) => {
    setNewEmail(v);
    setInValid(validationUtil.validate('email', v));
  }, []);

  const changeEmail = useCallback(async () => {
    const checkEmail = await API.User.confirmEmail({email: newEmail});

    if (checkEmail.result === 0) {
      await actions.account.changeEmail(newEmail).then((rsp) => {
        if (rsp.payload.result === 0) {
          setShowModal(true);
        }
      });
    } else if (checkEmail.message?.includes('Duplicate')) {
      setInValid({email: [i18n.t('changeEmail:duplicate')]});
    } else {
      // dulicated email 이외의 에러인 경우, throw error
      console.log('confirm email failed', checkEmail);
      setInValid({email: [i18n.t('changeEmail:fail')]});
      throw new Error('failed to confirm email');
    }
  }, [actions.account, newEmail]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{padding: 20, flex: 1}}>
        <AppText style={appStyles.normal14Text}>
          {i18n.t('changeEmail:using')}
        </AppText>
        <AppText style={styles.oldEmail}>{email}</AppText>
        <AppText style={appStyles.normal14Text}>
          {i18n.t('changeEmail:new')}
        </AppText>

        <View>
          <InputEmail
            style={{
              marginTop: 10,
            }}
            inputRef={emailRef}
            value={newEmail}
            onChange={onChangeText}
          />

          <AppText style={[styles.helpText, {color: colors.errorBackground}]}>
            {inValid && inValid.email?.length > 0 ? inValid.email[0] : null}
          </AppText>
          {/* <View key="divider" style={styles.divider} /> */}
        </View>
      </View>
      <AppButton
        style={styles.button(!inValid)}
        titleStyle={styles.buttonTitle(!inValid)}
        disabled={!!inValid}
        title={i18n.t('changeEmail:save')}
        onPress={changeEmail}
      />
      <AppModal
        title={i18n.t('changeEmail:saveInfo')}
        type="info"
        onOkClose={() => navigation.goBack()}
        visible={showModal}
      />
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
    },
  }),
)(ChangeEmailScreen);
