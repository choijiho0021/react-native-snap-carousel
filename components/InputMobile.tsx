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
});

type InputMobileProps = {
  onPress?: (v: string) => void;
  authNoti: boolean;
  authorized?: boolean;
  disabled: boolean;
  style?: StyleProp<ViewStyle>;
  forwardRef?: React.MutableRefObject<TextInput | null>;
};

const InputMobile: React.FC<InputMobileProps> = ({
  onPress,
  authNoti,
  authorized,
  disabled,
  style,
  forwardRef,
}) => {
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState<ValidationResult>();
  const [timer, setTimer] = useState<NodeJS.Timeout>();

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
    () => _.isEmpty(errors?.mobile) && !authNoti && !disabled && !timer,
    [authNoti, disabled, errors?.mobile, timer],
  );

  return (
    <View>
      <View style={[styles.container, style]}>
        <AppTextInputButton
          style={{flex: 1}}
          placeholder={i18n.t('mobile:input')}
          placeholderTextColor={colors.greyish}
          keyboardType="numeric"
          forwardRef={forwardRef}
          // returnKeyType='done'
          enablesReturnKeyAutomatically
          maxLength={13}
          blurOnSubmit={false}
          onChangeText={onChangeText}
          onPress={onPressInput}
          title={
            authNoti ? i18n.t('mobile:resendAuth') : i18n.t('mobile:sendAuth')
          }
          disabled={disabled}
          clickable={clickable}
          titleStyle={styles.text}
          inputStyle={[styles.inputStyle, mobile ? {} : styles.emptyInput]}
          value={utils.toPhoneNumber(mobile)}
        />
      </View>
      {authNoti && typeof authorized === undefined && (
        <AppText style={styles.helpText}>{i18n.t('reg:authNoti')}</AppText>
      )}
    </View>
  );
};

export default InputMobile;
