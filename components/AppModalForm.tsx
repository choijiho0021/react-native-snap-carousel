import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import validationUtil, {
  ValidationKey,
  ValidationResult,
} from '@/utils/validationUtil';
import React, {memo, useCallback, useState} from 'react';
import {KeyboardTypeOptions, StyleSheet, View} from 'react-native';
import _ from 'underscore';
import AppButton from './AppButton';
import AppModal, {AppModalProps} from './AppModal';
import AppText from './AppText';
import AppTextInput from './AppTextInput';

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
  onCancelClose = () => {},
  ...props
}) => {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<ValidationResult>();

  const renderError = useCallback(() => {
    return _.isObject(error)
      ? Object.entries(error).map(([k, v]) => (
          <AppText key={k} style={styles.error}>
            {v}
          </AppText>
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

  const onCancel = useCallback(() => {
    setValue('');
    setError();
    onCancelClose();
  }, [onCancelClose]);

  return (
    <AppModal
      onOkClose={async () => {
        await onSubmit(value || '');
      }}
      onCancelClose={() => onCancel()}
      {...props}>
      <View style={styles.inputBox}>
        <AppTextInput
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
      {infoText && <AppText style={styles.label}>{infoText}</AppText>}
      {renderError()}
    </AppModal>
  );
};

export default memo(AppModalForm);
