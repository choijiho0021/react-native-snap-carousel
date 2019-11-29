import React, {Component} from 'react';
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
// import Button from 'react-native-button';
import i18n from '../utils/i18n'
import utils from '../utils/utils';
import country from '../utils/country'
import FlatListIcon from '../components/FlatListIcon';
import DateModal from '../components/DateModal';
import * as productActions from '../redux/modules/product'
import * as cartActions from '../redux/modules/cart'
import * as accountActions from '../redux/modules/account'
import api from '../utils/api/api';
import { bindActionCreators } from 'redux'
// import Icon from 'react-native-vector-icons/Ionicons';
// import { Card } from "react-native-elements";
import AppButton from '../components/AppButton'
import AppIcon from '../components/AppIcon';
import AppBackButton from '../components/AppBackButton';
import { colors } from '../constants/Colors';
import { SafeAreaView } from 'react-navigation'
import AppPrice from '../components/AppPrice';
import withBadge from '../components/withBadge'
import AppAlert from '../components/AppAlert';

const BadgeAppButton = withBadge(({cartItems}) => cartItems, {left:5,top:5}, 
  (state) => ({cartItems: (state.cart.get('orderItems') || []).reduce((acc,cur) => acc + cur.qty, 0)}))(AppButton)

class CountryScreen extends Component {
  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({navigation, title:i18n.t('product')}),
    headerRight: (
      //touch 영역을 위해서 추가 - 나중에 삭제하도록 함
      <TouchableOpacity onPress={navigation.navigation.getParam('Cart')}>
        <BadgeAppButton key="cart" style={styles.btnCartIcon} onPress={navigation.navigation.getParam('Cart')}iconName="btnCart" />
      </TouchableOpacity>
    )
  })

  constructor(props) {
    super(props)

    this.state = {
      data: [
        {key: "dest"},
        {key: "partnerName"},
        {key: "network"},
        {key: "apn"},
        {key: "name"},
        {key: "startDate"},
      ],
      showDateModal: false,
      desc: [{key:"상품 유효기간", value:"구매 후 3년"},
              {key:"서비스 사용기간", value:"2020. 01 ~ 2022. 10", color:"blue"},
              {key:"상품정의", value:"완전 무제한, 무제한, 종량제"}]
    }

    this.onPressDate = this.onPressDate.bind(this)
  }

  componentDidMount() {

    // const key = this.props.navigation.getParam('key')
    
    this.props.action.cart.cartFetch()
    this.props.navigation.setParams({
      Cart: () => this.props.navigation.navigate('Cart')
    })

    const {idx, prodList} = this.props.product,
      prod = prodList[idx]

      if ( idx >= 0 && idx < prodList.length) {
        console.log('prod', prodList[idx])
      }

    this.setState({
      prodData: prodList.filter(item => item.ccode == prod.ccode).map(item => ({
        ... item,
        key: item.uuid,
      }))
    })
  }

  componentDidUpdate(prevProps) {
    if(prevProps != this.props) {
      const {result} = this.props.cart
      if(result != api.NOT_FOUND &&result < 0)  AppAlert.error( i18n.t('reg:fail'))
    }
  }

  _onPress = (uuid) => () => {
    const {prodData} = this.state

    const selected = prodData.filter(elm => elm.uuid == uuid)
    this.setState({selected})
  }

  onPressBtn = (key) => () => {
    const {selected} = this.state
    const {loggedIn} = this.props.account

  if(!loggedIn){
      // AppAlert.confirm(i18n.t('error'),i18n.t('err:login'), {
      //   ok: () => this.props.navigation.navigate('Home')
      // })
      this.props.navigation.navigate('RegisterMobile')
    }
    else {
      if(selected){
        const addProduct = {prodList:this.props.product.prodList, uuid:selected[0].uuid}
  
        switch (key) {
          case 'cart':
            this.props.action.cart.cartAddAndGet( productActions.prodInfo(addProduct))
            break
          case 'buy':
            const pymReq = [
              {
                key: 'total',
                title: i18n.t('price'),
                amount: selected[0].price
              }
            ]
            this.props.navigation.navigate('PymMethod',{pymReq,mode:'buy',buyProduct:selected})
            break
        }
      }
    }
  }

  _renderItem = ({item}) => {
    const {selected} = this.state
    let borderColor = {}, color = {}

    if(selected && selected[0].uuid == item.uuid) {
      borderColor = {borderColor : colors.clearBlue}
      color = {color:colors.clearBlue}
    }

    return (
      <TouchableOpacity onPress={this._onPress(item.uuid)}>
        <View key={"product"} style={[styles.card,borderColor]}>
          <View key={"text"}>
            <Text key={"name"} style={[appStyles.bold16Text,color]}>{item.name}</Text>
            <Text key={"desc"} style={[{marginTop:5},appStyles.normal14Text]}>({item.field_description})</Text>
          </View>
          <View key={"priceText"} style={{alignItems:"baseline"}}>
            <AppPrice key={"price"} price={item.price} balanceStyle={styles.priceStyle} wonStyle={styles.wonStyle} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  onPressDate = (date) => {
    this.props.action.product.setDate({date})
    this.setState({
      showDateModal: false
    })
  }


  render() {
    const { idx, prodList, startDate, name} = this.props.product,
      { showDateModal, data, desc, prodData} = this.state,
      imageUrl = prodList.length > idx >= 0 ? prodList[idx].imageUrl : ''
      
    console.log('HTTPIMGURL', {uri:api.httpImageUrl(imageUrl)})

    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.box} source={{uri:api.httpImageUrl(imageUrl)}}/>
        
        <TouchableOpacity onPress={() => this.props.navigation.navigate('SimpleText', {key:'noti', text:prodData[0].body})}>
          <View style={styles.detail}>
            <Text style={appStyles.normal14Text}>{"상세보기"}</Text>
            <AppIcon style={{marginRight:20}} name="iconArrowRight" size={10} />
          </View>
        </TouchableOpacity>

        <View style={styles.divider}/>

        <View style={{flex:1}}>
          <FlatList 
            data={prodData} 
            renderItem={this._renderItem}
            keyExtractor={(item,idx) => idx.toString()}
            extraData={[name, startDate]} />
        </View>

        <View style={styles.buttonBox}>
          <AppButton style={styles.btnCart} title={i18n.t('cart:toCart')} 
            titleStyle={styles.btnCartText}
            onPress={this.onPressBtn('cart')}/>
          <AppButton style={styles.btnBuy} title={i18n.t('cart:buy')} 
            titleStyle={styles.btnBuyText}
            onPress={this.onPressBtn('buy')}/>
        </View>

        <DateModal visible={showDateModal} onPress={this.onPressDate}/>
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
  btnCartIcon : {
    marginRight:22,
    alignSelf:'center'
  },
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
    borderWidth: 1
  },
  btnCartText: {
    ... appStyles.normal16Text,
    textAlign: "center",
    color: colors.black
  },
  btnBuy: {
    width: "50%",
    height: 52,
    backgroundColor: colors.clearBlue
  },
  card : {
    height: 71,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.lightGrey,
    marginVertical: 7,
    marginHorizontal:20,
    flexDirection:'row',
    justifyContent:'space-between',
    padding: 15,
    alignItems:'center'
  },
  detail : {
    height: 48,
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
    fontSize: 20,
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
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0.19,
    // textAlign: "right",
    textAlignVertical:"bottom",
    color: colors.black
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