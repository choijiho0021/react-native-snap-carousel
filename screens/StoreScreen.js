import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux'
import {appStyles} from "../constants/Styles"
import productApi from '../utils/api/productApi';
import i18n from '../utils/i18n';
import * as productActions from '../redux/modules/product'
import country from '../utils/country'
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

class StoreScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <Text style={styles.title}>{i18n.t('store')}</Text>,
    headerRight: <AppButton key="search" 
      style={styles.showSearchBar} 
      onPress={navigation.getParam('StoreSearch')} 
      iconName="btnSearchTop" />
  })

  constructor(props) {
    super(props)

    this.state = {
      search: undefined,
      index: 0,
      country:"",
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
    this._onChange = this._onChange.bind(this)
    this._navigateToStoreSearch = this._navigateToStoreSearch.bind(this)
    this._onIndexChange = this._onIndexChange.bind(this)
    this._onPressItem = this._onPressItem.bind(this)

    this.offset = 0
    this.controller = new AbortController()
  }

  componentDidMount() {
    const now = moment()

    this.props.navigation.setParams({
      StoreSearch: this._navigateToStoreSearch,
      onChangeText : this._onChangeText('country'),
      search : this._search()
    })

    this.setState({time: now})
    this._refresh()
  }

  componentDidUpdate(prevProps, prevstate){
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

  _navigateToStoreSearch() {
    const {allData} = this.state
    this.props.navigation.navigate('StoreSearch',{allData})
  }

  _onChange = (search) => {
    this.setState({
      search
    })
  }

  _refresh() {
    const { asia, europe, usaAu, multi } = productApi.category,
      prodList = this.props.product.get('prodList'),
      list = []
      
    for(let item of prodList.values()) {
      item.cntry = Set(country.getName(item.ccode))
      item.search = [... item.cntry].join(',')
      //days가 "00일" 형식으로 오기 때문에 일 제거 후 넘버타입으로 변환
      item.pricePerDay = Math.round(item.price / Number(item.days.replace(/[^0-9]/g,"")))
      
      const idxCcode = list.findIndex(elm => elm.length > 0 && _.isEqual(elm[0].ccode, item.ccode))

      if ( idxCcode < 0 ) {
        // new item, insert it
        list.push([item])
      }
      else {
        // 이미 같은 country code를 갖는 데이터가 존재하면, 그 아래에 추가한다. (2차원 배열)
        list[idxCcode].push(item)
      }
    }

    // 동일 국가내의 상품을 정렬한다. 
    const sorted = list.map(item => item.sort((a,b) => a.pricePerDay > b.pricePerDay ? 1 : -1))
      .sort((a,b) => a[0].name > b[0].name ? 1 : -1)

    this.setState({
      allData: sorted,
      asia: this.filterByCategory(sorted, asia, ''),
      europe: this.filterByCategory(sorted, europe, ''),
      usaAu: this.filterByCategory(sorted, usaAu, ''),
      multi: this.filterByCategory(sorted, multi, ''),
    })
  }

  filterByCategory( list, key, searchword) {
    const filtered = list.filter(elm => elm.length > 0 && elm[0].categoryId.includes(key) && 
        (_.isEmpty(searchword) || elm[0].cntry.find(item => item.match(searchword))) )

    return productApi.toColumnList(filtered)
  }

  _onPressItem = (prodOfCountry) => {
    this.props.navigation.navigate('Country',{prodOfCountry})
  }

  _onChangeText = (key) => (value) => {
    this.setState({
      [key] : value
    })
  }

  _search = () => (searchWord) => {
    const {country, index, allData} = this.state
    const key = Object.keys(productApi.category)[index]

    this.setState({
      [key]: this.filterByCategory(allData, productApi.category[key], searchWord == 'all' ? '' : country)
    })
  }

  renderScene = (props) => {
    return <StoreList data={this.state[props.route.key]} jumpTp={props.jumpTo} onPress={this._onPressItem}/>
  }

  _onIndexChange(index) {

    Analytics.trackEvent('Page_View_Count', {page : 'Store'})
    if ( country != '') {
      const key = Object.keys(productApi.category)[this.state.index]
      this.setState({
        country: '',
        [key] : this.filterByCategory(this.state.allData, productApi.category[key], ''),
      })
    }

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
  product : state.product
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      product: bindActionCreators(productActions, dispatch)
    }
})
)(StoreScreen)