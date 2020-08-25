import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {appStyles} from '../constants/Styles';
import * as productActions from '../redux/modules/product';
import i18n from '../utils/i18n';
import utils from '../utils/utils';
import _ from 'underscore';
import {bindActionCreators} from 'redux';
import {colors} from '../constants/Colors';
import AppButton from '../components/AppButton';
import AppActivityIndicator from '../components/AppActivityIndicator';
import StoreList from '../components/StoreList';
import {sliderWidth, windowHeight} from '../constants/SliderEntry.style';
import Analytics from 'appcenter-analytics';
import AppBackButton from '../components/AppBackButton';
import {isDeviceSize} from '../constants/SliderEntry.style';
import {API} from 'RokebiESIM/submodules/rokebi-utils';

const MAX_HISTORY_LENGTH = 7;
class HeaderTitle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searching: false,
      searchWord: '',
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.searchWord != this.state.searchWord ||
      this.props.searchWord != nextProps.searchWord ||
      this.props.navigation != nextProps.navigation
    );
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.searchWord &&
      this.props.searchWord != prevProps.searchWord
    ) {
      this.setState({
        searchWord: this.props.searchWord,
      });
    }
  }

  _onChangeText = key => value => {
    this.setState({
      [key]: value,
    });
    this.props.search && this.props.search(value, false);
  };

  search(searchWord) {
    this.setState({searching: true});
    this.props.search && this.props.search(searchWord, true);
  }

  render() {
    const {searchWord} = this.state;
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.headerTitle}>
          <AppBackButton navigation={navigation} />
          <TextInput
            style={styles.searchText}
            placeholder={i18n.t('store:search')}
            placeholderTextColor={colors.greyish}
            returnKeyType="search"
            enablesReturnKeyAutomatically={true}
            clearButtonMode="always"
            onSubmitEditing={() => this.search(searchWord)}
            onChangeText={this._onChangeText('searchWord')}
            value={searchWord}
          />
          <AppButton
            style={styles.showSearchBar}
            onPress={() => this.search(searchWord)}
            iconName="btnSearchOff"
          />
        </View>
        <View style={styles.titleBottom} />
      </View>
    );
  }
}

class StoreSearchScreen extends Component {
  constructor(props) {
    super(props);

    const {params = {}} = this.props.route;

    this.state = {
      querying: true,
      searching: false,
      searchWord: '',
      searchList: [],
      recommendCountry: [],
    };
    this._search = this._search.bind(this);
  }

  getRecommendation() {
    API.Page.getPageByCategory('store:search_key')
      .then(resp => {
        if (resp.result == 0 && resp.objects.length > 0) {
          const recommendation = resp.objects[0].body
            .replace(/<\/p>/gi, '')
            .replace(/<p>/gi, '')
            .split(',');
          this.setState({
            recommendCountry: recommendation,
          });
        }
      })
      .catch(err => {
        console.log('failed to get page', err);
      })
      .finally(_ => {
        this.setState({
          querying: false,
        });
      });
  }

  componentDidMount() {
    this.getRecommendation();

    Analytics.trackEvent('Page_View_Count', {page: 'Country Search'});

    this.setState({allData: this.props.product.get('sortedProdList')});
    this.getSearchHist();

    this.props.navigation.setOptions({
      title: null,
      headerLeft: null,
      headerTitle: () => (
        <HeaderTitle
          search={this._search}
          searchWord={this.state.searchWord}
          navigation={this.props.navigation}
        />
      ),
    });
  }

  async getSearchHist() {
    const searchHist = await utils.retrieveData('searchHist');
    //searchHist 저장 형식 : ex) 대만,중국,일본
    const searchList = _.isNull(searchHist)
      ? []
      : searchHist.split(',').slice(0, MAX_HISTORY_LENGTH);
    this.setState({searchList});
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.searchWord &&
      this.state.searchWord != prevState.searchWord
    ) {
      this.props.navigation.setOptions({
        title: null,
        headerLeft: null,
        headerTitle: () => (
          <HeaderTitle
            search={this._search}
            searchWord={this.state.searchWord}
            navigation={this.props.navigation}
          />
        ),
      });
    }

    if (this.state.searching != prevState.searching) {
      this.getSearchHist();
    }
  }

  async _search(searchWord, searching = false) {
    this.setState({searchWord: searchWord, searching: searching});

    if (searching) {
      //최근 검색 기록
      const old_searchHist = await utils.retrieveData('searchHist');

      if (searchWord && !searchWord.match(',')) {
        //중복 제거 후 최대 7개까지 저장한다. 저장 형식 : ex) 대만,중국,일본
        if (!_.isNull(old_searchHist)) {
          const oldHist = old_searchHist.split(',');
          searchWord = oldHist.includes(searchWord)
            ? old_searchHist
            : searchWord +
              ',' +
              oldHist.slice(0, MAX_HISTORY_LENGTH - 1).join(',');
        }
        utils.storeData('searchHist', searchWord);
      }
    }
  }

  _onPressItem = prodOfCountry => {
    if (this.state.searchWord.length > 0)
      Analytics.trackEvent('Page_View_Count', {
        page: 'Move To Country with Searching',
      });

    this.props.action.product.setProdOfCountry(prodOfCountry);
    this.props.navigation.navigate('Country');
  };

  renderSearchWord() {
    const {searchList, recommendCountry} = this.state;

    const recommendCountryList = recommendCountry
      .map((elm, idx, arr) => ({
        key: elm,
        data: [elm, arr[idx + 1], arr[idx + 2]],
      }))
      .filter((elm, idx) => idx % 3 == 0);

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
          searchList.map((elm, idx) => (
            <TouchableOpacity
              key={idx + ''}
              onPress={() => this._search(elm, true)}>
              <View key={elm} style={styles.searchList}>
                <Text key={'Text'} style={styles.searchListText}>
                  {elm}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={styles.recommendHeader}>
          <Text style={styles.searchListHeaderText}>
            {i18n.t('search:recommend')}
          </Text>
        </View>
        {recommendCountryList.map((elm, idx) => (
          <View key={elm.key} style={styles.recommendRow}>
            {elm.data.map((elm2, idx) =>
              elm2 ? (
                <TouchableOpacity
                  key={elm2}
                  style={styles.recommebdItem}
                  onPress={() => this._search(elm2, true)}>
                  <Text style={styles.recommendText}>{elm2}</Text>
                </TouchableOpacity>
              ) : (
                <View key={idx + ''} style={styles.recommebdEmpty} />
              ),
            )}
          </View>
        ))}
      </View>
    );
  }

  //국가이름 자동완성
  renderSearching() {
    const {allData, searchWord = ''} = this.state;
    if (!allData) {
      return null;
    }

    // 복수국가 이름 검색 추가
    const searchResult = allData
      .filter(elm => elm.length > 0 && elm[0].search.match(searchWord))
      .map(elm => ({
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
            onPress={() => this._search(elm.country, true)}>
            <View key={idx + ''} style={styles.autoList}>
              <Text key="text" style={styles.autoText}>
                {elm.categoryId == API.Product.category.multi
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
      elm => _.isEmpty(searchWord) || elm[0].search.match(searchWord),
    );

    const list = API.Product.toColumnList(filtered);

    return list.length > 0 ? (
      <StoreList data={list} onPress={this._onPressItem} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  headerTitle: {
    width: Math.round(Dimensions.get('window').width),
    flexDirection: 'row',
    alignContent: 'center',
    // marginHorizontal:20,
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
  searchText: {
    //React Native 6.3버전 미만에서 한글로 글을 쓰는 경우 글씨 크기가 오락가락하는 이슈가 발생
    // 글씨크기의 기본값 17로 설정하는 경우 어느정도 해결할 수 있으므로 설정 변경
    // ... appStyles.normal14Text,
    fontSize: 17,
    flex: 1,
    color: colors.black,
  },
  searchList: {
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 25,
  },
  searchListHeader: {
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 25,
    marginTop: 30,
  },
  recommendHeader: {
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 15,
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
    // borderRadius: 3,
    // backgroundColor: colors.white,
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderColor: colors.lightGray,
    // justifyContent:"center",
    // alignItems: "center",
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
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
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

const mapStateToProps = state => ({
  product: state.product,
});

export default connect(
  mapStateToProps,
  dispatch => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
    },
  }),
)(StoreSearchScreen);
