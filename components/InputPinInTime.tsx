import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AppState,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import _ from 'underscore';
import moment, {Moment} from 'moment';
import {useInterval} from '@/utils/useInterval';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AppButton from './AppButton';
import AppText from './AppText';
import AppTextInput from './AppTextInput';
import AppStyledText from './AppStyledText';
import AppSvgIcon from './AppSvgIcon';

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
    marginRight: 8,
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
  referrerNaver: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    alignItems: 'flex-start',
    marginTop: 16,
  },
  referrerText: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.black,
  },
  referrerTextBold: {
    ...appStyles.bold14Text,
    lineHeight: 20,
    color: colors.naverGreen,
  },
  referrer: {
    marginTop: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  triangle: {
    width: 11,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 11,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.black92,
  },
  textFrame: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 3,
    backgroundColor: colors.black92,
  },
  text: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.white,
  },
  textBold: {
    ...appStyles.bold14Text,
    lineHeight: 20,
    color: colors.lightYellow2,
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
  referrer?: string;
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
  referrer,
  ...props
}) => {
  const fromNaver = useMemo(() => referrer === 'naver', [referrer]);
  const [pin, setPin] = useState('');
  const [duration, setDuration] = useState(0);
  const [timeoutFlag, setTimeoutFlag] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<TextInput>();

  const backgroundTimeRef = useRef<Moment>(); // background 시점 시간, listener 내부함수에 써야해서 ref 사용

  const getBackgroundDuration = useCallback(() => {
    const now = moment();

    const second = backgroundTimeRef?.current
      ? backgroundTimeRef.current.diff(now, 'seconds')
      : 0;

    if (backgroundTimeRef?.current) {
      console.log(
        '@@@ 줄어드는 시간 체크해보기 : ',
        backgroundTimeRef.current.diff(now, 'seconds'),
      );
    }

    return second;
  }, []);

  useInterval(
    () => {
      if (duration > 0) setDuration((prev) => prev - 1);
      else {
        onTimeout();
        setTimeoutFlag(true);
      }
    },
    duration > 0 ? 1000 : null,
  );

  const appState = useRef('unknown');

  useEffect(() => {
    if (appState.current === 'unknown') {
      appState.current = 'setting';

      console.log('@setting...');
      AppState.addEventListener('change', (nextAppState) => {
        console.log('@@@@@ nextAppState : ', nextAppState);

        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          setDuration((prev) =>
            prev + getBackgroundDuration() < 0
              ? 0
              : prev + getBackgroundDuration(),
          );
        }

        if (nextAppState.match(/inactive|background/)) {
          backgroundTimeRef.current = moment();
        }

        appState.current = nextAppState;
      });
    }
  }, [getBackgroundDuration]);

  useEffect(() => {
    if (inputRef) {
      inputRef.current = {
        focus: () => ref.current?.focus(),
        reset: () => {
          setPin('');
          setDuration(0);
          setTimeoutFlag(false);
          backgroundTimeRef.current = undefined;
        },
      };
    }
  }, [inputRef]);

  const init = useCallback(() => {
    setTimeoutFlag(false);
    if (countdown) {
      setDuration(props.duration);
    }
  }, [countdown, props.duration]);

  const clickable = props.clickable && _.size(pin) === 6;

  // 왜 두번 실행?
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
          {`${
            i18n.t('mobile:timeLeft') +
            Math.floor(duration / 60)
              .toString()
              .padStart(2, '0')
          }:${Math.floor(duration % 60)
            .toString()
            .padStart(2, '0')}`}
        </AppText>
      ) : referrer ? (
        fromNaver ? (
          <View style={styles.referrerNaver}>
            <AppSvgIcon name="naverIconNew" />
            <AppStyledText
              text={i18n.t('socialLogin:from:naver:ment')}
              textStyle={styles.referrerText}
              format={{b: styles.referrerTextBold}}
            />
          </View>
        ) : (
          <View style={styles.referrer}>
            <View style={styles.triangle} />
            <View style={styles.textFrame}>
              <AppStyledText
                text={i18n.t('socialLogin:from:referrer:ment')}
                textStyle={styles.text}
                format={{b: styles.textBold}}
              />
            </View>
          </View>
        )
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
