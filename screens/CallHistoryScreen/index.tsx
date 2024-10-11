import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as Hangul from 'hangul-js';
import React, {useCallback} from 'react';
import {SafeAreaView, SectionList, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators, RootState} from 'redux';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as rkbtalkActions} from '@/redux/modules/rkbtalk';
import i18n from '@/utils/i18n';
import HeaderTitle from './HeaderTitle';
import AppBackButton from '@/components/AppBackButton';
import {CallHistory, TalkModelState} from '@/redux/modules/talk';
import AppText from '@/components/AppText';
import AppSvgIcon from '@/components/AppSvgIcon';

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
    ...appStyles.bold18Text,
    lineHeight: 30,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: colors.white,
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
  icon: {
    height: 50,
    width: 50,
    borderRadius: 50,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editHeaderView: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginVertical: 20,
    alignItems: 'center',
  },
  buttonBox: {
    flexDirection: 'row',
  },
  btnDelHistoryAll: {
    width: '50%',
    height: 52,
    backgroundColor: colors.white,
    borderColor: colors.lightGrey,
    borderTopWidth: 1,
  },
  btnDelHistoryAllText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    color: colors.black,
  },
  btnDelHistoryText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    color: colors.white,
  },
  btnDelHistory: {
    width: '50%',
    height: 52,
    backgroundColor: colors.clearBlue,
  },
  logItemView: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.whiteTwo,
  },
  touch: {
    height: 50,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  emptyContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  callText: {
    ...appStyles.normal16Text,
    color: colors.clearBlue,
  },
  name: {
    ...appStyles.normal18Text,
    paddingRight: 10,
  },
  stimeText: {
    ...appStyles.normal12Text,
    paddingLeft: 3,
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
  // const dispatch = useDispatch();
  // const [searchWord, setSearchWord] = useState('');
  // const [searching, setSearching] = useState(false);
  // const [searchResult, setSearchResult] = useState<any[]>([]);
  // const [mode, setMode] = useState<CallHistoryScreenMode>('normal');
  // const [selectedSet, setSelectedSet] = useState(new Set());
  // const [selectedCount, setSelectedCount] = useState(0);
  // const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  // const [deleteHistoryType, setDeleteHistoryType] = useState('');

  // async function loadHistory() {
  //   const callHistory = await retrieveData('callHistory');
  //   if (callHistory) {
  //     store.dispatch(pjsipActions.updateHistory(JSON.parse(callHistory)));
  //   }
  // }

  // useEffect(() => {
  //   const currentHistory = history.toArray();

  //   // 자동로그인이 느리게 진행된 경우
  //   if (!pending) {
  //     // if (!account.loggedIn)
  //     //   navigation.navigate('RegisterSim' as keyof HomeStackParamList);
  //   }

  //   if (currentHistory.length === 0 && account.loggedIn) {
  //     loadHistory();
  //   }

  //   if (currentHistory.length) {
  //     if (currentHistory.length === 0) {
  //       action.pjsip.updateHistory(currentHistory);
  //     } else {
  //       // 저장된 연락처와 통화기록을 매칭하는 작업
  //       Contacts.getContactsByPhoneNumber(currentHistory[0].destination).then(
  //         (contacts) => {
  //           const name =
  //             contacts.length === 0
  //               ? currentHistory[0].destination
  //               : contacts[0].givenName + contacts[0].familyName;
  //           const thumbnailPath =
  //             contacts.length === 0 ? undefined : contacts[0].thumbnailPath;

  //           const chosung = getChosung(
  //             contacts.length === 0
  //               ? currentHistory[0].destination
  //               : contacts[0].givenName + contacts[0].familyName,
  //           );

  //           const changeHistory = history.map((elm, index) =>
  //             index === 0
  //               ? {
  //                   ...elm,
  //                   name,
  //                   chosung,
  //                   thumbnailPath,
  //                 }
  //               : elm,
  //           );

  //           // 무한 루프 방지
  //           if (currentHistory[0].name !== changeHistory.toArray()[0].name) {
  //             action.pjsip.updateHistory(changeHistory);
  //           }
  //         },
  //       );
  //     }
  //   }
  // }, [account.loggedIn, action.pjsip, history, navigation, pending]);

  // const onChangeText = useCallback((value: string) => {
  //   setSearchWord(value);
  //   setSearching(false);
  // }, []);

  // const deleteHistory = useCallback(
  //   (key: string) => () => {
  //     const newHistory =
  //       key === 'all'
  //         ? []
  //         : history.filter((elm, index) => !selectedSet.has(index));

  //     action.pjsip.updateHistory(newHistory);
  //     setConfirmDeleteModal(false);
  //     setSelectedSet(new Set());
  //     setSelectedCount(0);
  //   },
  //   [action.pjsip, history, selectedSet],
  // );
  // const logTouch = useCallback(
  //   (index: number) => {
  //     if (mode === 'edit') {
  //       if (selectedSet.has(index)) selectedSet.delete(index);
  //       else selectedSet.add(index);
  //       setSelectedSet(selectedSet);
  //       setSelectedCount(selectedSet.size);
  //     }
  //   },
  //   [mode, selectedSet],
  // );

  // // RokebiTalk에서 RokebiSIm 호출
  // const openRokebiSim = async () => {
  //   if (Platform.OS === 'ios') {
  //     const isRokebiInstalled = await Linking.canOpenURL(`Rokebi://`);
  //     if (isRokebiInstalled) Linking.openURL(`Rokebi://`);
  //     else Linking.openURL(`appstore url 추가 필요`);
  //   } else {
  //     // 앱 호출 실패 성공 확인 - 성공 : 앱 호출 & 실패 : 스토어페이지로 이동
  //     const isRokebiInstalled = await Linking.canOpenURL(`rokebi://esim.com`);
  //     if (isRokebiInstalled) Linking.openURL(`rokebi://esim.com`);
  //     else Linking.openURL(`playstoreurl 추가 필요`);
  //   }
  // };

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

  // const search = useCallback(
  //   (currentSearchWord: string) => {
  //     const searcher = new Hangul.Searcher(searchWord);

  //     // 필터순서 : 번호 검색 || 단어검색 || 초성검색
  //     setSearchResult(
  //       callHistory
  //         .filter(
  //           (elm) =>
  //             elm.destination.match(searchWord) ||
  //             searcher.search(elm.name) >= 0 ||
  //             elm.chosung?.match(searchWord),
  //         )
  //         .toArray(),
  //     );
  //     setSearching(true);
  //   },
  //   [callHistory, searchWord],
  // );

  // const renderDelBtn = () => {
  //   return (
  //     <View style={styles.buttonBox}>
  //       <AppButton
  //         style={styles.btnDelHistoryAll}
  //         title={i18n.t('call:deleteAll')}
  //         titleStyle={styles.btnDelHistoryAllText}
  //         disabled={history.size === 0}
  //         disableBackgroundColor={colors.gray}
  //         onPress={() => {
  //           setConfirmDeleteModal(true);
  //           setDeleteHistoryType('all');
  //         }}
  //       />
  //       <AppButton
  //         style={styles.btnDelHistory}
  //         title={`${i18n.t('call:deleteItems')}(${selectedCount})`}
  //         titleStyle={styles.btnDelHistoryText}
  //         disabled={selectedCount === 0}
  //         disableBackgroundColor={colors.gray}
  //         onPress={() => {
  //           setConfirmDeleteModal(true);
  //           setDeleteHistoryType('select');
  //         }}
  //       />
  //     </View>
  //   );
  // };

  // const renderCallLog = ({item, index}: {item: CallHistory; index: number}) => {
  //   return (
  //     <Pressable onPress={() => logTouch(index)} style={styles.touch}>
  //       {!_.isEmpty(item.thumbnailPath) ? (
  //         <Image source={{uri: item.thumbnailPath}} style={styles.icon} />
  //       ) : (
  //         <AppIcon name="imgPeople" style={styles.icon} />
  //       )}
  //       <View style={styles.logItemView}>
  //         <View>
  //           <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
  //             {item.name}
  //           </Text>
  //           <View style={{flexDirection: 'row'}}>
  //             <AppIcon name={`iconCall${item.type}`} />
  //             <Text style={styles.stimeText}>
  //               {`${callTypeString(item.type)}, `}
  //             </Text>
  //             <Text style={styles.stimeText}>{toTimeString(item.stime)}</Text>
  //           </View>
  //         </View>
  //         {mode === 'edit' ? (
  //           <AppIcon name="btnCheck" checked={selectedSet.has(index)} />
  //         ) : (
  //           <Pressable onPress={() => makeCall(item.destination)}>
  //             <Text style={styles.callText}>{i18n.t('call')}</Text>
  //           </Pressable>
  //         )}
  //       </View>
  //     </Pressable>
  //   );
  // };

  // const callLog =
  //   searching && searchWord !== '' ? searchResult : callHistory.toArray();
  const renderSectionItem = useCallback(
    ({
      item,
      index,
    }: // section,
    {
      item: CallHistory;
      index: number;
      // section: SectionData;
    }) => {
      return <View />;
    },
    [],
  );

  const renderEmpty = useCallback(() => {
    return (
      <View style={styles.emptyView}>
        <AppSvgIcon name="threeDotsBig" style={{marginBottom: 16}} />
        <AppText style={styles.emptyText}>
          발신 내역이 없습니다
          {/* {i18n.t(`talk:point:empty:${dataFilter}`)} */}
        </AppText>
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppBackButton title="발신 내역" />
      </View>
      <SectionList
        // ref={sectionRef}
        // sections={sectionData}
        sections={callHistory || []}
        contentContainerStyle={
          callHistory?.length > 0 ? undefined : styles.contentContainerStyle
        }
        renderItem={renderSectionItem}
        renderSectionHeader={({section: {title}}) => (
          <AppText style={styles.sectionHeader}>
            {i18n.t(`year`, {year: title})}
          </AppText>
        )}
        stickySectionHeadersEnabled
        ListEmptyComponent={() => renderEmpty()}
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
      {/* <AppStatusBar barStyle="dark-content" translucent /> */}
      {/* <HeaderTitle
        changeMode={(m: CallHistoryScreenMode) => {
          dispatch(rkbtalkActions.updateMode(m));
          setMode(m);
          setSelectedSet(new Set());
        }}
        selectedCount={selectedCount}
        onChangeText={onChangeText}
        search={search}
      /> */}
      {/* {
        // flex: 5 말고 다른 방법 필요
      }
      <View style={{flex: 5}}>
        {
          // {call?.getState() !== Sip.callState.disconnected ? null : (
        }
        {!callHistory ? null : (
          <FlatList
            data={callLog}
            ListHeaderComponent={
              mode === 'edit' ? (
                <View style={styles.editHeaderView}>
                  <Text> {i18n.t('call:selectForDel')}</Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text> 통화 기록이 없습니다</Text>
              </View>
            }
            renderItem={renderCallLog}
            extraData={[searchWord, callLog]}
          />
        )}
        {mode === 'edit' && renderDelBtn()}
        <AppModal
          key="reqComfirmDelete"
          title={i18n.t('call:confirmToDelete')}
          onOkClose={deleteHistory(deleteHistoryType)}
          onCancelClose={() => setConfirmDeleteModal(false)}
          visible={confirmDeleteModal}
        />
      </View> */}
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
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(CallHistoryScreen);
