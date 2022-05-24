import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import i18n, {i18nEvent} from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppText from './AppText';
import AppTextInput from './AppTextInput';
import Triangle from './Triangle';

const DIRECT_INPUT = 'direct';
let domains: {label: string; value: string}[] = [];

i18nEvent.on('loaded', () => {
  domains = [
    {
      label: i18n.t('email:input'),
      value: DIRECT_INPUT,
    },
    {
      label: 'Apple',
      value: 'icloud.com',
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
    {
      label: 'Kakao',
      value: 'kakao.com',
    },
    {
      label: 'Hotmail',
      value: 'hotmail.com',
    },
    {
      label: 'Yahoo',
      value: 'yahoo.com',
    },
  ];
});

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
};

type InputEmailProps = {
  style?: StyleProp<ViewStyle>;
  inputRef?: React.MutableRefObject<InputEmailRef | null>;
  value?: string;
  onChange?: (email: string) => void;
};

const InputEmail: React.FC<InputEmailProps> = ({
  style,
  inputRef,
  value,
  onChange,
}) => {
  const emailRef = useRef<TextInput>(null);

  const domainRef = useRef<TextInput>(null);

  const pickerRef = useRef<RNPickerSelect>(null);

  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [domainIdx, setDomainIdx] = useState(DIRECT_INPUT);

  useEffect(() => {
    const m = value?.split('@');
    if (m && m?.length > 1) {
      setEmail(m[0]);
      setDomain(m[1]);
    }
  }, [value]);

  const chgAddr = useCallback(
    (v: string) => {
      setEmail(v);
      onChange?.(`${v}@${domain}`);
    },
    [domain, onChange],
  );

  const chgDomain = useCallback(
    (v: string) => {
      setDomain(v);
      onChange?.(`${email}@${v}`);
    },
    [email, onChange],
  );

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current = {
        focus: () => emailRef.current?.focus(),
      };
    }
  }, [domain, email, inputRef]);

  const inputStyle = useMemo(
    () =>
      domainIdx === DIRECT_INPUT ? styles.directInput : styles.noDirectInput,
    [domainIdx],
  );

  return (
    <View style={style}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.textInputWrapper,
            email ? {} : styles.emptyInput,
            {flex: 1},
          ]}
          onPress={() => emailRef.current?.focus()}
          activeOpacity={1}>
          <AppTextInput
            style={[styles.textInput, email ? {} : styles.emptyInput]}
            placeholder={i18n.t('reg:email')}
            placeholderTextColor={colors.greyish}
            returnKeyType="next"
            enablesReturnKeyAutomatically
            onChangeText={chgAddr}
            autoCapitalize="none"
            ref={emailRef}
            value={email}
          />
        </TouchableOpacity>

        <AppText
          style={[
            appStyles.normal12Text,
            styles.textInput,
            email ? {} : styles.emptyInput,
          ]}>
          @
        </AppText>

        <TouchableOpacity
          style={[
            styles.textInputWrapper,
            domain ? {} : styles.emptyInput,
            {flex: 1, marginLeft: 10},
          ]}
          onPress={() => domainRef.current?.focus()}
          activeOpacity={1}>
          <AppTextInput
            style={[styles.textInput, domain ? {} : styles.emptyInput]}
            returnKeyType="next"
            enablesReturnKeyAutomatically
            editable={domainIdx === DIRECT_INPUT}
            onChangeText={chgDomain}
            autoCapitalize="none"
            ref={domainRef}
            value={domain}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.pickerWrapper,
            domainIdx === DIRECT_INPUT ? styles.emptyInput : {},
          ]}
          onPress={() => pickerRef.current?.togglePicker()}
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
            onValueChange={(val) => {
              setDomainIdx(val);
              if (val !== DIRECT_INPUT) chgDomain(val);
            }}
            items={domains}
            value={domainIdx}
            useNativeAndroidPickerStyle={false}
            ref={pickerRef}
            Icon={() => (
              <Triangle width={8} height={6} color={colors.warmGrey} />
            )}
          />
        </TouchableOpacity>
      </View>
      <AppText style={styles.infoText}>{i18n.t('mypage:mailInfo')}</AppText>
    </View>
  );
};

export default InputEmail;
