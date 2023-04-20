import React from 'react';
import i18n from '@/utils/i18n';
import BoardScreen from '@/screens/BoardScreen';
import ApplyEvent from './ApplyEvent';
import MyEventList from './MyEventList';

const EventBoardScreen = (props) => {
  return (
    <BoardScreen
      pending={false}
      title={i18n.t('event:title')}
      routes={[
        {
          key: 'new',
          title: i18n.t('event:new'),
          render: (jumpTo) => (
            <ApplyEvent
              paramIssue={props.route.params?.issue}
              paramNid={props.route.params?.nid}
              jumpTo={jumpTo}
            />
          ),
        },
        {
          key: 'list',
          title: i18n.t('event:list'),
          render: () => <MyEventList />,
        },
      ]}
    />
  );
};

export default EventBoardScreen;
