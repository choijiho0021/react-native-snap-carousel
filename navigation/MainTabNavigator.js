import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import {createBottomTabNavigator } from 'react-navigation-tabs';

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
import DeliveryAddressScreen from '../screens/DeliveryAddressScreen';
import OrderScreen from '../screens/OrderScreen';
import UpdateAddressScreen from '../screens/UpdateAddressScreen';
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
import BoardMsgRespScreen from '../screens/BoardMsgRespScreen';
import ViewDetailScreen from '../screens/ViewDetailScreen';
import SimpleTextScreen from '../screens/SimpleTextScreen';
import FaqScreen from '../screens/FaqScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Recharge: RechargeScreen,
    RegisterSim: RegisterSimScreen,
    RegisterMobile: RegisterMobileScreen,
    NewSim: NewSimScreen,
    Noti: NotiScreen,
    Contact: ContactScreen,
    ContactBoard: ContactBoardScreen,
    BoardMsgResp: BoardMsgRespScreen,
    Payment: PaymentScreen,
    PymMethod: PymMethodScreen,
    FindAddress: FindAddressScreen,
    CustomerProfile: CustomerProfileScreen,
    AddProfile: AddProfileScreen,
    Faq: FaqScreen
  },
  config
);

HomeStack.navigationOptions = ({navigation}) => {
  return {
    tabBarVisible: navigation.state.index == 0,
    tabBarLabel: i18n.t('home'),
    tabBarIcon: ({ focused }) => (
      <AppIcon focused={focused} name="btnHome" />
    ),
  }
};

HomeStack.path = '';

const StoreStack = createStackNavigator(
  {
    Store: StoreScreen,
    Country: CountryScreen,
    Product: ProductScreen,
    NewSim: NewSimScreen,
    ViewDetail: ViewDetailScreen
  },
  config
);

StoreStack.navigationOptions =  ({navigation}) => {
  return {
    tabBarVisible: navigation.state.index == 0,
    tabBarLabel: i18n.t('store'),
    tabBarIcon: ({ focused }) => (
      <AppIcon focused={focused} name="btnStore" />
    ),
  }
};

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
    <AppIcon focused={focused} name="btnSetup" />
  ),
};

const MyPageStack = createStackNavigator(
  {
    MyPage: MyPageScreen,
    PurchaseDetail: PurchaseDetailScreen
  },
  config
);

MyPageStack.navigationOptions = {
  tabBarLabel: i18n.t('mypage'),
  tabBarIcon: ({ focused }) => (
    <AppIcon focused={focused} name="btnMypage" />
  ),
};

MyPageStack.path = '';

const CartStack = createStackNavigator(
  {
    Cart: CartScreen,
    Order: OrderScreen,
    DeliveryAddress: DeliveryAddressScreen,
    UpdateAddress: UpdateAddressScreen,
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
const BadgedIcon = withBadge(({cartItems}) => cartItems, {left:20}, 
  (state) => ({
    cartItems: (state.cart.get('orderItems') || []).reduce((acc,cur) => acc + cur.qty, 0)
  }))(AppIcon)
CartStack.navigationOptions = {
  tabBarLabel: i18n.t('cart'),
  tabBarIcon: ({ focused }) => (
    <BadgedIcon focused={focused} name="btnCart" />
  ),
};

CartStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  StoreStack,
  CartStack,
  MyPageStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
