import AppBackButton from '@/components/AppBackButton';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {RkbNoti} from '@/redux/api/notiApi';
import utils from '@/redux/api/utils';
import {
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as boardActions, BoardAction} from '@/redux/modules/board';
import {
  actions as infoActions,
  InfoAction,
  InfoModelState,
} from '@/redux/modules/info';
import {
  actions as notiActions,
  NotiAction,
  NotiModelState,
} from '@/redux/modules/noti';
import {
  actions as orderActions,
  OrderAction,
  OrderModelState,
} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {Component, memo} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Env from '@/environment';
import moment from 'moment';
import {SafeAreaView} from 'react-native';

const {esimGlobal} = Env.get();

const styles = StyleSheet.create({
  container: {
    ...appStyles.container,
    alignItems: 'stretch',
  },
  notibox: {
    // height: esimGlobal ? 120 : 100,

    marginTop: 3,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    // height: 98,
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
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={{backgroundColor: colors.white}}>
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
          <AppText
            key="titleText"
            style={[appStyles.bold13Text, {color: colors.warmGrey}]}>
            {moment(item.created).format('M월 DD일')}
          </AppText>
          <View style={styles.title}>
            <AppText
              key="titleText"
              style={styles.titleText}
              numberOfLines={2}
              ellipsizeMode="tail">
              {item.title}
            </AppText>
          </View>
          <AppText
            key="body"
            style={styles.body}
            numberOfLines={2}
            ellipsizeMode="tail">
            {utils.htmlToString(item.summary || item.body)}
          </AppText>
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
  info: InfoModelState;
  action: {
    noti: NotiAction;
    board: BoardAction;
    order: OrderAction;
    info: InfoAction;
  };
};

type NotiScreenState = {
  mode: 'noti' | 'info';
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
    const {
      info: {infoMap},
      route: {params},
    } = this.props;
    const {mode = 'info'} = params || {};

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton title={params?.title || i18n.t('set:noti')} />
      ),
    });

    Analytics.trackEvent('Page_View_Count', {page: 'Noti'});

    if (mode === 'info' && !infoMap.has('info')) {
      this.props.action.info.getInfoList('info');
    }

    this.props.action.board.getIssueList();
    this.setState({mode});
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

        case notiActions.NOTI_TYPE_INVITE:
          navigation.navigate('MyPageStack', {screen: 'MyPage'});
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
              type === notiActions.NOTI_TYPE_NOTI ||
              type === notiActions.NOTI_TYPE_ACCOUNT
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
      info: {infoMap},
      noti: {notiList},
      pending,
    } = this.props;
    const {mode} = this.state;
    const data = mode === 'info' ? infoMap.get('info') : notiList;

    return (
      <SafeAreaView key="container" style={styles.container}>
        <FlatList
          data={data}
          renderItem={this.renderItem}
          ListEmptyComponent={
            <AppText style={styles.emptyPage}>{i18n.t('noti:empty')}</AppText>
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
      </SafeAreaView>
    );
  }
}

export default connect(
  ({account, order, board, noti, info, status}: RootState) => ({
    account,
    order,
    board,
    noti,
    info,
    pending: status.pending[notiActions.getNotiList.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
      board: bindActionCreators(boardActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
      info: bindActionCreators(infoActions, dispatch),
    },
  }),
)(NotiScreen);
