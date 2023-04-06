import {List} from 'immutable';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  findNodeHandle,
  Image,
  InputAccessoryView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import ImagePicker, {Image as CropImage} from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  check,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {connect} from 'react-redux';
import _ from 'underscore';
import {bindActionCreators} from 'redux';
import WebView from 'react-native-webview';
import {ScrollView} from 'react-native-gesture-handler';
import {colors} from '@/constants/Colors';
import {attachmentSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {RkbImage} from '@/redux/api/accountApi';
import {RkbIssue} from '@/redux/api/boardApi';
import utils from '@/redux/api/utils';
import {AccountModelState} from '@/redux/modules/account';
import {actions as boardActions, BoardAction} from '@/redux/modules/board';
import {
  actions as eventBoardActions,
  EventBoardAction,
  EventBoardModelState,
} from '@/redux/modules/eventBoard';
import i18n from '@/utils/i18n';
import validationUtil, {
  ValidationResult,
  ValidationRule,
} from '@/utils/validationUtil';
import AppActivityIndicator from './AppActivityIndicator';
import AppAlert from './AppAlert';
import AppButton from './AppButton';
import AppIcon from './AppIcon';
import AppText from './AppText';
import AppTextInput from './AppTextInput';
import {RkbEvent} from '@/redux/api/promotionApi';
import AppModalDropDown from './AppModalDropDown';
import {RkbEventIssue} from '@/redux/api/eventBoardApi';

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
  plusButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachCancel: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  attachBox: {
    marginHorizontal: 20,
    flexDirection: 'row',
  },
  attachTitle: {
    ...appStyles.normal14Text,
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  imgSize: {
    width: attachmentSize,
    height: attachmentSize,
    borderRadius: 3,
  },
  attach: {
    width: attachmentSize + 2,
    height: attachmentSize + 2,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
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
  notice: {
    marginHorizontal: 20,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    paddingHorizontal: 10,
    height: 120,
    marginBottom: 15,
    overflow: 'scroll',
    paddingVertical: 10,
  },
  eventTitle: {
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  notiView: {
    flexDirection: 'row',
    marginBottom: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.whiteTwo,
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
  pending: boolean;
  successEvent: boolean;
  pendingEvent: boolean;

  eventBoard: EventBoardModelState;

  jumpTo: (v: string) => void;
  isEvent?: boolean;
  eventList?: RkbEvent[];

  action: {
    board: BoardAction;
    eventBoard: EventBoardAction;
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
  successEvent,
  isEvent = false,
  eventList = [],
  jumpTo,
  action,
  pending,
  pendingEvent,
  eventBoard,
}) => {
  const [hasPhotoPermission, setHasPhotoPermission] = useState(false);
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState<ValidationResult>({});
  const [title, setTitle] = useState<string>();
  const [msg, setMsg] = useState<string>();
  const [pin, setPin] = useState<string>();
  const [attachment, setAttachment] = useState(List<CropImage>());
  const [extraHeight, setExtraHeight] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [posY, setPosY] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<RkbEvent>({title: ''});
  const [webViewHeight, setWebViewHeight] = useState(0);
  const webViewRef = useRef(null);

  const eventTitleList = useMemo(() => {
    if (eventList?.length > 0) {
      return eventList.map((e) => ({value: e.title, label: e.title}));
    }
    return [];
  }, [eventList]);
  const scrollRef = useRef();
  const keybd = useRef();

  useEffect(() => {
    const checkPermission = async () => {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      const result = await check(permission);
      setHasPhotoPermission(result === RESULTS.GRANTED);
    };

    checkPermission();

    const number = utils.toPhoneNumber(account.mobile);
    setMobile(number);

    setErrors(validationUtil.validate('mobile', number));
  }, [account]);

  useEffect(() => {
    if (success || successEvent) {
      // post가 완료되면 list 텝으로 전환한다.
      jumpTo('list');
    }
  }, [jumpTo, success, successEvent]);

  const validate = useCallback((key: string, value: string) => {
    const valid = validationUtil.validate(key, value, validationRule);

    setErrors((err) => ({
      ...err,
      [key]: valid ? valid[key] : [''],
    }));
  }, []);

  useEffect(() => {
    if (isEvent) setTitle(selectedEvent.title);
  }, [isEvent, selectedEvent.title]);

  const onPress = useCallback(async () => {
    if (!title || !msg) {
      console.log('@@@ invalid issue', title, msg);
      return;
    }

    if (isEvent) {
      // 링크 필수 인경우
      // if(selectedEvent.rule?.link && ){
      //   console.log('@@@ invalid issue', title, msg);
      //   return;
      // }

      // 이미지 필수 인경우
      if (selectedEvent.rule?.image && attachment.size < 1) {
        console.log('@@@@ 이미지 필수', attachment.size);
        return;
      }
      const issue = {
        title,
        msg,
        mobile,
        pin,
        images: attachment
          .map(
            ({mime, size, width, height, data}) =>
              ({
                mime,
                size,
                width,
                height,
                data,
              } as RkbImage),
          )
          .toArray(),
      } as RkbEventIssue;

      await action.eventBoard.postAndGetList(issue);
    } else {
      const issue = {
        title,
        msg,
        mobile,
        pin,
        images: attachment
          .map(
            ({mime, size, width, height, data}) =>
              ({
                mime,
                size,
                width,
                height,
                data,
              } as RkbImage),
          )
          .toArray(),
      } as RkbIssue;
      await action.board.postAndGetList(issue);
    }

    setMsg(undefined);
    setTitle(undefined);
    setPin(undefined);
    setAttachment((a) => a.clear());
  }, [
    action.board,
    action.eventBoard,
    attachment,
    isEvent,
    mobile,
    msg,
    pin,
    selectedEvent.rule?.image,
    title,
  ]);

  const error = useCallback(
    (key: string) => {
      return errors && errors[key] ? errors[key][0] : '';
    },
    [errors],
  );

  const addAttachment = useCallback(async () => {
    let checkNewPermission = false;

    if (!hasPhotoPermission) {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      const result = await check(permission);

      checkNewPermission = result === RESULTS.GRANTED;
    }

    if (hasPhotoPermission || checkNewPermission) {
      if (ImagePicker) {
        try {
          const image = await ImagePicker.openPicker({
            // width: 750,
            // height: 1334, // iphone 8 size
            // cropping: true,
            includeBase64: true,
            writeTempFile: false,
            mediaType: 'photo',
            forceJpb: true,
            // cropperChooseText: i18n.t('select'),
            // cropperCancelText: i18n.t('cancel'),
          });

          setAttachment((a) => a.push(image));
        } catch (err) {
          console.log('failed to select', err);
        }
      }
    } else {
      // 사진 앨범 조회 권한을 요청한다.
      AppAlert.confirm(i18n.t('settings'), i18n.t('acc:permPhoto'), {
        ok: () => openSettings(),
      });
    }
  }, [hasPhotoPermission]);

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

  const renderAttachment = useCallback(
    () => (
      <View>
        <AppText style={styles.attachTitle}>{i18n.t('board:attach')}</AppText>
        <View style={styles.attachBox}>
          {attachment.map((image, idx) => (
            <Pressable
              key={image.filename}
              style={[styles.attach, idx < 2 && {marginRight: 33}]}
              onPress={() => setAttachment((a) => a.delete(idx))}>
              <Image
                style={styles.imgSize}
                source={{uri: `data:${image.mime};base64,${image.data}`}}
              />
              <AppIcon name="btnBoxCancel" style={styles.attachCancel} />
            </Pressable>
          ))}
          {attachment.size < 3 && (
            <Pressable
              key="add"
              style={[styles.attach, styles.plusButton]}
              onPress={addAttachment}>
              <AppIcon name="btnPhotoPlus" />
            </Pressable>
          )}
        </View>
      </View>
    ),
    [addAttachment, attachment],
  );

  const renderContact = useCallback(
    () => (
      <View>
        <AppText style={styles.label}>{i18n.t('board:contact')}</AppText>
        <AppTextInput
          style={styles.button}
          placeholder={i18n.t('board:noMobile')}
          placeholderTextColor={colors.greyish}
          keyboardType="numeric"
          returnKeyType="next"
          enablesReturnKeyAutomatically
          maxLength={13}
          onChangeText={(v) => {
            const value = utils.toPhoneNumber(v);
            setMobile(value);
            validate('mobile', value);
          }}
          onFocus={() => setExtraHeight(20)}
          error={error('mobile')}
          value={mobile}
        />
      </View>
    ),
    [error, mobile, validate],
  );

  // errors object의 모든 value 값들이 undefined인지 확인한다.
  const hasError = useMemo(
    () =>
      (errors &&
        Object.values(errors).findIndex((val) => !_.isEmpty(val)) >= 0) ||
      (!account.loggedIn && _.isEmpty(pin)) ||
      _.isEmpty(msg) ||
      _.isEmpty(title) ||
      _.isEmpty(mobile),
    [account.loggedIn, errors, mobile, msg, pin, title],
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppActivityIndicator visible={pending || pendingEvent} />

      <KeyboardAwareScrollView
        enableOnAndroid
        enableResetScrollToCoords={false}
        // resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={styles.modalInner}
        extraScrollHeight={extraHeight}
        innerRef={(ref) => {
          scrollRef.current = ref;
        }}>
        {!account.loggedIn && renderContact()}
        <View style={{flex: 1}}>
          <View style={styles.notiView}>
            <AppText style={styles.noti}>
              {i18n.t(`${isEvent ? 'event:noti' : 'board:noti'}`)}
            </AppText>
          </View>
          {isEvent ? (
            <Pressable
              style={[styles.inputBox, styles.eventTitle, {marginBottom: 15}]}
              onPress={({nativeEvent: {pageY, locationY}}) => {
                setShowModal(true);
                setPosY(pageY - locationY);
              }}>
              <AppText
                style={[
                  {lineHeight: 50},
                  selectedEvent.title === '' && {color: colors.greyish},
                ]}>
                {selectedEvent.title === ''
                  ? i18n.t('event:placeholder')
                  : selectedEvent.title}
              </AppText>
              <AppIcon name={showModal ? 'dropDownOpen50' : 'dropDown50'} />
            </Pressable>
          ) : (
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
          )}

          {isEvent && selectedEvent.title !== '' && (
            <View style={styles.notice}>
              <WebView
                source={{
                  html: `<style>
              body {
                font-size: 40px;
              }
            </style>`.concat(selectedEvent.notice?.body || ''),
                }}
                originWhitelist={['*']}
                javaScriptEnabled
                domStorageEnabled
              />
            </View>
          )}

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
            placeholder={i18n.t(`${isEvent ? 'event:content' : 'content'}`)}
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

          {account.loggedIn ? renderAttachment() : renderPass()}
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
        title={i18n.t(`${isEvent ? 'event:new2' : 'board:new'}`)}
        // disabled={hasError}
        onPress={onPress}
        type="primary"
      />

      <AppModalDropDown
        key="appDropDown"
        visible={showModal}
        onClose={() => setShowModal(false)}
        posX={20}
        posY={posY}
        buttonHeight={52}
        data={eventTitleList}
        onPress={(value) => {
          setSelectedEvent(
            eventList.find((e) => e.title === value) || eventList[0],
          );
          setShowModal(false);
        }}
        value={selectedEvent.title}
        fixedWidth={Dimensions.get('window').width - 20 * 2 - 2}
      />
    </SafeAreaView>
  );
};

export default connect(
  ({eventBoard, account, status}: RootState) => ({
    eventBoard,
    account,
    success: status.fulfilled[boardActions.postIssue.typePrefix],
    successEvent: status.fulfilled[eventBoardActions.postIssue.typePrefix],
    pending:
      status.pending[boardActions.postIssue.typePrefix] ||
      status.pending[boardActions.postAttach.typePrefix] ||
      false,
    pendingEvent:
      status.pending[eventBoardActions.postIssue.typePrefix] ||
      status.pending[eventBoardActions.postAttach.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      board: bindActionCreators(boardActions, dispatch),
      eventBoard: bindActionCreators(eventBoardActions, dispatch),
    },
  }),
)(BoardMsgAdd);
