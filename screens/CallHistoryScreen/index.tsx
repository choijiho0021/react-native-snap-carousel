import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';
import React, {useCallback, useEffect} from 'react';
import {
  Pressable,
  SafeAreaView,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators, RootState} from 'redux';
import AppBackButton from '@/components/AppBackButton';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {
  actions as talkActions,
  CallHistory,
  TalkAction,
  TalkModelState,
} from '@/redux/modules/talk';
import i18n from '@/utils/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    alignItems: 'center',
    height: 56,
  },
  contentContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    ...appStyles.normal16Text,
    lineHeight: 24,
    paddingBottom: 12,
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...appStyles.normal16Text,
    lineHeight: 24,
    color: colors.warmGrey,
  },
  itemRowView: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  time: {
    ...appStyles.normal14Text,
    lineHeight: 20,
    color: colors.warmGrey,
    width: 76,
    marginTop: 2,
  },
  rightRowView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameView: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  destination: {
    ...appStyles.normal18Text,
    fontWeight: '600',
    lineHeight: 26,
  },
  ccode: {
    ...appStyles.roboto16Text,
    lineHeight: 24,
    color: colors.warmGrey,
  },
  duration: {
    ...appStyles.normal14Text,
    width: 60,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.warmGrey,
  },
});

type CallHistoryScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'CallHistory'
>;

type CallHistoryScreenRouteProp = RouteProp<HomeStackParamList, 'CallHistory'>;

type CallHistoryScreenProps = {
  navigation: CallHistoryScreenNavigationProp;
  route: CallHistoryScreenRouteProp;

  account: AccountModelState;
  talk: TalkModelState;
  pending: boolean;

  action: {
    account: AccountAction;
    talk: TalkAction;
  };
};

// 발신시
const CallHistoryScreen: React.FC<CallHistoryScreenProps> = ({
  navigation,
  route,
  talk: {callHistory},
  account,
  pending,
  action,
}) => {
  useEffect(() => {
    action.talk.readHistory();
  }, [action.talk]);

  // const makeCall = useCallback(
  //   (destination: string) => {
  //     if (destination !== '') {
  //       action.pjsip.makeCall({destination}).then(
  //         (call) => {
  //           dispatch(onCallInitiated(call.payload));
  //           console.log('@@@ call', call);
  //         },
  //         (err) => {
  //           console.log('@@@ failed to make call', err);
  //         },
  //       );
  //     }
  //   },
  //   [action.pjsip, dispatch],
  // );

  const renderEmpty = useCallback(() => {
    return (
      <View style={styles.emptyView}>
        <AppSvgIcon name="threeDotsBig" style={{marginBottom: 16}} />
        <AppText style={styles.emptyText}>
          {i18n.t('talk:callHistory:empty')}
        </AppText>
      </View>
    );
  }, []);

  const renderSectionHeader = useCallback(({section}) => {
    return (
      <View style={{backgroundColor: colors.white}}>
        {section.data[0]?.year && (
          <AppText style={{...appStyles.bold18Text, lineHeight: 30}}>
            {section.data[0].year}
          </AppText>
        )}
        <AppText style={styles.sectionHeader}>
          {section.title.slice(0, -4)}
        </AppText>
      </View>
    );
  }, []);

  const getTime = useCallback((d: number) => {
    const m = Math.trunc(d / 60);
    const s = d % 60;
    return m > 0 ? `${m}분${s}초` : `${s}초`;
  }, []);

  const onPressItem = useCallback(
    (item: CallHistory) => {
      const num = item?.ccode + item?.destination;
      const name = item?.name;
      action.talk.updateClicked({num, name});
      action.talk.updateCalledPty(num);
      navigation.goBack();
    },
    [action.talk, navigation],
  );

  const renderSectionItem = useCallback(
    ({item, index}: {item: CallHistory; index: number}) => {
      const cc = item?.ccode ? `+${item?.ccode} ` : '';
      return (
        <Pressable onPress={() => onPressItem(item)} style={styles.itemRowView}>
          <AppText style={styles.time}>
            {moment(item?.stime).format('A h:mm')}
          </AppText>
          <View style={styles.rightRowView}>
            <View style={styles.nameView}>
              <AppText style={styles.destination}>
                {item?.name || item?.destination}
              </AppText>
              <AppText style={styles.ccode}>
                {`${cc}${item?.destination}`}
              </AppText>
            </View>
            <AppText style={styles.duration}>{getTime(item?.duration)}</AppText>
          </View>
        </Pressable>
      );
    },
    [getTime, onPressItem],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppBackButton title={i18n.t('talk:callHistory:title')} />
      </View>
      <View style={{height: 16}} />
      <SectionList
        // ref={sectionRef}
        keyExtractor={(item, index) => `${item?.key + index}`}
        sections={callHistory || []}
        contentContainerStyle={{flex: 1, marginHorizontal: 20}}
        renderItem={renderSectionItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled
        ListEmptyComponent={renderEmpty}
        // onScrollEndDrag={({
        //   nativeEvent: {
        //     contentOffset: {y},
        //   },
        // }) => {
        //   if (isTop.current && y > 178) runAnimation(false);
        //   else if (!isTop.current && y <= 0) runAnimation(true);
        // }}
        overScrollMode="never"
        bounces={false}
      />
    </SafeAreaView>
  );
};

export default connect(
  ({account, talk, status}: RootState) => ({
    account,
    talk,
    pending: status.pending[accountActions.getAccount.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      talk: bindActionCreators(talkActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(CallHistoryScreen);
