import {List} from 'immutable';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  findNodeHandle,
  InputAccessoryView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {Image as CropImage} from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {connect} from 'react-redux';
import _ from 'underscore';
import {bindActionCreators} from 'redux';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {RkbIssue} from '@/redux/api/boardApi';
import utils from '@/redux/api/utils';
import {AccountModelState} from '@/redux/modules/account';
import {actions as boardActions, BoardAction} from '@/redux/modules/board';
import i18n from '@/utils/i18n';
import validationUtil, {
  ValidationResult,
  ValidationRule,
} from '@/utils/validationUtil';
import AppButton from './AppButton';
import AppText from './AppText';
import AppTextInput from './AppTextInput';
import AttachmentBox from '@/screens/BoardScreen/AttachmentBox';

const styles = StyleSheet.create({
  passwordInput: {
    borderBottomColor: colors.warmGrey,
    borderBottomWidth: 1,
    marginLeft: 15,
    paddingBottom: 10,
    color: colors.black,
    flex: 1,
  },
  passwordBox: {
    flexDirection: 'row',
    marginTop: 30,
    marginHorizontal: 20,
  },
  inputAccessoryText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    margin: 5,
  },
  inputAccessory: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: colors.lightGrey,
    padding: 5,
  },
  confirm: {
    ...appStyles.normal18Text,
    ...appStyles.confirm,
    marginTop: 30,
  },
  inputBox: {
    ...appStyles.normal14Text,
    marginHorizontal: 20,
    height: 50,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    color: colors.black,
    paddingHorizontal: 10,
  },
  notiView: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  noti: {
    ...appStyles.normal12Text,
    textAlign: 'left',
  },
  container: {
    flex: 1,
  },
  label: {
    ...appStyles.normal14Text,
    marginLeft: 20,
    marginTop: 30,
  },
  button: {
    ...appStyles.normal16Text,
    height: 40,
    paddingLeft: 20,
    marginTop: 15,
    marginBottom: 20,
    marginHorizontal: 20,
    color: colors.black,
    borderBottomColor: colors.warmGrey,
    borderBottomWidth: 1,
  },

  modalInner: {
    justifyContent: 'space-between',
    flexGrow: 1,
  },
});

type BoardMsgAddProps = {
  account: AccountModelState;
  success: boolean;

  jumpTo: (v: string) => void;

  action: {
    board: BoardAction;
  };
};

const validationRule: ValidationRule = {
  title: {
    presence: {
      message: i18n.t('board:noTitle'),
    },
  },
  msg: {
    presence: {
      message: i18n.t('board:noMsg'),
    },
  },
};

const inputAccessoryViewID = 'doneKbd';
const BoardMsgAdd: React.FC<BoardMsgAddProps> = ({
  account,
  success,
  jumpTo,
  action,
}) => {
  const [errors, setErrors] = useState<ValidationResult>({});
  const [title, setTitle] = useState<string>();
  const [msg, setMsg] = useState<string>();
  const [pin, setPin] = useState<string>();
  const [attachment, setAttachment] = useState(List<CropImage>());
  const [extraHeight, setExtraHeight] = useState(0);
  const [value, setValue] = useState('');
  const scrollRef = useRef();
  const keybd = useRef();

  useEffect(() => {
    const number = utils.toPhoneNumber(account.mobile);
    setValue(number);

    setErrors(validationUtil.validate('mobile', number));
  }, [account]);

  useEffect(() => {
    if (success) {
      // post가 완료되면 list 텝으로 전환한다.
      jumpTo('list');
    }
  }, [jumpTo, success]);

  useEffect(() => {
    action.board.getIssueList();
  }, [action.board]);

  const validate = useCallback((key: string, value: string) => {
    const valid = validationUtil.validate(key, value, validationRule);

    setErrors((err) => ({
      ...err,
      [key]: valid ? valid[key] : [''],
    }));
  }, []);

  const onPress = useCallback(async () => {
    if (!title || !msg) {
      return;
    }

    const issue = {
      title,
      msg,
      mobile: value,
      pin,
      images: attachment
        .map((a) => utils.convertCropImageToRkbImage(a))
        .toArray(),
    } as RkbIssue;

    await action.board.postAndGetList(issue);

    setMsg(undefined);
    setTitle(undefined);
    setPin(undefined);
    setAttachment((a) => a.clear());
  }, [action.board, attachment, msg, pin, title, value]);

  const error = useCallback(
    (key: string) => {
      return errors && errors[key] ? errors[key][0] : '';
    },
    [errors],
  );

  const renderPass = useCallback(
    () => (
      <View style={styles.passwordBox}>
        <AppText
          style={[
            appStyles.normal14Text,
            {color: colors.tomato, marginRight: 5, textAlignVertical: 'center'},
          ]}>
          *
        </AppText>
        <AppText
          style={[appStyles.normal14Text, {textAlignVertical: 'center'}]}>
          {i18n.t('board:pass')}
        </AppText>
        <AppTextInput
          style={styles.passwordInput}
          placeholder={i18n.t('board:inputPass')}
          placeholderTextColor={colors.greyish}
          keyboardType="numeric"
          returnKeyType="done"
          enablesReturnKeyAutomatically
          maxLength={4}
          secureTextEntry
          onChangeText={(v) => {
            setPin(v);
            validate('pin', v);
          }}
          value={pin}
          onFocus={() => setExtraHeight(20)}
        />
      </View>
    ),
    [pin, validate],
  );

  const renderContact = useCallback(
    () => (
      <View>
        <AppText style={styles.label}>{i18n.t('board:contact')}</AppText>
        <AppTextInput
          style={styles.button}
          placeholder={i18n.t('board:noMobile')}
          placeholderTextColor={colors.greyish}
          onFocus={() => setValue(value.replace(/-/g, ''))}
          onBlur={() => setValue(utils.toPhoneNumber(value))}
          keyboardType="numeric"
          returnKeyType="next"
          enablesReturnKeyAutomatically
          maxLength={Platform.OS === 'android' ? 13 : 11}
          onChangeText={(v) => {
            const mobileNo = utils.toPhoneNumber(v);
            setValue(v);
            validate('mobile', mobileNo);
          }}
          // onFocus={() => setExtraHeight(20)}
          error={error('mobile')}
          value={value}
        />
      </View>
    ),
    [error, validate, value],
  );

  // errors object의 모든 value 값들이 undefined인지 확인한다.
  const hasError = useMemo(
    () =>
      (errors &&
        Object.values(errors).findIndex((val) => !_.isEmpty(val)) >= 0) ||
      (!account.loggedIn && _.isEmpty(pin)) ||
      _.isEmpty(msg) ||
      _.isEmpty(title) ||
      _.isEmpty(value),
    [account.loggedIn, errors, msg, pin, title, value],
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid
        enableResetScrollToCoords={false}
        // resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={styles.modalInner}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={extraHeight}
        innerRef={(ref) => {
          scrollRef.current = ref;
        }}>
        {!account.loggedIn && renderContact()}
        <View style={{flex: 1}}>
          <View style={styles.notiView}>
            <AppText style={styles.noti}>
              {i18n.t(account.loggedIn ? 'board:noti' : 'board:noti:notLogin')}
            </AppText>
          </View>
          <AppTextInput
            style={[
              styles.inputBox,
              title ? {borderColor: colors.black} : undefined,
              {marginBottom: 15},
            ]}
            placeholder={i18n.t('title')}
            placeholderTextColor={colors.greyish}
            returnKeyType="next"
            enablesReturnKeyAutomatically
            clearTextOnFocus={false}
            maxLength={25}
            onChangeText={(v) => {
              setTitle(v);
              validate('title', v);
            }}
            onFocus={() => setExtraHeight(20)}
            error={error('title')}
            autoCapitalize="none"
            autoCorrect={false}
            value={title}
          />

          <AppTextInput
            style={[
              styles.inputBox,
              {
                height: 208,
                paddingTop: 15,
                paddingHorizontal: 15,
                textAlignVertical: 'top',
              },
              msg ? {borderColor: colors.black} : undefined,
            ]}
            ref={keybd}
            placeholder={i18n.t('content')}
            placeholderTextColor={colors.greyish}
            multiline
            numberOfLines={8}
            inputAccessoryViewID={inputAccessoryViewID}
            enablesReturnKeyAutomatically
            clearTextOnFocus={false}
            maxLength={2000}
            onChangeText={(v) => {
              setMsg(v);
              validate('msg', v);
            }}
            onFocus={() => setExtraHeight(80)}
            error={error('msg')}
            autoCapitalize="none"
            autoCorrect={false}
            onContentSizeChange={({target}) =>
              scrollRef.current?.props?.scrollToFocusedInput(
                findNodeHandle(target),
              )
            }
            value={msg}
          />

          {account.loggedIn ? (
            <AttachmentBox
              attachment={attachment}
              setAttachment={setAttachment}
              imageQuality={0.5}
            />
          ) : (
            renderPass()
          )}
        </View>
      </KeyboardAwareScrollView>

      {Platform.OS === 'ios' ? (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <AppButton
            style={styles.inputAccessory}
            title={i18n.t('done')}
            titleStyle={[
              styles.inputAccessoryText,
              {color: _.isEmpty(msg) ? colors.white : colors.blue},
            ]}
            onPress={() => keybd.current?.blur()}
          />
        </InputAccessoryView>
      ) : null}

      <AppButton
        style={styles.confirm}
        title={i18n.t('board:new')}
        disabled={hasError}
        onPress={onPress}
        type="primary"
      />
    </SafeAreaView>
  );
};

export default connect(
  ({account, status}: RootState) => ({
    account,
    success: status.fulfilled[boardActions.postIssue.typePrefix],
  }),
  (dispatch) => ({
    action: {
      board: bindActionCreators(boardActions, dispatch),
    },
  }),
)(BoardMsgAdd);
