import React, {useEffect} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  EventBoardAction,
  EventBoardModelState,
  actions as eventBoardActions,
} from '@/redux/modules/eventBoard';
import BoardItemList from '@/screens/BoardScreen/BoardItemList';
import i18n from '@/utils/i18n';
import {RkbEventBoard} from '@/redux/api/eventBoardApi';
import {PromotionModelState} from '@/redux/modules/promotion';
import {HomeStackParamList} from '@/navigation/navigation';
import {RkbBoard} from '@/redux/api/boardApi';

type MyEventListProps = {
  promotion: PromotionModelState;
  eventBoard: EventBoardModelState;
  uid: number;
  isEvent?: boolean;
  pending: boolean;

  action: {
    eventBoard: EventBoardAction;
  };
};

type MyEventListNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'MyEventList'
>;

const MyEventList: React.FC<MyEventListProps> = ({
  promotion,
  eventBoard,
  pending,
  uid,
  action,
}) => {
  const navigation = useNavigation<MyEventListNavigationProp>();

  useEffect(() => {
    action.eventBoard.getIssueList();
  }, [action.eventBoard]);

  return (
    <BoardItemList
      data={eventBoard.list}
      uid={uid}
      onScrollEndDrag={() => action.eventBoard.getNextIssueList()}
      onRefresh={() => action.eventBoard.getIssueList()}
      refreshing={pending}
      onPress={(issue: RkbEventBoard | RkbBoard) =>
        navigation.navigate('EventResult', {
          issue: issue as RkbEventBoard,
          title: i18n.t('event:list'),
          showStatus: true,
          eventList: promotion.event,
        })
      }
    />
  );
};

export default connect(
  ({account, promotion, eventBoard, status}: RootState) => ({
    promotion,
    eventBoard,
    uid: account.uid || 0,
    pending: status.pending[eventBoardActions.getIssueList.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      eventBoard: bindActionCreators(eventBoardActions, dispatch),
    },
  }),
)(MyEventList);
