import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import {connect} from 'react-redux';
import {appStyles} from '../constants/Styles';
import i18n from '../utils/i18n';
import * as productActions from '../redux/modules/product';
import _ from 'underscore';
import {bindActionCreators} from 'redux';
import {TabView, TabBar} from 'react-native-tab-view';
import {colors} from '../constants/Colors';
import AppButton from '../components/AppButton';
import StoreList from '../components/StoreList';
import moment from 'moment';
import {isDeviceSize} from '../constants/SliderEntry.style';
import Analytics from 'appcenter-analytics';
import {Set} from 'immutable';
import {API, Country} from 'Rokebi/submodules/rokebi-utils';
import {sliderWidth, windowHeight} from '../constants/SliderEntry.style';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import withBadge from '../components/withBadge';

const size =
  windowHeight > 810
    ? {
        userInfoHeight: 110,
        userInfoMarginTop: 30,
        userPic: 60,
        carouselHeight: 225,
        carouselMargin: 0,
      }
    : {
        userInfoHeight: 96,
        userInfoMarginTop: 20,
        userPic: 50,
        carouselHeight: 190,
        carouselMargin: 20,
      };

const DOT_MARGIN = 6;
const INACTIVE_DOT_WIDTH = 6;
const ACTIVE_DOT_WIDTH = 20;

const BadgeAppButton = withBadge(
  ({notReadNoti}) => notReadNoti,
  {badgeStyle: {right: -3, top: 0}},
  state => ({
    notReadNoti: state.noti.get('notiList').filter(elm => elm.isRead == 'F')
      .length,
  }),
)(AppButton);

class PromotionImage extends PureComponent {
  render() {
    const {item} = this.props;
    return (
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => this.props.onPress(item)}>
        {_.isEmpty(item.imageUrl) ? (
          <Text style={styles.text}>{item.title}</Text>
        ) : (
          <Image
            source={{uri: API.default.httpImageUrl(item.imageUrl)}}
            style={{height: size.carouselHeight}}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    );
  }
}

class HomeScreenEsim extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      activeSlide: 0,
      routes: [
        {key: 'asia', title: i18n.t('store:asia'), category: '아시아'},
        {key: 'europe', title: i18n.t('store:europe'), category: '유럽'},
        {key: 'usaAu', title: i18n.t('store:usa/au'), category: '미주/호주'},
        {key: 'multi', title: i18n.t('store:multi'), category: '복수 국가'},
      ],
      allData: [],
      asia: [],
      europe: [],
      usaAu: [],
      multi: [],
    };

    this._refresh = this._refresh.bind(this);
    this._onIndexChange = this._onIndexChange.bind(this);
    this._onPressItem = this._onPressItem.bind(this);
    this._onPressPromotion = this._onPressPromotion.bind(this);
    this._renderPromotion = this._renderPromotion.bind(this);
    this._renderDots = this._renderDots.bind(this);

    this.offset = 0;
    this.controller = new AbortController();
  }

  componentDidMount() {
    const now = moment();

    this.setState({time: now});
    this._refresh();
  }

  componentDidUpdate(prevProps) {
    const focus = this.props.navigation.isFocused();
    const now = moment();
    const diff = moment.duration(now.diff(this.state.time)).asMinutes();

    if (diff > 60 && focus) {
      this.setState({time: now});
      this.props.action.product.getProdList();
    }

    if (prevProps.product.prodList != this.props.product.prodList) {
      this._refresh();
    }
  }

  _refresh() {
    const {asia, europe, usaAu, multi} = API.Product.category,
      {prodList, localOpList} = this.props.product,
      list = [];

    for (let item of prodList.values()) {
      if (localOpList.has(item.partnerId)) {
        const localOp = localOpList.get(item.partnerId);
        item.ccodeStr = (localOp.ccode || []).join(',');
        item.cntry = Set(Country.getName(localOp.ccode));
        item.search = [...item.cntry].join(',');
        item.pricePerDay = Math.round(item.price / item.days);

        const idxCcode = list.findIndex(
          elm => elm.length > 0 && elm[0].ccodeStr == item.ccodeStr,
        );

        if (idxCcode < 0) {
          // new item, insert it
          list.push([item]);
        } else {
          // 이미 같은 country code를 갖는 데이터가 존재하면, 그 아래에 추가한다. (2차원 배열)
          list[idxCcode].push(item);
        }
      }
    }

    const getMaxWeight = list =>
      Math.max(...list.map(p => (localOpList.get(p.partnerId) || {}).weight));

    const sorted = list
      .map(item =>
        item.sort((a, b) => {
          // 동일 국가내의 상품을 정렬한다.
          // field_daily == true 인 무제한 상품 우선, 사용 날짜는 오름차순
          if (a.field_daily) return b.field_daily ? a.days - b.days : -1;
          return b.field_daily ? 1 : a.days - b.days;
        }),
      )
      .sort((a, b) => {
        // 국가는 weight 값이 높은 순서가 우선, weight 값이 같으면 이름 순서
        const weightA = getMaxWeight(a),
          weightB = getMaxWeight(b);
        return weightA == weightB
          ? a[0].search < b[0].search
            ? -1
            : 1
          : weightB - weightA;
      });

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <Text style={styles.title}>{i18n.t('appTitle')}</Text>,
      headerRight: () => (
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <AppButton
            key="search"
            style={styles.btnSearchBar}
            onPress={() => this.props.navigation.navigate('StoreSearch')}
            iconName="btnSearchTop"
          />

          <AppButton
            key="cnter"
            style={styles.btnCnter}
            onPress={() => this.props.navigation.navigate('Contact')}
            iconName="btnCnter"
          />

          {/* //BadgeAppButton을 사용했을 때 위치가 변동됨 수정이 필요함 */}
          <BadgeAppButton
            key="alarm"
            style={styles.btnAlarm}
            onPress={() =>
              this.props.navigation.navigate('Noti', {mode: 'noti'})
            }
            iconName="btnAlarm"
          />
        </View>
      ),
    });

    this.props.action.product.setSortedProdList(sorted);

    this.setState({
      allData: sorted,
      asia: this.filterByCategory(sorted, asia),
      europe: this.filterByCategory(sorted, europe),
      usaAu: this.filterByCategory(sorted, usaAu),
      multi: this.filterByCategory(sorted, multi),
    });
  }

  filterByCategory(list, key) {
    const filtered = list.filter(
      elm => elm.length > 0 && elm[0].categoryId.includes(key),
    );

    return API.Product.toColumnList(filtered);
  }

  _onPressItem = prodOfCountry => {
    this.props.action.product.setProdOfCountry(prodOfCountry);
    this.props.navigation.navigate('Country');
  };

  renderScene = props => {
    return (
      <StoreList
        data={this.state[props.route.key]}
        jumpTp={props.jumpTo}
        onPress={this._onPressItem}
      />
    );
  };

  _onIndexChange(index) {
    Analytics.trackEvent('Page_View_Count', {page: 'Store'});

    this.setState({
      index,
    });
  }

  _renderPromotion({item}) {
    return <PromotionImage item={item} onPress={this._onPressPromotion} />;
  }

  _pagination() {
    const {activeSlide} = this.state,
      {promotion} = this.props;

    return (
      <View style={styles.pagination}>
        <Pagination
          dotsLength={promotion.length}
          activeDotIndex={activeSlide}
          containerStyle={styles.paginationContainer}
          renderDots={this._renderDots}
        />
      </View>
    );
  }

  _renderDots(activeIndex) {
    const {promotion} = this.props,
      duration = 200,
      width = new Animated.Value(INACTIVE_DOT_WIDTH),
      margin = width.interpolate({
        inputRange: [INACTIVE_DOT_WIDTH, ACTIVE_DOT_WIDTH],
        outputRange: [ACTIVE_DOT_WIDTH, INACTIVE_DOT_WIDTH],
      });

    Animated.timing(width, {
      toValue: ACTIVE_DOT_WIDTH,
      duration,
      useNativeDriver: false,
    }).start();

    if (activeIndex == 0) {
      return promotion.map((_, idx) =>
        idx == 0 ? (
          <Animated.View key={idx + ''} style={styles.dot(width, margin)} />
        ) : (
          <View key={idx + ''} style={styles.inactiveDot} />
        ),
      );
    }

    return promotion.map((_, idx) =>
      activeIndex == idx ? (
        <Animated.View
          key={idx + ''}
          style={styles.dot(width, DOT_MARGIN, colors.clearBlue)}
        />
      ) : activeIndex == (idx + 1) % promotion.length ? (
        <Animated.View
          key={idx + ''}
          style={styles.dot(margin, DOT_MARGIN, colors.lightGrey)}
        />
      ) : (
        <View key={idx + ''} style={styles.inactiveDot} />
      ),
    );
  }

  _onPressPromotion(item) {
    if (item.product_uuid) {
      const prodList = this.props.product.prodList,
        prod = prodList.get(item.product_uuid);

      if (prod) {
        const prodOfCountry = prodList
          .filter(item => _.isEqual(item.partnerId, prod.partnerId))
          .toList()
          .toArray();
        this.props.navigation.navigate('Country', {prodOfCountry});
      }
    } else if (item.notice) {
      this.props.navigation.navigate('SimpleText', {
        key: 'noti',
        title: i18n.t('set:noti'),
        bodyTitle: item.notice.title,
        text: item.notice.body,
        mode: 'text',
      });
    }
  }

  render() {
    return (
      <View style={appStyles.container}>
        <View style={styles.carousel}>
          <Carousel
            data={this.props.promotion}
            renderItem={this._renderPromotion}
            autoplay={true}
            loop={true}
            lockScrollWhileSnapping={true}
            useScrollView={true}
            onSnapToItem={index => this.setState({activeSlide: index})}
            sliderWidth={sliderWidth}
            itemWidth={sliderWidth}
          />
          {this._pagination()}
        </View>
        <View style={appStyles.container}>
          <TabView
            style={styles.container}
            navigationState={this.state}
            renderScene={this.renderScene}
            onIndexChange={this._onIndexChange}
            initialLayout={{width: Dimensions.get('window').width, height: 10}}
            titleStyle={appStyles.normal16Text}
            indicatorStyle={{backgroundColor: 'white'}}
            renderTabBar={props => (
              <TabBar
                {...props}
                tabStyle={styles.tabStyle}
                activeColor={colors.clearBlue} // 활성화 라벨 색
                inactiveColor={colors.warmGrey} //비활성화 탭 라벨 색
                style={styles.tabBarStyle} // 라벨 TEXT 선택 시 보이는 배경 색
                labelStyle={styles.tabBarLabel} // 라벨 TEXT에 관한 스타일
                indicatorStyle={{backgroundColor: colors.whiteTwo}} //tabbar 선택시 하단의 줄 색
              />
            )}
          />
        </View>
      </View>
    );
  }
}

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
  tabBar: {
    // height: 52,
    backgroundColor: colors.whiteTwo,
  },
  tabBarLabel: {
    // height: 17,
    // fontFamily: "AppleSDGothicNeo",
    fontSize: isDeviceSize('small') ? 12 : 14,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0.17,
  },
  btnSearchBar: {
    width: 40,
    height: 40,
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
  price: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carousel: {
    alignItems: 'flex-end',
    height: size.carouselHeight,
    backgroundColor: colors.white,
  },
  btnAlarm: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  btnCnter: {
    width: 40,
    height: 40,
    marginHorizontal: 18,
  },
  pagination: {
    marginRight: 30,
    marginTop: 10,
  },
  paginationContainer: {
    paddingVertical: 5,
    paddingHorizontal: 0,
    justifyContent: 'flex-start',
  },
  dot: (
    width = ACTIVE_DOT_WIDTH,
    marginLeft = DOT_MARGIN,
    backgroundColor = colors.clearBlue,
  ) => ({
    height: 6,
    borderRadius: 3.5,
    width,
    marginLeft,
    backgroundColor,
  }),
  inactiveDot: {
    width: INACTIVE_DOT_WIDTH,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.lightGrey,
    marginLeft: DOT_MARGIN,
  },
});

const mapStateToProps = state => ({
  product: state.product.toObject(),
  promotion: state.promotion.get('promotion'),
});

export default connect(
  mapStateToProps,
  dispatch => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
    },
  }),
)(HomeScreenEsim);
