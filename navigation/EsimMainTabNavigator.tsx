import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

import {appStyles} from '@/constants/Styles';
import AppIcon from '@/components/AppIcon';

import HomeScreenEsim from '@/screens/HomeScreen/Esim';
import TutorialScreen from '@/screens/TutorialScreen';
import MySimScreen from '@/screens/MySimScreen';

import CountryScreen from '@/screens/CountryScreen';
import ProductDetailScreen from '@/screens/ProductDetailScreen';

import SettingsScreen from '@/screens/SettingsScreen';
import i18n from '@/utils/i18n';
import RechargeScreen from '@/screens/RechargeScreen';
import CartScreen from '@/screens/CartScreen';
import MyPageScreen from '@/screens/MyPageScreen/index';
import InviteScreen from '@/screens/InviteScreen/index';
import NotiScreen from '@/screens/NotiScreen';
import PaymentScreen from '@/screens/PaymentScreen';
import PaymentResultScreen from '@/screens/PaymentResultScreen';
import PurchaseDetailScreen from '@/screens/PurchaseDetailScreen';
import ContactScreen from '@/screens/ContactScreen';
import ContactBoardScreen from '@/screens/ContactBoardScreen';
import PymMethodScreen from '@/screens/PymMethodScreen';
import StoreSearchScreen from '@/screens/StoreSearch';
import BoardMsgRespScreen from '@/screens/BoardMsgRespScreen';
import SimpleTextScreen from '@/screens/SimpleTextScreen';
import CodePushScreen from '@/screens/CodePushScreen';
import EsimScreen from '@/screens/EsimScreen';
import FaqScreen from '@/screens/FaqScreen';
import GuideScreen from '@/screens/GuideScreen';
import {RootState} from '@/redux';
import AuthStack from './AuthStackNavigator';
import {HomeStackParamList} from './navigation';
import BadgedIcon from './component/BadgedIcon';

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

const HomeStack = createStackNavigator<HomeStackParamList>();
const CartStack = createStackNavigator();
const EsimStack = createStackNavigator();
const MyPageStack = createStackNavigator();

function homeStack() {
  return (
    <HomeStack.Navigator screenOptions={{animationEnabled: false}}>
      <HomeStack.Screen name="Home" component={HomeScreenEsim} />
      <HomeStack.Screen name="Tutorial" component={TutorialScreen} />
      <HomeStack.Screen name="StoreSearch" component={StoreSearchScreen} />
      <HomeStack.Screen name="Cart" component={CartScreen} />
      <HomeStack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <HomeStack.Screen name="Noti" component={NotiScreen} />
      <HomeStack.Screen name="SimpleText" component={SimpleTextScreen} />
      <HomeStack.Screen name="Contact" component={ContactScreen} />
      <HomeStack.Screen name="ContactBoard" component={ContactBoardScreen} />

      <HomeStack.Screen name="Invite" component={InviteScreen} />
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
      <MyPageStack.Screen name="Invite" component={InviteScreen} />
      <MyPageStack.Screen name="Payment" component={PaymentScreen} />
      <MyPageStack.Screen name="PymMethod" component={PymMethodScreen} />
      <MyPageStack.Screen
        name="PaymentResult"
        component={PaymentResultScreen}
      />
      <MyPageStack.Screen name="Faq" component={FaqScreen} />
      <MyPageStack.Screen name="Settings" component={SettingsScreen} />
      <MyPageStack.Screen name="MySim" component={MySimScreen} />
    </MyPageStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const TabNavigator = ({
  loggedIn,
  iccid,
}: {
  loggedIn?: boolean;
  iccid?: string;
}) => {
  return (
    <Tab.Navigator
      tabBarOptions={{allowFontScaling: false}}
      initialRouteName="HomeStack"
      backBehavior="initialRoute">
      <Tab.Screen
        name="HomeStack"
        component={homeStack}
        options={({route}) => ({
          tabBarVisible:
            (getFocusedRouteNameFromRoute(route) || 'Home') === 'Home',
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
      <Tab.Screen
        name="CartStack"
        component={iccid && loggedIn ? cartStack : AuthStack}
        options={() => ({
          tabBarVisible: false,
          tabBarBadgeStyle: {allowFontScaling: false},
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
      <Tab.Screen
        name="EsimStack"
        component={iccid && loggedIn ? esimStack : AuthStack}
        options={({route}) => ({
          tabBarVisible:
            !!iccid &&
            !!loggedIn &&
            (getFocusedRouteNameFromRoute(route) || 'Esim') === 'Esim',
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
      <Tab.Screen
        name="MyPageStack"
        component={iccid && loggedIn ? myPageStack : AuthStack}
        options={({route}) => ({
          tabBarVisible:
            !!iccid &&
            !!loggedIn &&
            (getFocusedRouteNameFromRoute(route) || 'MyPage') === 'MyPage',
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
    </Tab.Navigator>
  );
};

export default connect(({account}: RootState) => ({
  loggedIn: account.loggedIn,
  iccid: account.iccid,
}))(TabNavigator);
