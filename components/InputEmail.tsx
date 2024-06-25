import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StyleSheet, TextInput, Pressable, View} from 'react-native';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppText from './AppText';
import AppTextInput from './AppTextInput';
import validationUtil from '@/utils/validationUtil';
import {API} from '@/redux/api';
import AppIcon from './AppIcon';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  wrapper: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: colors.lightGrey,
    paddingLeft: 16,
    height: 50,
  },
  textInput: {
    ...appStyles.medium16,
    color: colors.greyish,
    textAlignVertical: 'center',
    height: 50,
    flex: 1,
    lineHeight: undefined,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helpText: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.clearBlue,
  },
});

export type InputEmailRef = {
  focus: () => void;
  blur: () => void;
};

type InputEmailProps = {
  inputRef?: React.MutableRefObject<InputEmailRef | null>;
  currentEmail?: string; // current email
  socialEmail?: string;
  domain: string;
  placeholder?: string;
  onChange?: (email: string) => void;
  onPress?: () => void;
};

const InputEmail: React.FC<InputEmailProps> = ({
  inputRef,
  currentEmail,
  socialEmail,
  domain,
  placeholder,
  onChange,
  onPress = () => {},
}) => {
  const emailRef = useRef<TextInput>();
  const [email, setEmail] = useState(socialEmail || '');
  const [focused, setFocused] = useState(false);
  const [inValid, setInValid] = useState('');
  const [currentValue, setCurrentValue] = useState(currentEmail);

  const validated = useMemo(() => inValid === 'changeEmail:usable', [inValid]);

  const checkValid = useCallback((str) => {
    const reg =
      /^[a-zA-Z0-9!#$%&'*+/=?^_.`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    return reg.test(str);
  }, []);

  useEffect(() => {
    if (currentEmail === currentValue) {
      const str = email.replace(/ /g, '');
      if (str) {
        const m = domain === 'input' ? str : `${str}@${domain}`;
        const valid = validationUtil.validate('email', m);

        // Orcale이 사용하는 국제 표준 RFC 이메일 정규식 추가
        if ((valid?.email?.length || 0) > 0 || !checkValid(m)) {
          setInValid('changeEmail:invalidEmail');
        } else if (m === currentEmail) {
          // email not changed
          setInValid('changeEmail:notChanged');
        } else {
          // check if the email is duplicated
          API.User.confirmEmail({email: m})
            .then((rsp) => {
              if (rsp.result === 0) {
                setInValid('changeEmail:usable');
                onChange?.(m);
              } else if (rsp.message?.includes('Duplicate')) {
                setInValid('changeEmail:duplicate');
              } else {
                setInValid('changeEmail:fail');
              }
            })
            .catch(() => {
              setInValid('changeEmail:fail');
            });
        }
      }
    }
  }, [checkValid, currentEmail, currentValue, domain, email, onChange]);

  useEffect(() => {
    if (inValid !== 'changeEmail:usable') {
      onChange?.('');
    }
  }, [inValid, onChange]);

  useEffect(() => {
    if (inputRef) {
      inputRef.current = {
        focus: () => emailRef.current?.focus(),
        blur: () => emailRef.current?.blur(),
      };
    }
  }, [domain, email, inputRef]);

  return (
    <View>
      <View style={styles.container}>
        <AppTextInput
          showCancel
          containerStyle={{
            ...styles.wrapper,
            borderColor: focused ? colors.clearBlue : colors.lightGrey,
          }}
          style={[
            styles.textInput,
            {color: email ? colors.black : colors.greyish},
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.greyish}
          returnKeyType={domain === 'input' ? 'done' : 'next'}
          enablesReturnKeyAutomatically
          onChangeText={setEmail}
          autoCapitalize="none"
          ref={emailRef}
          value={email}
          multiline={false}
          keyboardType="email-address"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onCancel={() => {
            setEmail('');
            setInValid('changeEmail:invalidEmail');
          }}
          onSubmitEditing={() => {
            if (domain !== 'input') onPress();
          }}
        />

        {domain !== 'input' && (
          <AppText style={[appStyles.medium16, {marginHorizontal: 6}]}>
            @
          </AppText>
        )}

        {domain !== 'input' && (
          <Pressable style={styles.wrapper} onPress={onPress}>
            <View style={[styles.row, {paddingVertical: 13}]}>
              <AppText
                style={[
                  appStyles.medium16,
                  {color: domain ? colors.black : colors.greyish},
                ]}>
                {domain || i18n.t('email:input')}
              </AppText>
              <AppIcon name={domain ? 'triangle' : 'greyTriangle'} />
            </View>
          </Pressable>
        )}
      </View>
      <View style={{height: 20, marginTop: 6}}>
        <AppText
          style={[
            styles.helpText,
            {color: validated ? colors.clearBlue : colors.errorBackground},
          ]}>
          {inValid ? i18n.t(inValid) : ''}
        </AppText>
      </View>
    </View>
  );
};

export default memo(InputEmail);
