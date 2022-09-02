import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
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
import AppTextInput from '@/components/AppTextInput';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import Env from '@/environment';
const {isIOS} = Env.get();

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
    marginTop: 10,
    fontSize: 16,
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
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
    justifyContent: 'center',
  },
  helpText: {
    ...appStyles.normal14Text,
    color: colors.clearBlue,
    marginTop: 13,
    marginLeft: 10,
  },
  divider: {
    marginTop: 30,
    width: '100%',
    height: 10,
    backgroundColor: '#f5f5f5',
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
  infoText: {
    marginTop: 15,
    color: colors.clearBlue,
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
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={isIOS ? 'padding' : undefined}
      keyboardVerticalOffset={isDeviceSize('medium') ? 65 : 90}>
      <SafeAreaView style={styles.container}>
        <View
          style={{
            padding: 20,
            flex: 1,
          }}>
          <AppText style={appStyles.normal14Text}>
            {i18n.t('changeEmail:using')}
          </AppText>
          <View style={styles.oldEmail}>
            <AppText>{email}</AppText>
          </View>

          <AppText style={appStyles.normal14Text}>
            {i18n.t('changeEmail:new')}
          </AppText>

          <View>
            <AppTextInput
              style={styles.textInput}
              value={newEmail}
              onChangeText={onChangeText}
              placeholder={i18n.t('changeEmail:placeholder')}
            />

            <AppText style={[styles.helpText, {color: colors.errorBackground}]}>
              {inValid && inValid.email?.length > 0 ? inValid.email[0] : null}
            </AppText>

            <AppText style={styles.infoText}>
              {i18n.t('mypage:mailInfo')}
            </AppText>
            {/* <View key="divider" style={styles.divider} /> */}
          </View>
        </View>

        <AppButton
          style={[
            styles.button,
            {backgroundColor: !inValid ? colors.clearBlue : colors.lightGrey},
          ]}
          titleStyle={[
            styles.buttonTitle,
            {color: !inValid ? colors.white : colors.warmGrey},
          ]}
          disabled={!!inValid}
          title={i18n.t('changeEmail:save')}
          onPress={changeEmail}
          type="primary"
        />

        <AppModal
          title={i18n.t('changeEmail:saveInfo')}
          type="info"
          onOkClose={() => navigation.goBack()}
          visible={showModal}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
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
