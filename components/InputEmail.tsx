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
import AppButton from './AppButton';

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
  inputRef,
  value,
  domain,
  onChange,
  onPress = () => {},
}) => {
  const emailRef = useRef<TextInput>();
  const [email, setEmail] = useState(value?.split('@')?.[0] || '');
  const [focused, setFocused] = useState(false);

  const chgAddr = useCallback(
    (v: string) => {
      setEmail(v);
      onChange?.(v);
    },
    [onChange],
  );

  useEffect(() => {
    if (inputRef) {
      inputRef.current = {
        focus: () => emailRef.current?.focus(),
      };
    }
  }, [domain, email, inputRef]);

  return (
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
          onChangeText={chgAddr}
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
            onPress={() => setEmail('')}
          />
        )}
      </Pressable>

      {domain !== 'input' && (
        <AppText style={[appStyles.medium16, {marginHorizontal: 6}]}>@</AppText>
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
  );
};

export default memo(InputEmail);
