import React, {memo, useCallback, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardTypeOptions,
} from 'react-native';
import _ from 'underscore';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import validationUtil, {
  ValidationKey,
  ValidationResult,
} from '@/utils/validationUtil';
import AppButton from './AppButton';
import AppModal, {AppModalProps} from './AppModal';

const styles = StyleSheet.create({
  cancelButton: {
    width: 20,
    height: 20,
    backgroundColor: colors.white,
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginTop: 30,
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  textInput: {
    ...appStyles.normal16Text,
    flex: 1,
    paddingVertical: 12,
  },
  label: {
    ...appStyles.normal14Text,
    marginLeft: 30,
    marginTop: 10,
    color: colors.clearBlue,
  },
  error: {
    ...appStyles.normal14Text,
    color: colors.tomato,
    marginHorizontal: 30,
    marginTop: 10,
  },
});

type AppModalFormProps = {
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  infoText?: string;
  defaultValue?: string;
  valueType: ValidationKey;
  validate?: (v: string) => ValidationResult;
  validateAsync?: (v: string) => Promise<ValidationResult>;
} & AppModalProps;

const AppModalForm: React.FC<AppModalFormProps> = ({
  maxLength,
  keyboardType = 'default',
  infoText,
  defaultValue,
  valueType,
  validate,
  validateAsync,
  onOkClose = () => {},
  ...props
}) => {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<ValidationResult>();

  const renderError = useCallback(() => {
    return _.isObject(error)
      ? Object.entries(error).map(([k, v]) => (
          <Text key={k} style={styles.error}>
            {v}
          </Text>
        ))
      : null;
  }, [error]);

  const onSubmit = useCallback(
    async (val: string) => {
      const validated =
        (validate && validate(val)) ||
        (validateAsync && (await validateAsync(val)));

      if (validated === undefined || _.isEmpty(validated)) onOkClose(val);
      else setError(validated);
    },
    [onOkClose, validate, validateAsync],
  );

  const onChangeText = useCallback(
    (val: string) => {
      setValue(val);
      setError(validationUtil.validate(valueType, val));
    },
    [valueType],
  );

  return (
    <AppModal
      onOkClose={async () => {
        await onSubmit(value || '');
      }}
      {...props}>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.textInput}
          returnKeyType="done"
          enablesReturnKeyAutomatically
          onChangeText={onChangeText}
          maxLength={maxLength}
          keyboardType={keyboardType}
          value={value}
        />
        <AppButton
          style={styles.cancelButton}
          iconName="btnCancel"
          onPress={() => setValue('')}
        />
      </View>
      {infoText && <Text style={styles.label}>{infoText}</Text>}
      {renderError()}
    </AppModal>
  );
};

export default memo(AppModalForm);
