import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import * as Hangul from 'hangul-js';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  AppState,
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
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppButton from '@/components/AppButton';
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
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {
  actions as talkActions,
  sortName,
  TalkAction,
  TalkModelState,
} from '@/redux/modules/talk';
import appState from '@/utils/appState';
import i18n from '@/utils/i18n';
import {getNumber, utils} from '@/utils/utils';
import EmptyResult from './components/EmptyResult';
import SectionListSidebar from './components/SectionListSidebar';
import ContactListItem from './ContactListItem';

const small = isDeviceSize('medium') || isDeviceSize('small');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'stretch',
  },
  sidebarContainer: {
    flex: 1,
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  sidebarItem: {
    ...appStyles.normal12Text,
    lineHeight: 13,
    color: colors.clearBlue,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignItems: 'center',
    height: 56,
  },
  syncView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: -0.16,
    color: colors.black,
  },
  syncBtn: {
    alignSelf: 'center',
    width: 150,
    height: 50,
    borderRadius: 3,
    marginTop: 16,
    paddingHorizontal: 18,
    backgroundColor: colors.clearBlue,
  },
  syncBtnTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: -0.16,
    textAlign: 'left',
    color: colors.white,
  },
  headerView: {
    marginLeft: 20,
    marginBottom: 16,
    backgroundColor: colors.white,
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
  pending: boolean;
  action: {
    talk: TalkAction;
  };
};

const TalkContactScreen: React.FC<TalkContactScreenProps> = ({
  navigation,
  route: {params},
  talk: {contacts},
  pending,
  action,
}) => {
  const [showContacts, setShowContacts] = useState(false);
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [mapContacts, setMapContacts] = React.useState<Map<string, Contact[]>>(
    new Map(),
  );
  const [highlight, setHighlight] = React.useState(new Map());
  const [sections, setSections] = useState<any[]>(
    JSON.parse(JSON.stringify(sectionKeys)),
  );
  const sectionListRef = useRef();

  const beforeSync = useCallback(() => {
    return (
      <View style={styles.syncView}>
        <View>
          <AppText style={styles.syncText}>
            {i18n.t('talk:contact:sync')}
          </AppText>
          <AppButton
            style={styles.syncBtn}
            title={i18n.t('talk:contact:sync:btn')}
            titleStyle={styles.syncBtnTitle}
            onPress={() => openSettings()}
          />
        </View>
      </View>
    );
  }, []);

  const removeDup = useCallback((findSection, item) => {
    const idx = findSection?.data?.findIndex(
      (v) => v.recordID === item.recordID,
    );

    if (idx < 0) {
      findSection.data.push(item);
    }
    // else {
    //   console.log('@@@ here?', item?.givenName, item?.phoneNumbers[0]);
    //   findSection?.data?.splice(idx, 1, item);
    // }
    return findSection;
  }, []);

  const setOtherSection = useCallback(
    (name: string, item, section) => {
      let findSection = {};
      const currentSectionKeys = section;
      if (checkEng.test(name?.substring(0, 1))) {
        // 영어 section
        findSection = currentSectionKeys?.find(
          (v) => v.key === name.toUpperCase().substring(0, 1),
        );
      } else {
        // 특수문자 section
        findSection = currentSectionKeys?.find((v) => checkSpecial.test(v.key));
      }

      return removeDup(findSection, item);
    },
    [removeDup],
  );

  const setKoSection = useCallback(
    (item, disassemble, section) => {
      const ko = [];
      doubleKor.forEach((value) => {
        const double = value.find((v) => v === disassemble[0][0]) || [];
        const findSection = section?.find((v) =>
          _.isEmpty(double) ? v.key === disassemble[0][0] : v.key === value[0],
        );

        if (_.isEmpty(findSection)) {
          // matching 안된 것들 중 첫 글자가 한글이 아닐 경우 > #에 추가
          if (!checkKor.test(item.givenName[0])) {
            const other = section?.find((a) => a.key === '#');
            ko.push(removeDup(other, item));
          }
          // 이외의 경우는 pass
          return;
        }
        ko.push(removeDup(findSection, item));
      });

      return ko[0];
    },
    [removeDup],
  );

  const setChosung = useCallback(
    (currentContacts?: any[]) => {
      // setchosung시마다 연락처 새로 갱신
      const sk = JSON.parse(JSON.stringify(sectionKeys));

      // 한글 이름 중에서 초성, contact map
      if (!_.isEmpty(currentContacts)) {
        currentContacts?.map((item) => {
          const name = item.familyName + item.givenName;
          // 한글일 경우
          if (checkKor.test(name)) {
            const disassemble = Hangul.disassemble(name, true);
            setKoSection(item, disassemble, sk);

            let cho = '';
            disassemble.forEach((item) => (cho += item[0]));

            if (!mapContacts.has(cho))
              setMapContacts(mapContacts.set(cho, [item]));
            else {
              const list = mapContacts?.get(cho) || [];
              const exist = list?.find(
                (a) =>
                  a?.phoneNumbers[0]?.number === item?.phoneNumbers[0]?.number,
              );

              if (exist) return;
              setMapContacts(mapContacts.set(cho, list.concat(item)));
            }
          } else {
            setOtherSection(name, item, sk);
          }
        });
        setSections(sk.filter((item) => !_.isEmpty(item.data)));
      }
    },
    [mapContacts, setKoSection, setOtherSection],
  );

  const getFirstLetter = useCallback(
    (item: any) => {
      // 한글 이름 중에서 초성, contact map
      const name = item.familyName + item.givenName;
      const sk = JSON.parse(JSON.stringify(sectionKeys));

      let resSection = {};
      // 한글일 경우
      if (checkKor.test(name)) {
        const disassemble = Hangul.disassemble(name, true);
        resSection = setKoSection(item, disassemble, sk);
      } else resSection = setOtherSection(name, item, sk);
      return resSection?.key;
    },
    [setKoSection, setOtherSection],
  );

  // 초성검색한 항목 section key 생성
  const makeSearchResult = useCallback(
    (currentContacts?: any[]) => {
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
    },
    [getFirstLetter],
  );

  const onChangeText = useCallback(
    (text: string) => {
      const currentMapContacts = mapContacts;
      const currentContacts = contacts;

      const txt = text.toLowerCase();
      const searcher = new Hangul.Searcher(text);
      const chosung: string[] = [];
      setHighlight(new Map());
      let currentSearchResult = [];

      const txtNumber = text
        ?.split('')
        ?.map((t) => `${utils.stringToNumber(t)}`)
        .join('');

      if (text?.length > 0) {
        // 한글일 경우 초성검색 또는 한글 검색
        if (checkKor.test(text)) {
          Array.from(currentMapContacts.keys())
            .filter((item) => {
              // 초성 index
              const i = item.indexOf(text);

              if (i >= 0) {
                currentMapContacts
                  .get(item)
                  ?.forEach((c) =>
                    setHighlight(
                      highlight.set(c.recordID, [i, i + text.length - 1]),
                    ),
                  );
              }
              return item.includes(text);
            })
            .forEach((item) => chosung.push(...currentMapContacts.get(item)));

          // 한글 초성검색
          currentSearchResult = chosung;

          if (Hangul.isComplete(text)) {
            // 한글 글자검색
            currentSearchResult = currentContacts.filter((item) => {
              const r = searcher.search(item.familyName + item.givenName) >= 0;

              const h = Hangul.rangeSearch(
                `${item.familyName}${item.givenName}`,
                text,
              );
              if (r) setHighlight(highlight.set(item.recordID, h[0]));
              return r;
            });
          }
        } else {
          // 영어검색
          currentSearchResult = currentContacts.filter((item) => {
            const r = `${item.familyName}${item.givenName}`
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

      // 전체 숫자인지 확인
      if (!_.isEmpty(txtNumber) && text.length === txtNumber.length) {
        const phone = currentContacts.filter(
          (item) =>
            item?.phoneNumbers[0]?.number
              ?.replace(/[^0-9]/g, '')
              ?.includes(txtNumber) && !currentSearchResult.includes(item),
        );

        setSearchText(text);
        setSearchResult(
          makeSearchResult(
            (currentSearchResult || [])?.concat(phone)?.sort(sortName),
          ) || [],
        );
      } else {
        setSearchText(text);
        setSearchResult(makeSearchResult(currentSearchResult) || []);
      }
    },
    [contacts, highlight, makeSearchResult, mapContacts],
  );

  const onPress = useCallback(
    (contactData: Contact) => {
      const num = getNumber(contactData?.phoneNumbers[0]?.number);
      const name = `${contactData?.familyName}${contactData?.givenName}`;

      action.talk.updateNumberClicked({num, name});
      navigation.goBack();
    },
    [action.talk, navigation],
  );

  const renderContactList = useCallback(
    ({item}) => {
      const val = item || {};
      return (
        <ContactListItem
          key={val.recordID}
          title={`${val.familyName}${val.givenName}`}
          uri={val.thumbnailPath}
          data={val}
          onPress={onPress}
          highlight={highlight.get(val?.recordID) || []}
        />
      );
    },
    [highlight, onPress],
  );

  // 권한 확인 및 연락처 update
  const contactsPermission = useCallback(() => {
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
          else {
            setChosung(a?.payload || []); // back > fore version
            setShowContacts(true);
          }
        });
      }
    });
  }, [action.talk, setChosung]);

  useEffect(() => {
    // 기본 연락처 갱신
    contactsPermission();

    // background > foreground 복귀시 연락처 갱신
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState?.current?.match(/inactive|background/) &&
        nextAppState === 'active' &&
        navigation.isFocused()
      ) {
        contactsPermission();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [contactsPermission, navigation]);

  const onCancel = useCallback(() => {
    onChangeText('');
    setSearchText(undefined);
    setHighlight(new Map());
    setSearchResult([]);
  }, [onChangeText]);

  const renderSectionHeader = useCallback(
    ({section}) => (
      <AppText style={styles.sectionHeader}>{section?.title}</AppText>
    ),
    [],
  );

  const renderSectionListHeader = useCallback(
    ({section}) => (
      <AppText style={styles.sectionHeader}>{section?.key}</AppText>
    ),
    [],
  );

  const contactsView = useCallback(() => {
    if (contacts?.length === 0)
      return <EmptyResult title={i18n.t('talk:contact:empty')} />;
    return _.isEmpty(searchText) ? (
      <>
        <View style={styles.headerView}>
          <AppText style={appStyles.bold18Text}>
            {i18n.t('talk:contact')}
          </AppText>
        </View>
        {!_.isEmpty(sections) && (
          <SectionListSidebar
            ref={sectionListRef}
            smallSidebar={small}
            sideItemHeight={13}
            sideHeight={small ? 350 : 520}
            data={sections}
            renderItem={renderContactList}
            itemHeight={74} // contact list item height
            sectionHeaderHeight={20}
            renderSectionHeader={renderSectionListHeader}
            sidebarContainerStyle={styles.sidebarContainer}
            sidebarItemTextStyle={styles.sidebarItem}
            locale="kor"
          />
        )}
      </>
    ) : (
      <SectionList
        contentContainerStyle={{flexGrow: 1}}
        sections={searchResult}
        renderItem={renderContactList}
        renderSectionHeader={renderSectionHeader}
        refreshing={pending}
        ListEmptyComponent={<EmptyResult />}
      />
    );
  }, [
    contacts?.length,
    pending,
    renderContactList,
    renderSectionHeader,
    renderSectionListHeader,
    searchResult,
    searchText,
    sections,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppSearch
          onChangeText={onChangeText}
          onCancel={onCancel}
          value={searchText || ''}
          placeholder={i18n.t('talk:contact:search')}
          focusColor={colors.clearBlue}
        />
      </View>
      {showContacts && <View style={{height: 24}} />}
      {showContacts ? contactsView() : beforeSync()}
    </SafeAreaView>
  );
};

export default connect(
  ({talk, status}: RootState) => ({
    talk,
    pending: status.pending[talkActions.getContacts.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      talk: bindActionCreators(talkActions, dispatch),
    },
  }),
)(TalkContactScreen);
