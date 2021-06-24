import React, {Component, memo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {bindActionCreators} from 'redux';
import Analytics from 'appcenter-analytics';
import {connect} from 'react-redux';
import _ from 'underscore';
import i18n from '../utils/i18n';
import {appStyles} from '../constants/Styles';
import {colors} from '../constants/Colors';
import AppIcon from '../components/AppIcon';
import utils from '@/submodules/rokebi-utils/utils';
import * as orderActions from '../redux/modules/order';
import * as notiActions from '../redux/modules/noti';
import * as boardActions from '../redux/modules/board';
import {actions as accountActions} from '../redux/modules/account';
import AppBackButton from '../components/AppBackButton';
import {RootState} from '@/redux';

const MODE_NOTIFICATION = 'info';

const styles = StyleSheet.create({
  container: {
    ...appStyles.container,
    alignItems: 'stretch',
  },
  notibox: {
    height: 126,
    marginTop: 3,
    paddingTop: 10,
    paddingBottom: 14,
    paddingLeft: 18,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  created: {
    ...appStyles.normal12Text,
    textAlign: 'left',
  },
  title: {
    marginBottom: 11,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    ...appStyles.normal16Text,
  },
  titleHead: {
    fontSize: 8,
    color: colors.tomato,
    marginRight: 6,
  },
  renderItem: {
    height: 98,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  notiText: {
    width: '90%',
    height: 98,
  },
  body: {
    ...appStyles.normal14Text,
    height: 48,
    width: '100%',
    lineHeight: 24,
    letterSpacing: 0.23,
    color: colors.warmGrey,
  },
  Icon: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 98,
    width: 10,
  },
  emptyPage: {
    marginTop: 60,
    textAlign: 'center',
    color: colors.black,
  },
});

const renderEmptyContainer = () => {
  return <Text style={styles.emptyPage}>{i18n.t('noti:empty')}</Text>;
};

const areEqual = (prevProps, nextProps) => {
  return prevProps.item.isRead === nextProps.item.isRead;
};

const NotiListItem0 = ({item, onPress}) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View
        key={item.uuid}
        style={[
          styles.notibox,
          {
            backgroundColor:
              item.isRead === 'F' ? colors.whiteTwo : colors.white,
          },
        ]}>
        <View key="notitext" style={styles.notiText}>
          <Text key="created" style={styles.created}>
            {utils.toDateString(item.created)}
          </Text>
          <View style={styles.title}>
            <Text key="titleText" style={styles.titleText}>
              {item.title}
            </Text>
          </View>
          <Text
            key="body"
            style={styles.body}
            numberOfLines={3}
            ellipsizeMode="tail">
            {utils.htmlToString(item.summary || item.body)}
          </Text>
        </View>
        <View key="iconview" style={styles.Icon}>
          <AppIcon key="icon" name="iconArrowRight" size={10} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NotiListItem = memo(NotiListItem0, areEqual);

class NotiScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      mode: 'noti',
    };

    this.onRefresh = this.onRefresh.bind(this);
  }

  componentDidMount() {
    const {params} = this.props.route;
    const mode = params && params.mode ? params.mode : 'noti';
    const info = params && params.info;

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton
          navigation={this.props.navigation}
          title={
            (this.props.route.params && this.props.route.params.title) ||
            i18n.t('set:noti')
          }
        />
      ),
    });

    Analytics.trackEvent('Page_View_Count', {page: 'Noti'});

    this.props.action.board.getIssueList();
    this.setState({mode, info});
  }

  componentDidUpdate(prevProps) {
    if (!this.props.pending && this.props.pending !== prevProps.pending) {
      this.setState({
        refreshing: false,
      });
    }
  }

  // 공지사항의 경우 notiType이 없으므로 Notice/0으로 기본값 설정
  onPress = ({
    uuid,
    isRead,
    bodyTitle,
    body,
    notiType = 'Notice/0',
    format = 'text',
  }) => {
    const {auth} = this.props;

    const {mode} = this.state;
    const split = notiType.split('/');
    const type = split[0];
    const id = split[1];

    Analytics.trackEvent('Page_View_Count', {page: 'Noti Detail'});

    if (uuid) {
      // if ( mode != MODE_NOTIFICATION) this.props.action.noti.notiReadAndGet(uuid, this.props.account.mobile, this.props.auth )
      if (mode !== MODE_NOTIFICATION && isRead === 'F')
        this.props.action.noti.readNoti(uuid, this.props.auth);

      switch (type) {
        case notiActions.NOTI_TYPE_REPLY:
          this.props.navigation.navigate('BoardMsgResp', {
            key: id,
            status: 'Closed',
          });
          break;
        case notiActions.NOTI_TYPE_PYM:
          // read orders if not read before
          this.props.action.order.checkAndGetOrderById(auth, id).then(() => {
            this.props.navigation.navigate('PurchaseDetail', {
              detail: this.props.order.orders[
                this.props.order.ordersIdx.get(Number(id))
              ],
              auth,
            });
          });
          break;
        case notiActions.NOTI_TYPE_USIM:
          this.props.navigation.navigate('Usim');
          break;
        default:
          // 아직 일반 Noti 알림은 없으므로 공지사항 용으로만 사용, 후에 일반 Noti 상세페이지(notitype = noti)가 사용될 수 있도록 함
          this.props.navigation.navigate('SimpleText', {
            key: 'noti',
            title:
              type === notiActions.NOTI_TYPE_NOTI
                ? i18n.t('set:noti')
                : i18n.t('contact:noticeDetail'),
            bodyTitle,
            text: body,
            mode: 'info',
          });
      }
    }
  };

  onRefresh() {
    this.setState({
      refreshing: true,
    });
    this.props.action.noti.getNotiList(this.props.account.mobile);
  }

  renderItem = ({item}) => {
    return <NotiListItem item={item} onPress={this.onPress} />;
  };

  render() {
    const {notiList} = this.props.noti;
    const {mode, info, refreshing} = this.state;

    const data = mode === MODE_NOTIFICATION ? info : notiList;

    return (
      <View key="container" style={styles.container}>
        <FlatList
          data={data}
          renderItem={this.renderItem}
          // refreshing={refreshing}
          // onRefresh={this.onRefresh}
          ListEmptyComponent={renderEmptyContainer()}
          tintColor={colors.clearBlue}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              colors={[colors.clearBlue]} // android 전용
              tintColor={colors.clearBlue} // ios 전용
            />
          }
        />
      </View>
    );
  }
}

export default connect(
  ({account, order, board, noti, pender}: RootState) => ({
    account,
    auth: accountActions.auth(account),
    order,
    board,
    noti,
    pending: pender.pending[notiActions.GET_NOTI_LIST] || false,
    // pending: state.pender.pending
  }),
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
      board: bindActionCreators(boardActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
    },
  }),
)(NotiScreen);
