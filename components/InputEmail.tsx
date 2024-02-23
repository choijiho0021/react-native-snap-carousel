import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  Pressable,
  View,
  ViewStyle,
} from 'react-native';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppText from './AppText';
import AppTextInput from './AppTextInput';
import Triangle from './Triangle';

export const emailDomainList = {
  'icloud.com': 'Apple',
  'naver.com': 'Naver',
  'gmail.com': 'Gmail',
  'daum.net': 'Daum',
  'hanmail.net': 'Hanmail',
  'kakao.com': 'Kakao',
  'hotmail.com': 'Hotmail',
  'yahoo.com': 'Yahoo',
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
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
  onPressPicker?: () => void;
};

const InputEmail: React.FC<InputEmailProps> = ({
  style,
  inputRef,
  value,
  onChange,
  onPressPicker = () => {},
}) => {
  const emailRef = useRef<TextInput>();
  const domainRef = useRef<TextInput>();
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [isDirectInput, setIsDirectInput] = useState(true);

  useEffect(() => {
    const m = value?.split('@');
    if (m && m?.length > 1) {
      setEmail(m[0]);
      setDomain(m[1]);
      setIsDirectInput(!emailDomainList.hasOwnProperty(m[1]));
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
      setIsDirectInput(!emailDomainList.hasOwnProperty(v));
      onChange?.(`${email}@${v}`);
    },
    [email, onChange],
  );

  useEffect(() => {
    if (inputRef) {
      inputRef.current = {
        focus: () => emailRef.current?.focus(),
      };
    }
  }, [domain, email, inputRef]);

  return (
    <View style={style}>
      <View style={styles.container}>
        <Pressable
          style={[
            styles.textInputWrapper,
            email ? {} : styles.emptyInput,
            {flex: 1},
          ]}
          onPress={() => emailRef.current?.focus()}>
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
        </Pressable>

        <AppText
          style={[
            appStyles.normal12Text,
            styles.textInput,
            email ? {} : styles.emptyInput,
          ]}>
          @
        </AppText>

        <Pressable
          style={[
            styles.textInputWrapper,
            domain ? {} : styles.emptyInput,
            {flex: 1, marginLeft: 10},
          ]}
          onPress={() => domainRef.current?.focus()}>
          <AppTextInput
            style={[styles.textInput, domain ? {} : styles.emptyInput]}
            returnKeyType="next"
            enablesReturnKeyAutomatically
            editable={isDirectInput}
            onChangeText={chgDomain}
            autoCapitalize="none"
            ref={domainRef}
            value={domain}
          />
        </Pressable>

        <Pressable
          style={[styles.pickerWrapper, isDirectInput ? styles.emptyInput : {}]}
          onPress={onPressPicker}>
          <View style={styles.row}>
            <AppText
              style={[
                styles.placeholder,
                {color: isDirectInput ? colors.warmGrey : colors.black},
              ]}>
              {isDirectInput ? i18n.t('email:input') : emailDomainList[domain]}
            </AppText>
            <Triangle width={8} height={6} color={colors.warmGrey} />
          </View>
        </Pressable>
      </View>
      <AppText style={styles.infoText}>{i18n.t('mypage:mailInfo')}</AppText>
    </View>
  );
};

export default memo(InputEmail);
