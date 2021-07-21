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
import {
  actions as notiActions,
  NotiAction,
  NotiModelState,
} from '@/redux/modules/noti';
import {actions as boardActions, BoardAction} from '@/redux/modules/board';
import {
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import AppBackButton from '@/components/AppBackButton';
import {RootState} from '@/redux';
import {RkbNoti} from '@/submodules/rokebi-utils/api/notiApi';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RkbInfo} from '@/submodules/rokebi-utils/api/pageApi';
import {HomeStackParamList} from '@/navigation/navigation';

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
  icon: {
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
        <View key="iconview" style={styles.icon}>
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
  order: OrderModelState;
  account: AccountModelState;
  noti: NotiModelState;
  action: {
    noti: NotiAction;
    board: BoardAction;
    order: OrderAction;
  };
};

type NotiScreenState = {
  mode: 'noti' | 'info';
  info: RkbInfo[];
};

class NotiScreen extends Component<NotiScreenProps, NotiScreenState> {
  constructor(props: NotiScreenProps) {
    super(props);

    this.state = {
      mode: 'noti',
      info: [],
    };

    this.onRefresh = this.onRefresh.bind(this);
  }

  componentDidMount() {
    const {params} = this.props.route;
    const {mode = 'info', info = []} = params || {};

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
  onPress = async ({
    uuid,
    isRead,
    bodyTitle,
    body,
    notiType = 'Notice/0',
  }: RkbNoti) => {
    const {
      account: {mobile, token},
      navigation,
      order,
    } = this.props;
    const {mode} = this.state;
    const split = notiType.split('/');
    const type = split[0];
    const orderId = split[1];

    Analytics.trackEvent('Page_View_Count', {page: 'Noti Detail'});

    if (uuid) {
      // if ( mode != MODE_NOTIFICATION) this.props.action.noti.notiReadAndGet(uuid, this.props.account.mobile, this.props.auth )
      if (mode !== 'info' && isRead === 'F')
        this.props.action.noti.readNoti({uuid, token});

      switch (type) {
        case notiActions.NOTI_TYPE_REPLY:
          navigation.navigate('BoardMsgResp', {
            uuid: orderId,
            status: 'Closed',
          });
          break;

        case notiActions.NOTI_TYPE_PYM:
          // read orders if not read before
          Promise.resolve(
            this.props.action.order.checkAndGetOrderById({
              user: mobile,
              token,
              orderId: utils.stringToNumber(orderId),
            }),
          ).then(() => {
            const ord = order.orders.get(Number(orderId));
            if (ord) {
              navigation.navigate('PurchaseDetail', {
                detail: ord,
              });
            }
          });
          break;

        case notiActions.NOTI_TYPE_USIM:
          navigation.navigate('Usim');
          break;

        default:
          // 아직 일반 Noti 알림은 없으므로 공지사항 용으로만 사용, 후에 일반 Noti 상세페이지(notitype = noti)가 사용될 수 있도록 함
          navigation.navigate('SimpleText', {
            key: 'noti',
            title:
              type === notiActions.NOTI_TYPE_NOTI
                ? i18n.t('set:noti')
                : i18n.t('contact:noticeDetail'),
            bodyTitle,
            text: body,
            mode: 'html',
          });
          break;
      }
    }
  };

  onRefresh() {
    const {mobile} = this.props.account;
    this.props.action.noti.getNotiList({mobile});
  }

  renderItem = ({item}: {item: RkbNoti}) => {
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
          ListEmptyComponent={
            <Text style={styles.emptyPage}>{i18n.t('noti:empty')}</Text>
          }
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
  ({account, order, board, noti, status}: RootState) => ({
    account,
    order,
    board,
    noti,
    pending: status.pending[notiActions.getNotiList.typePrefix] || false,
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
