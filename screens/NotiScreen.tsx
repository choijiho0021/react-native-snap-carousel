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
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppIcon from '@/components/AppIcon';
import utils from '@/submodules/rokebi-utils/utils';
import {
  actions as orderActions,
  OrderAction,
  OrderModelState,
} from '@/redux/modules/order';
import {actions as notiActions, NotiAction} from '@/redux/modules/noti';
import {actions as boardActions, BoardAction} from '@/redux/modules/board';
import {AccountAuth, actions as accountActions} from '@/redux/modules/account';
import AppBackButton from '@/components/AppBackButton';
import {RootState} from '@/redux';
import {RkbNoti} from '@/submodules/rokebi-utils/api/notiApi';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RkbInfo} from '@/submodules/rokebi-utils/api/pageApi';
import Env from '@/environment';
import {HomeStackParamList} from '../navigation/MainTabNavigator';

const {esimApp} = Env.get();

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

const areEqual = (
  {item: prevItem}: {item: RkbNoti},
  {item: nextItem}: {item: RkbNoti},
) => prevItem.isRead === nextItem.isRead;

const NotiListItem0 = ({
  item,
  onPress,
}: {
  item: RkbNoti;
  onPress: (n: RkbNoti) => void;
}) => {
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

type NotiScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Noti'>;
type NotiScreenRouteProp = RouteProp<HomeStackParamList, 'Noti'>;

type NotiScreenProps = {
  navigation: NotiScreenNavigationProp;
  route: NotiScreenRouteProp;
  pending: boolean;
  auth: AccountAuth;
  order: OrderModelState;
  action: {
    noti: NotiAction;
    board: BoardAction;
    order: OrderAction;
  };
};

type NotiScreenState = {
  mode: 'noti' | 'info';
  info?: RkbInfo[];
};

class NotiScreen extends Component<NotiScreenProps, NotiScreenState> {
  constructor(props: NotiScreenProps) {
    super(props);

    this.state = {
      mode: 'noti',
    };

    this.onRefresh = this.onRefresh.bind(this);
  }

  componentDidMount() {
    const {params} = this.props.route;
    const mode = params?.mode || 'noti';
    const info = params?.info;

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton title={params?.title || i18n.t('set:noti')} />
      ),
    });

    Analytics.trackEvent('Page_View_Count', {page: 'Noti'});

    this.props.action.board.getIssueList();
    this.setState({mode, info});
  }

  // 공지사항의 경우 notiType이 없으므로 Notice/0으로 기본값 설정
  onPress = ({
    uuid,
    isRead,
    bodyTitle,
    body,
    notiType = 'Notice/0',
  }: RkbNoti) => {
    const {auth, navigation, order} = this.props;
    const {mode} = this.state;
    const split = notiType.split('/');
    const type = split[0];
    const id = split[1];

    Analytics.trackEvent('Page_View_Count', {page: 'Noti Detail'});

    if (uuid) {
      // if ( mode != MODE_NOTIFICATION) this.props.action.noti.notiReadAndGet(uuid, this.props.account.mobile, this.props.auth )
      if (mode !== 'info' && isRead === 'F')
        this.props.action.noti.readNoti(uuid, {token: auth.token});

      switch (type) {
        case notiActions.NOTI_TYPE_REPLY:
          navigation.navigate('BoardMsgResp', {
            key: id,
            status: 'Closed',
          });
          break;

        case notiActions.NOTI_TYPE_PYM:
          // read orders if not read before
          this.props.action.order.checkAndGetOrderById(auth, id).then(() => {
            navigation.navigate('PurchaseDetail', {
              detail: order.orders[order.ordersIdx.get(Number(id))],
              auth,
            });
          });
          break;

        default:
          if (esimApp || type !== notiActions.NOTI_TYPE_USIM) {
            // 아직 일반 Noti 알림은 없으므로 공지사항 용으로만 사용, 후에 일반 Noti 상세페이지(notitype = noti)가 사용될 수 있도록 함
            navigation.navigate('SimpleText', {
              key: 'noti',
              title:
                type === notiActions.NOTI_TYPE_NOTI
                  ? i18n.t('set:noti')
                  : i18n.t('contact:noticeDetail'),
              bodyTitle,
              text: body,
              mode: 'info',
            });
          } else {
            navigation.navigate('Usim');
          }
      }
    }
  };

  onRefresh() {
    this.props.action.noti.getNotiList(this.props.account.mobile);
  }

  renderItem = ({item}) => {
    return <NotiListItem item={item} onPress={this.onPress} />;
  };

  render() {
    const {
      noti: {notiList},
      pending,
    } = this.props;
    const {mode, info} = this.state;
    const data = mode === 'info' ? info : notiList;

    return (
      <View key="container" style={styles.container}>
        <FlatList
          data={data}
          renderItem={this.renderItem}
          ListEmptyComponent={renderEmptyContainer()}
          tintColor={colors.clearBlue}
          refreshControl={
            <RefreshControl
              refreshing={pending}
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
