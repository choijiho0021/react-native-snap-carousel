import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {connect} from 'react-redux'
import {appStyles} from "../constants/Styles"
import productApi from '../utils/api/productApi';
import i18n from '../utils/i18n';
import utils from '../utils/utils';
import * as productActions from '../redux/modules/product'
import api from '../utils/api/api'
import country from '../utils/country'
import _ from 'underscore'
import { bindActionCreators } from 'redux'
import { TabView, TabBar } from 'react-native-tab-view';
import { colors } from '../constants/Colors';
import AppButton from '../components/AppButton';
import StoreList from '../components/StoreList';
import AppActivityIndicator from '../components/AppActivityIndicator';
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
      querying: false,
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
  }

  componentDidMount() {
    this.props.navigation.setParams({
      StoreSearch: this._navigateToStoreSearch,
      onChangeText : this._onChangeText('country'),
      search : this._search()
    })
    this._refresh()
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
      {prodList} = this.props.product,
      list = prodList.reduce((acc,item) => {
        item.key = item.uuid 
        item.cntry = new Set(country.getName(item.ccode))
        //days가 "00일" 형식으로 오기 때문에 일 제거 후 넘버타입으로 변환
        item.pricePerDay = Math.round(item.price / Number(item.days.slice(0,-1)))

        const idxCcode = acc.findIndex(elm => item.categoryId == multi ? elm.uuid == item.uuid : elm.ccode == item.ccode)

        if ( idxCcode < 0) {
          // new item, insert it
          return acc.concat( [item])
        }
        else if ( acc[idxCcode].pricePerDay > item.pricePerDay) {
          // cheaper
          acc.splice( idxCcode, 1, item)
          // console.log("acc3",acc)
          return acc
        }
        else if ( idxCcode >= 0 && item.categoryId == multi) {
          country.getName(item.ccode).map(elm => acc[idxCcode].cntry = acc[idxCcode].cntry.add(elm))
          acc[idxCcode].ccode = 'multi'
        }
        return acc
      }, [])
    
    this.setState({
      allData: list,
      asia: this.filterByCategory(list, asia, ''),
      europe: this.filterByCategory(list, europe, ''),
      usaAu: this.filterByCategory(list, usaAu, ''),
      multi: this.filterByCategory(list, multi, ''),
    })
  }

  filterByCategory( list, key, searchword) {
    return list.filter(elm => 
      elm.categoryId.findIndex(idx => idx == key) >= 0 &&
      (_.isEmpty(searchword) ? true : !_.isUndefined(elm.cntry.find(item => item.match(searchword))))) 
      .map((elm,idx,arr) => ({key:elm.ccode, data:[elm,arr[idx+1]] }))
      .filter((elm,idx) => idx % 2 == 0)
  }
 
  _onPressItem = (key) => {
    const {allData} = this.state
    const country = this.state.allData.filter(elm => elm.uuid == key)[0]
    this.props.action.product.selectCountry({uuid: key})
    this.props.navigation.navigate('Country',{allData:allData,title:country.categoryId == productApi.category.multi ? country.name : country.cntry.values().next().value})
  }

  /*
  _renderHeader = (props) => (
    this.state.showSearchBar && 
    <SearchBar platform={Platform.OS} 
      onChangeText={this._onChange}
      clearIcon
      onEndEditing={() => this._refresh('all','all',true)}
      value={this.state.search}
      />
  )
  */

  /*
  _onScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y

    console.log("offset",currentOffset)
    // if ( this.state.showSearchBar == false && currentOffset < -20) {
    //   this.setState({
    //     showSearchBar : true
    //   })
    // }
    if ( this.state.showSearchBar && currentOffset > 20) {
      this.setState({
        showSearchBar : false
      })
    }
  }
  */

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
    const {country, querying} = this.state

    return (
      //AppTextInput
      <View style={appStyles.container}>
        <AppActivityIndicator visible={querying} />
        <TabView 
          style={styles.container} 
          navigationState={this.state}
          renderScene={this.renderScene}
          onIndexChange={this._onIndexChange}
          initialLayout={{ width: Dimensions.get('window').width, height:10 }}
          titleStyle={appStyles.normal14Text}
          indicatorStyle={{ backgroundColor: 'white' }}
          renderTabBar={props => (
            <TabBar
              {...props}
              tabStyle={styles.tabStyle}
              activeColor={colors.clearBlue} // 활성화 라벨 색
              inactiveColor={colors.warmGrey} //비활성화 탭 라벨 색
              style={{backgroundColor:colors.whiteTwo}} // 라벨 TEXT 선택 시 보이는 배경 색
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
    flex:1
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
      height: 17,
      // fontFamily: "AppleSDGothicNeo",
      fontSize: 14,
      fontWeight: "500",
      fontStyle: "normal",
      letterSpacing: 0.17
  },
  showSearchBar : {
    marginRight:20,
    justifyContent:"flex-end",
    backgroundColor:colors.white
  },
  tabStyle: {
    backgroundColor:colors.whiteTwo,
    height:60,
    alignItems:"flex-start",
    paddingLeft:20
  },
  price : {
    flexDirection: 'row',
    alignItems:"center"
  }
});

const mapStateToProps = (state) => ({
  product : state.product.toJS()
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      product: bindActionCreators(productActions, dispatch)
    }
})
)(StoreScreen)