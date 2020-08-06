import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux'
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n';
import * as productActions from '../redux/modules/product'
import _ from 'underscore'
import { bindActionCreators } from 'redux'
import { TabView, TabBar } from 'react-native-tab-view';
import { colors } from '../constants/Colors';
import AppButton from '../components/AppButton';
import StoreList from '../components/StoreList';
import moment from 'moment'
import { isDeviceSize } from '../constants/SliderEntry.style';
import Analytics from 'appcenter-analytics'
import { Set } from 'immutable';
import { API, Country } from 'RokebiESIM/submodules/rokebi-utils'

class StoreScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      index: 0,
      routes: [
        { key: 'asia', title: i18n.t('store:asia'), category:'아시아'},
        { key: 'europe', title: i18n.t('store:europe'), category:'유럽' },
        { key: 'usaAu', title: i18n.t('store:usa/au'), category:'미주/호주' },
        { key: 'multi', title: i18n.t('store:multi'), category:'복수 국가' }
      ],
      allData:[],
      asia: [],
      europe: [],
      usaAu: [],
      multi: [],
    }

    this._refresh = this._refresh.bind(this)
    this._onIndexChange = this._onIndexChange.bind(this)
    this._onPressItem = this._onPressItem.bind(this)

    this.offset = 0
    this.controller = new AbortController()
  }

  componentDidMount() {
    const now = moment()

    this.setState({time: now})
    this._refresh()
  }

  componentDidUpdate(prevProps){
    const focus = this.props.navigation.isFocused()
    const now = moment()
    const diff = moment.duration(now.diff(this.state.time)).asMinutes()

    if(diff > 60 && focus) {
      this.setState({time:now})
      this.props.action.product.getProdList()
    }

    if(prevProps.product.prodList != this.props.product.prodList)
    {
      this._refresh()
    }
  }

  _refresh() {
    const { asia, europe, usaAu, multi } = API.Product.category,
      {prodList, localOpList} = this.props.product,
      list = []

    for(let item of prodList.values()) {
      if ( localOpList.has(item.partnerId)) {
        const localOp = localOpList.get(item.partnerId)
        item.ccodeStr = (localOp.ccode || []).join(',')
        item.cntry = Set(Country.getName(localOp.ccode))
        item.search = [... item.cntry].join(',')
        item.pricePerDay = Math.round(item.price / item.days)
        
        const idxCcode = list.findIndex(elm => elm.length > 0 && elm[0].ccodeStr == item.ccodeStr)

        if ( idxCcode < 0 ) {
          // new item, insert it
          list.push([item])
        }
        else {
          // 이미 같은 country code를 갖는 데이터가 존재하면, 그 아래에 추가한다. (2차원 배열)
          list[idxCcode].push(item)
        }
      }
    }

    const getMaxWeight = (list) => Math.max( ... list.map(p => (localOpList.get(p.partnerId) || {}).weight))

    const sorted = list.map(item => item.sort((a,b) => {
      // 동일 국가내의 상품을 정렬한다. 
      // field_daily == true 인 무제한 상품 우선, 사용 날짜는 오름차순 
      if ( a.field_daily ) return b.field_daily ? a.days - b.days : -1
      return b.field_daily ? 1 : a.days - b.days 
    })).sort((a,b) => {
      // 국가는 weight 값이 높은 순서가 우선, weight 값이 같으면 이름 순서
      const weightA = getMaxWeight(a), weightB = getMaxWeight(b)
      return weightA == weightB ? (a[0].search < b[0].search ? -1 : 1) : weightB - weightA
    })

    this.props.navigation.setOptions({
      title: null,
      headerLeft : () =>  (<Text style={styles.title}>{i18n.t('store')}</Text>),
      headerRight: () => (
        <AppButton key="search" 
          style={styles.showSearchBar} 
          onPress={() => this.props.navigation.navigate('StoreSearch')} 
          iconName="btnSearchTop" />
      )
    })

    this.props.action.product.setSortedProdList(sorted)

    this.setState({
      allData: sorted,
      asia: this.filterByCategory(sorted, asia),
      europe: this.filterByCategory(sorted, europe),
      usaAu: this.filterByCategory(sorted, usaAu),
      multi: this.filterByCategory(sorted, multi),
    })
  }

  filterByCategory( list, key) {
    const filtered = list.filter(elm => elm.length > 0 && elm[0].categoryId.includes(key))

    return API.Product.toColumnList(filtered)
  }

  _onPressItem = (prodOfCountry) => {
    this.props.action.product.setProdOfCountry(prodOfCountry)
    this.props.navigation.navigate('Country')
  }

  renderScene = (props) => {
    return <StoreList data={this.state[props.route.key]} jumpTp={props.jumpTo} onPress={this._onPressItem}/>
  }

  _onIndexChange(index) {
    Analytics.trackEvent('Page_View_Count', {page : 'Store'})

    this.setState({
      index,
    })
  }

  render() {

    return (
      //AppTextInput
      <View style={appStyles.container}>
        <TabView 
          style={styles.container}
          navigationState={this.state}
          renderScene={this.renderScene}
          onIndexChange={this._onIndexChange}
          initialLayout={{ width: Dimensions.get('window').width, height:10 }}
          titleStyle={appStyles.normal16Text}
          indicatorStyle={{ backgroundColor: 'white' }}
          renderTabBar={props => (
            <TabBar
              {...props}
              tabStyle={styles.tabStyle}
              activeColor={colors.clearBlue} // 활성화 라벨 색
              inactiveColor={colors.warmGrey} //비활성화 탭 라벨 색
              style={styles.tabBarStyle} // 라벨 TEXT 선택 시 보이는 배경 색
              labelStyle={styles.tabBarLabel} // 라벨 TEXT에 관한 스타일
              indicatorStyle={{backgroundColor:colors.whiteTwo}} //tabbar 선택시 하단의 줄 색
            />
          )}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor:colors.white,
    flex:1,
  },
  title: {
    ... appStyles.title,
    marginLeft: 20,
  },
  tabBar : {
    // height: 52,
    backgroundColor: colors.whiteTwo
  },
  tabBarLabel: {
    // height: 17,
    // fontFamily: "AppleSDGothicNeo",
    fontSize: isDeviceSize('small') ? 12 : 14 ,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0.17,
  },
  showSearchBar : {
    marginRight:20,
    justifyContent:"flex-end",
    backgroundColor:colors.white
  },
  tabStyle: {
    backgroundColor:colors.whiteTwo,
    height: isDeviceSize('small') ? 40 : 60  ,
  },
  tabBarStyle : {
    backgroundColor:colors.whiteTwo,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  price : {
    flexDirection: 'row',
    alignItems:"center"
  }
});

const mapStateToProps = (state) => ({
  product : state.product.toObject()
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      product: bindActionCreators(productActions, dispatch)
    }
})
)(StoreScreen)