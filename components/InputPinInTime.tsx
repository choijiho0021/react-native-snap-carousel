import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
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
    borderWidth: 1,
    borderRadius: 3,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginRight: 10,
  },
  timer: {
    ...appStyles.medium14,
    color: colors.redError,
    lineHeight: 20,
    marginTop: 6,
  },
  button: {
    height: 50,
    width: 80,
    borderRadius: 3,
    backgroundColor: colors.clearBlue,
  },
  title: {
    ...appStyles.semiBold16Text,
    textAlign: 'center',
    color: colors.white,
  },
  helpBox: {
    marginTop: 13,
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

export type InputPinRef = {
  focus: () => void;
  reset: () => void;
};

type InputPinInTimeProps = {
  countdown: boolean;
  authorized?: boolean;
  clickable: boolean;
  duration: number;
  onTimeout: () => void;
  onPress: (v: string) => void;
  inputRef?: React.MutableRefObject<InputPinRef | null>;
  style?: ViewStyle;
};

const InputPinInTime: React.FC<
  InputPinInTimeProps & PropsWithChildren<TextInputProps>
> = ({
  countdown,
  authorized,
  onTimeout,
  onPress,
  inputRef,
  style,
  ...props
}) => {
  const [pin, setPin] = useState('');
  const [duration, setDuration] = useState(0);
  const [timeoutFlag, setTimeoutFlag] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<TextInput>();

  useInterval(
    () => {
      if (duration > 0) setDuration((prev) => prev - 1);
      else onTimeout();
    },
    duration > 0 ? 1000 : null,
  );

  useEffect(() => {
    if (inputRef) {
      inputRef.current = {
        focus: () => ref.current?.focus(),
        reset: () => {
          setPin('');
          setDuration(0);
          setTimeoutFlag(false);
        },
      };
    }
  }, [inputRef]);

  const init = useCallback(() => {
    setTimeoutFlag(false);

    if (countdown) setDuration(props.duration);
  }, [countdown, props.duration]);

  const clickable = props.clickable && _.size(pin) === 6;

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
        <AppTextInput
          showCancel
          containerStyle={{
            ...styles.inputWrapper,
            borderColor: focused ? colors.clearBlue : colors.lightGrey,
          }}
          {...props}
          placeholder={i18n.t('mobile:auth')}
          placeholderTextColor={colors.greyish}
          ref={ref}
          keyboardType="numeric"
          enablesReturnKeyAutomatically
          maxLength={6}
          clearTextOnFocus
          onFocus={() => {
            setPin('');
            setFocused(true);
          }} //  android - clearTextOnFocus 수동적용
          onBlur={() => setFocused(false)}
          onChangeText={setPin}
          value={pin}
          style={styles.input}
          textContentType="oneTimeCode"
          onCancel={() => setPin('')}
        />
        <AppButton
          style={styles.button}
          disabled={!clickable}
          onPress={() => onPress && onPress(pin)}
          titleStyle={styles.title}
          title={i18n.t('ok')}
          disableColor={colors.lightGrey}
          disableBackgroundColor={colors.backGrey}
        />
      </View>
      {countdown ? (
        <AppText style={styles.timer}>
          {i18n.t('mobile:timeLeft') +
            Math.floor(duration / 60)
              .toString()
              .padStart(2, '0') +
            ':' +
            Math.floor(duration % 60)
              .toString()
              .padStart(2, '0')}
        </AppText>
      ) : null}
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
      </View>
    </View>
  );
};

export default InputPinInTime;
