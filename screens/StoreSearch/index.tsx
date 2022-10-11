import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppEventsLogger} from 'react-native-fbsdk-next';
import {getTrackingStatus} from 'react-native-tracking-transparency';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import AppTextInput from '@/components/AppTextInput';
import StoreList from '@/components/StoreList';
import {colors} from '@/constants/Colors';
import {isDeviceSize, isFolderOpen} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {
  actions as productActions,
  ProductAction,
  ProductModelState,
  RkbPriceInfo,
} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import {retrieveData, storeData, utils} from '@/utils/utils';
import AppSvgIcon from '@/components/AppSvgIcon';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 15,
    backgroundColor: colors.white,
  },
  width100: {
    width: '100%',
  },
  searchList: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  searchListHeader: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  recommendHeader: {
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 40,
  },
  recommendRow: {
    marginLeft: 20,
    marginRight: 12,
    alignContent: 'space-between',
    flexDirection: 'row',
  },
  recommebdItem: isDeviceSize('medium')
    ? {
        height: 46,
        borderRadius: 3,
        backgroundColor: colors.white,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        marginRight: 12,
        flex: 1,
      }
    : {
        height: 51,
        borderRadius: 3,
        backgroundColor: colors.white,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        marginRight: 12,
        flex: 1,
      },
  recommendText: {
    ...appStyles.normal14Text,
  },
  recommebdEmpty: {
    height: 46,
    marginBottom: 12,
    marginRight: 12,
    flex: 1,
  },
  searchListHeaderText: {
    ...appStyles.bold16Text,
  },
  searchListText: isDeviceSize('medium')
    ? {
        ...appStyles.normal14Text,
        color: colors.warmGrey,
      }
    : {...appStyles.normal16Text, color: colors.warmGrey},
  noList: {
    width: '100%',
    marginTop: 30,
    marginBottom: 25,
    alignItems: 'center',
  },
  autoList: {
    marginVertical: 23,
    marginLeft: 60,
  },
  autoText: {
    ...appStyles.normal16Text,
  },
  emptyPage: {
    marginTop: 60,
    textAlign: 'center',
  },
  emptyViewPage: {
    width: '100%',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  headerTitle: {
    width: Math.round(Dimensions.get('window').width),
    flexDirection: 'row',
    alignContent: 'center',
    flex: 1,
  },
  searchText: {
    // React Native 6.3버전 미만에서 한글로 글을 쓰는 경우 글씨 크기가 오락가락하는 이슈가 발생
    // 글씨크기의 기본값 17로 설정하는 경우 어느정도 해결할 수 있으므로 설정 변경
    // ... appStyles.normal14Text,
    color: colors.black,
    fontSize: 17,
    flex: 1,
  },
  showSearchBar: {
    paddingRight: 30,
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
  },
  titleBottom: {
    height: 1,
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: colors.black,
  },
  divider: {
    borderRightWidth: 1,
    borderRightColor: colors.lightGrey,
    height: 12,
    marginRight: 20,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
  },
});

const MAX_HISTORY_LENGTH = 7;

type HeaderTitleRef = {
  changeValue: (v: string) => void;
};

const HeaderTitle0 = ({
  search,
  headerRef,
}: {
  search: (v: string, b: boolean) => void;
  headerRef: React.MutableRefObject<HeaderTitleRef | null>;
}) => {
  const [word, setWord] = useState('');

  useEffect(() => {
    if (headerRef) {
      headerRef.current = {
        changeValue: (v: string) => {
          setWord(v);
        },
      };
    }
  }, [headerRef]);

  return (
    <View style={styles.container}>
      <View style={styles.headerTitle}>
        <AppBackButton />
        <AppTextInput
          style={styles.searchText}
          placeholder={i18n.t('store:search')}
          placeholderTextColor={colors.greyish}
          returnKeyType="search"
          enablesReturnKeyAutomatically
          onSubmitEditing={() => search(word, true)}
          onChangeText={(value: string) => {
            search(value, false);
            setWord(value);
          }}
          value={word}
        />

        {word.length > 0 && (
          <View style={{flexDirection: 'row'}}>
            <AppButton
              style={[styles.showSearchBar, {paddingRight: 20}]}
              onPress={() => search('', false)}
              iconName="btnSearchCancel"
            />
            <View style={styles.divider} />
          </View>
        )}
        <AppButton
          style={styles.showSearchBar}
          onPress={() => search(word, true)}
          iconName="btnSearchOff"
        />
      </View>
      <View style={styles.titleBottom} />
    </View>
  );
};

const HeaderTitle = memo(HeaderTitle0);

type StoreSearchScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'StoreSearch'
>;

type StoreSearchScreenProps = {
  navigation: StoreSearchScreenNavigationProp;

  product: ProductModelState;
  action: {
    product: ProductAction;
  };
};

const StoreSearchScreen: React.FC<StoreSearchScreenProps> = ({
  navigation,
  product,
  action,
}) => {
  const [querying, setQuerying] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [searchWord, setSearchWord] = useState<string>('');
  const [searchList, setSearchList] = useState<string[]>([]);
  const [recommendCountry, setRecommendCountry] = useState<string[]>([]);
  const headerRef = useRef<HeaderTitleRef>();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const getSearchHist = useCallback(async () => {
    const searchHist = await retrieveData('searchHist');
    // searchHist 저장 형식 : ex) 대만,중국,일본

    setSearchList(
      _.isNull(searchHist)
        ? []
        : searchHist.split(',').slice(0, MAX_HISTORY_LENGTH),
    );
  }, []);

  const rmSearchHist = useCallback(
    (word: string) => {
      const newList = searchList.filter((elm) => elm !== word);
      setSearchList(newList);
      storeData('searchHist', newList.join(','));
    },
    [searchList],
  );

  const getRecommendation = useCallback(() => {
    API.Page.getPageByCategory('store:search_key')
      .then((resp) => {
        if (resp.result === 0 && resp.objects.length > 0) {
          const recommendation = resp.objects[0].body
            ?.replace(/<\/p>/gi, '')
            .replace(/<p>/gi, '')
            .split(',');
          if (recommendation) {
            setRecommendCountry(recommendation);
          }
        }
      })
      .catch((err) => {
        console.log('failed to get page', err);
      })
      .finally(() => {
        setQuerying(false);
      });
  }, []);

  const onPressItem = useCallback(
    async (info: RkbPriceInfo) => {
      if (searchWord.length > 0) {
        Analytics.trackEvent('Page_View_Count', {
          page: 'Move To Country with Searching',
        });

        const status = await getTrackingStatus();
        if (status === 'authorized') {
          const params = {
            _valueToSum: 1,
            fb_search_string: searchWord,
            fb_content_type: 'Country',
            success: 1,
          };
          AppEventsLogger.logEvent('fb_mobile_search', params);
        }
      }

      action.product.getProdOfPartner(info.partnerList);
      navigation.navigate('Country', {partner: info.partnerList});
    },
    [action.product, navigation, searchWord],
  );

  const search = useCallback(async (word: string, isSearching = false) => {
    setSearchWord(word);
    setSearching(isSearching);
    headerRef?.current?.changeValue(word);

    if (isSearching) {
      // 최근 검색 기록
      const oldsearchHist = await retrieveData('searchHist');

      if (word && !word.match(',')) {
        // 중복 제거 후 최대 7개까지 저장한다. 저장 형식 : ex) 대만,중국,일본
        if (!_.isNull(oldsearchHist)) {
          const oldHist = oldsearchHist.split(',');
          word = oldHist.includes(word)
            ? oldsearchHist
            : `${word},${oldHist.slice(0, MAX_HISTORY_LENGTH - 1).join(',')}`;
        }
        storeData('searchHist', word);
      }
    }
  }, []);

  const renderSearchWord = useCallback(() => {
    const recommendCountryList = recommendCountry
      .map((elm, idx, arr) => ({
        key: elm,
        data: [elm, arr[idx + 1], arr[idx + 2]],
      }))
      .filter((elm, idx) => idx % 3 === 0);

    return (
      <View style={styles.width100}>
        {/* 최근 검색 */}
        <View style={styles.searchListHeader}>
          <AppText style={styles.searchListHeaderText}>
            {i18n.t('search:list')}
          </AppText>
        </View>
        {_.isEmpty(searchList) ? (
          <View style={styles.noList}>
            <AppText style={styles.searchListText}>
              {i18n.t('search:err')}
            </AppText>
          </View>
        ) : (
          searchList.map((elm) => (
            <TouchableOpacity
              key={elm}
              style={styles.searchList}
              onPress={() => search(elm, true)}>
              <AppText key="Text" style={styles.searchListText}>
                {elm}
              </AppText>
              <AppSvgIcon
                name="removeSearchHist"
                onPress={() => {
                  rmSearchHist(elm);
                }}
              />
            </TouchableOpacity>
          ))
        )}
        <View style={styles.recommendHeader}>
          <AppText style={styles.searchListHeaderText}>
            {i18n.t('search:recommend')}
          </AppText>
        </View>
        {recommendCountryList.map((elm) => (
          <View key={elm.key} style={styles.recommendRow}>
            {elm.data.map((elm2, idx) =>
              elm2 ? (
                <TouchableOpacity
                  key={elm2}
                  style={styles.recommebdItem}
                  onPress={() => search(elm2, true)}>
                  <AppText style={styles.recommendText}>{elm2}</AppText>
                </TouchableOpacity>
              ) : (
                <View key={`${idx}`} style={styles.recommebdEmpty} />
              ),
            )}
          </View>
        ))}
      </View>
    );
  }, [recommendCountry, rmSearchHist, search, searchList]);

  // 국가 검색
  const renderStoreList = useCallback(
    (key: string) => {
      const filtered = product.prodByCountry
        .filter((v) => v.search?.match(key))
        .map(
          (v) =>
            ({
              ...v,
              partnerList: [v.partner],
              minPrice: utils.stringToCurrency(v.price),
            } as RkbPriceInfo),
        );

      const list = API.Product.toColumnList(filtered);

      return list.length > 0 ? (
        <StoreList
          data={list}
          onPress={onPressItem}
          localOpList={product.localOpList}
          width={dimensions.width}
        />
      ) : (
        <View style={styles.emptyViewPage}>
          <AppText style={styles.emptyPage}>{i18n.t('country:empty')}</AppText>
        </View>
      );
    },
    [dimensions.width, onPressItem, product.localOpList, product.prodByCountry],
  );

  useEffect(() => {
    getRecommendation();

    Analytics.trackEvent('Page_View_Count', {page: 'Country Search'});

    getSearchHist();

    navigation.setOptions({
      title: null,
      headerLeft: null,
      headerTitle: () => <HeaderTitle search={search} headerRef={headerRef} />,
    });
  }, [getRecommendation, getSearchHist, navigation, search]);

  return (
    <View style={styles.mainContainer}>
      <AppActivityIndicator visible={querying} />
      {searchWord ? (
        renderStoreList(searchWord)
      ) : (
        <ScrollView style={{width: '100%'}}>{renderSearchWord()}</ScrollView>
      )}
    </View>
  );
};

export default connect(
  ({product}: RootState) => ({product}),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
    },
  }),
)(StoreSearchScreen);
