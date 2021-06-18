import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import _ from 'underscore';
import i18n from '../utils/i18n';
import {colors} from '../constants/Colors';
import Triangle from './Triangle';
import {appStyles} from '../constants/Styles';

const DIRECT_INPUT = 'direct';
const domains = [
  {
    label: i18n.t('email:input'),
    value: DIRECT_INPUT,
  },
  {
    label: 'Naver',
    value: 'naver.com',
  },
  {
    label: 'Gmail',
    value: 'gmail.com',
  },
  {
    label: 'Daum',
    value: 'daum.net',
  },
  {
    label: 'Hanmail',
    value: 'hanmail.net',
  },
];

const styles = StyleSheet.create({
  noDirectInput: {
    color: colors.black,
  },
  directInput: {
    color: colors.warmGrey,
  },
  emptyInput: {
    ...appStyles.normal16Text,
    borderBottomColor: colors.lightGrey,
    borderColor: colors.lightGrey,
    color: colors.lightGrey,
  },
  textInputWrapper: {
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    marginRight: 10,
    paddingLeft: 10,
  },
  textInput: {
    ...appStyles.normal16Text,
    paddingTop: 9,
    color: colors.black,
    paddingBottom: 7,
    textAlignVertical: 'center',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'stretch',
  },
  pickerWrapper: {
    ...appStyles.borderWrapper,
    width: 96,
    borderColor: colors.black,
    marginTop: 5,
  },
  placeholder: {
    ...appStyles.normal14Text,
    lineHeight: 19,
    paddingLeft: 10,
    paddingVertical: 8,
    height: '100%',
  },
  inputIOS: {
    paddingLeft: 10,
    paddingVertical: 8,
  },
  infoText: {
    marginTop: 15,
    color: colors.clearBlue,
  },
});

class InputEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      domain: '',
      domainIdx: DIRECT_INPUT,
    };

    this.onChangeText = this.onChangeText.bind(this);
    this.focusInput = this.focusInput.bind(this);
    this.openPicker = this.openPicker.bind(this);
    this.emailRef = React.createRef();
    this.domainRef = React.createRef();
    this.pickerRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this);
    }
  }

  onChangeText = (key) => (value) => {
    value = _.isEmpty(value) ? '' : value.replace(/\s+/g, '');

    this.setState({
      [key]: value,
    });

    if (key === 'domainIdx' && value !== DIRECT_INPUT) {
      // update domain name
      this.setState({
        domain: value,
      });
    }
  };

  focusInput = () => {
    if (this.emailRef.current) this.emailRef.current.focus();
  };

  openPicker = () => {
    if (this.pickerRef.current) this.pickerRef.current.togglePicker();
  };

  render() {
    const {domain, email, domainIdx} = this.state;

    return (
      <View style={this.props.style}>
        <View style={styles.container}>
          <TouchableOpacity
            style={[
              styles.textInputWrapper,
              email ? {} : styles.emptyInput,
              {flex: 1},
            ]}
            onPress={this.focusInput}
            activeOpacity={1}>
            <TextInput
              style={[styles.textInput, email ? {} : styles.emptyInput]}
              placeholder={i18n.t('reg:email')}
              placeholderTextColor={colors.greyish}
              returnKeyType="next"
              enablesReturnKeyAutomatically
              onChangeText={this.onChangeText('email')}
              autoCapitalize="none"
              ref={this.emailRef}
              value={email}
            />
          </TouchableOpacity>

          <Text
            style={[
              appStyles.normal12Text,
              styles.textInput,
              email ? {} : styles.emptyInput,
            ]}>
            @
          </Text>

          <TouchableOpacity
            style={[
              styles.textInputWrapper,
              domain ? {} : styles.emptyInput,
              {flex: 1, marginLeft: 10},
            ]}
            onPress={() => {
              if (this.domainRef.current) this.domainRef.current.focus();
            }}
            activeOpacity={1}>
            <TextInput
              style={[styles.textInput, domain ? {} : styles.emptyInput]}
              returnKeyType="next"
              enablesReturnKeyAutomatically
              editable={domainIdx === DIRECT_INPUT}
              onChangeText={this.onChangeText('domain')}
              autoCapitalize="none"
              ref={this.domainRef}
              value={domain}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pickerWrapper,
              domainIdx === DIRECT_INPUT ? styles.emptyInput : {},
            ]}
            onPress={this.openPicker}
            activeOpacity={1}>
            <RNPickerSelect
              style={{
                placeholder: styles.placeholder,
                inputIOS: [
                  styles.inputIOS,
                  domainIdx === DIRECT_INPUT
                    ? styles.directInput
                    : styles.noDirectInput,
                ],
                inputAndroid: [
                  styles.placeholder,
                  domainIdx === DIRECT_INPUT
                    ? styles.directInput
                    : styles.noDirectInput,
                ],
                iconContainer: {
                  bottom: 14,
                  right: 10,
                },
                inputAndroidContainer: {
                  bottom: -1,
                },
              }}
              placeholder={{}}
              onValueChange={this.onChangeText('domainIdx')}
              items={domains}
              value={domainIdx}
              useNativeAndroidPickerStyle={false}
              ref={this.pickerRef}
              Icon={() => {
                return (
                  <Triangle width={8} height={6} color={colors.warmGrey} />
                );
              }}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.infoText}>{i18n.t('mypage:mailInfo')}</Text>
      </View>
    );
  }
}

export default InputEmail;
