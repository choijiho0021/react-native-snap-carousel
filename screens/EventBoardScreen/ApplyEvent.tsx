import {List} from 'immutable';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {bindActionCreators} from 'redux';
import {
  findNodeHandle,
  InputAccessoryView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {Image as CropImage} from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {connect} from 'react-redux';
import _ from 'underscore';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import {
  actions as eventBoardActions,
  EventBoardAction,
} from '@/redux/modules/eventBoard';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import i18n from '@/utils/i18n';
import validationUtil, {
  ValidationResult,
  ValidationRule,
} from '@/utils/validationUtil';
import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import AppTextInput from '@/components/AppTextInput';
import {RkbEvent} from '@/redux/api/promotionApi';
import AppModalDropDown from '@/components/AppModalDropDown';
import {
  EventImagesInfo,
  RkbEventBoard,
  RkbEventIssue,
} from '@/redux/api/eventBoardApi';
import AppSvgIcon from '@/components/AppSvgIcon';
import EventStatusBox from '@/screens/MyPageScreen/components/EventStatusBox';
import {OnPressContactParams} from '@/screens/ContactBoardScreen';
import {PromotionModelState} from '@/redux/modules/promotion';
import {BoardModelState} from '@/redux/modules/board';
import AppModalContent from '@/components/ModalContent/AppModalContent';
import AppStyledText from '@/components/AppStyledText';
import {RkbImage} from '@/redux/api/accountApi';
import AttachmentBox from '../BoardScreen/AttachmentBox';

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
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
  modalText: {
    ...appStyles.normal16Text,
    lineHeight: 26,
    letterSpacing: -0.32,
    color: colors.warmGrey,
  },
  modalBoldText: {
    ...appStyles.semiBold16Text,
    lineHeight: 26,
    letterSpacing: -0.32,
    color: colors.black,
  },
});

type ApplyEventProps = {
  promotion: PromotionModelState;
  eventBoard: BoardModelState;

  successEvent: boolean;

  jumpTo: (v: string) => void;
  eventList?: RkbEvent[];
  paramIssue?: RkbEventBoard;
  paramNid?: string;
  onPressContact?: (v: OnPressContactParams) => boolean;
  action: {
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

const ApplyEvent: React.FC<ApplyEventProps> = ({
  promotion,
  eventBoard,
  paramIssue,
  paramNid,
  action,
  successEvent,
}) => {
  const eventList = useMemo(() => promotion.event || [], [promotion.event]);
  const [errors, setErrors] = useState<ValidationResult>({});
  const [title, setTitle] = useState<string>();
  const [msg, setMsg] = useState<string>();
  const [linkParam, setLinkParam] = useState<EventLinkType[]>([{value: ''}]);
  const [linkCount, setLinkCount] = useState(1);
  const [attachment, setAttachment] = useState(List<CropImage>());
  const [extraHeight, setExtraHeight] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<RkbEvent | undefined>();
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
      setSelectedEvent(eventList.find((e) => e.nid === paramNid));
      setTitle(eventList.find((e) => e.nid === paramNid)?.title);
    }
  }, [eventList, paramNid]);

  useEffect(() => {
    if (paramIssue) {
      setTitle(paramIssue.title);
      setSelectedEvent(eventList.find((e) => e.title === paramIssue.title));
      setLinkParam(paramIssue.link.map((l: string) => ({value: l})));
      setLinkCount(paramIssue.link.length);
      setParamImages(
        paramIssue.images.map((url, idx) => ({
          url,
          imagesInfo: paramIssue.imagesInfo[idx],
        })),
      );
      setMsg(paramIssue.msg || '');
      setShowWebView(true);
    }
  }, [eventList, paramIssue]);

  const validate = useCallback((key: string, value: string) => {
    const valid = validationUtil.validate(key, value, validationRule);

    setErrors((err) => ({
      ...err,
      [key]: valid ? valid[key] : [''],
    }));
  }, []);

  useEffect(() => {
    if (selectedEvent) setTitle(selectedEvent.title);
  }, [selectedEvent]);

  const setInitial = useCallback(async () => {
    setSelectedEvent(undefined);
    setLinkParam([{value: ''}]);
    setLinkCount(1);
    setMsg(undefined);
    setTitle(undefined);
    setAttachment((a) => a.clear());
  }, []);

  const error = useCallback(
    (key: string) => {
      return errors && errors[key] ? errors[key][0] : '';
    },
    [errors],
  );

  // errors object의 모든 value 값들이 undefined인지 확인한다.
  const hasError = useMemo(() => {
    return (
      !selectedEvent ||
      _.isEmpty(msg) ||
      (selectedEvent?.rule?.image && attachment.size < 1) ||
      (selectedEvent?.rule?.link && linkParam.find((l) => l.value === ''))
    );
  }, [attachment.size, linkParam, msg, selectedEvent]);

  const renderLinkInput = useCallback(() => {
    return linkParam.map((cur, idx) =>
      idx < linkCount ? (
        cur ? (
          <View style={{display: 'flex', flexDirection: 'row'}} key={idx}>
            <AppTextInput
              style={[
                styles.inputBox,
                idx < linkCount - 1 && {marginBottom: 8},
                idx > 0 && {marginRight: 8},
                {flex: 1, borderWidth: 2},
                focusedItem.link[idx] && {
                  borderColor: colors.clearBlue,
                },
              ]}
              maxLength={1000}
              onChangeText={(v) => {
                setLinkParam((prev) =>
                  prev.map((p, i) => (i === idx ? {value: v} : p)),
                );
                validate(`link${idx}`, v);
              }}
              value={linkParam[idx].value}
              enablesReturnKeyAutomatically
              clearTextOnFocus={false}
              onFocus={() => {
                setExtraHeight(20);
                setFocusedItem((prev) => ({
                  ...prev,
                  link: prev.link.map((l, i) => (i === idx ? true : l)),
                }));
              }}
              onBlur={() => {
                setFocusedItem((prev) => ({
                  ...prev,
                  link: prev.link.map((l, i) => (i === idx ? false : l)),
                }));
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
        ) : undefined
      ) : undefined,
    );
  }, [error, focusedItem, linkCount, linkParam, validate]);

  const onPress = useCallback(() => {
    if (!title) {
      action.toast.push('event:empty:title');
      return;
    }
    if (!msg) {
      action.toast.push('event:empty:msg');
      return;
    }
    // 링크 필수 인경우
    if (selectedEvent?.rule?.link && linkParam?.find((l) => l.value === '')) {
      action.toast.push('event:empty:link');
      return;
    }

    // 이미지 필수 인경우
    if (
      selectedEvent?.rule?.image &&
      attachment.size < 1 &&
      (paramImages?.length || 0) < 1
    ) {
      action.toast.push('event:empty:image');
      return;
    }

    const history = eventBoard.list.find(
      (l) => l.title === selectedEvent?.title,
    );

    if (
      history &&
      (history.statusCode === 'r' || history?.statusCode !== 'f')
    ) {
      action.modal.showModal({
        content: (
          <AppModalContent
            type="info"
            onOkClose={() => {
              action.modal.closeModal();
            }}>
            <View style={{marginLeft: 30}}>
              <AppStyledText
                text={i18n.t(
                  `event:alert:duplication${
                    history.statusCode === 'r' ? ':reopen' : ''
                  }`,
                )}
                textStyle={styles.modalText}
                format={{b: styles.modalBoldText}}
              />
            </View>
          </AppModalContent>
        ),
      });
      return;
    }

    const issue = {
      title,
      msg,
      link: linkParam,
      eventUuid: selectedEvent?.uuid,
      eventStatus: history && history.statusCode === 'f' ? 'R' : 'O',
      paramImages,
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

    action.eventBoard.postAndGetList(issue);

    if (successEvent)
      action.modal.showModal({
        content: (
          <AppModalContent
            type="info"
            onOkClose={() => {
              action.modal.closeModal();
            }}>
            <View style={{marginLeft: 30}}>
              <AppStyledText
                text={i18n.t(
                  `event:alert:${
                    history && history.statusCode === 'f' ? 'reOpen' : 'open'
                  }`,
                )}
                textStyle={styles.modalText}
                format={{b: styles.modalBoldText}}
              />
            </View>
          </AppModalContent>
        ),
      });

    setInitial();
  }, [
    action,
    attachment,
    eventBoard.list,
    linkParam,
    msg,
    paramImages,
    selectedEvent,
    setInitial,
    successEvent,
    title,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid
        enableResetScrollToCoords={false}
        // resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={styles.modalInner}
        extraScrollHeight={extraHeight}
        innerRef={(ref) => {
          scrollRef.current = ref;
        }}>
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
            <View style={[styles.notiView, styles.eventNotiView]}>
              <AppText style={styles.eventNoti}>{i18n.t('event:noti')}</AppText>
            </View>
          )}
          <Pressable
            style={[
              styles.inputBox,
              styles.eventTitle,
              // selectedEvent ? {borderColor: colors.black} : undefined,
              showModal && {borderColor: colors.clearBlue},
              paramIssue && {backgroundColor: colors.backGrey},
              {marginBottom: 8},
            ]}
            onPress={() => setShowModal(true)}
            disabled={!!paramIssue}>
            <AppText
              style={[
                styles.eventTitleText,
                !selectedEvent && {color: colors.greyish},
              ]}>
              {!selectedEvent
                ? i18n.t('event:placeholder')
                : selectedEvent?.title}
            </AppText>
            <AppIcon name={showModal ? 'dropDownOpen' : 'dropDown'} />
          </Pressable>

          {selectedEvent && (
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

          {selectedEvent && (
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
            placeholder={i18n.t('event:content')}
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

          {selectedEvent && (
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
                  if (linkCount < 3) {
                    setLinkParam(linkParam.concat({value: ''}));
                    setLinkCount(linkCount + 1);
                  } else {
                    action.modal.showModal({
                      content: (
                        <AppModalContent
                          type="info"
                          onOkClose={() => {
                            action.modal.closeModal();
                          }}>
                          <View style={{marginLeft: 30}}>
                            <AppStyledText
                              text={i18n.t('event:alert:link')}
                              textStyle={styles.modalText}
                              format={{b: styles.modalBoldText}}
                            />
                          </View>
                        </AppModalContent>
                      ),
                    });
                  }
                }}>
                <AppSvgIcon name="plusBlue" />
                <AppText style={styles.addText}>{i18n.t('event:add')}</AppText>
              </Pressable>
            </View>
          )}
          {selectedEvent && renderLinkInput()}

          <AttachmentBox
            selectedEvent={selectedEvent}
            paramImages={paramImages}
            setParamImages={setParamImages}
            attachment={attachment}
            setAttachment={setAttachment}
          />
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
        style={[styles.confirm, hasError && {backgroundColor: colors.warmGrey}]}
        pressedStyle={
          hasError
            ? {backgroundColor: colors.warmGrey}
            : {backgroundColor: colors.dodgerBlue}
        }
        title={i18n.t(`event:new2${paramIssue ? ':re' : ''}`)}
        onPress={onPress}
        type="primary"
      />

      <AppModalDropDown
        key="appDropDown"
        visible={showModal}
        onClose={() => setShowModal(false)}
        data={eventTitleList}
        onPress={(value) => {
          setSelectedEvent(eventList.find((e) => e.title === value));
          setShowModal(false);
          setShowWebView(false);
          setWebviewHeight(0);
        }}
        value={selectedEvent?.title}
      />
    </SafeAreaView>
  );
};

export default connect(
  ({promotion, eventBoard, status}: RootState) => ({
    promotion,
    eventBoard,
    successEvent: status.fulfilled[eventBoardActions.postEventIssue.typePrefix],
  }),
  (dispatch) => ({
    action: {
      eventBoard: bindActionCreators(eventBoardActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(ApplyEvent);
