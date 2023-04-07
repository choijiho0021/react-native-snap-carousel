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
import ProductDetailOpScreen from '@/screens/ProductDetailOpScreen';

import SettingsScreen from '@/screens/SettingsScreen';
import AccountSettingsScreen from '@/screens/AccountSettingsScreen';
import ResignScreen from '@/screens/ResignScreen';
import ChangeEmailScreen from '@/screens/ChangeEmailScreen';
import ReceiptScreen from '@/screens/ReceiptScreen';
import ExtraCouponScreen from '@/screens/ExtraCouponScreen';
import CashHistoryScreen from '@/screens/CashHistoryScreen';
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
import SelectCardScreen from '@/screens/SelectCardScreen';
import StoreSearchScreen from '@/screens/StoreSearch';
import BoardMsgRespScreen from '@/screens/BoardMsgRespScreen';
import SimpleTextScreen from '@/screens/SimpleTextScreen';
import EsimScreen from '@/screens/EsimScreen';
import GiftScreen from '@/screens/GiftScreen';
import GiftGuideScreen from '@/screens/GiftGuideScreen';
import FaqScreen from '@/screens/FaqScreen';
import {RootState} from '@/redux';
import AuthStack from './AuthStackNavigator';
import {HomeStackParamList} from './navigation';
import BadgedIcon from './component/BadgedIcon';
import RedirectHKScreen from '@/screens/RedirectHKScreen';
import ChargeScreen from '@/screens/ChargeScreen';
import ChargeHistoryScreen from '@/screens/ChargeHistoryScreen';
import ChargeDetailScreen from '@/screens/ChargeDetailScreen';
import QrInfoScreen from '@/screens/QrInfoScreen';
import UserGuideScreen from '@/screens/UserGuideScreen';
import GlobalGuideScreen from '@/screens/UserGuideScreen/global/GlobalGuide';
import PaymentGatewayScreen from '@/screens/PaymentGatewayScreen';
import {CartModelState} from '@/redux/modules/cart';
import AppText from '@/components/AppText';
import GuideHomeScreen from '@/screens/UserGuideScreen/GuideHomeScreen';
import GuideSelectRegionScreen from '@/screens/UserGuideScreen/GuideSelectRegionScreen';
import Env from '@/environment';

const {esimGlobal} = Env.get();

const styles = StyleSheet.create({
  tabBarIcon: {
    marginTop: 5,
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

function HomeStackComponent() {
  return (
    <HomeStack.Navigator
      screenOptions={{...screenOptions, presentation: 'modal'}}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreenEsim}
        options={() => ({
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerStyle: {
            shadowColor: 'transparent',
          },
        })}
      />
      <HomeStack.Screen
        name="Tutorial"
        component={TutorialScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <HomeStack.Screen
        name="StoreSearch"
        component={StoreSearchScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <HomeStack.Screen name="Cart" component={CartScreen} />
      <HomeStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <HomeStack.Screen
        name="ProductDetailOp"
        component={ProductDetailOpScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <HomeStack.Screen name="Noti" component={NotiScreen} />
      <HomeStack.Screen name="SimpleText" component={SimpleTextScreen} />
      <HomeStack.Screen name="Contact" component={ContactScreen} />
      <HomeStack.Screen name="ContactBoard" component={ContactBoardScreen} />
      <HomeStack.Screen name="GiftGuide" component={GiftGuideScreen} />
      <HomeStack.Screen name="Invite" component={InviteScreen} />
      <HomeStack.Screen name="BoardMsgResp" component={BoardMsgRespScreen} />
      <HomeStack.Screen name="Faq" component={FaqScreen} />
      <HomeStack.Screen
        name="Country"
        component={CountryScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <HomeStack.Screen name="Payment" component={PaymentScreen} />
      <HomeStack.Screen name="PymMethod" component={PymMethodScreen} />
      <HomeStack.Group screenOptions={{animationEnabled: true}}>
        <HomeStack.Screen name="UserGuideStep" component={UserGuideScreen} />
        <HomeStack.Screen
          name="UserGuide"
          component={esimGlobal ? GlobalGuideScreen : GuideHomeScreen}
        />
        <HomeStack.Screen
          name="UserGuideSelectRegion"
          component={GuideSelectRegionScreen}
        />
        <HomeStack.Screen
          name="PaymentGateway"
          component={PaymentGatewayScreen}
        />
        <HomeStack.Screen name="SelectCard" component={SelectCardScreen} />
      </HomeStack.Group>
      <HomeStack.Screen name="PaymentResult" component={PaymentResultScreen} />
      <HomeStack.Screen
        name="PurchaseDetail"
        component={PurchaseDetailScreen}
      />
    </HomeStack.Navigator>
  );
}

function CartStackComponent() {
  return (
    <CartStack.Navigator screenOptions={screenOptions}>
      <CartStack.Screen name="Cart" component={CartScreen} />
      <CartStack.Screen name="Payment" component={PaymentScreen} />
      <CartStack.Screen name="PymMethod" component={PymMethodScreen} />
      <CartStack.Screen name="SimpleText" component={SimpleTextScreen} />
      <CartStack.Screen name="PaymentResult" component={PaymentResultScreen} />
      <CartStack.Group screenOptions={{animationEnabled: true}}>
        <CartStack.Screen
          name="PaymentGateway"
          component={PaymentGatewayScreen}
        />
        <CartStack.Screen name="SelectCard" component={SelectCardScreen} />
      </CartStack.Group>
    </CartStack.Navigator>
  );
}

function EsimStackComponent() {
  return (
    <EsimStack.Navigator screenOptions={screenOptions}>
      <EsimStack.Screen name="Esim" component={EsimScreen} />
      <EsimStack.Screen name="Gift" component={GiftScreen} />
      <EsimStack.Screen name="RedirectHK" component={RedirectHKScreen} />
      <EsimStack.Screen name="Charge" component={ChargeScreen} />
      <EsimStack.Screen name="ChargeHistory" component={ChargeHistoryScreen} />
      <EsimStack.Screen name="ChargeDetail" component={ChargeDetailScreen} />
      <EsimStack.Screen name="QrInfo" component={QrInfoScreen} />
      <EsimStack.Screen name="UserGuideStep" component={UserGuideScreen} />
      <EsimStack.Screen name="Payment" component={PaymentScreen} />
      <EsimStack.Screen name="PymMethod" component={PymMethodScreen} />
      <EsimStack.Screen name="PaymentResult" component={PaymentResultScreen} />
      <EsimStack.Group screenOptions={{animationEnabled: true}}>
        <EsimStack.Screen
          name="PaymentGateway"
          component={PaymentGatewayScreen}
        />
        <EsimStack.Screen name="SelectCard" component={SelectCardScreen} />
      </EsimStack.Group>
    </EsimStack.Navigator>
  );
}

function MyPageStackComponent() {
  return (
    <MyPageStack.Navigator screenOptions={screenOptions}>
      <MyPageStack.Screen name="MyPage" component={MyPageScreen} />
      <MyPageStack.Screen
        name="PurchaseDetail"
        component={PurchaseDetailScreen}
      />
      <MyPageStack.Screen name="SimpleText" component={SimpleTextScreen} />
      <MyPageStack.Screen name="Recharge" component={RechargeScreen} />
      {/* <MyPageStack.Screen name="Pedometer" component={PedometerScreen} /> */}
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
      <MyPageStack.Screen
        name="ExtraCoupon"
        component={ExtraCouponScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <MyPageStack.Screen
        name="CashHistory"
        component={CashHistoryScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <MyPageStack.Group screenOptions={{animationEnabled: true}}>
        <MyPageStack.Screen
          name="PaymentGateway"
          component={PaymentGatewayScreen}
        />
        <MyPageStack.Screen name="SelectCard" component={SelectCardScreen} />
      </MyPageStack.Group>
    </MyPageStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
// screenOptions: {
//   tabBarStyle: { height: 300 },
// },
const TabNavigator = ({
  loggedIn,
  cart,
}: {
  loggedIn?: boolean;
  cart: CartModelState;
}) => {
  return (
    <Tab.Navigator
      screenOptions={{tabBarAllowFontScaling: false}}
      initialRouteName="HomeStack"
      backBehavior="initialRoute">
      <Tab.Screen
        name="HomeStack"
        component={HomeStackComponent}
        options={({route}) => ({
          headerShown: false,
          tabBarStyle: {
            display:
              (getFocusedRouteNameFromRoute(route) || 'Home') === 'Home'
                ? 'flex'
                : 'none',
          },
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
        component={loggedIn ? CartStackComponent : AuthStack}
        options={({route}) => ({
          headerShown: false,
          tabBarStyle: {
            display:
              !!loggedIn &&
              cart?.orderItems?.length === 0 &&
              (getFocusedRouteNameFromRoute(route) || 'Cart') === 'Cart'
                ? 'flex'
                : 'none',
          },
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
        component={loggedIn ? EsimStackComponent : AuthStack}
        options={({route}) => ({
          headerShown: false,
          tabBarStyle: {
            display:
              !!loggedIn &&
              (getFocusedRouteNameFromRoute(route) || 'Esim') === 'Esim'
                ? 'flex'
                : 'none',
          },
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
        component={loggedIn ? MyPageStackComponent : AuthStack}
        options={({route}) => ({
          headerShown: false,
          tabBarStyle: {
            display:
              !!loggedIn &&
              (getFocusedRouteNameFromRoute(route) || 'MyPage') === 'MyPage'
                ? 'flex'
                : 'none',
          },
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
  cart,
}))(TabNavigator);
