import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import {connect} from 'react-redux'

import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import * as productActions from '../redux/modules/product'
import * as cartActions from '../redux/modules/cart'
import * as accountActions from '../redux/modules/account'
import api from '../utils/api/api';
import { bindActionCreators } from 'redux'
import AppButton from '../components/AppButton'
import AppIcon from '../components/AppIcon';
import AppBackButton from '../components/AppBackButton';
import { colors } from '../constants/Colors';
import { SafeAreaView } from 'react-navigation'
import AppPrice from '../components/AppPrice';
import AppCartButton from '../components/AppCartButton';
import { windowWidth, device } from '../constants/SliderEntry.style';
import Analytics from 'appcenter-analytics'
import _ from 'underscore'


class CountryListItem extends PureComponent {
  render() {
    const {item, selected, onPress} = this.props
    let borderColor = {}, color = {}

    if(selected && selected.uuid == item.uuid) {
      borderColor = {borderColor : colors.clearBlue}
      color = {color:colors.clearBlue}
    }

    return (
      <TouchableOpacity onPress={onPress(item.uuid)}>
        <View key={"product"} style={[styles.card,borderColor]}>
          <View key={"text"} style={styles.textView}>
            <Text key={"name"} style={[windowWidth > device.small.window.width ? appStyles.bold16Text : appStyles.bold14Text,color]}>{item.name}</Text>
            <Text key={"desc"} style={[{marginTop:5},windowWidth > device.small.window.width ? appStyles.normal14Text : appStyles.normal12Text]}>({item.field_description})</Text>
          </View>
          <View key={"priceText"} style={styles.appPrice}>
            <AppPrice key={"price"} price={item.price} balanceStyle={styles.priceStyle} wonStyle={styles.wonStyle} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

class CountryScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    //todo 해당 국가 이름으로 변경해야함 
    headerLeft: <AppBackButton navigation={navigation} title={navigation.getParam('title')} />,
    headerRight: (
      <AppCartButton onPress={() => navigation.navigate('Cart')} />
    )
  })

  constructor(props) {
    super(props)

    this.state = {
      prodData: [],
      selected: undefined
    }
  }

  componentDidMount() {
    const {idx, prodList} = this.props.product,
      prod = prodList[idx]

    if ( idx >= 0 && idx < prodList.length) {
      console.log('prod', prodList[idx])
    }

    const prodData = prodList.filter( item => _.isEqual(item.ccode, prod.ccode))

    this.setState({
      prodData,
      selected: prodData[0]
    })
  }

  _onPress = (uuid) => () => {
    const {prodData} = this.state
    const selected = prodData.find(elm => elm.uuid == uuid)

    this.setState({selected})
  }

  _onPressBtn = (key) => () => {
    const {selected} = this.state
    const {loggedIn, balance} = this.props.account

    //analytics 기록용
    let appCenterEvent
    switch (key) {
      case 'cart':
        appCenterEvent = '카트에 담기 클릭'
        break
      case 'purchase':
        appCenterEvent = '바로구매 클릭'
        break
      // case 'regCard':
      //   appCenterEvent = 'Country Screen에서 로그인 버튼 클릭'
      //   break
    }

    console.log("key", key, appCenterEvent)
    Analytics.trackEvent(appCenterEvent)

    if(!loggedIn){
      this.props.navigation.navigate('Auth')
    }
    else {

      if(selected){
        const prod = this.props.product.prodList.find(item => item.uuid == selected.uuid),
          addProduct = prod ? { 
            title: prod.name, 
            variationId: prod.variationId, 
            price:prod.price, 
            qty:1,
            key: prod.uuid,
            sku: prod.sku,
            imageUrl: prod.imageUrl,
            type: 'product'
          } : {}
  
        switch (key) {
          case 'cart':
            this.props.action.cart.cartAddAndGet( [ addProduct ])
            break
          case 'purchase':
            // 구매 품목을 갱신한다. 
            this.props.action.cart.purchase({ purchaseItems: [ addProduct ], balance})
            this.props.navigation.navigate('PymMethod')
            break
          case 'regCard':
            this.props.navigation.navigate('RegisterSim')
        }
      }
    }
  }

  _renderItem = ({item}) => {
    return <CountryListItem item={item} selected={this.state.selected} onPress={this._onPress}/>
  }

  render() {
    const { idx, prodList, startDate, name} = this.props.product
    const { iccid,loggedIn } = this.props.account
    const { prodData, selected} = this.state
    const imageUrl = (prodList.length > idx >= 0) ? prodList[idx].imageUrl : ''
      
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: 'never', bottom:"always"}}>
        <Image style={styles.box} source={{uri:api.httpImageUrl(imageUrl)}}/>

        <TouchableOpacity onPress={() => this.props.navigation.navigate('SimpleText', {title:this.props.navigation.getParam('title'), text:selected.body})}>
          <View style={styles.detail}>
            <Text style={windowWidth > device.small.window.width ? appStyles.normal14Text : appStyles.normal12Text}>{i18n.t('country:detail')}</Text>
            <AppIcon style={{marginRight:20}} name="iconArrowRight" size={10} />
          </View>
        </TouchableOpacity>

        <View style={styles.divider}/>

        <View style={{flex:1}}>
          <FlatList 
            data={prodData} 
            renderItem={this._renderItem}
            extraData={[name, startDate]} />
        </View>

        { iccid ? 
        <View style={styles.buttonBox}>
          <AppButton style={styles.btnCart} title={i18n.t('cart:toCart')} 
            titleStyle={styles.btnCartText}
            onPress={this._onPressBtn('cart')}/>
          <AppButton style={styles.btnBuy} title={i18n.t('cart:buy')} 
            titleStyle={styles.btnBuyText}
            onPress={this._onPressBtn('purchase')}/>
        </View> : 
        <View style={styles.buttonBox}>
          <AppButton style={styles.regCardView} 
            title={loggedIn ? i18n.t('reg:card') : i18n.t('err:login')} 
            titleStyle={styles.regCard}
            onPress={this._onPressBtn('regCard')}/>
          <Text style={styles.regCard}>{i18n.t('reg:card')}</Text>
        </View>
        }

      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container : {
    flex:1,
    alignItems:'stretch'
  },
  box : {
    height: 150
    // resizeMode: 'cover'
  },
  rowDirection : {
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  descBox : {
    marginTop:15, 
    marginRight:5,
    marginLeft:5
  },
  descKey : {
    fontSize: 12, 
    fontWeight: "bold", 
    textAlign:"left", 
    marginLeft:15,
    flex:3
  },
  descValue : {
    fontSize: 12, 
    textAlign:"left", 
    padding:3, 
    marginLeft:15,
    flex:7},
  bottomBtn : {
    position:"absolute",
    bottom:0
  },
  buttonBox: {
    flexDirection: 'row'
    // position:"absolute",
    // bottom:0
  },
  btnCart: {
    width: "50%",
    height: 52,
    backgroundColor: "#ffffff",
    borderColor: colors.lightGrey,
    borderTopWidth: 1
  },
  btnCartText: {
    ... appStyles.normal18Text,
    textAlign: "center",
    color: colors.black
  },
  btnBuy: {
    width: "50%",
    height: 52,
    backgroundColor: colors.clearBlue
  },
  btnBuyText: {
    ... appStyles.normal18Text,
    textAlign: "center",
    color: colors.white
  },
  card : {
    height: windowWidth > device.small.window.width ? 71 : 60,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.lightGrey,
    marginVertical: 7,
    marginHorizontal:20,
    flexDirection:'row',
    // justifyContent:'space-between',
    padding: 15,
    alignItems:'center'
  },
  detail : {
    height: windowWidth > device.small.window.width ? 48 : 36,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.black,
    marginVertical:20,
    marginHorizontal:20,
    alignItems:'center',
    paddingLeft:20,
    justifyContent:'space-between',
    flexDirection: "row"
  },
  divider : {
    height: 10,
    backgroundColor: colors.whiteTwo,
    marginBottom:30
  },
  priceStyle : {
    height: 24,
    // fontFamily: "Roboto",
    fontSize: windowWidth > device.small.window.width ? 20 : 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0.19,
    textAlign: "right",
    color: colors.black
  },
  wonStyle : {
    height: 24,
    // fontFamily: "Roboto",
    fontSize: windowWidth > device.small.window.width ? 14 : 12,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0.19,
    color: colors.black
  },
  regCard : {
    ... appStyles.normal18Text,
    textAlign: "center",
    textAlignVertical:"bottom",
    width:'100%',
  },
  regCardView : {
    width:'100%',
    height:52,
    justifyContent:"center",
    borderTopWidth:1,
    borderColor: colors.lightGrey
  },
  appPrice : {
    alignItems:"flex-end",
    marginLeft:10,
    width:80
  },
  textView : {
    flex:1,
    alignItems:"flex-start"
  }
});

const mapStateToProps = (state) => ({
  product: state.product.toJS(),
  cart: state.cart.toJS(),
  account : state.account.toJS(),
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action:{
      product: bindActionCreators(productActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      account: bindActionCreators(accountActions, dispatch)
    }
  })
)(CountryScreen)