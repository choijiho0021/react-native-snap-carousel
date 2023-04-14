import React from 'react';
import {connect} from 'react-redux';
import {RootState} from '@/redux';
import i18n from '@/utils/i18n';
import {actions as eventBoardActions} from '@/redux/modules/eventBoard';
import BoardItemList from '@/screens/BoardScreen/BoardItemList';
import BoardScreen from '@/screens/BoardScreen/BoardScreen';
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
          render: () => (
            <ApplyEvent
              paramIssue={props.route.params?.issue}
              paramNid={props.route.params?.nid}
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
    status.pending[eventBoardActions.postEventIssue.typePrefix] ||
    status.pending[eventBoardActions.postEventAttach.typePrefix] ||
    status.pending[eventBoardActions.fetchEventIssueList.typePrefix] ||
    false,
  success: status.fulfilled[eventBoardActions.postEventIssue.typePrefix],
}))(EventBoardScreen);
