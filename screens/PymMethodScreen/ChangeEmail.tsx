import React, {memo, useCallback, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import AppText from '@/components/AppText';
import InputEmail, {InputEmailRef} from '@/components/InputEmail';
import AppActionMenu from '@/components/ModalContent/AppActionMenu';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import validationUtil, {ValidationResult} from '@/utils/validationUtil';
import AppSvgIcon from '@/components/AppSvgIcon';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 20,
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
  infoText: {
    marginTop: 15,
    color: colors.clearBlue,
  },
});

const ChangeEmail = ({
  email,
  onCancelClose,
}: {
  email?: string;
  onCancelClose?: () => void;
}) => {
  const [newEmail, setNewEmail] = useState('');
  const [inValid, setInValid] = useState<ValidationResult>({});
  const emailRef = useRef<InputEmailRef>(null);

  const onChangeText = useCallback((v: string) => {
    setNewEmail(v);
    setInValid(validationUtil.validate('email', v));
  }, []);

  return (
    <AppActionMenu>
      <View style={[styles.row, {backgroundColor: 'white'}]}>
        <AppText>{i18n.t('pym:email:change')}</AppText>
        <AppSvgIcon
          key="closeModal"
          name="closeModal"
          onPress={() => onCancelClose?.()}
        />
      </View>
      <View style={{padding: 20, flex: 1, backgroundColor: 'white'}}>
        <AppText style={styles.title}>{i18n.t('changeEmail:using')}</AppText>
        <View style={styles.oldEmail}>
          <AppText style={styles.oldEmailText}>{email}</AppText>
        </View>

        <AppText style={styles.title}>{i18n.t('changeEmail:new')}</AppText>

        <View>
          <InputEmail
            inputRef={emailRef}
            value={email}
            onChange={(v) => {
              //   setEmail(v.replace(/ /g, ''));
              //   setIsValidEmail(() => true);
              //   setEmailError(() => undefined);
            }}
            // onPressPicker={() => setShowPicker(true)}
          />

          <AppText style={[styles.helpText, {color: colors.errorBackground}]}>
            {inValid && inValid.email?.length > 0 ? inValid.email[0] : null}
          </AppText>

          <AppText style={styles.infoText}>{i18n.t('mypage:mailInfo')}</AppText>
        </View>
      </View>
    </AppActionMenu>
  );
};

export default memo(ChangeEmail);
