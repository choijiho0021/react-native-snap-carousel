import React from 'react';
import {connect} from 'react-redux';
import {RootState} from 'redux';
import i18n from '@/utils/i18n';
import BoardMsgAdd from '@/components/BoardMsgAdd';
import BoardMsgList from '@/components/BoardMsgList';
import {actions as boardActions} from '@/redux/modules/board';
import BoardScreen from './BoardScreen';

const ContactBoardScreen = ({pending}: {pending: boolean}) => {
  return (
    <BoardScreen
      pending={pending}
      title={i18n.t('board:title')}
      routes={[
        {
          key: 'new',
          title: i18n.t('board:new'),
          render: (jumpTo) => <BoardMsgAdd jumpTo={jumpTo} />,
        },
        {
          key: 'list',
          title: i18n.t('board:list'),
          render: () => <BoardMsgList />,
        },
      ]}
    />
  );
};

export default connect(({status}: RootState) => ({
  pending:
    status.pending[boardActions.postIssue.typePrefix] ||
    status.pending[boardActions.postAttach.typePrefix] ||
    status.pending[boardActions.fetchIssueList.typePrefix] ||
    false,
}))(ContactBoardScreen);
