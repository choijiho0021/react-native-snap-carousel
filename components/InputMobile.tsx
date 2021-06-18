import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import _ from 'underscore';
import i18n from '../utils/i18n';
import AppTextInput from './AppTextInput';
import {colors} from '../constants/Colors';
import {appStyles} from '../constants/Styles';
import utils from '../utils/utils';
import validationUtil from '../utils/validationUtil';

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

class InputMobile extends Component {
  constructor(props) {
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
    this.onClick = this.onClick.bind(this);
    this.onTimer = this.onTimer.bind(this);

    this.ref = React.createRef();
    this.mounted = null;
    this.timer = null;
  }

  componentDidMount() {
    this.mounted = true;
    this.validate();

    if (this.props.onRef) {
      this.props.onRef(this);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onChangeText = (key) => (value) => {
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

  onClick() {
    if (this.ref.current) this.ref.current.focus();
  }

  validate = (key, value) => {
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
      this.timer = null;
    }, 15000);
  };

  error(key) {
    const {errors} = this.state;
    return !_.isEmpty(errors) && errors[key] ? errors[key][0] : '';
  }

  render() {
    const {mobile, waiting} = this.state;
    const {authNoti, authorized} = this.props;

    const disabled = this.props.disabled || waiting;
    const clickable =
      _.isEmpty(this.error('mobile')) &&
      (!authNoti || !waiting) &&
      !this.props.disabled;

    return (
      <View>
        <View style={[styles.container, this.props.style]}>
          {/*
          <View style={styles.pickerWrapper}>
            <RNPickerSelect style={{
              ... pickerSelectStyles,
              iconContainer: {
                bottom: 5,
                right: 10,
              },}}
              placeholder={{}}
              onValueChange={this._onChangeText("prefix")}
              items={["010", "011", "017", "018", "019"].map(item => ({
                label: item, value: item
              }))}
              value={prefix}
              Icon={() => {
                return (<Triangle width={8} height={6} color={colors.warmGrey}/>)
              }}
            />
          </View>
          */}

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
              ref={this.ref}
              value={utils.toPhoneNumber(mobile)}
            />
          </View>
        </View>
        {authNoti && typeof authorized === 'undefined' && (
          <Text style={styles.helpText}>{i18n.t('reg:authNoti')}</Text>
        )}
      </View>
    );
  }
}

export default InputMobile;
