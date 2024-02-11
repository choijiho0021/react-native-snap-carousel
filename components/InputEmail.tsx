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
import Triangle from './Triangle';
import AppButton from './AppButton';
import validationUtil from '@/utils/validationUtil';
import {API} from '@/redux/api';

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
  helpText: {
    ...appStyles.normal14Text,
    color: colors.clearBlue,
    marginTop: 13,
    marginLeft: 10,
  },
});

export type InputEmailRef = {
  focus: () => void;
};

type InputEmailProps = {
  inputRef?: React.MutableRefObject<InputEmailRef | null>;
  currentEmail?: string; // current email
  // value: string;
  domain: string;
  onChange?: (email: string) => void;
  onPress?: () => void;
};

const InputEmail: React.FC<InputEmailProps> = ({
  inputRef,
  currentEmail,
  domain,
  onChange,
  onPress = () => {},
}) => {
  const emailRef = useRef<TextInput>();
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const [inValid, setInValid] = useState('');

  const validateEmail = useCallback(
    (v: string) => {
      const str = v.replace(/ /g, '');
      if (str) {
        const m = domain === 'input' ? str : `${str}@${domain}`;
        //check if not empty
        console.log('@@@ validate email:', m, v, str);
        const valid = validationUtil.validate('email', m);
        if ((valid?.email?.length || 0) > 0) {
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
    },
    [currentEmail, domain, onChange],
  );

  const validated = useMemo(() => inValid === 'changeEmail:usable', [inValid]);

  useEffect(() => {
    console.log('@@@ check email', email);
    validateEmail(email);
  }, [validateEmail, email]);

  useEffect(() => {
    if (inputRef) {
      inputRef.current = {
        focus: () => emailRef.current?.focus(),
      };
    }
  }, [domain, email, inputRef]);

  return (
    <View>
      <View style={styles.container}>
        <Pressable
          style={[
            styles.wrapper,
            {
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderColor: focused ? colors.clearBlue : colors.lightGrey,
            },
          ]}
          onPress={() => emailRef.current?.focus()}>
          <AppTextInput
            style={[
              styles.textInput,
              {color: email ? colors.black : colors.greyish},
            ]}
            placeholder={i18n.t('reg:email')}
            placeholderTextColor={colors.greyish}
            returnKeyType="next"
            enablesReturnKeyAutomatically
            onChangeText={setEmail}
            autoCapitalize="none"
            ref={emailRef}
            value={email}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {email.length > 0 && (
            <AppButton
              style={{justifyContent: 'flex-end', marginLeft: 10}}
              iconName="btnSearchCancel"
              onPress={() => {
                setEmail('');
                setInValid('changeEmail:invalidEmail');
              }}
            />
          )}
        </Pressable>

        {domain !== 'input' && (
          <AppText style={[appStyles.medium16, {marginHorizontal: 6}]}>
            @
          </AppText>
        )}

        {domain !== 'input' && (
          <Pressable style={styles.wrapper} onPress={onPress}>
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
        )}
      </View>
      <AppText
        style={[
          styles.helpText,
          {color: validated ? colors.clearBlue : colors.errorBackground},
        ]}>
        {inValid ? i18n.t(inValid) : ''}
      </AppText>
    </View>
  );
};

export default memo(InputEmail);
