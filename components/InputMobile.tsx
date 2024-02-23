import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Platform, StyleSheet, TextInput, View} from 'react-native';
import _ from 'underscore';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import utils from '@/redux/api/utils';
import i18n from '@/utils/i18n';
import validationUtil, {ValidationResult} from '@/utils/validationUtil';
import AppText from './AppText';
import AppButton from './AppButton';

const styles = StyleSheet.create({
  helpText: {
    ...appStyles.normal14Text,
    color: colors.clearBlue,
    marginTop: 13,
    marginLeft: 30,
  },
  text: {
    ...appStyles.normal12Text,
    color: '#ffffff',
    lineHeight: 19,
    letterSpacing: 0.15,
  },
  inputStyle: {
    flex: 1,
    marginRight: 10,
    paddingBottom: 9,
  },
  emptyInput: {
    borderBottomColor: colors.lightGrey,
  },
  input: {
    ...appStyles.normal16Text,
    color: colors.black,
    paddingHorizontal: 10,
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    marginRight: 20,
  },
});

export type InputMobileRef = {
  focus: () => void;
  reset: () => void;
};

type InputMobileProps = {
  onPress?: (v: string) => void;
  authNoti: boolean;
  authorized?: boolean;
  disabled: boolean;
  inputRef?: React.MutableRefObject<InputMobileRef | null>;
};

const InputMobile: React.FC<InputMobileProps> = ({
  onPress,
  authNoti,
  authorized,
  disabled,
  inputRef,
}) => {
  const [mobile, setMobile] = useState('');
  const [value, setValue] = useState('');
  const [errors, setErrors] = useState<ValidationResult>();
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const onChangeText = useCallback((value: string) => {
    if (Platform.OS === 'android' && value.length > 11) return;
    const mobileTxt = value.replace(/-/g, '');
    setMobile(mobileTxt);
    setValue(mobileTxt);
    setErrors(
      validationUtil.validateAll({mobile: utils.toPhoneNumber(mobileTxt)}),
    );
  }, []);

  useEffect(() => {
    if (inputRef) {
      inputRef.current = {
        reset: () => {
          onChangeText('');
          setErrors(undefined);
          setTimer(undefined);
        },
      };
    }
  }, [inputRef, onChangeText]);

  const onPressInput = useCallback(() => {
    onPress?.(mobile);
    const error = validationUtil.validate('mobileSms', mobile);
    if (!error) {
      setTimer(
        setTimeout(() => {
          setTimer(undefined);
        }, 15000),
      );
    }
  }, [mobile, onPress, setTimer]);

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  const clickable = useMemo(
    () => _.isEmpty(errors?.mobile) && !disabled && !timer && mobile.length > 1,
    [disabled, errors?.mobile, mobile.length, timer],
  );
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          marginHorizontal: 20,
          marginTop: 20,
        }}>
        <TextInput
          placeholder={i18n.t('mobile:input')}
          placeholderTextColor={colors.greyish}
          keyboardType="numeric"
          enablesReturnKeyAutomatically
          onFocus={() => setValue(mobile)}
          onBlur={() => setValue(utils.toPhoneNumber(mobile))}
          maxLength={Platform.OS === 'android' ? 13 : 11}
          blurOnSubmit={false}
          onChangeText={onChangeText}
          value={value}
          allowFontScaling={false}
          style={[
            styles.input,
            styles.inputStyle,
            mobile ? {} : styles.emptyInput,
          ]}
          editable={!disabled}
          selectTextOnFocus={!disabled}
        />
        <AppButton
          disabled={!clickable}
          onPress={onPressInput}
          titleStyle={styles.text}
          title={
            authNoti ? i18n.t('mobile:resendAuth') : i18n.t('mobile:sendAuth')
          }
          disableColor={colors.white}
        />
      </View>

      {authNoti && typeof authorized === undefined && (
        <AppText style={styles.helpText}>{i18n.t('reg:authNoti')}</AppText>
      )}
    </View>
  );
};

export default InputMobile;
