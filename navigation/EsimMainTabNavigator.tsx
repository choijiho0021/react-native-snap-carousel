import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {RootState} from '@/redux';
import {CartModelState} from '@/redux/modules/cart';
import {ModalModelState} from '@/redux/modules/modal';
import AccountSettingsScreen from '@/screens/AccountSettingsScreen';
import AddOnScreen from '@/screens/AddOnScreen';
import BoardMsgRespScreen from '@/screens/BoardMsgRespScreen';
import EventResultScreen from '@/screens/BoardScreen/ResultScreen';
import CancelOrderScreen from '@/screens/CancelOrderScreen';
import CancelResultScreen from '@/screens/CancelOrderScreen/CancelResult';
import CartScreen from '@/screens/CartScreen';
import CashHistoryScreen from '@/screens/CashHistoryScreen';
import ChangeEmailScreen from '@/screens/ChangeEmailScreen';
import ChargeAgreementScreen from '@/screens/ChargeAgreementScreen';
import ChargeDetailScreen from '@/screens/ChargeDetailScreen';
import ChargeHistoryScreen from '@/screens/ChargeHistoryScreen';
import ChargeScreen from '@/screens/ChargeScreen';
import ChargeTypeScreen from '@/screens/ChargeTypeScreen';
import ContactBoardScreen from '@/screens/ContactBoardScreen';
import ContactScreen from '@/screens/ContactScreen';
import CountryScreen from '@/screens/CountryScreen';
import CouponScreen from '@/screens/CouponScreen';
import DraftScreen from '@/screens/DraftScreen';
import DraftResultScreen from '@/screens/DraftScreen/DraftResult';
import DraftUsScreen from '@/screens/DraftUsScreen';
import EsimScreen from '@/screens/EsimScreen';
import EventBoardScreen from '@/screens/EventBoardScreen';
import ExtraCouponScreen from '@/screens/ExtraCouponScreen';
import FaqScreen from '@/screens/FaqScreen';
import GiftGuideScreen from '@/screens/GiftGuideScreen';
import GiftScreen from '@/screens/GiftScreen';
import HomeScreenEsim from '@/screens/HomeScreen/Esim';
import InvitePromoScreen from '@/screens/InvitePromoScreen';
import InviteScreen from '@/screens/InviteScreen/index';
import LotteryScreen from '@/screens/LotteryScreen';
import MyPageScreen from '@/screens/MyPageScreen/index';
import NotiScreen from '@/screens/NotiScreen';
import PaymentGatewayScreen from '@/screens/PaymentGatewayScreen';
import PaymentResultScreen from '@/screens/PaymentResultScreen';
import PaymentVBankScreen from '@/screens/PaymentVBankScreen';
import ProductDetailOpScreen from '@/screens/ProductDetailOpScreen';
import ProductDetailScreen from '@/screens/ProductDetailScreen';
import PurchaseDetailScreen from '@/screens/PurchaseDetailScreen';
import PymMethodScreen from '@/screens/PymMethodScreen';
import QrInfoScreen from '@/screens/QrInfoScreen';
import ReceiptScreen from '@/screens/ReceiptScreen';
import RechargeScreen from '@/screens/RechargeScreen';
import RedirectHKScreen from '@/screens/RedirectHKScreen';
import RegisterMobileScreen from '@/screens/RegisterMobileScreen';
import ResignScreen from '@/screens/ResignScreen';
import RkbTalk from '@/screens/RkbTalk';
import SelectCoupon from '@/screens/SelectCouponScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import SimpleTextScreen from '@/screens/SimpleTextScreen';
import StoreSearchScreen from '@/screens/StoreSearch';
import TalkContact from '@/screens/TalkContact';
import TutorialScreen from '@/screens/TutorialScreen';
import UserGuideScreen from '@/screens/UserGuideScreen';
import GlobalGuideScreen from '@/screens/UserGuideScreen/global/GlobalGuide';
import GuideHomeScreen from '@/screens/UserGuideScreen/GuideHomeScreen';
import GuideSelectRegionScreen from '@/screens/UserGuideScreen/GuideSelectRegionScreen';
import i18n from '@/utils/i18n';
import AuthStack from './AuthStackNavigator';
import BadgedIcon from './component/BadgedIcon';
import {HomeStackParamList} from './navigation';
import AuthGatewayScreen from '@/screens/RkbTalk/component/AuthGatewayScreen';
import TalkRewardScreen from '@/screens/RkbTalk/component/TalkRewardScreen';

const {esimGlobal} = Env.get();

const styles = StyleSheet.create({
  tabBarIcon: {
    marginTop: 5,
  },
});

const HomeStack = createStackNavigator<HomeStackParamList>();
const CartStack = createStackNavigator();
const EsimStack = createStackNavigator();
const TalkStack = createStackNavigator();
const MyPageStack = createStackNavigator();

const screenOptions = {
  animationEnabled: true,
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
  },
  headerShown: false,
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
    <HomeStack.Navigator screenOptions={{...screenOptions}}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreenEsim}
        options={{
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerStyle: {
            shadowColor: 'transparent',
          },
        }}
      />

      <HomeStack.Screen name="SimpleTextModal" component={SimpleTextScreen} />
      <HomeStack.Screen name="Tutorial" component={TutorialScreen} />
      <HomeStack.Screen name="StoreSearch" component={StoreSearchScreen} />
      <HomeStack.Screen name="Cart" component={CartScreen} />
      <HomeStack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <HomeStack.Screen
        name="ProductDetailOp"
        component={ProductDetailOpScreen}
      />
      <HomeStack.Screen name="Noti" component={NotiScreen} />
      <HomeStack.Screen name="SimpleText" component={SimpleTextScreen} />
      <HomeStack.Screen name="Contact" component={ContactScreen} />

      <HomeStack.Screen name="ContactBoard" component={ContactBoardScreen} />
      <HomeStack.Screen name="EventBoard" component={EventBoardScreen} />
      <HomeStack.Screen name="EventResult" component={EventResultScreen} />

      <HomeStack.Screen name="GiftGuide" component={GiftGuideScreen} />
      <HomeStack.Screen name="Invite" component={InviteScreen} />
      <HomeStack.Screen name="InvitePromo" component={InvitePromoScreen} />
      <HomeStack.Screen name="BoardMsgResp" component={BoardMsgRespScreen} />
      <HomeStack.Screen name="Faq" component={FaqScreen} />
      <HomeStack.Screen name="Country" component={CountryScreen} />
      <HomeStack.Screen name="PymMethod" component={PymMethodScreen} />
      <HomeStack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
      <HomeStack.Group
        screenOptions={{animationEnabled: true, presentation: 'modal'}}>
        <HomeStack.Screen name="SelectCoupon" component={SelectCoupon} />
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
        <HomeStack.Screen name="PaymentVBank" component={PaymentVBankScreen} />
      </HomeStack.Group>
      <HomeStack.Screen name="PaymentResult" component={PaymentResultScreen} />
      <HomeStack.Screen
        name="PurchaseDetail"
        component={PurchaseDetailScreen}
      />
      <HomeStack.Screen name="ExtraCoupon" component={ExtraCouponScreen} />
      <HomeStack.Screen name="Draft" component={DraftScreen} />
      <HomeStack.Screen name="DraftUs" component={DraftUsScreen} />
      <HomeStack.Screen name="DraftResult" component={DraftResultScreen} />
      <HomeStack.Screen name="CancelOrder" component={CancelOrderScreen} />
      <HomeStack.Screen name="CancelResult" component={CancelResultScreen} />
      <HomeStack.Screen name="Receipt" component={ReceiptScreen} />

      <HomeStack.Screen name="Coupon" component={CouponScreen} />

      <HomeStack.Screen
        name="RegisterMobile"
        component={RegisterMobileScreen}
      />
    </HomeStack.Navigator>
  );
}

function CartStackComponent() {
  return (
    <CartStack.Navigator screenOptions={screenOptions}>
      <CartStack.Screen name="Cart" component={CartScreen} />
      <CartStack.Screen name="PymMethod" component={PymMethodScreen} />
      <CartStack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
      <CartStack.Screen name="SimpleText" component={SimpleTextScreen} />
      <CartStack.Group
        screenOptions={{animationEnabled: true, presentation: 'modal'}}>
        <CartStack.Screen name="SelectCoupon" component={SelectCoupon} />
        <CartStack.Screen name="SimpleTextModal" component={SimpleTextScreen} />
      </CartStack.Group>
      <CartStack.Screen name="PaymentResult" component={PaymentResultScreen} />
      <CartStack.Screen name="Invite" component={InviteScreen} />
      <CartStack.Group screenOptions={{animationEnabled: true}}>
        <CartStack.Screen
          name="PaymentGateway"
          component={PaymentGatewayScreen}
        />
        <CartStack.Screen name="PaymentVBank" component={PaymentVBankScreen} />
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
      <EsimStack.Group
        screenOptions={{animationEnabled: true, presentation: 'modal'}}>
        <EsimStack.Screen name="SimpleTextModal" component={SimpleTextScreen} />
        <EsimStack.Screen name="SelectCoupon" component={SelectCoupon} />
      </EsimStack.Group>
      <EsimStack.Screen name="ChargeType" component={ChargeTypeScreen} />
      <EsimStack.Screen name="Charge" component={ChargeScreen} />
      <EsimStack.Screen name="AddOn" component={AddOnScreen} />

      <EsimStack.Screen name="TalkReward" component={TalkRewardScreen} />

      <EsimStack.Screen name="Faq" component={FaqScreen} />
      <EsimStack.Screen
        name="ChargeAgreement"
        component={ChargeAgreementScreen}
      />
      <EsimStack.Screen name="ChargeHistory" component={ChargeHistoryScreen} />
      <EsimStack.Screen name="ChargeDetail" component={ChargeDetailScreen} />
      <EsimStack.Screen name="QrInfo" component={QrInfoScreen} />
      <EsimStack.Group screenOptions={{animationEnabled: true}}>
        <EsimStack.Screen name="UserGuideStep" component={UserGuideScreen} />
        <EsimStack.Screen
          name="UserGuide"
          component={esimGlobal ? GlobalGuideScreen : GuideHomeScreen}
        />
        <EsimStack.Screen
          name="UserGuideSelectRegion"
          component={GuideSelectRegionScreen}
        />
      </EsimStack.Group>
      <EsimStack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <EsimStack.Screen name="Cart" component={CartScreen} />
      <EsimStack.Screen
        name="ProductDetailOp"
        component={ProductDetailOpScreen}
      />
      <EsimStack.Screen name="PymMethod" component={PymMethodScreen} />
      <EsimStack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
      <EsimStack.Screen name="PaymentResult" component={PaymentResultScreen} />
      <EsimStack.Group screenOptions={{animationEnabled: true}}>
        <EsimStack.Screen
          name="PaymentGateway"
          component={PaymentGatewayScreen}
        />
        <EsimStack.Screen name="PaymentVBank" component={PaymentVBankScreen} />
        <EsimStack.Screen name="Lottery" component={LotteryScreen} />
      </EsimStack.Group>
    </EsimStack.Navigator>
  );
}

function TalkStackComponent() {
  return (
    <TalkStack.Navigator screenOptions={screenOptions}>
      <TalkStack.Screen name="RkbTalk" component={RkbTalk} />
      <TalkStack.Screen name="AuthGateway" component={AuthGatewayScreen} />
      <TalkStack.Screen name="TalkReward" component={TalkRewardScreen} />
      <TalkStack.Screen name="TalkContact" component={TalkContact} />
    </TalkStack.Navigator>
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
      <MyPageStack.Group
        screenOptions={{animationEnabled: true, presentation: 'modal'}}>
        <MyPageStack.Screen
          name="SimpleTextModal"
          component={SimpleTextScreen}
        />
        <MyPageStack.Screen name="SelectCoupon" component={SelectCoupon} />
      </MyPageStack.Group>
      <MyPageStack.Screen name="Recharge" component={RechargeScreen} />
      {/* <MyPageStack.Screen name="Pedometer" component={PedometerScreen} /> */}
      <MyPageStack.Screen name="Invite" component={InviteScreen} />
      <MyPageStack.Screen name="InvitePromo" component={InvitePromoScreen} />
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
      <MyPageStack.Screen name="CashHistory" component={CashHistoryScreen} />
      <MyPageStack.Screen name="Draft" component={DraftScreen} />
      <MyPageStack.Screen name="DraftUs" component={DraftUsScreen} />
      <MyPageStack.Screen name="DraftResult" component={DraftResultScreen} />
      <MyPageStack.Screen name="CancelOrder" component={CancelOrderScreen} />
      <MyPageStack.Screen name="CancelResult" component={CancelResultScreen} />
      <MyPageStack.Screen name="Coupon" component={CouponScreen} />

      <MyPageStack.Group screenOptions={{animationEnabled: true}}>
        <MyPageStack.Screen
          name="PaymentGateway"
          component={PaymentGatewayScreen}
        />
        <MyPageStack.Screen
          name="PaymentVBank"
          component={PaymentVBankScreen}
        />
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
  modal,
}: {
  loggedIn?: boolean;
  cart: CartModelState;
  modal: ModalModelState;
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
            height: 83,
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
            height: 83,
            display:
              !!loggedIn &&
              cart?.cartItems?.length === 0 &&
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
            height: 83,
            display:
              !!loggedIn &&
              modal.showTabbar &&
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
        name="TalkStack"
        component={loggedIn ? TalkStackComponent : AuthStack}
        options={({route}) => ({
          headerShown: false,
          tabBarStyle: {
            height: 83,
            display:
              !!loggedIn &&
              ['RkbTalk', 'TalkContact'].includes(
                getFocusedRouteNameFromRoute(route) || 'RkbTalk',
              )
                ? 'flex'
                : 'none',
          },
          tabBarLabel: ({focused}) => tabBarLabel(focused, 'talk'),
          tabBarIcon: ({focused}) => (
            <AppIcon
              focused={focused}
              name="btnCall"
              style={styles.tabBarIcon}
            />
          ),
        })}
      />
      <Tab.Screen
        name="MyPageStack"
        listeners={({navigation, route}) => ({
          tabPress: (e) => {
            navigation.navigate('MyPageStack', {screen: 'MyPage'});

            // 기본 이벤트 중단
            e.preventDefault();
          },
        })}
        component={loggedIn ? MyPageStackComponent : AuthStack}
        options={({route}) => ({
          headerShown: false,
          tabBarStyle: {
            height: 83,
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

export default connect(({account, cart, modal}: RootState) => ({
  loggedIn: account.loggedIn,
  cart,
  modal,
}))(TabNavigator);
