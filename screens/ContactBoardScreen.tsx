import React from 'react';
import i18n from '@/utils/i18n';
import BoardMsgAdd from '@/components/BoardMsgAdd';
import BoardMsgList from '@/components/BoardMsgList';
import BoardScreen from './BoardScreen';

const ContactBoardScreen = () => {
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
          title: i18n.t('board:list'),
          render: () => <BoardMsgList />,
        },
      ]}
    />
  );
};

export default ContactBoardScreen;
