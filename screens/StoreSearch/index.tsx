/* eslint-disable no-param-reassign */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {Component, memo, useEffect, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {AppEventsLogger} from 'react-native-fbsdk';
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
          onSubmitEditing={() => search(word)}
          onChangeText={(value: string) => {
            search(value);
            setWord(value);
          }}
          value={word}
        />

        {word.length > 0 && (
          <View style={{flexDirection: 'row'}}>
            <AppButton
              style={[styles.showSearchBar, {paddingRight: 20}]}
              onPress={() => search('')}
              iconName="btnSearchCancel"
            />
            <View style={styles.divider} />
          </View>
        )}
        <AppButton
          style={styles.showSearchBar}
          onPress={() => search(word)}
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
      searchWord: '',
    };

    this.headerRef = React.createRef<HeaderTitleRef>();
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    Analytics.trackEvent('Page_View_Count', {page: 'Country Search'});

    this.props.navigation.setOptions({
      title: null,
      headerLeft: null,
      headerTitle: () => (
        <HeaderTitle search={this.search} headerRef={this.headerRef} />
      ),
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

  async search(searchWord: string) {
    this.setState({searchWord});
    this.headerRef?.current?.changeValue(searchWord);
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
    return <View style={styles.mainContainer}>{this.renderStoreList()}</View>;
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
