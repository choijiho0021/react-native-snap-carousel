import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import {connect} from 'react-redux'
import {appStyles} from "../constants/Styles"
import productApi from '../utils/api/productApi';
import * as productActions from '../redux/modules/product'
import i18n from '../utils/i18n';
import utils from '../utils/utils';
import _ from 'underscore'
import { bindActionCreators } from 'redux'
import { colors } from '../constants/Colors';
import AppButton from '../components/AppButton';
import AppActivityIndicator from '../components/AppActivityIndicator';
import StoreList from '../components/StoreList';
import { sliderWidth, windowHeight } from '../constants/SliderEntry.style'

// windowHeight
// iphone 6, 7, 8 - 375 x 667 points
// iphone 6, 7, 8 Plus - 414 x 736 points
// iphone 11 pro - 375 x 812 points
// iphone 11, pro max - 414 x 896 points
const SIZE_NORMAL = 'normal'
const SIZE_PLUS = 'plus'
const ELSE = 'else'

const size = windowHeight == 667 || windowHeight == 812 ? SIZE_NORMAL : 
             windowHeight == 736 || windowHeight == 896 ? SIZE_PLUS : ELSE


const MAX_HISTORY_LENGTH = 7
class HeaderTitle extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searching : false,
      searchWord : ''
    }
  }

  shouldComponentUpdate(nextProps,nextState){
    return (nextState.searchWord != this.state.searchWord || this.props.searchWord != nextProps.searchWord || this.props.navigation != nextProps.navigation )
  }

  componentDidUpdate(prevProps) {
    if ( this.props.searchWord && this.props.searchWord != prevProps.searchWord) {
      this.setState({
        searchWord: this.props.searchWord
      })
    }
  }
 
  _onChangeText = (key) => (value) => {
    this.setState({
      [key] : value
    })
    this.props._search(value,false);
  }

  async search(searchWord) {
    const old_searchHist = await utils.retrieveData("searchHist")

    if(searchWord && !searchWord.match(',')){
      //중복 제거 후 최대 7개까지 저장한다. 저장 형식 : ex) 대만,중국,일본 
      const new_searchHist = _.isNull(old_searchHist) ? searchWord : Array.from(new Set([searchWord].concat(old_searchHist.split(',')))).slice(0,MAX_HISTORY_LENGTH).join(',')
      utils.storeData("searchHist", new_searchHist)
    }
    this.setState({searching:true})
    this.props._search(searchWord,true);
  }

  render() {
    const {searchWord} = this.state
    const {navigation} = this.props

    return (
      <View style={styles.container}>
        <View style={styles.headerTitle}>
          <TouchableWithoutFeedback onPress={() => navigation.navigation.goBack()}>
            <View style={styles.backButton}>
              <Image style={{marginLeft: 5}} source={require('../assets/images/header/btnBack.png')} />
            </View>
          </TouchableWithoutFeedback>
          <TextInput
            style={styles.searchText}
            placeholder={i18n.t('store:search')}
            returnKeyType='search'
            enablesReturnKeyAutomatically={true}
            clearButtonMode = 'always'
            onSubmitEditing={() => this.search(searchWord)}
            onChangeText={this._onChangeText('searchWord')}
            value={searchWord}
            />
          <AppButton style = {styles.showSearchBar} onPress={() => this.search(searchWord)} iconName="btnSearchOff" />
        </View>
        <View style={styles.titleBottom}/>
      </View>
    )
  }
}

class StoreSearchScreen extends Component {
  static navigationOptions = (navigation) => {
    const {params = {}} = navigation.navigation.state

    return {
      headerLeft: null,
      headerTitle : <HeaderTitle _search={params._search} searchWord={params.searchWord} navigation={navigation}/>
    }
}

  constructor(props) {
    super(props)

    this.state = {
      querying: false,
      searching : false,
      searchWord : '',
      searchList : [],
      recommendCountry : ["인도네시아","스페인","아일랜드","네덜란다"]
    }
    this._search = this._search.bind(this)
  }

  componentDidMount() {
    const allData = this.props.navigation.getParam('allData')

    this.setState({allData})
    this.getSearchHist()

    this.props.navigation.setParams({
      searchWord : this.state.searchWord,
      _search: this._search
    })
  }

  async getSearchHist() {
    const searchHist = await utils.retrieveData("searchHist")
    //searchHist 저장 형식 : ex) 대만,중국,일본 
    const searchList = _.isNull(searchHist) ? [] : searchHist.split(',').slice(0,7)
    this.setState({searchList:searchList})
  }

  componentDidUpdate(prevProps, prevState) {
    if ( this.state.searchWord && this.state.searchWord != prevState.searchWord) {
      this.props.navigation.setParams({
        searchWord : this.state.searchWord
      })
    }

    if(this.state.searching != prevState.searching){
      this.getSearchHist()
    }
  }
  
  _search(searchWord, searching = false) {
    this.setState({searchWord : searchWord, searching : searching})
  }

  _onPressItem = (key) => {
    const country = this.state.allData.filter(elm => elm.uuid == key)[0]

    this.props.action.product.selectCountry({uuid: key})
    this.props.navigation.navigate('Country',{title:country.categoryId == productApi.category.multi ? country.name : country.cntry.values().next().value})
  }

  renderSearchWord() {
    const {searchList}= this.state

    return (
      <View style={styles.width100}>
        {/* 최근 검색 */}
        <View style={styles.searchListHeader}>
          <Text style={styles.searchListHeaderText}>{i18n.t('search:list')}</Text>
        </View>
        {_.isEmpty(searchList) ? <View style={styles.noList}> 
          <Text style={styles.searchListText}> {i18n.t('search:err')} </Text>
        </View> : searchList.map((elm,idx) => (
          <TouchableOpacity key={idx+''} onPress={() => this._search(elm,true)}>
            <View key={elm} style={styles.searchList}>
              <Text key={"Text"} style={styles.searchListText}>{elm}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  // 인기국가
  renderRecommend() {
    const { recommendCountry} = this.state
    
    const recommendCountryList = recommendCountry.map((elm, idx, arr) => 
      ({key : elm, data:[elm, arr[idx+1], arr[idx+2]]})).filter((elm, idx) => idx % 3 == 0 )

    return (
      <View style={styles.width100}>
      <View style={styles.recommendHeader}>
        <Text style={styles.searchListHeaderText}>{i18n.t('search:recommend')}</Text>
      </View>
      {recommendCountryList.map((elm,idx )=> 
          <View key={elm.key} style={styles.recommendRow}>
            {elm.data.map((elm2,idx) => 
              elm2 ? <TouchableOpacity key={elm2} style={styles.recommebdItem} onPress={() => this._search(elm2,true)}>
                      <Text style={styles.recommendText}>{elm2}</Text>
                </TouchableOpacity> : <View key={idx+''}style={styles.recommebdEmpty}/>)}
          </View>
        )}
    </View>
    )
  }

  //국가이름 자동완성
  renderSearching() {
    const {allData, searchWord = ''} = this.state
    if(!allData) { return null }

    // 복수국가 검색제외
    // const searchResult = allData.filter(elm => 
    //   elm.categoryId != productApi.category.multi && [...elm.cntry].join(',').match(searchWord)).map(elm => 
    //     {return {name:elm.name, country:elm.cntry, uuid:elm.uuid}})

    // return (
    // <View style={styles.width100}>
    //   {searchResult.map((elm,idx) => 
    //     <TouchableOpacity key={elm.uuid} onPress={() => this._search(elm.country.values().next().value,true)}>
    //       <View key={idx+''} style={styles.autoList}>
    //         <Text key="text">{elm.country.values().next().value}</Text>
    //       </View>
    //     </TouchableOpacity>
    //   )}
    // </View>
    // )

    // 복수국가 이름 검색 추가
    const searchResult = allData.filter(elm => 
      [...elm.cntry].join(',').match(searchWord)).map(elm => 
        {return {name:elm.name, country:elm.cntry, categoryId: elm.categoryId, uuid:elm.uuid}})

    return (
    <View style={styles.width100}>
      {searchResult.map((elm,idx) => 
        <TouchableOpacity key={elm.uuid} onPress={() => this._search(elm.country.values().next().value,true)}>
          <View key={idx+''} style={styles.autoList}>
            <Text key="text" style={styles.autoText}>{elm.categoryId == productApi.category.multi ? elm.name : elm.country.values().next().value}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
    )
  }

  // 국가 검색
  renderStoreList () {
    const {allData, searchWord = ''} = this.state
    const list = this.filterBySearchWord(allData, searchWord)

    if(list.length < 1) {
      return (<View style={styles.emptyViewPage}><Text style={styles.emptyPage}>{i18n.t('country:empty')}</Text></View>)
    }
    return <StoreList data={list} onPress={this._onPressItem}/>
  }

  filterBySearchWord( list, searchWord) {
    return list.filter(elm => (_.isEmpty(searchWord) ? true : (elm.categoryId[0] == productApi.category.multi && elm.name.match(searchWord)) || [...elm.cntry].join(',').match(searchWord)))
      .map((elm,idx,arr) => ({key:elm.ccode, data:[elm,arr[idx+1]] }))
      .filter((elm,idx) => idx % 2 == 0)
  }

  render() {
    const {querying,searching,searchWord} = this.state

    return (
      <View style={[appStyles.container,{marginTop:15}]}>
        <AppActivityIndicator visible={querying} />
        {!searchWord && !searching ? this.renderSearchWord() : null }
        {!searchWord && !searching ? this.renderRecommend() : null }
        {searchWord && !searching ? this.renderSearching() : null}
        {searching ? this.renderStoreList() : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  width100: {
    width:'100%'
  },
  headerTitle : {
    flexDirection: 'row',
    alignContent:"center",
    marginHorizontal:20,
    flex : 1
  },
  showSearchBar : {
    marginRight:20,
    justifyContent:"flex-end",
    backgroundColor:colors.white
  },
  titleBottom :{
    height: 1,
    marginHorizontal:20,
    backgroundColor: colors.black
  },
  searchText : {
    ... appStyles.normal14Text,
    flex:1,
    marginLeft:20
  },
  searchList :{
    alignContent : "flex-start",
    justifyContent: "flex-start",
    marginHorizontal:20,
    marginBottom:25
  },
  searchListHeader :{
    alignContent : "flex-start",
    justifyContent: "flex-start",
    marginHorizontal:20,
    marginBottom:25,
    marginTop:30,
  },
  recommendHeader : {
    alignContent : "flex-start",
    justifyContent: "flex-start",
    marginHorizontal:20,
    marginBottom:20,
    marginTop:15,
  },
  recommendRow : {
    marginLeft:20,
    marginRight:12,
    alignContent: "space-between",
    flexDirection: 'row',
  },
  recommebdItem : size == SIZE_NORMAL ? 
  {
    height: 46,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.lightGray,
    justifyContent:"center",
    alignItems: "center",
    marginBottom:12,
    marginRight:12,
    flex:1
  } : 
  {
    height: 51,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.lightGray,
    justifyContent:"center",
    alignItems: "center",
    marginBottom:12,
    marginRight:12,
    flex:1
  },
  recommendText : {
    ... appStyles.normal14Text
  },
  recommebdEmpty : {
    height: 46,
    // borderRadius: 3,
    // backgroundColor: colors.white,
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderColor: colors.lightGray,
    // justifyContent:"center",
    // alignItems: "center",
    marginBottom:12,
    marginRight:12,
    flex:1
  },
  searchListHeaderText : {
    ... appStyles.bold16Text,
  },
  searchListText : size == SIZE_NORMAL ? 
  {
    ... appStyles.normal14Text,
    color: colors.warmGrey
  } : 
  { ... appStyles.normal16Text,
    color: colors.warmGrey
  },
  noList : {
    width:'100%',
    marginTop:30,
    marginBottom:25,
    alignItems: "center"
  },
  autoList : {
    marginVertical:23,
    marginLeft :60
  },
  autoText : {
    ... appStyles.normal16Text,
  },
  backButton : {
    alignItems:"center",
    justifyContent:"center"
  },
  emptyPage: {
    marginTop: 60,
    textAlign: 'center'
  },
  emptyViewPage : {
    width:'100%',
    alignItems: "center"
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
)(StoreSearchScreen)