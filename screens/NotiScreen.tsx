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
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {RkbNoti} from '@/redux/api/notiApi';
import utils from '@/redux/api/utils';
import {AccountModelState} from '@/redux/modules/account';
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
    ...appStyles.bold16Text,
  },
  notiText: {
    width: '90%',
    // height: 98,
  },
  body: {
    ...appStyles.medium14,
    // height: 48,
    width: '100%',
    lineHeight: 24,
    letterSpacing: 0.23,
    color: colors.black,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'flex-end',
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
  const formatNotificationDate = useCallback((createdDate: string) => {
    const now = moment();
    const created = moment(createdDate);
    const diffInMinutes = now.diff(created, 'minutes');
    const diffInHours = now.diff(created, 'hours');
    const diffInDays = now.diff(created, 'days');

    if (diffInMinutes < 1) {
      return i18n.t('noti:now');
    }
    if (diffInMinutes < 60) {
      return i18n.t('noti:minBefore', {min: diffInMinutes});
    }
    if (diffInHours < 24) {
      return i18n.t('noti:hourBefore', {hour: diffInHours});
    }
    if (diffInDays < 8) {
      return i18n.t('noti:dayBefore', {day: diffInDays});
    }
    if (created.year() === now.year()) {
      return created.format('M월 DD일');
    }

    return created.format('YYYY년 M월 DD일');
  }, []);

  // type : notiCash, notiData, notiMarketing, notiNotice, notiReceipt
  const getIconName = useCallback((type: string) => {
    switch (type.split('/')[0]) {
      case notiActions.NOTI_TYPE_PYM:
      case notiActions.NOTI_TYPE_PROVISION:
        return 'notiReceipt';

      case notiActions.NOTI_TYPE_DONATION:
        return 'notiCash';
      case notiActions.NOTI_TYPE_USAGE:
        return 'notiData';

      case notiActions.NOTI_TYPE_PROMOTION:
        return 'notiMarketing';

      // case notiActions.NOTI_TYPE_ACCOUNT:
      // case notiActions.NOTI_TYPE_URI:
      // case notiActions.NOTI_TYPE_NOTI:
      // case notiActions.NOTI_TYPE_REPLY:
      // case notiActions.NOTI_TYPE_INVITE:
      // case notiActions.NOTI_TYPE_EVENT:
      // case notiActions.NOTI_TYPE_PUSH:
      default:
        return 'notiNotice';
    }
  }, []);

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
              item.isRead === 'F' ? colors.clearBlue8 : colors.white,
          },
        ]}>
        {/* icon */}
        <AppIcon
          key="icon"
          name={getIconName(item.notiType || '')}
          size={10}
          style={{marginTop: 7}}
        />
        <View key="notitext" style={styles.notiText}>
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
          <AppText
            key="titleText"
            style={[
              appStyles.medium14,
              {color: colors.warmGrey, marginTop: 6},
            ]}>
            {formatNotificationDate(item.created)}
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
  account: AccountModelState;
  noti: NotiModelState;
  info: InfoModelState;
  promotion: PromotionModelState;
  eventBoard: EventBoardModelState;

  action: {
    noti: NotiAction;
    board: BoardAction;
    eventBoard: EventBoardAction;
    info: InfoAction;
  };
};

const NotiScreen: React.FC<NotiScreenProps> = ({
  account,
  info,
  noti,
  promotion,
  eventBoard,
  navigation,
  route,
  action,
  pending,
}) => {
  const mode = useMemo(() => {
    return route.params?.mode || 'info';
  }, [route.params?.mode]);

  // true : 공지사항, false : 알림
  const isNotice = useMemo(() => mode === 'info', [mode]);

  const onRefresh = useCallback(() => {
    action.noti.getNotiList({mobile: account.mobile});
  }, [account.mobile, action.noti]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.mode === 'noti') onRefresh();
    });

    return unsubscribe;
  }, [navigation, onRefresh, route.params?.mode]);

  useEffect(() => {
    if (isNotice && !info.infoMap.has('info')) {
      action.info.getInfoList('info');
    }

    action.board.getIssueList();
    if (account.loggedIn) action.eventBoard.getIssueList();
  }, [
    account.loggedIn,
    action.board,
    action.eventBoard,
    action.info,
    info.infoMap,
    isNotice,
  ]);

  useEffect(() => {
    Analytics.trackEvent('Page_View_Count', {page: 'Noti'});
  }, [navigation, route.params?.title]);

  // 공지사항의 경우 notiType이 없으므로 Notice/0으로 기본값 설정
  const onPress = useCallback(
    async ({
      uuid,
      isRead,
      bodyTitle,
      body,
      notiType = 'Notice/0',
      title,
      created,
    }: RkbNoti) => {
      const {token} = account;
      const split = notiType?.split('/');
      const type = split[0];
      Analytics.trackEvent('Page_View_Count', {page: 'Noti Detail'});

      if (uuid) {
        // if ( mode != MODE_NOTIFICATION) this.props.action.noti.notiReadAndGet(uuid, this.props.account.mobile, this.props.auth )
        if (mode !== 'info' && isRead === 'F')
          action.noti.readNoti({uuid, token});

        switch (type) {
          // notitype이 push인 경우 stack과 screen을 받아 해당화면으로 이동할 수 있도록 추가
          // ex) push/EsimStack/Esim
          case notiActions.NOTI_TYPE_PUSH:
            if (split.length > 2) {
              navigation.navigate(split[1], {screen: split[2]});
            } else {
              navigation.navigate('SimpleText', {
                key: 'noti',
                title: i18n.t('set:noti'),
                bodyTitle,
                text: body,
                mode: 'html',
              });
            }
            break;

          case notiActions.NOTI_TYPE_REPLY:
            navigation.navigate('BoardMsgResp', {
              uuid: split[1],
              status: 'Closed',
            });
            break;

          case notiActions.NOTI_TYPE_INVITE:
          case notiActions.NOTI_TYPE_PROMOTION:
            navigation.navigate('MyPageStack', {screen: 'MyPage'});
            break;

          case notiActions.NOTI_TYPE_PYM:
            // 주문취소는 무족ㄴ 결제상세화면으로
            if (split[3] === 'CANCEL_PAYMENT') {
              navigation.navigate('PurchaseDetail', {orderId: split[1]});
            } else if (split[2] === 'refundable') {
              navigation.popToTop();
              navigation.navigate('EsimStack', {
                screen: 'Esim',
                params: {
                  actionStr: 'reload',
                },
              });
            }
            // read orders if not read before
            else if (split[1]) {
              navigation.navigate('PurchaseDetail', {orderId: split[1]});
            }
            break;

          case notiActions.NOTI_TYPE_PROVISION:
            // format : provision/{iccid}/{nid}
            navigation.popToTop();

            if (split[1] === '0') {
              // 미국 로컬 상품의 경우 iccid가 없어 0으로 정의됨
              navigation.navigate('EsimStack', {
                screen: 'Esim',
                params: {
                  actionStr: 'reload',
                },
              });
            } else {
              navigation.navigate('EsimStack', {
                screen: 'Esim',
                params: {
                  iccid: split[1],
                  actionStr: 'navigate',
                },
              });
            }

            break;

          case notiActions.NOTI_TYPE_EVENT:
            navigation.navigate('EventResult', {
              issue: eventBoard.list.find((elm) => elm.key === split[1]),
              title: i18n.t('event:list'),
              showStatus: true,
              eventList: promotion.event,
            });
            break;

          case notiActions.NOTI_TYPE_USIM:
            navigation.navigate('Usim');
            break;

          case notiActions.NOTI_TYPE_COUPON:
            navigation.navigate('MyPageStack', {screen: 'Coupon'});
            break;

          case notiActions.NOTI_TYPE_USAGE:
            navigation.navigate('EsimStack', {
              screen: 'Esim',
              params: {
                subsId: split[1],
                actionStr: 'showUsage',
              },
            });
            break;

          default:
            // 아직 일반 Noti 알림은 없으므로 공지사항 용으로만 사용, 후에 일반 Noti 상세페이지(notitype = noti)가 사용될 수 있도록 함
            navigation.navigate('SimpleText', {
              key: 'noti',
              title:
                type === notiActions.NOTI_TYPE_NOTI ||
                type === notiActions.NOTI_TYPE_ACCOUNT ||
                type === notiActions.NOTI_TYPE_PUSH
                  ? i18n.t('set:noti')
                  : i18n.t('contact:noticeDetail'),

              created: moment(created),
              bodyTitle: bodyTitle || title,
              text: body,
              notiType,
              mode:
                type === notiActions.NOTI_TYPE_URI
                  ? 'uri'
                  : type === notiActions.NOTI_TYPE_DONATION
                  ? 'page'
                  : 'html',
            });
            break;
        }
      }
    },
    [account, action.noti, eventBoard.list, mode, navigation, promotion.event],
  );

  const renderItem = useCallback(
    ({item}: {item: RkbNoti}) => <NotiListItem item={item} onPress={onPress} />,
    [onPress],
  );

  const data = useMemo(() => {
    // clone the list to sort
    const list = isNotice ? info.infoMap.get('info') : _.clone(noti.notiList);
    return list?.sort((a, b) => -a.created.localeCompare(b.created));
  }, [info.infoMap, isNotice, noti.notiList]);

  return (
    <SafeAreaView key="container" style={styles.container}>
      <ScreenHeader
        title={isNotice ? i18n.t('set:notice') : i18n.t('set:noti')}
        renderRight={
          isNotice ? null : (
            <Pressable
              style={{justifyContent: 'flex-end'}}
              onPress={() => {
                action.noti.readNoti({uuid: '0', token: account.token});
              }}>
              <AppText
                style={[
                  appStyles.semiBold16Text,
                  {color: colors.clearBlue, marginRight: 20},
                ]}>
                {i18n.t('noti:readAll')}
              </AppText>
            </Pressable>
          )
        }
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
  ({account, board, noti, info, status, promotion, eventBoard}: RootState) => ({
    account,
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
      board: bindActionCreators(boardActions, dispatch),
      eventBoard: bindActionCreators(eventBoardActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
      info: bindActionCreators(infoActions, dispatch),
    },
  }),
)(NotiScreen);
