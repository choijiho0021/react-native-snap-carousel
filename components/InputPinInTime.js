import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
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

class InputPinInTime extends Component {
  constructor(props) {
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
    this.onChangeText = this.onChangeText.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    this.init(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.countdown !== prevProps.countdown) {
      if (this.props.countdown) {
        this.init(this.props);
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

  init = ({duration, countdown}) => {
    this.setState({
      pin: '',
      duration: parseInt(duration, 10) || 0,
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

  onChangeText = (key) => (value) => {
    this.setState({
      [key]: value,
    });
  };

  onPress = () => {
    const {pin} = this.state;
    const {onPress} = this.props;

    if (_.isFunction(onPress)) {
      onPress(pin);
    }
  };

  onClick = () => {
    if (this.props.forwardRef && this.props.forwardRef.current)
      this.props.forwardRef.current.focus();
  };

  render() {
    const {pin, duration, timeout} = this.state;
    const {forwardRef, authorized, countdown, editable} = this.props;
    const clickable = this.props.clickable && _.size(pin) === 6;

    const min = Math.floor(duration / 60);
    const sec = Math.floor(duration - min * 60);

    return (
      <View>
        <View style={[styles.container, this.props.style]}>
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
              enablesReturnKeyAutomaticalllCy
              maxLength={6}
              clearTextOnFocus
              autoFocus={editable}
              onFocus={() => {
                this.setState({pin: ''});
              }} //  android - clearTextOnFocus 수동적용
              onChangeText={this.onChangeText('pin')}
              value={pin}
              style={styles.input}
              textContentType={'oneTimeCode'}
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
            onPress={this.onPress}
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
