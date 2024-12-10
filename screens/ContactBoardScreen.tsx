import React from 'react';
import i18n from '@/utils/i18n';
import BoardMsgAdd from '@/components/BoardMsgAdd';
import BoardMsgList from '@/components/BoardMsgList';
import BoardScreen from './BoardScreen';
import {AccountModelState} from '@/redux/modules/account';
import {connect} from 'react-redux';
import {RootState} from '@/redux';

type ContactBoardScreenProps = {
  account: AccountModelState;
};

// account: {loggedIn},
const ContactBoardScreen: React.FC<ContactBoardScreenProps> = ({
  account: {loggedIn},
}) => {
  return (
    <BoardScreen
      title={i18n.t('board:title')}
      routes={[
        {
          key: 'new',
          title: i18n.t('board:new'),
          render: (jumpTo) => <BoardMsgAdd jumpTo={jumpTo} />,
        },
        {
          key: 'list',
          title: i18n.t(loggedIn ? 'board:list:login' : 'board:list'),
          render: () => <BoardMsgList />,
        },
      ]}
    />
  );
};

export default connect(({account}: RootState) => ({
  account,
}))(ContactBoardScreen);
