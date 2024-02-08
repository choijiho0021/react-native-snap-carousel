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

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  textInputWrapper: {
    flex: 1,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  textInput: {
    ...appStyles.medium16,
    color: colors.greyish,
    textAlignVertical: 'center',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  domain?: string;
  onChange?: (email: string) => void;
  onPress?: () => void;
};

const InputEmail: React.FC<InputEmailProps> = ({
  style,
  inputRef,
  value,
  domain,
  onChange,
  onPress = () => {},
}) => {
  const emailRef = useRef<TextInput>();
  const domainRef = useRef<TextInput>();
  const [email, setEmail] = useState('');
  const [isDirectInput, setIsDirectInput] = useState(true);

  useEffect(() => {
    const m = value?.split('@');
    if (m && m?.length > 1) {
      setEmail(m[0]);
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
          style={styles.textInputWrapper}
          onPress={() => emailRef.current?.focus()}>
          <AppTextInput
            style={styles.textInput}
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

        <AppText style={[appStyles.medium16, {marginHorizontal: 6}]}>@</AppText>

        {/* <Pressable
          style={[styles.textInputWrapper, {flex: 1, marginLeft: 10}]}
          onPress={() => domainRef.current?.focus()}>
          <AppTextInput
            style={[styles.textInput]}
            returnKeyType="next"
            enablesReturnKeyAutomatically
            editable={isDirectInput}
            onChangeText={chgDomain}
            autoCapitalize="none"
            ref={domainRef}
            value={domain}
          />
        </Pressable> */}

        <Pressable style={styles.textInputWrapper} onPress={onPress}>
          <View style={styles.row}>
            <AppText
              style={[
                appStyles.medium16,
                {color: domain ? colors.black : colors.greyish},
              ]}>
              {domain || i18n.t('email:input')}
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
