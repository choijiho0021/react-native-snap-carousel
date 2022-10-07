import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleProp, StyleSheet, TextInput, View, ViewStyle} from 'react-native';
import _ from 'underscore';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import utils from '@/redux/api/utils';
import i18n from '@/utils/i18n';
import validationUtil, {ValidationResult} from '@/utils/validationUtil';
import AppText from './AppText';
import AppTextInputButton from './AppTextInputButton';
import AppButton from './AppButton';

const styles = StyleSheet.create({
  helpText: {
    ...appStyles.normal14Text,
    color: colors.clearBlue,
    marginTop: 13,
    marginLeft: 30,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'stretch',
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
  style?: StyleProp<ViewStyle>;
  inputRef?: React.MutableRefObject<InputMobileRef | null>;
};

const InputMobile: React.FC<InputMobileProps> = ({
  onPress,
  authNoti,
  authorized,
  disabled,
  style,
  inputRef,
}) => {
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState<ValidationResult>();
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (inputRef) {
      inputRef.current = {
        reset: () => {
          setMobile('');
          setErrors(undefined);
          setTimer(undefined);
        },
      };
    }
  }, [inputRef]);

  const onChangeText = useCallback((value) => {
    setMobile(value);
    setErrors(validationUtil.validateAll({mobile: value}));
  }, []);

  const onPressInput = useCallback(() => {
    const value = mobile.replace(/-/g, '');
    onPress?.(value);
    const error = validationUtil.validate('mobileSms', value);
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
    () => _.isEmpty(errors?.mobile) && !disabled && !timer,
    [disabled, errors?.mobile, timer],
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
          maxLength={13}
          blurOnSubmit={false}
          onChangeText={onChangeText}
          value={utils.toPhoneNumber(mobile)}
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
