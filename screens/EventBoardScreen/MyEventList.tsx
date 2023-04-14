import React, {useEffect} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import {
  EventBoardAction,
  actions as eventBoardActions,
} from '@/redux/modules/eventBoard';
import BoardItemList from '@/screens/BoardScreen/BoardItemList';
import {BoardModelState} from '@/redux/modules/board';
import {AccountModelState} from '@/redux/modules/account';

type MyEventListProps = {
  eventBoard: BoardModelState;
  account: AccountModelState;
  uid: number;
  isEvent?: boolean;
  onPress: (uuid: string, status: string) => void;

  action: {
    eventBoard: EventBoardAction;
  };
};

const MyEventList: React.FC<MyEventListProps> = ({
  navigation,
  eventBoard,
  uid,
  action,
}) => {
  console.log('@@@ my event list');

  useEffect(() => {
    action.eventBoard.getIssueList();
  }, [action.eventBoard]);

  return (
    <BoardItemList
      data={eventBoard.list}
      uid={uid}
      onScrollEndDrag={() => action.eventBoard.getNextIssueList()}
      onRefresh={() => action.eventBoard.getIssueList()}
      onPress={(uuid: string, status: string) =>
        navigation.navigate('BoardMsgResp', {
          uuid,
          status,
          isEvent: true,
        })
      }
    />
  );
};

export default connect(
  ({account, eventBoard}: RootState) => ({
    account,
    eventBoard,
    uid: account.uid || 0,
  }),
  (dispatch) => ({
    action: {
      eventBoard: bindActionCreators(eventBoardActions, dispatch),
    },
  }),
)(MyEventList);
