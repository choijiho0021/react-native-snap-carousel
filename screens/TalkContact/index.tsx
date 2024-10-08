import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppSearch from '@/components/AppSearch';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {
  checkEng,
  checkKor,
  checkSpecial,
  doubleKor,
  sectionKeys,
} from '@/constants/CustomTypes';
import Layout from '@/constants/Layout';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {
  actions as talkActions,
  TalkAction,
  TalkModelState,
} from '@/redux/modules/talk';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as Hangul from 'hangul-js';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import {Contact} from 'react-native-contacts';
import {
  check,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import SectionListSidebar from './components/SectionListSidebar';
import {connect, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import ContactListItem from './ContactListItem';

const styles = StyleSheet.create({
  title: {
    ...appStyles.bold18Text,
    marginTop: 20,
    marginBottom: isDeviceSize('small') ? 10 : 20,
    marginHorizontal: 20,
    color: colors.black,
  },
  btnHomeText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    color: colors.white,
  },
  btnHome: {
    width: '100%',
    height: 52,
    backgroundColor: colors.clearBlue,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.whiteTwo,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    alignItems: 'center',
    height: 56,
  },
  searchLine: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    width: Layout.window.width,
    justifyContent: 'space-between',
  },
  searchBarBorder: {
    borderColor: colors.lightGrey,
    borderRadius: 3,
    borderWidth: 1,
    flex: 4.2,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginTop: 5,
  },
  sectionHeader: {
    ...appStyles.normal16Text,
    paddingLeft: 20,
    backgroundColor: colors.white,
    alignContent: 'center',
    height: 24,
    lineHeight: 24,
    letterSpacing: -0.16,
    color: colors.warmGrey,
  },
});

type TalkContactScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'TalkContact'
>;

type TalkContactScreenRouteProp = RouteProp<HomeStackParamList, 'TalkContact'>;

type TalkContactScreenProps = {
  navigation: TalkContactScreenNavigationProp;
  route: TalkContactScreenRouteProp;
  talk: TalkModelState;
  action: {
    talk: TalkAction;
  };
};

const TalkContactScreen: React.FC<TalkContactScreenProps> = ({
  navigation,
  route: {params},
  talk: {contacts},
  action,
}) => {
  const [showContacts, setShowContacts] = useState(false);
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [mapContacts, setMapContacts] = React.useState(new Map());
  const [highlight, setHighlight] = React.useState(new Map());
  const [loading, setLoading] = useState<boolean>(false);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [sections, setSections] = useState<any[]>([]);
  const sectionListRef = useRef();
  const dispatch = useDispatch();
  const [scrollY, setScrollY] = useState(-1);

  // 권한없는 경우, 통화시에 권한확인 로직 필요
  useEffect(() => {
    const checkPermission = async () => {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CONTACTS
          : PERMISSIONS.ANDROID.READ_CONTACTS;
      const result = await check(permission);

      return result === RESULTS.GRANTED || result === RESULTS.UNAVAILABLE;
    };

    Promise.resolve(checkPermission()).then((r) => {
      if (r) {
        Promise.resolve(action.talk.getContacts()).then((a) => {
          if (a?.type?.includes('rejected') || a?.payload?.message === 'denied')
            setShowContacts(false);
          else setShowContacts(true);
        });
      }
    });
  }, [action.talk]);

  const beforeSync = useCallback(() => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          <AppText
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontWeight: '500',
              fontStyle: 'normal',
              lineHeight: 24,
              letterSpacing: -0.16,
            }}>{`내 주소록을 동기화하여\n더 편리하게 사용해 보세요!`}</AppText>
          <AppButton
            style={{
              alignSelf: 'center',
              width: 150,
              height: 50,
              borderRadius: 3,
              marginTop: 16,
              paddingHorizontal: 18,
              backgroundColor: colors.clearBlue,
            }}
            title="연락처 동기화하기"
            titleStyle={{
              fontSize: 16,
              fontWeight: '600',
              fontStyle: 'normal',
              lineHeight: 24,
              letterSpacing: -0.16,
              textAlign: 'left',
              color: colors.white,
            }}
            onPress={() => openSettings()}
          />
        </View>
      </View>
    );
  }, []);

  const removeDup = useCallback((findSection, item) => {
    const idx = findSection.data.findIndex((v) => v.recordID === item.recordID);
    if (idx >= 0) {
      findSection.data.splice(idx, 1, item);
    } else {
      findSection.data.push(item);
    }
  }, []);

  const setOtherSection = useCallback(
    (name: string, item) => {
      let findSection = {};
      const currentSectionKeys = sectionKeys;
      if (checkEng.test(name.substring(0, 1))) {
        // 영어 section
        findSection = currentSectionKeys.find(
          (v) => v.key === name.toUpperCase().substring(0, 1),
        );
      } else {
        // 특수문자 section
        findSection = currentSectionKeys.find((v) => checkSpecial.test(v.key));
      }

      removeDup(findSection, item);
      return findSection;
    },
    [removeDup],
  );

  const setKoSection = useCallback(
    (item, disassemble) => {
      const ko = [];
      doubleKor.forEach((value) => {
        const double = value.find((v) => v === disassemble[0][0]) || [];
        const findSection = sectionKeys.find((v) =>
          _.isEmpty(double) ? v.key === disassemble[0][0] : v.key === value[0],
        );

        if (_.isEmpty(findSection)) return;
        removeDup(findSection, item);
        ko.push(findSection);
      });

      return ko[0];
    },
    [removeDup],
  );

  const setChosung = useCallback(
    (currentContacts?: any[]) => {
      // 한글 이름 중에서 초성, contact map
      if (!_.isEmpty(currentContacts)) {
        currentContacts?.map((item) => {
          const name = item.givenName + item.familyName;
          // 한글일 경우
          if (checkKor.test(name)) {
            const disassemble = Hangul.disassemble(name, true);
            setKoSection(item, disassemble);

            let cho = '';
            disassemble.forEach((item) => (cho += item[0]));
            setMapContacts(mapContacts.set(cho, item));
          } else {
            setOtherSection(name, item);
          }
        });
      }
    },
    [setKoSection, setOtherSection],
  );

  const getFirstLetter = useCallback(
    (item: any) => {
      // 한글 이름 중에서 초성, contact map
      const name = item.givenName + item.familyName;
      let resSection = {};
      // 한글일 경우
      if (checkKor.test(name)) {
        const disassemble = Hangul.disassemble(name, true);
        resSection = setKoSection(item, disassemble);
      } else resSection = setOtherSection(name, item);

      return resSection?.key;
    },
    [setKoSection, setOtherSection],
  );

  // 초성검색한 항목 section key 생성
  const makeSearchResult = useCallback((currentContacts?: any[]) => {
    if (!_.isEmpty(currentContacts)) {
      const res = currentContacts?.reduce((acc, cur, idx) => {
        const key = getFirstLetter(cur);
        const ai = acc?.findIndex((a) => a?.key === key);

        if (ai >= 0) (acc[ai]?.data || []).push(cur);
        else (acc || [])?.push({key, title: key, data: [cur]});
        return acc;
      }, []);

      return res;
    }
  }, []);

  const onChangeText = useCallback(
    (text) => {
      const currentMapContacts = mapContacts;
      const currentContacts = contacts;

      const txtNumber = (utils.stringToNumber(text) || '').toString();
      const txt = text.toLowerCase();
      const searcher = new Hangul.Searcher(text);
      const chosung: string[] = [];
      setHighlight(new Map());
      let currentSearchResult = [];

      if (text?.length > 0) {
        // 한글일 경우 초성검색 또는 한글 검색
        if (checkKor.test(text)) {
          Array.from(currentMapContacts.keys())
            .filter((item) => {
              // 초성 index
              const i = item.indexOf(text);
              if (i >= 0)
                setHighlight(
                  highlight.set(currentMapContacts.get(item).recordID, [
                    i,
                    i + text.length - 1,
                  ]),
                );

              return item.includes(text);
            })
            .forEach((item) => chosung.push(currentMapContacts.get(item)));
          // 한글 초성검색
          currentSearchResult = chosung;

          if (Hangul.isComplete(text)) {
            // 한글 글자검색
            currentSearchResult = currentContacts.filter((item) => {
              const r = searcher.search(item.givenName + item.familyName) >= 0;

              const h = Hangul.rangeSearch(
                `${item.givenName} ${item.familyName}`,
                text,
              );
              if (r) setHighlight(highlight.set(item.recordID, h[0]));
              return r;
            });
          }
        } else {
          // 영어검색
          currentSearchResult = currentContacts.filter((item) => {
            const r = `${item.givenName} ${item.familyName}`
              .toLowerCase()
              .indexOf(txt);
            if (r >= 0) {
              setHighlight(
                highlight.set(item.recordID, [r, r + text.length - 1]),
              );
            }

            return r >= 0;
          });
        }
      }

      if (!_.isEmpty(txtNumber) && text.length === txtNumber.length) {
        const phone = currentContacts.filter(
          (item) =>
            !_.isEmpty(
              item.phoneNumbers.filter((val) =>
                utils
                  .stringToNumber(val?.number)
                  .toString()
                  .includes(txtNumber),
              ),
            ) && !currentSearchResult.includes(item),
        );

        setSearchText(text);
        setSearchResult(
          makeSearchResult([...currentSearchResult, ...phone]) || [],
        );
      } else {
        setSearchText(text);
        setSearchResult(makeSearchResult(currentSearchResult) || []);
      }
    },
    [contacts, mapContacts],
  );

  const onPress = useCallback(
    (contactData: Contact) => {
      const number = contactData?.phoneNumbers[0]?.number?.replace(/[+-]/g, '');
      action.talk.updateClickedNumber(number);
      navigation.goBack();
    },
    [navigation],
  );

  const renderContactList = useCallback(
    ({item}) => {
      const val = item || {};
      return (
        <ContactListItem
          key={val.recordID}
          title={`${val.givenName} ${val.familyName}`}
          uri={val.thumbnailPath}
          data={val}
          onPress={onPress}
          highlight={highlight.get(val?.recordID) || []}
        />
      );
    },
    [searchText, onPress, highlight],
  );

  const toggleSearchBar = useCallback(
    (val) => {
      navigation.setParams({showSearchBar: val});
      setShowSearchBar(val);
      console.log('@@@@@ toggle!!! : ', val);
      dispatch(talkActions.updateMode(val ? 'search' : 'normal'));

      if (!val) {
        setSearchResult([]);
        setSearchText(undefined);
      }
    },
    [dispatch, navigation],
  );

  useEffect(() => {
    setChosung(contacts);
  }, [setChosung, contacts]);

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerStyle: {
  //       shadowColor: 'transparent',
  //       elevation: 0,
  //     },
  //     title: null, // 왜 null?
  //     headerLeft: () => {
  //       return route?.params && route?.params?.showSearchBar ? (
  //         searchBar()
  //       ) : (
  //         <AppText style={styles.title}>{i18n.t('contact:title')}</AppText>
  //       );
  //     },
  //     headerRight: () => {
  //       return (
  //         !(route?.params || {}).showSearchBar && (
  //           <AppButton
  //             iconName="btnSearchTop"
  //             style={{
  //               backgroundColor: colors.white,
  //               marginRight: 20,
  //               marginTop: 15,
  //             }}
  //             onPress={() => toggleSearchBar(true)}
  //           />
  //         )
  //       );
  //     },
  //   });
  // }, [navigation, searchBar, toggleSearchBar]);

  useEffect(() => {
    setSections(sectionKeys.filter((item) => !_.isEmpty(item.data)));
  }, []);

  const onScroll = useCallback((e) => {
    const yOffset = e.nativeEvent.contentOffset.y;
    setScrollY(yOffset);
  }, []);

  const onCancel = useCallback(() => {
    onChangeText('');
    setSearchText(undefined);
    setHighlight(new Map());
    setSearchResult([]);
  }, []);

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: colors.white, alignItems: 'stretch'}}>
      <View style={styles.header}>
        <AppSearch
          title={i18n.t('acc:balance')}
          style={{height: 55}}
          onChangeText={onChangeText}
          onCancel={onCancel}
          value={searchText || ''}
        />
      </View>
      {showContacts && !_.isEmpty(searchText) && <View style={{height: 24}} />}
      {showContacts ? (
        _.isEmpty(searchText) ? (
          !_.isEmpty(sections) && (
            <SectionListSidebar
              ref={sectionListRef}
              data={sections}
              renderItem={renderContactList}
              itemHeight={30}
              sectionHeaderHeight={20}
              onScroll={onScroll}
              renderSectionHeader={({section}) => {
                return (
                  <>
                    {section?.key === sections[0]?.key && scrollY <= 0 && (
                      <View
                        style={{
                          marginLeft: 20,
                          paddingTop: 24,
                          paddingBottom: 16,
                          backgroundColor: colors.white,
                        }}>
                        <AppText style={appStyles.bold18Text}>연락처</AppText>
                      </View>
                    )}
                    <AppText style={styles.sectionHeader}>
                      {section?.key}
                    </AppText>
                  </>
                );
              }}
              sidebarContainerStyle={{
                flex: 1,
                alignSelf: 'flex-end',
                justifyContent: 'center',
              }}
              sidebarItemTextStyle={{
                ...appStyles.normal12Text,
                lineHeight: 13,
                color: colors.clearBlue,
              }}
              locale="kor"
            />
          )
        ) : (
          <SectionList
            contentContainerStyle={{flexGrow: 1}}
            sections={searchResult}
            renderItem={renderContactList}
            renderSectionHeader={({section}) => {
              return (
                <AppText style={styles.sectionHeader}>{section?.title}</AppText>
              );
            }}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                }}>
                <AppIcon style={{marginBottom: 16}} name="imgDot" />
                <AppText>검색 결과가 없습니다.</AppText>
              </View>
            }
          />
        )
      ) : (
        beforeSync()
      )}
    </SafeAreaView>
  );
};

export default connect(
  ({talk}: RootState) => ({
    talk,
  }),
  (dispatch) => ({
    action: {
      talk: bindActionCreators(talkActions, dispatch),
    },
  }),
)(TalkContactScreen);
