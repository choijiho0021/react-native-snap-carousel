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
import {API} from '@/redux/api';
import AppTextInput from '@/components/AppTextInput';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import Env from '@/environment';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import AppModalContent from '@/components/ModalContent/AppModalContent';
import ScreenHeader from '@/components/ScreenHeader';

const {isIOS} = Env.get();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  textInput: {
    marginTop: 10,
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    ...appStyles.normal16Text,
    lineHeight: 22,
    color: colors.black,
  },
  title: {
    ...appStyles.normal14Text,
    lineHeight: 20,
    color: colors.warmGrey,
  },
  oldEmail: {
    height: 46,
    marginTop: 4,
    marginBottom: 32,
    backgroundColor: colors.whiteTwo,
    borderRadius: 3,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  oldEmailText: {
    ...appStyles.normal16Text,
    lineHeight: 22,
    color: colors.black,
  },
  helpText: {
    ...appStyles.normal14Text,
    color: colors.clearBlue,
    marginTop: 13,
    marginLeft: 10,
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
    modal: ModalAction;
  };
};

const ChangeEmailScreen: React.FC<ChangeEmailScreenProps> = ({
  navigation,
  actions,
  email,
}) => {
  const [newEmail, setNewEmail] = useState<string>('');
  const [inValid, setInValid] = useState<ValidationResult>({});

  const showModal = useCallback(() => {
    actions.modal.renderModal(() => (
      <AppModalContent
        title={i18n.t('changeEmail:saveInfo')}
        type="info"
        onOkClose={() => {
          actions.modal.closeModal();
          navigation.popToTop();
        }}
      />
    ));
  }, [actions.modal, navigation]);

  const onChangeText = useCallback((v: string) => {
    setNewEmail(v);
    setInValid(validationUtil.validate('email', v));
  }, []);

  const changeEmail = useCallback(async () => {
    const checkEmail = await API.User.confirmEmail({email: newEmail});

    if (checkEmail.result === 0) {
      await actions.account.changeEmail(newEmail).then((rsp) => {
        if (rsp.payload.result === 0) {
          showModal();
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
  }, [actions.account, newEmail, showModal]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={isIOS ? 'padding' : undefined}>
        <ScreenHeader title={i18n.t('set:changeMail')} />
        <View
          style={{
            padding: 20,
            flex: 1,
          }}>
          <AppText style={styles.title}>{i18n.t('changeEmail:using')}</AppText>
          <View style={styles.oldEmail}>
            <AppText style={styles.oldEmailText}>{email}</AppText>
          </View>

          <AppText style={styles.title}>{i18n.t('changeEmail:new')}</AppText>

          <View>
            <AppTextInput
              style={styles.textInput}
              value={newEmail}
              onChangeText={onChangeText}
              placeholder={i18n.t('changeEmail:placeholder')}
              placeholderTextColor="#aaaaaa"
            />

            <AppText style={[styles.helpText, {color: colors.errorBackground}]}>
              {inValid && inValid.email?.length > 0 ? inValid.email[0] : null}
            </AppText>

            <AppText style={styles.infoText}>
              {i18n.t('mypage:mailInfo')}
            </AppText>
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
    },
  }),
)(ChangeEmailScreen);
