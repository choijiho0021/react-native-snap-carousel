import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import moment from 'moment';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import i18n from '@/utils/i18n';
import ScreenHeader from '@/components/ScreenHeader';
import BackbuttonHandler from '@/components/BackbuttonHandler';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import AppStyledText from '@/components/AppStyledText';
import AppBackButton from '@/components/AppBackButton';
import AppSearch from '@/components/AppSearch';
import {connect, useDispatch} from 'react-redux';
import {RootState} from '@/redux';
import {bindActionCreators} from 'redux';
import SectionListSidebar from 'react-native-textindicator-sectionlist-sidebar';
import {
  actions as talkActions,
  TalkAction,
  TalkModelState,
} from '@/redux/modules/talk';
import {
  check,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import AppAlert from '@/components/AppAlert';
import * as Hangul from 'hangul-js';
import {
  checkEng,
  checkKor,
  checkSpecial,
  doubleKor,
  sectionKeys,
} from '@/constants/CustomTypes';
import {utils} from '@/utils/utils';
import {Contact} from 'react-native-contacts';
import _ from 'underscore';
import Layout from '@/constants/Layout';
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
    // borderWidth: 1,
    // borderColor: colors.black,
    alignContent: 'center',
    height: 24,
    lineHeight: 24,
    letterSpacing: -0.16,
    // textAlignVertical: 'center',
    // alignItems: 'center',
    color: colors.warmGrey,
  },
});

type ContactsScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'TalkContact'
>;

type ContactsScreenRouteProp = RouteProp<HomeStackParamList, 'TalkContact'>;

type ContactsScreenProps = {
  navigation: ContactsScreenNavigationProp;
  route: ContactsScreenRouteProp;
  talk: TalkModelState;
  action: {
    talk: TalkAction;
  };
};

const ContactsScreen: React.FC<ContactsScreenProps> = ({
  navigation,
  route: {params},
  talk: {contacts},
  action,
}) => {
  const [showContacts, setShowContacts] = useState(false);
  const isSuccess = useMemo(() => params?.pymVBank || false, [params]);
  const [expireDate, amount, vAcntNo] = useMemo(() => {
    if (params?.info) {
      const {expireDate, amount, vAcntNo} = params?.info;
      if (expireDate)
        return [
          moment(expireDate, 'YYYYMMDDHHmmss').utcOffset(9, true).format(),
          amount,
          vAcntNo,
        ];
    }
    return ['', '', ''];
  }, [params?.info]);

  // useEffect(() => {
  //   dispatch(talkActions.getContacts());
  //   // action.talk.getContacts();
  // }, []);

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
      console.log('@@@ res2 ', r);
      setShowContacts(r);
      if (r)
        Promise.resolve(action.talk.getContacts()).then((re) =>
          console.log('@@@@@ cont r', re),
        );
    });
  }, []);

  const onNavigateScreen = useCallback(() => {
    navigation.popToTop();

    navigation.navigate('EsimStack', {
      screen: 'Esim',
      params: {
        actionStr: 'reload',
      },
    });
  }, [navigation]);

  console.log('@@@ vbank info', params?.info);

  // 결제 완료창에서 뒤로가기 시 확인과 똑같이 처리한다.
  BackbuttonHandler({
    navigation,
    onBack: () => {
      onNavigateScreen();
      return true;
    },
  });

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

  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [mapContacts, setMapContacts] = React.useState(new Map());
  const [loading, setLoading] = useState<boolean>(false);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [sections, setSections] = useState<any[]>([]);
  const sectionListRef = useRef();
  const dispatch = useDispatch();

  console.log('@@ build cont', contacts);
  const onChangeText = useCallback(
    (text) => {
      const currentMapContacts = mapContacts;
      const currentContacts = contacts;

      const txtNumber = (utils.stringToNumber(text) || '').toString();
      const txt = text.toLowerCase();
      const searcher = new Hangul.Searcher(text);
      const chosung: string[] = [];

      // 한글일 경우 초성검색 또는 한글 검색
      if (checkKor.test(text)) {
        Array.from(currentMapContacts.keys())
          .filter((item) => item.includes(text))
          .forEach((item) => chosung.push(currentMapContacts.get(item)));
      }

      const hangulResult = Hangul.isComplete(text)
        ? currentContacts.filter(
            (item) => searcher.search(item.givenName + item.familyName) >= 0,
          )
        : chosung;

      const currentSearchResult = checkKor.test(text)
        ? hangulResult
        : currentContacts.filter((item) =>
            (item.givenName + item.familyName).toLowerCase().includes(txt),
          );

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
        setSearchResult([...currentSearchResult, ...phone]);
      } else {
        setSearchText(text);
        setSearchResult(currentSearchResult);
      }
    },
    [contacts, mapContacts],
  );

  // sortName 사용 X?
  const sortName = (a: string, b: string) => {
    const nameA = a.familyName + a.givenName;
    const nameB = b.familyName + b.givenName;

    const priorityA = checkKor.test(nameA) ? -2 : checkEng.test(nameA) ? -1 : 0;
    const priorityB = checkKor.test(nameB) ? -2 : checkEng.test(nameB) ? -1 : 0;

    if (priorityA > priorityB) return priorityA;
    if (priorityA === priorityB)
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    return priorityB;
  };

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
    },
    [removeDup],
  );

  const setKoSection = useCallback(
    (item, disassemble) => {
      doubleKor.forEach((value) => {
        const double = value.find((v) => v === disassemble[0][0]) || [];
        const findSection = sectionKeys.find((v) =>
          _.isEmpty(double) ? v.key === disassemble[0][0] : v.key === value[0],
        );
        if (_.isEmpty(findSection)) return;

        removeDup(findSection, item);
      });
    },
    [removeDup],
  );

  const setChosung = useCallback(() => {
    // 확인용, stateContact useCallback 디펜던시 적용시 지우기
    const currentContacts = contacts;
    console.log('@@ cho', contacts);

    // 한글 이름 중에서 초성, contact map
    if (!_.isEmpty(contacts)) {
      currentContacts.map((item) => {
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
  }, [contacts, mapContacts, setKoSection, setOtherSection]);

  useEffect(() => {
    setChosung();
  }, [setChosung]);

  const onPress = useCallback(
    (contactData: Contact) => {
      // navigation.navigate('ContactDetail', {contact: contactData});
    },
    [navigation],
  );

  const renderContactList = ({item}) => {
    const val = item || {};
    console.log(
      '@@ sec i',
      val.thumbnailPath,
      `${val.givenName} ${val.familyName}`,
      val,
    );
    return (
      <ContactListItem
        key={val.recordID}
        title={`${val.givenName} ${val.familyName}`}
        uri={val.thumbnailPath}
        data={val}
        onPress={onPress}
      />
    );
  };

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
  const searchBar = useCallback(() => {
    return (
      <View style={styles.searchLine}>
        <View style={styles.searchBarBorder}>
          <TextInput
            onChangeText={onChangeText}
            placeholder={i18n.t('contact:search')}
            style={{color: colors.black}}
            placeholderTextColor={colors.greyish}
          />
        </View>
        <AppButton
          style={{backgroundColor: colors.white, flex: 0.8}}
          titleStyle={{color: colors.black}}
          title="취소"
          onPress={() => toggleSearchBar(false)}
        />
      </View>
    );
  }, [onChangeText, toggleSearchBar]);

  useEffect(() => {
    setChosung();
  }, [setChosung]);

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
  // }, [navigation, route.params, searchBar, toggleSearchBar]);

  useEffect(() => {
    setSections(sectionKeys.filter((item) => !_.isEmpty(item.data)));
  }, []);

  console.log('@@@ sec', sections, searchResult);
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: colors.white, alignItems: 'stretch'}}>
      <View style={styles.header}>
        <AppSearch title={i18n.t('acc:balance')} style={{height: 55}} />
      </View>
      {/* {showContacts ?         <FlatList
          data={searchResult}
          renderItem={renderContactList}
          keyExtractor={(item) => item.recordID}
        /> : beforeSync()} */}
      {_.isEmpty(searchText) ? (
        !_.isEmpty(sections) && (
          <SectionListSidebar
            ref={sectionListRef}
            data={sections}
            renderItem={renderContactList}
            itemHeight={30}
            sectionHeaderHeight={20}
            // containerStyle={{alignItems: 'center'}}
            // sidebarItemStyle={}
            // sidebarItemHeight={520}
            sectionHeaderStyle={styles.sectionHeader}
            // sidebarItemStyle={{
            //   flex: 1,
            //   // backgroundColor: colors.babyBlue,

            //   alignSelf: 'center',
            // }}
            sidebarContainerStyle={{
              flex: 1,
              // flexDirection: 'column',
              alignSelf: 'flex-end',
              justifyContent: 'center',
              // height: 600,
              // backgroundColor: colors.babyBlue,
              // justifyContent: 'center',
              // alignContent: 'center',
              // alignSelf: 'center',
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
        <FlatList
          ListHeaderComponent={<AppText>연락처</AppText>}
          data={searchResult}
          renderItem={renderContactList}
          keyExtractor={(item) => item.recordID}
        />
      )}
      {/* <FlatList
        data={searchResult}
        renderItem={renderContactList}
        keyExtractor={(item) => item.recordID}
      /> */}
      {/* <View
        style={showSearchBar && _.isEmpty(searchText) && styles.backCover}
      /> */}
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
)(ContactsScreen);
