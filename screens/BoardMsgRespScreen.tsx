import {useRoute} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
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
  account,
  pending,
  action,
}) => {
  const route = useRoute();
  const [idx, setIdx] = useState<number>();
  const issue = useMemo(
    () => (idx !== undefined && idx >= 0 ? board?.list[idx] : undefined),
    [board?.list, idx],
  );
  const resp = useMemo(() => board?.comment?.[0] || {}, [board?.comment]);

  useEffect(() => {
    const {uuid, status} = route?.params || {};

    if (uuid) {
      action.board.getIssueList(false).then(() => {
        setIdx(board.list.findIndex((item) => item.uuid === uuid));

        if (status === 'Closed') {
          const {token} = account;
          action.board.getIssueResp({uuid, token});
        } else {
          action.board.resetIssueComment();
        }
      });
    }
  }, [account, action.board, board.list, route?.params]);

  return (
    <ResultScreen
      issue={issue}
      title={i18n.t('board:title')}
      resp={resp?.body}
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
