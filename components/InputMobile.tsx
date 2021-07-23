import React, {Component} from 'react';
import {StyleSheet, View, Text, ViewStyle, StyleProp} from 'react-native';
import _ from 'underscore';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import utils from '@/submodules/rokebi-utils/utils';
import validationUtil from '@/utils/validationUtil';
import AppTextInput from './AppTextInput';

const styles = StyleSheet.create({
  button: {
    width: 90,
    height: 40,
  },
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
  pickerWrapper: {
    ...appStyles.borderWrapper,
    width: 76,
    paddingLeft: 10,
    paddingVertical: 8,
    marginRight: 10,
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
};
type InputMobileState = {
  mobile: string;
  waiting: boolean;
  errors?: object;
};
class InputMobile extends Component<InputMobileProps, InputMobileState> {
  mounted: boolean;

  timer?: NodeJS.Timeout;

  constructor(props: InputMobileProps) {
    super(props);

    this.state = {
      // prefix: "010",
      mobile: '',
      errors: undefined,
      waiting: false,
    };

    this.onChangeText = this.onChangeText.bind(this);
    this.validate = this.validate.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onTimer = this.onTimer.bind(this);

    this.mounted = false;
    this.timer = undefined;
  }

  componentDidMount() {
    this.mounted = true;
    this.validate();
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  onChangeText = (key: keyof InputMobileState) => (value) => {
    this.setState({
      [key]: value,
    });

    if (key === 'mobile') value = utils.toPhoneNumber(value);

    this.validate(key, value);
  };

  onPress() {
    const {mobile} = this.state;

    if (typeof this.props.onPress === 'function' && !this.timer) {
      this.props.onPress(mobile.replace(/-/g, ''));
    }
    this.onTimer();
  }

  validate = (key: keyof InputMobileState, value) => {
    const {mobile} = this.state;
    const val = {
      mobile,
      [key]: value,
    };

    const errors = validationUtil.validateAll(val);
    this.setState({
      errors,
    });

    return errors;
  };

  onTimer = () => {
    this.setState({waiting: true});
    this.timer = setTimeout(() => {
      if (this.mounted) {
        this.setState({waiting: false});
      }
      this.timer = undefined;
    }, 15000);
  };

  error(key: keyof InputMobileState) {
    const {errors} = this.state;
    return !_.isEmpty(errors) && errors[key] ? errors[key][0] : '';
  }

  render() {
    const {mobile, waiting} = this.state;
    const {authNoti, authorized, style} = this.props;

    const disabled = this.props.disabled || waiting;
    const clickable =
      _.isEmpty(this.error('mobile')) &&
      (!authNoti || !waiting) &&
      !this.props.disabled;

    return (
      <View>
        <View style={[styles.container, style]}>
          <View style={{flex: 1}}>
            <AppTextInput
              placeholder={i18n.t('mobile:input')}
              placeholderTextColor={colors.greyish}
              keyboardType="numeric"
              // returnKeyType='done'
              enablesReturnKeyAutomatically
              maxLength={13}
              blurOnSubmit={false}
              onChangeText={this.onChangeText('mobile')}
              error={this.error('mobile')}
              onPress={this.onPress}
              title={
                authNoti
                  ? i18n.t('mobile:resendAuth')
                  : i18n.t('mobile:sendAuth')
              }
              disabled={disabled}
              clickable={clickable}
              titleStyle={styles.text}
              inputStyle={[styles.inputStyle, mobile ? {} : styles.emptyInput]}
              value={utils.toPhoneNumber(mobile)}
            />
          </View>
        </View>
        {authNoti && typeof authorized === undefined && (
          <Text style={styles.helpText}>{i18n.t('reg:authNoti')}</Text>
        )}
      </View>
    );
  }
}

export default InputMobile;
