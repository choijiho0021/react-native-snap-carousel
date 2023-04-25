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
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import {
  actions as eventBoardActions,
  EventBoardAction,
  EventBoardModelState,
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
import EventStatusBox from '@/screens/BoardScreen/EventStatusBox';
import {PromotionModelState} from '@/redux/modules/promotion';
import AppModalContent from '@/components/ModalContent/AppModalContent';
import AppStyledText from '@/components/AppStyledText';
import AttachmentBox from '@/screens/BoardScreen/AttachmentBox';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import {utils} from '@/utils/utils';
import LinkInput from './LinkInput';

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
  inputMsgBox: {
    height: 208,
    paddingVertical: 16,
  },
  inputMsg: {
    height: 176,
    textAlignVertical: 'top',
    padding: 0,
  },
  noticeBox: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notice: {
    borderRadius: 3,
    backgroundColor: colors.backGrey,
    marginHorizontal: 20,
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
  noticeTitle: {
    ...appStyles.bold14Text,
    lineHeight: 24,
    color: colors.black,
  },
  noticeMainContents: {
    ...appStyles.bold14Text,
    lineHeight: 22,
    letterSpacing: -0.28,
    color: colors.warmGrey,
  },
  noticeSubContents: {
    ...appStyles.medium14,
    lineHeight: 22,
    letterSpacing: -0.28,
    color: colors.warmGrey,
  },
});

type ApplyEventProps = {
  promotion: PromotionModelState;
  eventBoard: EventBoardModelState;

  pending: boolean;
  success: boolean;
  jumpTo: (v: string) => void;
  eventList?: RkbEvent[];
  paramIssue?: RkbEventBoard;
  paramNid?: string;
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

const urlPattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
const isUrl = (str: string) => {
  return urlPattern.test(str);
};

const inputAccessoryViewID = 'doneKbd';

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
  pending,
  success,
  jumpTo,
}) => {
  const eventList = useMemo(() => promotion.event || [], [promotion.event]);
  const [errors, setErrors] = useState<ValidationResult>({});
  const [title, setTitle] = useState<string>();
  const [msg, setMsg] = useState<string>();
  const [linkParam, setLinkParam] = useState<string[]>(['']);
  const [attachment, setAttachment] = useState(List<CropImage>());
  const [extraHeight, setExtraHeight] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<RkbEvent | undefined>();
  const [showNotice, setShowNotice] = useState(true);
  const [msgFocused, setMsgFocused] = useState(false);
  const [paramImages, setParamImages] = useState<EventParamImagesType[]>([]);
  const [pressed, setPressed] = useState(false);
  const [pIssue, setPIssue] = useState<RkbEventBoard>();
  const eventTitleList = useMemo(
    () => eventList?.map((e) => ({value: e.title, label: e.title})) || [],
    [eventList],
  );
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
      setPIssue(paramIssue);
      setTitle(paramIssue.title);
      setSelectedEvent(eventList.find((e) => e.nid === paramIssue.eventId));
      setParamImages(
        paramIssue.images.map((url, idx) => ({
          url,
          imagesInfo: paramIssue.imagesInfo[idx],
        })),
      );
      setMsg(paramIssue.msg || '');
      if (paramIssue.link.length > 0) {
        setLinkParam(paramIssue.link);
      }
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
    setLinkParam(['']);
    setMsg(undefined);
    setTitle(undefined);
    setAttachment((a) => a.clear());
    setMsgFocused(false);
    setPIssue(undefined);
    setParamImages([]);
  }, []);

  useEffect(() => {
    if (pressed && !pending && success) {
      action.modal.renderModal(() => (
        <AppModalContent
          type="info"
          onOkClose={() => {
            action.modal.closeModal();
            setInitial();
            action.eventBoard.getIssueList();
            setPressed(false);
            jumpTo('list');
          }}>
          <View style={{marginLeft: 30}}>
            <AppStyledText
              text={i18n.t(`event:alert:${pIssue ? 'reOpen' : 'open'}`)}
              textStyle={styles.modalText}
              format={{b: styles.modalBoldText}}
            />
          </View>
        </AppModalContent>
      ));
    }
  }, [
    action.eventBoard,
    action.modal,
    jumpTo,
    pIssue,
    pending,
    pressed,
    setInitial,
    success,
  ]);

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
      (selectedEvent?.rule?.image &&
        attachment.size < 1 &&
        paramImages.length < 1) ||
      (selectedEvent?.rule?.link && linkParam.findIndex((l) => !l) >= 0) ||
      linkParam?.find((l) => !!l && !isUrl(l))
    );
  }, [attachment.size, linkParam, msg, paramImages.length, selectedEvent]);

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
    if (selectedEvent?.rule?.link && linkParam?.findIndex((l) => !l) >= 0) {
      action.toast.push('event:empty:link');
      return;
    }

    if (linkParam.find((l) => !!l && !isUrl(l))) {
      action.toast.push('event:invalidLink');
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

    const prev = eventBoard.list.find((l) => l.eventId === selectedEvent?.nid);
    const statusCode = prev?.statusCode || '';

    if (statusCode && statusCode !== 'f') {
      action.modal.renderModal(() => (
        <AppModalContent
          type="info"
          onOkClose={() => action.modal.closeModal()}>
          <View style={{marginLeft: 30}}>
            <AppStyledText
              text={i18n.t(
                `event:alert:duplication${statusCode === 'r' ? ':reopen' : ''}`,
              )}
              textStyle={styles.modalText}
              format={{b: styles.modalBoldText}}
            />
          </View>
        </AppModalContent>
      ));
    } else {
      const issue = {
        title,
        msg,
        link: linkParam.map((l) => ({value: l})),
        eventUuid: selectedEvent?.uuid,
        eventStatus: statusCode === 'f' ? 'R' : 'O',
        paramImages,
        images: attachment
          .map((a) => utils.convertCropImageToRkbImage(a))
          .toArray(),
        prevId: pIssue?.id || prev?.id || '',
      } as RkbEventIssue;

      action.eventBoard.postAndGetList(issue);
      setPressed(true);
    }
  }, [
    title,
    msg,
    selectedEvent,
    linkParam,
    attachment,
    paramImages,
    eventBoard.list,
    action,
    pIssue?.id,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid
        enableResetScrollToCoords={false}
        contentContainerStyle={styles.modalInner}
        extraScrollHeight={extraHeight}
        innerRef={(ref) => {
          scrollRef.current = ref;
        }}
        keyboardShouldPersistTaps="handled">
        <View style={{flex: 1}}>
          {pIssue ? (
            <View style={{marginHorizontal: 20, marginBottom: 24}}>
              <EventStatusBox
                statusCode={pIssue.statusCode}
                reason={pIssue.rejectReason.concat(pIssue.otherReason)}
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
              showModal ? {borderColor: colors.clearBlue} : undefined,
              pIssue ? {backgroundColor: colors.backGrey} : undefined,
              {marginBottom: 8},
            ]}
            onPress={() => {
              if (eventList.length > 0) setShowModal(true);
              else action.toast.push('event:empty');
            }}
            disabled={!!pIssue}>
            <AppText
              style={[
                styles.eventTitleText,
                !selectedEvent ? {color: colors.greyish} : undefined,
              ]}>
              {!selectedEvent
                ? i18n.t('event:placeholder')
                : selectedEvent?.title}
            </AppText>
            <AppIcon name={showModal ? 'dropDownOpen' : 'dropDown'} />
          </Pressable>

          {selectedEvent && (
            <View style={styles.notice}>
              <Pressable
                style={[
                  styles.noticeBtn,
                  showNotice ? styles.noticeBtnWeb : undefined,
                ]}
                onPress={() => setShowNotice(!showNotice)}>
                <AppText style={styles.noticeBtnTitle}>
                  {i18n.t('event:notice')}
                </AppText>
                <AppSvgIcon
                  name={showNotice ? 'iconArrowUp' : 'iconArrowDown'}
                />
              </Pressable>

              {selectedEvent.notice && showNotice && (
                <View style={styles.noticeBox}>
                  <AppStyledText
                    text={selectedEvent.notice}
                    textStyle={styles.noticeSubContents}
                    format={{
                      b: styles.noticeTitle,
                      s: styles.noticeMainContents,
                    }}
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

          <View
            style={[
              styles.inputBox,
              styles.inputMsgBox,
              msgFocused ? {borderColor: colors.clearBlue} : undefined,
            ]}>
            <AppTextInput
              style={styles.inputMsg}
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
                setMsgFocused(true);
              }}
              onBlur={() => setMsgFocused(false)}
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
          </View>

          {selectedEvent && (
            <LinkInput
              value={linkParam}
              onChangeValue={setLinkParam}
              required={selectedEvent?.rule?.link}
            />
          )}

          <AttachmentBox
            selectedEvent={selectedEvent}
            paramImages={paramImages}
            setParamImages={setParamImages}
            attachment={attachment}
            setAttachment={setAttachment}
            imageQuality={selectedEvent?.rule?.imageQuality}
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
        style={[
          styles.confirm,
          hasError ? {backgroundColor: colors.warmGrey} : undefined,
        ]}
        pressedStyle={{
          backgroundColor: hasError ? colors.warmGrey : colors.dodgerBlue,
        }}
        title={i18n.t(`event:new2${pIssue ? ':re' : ''}`)}
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
        }}
        value={selectedEvent?.title}
      />
      <AppActivityIndicator visible={pending} />
    </SafeAreaView>
  );
};

export default connect(
  ({promotion, eventBoard, status}: RootState) => ({
    promotion,
    eventBoard,
    success: status.fulfilled[eventBoardActions.postEventIssue.typePrefix],
    pending:
      status.pending[eventBoardActions.postEventIssue.typePrefix] ||
      status.pending[eventBoardActions.postEventAttach.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      eventBoard: bindActionCreators(eventBoardActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(ApplyEvent);
