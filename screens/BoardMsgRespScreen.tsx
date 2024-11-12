import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {RootState} from '@/redux';
import {
  actions as boardActions,
  BoardAction,
  BoardModelState,
} from '@/redux/modules/board';
import i18n from '@/utils/i18n';
import {AccountModelState} from '@/redux/modules/account';
import ResultScreen from './BoardScreen/ResultScreen';
import {HomeStackParamList} from '@/navigation/navigation';
import {BoardMsgStatus, RkbBoard} from '@/redux/api/boardApi';
import ResultBoardScreen from './BoardScreen/ResultBoardScreen';

// type BoardMsgRespScreenNavigationProp = StackNavigationProp<
//   HomeStackParamList,
//   'BoardMsgResp'
// >;

type BoardMsgRespScreenRouteProp = RouteProp<
  HomeStackParamList,
  'BoardMsgResp'
>;

type BoardMsgRespScreenProps = {
  board: BoardModelState;
  account: AccountModelState;
  pending: boolean;
  action: {
    board: BoardAction;
  };
};

const BoardMsgRespScreen: React.FC<BoardMsgRespScreenProps> = ({
  board,
  account: {token},
  pending,
  action,
}) => {
  const route = useRoute<BoardMsgRespScreenRouteProp>();
  const [issue, setIssue] = useState<RkbBoard | undefined>(route?.params?.item);
  const resp = useMemo(() => board?.comment?.[0] || {}, [board?.comment]);
  const type = useMemo(() => route?.params?.type, [route?.params?.type]);

  const getComment = useCallback(
    (uuid: string, status?: BoardMsgStatus) => {
      if (status === 'Closed') {
        action.board.getIssueResp({uuid, token});
      } else {
        action.board.resetIssueComment();
      }
    },
    [action.board, token],
  );

  useEffect(() => {
    if (!issue) {
      action.board.getIssueList();
    }
  }, [action.board, issue]);

  useEffect(() => {
    const {uuid} = route?.params || {};

    if (!issue && uuid) {
      setIssue(board.list.find((bd) => bd.uuid === uuid));
    }
  }, [board.list, issue, route?.params]);

  useEffect(() => {
    const {status} = route?.params || {};

    if (issue && !issue?.replyMsg) getComment(issue.uuid, status);
  }, [getComment, issue, route?.params]);

  return type === 'board' ? (
    <ResultBoardScreen
      issue={issue}
      title={i18n.t('board:resp:title')}
      resp={issue?.replyMsg || resp?.body}
      pending={pending}
    />
  ) : (
    <ResultScreen
      issue={issue}
      title={i18n.t('board:resp:title')}
      resp={issue?.replyMsg || resp?.body}
      pending={pending}
    />
  );
};

export default connect(
  ({board, account, status}: RootState) => ({
    board,
    account,
    pending: status.pending[boardActions.getIssueResp.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      board: bindActionCreators(boardActions, dispatch),
    },
  }),
)(BoardMsgRespScreen);
