import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {appStyles} from '../constants/Styles';
import AppButton from '../components/AppButton';
import AppIcon from '../components/AppIcon';

import HomeScreenEsim from '../screens/HomeScreenEsim';
import MySimScreen from '../screens/MySimScreen';

import CountryScreen from '../screens/CountryScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';

import SettingsScreen from '../screens/SettingsScreen';
import i18n from '../utils/i18n';
import RechargeScreen from '../screens/RechargeScreen';
import CartScreen from '../screens/CartScreen';
import withBadge from '../components/withBadge';
import MyPageScreen from '../screens/MyPageScreen';
import NotiScreen from '../screens/NotiScreen';
import PaymentScreen from '../screens/PaymentScreen';
import PaymentResultScreen from '../screens/PaymentResultScreen';
import PurchaseDetailScreen from '../screens/PurchaseDetailScreen';
import ContactScreen from '../screens/ContactScreen';
import ContactBoardScreen from '../screens/ContactBoardScreen';
import PymMethodScreen from '../screens/PymMethodScreen';
import StoreSearchScreen from '../screens/StoreSearchScreen';
import BoardMsgRespScreen from '../screens/BoardMsgRespScreen';
import SimpleTextScreen from '../screens/SimpleTextScreen';
import CodePushScreen from '../screens/CodePushScreen';
import EsimScreen from '../screens/EsimScreen';
import FaqScreen from '../screens/FaqScreen';
import GuideScreen from '../screens/GuideScreen';
import SubsDetailScreen from '../screens/SubsDetailScreen';
import AuthStack from './AuthStackNavigator';
import {connect} from 'react-redux';

const HomeStack = createStackNavigator();
const CartStack = createStackNavigator();
const EsimStack = createStackNavigator();
const MyPageStack = createStackNavigator();

function homeStack() {
  return (
    <HomeStack.Navigator screenOptions={{animationEnabled: false}}>
      <HomeStack.Screen name="Home" component={HomeScreenEsim} />
      <HomeStack.Screen name="StoreSearch" component={StoreSearchScreen} />
      <HomeStack.Screen name="Cart" component={CartScreen} />
      <HomeStack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <HomeStack.Screen name="Noti" component={NotiScreen} />
      <HomeStack.Screen name="SimpleText" component={SimpleTextScreen} />
      <HomeStack.Screen name="Contact" component={ContactScreen} />
      <HomeStack.Screen name="ContactBoard" component={ContactBoardScreen} />

      <HomeStack.Screen name="BoardMsgResp" component={BoardMsgRespScreen} />
      <HomeStack.Screen name="Faq" component={FaqScreen} />
      <HomeStack.Screen name="Guide" component={GuideScreen} />
      <HomeStack.Screen name="Country" component={CountryScreen} />
      <HomeStack.Screen name="Payment" component={PaymentScreen} />
      <HomeStack.Screen name="PymMethod" component={PymMethodScreen} />
      <HomeStack.Screen name="PaymentResult" component={PaymentResultScreen} />
      <HomeStack.Screen name="CodePush" component={CodePushScreen} />
      <HomeStack.Screen
        name="PurchaseDetail"
        component={PurchaseDetailScreen}
      />
    </HomeStack.Navigator>
  );
}

function cartStack() {
  return (
    <CartStack.Navigator screenOptions={{animationEnabled: false}}>
      <CartStack.Screen name="Cart" component={CartScreen} />
      <CartStack.Screen name="Payment" component={PaymentScreen} />
      <CartStack.Screen name="PymMethod" component={PymMethodScreen} />
      <CartStack.Screen name="SimpleText" component={SimpleTextScreen} />
      <CartStack.Screen name="PaymentResult" component={PaymentResultScreen} />
    </CartStack.Navigator>
  );
}

function esimStack() {
  return (
    <EsimStack.Navigator screenOptions={{animationEnabled: false}}>
      <EsimStack.Screen name="Esim" component={EsimScreen} />
      {/* <EsimStack.Screen name="SubsDetail" component={SubsDetailScreen} /> */}
    </EsimStack.Navigator>
  );
}

function myPageStack() {
  return (
    <MyPageStack.Navigator screenOptions={{animationEnabled: false}}>
      <MyPageStack.Screen name="MyPage" component={MyPageScreen} />
      <MyPageStack.Screen
        name="PurchaseDetail"
        component={PurchaseDetailScreen}
      />
      <MyPageStack.Screen name="SimpleText" component={SimpleTextScreen} />
      <MyPageStack.Screen name="ContactBoard" component={ContactBoardScreen} />
      <MyPageStack.Screen name="BoardMsgResp" component={BoardMsgRespScreen} />
      <MyPageStack.Screen name="Recharge" component={RechargeScreen} />
      <MyPageStack.Screen name="Payment" component={PaymentScreen} />
      <MyPageStack.Screen name="PymMethod" component={PymMethodScreen} />
      <MyPageStack.Screen
        name="PaymentResult"
        component={PaymentResultScreen}
      />
      <MyPageStack.Screen name="Settings" component={SettingsScreen} />
      <MyPageStack.Screen name="MySim" component={MySimScreen} />
    </MyPageStack.Navigator>
  );
}

// redux store에서 cart에 추가된 상품 개수를 읽어서 배지에 표시한다.
//
const BadgedIcon = withBadge(
  ({cartItems}) => cartItems,
  {badgeStyle: {top: 4, left: 8}},
  state => ({
    cartItems: (state.cart.get('orderItems') || []).reduce(
      (acc, cur) => acc + cur.qty,
      0,
    ),
  }),
)(AppIcon);

const TabNavigator = createBottomTabNavigator();

function tabNavigator({loggedIn, iccid}) {
  return (
    <TabNavigator.Navigator
      initialRouteName="HomeStack"
      backBehavior="initialRoute">
      <TabNavigator.Screen
        name="HomeStack"
        component={homeStack}
        options={({route}) => ({
          tabBarVisible: route.state && route.state.index == 0,
          tabBarLabel: i18n.t('home'),
          animationEnabled: false,
          tabBarIcon: ({focused}) => (
            <AppIcon
              focused={focused}
              name="btnHome"
              style={styles.tabBarIcon}
            />
          ),
        })}
      />
      <TabNavigator.Screen
        name="CartStack"
        component={iccid && loggedIn ? cartStack : AuthStack}
        options={({route}) => ({
          tabBarVisible: false,
          tabBarLabel: i18n.t('cart'),
          tabBarIcon: ({focused}) => (
            <BadgedIcon
              focused={focused}
              name="btnCart"
              style={styles.tabBarIcon}
            />
          ),
        })}
      />
      <TabNavigator.Screen
        name="EsimStack"
        component={iccid && loggedIn ? esimStack : AuthStack}
        options={({route}) => ({
          tabBarVisible: route.state && route.state.index == 0,
          tabBarLabel: i18n.t('esim'),
          tabBarIcon: ({focused}) => (
            <AppIcon
              focused={focused}
              name="btnEsim"
              style={styles.tabBarIcon}
            />
          ),
        })}
      />
      <TabNavigator.Screen
        name="MyPageStack"
        component={iccid && loggedIn ? myPageStack : AuthStack}
        options={({route}) => ({
          tabBarVisible: route.state && route.state.index == 0,
          tabBarLabel: i18n.t('mypage'),
          tabBarIcon: ({focused}) => (
            <AppIcon
              focused={focused}
              name="btnMypage"
              style={styles.tabBarIcon}
            />
          ),
        })}
      />
    </TabNavigator.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarIcon: {
    marginTop: 5,
  },
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
  btnAlarm: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  btnCnter: {
    width: 40,
    height: 40,
    marginHorizontal: 18,
  },
});

export default connect(state => ({
  loggedIn: state.account.get('loggedIn'),
  iccid: state.account.get('iccid'),
}))(tabNavigator);
