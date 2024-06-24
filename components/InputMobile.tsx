import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import _ from 'underscore';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import utils from '@/redux/api/utils';
import i18n from '@/utils/i18n';
import validationUtil, {ValidationResult} from '@/utils/validationUtil';
import AppText from './AppText';
import AppButton from './AppButton';
import AppTextInput from './AppTextInput';

const styles = StyleSheet.create({
  helpText: {
    ...appStyles.normal14Text,
    color: colors.clearBlue,
    marginTop: 13,
    marginLeft: 30,
  },
  text: {
    ...appStyles.semiBold16Text,
    color: '#ffffff',
    lineHeight: 24,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 3,
    height: 50,
    marginRight: 8,
  },
  input: {
    ...appStyles.normal16Text,
    color: colors.black,
    paddingHorizontal: 10,
    marginRight: 20,
    paddingVertical: 10,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  button: {
    width: 80,
    height: 50,
    borderRadius: 3,
    backgroundColor: colors.clearBlue,
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
  marginTop?: number;
};

const InputMobile: React.FC<InputMobileProps> = ({
  onPress,
  authNoti,
  authorized,
  disabled,
  inputRef,
  marginTop,
}) => {
  const [mobile, setMobile] = useState('');
  const [value, setValue] = useState('');
  const [errors, setErrors] = useState<ValidationResult>();
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [focused, setFocused] = useState(false);

  const onChangeText = useCallback((value: string) => {
    if (Platform.OS === 'android' && value.length > 11) return;
    const mobileTxt = value.replace(/[.-]/g, '');
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
      <View style={{...styles.row, marginTop: marginTop || 16}}>
        <AppTextInput
          showCancel
          containerStyle={{
            ...styles.inputBox,
            borderColor: focused ? colors.clearBlue : colors.lightGrey,
          }}
          placeholder={i18n.t('mobile:input')}
          placeholderTextColor={colors.greyish}
          keyboardType="numeric"
          enablesReturnKeyAutomatically
          onFocus={() => {
            setValue(mobile);
            setFocused(true);
          }}
          onBlur={() => {
            setValue(utils.toPhoneNumber(mobile));
            setFocused(false);
          }}
          maxLength={Platform.OS === 'android' ? 13 : 11}
          blurOnSubmit={false}
          onChangeText={onChangeText}
          value={value}
          allowFontScaling={false}
          style={styles.input}
          editable={!disabled}
          selectTextOnFocus={!disabled}
          onCancel={() => {
            setValue('');
            setMobile('');
          }}
        />
        <AppButton
          style={styles.button}
          disabled={!clickable}
          onPress={onPressInput}
          titleStyle={styles.text}
          title={
            authNoti ? i18n.t('mobile:resendAuth') : i18n.t('mobile:sendAuth')
          }
          disableColor={colors.lightGrey}
          disableBackgroundColor={colors.backGrey}
        />
      </View>

      {authNoti && typeof authorized === undefined && (
        <AppText style={styles.helpText}>{i18n.t('reg:authNoti')}</AppText>
      )}
    </View>
  );
};

export default InputMobile;
