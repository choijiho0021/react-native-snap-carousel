import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {memo, useCallback, useMemo, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import _ from 'underscore';
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
import {PromotionModelState} from '@/redux/modules/promotion';
import {
  EventBoardAction,
  EventBoardModelState,
  actions as eventBoardActions,
} from '@/redux/modules/eventBoard';
import ScreenHeader from '@/components/ScreenHeader';

const styles = StyleSheet.create({
  container: {
    ...appStyles.container,
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  notibox: {
    // height: esimGlobal ? 120 : 100,
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: 'space-between',
    flexDirection: 'row',
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
    // height: 48,
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
    <Pressable
      onPress={() => onPress(item)}
      style={{backgroundColor: colors.white}}>
      <View
        key={item.uuid}
        style={[
          styles.notibox,
          {
            backgroundColor:
              item.isRead === 'F' ? colors.paleGrey3 : colors.white,
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
            {utils.htmlToString(
              (item.summary || item.body)?.replace(/\n{1,}/g, '\n'),
            )}
          </AppText>
        </View>
        <View key="iconview" style={styles.icon}>
          <AppIcon key="icon" name="iconArrowRight" size={10} />
        </View>
      </View>
    </Pressable>
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
  promotion: PromotionModelState;
  eventBoard: EventBoardModelState;
  action: {
    noti: NotiAction;
    board: BoardAction;
    eventBoard: EventBoardAction;
    order: OrderAction;
    info: InfoAction;
  };
};

const NotiScreen: React.FC<NotiScreenProps> = ({
  account,
  order,
  info,
  noti,
  promotion,
  eventBoard,
  navigation,
  route,
  action,
  pending,
}) => {
  const [mode, setMode] = useState<'noti' | 'info'>('noti');

  useEffect(() => {
    if (route.params?.mode === 'info' && !info.infoMap.has('info')) {
      action.info.getInfoList('info');
    }

    action.board.getIssueList();
    action.eventBoard.getIssueList();
    setMode(route.params?.mode);
  }, [
    action.board,
    action.eventBoard,
    action.info,
    info.infoMap,
    route.params?.mode,
  ]);

  useEffect(() => {
    Analytics.trackEvent('Page_View_Count', {page: 'Noti'});
  }, [navigation, route.params?.title]);

  // 공지사항의 경우 notiType이 없으므로 Notice/0으로 기본값 설정
  const onPress = useCallback(
    async ({uuid, isRead, bodyTitle, body, notiType = 'Notice/0'}: RkbNoti) => {
      const {mobile, token} = account;
      const split = notiType.split('/');
      const type = split[0];
      const orderId = split[1];

      Analytics.trackEvent('Page_View_Count', {page: 'Noti Detail'});

      if (uuid) {
        // if ( mode != MODE_NOTIFICATION) this.props.action.noti.notiReadAndGet(uuid, this.props.account.mobile, this.props.auth )
        if (mode !== 'info' && isRead === 'F')
          action.noti.readNoti({uuid, token});

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
              action.order.checkAndGetOrderById({
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

          case notiActions.NOTI_TYPE_PROVISION:
            navigation.popToTop();
            if (orderId) {
              navigation.navigate('EsimStack', {
                screen: 'Esim',
                params: {
                  iccid: orderId,
                },
              });
              break;
            }
            navigation.navigate('EsimStack', {screen: 'Esim'});
            break;

          case notiActions.NOTI_TYPE_EVENT:
            navigation.navigate('EventResult', {
              issue: eventBoard.list.find((elm) => elm.key === orderId),
              title: i18n.t('event:list'),
              showStatus: true,
              eventList: promotion.event,
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
              mode: type === notiActions.NOTI_TYPE_URI ? 'uri' : 'html',
            });
            break;
        }
      }
    },
    [
      account,
      action.noti,
      action.order,
      eventBoard.list,
      mode,
      navigation,
      order.orders,
      promotion.event,
    ],
  );

  const onRefresh = useCallback(() => {
    action.noti.getNotiList({mobile: account.mobile});
  }, [account.mobile, action.noti]);

  const renderItem = useCallback(
    ({item}: {item: RkbNoti}) => <NotiListItem item={item} onPress={onPress} />,
    [onPress],
  );

  const data = useMemo(() => {
    // clone the list to sort
    const list =
      mode === 'info' ? info.infoMap.get('info') : _.clone(noti.notiList);
    return list?.sort((a, b) => -a.created.localeCompare(b.created));
  }, [info.infoMap, mode, noti.notiList]);

  return (
    <SafeAreaView key="container" style={styles.container}>
      <ScreenHeader
        title={mode === 'info' ? i18n.t('set:notice') : i18n.t('set:noti')}
      />
      {!pending && (
        <FlatList
          data={data}
          renderItem={renderItem}
          ListEmptyComponent={
            <AppText style={styles.emptyPage}>{i18n.t('noti:empty')}</AppText>
          }
          refreshControl={
            <RefreshControl
              refreshing={pending}
              onRefresh={onRefresh}
              colors={[colors.clearBlue]} // android 전용
              tintColor={colors.clearBlue} // ios 전용
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default connect(
  ({
    account,
    order,
    board,
    noti,
    info,
    status,
    promotion,
    eventBoard,
  }: RootState) => ({
    account,
    order,
    board,
    noti,
    info,
    promotion,
    eventBoard,
    pending:
      status.pending[notiActions.getNotiList.typePrefix] ||
      status.pending[eventBoardActions.getIssueList.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
      board: bindActionCreators(boardActions, dispatch),
      eventBoard: bindActionCreators(eventBoardActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
      info: bindActionCreators(infoActions, dispatch),
    },
  }),
)(NotiScreen);
