import {List} from 'immutable';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
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
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {colors} from '@/constants/Colors';
import {attachmentSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import utils from '@/redux/api/utils';
import {AccountModelState} from '@/redux/modules/account';
import {
  actions as boardActions,
  BoardAction,
  BoardModelState,
} from '@/redux/modules/board';
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import {
  actions as eventBoardActions,
  EventBoardAction,
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
import {EventImagesInfo, RkbEventBoard} from '@/redux/api/eventBoardApi';
import AppSvgIcon from './AppSvgIcon';
import EventStatusBox from '@/screens/MyPageScreen/components/EventStatusBox';
import {OnPressEventParams} from '@/screens/EventBoardScreen';
import {OnPressContactParams} from '@/screens/ContactBoardScreen';

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
    zIndex: 1,
  },
  attachBox: {
    marginHorizontal: 20,
    flexDirection: 'row',
  },
  link: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  attachTitle: {
    marginTop: 32,
    marginBottom: 8,
    marginHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  essentialText: {
    ...appStyles.bold12Text,
    color: colors.redError,
    lineHeight: 20,
    marginLeft: 3,
  },
  attachTitleText: {
    ...appStyles.semiBold14Text,
    lineHeight: 20,
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
    height: 56,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    color: colors.black,
    paddingHorizontal: 16,
  },
  notice: {
    borderRadius: 3,
    backgroundColor: colors.backGrey,
    marginHorizontal: 20,
    height: 64,
  },
  noticeBtnWeb: {
    height: 64 - 8,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  noticeBtn: {
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    height: 64,
    padding: 20,
  },
  noticeBtnTitle: {
    ...appStyles.semiBold16Text,
    lineHeight: 24,
    color: colors.clearBlue,
  },
  eventTitle: {
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTitleText: {
    ...appStyles.semiBold16Text,
    lineHeight: 24,
    color: colors.black,
  },
  notiView: {
    flexDirection: 'row',
    marginBottom: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.whiteTwo,
    alignItems: 'center',
  },
  eventNotiView: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    marginBottom: 8,
  },
  eventNoti: {
    ...appStyles.semiBold14Text,
    lineHeight: 20,
    color: colors.warmGrey,
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
  addText: {
    ...appStyles.bold14Text,
    marginLeft: 4,
    color: colors.clearBlue,
  },
  minusBtn: {
    backgroundColor: colors.backGrey,
    borderRadius: 3,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
});

type BoardMsgAddProps = {
  account: AccountModelState;
  success: boolean;
  pending: boolean;
  successEvent: boolean;
  pendingEvent: boolean;

  eventBoard: BoardModelState;

  jumpTo: (v: string) => void;
  isEvent?: boolean;
  eventList?: RkbEvent[];
  paramIssue?: RkbEventBoard;
  paramNid?: string;
  onPressEvent?: (v: OnPressEventParams) => void;
  onPressContact?: (v: OnPressContactParams) => void;

  action: {
    board: BoardAction;
    eventBoard: EventBoardAction;
    toast: ToastAction;
    modal: ModalAction;
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

const injectedJavaScript = `
window.ReactNativeWebView.postMessage(
  document.body.scrollHeight.toString()
);`;

export type EventParamImagesType = {
  url: string;
  imagesInfo: EventImagesInfo;
};

export type EventLinkType = {
  value: string;
};

const BoardMsgAdd: React.FC<BoardMsgAddProps> = ({
  account,
  success,
  successEvent,
  isEvent = false,
  eventList = [],
  paramIssue,
  paramNid,
  jumpTo,
  action,
  pending,
  pendingEvent,
  eventBoard,
  onPressEvent,
  onPressContact,
}) => {
  const [hasPhotoPermission, setHasPhotoPermission] = useState(false);
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState<ValidationResult>({});
  const [title, setTitle] = useState<string>();
  const [msg, setMsg] = useState<string>();
  const [linkParam, setLinkParam] = useState<EventLinkType[]>([{value: ''}]);
  const [linkCount, setLinkCount] = useState(1);
  const [pin, setPin] = useState<string>();
  const [attachment, setAttachment] = useState(List<CropImage>());
  const [extraHeight, setExtraHeight] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<RkbEvent>({title: ''});
  const [isEventSelected, setIsEventSelected] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [focusedItem, setFocusedItem] = useState({
    title: false,
    msg: false,
    link: [false, false, false, false, false, false],
  });
  const [webviewHeight, setWebviewHeight] = useState(0);
  const [paramImages, setParamImages] = useState<EventParamImagesType[]>([]);

  const onMessage = useCallback((event: WebViewMessageEvent) => {
    const height = parseInt(event.nativeEvent.data, 10);
    setWebviewHeight(height);
  }, []);

  const eventTitleList = useMemo(() => {
    if (eventList?.length > 0) {
      return eventList.map((e) => ({value: e.title, label: e.title}));
    }
    return [];
  }, [eventList]);
  const scrollRef = useRef();
  const keybd = useRef();

  useEffect(() => {
    if (paramNid) {
      const ev = eventList.find((e) => e.nid === paramNid) || {title: ''};
      setSelectedEvent(ev);
      setTitle(ev.title);
    }
  }, [eventList, paramNid]);

  useEffect(() => {
    if (paramIssue) {
      setTitle(paramIssue.title);
      setSelectedEvent(
        eventList.find((e) => e.title === paramIssue.title) || {title: ''},
      );
      setLinkParam(paramIssue.link.map((l: string) => ({value: l})));
      setLinkCount(paramIssue.link.length);
      // setParamImages(
      //   paramIssue.images.map((url, idx) => ({
      //     url,
      //     imagesInfo: paramIssue.imagesInfo[idx],
      //   })),
      // );
      setMsg(paramIssue.msg || '');
      setShowWebView(true);
    }
  }, [eventList, paramIssue]);

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
    if (isEvent && selectedEvent.title !== '') setIsEventSelected(true);
  }, [isEvent, selectedEvent.title]);

  useEffect(() => {
    if (isEvent) setTitle(selectedEvent.title);
  }, [isEvent, selectedEvent.title]);

  const setInitial = useCallback(async () => {
    setSelectedEvent({title: ''});
    setLinkParam([{value: ''}]);
    setLinkCount(1);
    setMsg(undefined);
    setTitle(undefined);
    setPin(undefined);
    setAttachment((a) => a.clear());
  }, []);

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
        <View style={styles.attachTitle}>
          <AppText style={styles.attachTitleText}>
            {i18n.t('board:attach')}
          </AppText>
          {isEvent && selectedEvent.rule?.image && (
            <AppText style={styles.essentialText}>
              {i18n.t('event:essential')}
            </AppText>
          )}
        </View>
        <View style={styles.attachBox}>
          {/* {paramImages.length > 0 &&
            paramImages
              .filter((item) => !_.isEmpty(item))
              .map((image, i) => (
                <Pressable
                  style={[styles.attach, i < 2 && {marginRight: 33}]}
                  key={utils.generateKey(`${image.url}${i}`)}
                  onPress={() => {
                    setParamImages(
                      paramImages.filter((p) => p.url !== image.url),
                    );
                  }}>
                  <AppIcon name="btnBoxCancel" style={styles.attachCancel} />
                  <ImgWithIndicator
                    uri={API.default.httpImageUrl(image.url).toString()}
                  />
                </Pressable>
              ))} */}
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
          {paramImages.length + attachment.size < 3 && (
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
    [
      addAttachment,
      attachment,
      isEvent,
      paramImages,
      selectedEvent.rule?.image,
    ],
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
  const hasError = useMemo(() => {
    if (isEvent) {
      return (
        !isEventSelected ||
        _.isEmpty(msg) ||
        (selectedEvent.rule?.image && attachment.size < 1) ||
        (selectedEvent.rule?.link && linkParam.find((l) => l.value === ''))
      );
    }
    return (
      (errors &&
        Object.values(errors).findIndex((val) => !_.isEmpty(val)) >= 0) ||
      (!account.loggedIn && _.isEmpty(pin)) ||
      _.isEmpty(msg) ||
      _.isEmpty(title) ||
      _.isEmpty(mobile)
    );
  }, [
    account.loggedIn,
    attachment.size,
    errors,
    isEvent,
    isEventSelected,
    linkParam,
    mobile,
    msg,
    pin,
    selectedEvent.rule?.image,
    selectedEvent.rule?.link,
    title,
  ]);

  const renderLinkInput = useCallback(() => {
    const arr = new Array(linkCount).fill(0);
    return arr.map((cur, idx) =>
      linkParam[idx] ? (
        <View style={{display: 'flex', flexDirection: 'row'}} key={idx}>
          <AppTextInput
            style={[
              styles.inputBox,
              idx < arr.length - 1 && {marginBottom: 8},
              idx > 0 && {marginRight: 8},
              {flex: 1},
              focusedItem.link[idx] && {
                borderColor: colors.clearBlue,
              },
            ]}
            maxLength={1000}
            onChangeText={(v) => {
              const newArr = [...linkParam];
              newArr[idx] = {value: v};
              setLinkParam(newArr);
              validate(`link${idx}`, v);
            }}
            value={linkParam[idx].value}
            enablesReturnKeyAutomatically
            clearTextOnFocus={false}
            onFocus={() => {
              setExtraHeight(20);
              const focusedLink = [...focusedItem.link];
              focusedLink[idx] = true;
              setFocusedItem({...focusedItem, link: focusedLink});
            }}
            onBlur={() => {
              const focusedLink = [...focusedItem.link];
              focusedLink[idx] = false;
              setFocusedItem({...focusedItem, link: focusedLink});
            }}
            error={error('title')}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {idx > 0 && (
            <Pressable
              style={styles.minusBtn}
              onPress={() => {
                const focusedLink = [...focusedItem.link];
                focusedLink[idx] = false;
                setFocusedItem({...focusedItem, link: focusedLink});
                setLinkCount(linkCount - 1);
                setLinkParam(linkParam.filter((l, index) => index !== idx));
              }}>
              <AppSvgIcon name="minus16" />
            </Pressable>
          )}
        </View>
      ) : undefined,
    );
  }, [error, focusedItem, linkCount, linkParam, validate]);

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
          {paramIssue ? (
            <View style={{marginHorizontal: 20, marginBottom: 24}}>
              <EventStatusBox
                statusCode={paramIssue.statusCode}
                rejectReason={paramIssue.rejectReason}
                otherReason={paramIssue.otherReason}
              />
            </View>
          ) : (
            <View style={[styles.notiView, isEvent && styles.eventNotiView]}>
              <AppText style={isEvent ? styles.eventNoti : styles.noti}>
                {i18n.t(`${isEvent ? 'event:noti' : 'board:noti'}`)}
              </AppText>
            </View>
          )}
          {isEvent ? (
            <Pressable
              style={[
                styles.inputBox,
                styles.eventTitle,
                // isEventSelected ? {borderColor: colors.black} : undefined,
                showModal && {borderColor: colors.clearBlue},
                paramIssue && {backgroundColor: colors.backGrey},
                {marginBottom: 8},
              ]}
              onPress={() => setShowModal(true)}
              disabled={!!paramIssue}>
              <AppText
                style={[
                  styles.eventTitleText,
                  selectedEvent.title === '' && {color: colors.greyish},
                ]}>
                {selectedEvent.title === ''
                  ? i18n.t('event:placeholder')
                  : selectedEvent.title}
              </AppText>
              <AppIcon name={showModal ? 'dropDownOpen' : 'dropDown'} />
            </Pressable>
          ) : (
            <AppTextInput
              style={[
                styles.inputBox,
                {marginBottom: 15},
                focusedItem.title && {borderColor: colors.clearBlue},
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
              onFocus={() => {
                setExtraHeight(20);
                setFocusedItem({...focusedItem, title: true});
              }}
              onBlur={() => setFocusedItem({...focusedItem, title: false})}
              error={error('title')}
              autoCapitalize="none"
              autoCorrect={false}
              value={title}
            />
          )}

          {isEventSelected && (
            <View
              style={[
                styles.notice,
                showWebView && {
                  height: webviewHeight + 64 - 8,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  backgroundColor: colors.backGrey,
                },
              ]}>
              <Pressable
                style={[styles.noticeBtn, showWebView && styles.noticeBtnWeb]}
                onPress={() => setShowWebView(!showWebView)}>
                <AppText style={styles.noticeBtnTitle}>
                  {i18n.t('event:notice')}
                </AppText>
                <AppSvgIcon
                  name={showWebView ? 'iconArrowUp' : 'iconArrowDown'}
                />
              </Pressable>

              {showWebView && (
                <View style={{height: webviewHeight}}>
                  <WebView
                    style={{
                      flex: 1,
                    }}
                    source={{html: selectedEvent.notice?.body || ''}}
                    originWhitelist={['*']}
                    onMessage={onMessage}
                    injectedJavaScript={injectedJavaScript}
                  />
                </View>
              )}
            </View>
          )}

          {isEventSelected && (
            <View style={styles.attachTitle}>
              <AppText style={styles.attachTitleText}>
                {i18n.t('content')}
              </AppText>
              <AppText style={styles.essentialText}>
                {i18n.t('event:essential')}
              </AppText>
            </View>
          )}

          <AppTextInput
            style={[
              styles.inputBox,
              {
                height: 208,
                paddingTop: 16,
                paddingHorizontal: 16,
                textAlignVertical: 'top',
              },
              focusedItem.msg && {borderColor: colors.clearBlue},
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
            onFocus={() => {
              setExtraHeight(80);
              setFocusedItem({...focusedItem, msg: true});
            }}
            onBlur={() => setFocusedItem({...focusedItem, msg: false})}
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

          {isEventSelected && (
            <View style={styles.link}>
              <View
                style={[
                  styles.attachTitle,
                  {marginTop: 0, marginBottom: 0, marginHorizontal: 0},
                ]}>
                <AppText style={styles.attachTitleText}>
                  {i18n.t('link')}
                </AppText>
                {selectedEvent.rule?.link && (
                  <AppText style={styles.essentialText}>
                    {i18n.t('event:essential')}
                  </AppText>
                )}
              </View>

              <Pressable
                style={[
                  styles.attachTitle,
                  {
                    marginTop: 0,
                    marginBottom: 0,
                    marginHorizontal: 0,
                    alignItems: 'center',
                  },
                ]}
                onPress={() => {
                  if (linkCount < 6) {
                    setLinkParam(linkParam.concat({value: ''}));
                    setLinkCount(linkCount + 1);
                  }
                }}>
                <AppSvgIcon name="plusBlue" />
                <AppText style={styles.addText}>{i18n.t('event:add')}</AppText>
              </Pressable>
            </View>
          )}
          {isEventSelected && renderLinkInput()}

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
        style={[
          styles.confirm,
          isEvent && hasError && {backgroundColor: colors.warmGrey},
        ]}
        pressedStyle={
          isEvent && hasError
            ? {backgroundColor: colors.warmGrey}
            : {backgroundColor: colors.dodgerBlue}
        }
        title={i18n.t(`${isEvent ? 'event:new2' : 'board:new'}`)}
        disabled={!isEvent && hasError}
        onPress={() => {
          if (isEvent && onPressEvent)
            onPressEvent({
              title,
              msg,
              selectedEvent,
              linkParam,
              attachment,
            });
          else if (onPressContact) {
            onPressContact({
              title,
              msg,
              mobile,
              pin,
              attachment,
            });
          }
          setInitial();
        }}
        type="primary"
      />

      <AppModalDropDown
        key="appDropDown"
        visible={showModal}
        onClose={() => setShowModal(false)}
        data={eventTitleList}
        onPress={(value) => {
          setSelectedEvent(
            eventList.find((e) => e.title === value) || eventList[0],
          );
          setShowModal(false);
          setShowWebView(false);
          setWebviewHeight(0);
        }}
        value={selectedEvent.title}
      />
    </SafeAreaView>
  );
};

export default connect(
  ({eventBoard, account, status}: RootState) => ({
    eventBoard,
    account,
    success: status.fulfilled[boardActions.postIssue.typePrefix],
    successEvent: status.fulfilled[eventBoardActions.postEventIssue.typePrefix],
    pending:
      status.pending[boardActions.postIssue.typePrefix] ||
      status.pending[boardActions.postAttach.typePrefix] ||
      false,
    pendingEvent:
      status.pending[eventBoardActions.postEventIssue.typePrefix] ||
      status.pending[eventBoardActions.postEventAttach.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      board: bindActionCreators(boardActions, dispatch),
      eventBoard: bindActionCreators(eventBoardActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(BoardMsgAdd);
