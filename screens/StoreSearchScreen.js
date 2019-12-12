import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  TextInput,
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
import AppBackButton from '../components/AppBackButton';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { colors } from '../constants/Colors';
import AppButton from '../components/AppButton';
import AppActivityIndicator from '../components/AppActivityIndicator';

class HeaderTitle extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searching : false,
      searchWord : ''
    }

  }

  shouldComponentUpdate(nextProps,nextState){
    return (nextState.searchWord != this.state.searchWord || this.props.value != nextProps.value )
  }

  componentDidUpdate(prevProps) {
    if ( this.props.value && this.props.value != prevProps.value) {
      this.setState({
        searchWord: this.props.value
      })
    }
  }

  _searching(searching = true) {
    const {search} = this.props

  }
 
  _onChangeText = (key) => (value) => {
    this.setState({
      [key] : value
    })
  }
  
  // onFocus() {
  //   this.searchBox.setNativeProps({
  //     style: { borderColor: colors.black}
  //   })
  // }

  // onBlur() {
  //   this.searchBox.setNativeProps({
  //     style: { borderColor: colors.lightGrey}
  //   })
  // }

  search(searchWord) {
    this.setState({searchWord:searchWord})
  }
  render() {
    const {searching, searchWord} = this.state
    const {search, navigation} = this.props

    return (
      <View style={styles.container}>
        <View style={styles.headerTitle}>
          {/* {AppBackButton({navigation, title:''})} */}
          <TextInput 
            // ref={input => { this.textInput = input}}
            // onBlur={ () => this.onBlur() }
            // onFocus={ () => this.onFocus() }
            // clearTextOnFocus={true}
            style={styles.searchText}
            placeholder={i18n.t('store:search')}
            returnKeyType='search'
            enablesReturnKeyAutomatically={true}
            clearButtonMode = 'always'
            // onSubmitEditing={() => search()}
            onChangeText={this._onChangeText('searchWord')}
            value={searchWord}
            />
          <AppButton style = {styles.showSearchBar} onPress={() => this.search('abc')} iconName="btnSearchOff" />
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
      headerTitle : <HeaderTitle value={params.value}/>
    }
}

  constructor(props) {
    super(props)

    this.state = {
      querying: false,
      searchList : ["대만","아시아"],
      recommendCountry : ["인도네시아","스페인","아일랜드","네덜란다"]
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      value : this.state.value
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if ( this.state.value && this.state.value != prevState.value) {
      this.props.navigation.setParams({
        value : this.state.value
      })
    }
  }
  
  changeValue(value) {
    this.setState({value : value})
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
          {/* i18로 변경해야함 */}
          <Text style={styles.searchListText}> {i18n.t('search:err')} </Text>
        </View> : searchList.map(elm => (
          <TouchableOpacity onPress={() => this.changeValue(elm)}>
            <View style={styles.searchList}>
              <Text style={styles.searchListText}>{elm}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  renderRecommend() {
    const { recommendCountry} = this.state
    
    const recommendCountryList = recommendCountry.map((elm, idx, arr) => ({key : elm, data:[elm, arr[idx+1], arr[idx+2]]})).filter((elm, idx)=>idx % 3 == 0 )
    console.log("recommendCountryList",recommendCountryList)

    return (
      <View style={styles.width100}>
      {/* 인기 국가 */}
      <View style={styles.recommendHeader}>
        <Text style={styles.searchListHeaderText}>{i18n.t('search:recommend')}</Text>
      </View>
      {recommendCountryList.map(elm => 
        <View style={styles.recommendRow}>
          {elm.data.map(elm2 => 
            elm2 ? <View style={styles.recommebdItem}>
              <Text style={styles.recommendText}>{elm2}</Text>
              </View> : <View style={styles.recommebdEmpty}/>)}
        </View>)}
    </View>
    )
  }

  renderSearching() {
    const {searchWord} = this.state

    return (<View>
      {searchWord == "" ? 
      <Text>abcd</Text> : <Text>eeeee</Text>}
      <Text>asdfasdf</Text>
    </View>)
  }


  render() {
    const {querying,searchWord} = this.state

    return (
      <View style={[appStyles.container,{marginTop:15}]}>
        <AppActivityIndicator visible={querying} />
        {this.renderSearchWord()}
        {this.renderRecommend()}
        {this.renderSearching()}
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
  recommendList : {
    marginHorizontal : 20,
    alignContent: "space-between"
  },
  recommendRow : {
    marginLeft:20,
    marginRight:12,
    alignContent: "space-between",
    flexDirection: 'row',
  },
  recommebdItem : {
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
  searchListText : {
    ... appStyles.normal14Text,
    color: colors.warmGrey
  },
  noList : {
    width:'100%',
    marginTop:30,
    marginBottom:25,
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