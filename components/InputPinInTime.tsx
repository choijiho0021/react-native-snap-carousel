import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import _ from 'underscore';
import i18n from '../utils/i18n';
import AppButton from './AppButton';
import {colors} from '../constants/Colors';
import {appStyles} from '../constants/Styles';

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
  helpTextMargin: {
    marginTop: 30,
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
  forwardRef: React.MutableRefObject<TextInput | null>;
  style?: ViewStyle;
};

type InputPinInTimeState = {
  pin: string;
  duration: number;
  timeout: boolean;
};

class InputPinInTime extends Component<
  InputPinInTimeProps,
  InputPinInTimeState
> {
  interval: NodeJS.Timeout | null;

  constructor(props: InputPinInTimeProps) {
    super(props);

    this.state = {
      pin: '',
      duration: 0,
      timeout: false,
    };

    this.interval = null;

    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.timeout = this.timeout.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps: InputPinInTimeProps) {
    if (this.props.countdown !== prevProps.countdown) {
      if (this.props.countdown) {
        this.init();
      } else {
        this.pause();
      }
    }

    if (
      this.props.authorized &&
      this.props.authorized !== prevProps.authorized
    ) {
      this.pause();
      this.setState({
        timeout: false,
      });
    }
  }

  componentWillUnmount() {
    this.pause();
  }

  init = () => {
    const {duration, countdown} = this.props;

    this.setState({
      pin: '',
      duration,
      timeout: false,
    });

    if (countdown) {
      this.pause();
      this.start();
    }
  };

  start = () => {
    this.interval = setInterval(() => {
      const {duration} = this.state;

      if (duration - 1 <= 0) {
        this.setState({
          duration: 0,
          timeout: true,
        });
        this.pause();
        this.timeout();
      } else {
        this.setState({
          duration: duration - 1,
        });
      }
    }, 1000);
  };

  pause = () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };

  timeout = () => {
    const {onTimeout} = this.props;

    if (_.isFunction(onTimeout)) {
      onTimeout();
    }
  };

  onClick = () => {
    if (this.props.forwardRef && this.props.forwardRef.current)
      this.props.forwardRef.current.focus();
  };

  render() {
    const {pin, duration, timeout} = this.state;
    const {style, forwardRef, authorized, countdown, editable, onPress} =
      this.props;
    const clickable = this.props.clickable && _.size(pin) === 6;

    const min = Math.floor(duration / 60);
    const sec = Math.floor(duration - min * 60);

    return (
      <View>
        <View style={[styles.container, style]}>
          <TouchableOpacity
            style={[
              styles.inputWrapper,
              _.size(pin) <= 0 ? styles.emptyWrapper : {},
            ]}
            onPress={this.onClick}
            activeOpacity={1}>
            <TextInput
              {...this.props}
              placeholder={i18n.t('mobile:auth')}
              placeholderTextColor={colors.greyish}
              ref={forwardRef}
              keyboardType="numeric"
              enablesReturnKeyAutomatically
              maxLength={6}
              clearTextOnFocus
              autoFocus={editable}
              onFocus={() => {
                this.setState({pin: ''});
              }} //  android - clearTextOnFocus 수동적용
              onChangeText={(value: string) => this.setState({pin: value})}
              value={pin}
              style={styles.input}
              textContentType="oneTimeCode"
            />

            {countdown ? (
              <Text style={styles.timer}>
                {' '}
                {min > 0 ? min + i18n.t('min') : ''}{' '}
                {sec.toString().padStart(2, '0')}
                {i18n.t('sec')}{' '}
              </Text>
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
          <Text
            style={[
              styles.helpText,
              {color: authorized ? colors.clearBlue : colors.tomato},
            ]}>
            {typeof authorized === 'undefined' && !timeout
              ? null
              : i18n.t(
                  // eslint-disable-next-line no-nested-ternary
                  timeout
                    ? 'mobile:timeout'
                    : authorized
                    ? 'mobile:authMatch'
                    : 'mobile:authMismatch',
                )}
          </Text>
          {authorized ? null : (
            <Text
              style={[
                styles.helpText,
                styles.helpTextMargin,
                {color: colors.warmGrey},
              ]}>
              {i18n.t('mobile:inputInTime')}
            </Text>
          )}
        </View>
      </View>
    );
  }
}

export default InputPinInTime;
