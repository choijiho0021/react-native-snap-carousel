/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import {List} from 'immutable';
import {Image as CropImage} from 'react-native-image-crop-picker';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import i18n from '@/utils/i18n';
import AppBackButton from '@/components/AppBackButton';
import BoardMsgAdd, {
  EventLinkType,
  EventParamImagesType,
} from '@/components/BoardMsgAdd';
import BoardMsgList from '@/components/BoardMsgList';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {Utils} from '@/redux/api';
import {RootState} from '@/redux';
import {PromotionModelState} from '@/redux/modules/promotion';
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import {
  actions as eventBoardActions,
  EventBoardAction,
} from '@/redux/modules/eventBoard';
import {RkbEvent} from '@/redux/api/promotionApi';
import {BoardModelState} from '@/redux/modules/board';
import AppModalContent from '@/components/ModalContent/AppModalContent';
import AppStyledText from '@/components/AppStyledText';
import {RkbImage} from '@/redux/api/accountApi';
import {RkbEventIssue} from '@/redux/api/eventBoardApi';
import AppActivityIndicator from '@/components/AppActivityIndicator';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
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

type EventBoardScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'EventBoard'
>;

type EventBoardScreenRouteProp = RouteProp<HomeStackParamList, 'EventBoard'>;

type EventBoardScreenProps = {
  navigation: EventBoardScreenNavigationProp;
  route: EventBoardScreenRouteProp;
  promotion: PromotionModelState;

  pendingEvent: boolean;
  successEvent: boolean;
  eventBoard: BoardModelState;

  action: {
    eventBoard: EventBoardAction;
    toast: ToastAction;
    modal: ModalAction;
  };
};

type TabRoute = {key: string; title: string};

export type OnPressEventParams = {
  title?: string;
  msg?: string;
  selectedEvent?: RkbEvent;
  linkParam?: EventLinkType[];
  paramImages?: EventParamImagesType[];
  attachment: List<CropImage>;
};

const EventBoardScreen: React.FC<EventBoardScreenProps> = ({
  route: {params},
  navigation,
  promotion,
  action,
  eventBoard,
  pendingEvent,
  successEvent,
}) => {
  const [index, setIndex] = useState(params?.index ? params.index : 0);
  const routes = useRef([
    {key: 'new', title: i18n.t('event:new')},
    {key: 'list', title: i18n.t('event:list')},
  ]).current;
  const [fontSize, setFontSize] = useState(16);
  const eventList = useMemo(() => promotion.event || [], [promotion.event]);
  const paramIssue = useMemo(() => params?.issue, [params?.issue]);
  const paramNid = useMemo(() => params?.nid, [params?.nid]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('event:title')} />,
    });

    Utils.fontScaling(16).then(setFontSize);
  }, [navigation]);

  useEffect(() => {
    action.eventBoard.getIssueList();
  }, [action.eventBoard]);

  useEffect(() => {
    if (successEvent) action.eventBoard.getIssueList();
  }, [action.eventBoard, successEvent]);

  useEffect(() => {
    if (successEvent) setIndex(1);
  }, [successEvent]);

  const onPress = useCallback(
    ({
      title,
      msg,
      selectedEvent,
      linkParam,
      attachment,
      paramImages,
    }: OnPressEventParams) => {
      if (!title) {
        action.toast.push('event:empty:title');
        return false;
      }
      if (!msg) {
        action.toast.push('event:empty:msg');
        return false;
      }
      // 링크 필수 인경우
      if (selectedEvent?.rule?.link && linkParam?.find((l) => l.value === '')) {
        action.toast.push('event:empty:link');
        return false;
      }

      // 이미지 필수 인경우
      if (
        selectedEvent?.rule?.image &&
        attachment.size < 1 &&
        (paramImages?.length || 0) < 1
      ) {
        action.toast.push('event:empty:image');
        return false;
      }

      const isDuplicated = !!eventBoard.list.find(
        (l) => l.title === selectedEvent?.title && l.statusCode !== 'f',
      );

      const isreOpenDuplicated = !!eventBoard.list.find(
        (l) => l.title === selectedEvent?.title && l.statusCode === 'r',
      );

      if (isDuplicated || isreOpenDuplicated) {
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
                      isreOpenDuplicated ? ':reopen' : ''
                    }`,
                  )}
                  textStyle={styles.modalText}
                  format={{b: styles.modalBoldText}}
                />
              </View>
            </AppModalContent>
          ),
        });
        return false;
      }

      const isReapply = !!eventBoard.list.find(
        (l) => l.title === selectedEvent?.title && l.statusCode === 'f',
      );

      const issue = {
        title,
        msg,
        link: linkParam,
        eventUuid: selectedEvent?.uuid,
        eventStatus: isReapply ? 'R' : 'O',
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
                  text={i18n.t(`event:alert:${isReapply ? 'reOpen' : 'open'}`)}
                  textStyle={styles.modalText}
                  format={{b: styles.modalBoldText}}
                />
              </View>
            </AppModalContent>
          ),
        });
      return true;
    },
    [
      action.eventBoard,
      action.modal,
      action.toast,
      eventBoard.list,
      successEvent,
    ],
  );

  const renderScene = useCallback(
    ({route, jumpTo}: {route: TabRoute; jumpTo: (v: string) => void}) => {
      if (route.key === 'new') {
        return (
          <BoardMsgAdd
            jumpTo={jumpTo}
            isEvent
            eventList={eventList}
            paramIssue={paramIssue}
            paramNid={paramNid}
            onPressEvent={onPress}
          />
        );
      }
      if (route.key === 'list') {
        return (
          <BoardMsgList
            isEvent
            onPress={(uuid: string, status: string) =>
              navigation.navigate('BoardMsgResp', {
                uuid,
                status,
                isEvent: true,
              })
            }
            eventBoard={eventBoard}
          />
        );
      }
      return null;
    },
    [eventBoard, eventList, navigation, onPress, paramIssue, paramNid],
  );

  const renderTabBar = useCallback(
    (props) => (
      <TabBar
        {...props}
        tabStyle={{paddingVertical: 15}}
        labelStyle={[appStyles.normal16Text, {fontSize}]}
        activeColor={colors.black}
        inactiveColor={colors.warmGrey}
        indicatorStyle={{
          borderBottomColor: colors.black,
          borderBottomWidth: 2,
        }}
        style={{
          paddingBottom: 2,
          backgroundColor: colors.white,
          marginHorizontal: 20,
        }}
        getLabelText={(scene) => scene.route.title}
      />
    ),
    [fontSize],
  );

  return (
    <View style={styles.container}>
      <AppActivityIndicator visible={pendingEvent} />
      <TabView
        style={styles.container}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: Dimensions.get('window').width}}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

export default connect(
  ({eventBoard, promotion, status}: RootState) => ({
    eventBoard,
    promotion,
    pendingEvent:
      status.pending[eventBoardActions.postEventIssue.typePrefix] ||
      status.pending[eventBoardActions.postEventAttach.typePrefix] ||
      status.pending[eventBoardActions.fetchEventIssueList.typePrefix] ||
      false,
    successEvent: status.fulfilled[eventBoardActions.postEventIssue.typePrefix],
  }),
  (dispatch) => ({
    action: {
      eventBoard: bindActionCreators(eventBoardActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(EventBoardScreen);
