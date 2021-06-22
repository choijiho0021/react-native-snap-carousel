/* eslint-disable no-param-reassign */
import {RootState} from '@/redux';
import Analytics from 'appcenter-analytics';
import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppEventsLogger} from 'react-native-fbsdk';
import {getTrackingStatus} from 'react-native-tracking-transparency';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppActivityIndicator from '../../components/AppActivityIndicator';
import StoreList from '../../components/StoreList';
import {colors} from '../../constants/Colors';
import {isDeviceSize} from '../../constants/SliderEntry.style';
import {appStyles} from '../../constants/Styles';
import * as productActions from '../../redux/modules/product';
import {API} from '../../submodules/rokebi-utils';
import i18n from '../../utils/i18n';
import {retrieveData, storeData} from '../../utils/utils';
import HeaderTitle from './components/HeaderTitle';

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
        borderColor: colors.lightGray,
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
        borderColor: colors.lightGray,
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
});

const MAX_HISTORY_LENGTH = 7;

class StoreSearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      querying: true,
      searching: false,
      searchWord: '',
      searchList: [],
      recommendCountry: [],
    };
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    this.getRecommendation();

    Analytics.trackEvent('Page_View_Count', {page: 'Country Search'});

    this.setState({allData: this.props.product.sortedProdList});
    this.getSearchHist();

    this.props.navigation.setOptions({
      title: null,
      headerLeft: null,
      headerTitle: () => (
        <HeaderTitle
          search={this.search}
          searchWord={this.state.searchWord}
          navigation={this.props.navigation}
        />
      ),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.searchWord &&
      this.state.searchWord !== prevState.searchWord
    ) {
      this.props.navigation.setOptions({
        title: null,
        headerLeft: null,
        headerTitle: () => (
          <HeaderTitle
            search={this.search}
            searchWord={this.state.searchWord}
            navigation={this.props.navigation}
          />
        ),
      });
    }

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
            .replace(/<\/p>/gi, '')
            .replace(/<p>/gi, '')
            .split(',');
          this.setState({
            recommendCountry: recommendation,
          });
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

  onPressItem = (prodOfCountry) => {
    if (this.state.searchWord.length > 0) {
      Analytics.trackEvent('Page_View_Count', {
        page: 'Move To Country with Searching',
      });

      // * logEvent(eventName: string, valueToSum: number, parameters: {[key:string]:string|number});

      if (getTrackingStatus === 'authorized') {
        const params = {
          _valueToSum: 1,
          fb_search_string: this.state.searchWord,
          fb_content_type: 'Country',
          success: 1,
        };
        AppEventsLogger.logEvent('fb_mobile_search', params);
        console.log('@@ search events', prodOfCountry, this.state.searchWord);
      }
    }

    this.props.action.product.setProdOfCountry(prodOfCountry);
    this.props.navigation.navigate('Country');
  };

  async search(searchWord, searching = false) {
    this.setState({searchWord, searching});

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
          <Text style={styles.searchListHeaderText}>
            {i18n.t('search:list')}
          </Text>
        </View>
        {_.isEmpty(searchList) ? (
          <View style={styles.noList}>
            <Text style={styles.searchListText}> {i18n.t('search:err')} </Text>
          </View>
        ) : (
          searchList.map((elm) => (
            <TouchableOpacity
              key={elm}
              style={styles.searchList}
              onPress={() => this.search(elm, true)}>
              <Text key="Text" style={styles.searchListText}>
                {elm}
              </Text>
            </TouchableOpacity>
          ))
        )}
        <View style={styles.recommendHeader}>
          <Text style={styles.searchListHeaderText}>
            {i18n.t('search:recommend')}
          </Text>
        </View>
        {recommendCountryList.map((elm) => (
          <View key={elm.key} style={styles.recommendRow}>
            {elm.data.map((elm2, idx) =>
              elm2 ? (
                <TouchableOpacity
                  key={elm2}
                  style={styles.recommebdItem}
                  onPress={() => this.search(elm2, true)}>
                  <Text style={styles.recommendText}>{elm2}</Text>
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
    const {allData, searchWord = ''} = this.state;
    if (!allData) {
      return null;
    }

    // 복수국가 이름 검색 추가
    const searchResult = allData
      .filter((elm) => elm.length > 0 && elm[0].search.match(searchWord))
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
              <Text key="text" style={styles.autoText}>
                {elm.categoryId === API.Product.category.multi
                  ? elm.name
                  : elm.country}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  // 국가 검색
  renderStoreList() {
    const {allData, searchWord = ''} = this.state;
    const filtered = allData.filter(
      (elm) => _.isEmpty(searchWord) || elm[0].search.match(searchWord),
    );

    const list = API.Product.toColumnList(filtered);

    return list.length > 0 ? (
      <StoreList data={list} onPress={this.onPressItem} />
    ) : (
      <View style={styles.emptyViewPage}>
        <Text style={styles.emptyPage}>{i18n.t('country:empty')}</Text>
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
