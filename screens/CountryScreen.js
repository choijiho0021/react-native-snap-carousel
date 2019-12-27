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
import * as productActions from '../redux/modules/product'
import * as cartActions from '../redux/modules/cart'
import * as accountActions from '../redux/modules/account'
import productApi from '../utils/api/productApi';
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
import AppAlert from '../components/AppAlert';
import AppCartButton from '../components/AppCartButton';

class CountryScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    //todo 해당 국가 이름으로 변경해야함 
    headerLeft: <AppBackButton navigation={navigation} title={navigation.getParam('title')} />,
    headerRight: (
      <AppCartButton style={styles.btnCartIcon} onPress={() => navigation.navigate('Cart')} />
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
      ]
    }
  }

  componentDidMount() {
    const {idx, prodList} = this.props.product,
      prod = prodList[idx]

      if ( idx >= 0 && idx < prodList.length) {
        console.log('prod', prodList[idx])
      }
    const prodData = prodList.filter(item => prod.categoryId[0] == productApi.category.multi ? 
        item.uuid == prod.uuid && item.ccode == prod.ccode 
        : item.categoryId[0] != productApi.category.multi && item.ccode == prod.ccode)
        .map(item => ({
      ... item,
      key: item.uuid
    }))

    this.setState({
      prodData: prodData,
      selected: [prodData[0]]
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

  _onPressBtn = (key) => () => {
    const {selected} = this.state
    const {loggedIn} = this.props.account

  if(!loggedIn){
      this.props.navigation.navigate('Auth')
    }
    else {

      if(selected){
        const prod = this.props.product.prodList.find(item => item.uuid == selected[0].uuid),
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
            this.props.action.cart.purchase({ purchaseItems: [ addProduct ]})
            this.props.navigation.navigate('PymMethod')
            break
          case 'regCard':
          this.props.navigation.navigate('RegisterSim')
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
            <AppPrice key={"price"} price={item.price} style={styles.appPrice} balanceStyle={styles.priceStyle} wonStyle={styles.wonStyle} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { idx, prodList, startDate, name} = this.props.product
    const { iccid,loggedIn } = this.props.account
    const { prodData, selected} = this.state
    const imageUrl = (prodList.length > idx >= 0) ? prodList[idx].imageUrl : ''
      
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: 'never', bottom:"always"}}>
        <Image style={styles.box} source={{uri:api.httpImageUrl(imageUrl)}}/>

        <TouchableOpacity onPress={() => this.props.navigation.navigate('SimpleText', {title:this.props.navigation.getParam('title'), text:selected[0].body})}>
          <View style={styles.detail}>
            <Text style={appStyles.normal14Text}>{i18n.t('country:detail')}</Text>
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
    flexDirection: 'row',
    alignItems: 'flex-end'
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