import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import {createBottomTabNavigator } from 'react-navigation-tabs';
import {connect} from 'react-redux'
import * as cartActions from '../redux/modules/cart'
import { bindActionCreators } from 'redux'

import AppIcon from '../components/AppIcon';
import HomeScreen from '../screens/HomeScreen';
import MySimScreen from '../screens/MySimScreen';

import StoreScreen from '../screens/StoreScreen';
import CountryScreen from '../screens/CountryScreen';
import ProductScreen from '../screens/ProductScreen';
import RegisterSimScreen from '../screens/RegisterSimScreen';

import SettingsScreen from '../screens/SettingsScreen';
import i18n from '../utils/i18n'
import RechargeScreen from '../screens/RechargeScreen';
import CartScreen from '../screens/CartScreen';
import withBadge from '../components/withBadge'
import NewSimScreen from '../screens/NewSimScreen';
import MyPageScreen from '../screens/MyPageScreen';
import NotiScreen from '../screens/NotiScreen';
import PaymentScreen from '../screens/PaymentScreen';
import PaymentResultScreen from '../screens/PaymentResultScreen';
import PurchaseDetailScreen from '../screens/PurchaseDetailScreen';
import RegisterMobileScreen from '../screens/RegisterMobileScreen';
import ContactScreen from '../screens/ContactScreen';
import ContactBoardScreen from '../screens/ContactBoardScreen';
import PymMethodScreen from '../screens/PymMethodScreen';
import FindAddressScreen from '../screens/FindAddressScreen';
import CustomerProfileScreen from '../screens/CustomerProfileScreen';
import AddProfileScreen from '../screens/AddProfileScreen';
import StoreSearchScreen from '../screens/StoreSearchScreen';
import BoardMsgRespScreen from '../screens/BoardMsgRespScreen';
import SimpleTextScreen from '../screens/SimpleTextScreen';
import FaqScreen from '../screens/FaqScreen';
import GuideScreen from '../screens/GuideScreen';
import { colors } from '../constants/Colors';
import AppCartButton from '../components/AppCartButton';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {
    defaultNavigationOptions: {
      headerStyle: {
        height: 56,
        shadowColor: 'transparent',
        borderBottomWidth: 0 
      },
    },
  },
});


const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Recharge: RechargeScreen,
    RegisterSim: RegisterSimScreen,
    RegisterMobile: RegisterMobileScreen,
    NewSim: NewSimScreen,
    Noti: NotiScreen,
    SimpleText: SimpleTextScreen,
    Contact: ContactScreen,
    ContactBoard: ContactBoardScreen,
    BoardMsgResp: BoardMsgRespScreen,
    Faq: FaqScreen,
    Guide: GuideScreen,

    // SIM card 바로 구매와 관련된 화면
    Payment: PaymentScreen,
    PymMethod: PymMethodScreen,
    FindAddress: FindAddressScreen,
    PaymentResult : PaymentResultScreen,
    CustomerProfile: CustomerProfileScreen,
    AddProfile: AddProfileScreen,
  },
  config
);

HomeStack.navigationOptions = ({navigation}) => ({
  tabBarVisible: navigation.state.index == 0,
  tabBarLabel: i18n.t('home'),
  tabBarIcon: ({ focused }) => (
    <AppIcon focused={focused} name="btnHome" style={styles.tabBarIcon}/>
  ),
})

HomeStack.path = '';

const StoreStack = createStackNavigator(
  {
    Store: StoreScreen,
    StoreSearch: StoreSearchScreen,
    Country: CountryScreen,
    Product: ProductScreen,
    NewSim: NewSimScreen,
    SimpleText: SimpleTextScreen,

    // Roaming Product 바로 구매와 관련된 화면
    Payment: PaymentScreen,
    PymMethod: PymMethodScreen,
    PaymentResult : PaymentResultScreen,
  },
  config, 
);

StoreStack.navigationOptions =  ({navigation}) => ({
  tabBarVisible: navigation.state.index == 0,
  tabBarLabel: i18n.t('store'),
  tabBarIcon: ({ focused }) => (
    <AppIcon focused={focused} name="btnStore" style={styles.tabBarIcon}/>
  ),
})

StoreStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
    MySim: MySimScreen,
    SimpleText: SimpleTextScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: i18n.t('setting'),
  tabBarIcon: ({ focused }) => (
    <AppIcon focused={focused} name="btnSetup" style={styles.tabBarIcon}/>
  ),
};

const MyPageStack = createStackNavigator(
  {
    MyPage: MyPageScreen,
    PurchaseDetail: PurchaseDetailScreen,

    // 충전 관련 화면
    Recharge: RechargeScreen,
    Payment: PaymentScreen,
    PymMethod: PymMethodScreen,
    PaymentResult : PaymentResultScreen,
  },
  config
);

MyPageStack.navigationOptions = {
  tabBarLabel: i18n.t('mypage'),
  tabBarIcon: ({ focused }) => (
    <AppIcon focused={focused} name="btnMypage" style={styles.tabBarIcon}/>
  ),
};

MyPageStack.path = '';

const CartStack = createStackNavigator(
  {
    Cart: CartScreen,
    Payment: PaymentScreen,
    PymMethod: PymMethodScreen,
    FindAddress: FindAddressScreen,
    PaymentResult : PaymentResultScreen,
    CustomerProfile: CustomerProfileScreen,
    AddProfile: AddProfileScreen,
  },
  config
);

// redux store에서 cart에 추가된 상품 개수를 읽어서 배지에 표시한다.
//
const BadgedIcon = withBadge(({cartItems}) => cartItems, {badgeStyle : {left:10}}, 
  (state) => ({
    cartItems: (state.cart.get('orderItems') || []).reduce((acc,cur) => acc + cur.qty, 0)
  }))(AppIcon)

CartStack.navigationOptions = {
  tabBarVisible: false,
  tabBarLabel: i18n.t('cart'),
  tabBarIcon: ({ focused }) => (
    <BadgedIcon focused={focused} name="btnCart" style={styles.tabBarIcon}/>
  ),
}

CartStack.path = '';


const TabNavigator = createBottomTabNavigator({
  HomeStack,
  StoreStack,
  CartStack,
  MyPageStack,
  SettingsStack,
}, {
  tabBarOptions: {
    inactiveTintColor: colors.black,
    style: {
      height: 56,
    }
  },
  // safeAreaInset: {top: 'never', bottom:"always"},
});

TabNavigator.path = '';

const styles = StyleSheet.create({
  tabBarIcon: {
    marginTop: 5
  }
})
 
class AppTabNavigator extends React.Component {
  static router = TabNavigator.router

  componentDidUpdate(prevProps) {
    if ( prevProps.navigation.state != this.props.navigation.state) {
      const {navigation} = prevProps,
        lastTab = navigation.state.routes[navigation.state.index].routeName

      if ( lastTab != 'CartStack' && lastTab != this.props.lastTab) this.props.action.cart.setLastTab(lastTab)
    }
  }

  render() {
    const { navigation } = this.props

    return <TabNavigator navigation={navigation} />
  }
}

export default connect((state) => ({
  lastTab : state.cart.get('lastTab')
}),
  (dispatch) => ({
    action:{
      cart: bindActionCreators(cartActions, dispatch),
    }
  })
)(AppTabNavigator)
