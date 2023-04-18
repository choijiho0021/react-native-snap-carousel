import React from 'react';
import {connect} from 'react-redux';
import {RootState} from '@/redux';
import i18n from '@/utils/i18n';
import {actions as eventBoardActions} from '@/redux/modules/eventBoard';
import BoardScreen from '@/screens/BoardScreen';
import ApplyEvent from './ApplyEvent';
import MyEventList from './MyEventList';

const EventBoardScreen = (props) => {
  return (
    <BoardScreen
      {...props}
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

export default connect(({promotion, eventBoard, status}: RootState) => ({
  promotion,
  eventBoard,
  pending:
    status.pending[eventBoardActions.fetchEventIssueList.typePrefix] || false,
  success: status.fulfilled[eventBoardActions.postEventIssue.typePrefix],
}))(EventBoardScreen);
