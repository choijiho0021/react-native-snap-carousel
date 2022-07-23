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
              item.isRead === 'F' ? colors.whiteTwo : colors.white,
          },
        ]}>
        <View key="notitext" style={styles.notiText}>
          <AppText
            key="titleText"
            style={[appStyles.bold13Text, {color: colors.warmGrey}]}>
            {moment(item.created).format('Y년 M월 DD일')}
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
  action: {
    noti: NotiAction;
    board: BoardAction;
    order: OrderAction;
    info: InfoAction;
  };
};

const NotiScreen: React.FC<NotiScreenProps> = ({
  account,
  order,
  info,
  noti,
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
    setMode(route.params?.mode);
  }, [action.board, action.info, info.infoMap, route.params?.mode]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton title={route.params?.title || i18n.t('set:noti')} />
      ),
    });

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
    },
    [account, action.noti, action.order, mode, navigation, order.orders],
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
    </SafeAreaView>
  );
};

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
