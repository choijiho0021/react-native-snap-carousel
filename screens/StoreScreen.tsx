/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import moment, {Moment} from 'moment';
import React, {Component} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {TabBar, TabView} from 'react-native-tab-view';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import StoreList from '@/components/StoreList';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {
  ProductByCategory,
  RkbProduct,
  TabViewRoute,
  TabViewRouteKey,
} from '@/redux/api/productApi';
import {
  actions as productActions,
  ProductAction,
  ProductModelState,
} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import {HomeStackParamList} from '../navigation/navigation';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.white,
    flex: 1,
  },
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
  tabBarLabel: {
    // height: 17,
    // fontFamily: "AppleSDGothicNeo",
    fontSize: isDeviceSize('small') ? 12 : 14,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0.17,
  },
  showSearchBar: {
    marginRight: 20,
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
  },
  tabStyle: {
    backgroundColor: colors.whiteTwo,
    height: isDeviceSize('small') ? 40 : 60,
  },
  tabBarStyle: {
    backgroundColor: colors.whiteTwo,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
});

type StoreScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Store'
>;

type StoreScreenProps = {
  navigation: StoreScreenNavigationProp;

  product: ProductModelState;

  action: {
    product: ProductAction;
  };
};

type StoreScreenState = {
  index: number;
  routes: TabViewRoute[];
  scene: Record<TabViewRouteKey, ProductByCategory[]>;
  time: Moment;
};

class StoreScreen extends Component<StoreScreenProps, StoreScreenState> {
  offset: number;

  controller: AbortController;

  constructor(props: StoreScreenProps) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        {key: 'asia', title: i18n.t('store:asia'), category: '아시아'},
        {key: 'europe', title: i18n.t('store:europe'), category: '유럽'},
        {key: 'usaAu', title: i18n.t('store:usa/au'), category: '미주/호주'},
        {key: 'multi', title: i18n.t('store:multi'), category: '복수 국가'},
      ],
      scene: {
        asia: [],
        europe: [],
        usaAu: [],
        multi: [],
      },
      time: moment(),
    };

    this.refresh = this.refresh.bind(this);
    this.onIndexChange = this.onIndexChange.bind(this);
    this.onPressItem = this.onPressItem.bind(this);

    this.offset = 0;
    this.controller = new AbortController();
  }

  componentDidMount() {
    const now = moment();

    this.setState({time: now});
    this.refresh();
  }

  shouldComponentUpdate(
    nextProps: StoreScreenProps,
    nextState: StoreScreenState,
  ) {
    return this.props !== nextProps || this.state.index !== nextState.index;
  }

  componentDidUpdate(prevProps: StoreScreenProps) {
    const focus = this.props.navigation.isFocused();
    const now = moment();
    const diff = moment.duration(now.diff(this.state.time)).asMinutes();

    if (diff > 60 && focus) {
      this.setState({time: now});
      this.props.action.product.getProd();
    }

    if (prevProps.product.prodList !== this.props.product.prodList) {
      this.refresh();
    }
  }

  onPressItem = (prodOfCountry: RkbProduct[]) => {
    this.props.action.product.setProdOfCountry(prodOfCountry);
    this.props.navigation.navigate('Country');
  };

  onIndexChange(index: number) {
    Analytics.trackEvent('Page_View_Count', {page: 'Store'});

    this.setState({
      index,
    });
  }

  refresh() {
    const {asia, europe, usaAu, multi} = API.Product.category;
    const {prodList, localOpList} = this.props.product;

    const list = API.Product.getProdGroup({prodList, localOpList});

    const sorted = API.Product.sortProdGroup(localOpList, list);

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppText style={styles.title}>{i18n.t('store')}</AppText>
      ),
      headerRight: () => (
        <AppButton
          key="search"
          style={styles.showSearchBar}
          onPress={() => this.props.navigation.navigate('StoreSearch')}
          iconName="btnSearchTop"
        />
      ),
    });

    this.props.action.product.setSortedProdList(sorted);

    this.setState({
      scene: {
        asia: API.Product.filterByCategory(sorted, asia),
        europe: API.Product.filterByCategory(sorted, europe),
        usaAu: API.Product.filterByCategory(sorted, usaAu),
        multi: API.Product.filterByCategory(sorted, multi),
      },
    });
  }

  renderScene = ({route}: {route: TabViewRoute}) => {
    const data = this.state.scene[route.key];
    return <StoreList data={data} onPress={this.onPressItem} />;
  };

  render() {
    const {index, routes} = this.state;
    return (
      // AppTextInputButton
      <View style={[appStyles.container, {flexGrow: 1}]}>
        <TabView
          style={styles.container}
          navigationState={{index, routes}}
          renderScene={this.renderScene}
          onIndexChange={this.onIndexChange}
          initialLayout={{width: Dimensions.get('window').width, height: 10}}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              tabStyle={styles.tabStyle}
              activeColor={colors.clearBlue} // 활성화 라벨 색
              inactiveColor={colors.warmGrey} // 비활성화 탭 라벨 색
              style={styles.tabBarStyle} // 라벨 TEXT 선택 시 보이는 배경 색
              labelStyle={styles.tabBarLabel} // 라벨 TEXT에 관한 스타일
              indicatorStyle={{backgroundColor: colors.whiteTwo}} // tabbar 선택시 하단의 줄 색
            />
          )}
        />
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
)(StoreScreen);
