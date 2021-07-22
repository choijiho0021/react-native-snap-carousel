import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ViewStyle,
  StyleProp,
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

export type InputEmailRef = {
  focus: () => void;
  getValue: () => {email: string; domain: string};
};

type InputEmailProps = {
  style?: StyleProp<ViewStyle>;
  inputRef?: React.MutableRefObject<InputEmailRef|null>;
};
type InputEmailState = {
  email: string;
  domain: string;
  domainIdx: string;
};
class InputEmail extends Component<InputEmailProps, InputEmailState> {
  emailRef: React.RefObject<TextInput>;

  domainRef: React.RefObject<TextInput>;

  pickerRef: React.RefObject<RNPickerSelect>;

  constructor(props: InputEmailProps) {
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
    if (this.props.inputRef) {
      const {email, domain} = this.state;
      this.props.inputRef.current = {
        getValue: () => ({email, domain}),
        focus:() => this.emailRef.current?.focus();
      }
    }
  }

  onChangeText = (key: keyof InputEmailState) => (value: string) => {
    const val = _.isEmpty(value) ? '' : value.replace(/\s+/g, '');

    this.setState({
      [key]: val,
    });

    if (key === 'domainIdx' && value !== DIRECT_INPUT) {
      // update domain name
      this.setState({
        domain: value,
      });
    }
  };

  focusInput = () => {
    this.emailRef.current?.focus();
  };

  openPicker = () => {
    this.pickerRef.current?.togglePicker();
  };

  render() {
    const {domain, email, domainIdx} = this.state;
    const inputStyle =
      domainIdx === DIRECT_INPUT ? styles.directInput : styles.noDirectInput;

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
                inputIOS: {
                  ...styles.inputIOS,
                  ...inputStyle,
                },
                inputAndroid: {
                  ...styles.placeholder,
                  ...inputStyle,
                },
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
              Icon={() => (
                <Triangle width={8} height={6} color={colors.warmGrey} />
              )}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.infoText}>{i18n.t('mypage:mailInfo')}</Text>
      </View>
    );
  }
}

export default InputEmail;
