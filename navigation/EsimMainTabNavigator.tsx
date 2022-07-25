import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppIcon from '@/components/AppIcon';

import HomeScreenEsim from '@/screens/HomeScreen/Esim';
import TutorialScreen from '@/screens/TutorialScreen';

import CountryScreen from '@/screens/CountryScreen';
import ProductDetailScreen from '@/screens/ProductDetailScreen';
import ProductDetailGlobalScreen from '@/screens/ProductDetailScreen/global';
import ProductDetailOpScreen from '@/screens/ProductDetailOpScreen';

import SettingsScreen from '@/screens/SettingsScreen';
import AccountSettingsScreen from '@/screens/AccountSettingsScreen';
import ResignScreen from '@/screens/ResignScreen';
import ChangeEmailScreen from '@/screens/ChangeEmailScreen';
import ReceiptScreen from '@/screens/ReceiptScreen';
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
import ContactGlobalScreen from '@/screens/ContactGlobalScreen';
import ContactBoardScreen from '@/screens/ContactBoardScreen';
import PymMethodScreen from '@/screens/PymMethodScreen';
import StoreSearchScreen from '@/screens/StoreSearch';
import BoardMsgRespScreen from '@/screens/BoardMsgRespScreen';
import SimpleTextScreen from '@/screens/SimpleTextScreen';
import CodePushScreen from '@/screens/CodePushScreen';
import EsimScreen from '@/screens/EsimScreen';
import GiftScreen from '@/screens/GiftScreen';
import GiftGuideScreen from '@/screens/GiftGuideScreen';
import FaqScreen from '@/screens/FaqScreen';
import {RootState} from '@/redux';
import AuthStack from './AuthStackNavigator';
import {HomeStackParamList} from './navigation';
import BadgedIcon from './component/BadgedIcon';
import RedirectHKScreen from '@/screens/RedirectHKScreen';
import UserGuideScreen from '../screens/UserGuideScreen';
import {CartModelState} from '@/redux/modules/cart';
import AppText from '@/components/AppText';
import Env from '@/environment';

const {esimGlobal} = Env.get();

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

const screenOptions = {
  animationEnabled: false,
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
  },
};

const tabBarLabel = (focused: boolean, textId: string) => (
  <AppText
    style={{
      marginBottom: 2,
      ...appStyles.normal12Text,
      color: focused ? colors.clearBlue : colors.black,
    }}>
    {i18n.t(textId)}
  </AppText>
);

function homeStack() {
  return (
    <HomeStack.Navigator screenOptions={screenOptions} mode="modal">
      <HomeStack.Screen
        name="Home"
        component={HomeScreenEsim}
        options={({route}) => ({
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerStyle: {
            shadowColor: 'transparent',
          },
        })}
      />
      <HomeStack.Screen name="Tutorial" component={TutorialScreen} />
      <HomeStack.Screen name="StoreSearch" component={StoreSearchScreen} />
      <HomeStack.Screen name="Cart" component={CartScreen} />
      <HomeStack.Screen
        name="ProductDetail"
        component={esimGlobal ? ProductDetailGlobalScreen : ProductDetailScreen}
      />
      <HomeStack.Screen
        name="ProductDetailOp"
        component={ProductDetailOpScreen}
      />
      <HomeStack.Screen name="Noti" component={NotiScreen} />
      <HomeStack.Screen name="SimpleText" component={SimpleTextScreen} />
      <HomeStack.Screen
        name="Contact"
        component={esimGlobal ? ContactGlobalScreen : ContactScreen}
      />
      <HomeStack.Screen name="ContactBoard" component={ContactBoardScreen} />
      <HomeStack.Screen
        name="UserGuide"
        component={UserGuideScreen}
        options={{animationEnabled: true}}
      />
      <HomeStack.Screen name="GiftGuide" component={GiftGuideScreen} />
      <HomeStack.Screen name="Invite" component={InviteScreen} />
      <HomeStack.Screen name="BoardMsgResp" component={BoardMsgRespScreen} />
      <HomeStack.Screen name="Faq" component={FaqScreen} />
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
    <CartStack.Navigator screenOptions={screenOptions}>
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
    <EsimStack.Navigator screenOptions={screenOptions}>
      <EsimStack.Screen name="Esim" component={EsimScreen} />
      <EsimStack.Screen name="Gift" component={GiftScreen} />
      <EsimStack.Screen name="RedirectHK" component={RedirectHKScreen} />
      <EsimStack.Screen name="UserGuide" component={UserGuideScreen} />
    </EsimStack.Navigator>
  );
}

function myPageStack() {
  return (
    <MyPageStack.Navigator screenOptions={screenOptions}>
      <MyPageStack.Screen name="MyPage" component={MyPageScreen} />
      <MyPageStack.Screen
        name="PurchaseDetail"
        component={PurchaseDetailScreen}
      />
      <MyPageStack.Screen name="SimpleText" component={SimpleTextScreen} />
      <MyPageStack.Screen name="Recharge" component={RechargeScreen} />
      <MyPageStack.Screen name="Invite" component={InviteScreen} />
      <MyPageStack.Screen name="Payment" component={PaymentScreen} />
      <MyPageStack.Screen name="PymMethod" component={PymMethodScreen} />
      <MyPageStack.Screen
        name="PaymentResult"
        component={PaymentResultScreen}
      />
      <MyPageStack.Screen name="Settings" component={SettingsScreen} />
      <MyPageStack.Screen
        name="AccountSettings"
        component={AccountSettingsScreen}
      />
      <MyPageStack.Screen name="Resign" component={ResignScreen} />
      <MyPageStack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
      <MyPageStack.Screen name="Receipt" component={ReceiptScreen} />
    </MyPageStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
// screenOptions: {
//   tabBarStyle: { height: 300 },
// },
const TabNavigator = ({
  loggedIn,
  iccid,
  cart,
}: {
  loggedIn?: boolean;
  iccid?: string;
  cart: CartModelState;
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
          // tabBarLabel: i18n.t('home'),
          tabBarLabel: ({focused}) => tabBarLabel(focused, 'home'),
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
        options={({route}) => ({
          tabBarVisible:
            !!iccid &&
            !!loggedIn &&
            cart?.orderItems?.length === 0 &&
            (getFocusedRouteNameFromRoute(route) || 'Cart') === 'Cart',
          tabBarBadgeStyle: {allowFontScaling: false},
          // tabBarLabel: i18n.t('cart'),
          tabBarLabel: ({focused}) => tabBarLabel(focused, 'cart'),
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
          // tabBarLabel: i18n.t('esim'),
          tabBarLabel: ({focused}) => tabBarLabel(focused, 'esim'),
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
          // tabBarLabel: i18n.t('mypage'),
          tabBarLabel: ({focused}) => tabBarLabel(focused, 'mypage'),
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

export default connect(({account, cart}: RootState) => ({
  loggedIn: account.loggedIn,
  iccid: account.iccid,
  cart,
}))(TabNavigator);
