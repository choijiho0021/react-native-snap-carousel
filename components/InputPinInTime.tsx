import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import _ from 'underscore';
import {useInterval} from '@/utils/useInterval';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AppButton from './AppButton';
import AppText from './AppText';
import AppTextInput from './AppTextInput';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  inputWrapper: {
    paddingHorizontal: 10,
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginRight: 20,
    paddingBottom: 9,
  },
  emptyWrapper: {
    borderBottomColor: colors.lightGrey,
  },
  timer: {
    ...appStyles.normal14Text,
    color: colors.errorBackground,
    textAlignVertical: 'center',
    lineHeight: 19,
  },
  title: {
    ...appStyles.normal14Text,
    textAlign: 'center',
    color: colors.white,
  },
  helpBox: {
    marginTop: 13,
    marginLeft: 30,
  },
  helpText: {
    ...appStyles.normal14Text,
    color: colors.clearBlue,
  },
  input: {
    ...appStyles.normal16Text,
    color: colors.black,
    flex: 1,
  },
});

type InputPinInTimeProps = {
  countdown: boolean;
  authorized?: boolean;
  editable: boolean;
  clickable: boolean;
  duration: number;
  onTimeout: () => void;
  onPress: (v: string) => void;
  forwardRef?: React.MutableRefObject<TextInput | null>;
  style?: ViewStyle;
};

const InputPinInTime: React.FC<InputPinInTimeProps> = (props) => {
  const {
    countdown,
    authorized,
    editable,
    onTimeout,
    onPress,
    forwardRef,
    style,
  } = props;
  const [pin, setPin] = useState('');
  const [duration, setDuration] = useState(0);
  const [timeoutFlag, setTimeoutFlag] = useState(false);

  useInterval(
    () => {
      if (duration > 0) setDuration((prev) => prev - 1);
      else onTimeout();
    },
    duration > 0 ? 1000 : null,
  );

  const init = useCallback(() => {
    setPin('');
    setTimeoutFlag(false);

    if (countdown) setDuration(props.duration);
  }, [countdown, props.duration]);

  const onClick = useCallback(() => {
    if (forwardRef?.current) forwardRef.current.focus();
  }, [forwardRef]);

  const clickable = props.clickable && _.size(pin) === 6;
  const min = Math.floor(duration / 60);
  const sec = Math.floor(duration - min * 60);

  useEffect(() => {
    init();
    return () => {
      setDuration(0);
    };
  }, [init]);

  useEffect(() => {
    if (countdown) {
      init();
    } else {
      setDuration(0);
    }
  }, [countdown, init]);

  useEffect(() => {
    if (authorized) {
      setDuration(0);
      setTimeoutFlag(false);
    }
  }, [authorized]);

  return (
    <View>
      <View style={[styles.container, style]}>
        <TouchableOpacity
          style={[
            styles.inputWrapper,
            _.size(pin) <= 0 ? styles.emptyWrapper : {},
          ]}
          onPress={onClick}
          activeOpacity={1}>
          <AppTextInput
            {...props}
            placeholder={i18n.t('mobile:auth')}
            placeholderTextColor={colors.greyish}
            ref={forwardRef}
            keyboardType="numeric"
            enablesReturnKeyAutomatically
            maxLength={6}
            clearTextOnFocus
            onFocus={() => setPin('')} //  android - clearTextOnFocus 수동적용
            onChangeText={setPin}
            value={pin}
            style={styles.input}
            textContentType="oneTimeCode"
          />

          {countdown ? (
            <AppText style={styles.timer}>
              {' '}
              {min > 0 ? min + i18n.t('min') : ''}{' '}
              {sec.toString().padStart(2, '0')}
              {i18n.t('sec')}{' '}
            </AppText>
          ) : null}
        </TouchableOpacity>
        <AppButton
          disabled={!clickable}
          onPress={() => onPress && onPress(pin)}
          titleStyle={styles.title}
          title={i18n.t('ok')}
          disableColor={colors.white}
        />
      </View>
      <View style={styles.helpBox}>
        <AppText
          style={[
            styles.helpText,
            {color: authorized ? colors.clearBlue : colors.tomato},
          ]}>
          {typeof authorized === 'undefined' && !timeoutFlag
            ? null
            : i18n.t(
                // eslint-disable-next-line no-nested-ternary
                timeoutFlag
                  ? 'mobile:timeout'
                  : authorized
                  ? 'mobile:authMatch'
                  : 'mobile:authMismatch',
              )}
        </AppText>
        {authorized ? null : (
          <AppText style={[styles.helpText, {color: colors.warmGrey}]}>
            {i18n.t('mobile:inputInTime')}
          </AppText>
        )}
      </View>
    </View>
  );
};

export default InputPinInTime;
