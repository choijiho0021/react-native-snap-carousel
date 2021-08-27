/* eslint-disable no-param-reassign */
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import AppTextInput from '@/components/AppTextInput';
import StoreList from '@/components/StoreList';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {RkbProduct} from '@/redux/api/productApi';
import {
  actions as productActions,
  ProductAction,
  ProductModelState,
} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import {retrieveData, storeData} from '@/utils/utils';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {Component, memo, useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppEventsLogger} from 'react-native-fbsdk';
import {getTrackingStatus} from 'react-native-tracking-transparency';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';

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
    marginRight: 30,
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
  },
  titleBottom: {
    height: 1,
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: colors.black,
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
          clearButtonMode="always"
          onSubmitEditing={() => search(word, true)}
          onChangeText={(value: string) => {
            search(value, false);
            setWord(value);
          }}
          value={word}
        />
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

type StoreSearchScreenRouteProp = RouteProp<HomeStackParamList, 'StoreSearch'>;

type StoreSearchScreenProps = {
  navigation: StoreSearchScreenNavigationProp;
  route: StoreSearchScreenRouteProp;

  product: ProductModelState;
  action: {
    product: ProductAction;
  };
};

type StoreSearchScreenState = {
  querying: boolean;
  searching: boolean;
  searchWord: string;
  searchList: string[];
  recommendCountry: string[];
};

class StoreSearchScreen extends Component<
  StoreSearchScreenProps,
  StoreSearchScreenState
> {
  headerRef: React.RefObject<HeaderTitleRef>;

  constructor(props: StoreSearchScreenProps) {
    super(props);
    this.state = {
      querying: true,
      searching: false,
      searchWord: '',
      searchList: [],
      recommendCountry: [],
    };

    this.headerRef = React.createRef<HeaderTitleRef>();
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    this.getRecommendation();

    Analytics.trackEvent('Page_View_Count', {page: 'Country Search'});

    this.getSearchHist();

    this.props.navigation.setOptions({
      title: null,
      headerLeft: null,
      headerTitle: () => (
        <HeaderTitle search={this.search} headerRef={this.headerRef} />
      ),
    });
  }

  componentDidUpdate(prevProps, prevState: StoreSearchScreenState) {
    if (this.state.searching !== prevState.searching) {
      this.getSearchHist();
    }
  }

  async getSearchHist() {
    const searchHist = await retrieveData('searchHist');
    // searchHist 저장 형식 : ex) 대만,중국,일본
    const searchList = _.isNull(searchHist)
      ? []
      : searchHist.split(',').slice(0, MAX_HISTORY_LENGTH);
    this.setState({searchList});
  }

  getRecommendation() {
    API.Page.getPageByCategory('store:search_key')
      .then((resp) => {
        if (resp.result === 0 && resp.objects.length > 0) {
          const recommendation = resp.objects[0].body
            ?.replace(/<\/p>/gi, '')
            .replace(/<p>/gi, '')
            .split(',');
          if (recommendation) {
            this.setState({
              recommendCountry: recommendation,
            });
          }
        }
      })
      .catch((err) => {
        console.log('failed to get page', err);
      })
      .finally(() => {
        this.setState({
          querying: false,
        });
      });
  }

  onPressItem = async (prodOfCountry: RkbProduct[]) => {
    if (this.state.searchWord.length > 0) {
      Analytics.trackEvent('Page_View_Count', {
        page: 'Move To Country with Searching',
      });

      // * logEvent(eventName: string, valueToSum: number, parameters: {[key:string]:string|number});
      const {searchWord} = this.state;

      const status = await getTrackingStatus();
      if (status === 'authorized') {
        const params = {
          _valueToSum: 1,
          fb_search_string: searchWord,
          fb_content_type: 'Country',
          success: 1,
        };
        AppEventsLogger.logEvent('fb_mobile_search', params);
        console.log('@@ search events', prodOfCountry, searchWord);
      }
    }

    this.props.action.product.setProdOfCountry(prodOfCountry);
    this.props.navigation.navigate('Country');
  };

  async search(searchWord: string, searching = false) {
    this.setState({searchWord, searching});
    this.headerRef?.current?.changeValue(searchWord);

    if (searching) {
      // 최근 검색 기록
      const oldsearchHist = await retrieveData('searchHist');

      if (searchWord && !searchWord.match(',')) {
        // 중복 제거 후 최대 7개까지 저장한다. 저장 형식 : ex) 대만,중국,일본
        if (!_.isNull(oldsearchHist)) {
          const oldHist = oldsearchHist.split(',');
          searchWord = oldHist.includes(searchWord)
            ? oldsearchHist
            : `${searchWord},${oldHist
                .slice(0, MAX_HISTORY_LENGTH - 1)
                .join(',')}`;
        }
        storeData('searchHist', searchWord);
      }
    }
  }

  renderSearchWord() {
    const {searchList, recommendCountry} = this.state;

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
              {' '}
              {i18n.t('search:err')}{' '}
            </AppText>
          </View>
        ) : (
          searchList.map((elm) => (
            <TouchableOpacity
              key={elm}
              style={styles.searchList}
              onPress={() => this.search(elm, true)}>
              <AppText key="Text" style={styles.searchListText}>
                {elm}
              </AppText>
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
                  onPress={() => this.search(elm2, true)}>
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
  }

  // 국가이름 자동완성
  renderSearching() {
    const {searchWord = ''} = this.state;
    const allData = this.props.product.sortedProdList;
    if (!allData) {
      return null;
    }

    // 복수국가 이름 검색 추가
    const searchResult = allData
      .filter((elm) => elm.length > 0 && elm[0].search?.match(searchWord))
      .map((elm) => ({
        name: elm[0].name,
        country: elm[0].search,
        categoryId: elm[0].categoryId,
        uuid: elm[0].uuid,
      }));

    return (
      <View style={styles.width100}>
        {searchResult.map((elm, idx) => (
          <TouchableOpacity
            key={elm.uuid}
            onPress={() => this.search(elm.country, true)}>
            <View key={`${idx}`} style={styles.autoList}>
              <AppText key="text" style={styles.autoText}>
                {elm.categoryId.includes(API.Product.category.multi)
                  ? elm.name
                  : elm.country}
              </AppText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  // 국가 검색
  renderStoreList() {
    const {searchWord = ''} = this.state;
    const allData = this.props.product.sortedProdList;
    const filtered = allData.filter(
      (elm) => _.isEmpty(searchWord) || elm[0].search?.match(searchWord),
    );

    const list = API.Product.toColumnList(filtered);

    return list.length > 0 ? (
      <StoreList data={list} onPress={this.onPressItem} />
    ) : (
      <View style={styles.emptyViewPage}>
        <AppText style={styles.emptyPage}>{i18n.t('country:empty')}</AppText>
      </View>
    );
  }

  render() {
    const {querying, searching, searchWord} = this.state;

    return (
      <View style={styles.mainContainer}>
        <AppActivityIndicator visible={querying} />
        {searching ? (
          this.renderStoreList()
        ) : (
          <ScrollView style={{width: '100%'}}>
            {searchWord ? this.renderSearching() : this.renderSearchWord()}
          </ScrollView>
        )}
      </View>
    );
  }
}

export default connect(
  ({product}: RootState) => ({product}),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
    },
  }),
)(StoreSearchScreen);
