import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

import {appStyles} from '../constants/Styles';
import AppIcon from '../components/AppIcon';

import HomeScreen from '../screens/HomeScreen';
import MySimScreen from '../screens/MySimScreen';

import StoreScreen from '../screens/StoreScreen';
import CountryScreen from '../screens/CountryScreen';
import RegisterSimScreen from '../screens/RegisterSimScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';

import SettingsScreen from '../screens/SettingsScreen';
import i18n from '../utils/i18n';
import RechargeScreen from '../screens/RechargeScreen';
import CartScreen from '../screens/CartScreen';
import withBadge from '../components/withBadge';
import NewSimScreen from '../screens/NewSimScreen';
import MyPageScreen from '../screens/MyPageScreen';
import NotiScreen from '../screens/NotiScreen';
import PaymentScreen from '../screens/PaymentScreen';
import PaymentResultScreen from '../screens/PaymentResultScreen';
import PurchaseDetailScreen from '../screens/PurchaseDetailScreen';
import ContactScreen from '../screens/ContactScreen';
import ContactBoardScreen from '../screens/ContactBoardScreen';
import PymMethodScreen from '../screens/PymMethodScreen';
import FindAddressScreen from '../screens/FindAddressScreen';
import CustomerProfileScreen from '../screens/CustomerProfileScreen';
import AddProfileScreen from '../screens/AddProfileScreen';
import StoreSearchScreen from '../screens/StoreSearch';
import BoardMsgRespScreen from '../screens/BoardMsgRespScreen';
import SimpleTextScreen from '../screens/SimpleTextScreen';
import CodePushScreen from '../screens/CodePushScreen';
import UsimScreen from '../screens/UsimScreen';
import FaqScreen from '../screens/FaqScreen';
import GuideScreen from '../screens/GuideScreen';
import SubsDetailScreen from '../screens/SubsDetailScreen';
import AuthStack from './AuthStackNavigator';

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

const HomeStack = createStackNavigator();
const StoreStack = createStackNavigator();
const CartStack = createStackNavigator();
const UsimStack = createStackNavigator();
const MyPageStack = createStackNavigator();

function homeStack() {
  return (
    <HomeStack.Navigator screenOptions={{animationEnabled: false}}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="StoreSearch" component={StoreSearchScreen} />
      <HomeStack.Screen name="Cart" component={CartScreen} />
      <HomeStack.Screen name="ProductDetail" component={ProductDetailScreen} />

      {/* <HomeStack.Screen name="Recharge" component={RechargeScreen} /> */}
      <HomeStack.Screen name="RegisterSim" component={RegisterSimScreen} />
      {/* <HomeStack.Screen name="NewSim" component={NewSimScreen} /> */}
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
      {/* <HomeStack.Screen name="FindAddress" component={FindAddressScreen} /> */}
      <HomeStack.Screen name="PaymentResult" component={PaymentResultScreen} />
      <HomeStack.Screen name="CodePush" component={CodePushScreen} />
      <HomeStack.Screen
        name="CustomerProfile"
        component={CustomerProfileScreen}
      />
      <HomeStack.Screen name="AddProfile" component={AddProfileScreen} />
      <HomeStack.Screen
        name="PurchaseDetail"
        component={PurchaseDetailScreen}
      />
    </HomeStack.Navigator>
  );
}

function storeStack() {
  return (
    <StoreStack.Navigator screenOptions={{animationEnabled: false}}>
      <StoreStack.Screen name="Store" component={StoreScreen} />
      <StoreStack.Screen name="Cart" component={CartScreen} />
      <StoreStack.Screen name="StoreSearch" component={StoreSearchScreen} />
      <StoreStack.Screen name="RegisterSim" component={RegisterSimScreen} />
      <StoreStack.Screen name="Country" component={CountryScreen} />
      <StoreStack.Screen name="NewSim" component={NewSimScreen} />
      <StoreStack.Screen name="SimpleText" component={SimpleTextScreen} />
      <StoreStack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <StoreStack.Screen name="Faq" component={FaqScreen} />
      <StoreStack.Screen name="Payment" component={PaymentScreen} />
      <StoreStack.Screen name="PymMethod" component={PymMethodScreen} />
      <StoreStack.Screen name="PaymentResult" component={PaymentResultScreen} />
    </StoreStack.Navigator>
  );
}

function cartStack() {
  return (
    <CartStack.Navigator screenOptions={{animationEnabled: false}}>
      <CartStack.Screen name="Cart" component={CartScreen} />
      <CartStack.Screen name="Payment" component={PaymentScreen} />
      <CartStack.Screen name="PymMethod" component={PymMethodScreen} />
      <CartStack.Screen name="FindAddress" component={FindAddressScreen} />
      <CartStack.Screen name="SimpleText" component={SimpleTextScreen} />
      <CartStack.Screen name="PaymentResult" component={PaymentResultScreen} />
      <CartStack.Screen
        name="CustomerProfile"
        component={CustomerProfileScreen}
      />
      <CartStack.Screen name="AddProfile" component={AddProfileScreen} />
      <CartStack.Screen name="RegisterSim" component={RegisterSimScreen} />
    </CartStack.Navigator>
  );
}

function usimStack() {
  return (
    <UsimStack.Navigator screenOptions={{animationEnabled: false}}>
      <UsimStack.Screen name="Usim" component={UsimScreen} />
      <UsimStack.Screen name="SubsDetail" component={SubsDetailScreen} />

      {/* // 충전 관련 화면 */}
      <UsimStack.Screen name="Recharge" component={RechargeScreen} />
      <UsimStack.Screen name="Payment" component={PaymentScreen} />
      <UsimStack.Screen name="PymMethod" component={PymMethodScreen} />
      <UsimStack.Screen name="SimpleText" component={SimpleTextScreen} />
      <UsimStack.Screen name="PaymentResult" component={PaymentResultScreen} />
      <UsimStack.Screen name="RegisterSim" component={RegisterSimScreen} />
    </UsimStack.Navigator>
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

      <MyPageStack.Screen name="RegisterSim" component={RegisterSimScreen} />

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
  (state) => ({
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
          tabBarVisible:
            (getFocusedRouteNameFromRoute(route) || 'Main') === 'Main',
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
        name="StoreStack"
        component={storeStack}
        options={({route}) => ({
          tabBarVisible:
            (getFocusedRouteNameFromRoute(route) || 'Store') === 'Store',
          tabBarLabel: i18n.t('store'),
          tabBarIcon: ({focused}) => (
            <AppIcon
              focused={focused}
              name="btnStore"
              style={styles.tabBarIcon}
            />
          ),
        })}
      />
      <TabNavigator.Screen
        name="CartStack"
        component={cartStack}
        options={() => ({
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
        name="UsimStack"
        component={
          loggedIn ? (iccid ? usimStack : RegisterSimScreen) : AuthStack
        }
        options={({route}) => ({
          // tabBarOnPress: e => {
          //   console.log('tab bar', e);
          // },
          tabBarVisible:
            (getFocusedRouteNameFromRoute(route) || 'Usim') === 'Usim',
          tabBarLabel: i18n.t('usim'),
          tabBarIcon: ({focused}) => (
            <AppIcon
              focused={focused}
              name="btnUsim"
              style={styles.tabBarIcon}
            />
          ),
        })}
      />
      <TabNavigator.Screen
        name="MyPageStack"
        component={loggedIn ? myPageStack : AuthStack}
        options={({route}) => ({
          tabBarVisible:
            (getFocusedRouteNameFromRoute(route) === 'MyPage') === 'MyPage',
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

export default connect((state) => ({
  loggedIn: state.account.get('loggedIn'),
  iccid: state.account.get('iccid'),
}))(tabNavigator);
