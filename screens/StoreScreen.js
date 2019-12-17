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
import AppActivityIndicator from '../components/AppActivityIndicator';

class CountryItem extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps) {
    // ccode 목록이 달라지면, 다시 그린다. 
    const oldData = this.props.item.data,
      newData = nextProps.item.data

    return newData.findIndex((elm,idx) => _.isEmpty(oldData[idx]) || elm == undefined  ? true : elm.ccode != oldData[idx].ccode) >= 0
  }

  render() {
    const {item} = this.props

    return (
      <View key={item.key} style={styles.productList}>
        {item.data.map((elm,idx) => (
            // 1개인 경우 사이 간격을 맞추기 위해서 width를 image만큼 넣음
          elm ? <View key={elm.ccode + idx} style={{flex:1, marginLeft:idx == 1 ? 14 : 0}}>
            <TouchableOpacity onPress={() => this.props.onPress && this.props.onPress(elm.uuid)}>
              <Image key={"img"} source={{uri:api.httpImageUrl(elm.imageUrl == '' ? elm.subImageUrl : elm.imageUrl)}} style={styles.image}/>
              {/* cntry가 Set이므로 첫번째 값을 가져오기 위해서 values().next().value를 사용함 */}
              <Text key={"cntry"} style={[appStyles.bold14Text,{marginVertical:11}]}>{elm.categoryId == productApi.category.multi ? elm.name : elm.cntry.values().next().value}</Text>
              <View style={{flexDirection: 'row',justifyContent: 'space-between',alignContent:"center"}}>
                <View style={{flexDirection: 'row',alignItems:"center"}}>
                  <Text key={"price"} style={[appStyles.normal20Text,styles.text]}>{utils.numberToCommaString(elm.pricePerDay)}</Text> 
                  <Text key={"days"} style={[appStyles.normal16Text,styles.text]}>{` ${i18n.t('won')}/Day`}</Text>
                </View>
                <View style={styles.lowPriceView}>
                  <Text style={styles.lowPrice}>{i18n.t('lowest')}</Text>
                </View>
              </View>
            </TouchableOpacity> 
          </View> : <View key="unknown" style={{flex:1}}/>
        ))}
      </View>
    )
  }
}

class StoreList extends Component {
  constructor(props) {
    super(props)

    this._renderItem = this._renderItem.bind(this)
  }

  shouldComponentUpdate( nextProps) {
    return this.props.data != nextProps.data
  }

  _renderItem = ({item}) => {
    return _.isEmpty(item) ? {ccode:'nodata'} : <CountryItem onPress={this.props.onPress} item={item}/>
  }

  render() {
    const {data} = this.props

    return (
      <View style={appStyles.container} >
        <FlatList style={styles.container} 
          data={data} 
          renderItem={this._renderItem}
          windowSize={6}
          // ListHeaderComponent={this._renderHeader}
          // refreshing={refreshing}
          // onScroll={this._onScroll}
          // extraData={index}
          // onRefresh={() => this._refresh(true)}
        />
      </View>
    )
  }
}

// class HeaderTitle extends Component {
//   constructor(props) {
//     super(props)

//     this.state = {
//       searching : false
//     }

//   }

//   shouldComponentUpdate(nextProps,nextState){
//     return nextState.searching != this.state.searching
//   }

//   _searching(searching = true) {
//     const {search} = this.props

//     if(!searching) {
//       search('all')
//     }

//     this.setState({
//       searching:searching
//     })
//   }
 
  
//   onFocus() {
//     this.searchBox.setNativeProps({
//       style: { borderColor: colors.black}
//     })
//   }

//   onBlur() {
//     this.searchBox.setNativeProps({
//       style: { borderColor: colors.lightGrey}
//     })
//   }

//   render() {
//     const {searching} = this.state
//     const {search, onChangeText} = this.props

//     return (
//       <View style={styles.headerTitle}>
//         {searching ? 
//         <View style={styles.headerTitle}>
//           <View ref={searchBox => { this.searchBox = searchBox}} style={styles.searchBox}>
//             <TextInput 
//               ref={input => { this.textInput = input}}
//               onBlur={ () => this.onBlur() }
//               onFocus={ () => this.onFocus() }
//               style={styles.searchText}
//               placeholder={i18n.t('store:search')}
//               returnKeyType='search'
//               // clearTextOnFocus={true}
//               enablesReturnKeyAutomatically={true}
//               onSubmitEditing={() => search()}
//               onChangeText={(value) => onChangeText(value)}
//               />
//             <AppButton style = {styles.showSearchBar} onPress={() => search()} iconName="btnSearchOff" />
//           </View>
//           <AppButton style = {styles.showSearchBar} onPress={() => this._searching(false)} title={i18n.t('cancel')} titleStyle={styles.titleStyle} />
//         </View> : <View style={styles.headerTitle}>
//             <Text style={styles.title}>{i18n.t('store')}</Text>
//             <AppButton style = {styles.showSearchBar} onPress={() => this._searching(true)} iconName="btnSearchTop" />
//           </View>
//           }
          
//       </View> 
//     )
//   }
// }

class StoreScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <Text style={styles.title}>{i18n.t('store')}</Text>,
    headerRight: <AppButton key="search" 
      style={styles.showSearchBar} 
      onPress={navigation.getParam('StoreSearch')} 
      iconName="btnSearchTop" />
    // headerTitle : <HeaderTitle search={params.search} onChangeText={params.onChangeText} params={params}/>
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
        { key: 'multi', title: i18n.t('store:multi'), category:'복수 국가' },
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
        item.pricePerDay = (item.price / Number(item.days)).toFixed(0)

        const idxCcode = acc.findIndex(elm => item.categoryId == multi ? elm.uuid == item.uuid : elm.ccode == item.ccode)
        if ( idxCcode < 0) {
          // new item, insert it
          return acc.concat( [item])
        }
        else if ( acc[idxCcode].pricePerDay > item.pricePerDay) {
          // cheaper
          acc.splice( idxCcode, 1, item)
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
          renderTabBar={props => (
            <TabBar
              {...props}
              tabStyle={styles.tabStyle}
              activeColor={colors.clearBlue}
              inactiveColor={colors.warmGrey}
              labelStyle={styles.tabBarLabel}
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
  overlay: {
    backgroundColor:'rgba(0,0,0,0.5)',
    height: 80,
  },
  flag: {
    paddingVertical: 20,
    width: "10%"
  },
  text: {
    textAlign: "left",
    color:colors.clearBlue
  },
  image: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
    borderRadius:10
  },
  divider: {
    height: 1,
    backgroundColor: colors.black,
    marginBottom:32,
    marginTop:12,
    marginHorizontal:20
  },
  tabBar : {
    // height: 52,
    backgroundColor: colors.whiteTwo
  },
  textInput :{
    height: 19,
    // fontFamily: "AppleSDGothicNeo",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 19,
    letterSpacing: 0.15,
    color: "#aaaaaa",
    marginTop:20,
    marginHorizontal:40,
    flex:1
  },
  productList : {
    flexDirection: 'row',
    marginTop:20,
    marginBottom:10,
    marginHorizontal:20
  },
  tabBarLabel: {
      height: 17,
      // fontFamily: "AppleSDGothicNeo",
      fontSize: 14,
      fontWeight: "500",
      fontStyle: "normal",
      letterSpacing: 0.17
  },
  searchButton:{
    justifyContent:'flex-end'
  },
  showSearchBar : {
    marginRight:20,
    justifyContent:"flex-end",
    backgroundColor:colors.white
  },
  titleStyle: {
    ... appStyles.headerTitle
  },
  searchBox : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent:"center",
    flex:1,
    marginHorizontal:20,
    height: 40,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.lightGrey
  },
  searchText : {
    ... appStyles.normal14Text,
    marginLeft:20,
    flex:1
  },
  headerTitle : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent:"center",
    flex : 1
  },
  tabStyle: {
    backgroundColor:colors.whiteTwo,
    height:60,
    alignItems:"flex-start",
    paddingLeft:20
  },
  from: {
    ... appStyles.normal14Text,
    textAlign: "left",
    color:colors.warmGrey,
    marginBottom:1
  },
  lowPrice : {
    ... appStyles.normal12Text,
    color : colors.black
  },
  lowPriceView : {
    width: 41,
    height: 22,
    borderRadius: 1,
    backgroundColor: colors.whiteTwo,
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