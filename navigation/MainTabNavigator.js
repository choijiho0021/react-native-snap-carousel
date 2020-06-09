import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {connect} from 'react-redux'
import * as cartActions from '../redux/modules/cart'
import { bindActionCreators } from 'redux'

import {appStyles} from '../constants/Styles'
import AppButton from '../components/AppButton'
import AppIcon from '../components/AppIcon';

import HomeScreen from '../screens/HomeScreen';
import MySimScreen from '../screens/MySimScreen';

import StoreScreen from '../screens/StoreScreen';
import CountryScreen from '../screens/CountryScreen';
import RegisterSimScreen from '../screens/RegisterSimScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';

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
import ContactScreen from '../screens/ContactScreen';
import ContactBoardScreen from '../screens/ContactBoardScreen';
import PymMethodScreen from '../screens/PymMethodScreen';
import FindAddressScreen from '../screens/FindAddressScreen';
import CustomerProfileScreen from '../screens/CustomerProfileScreen';
import AddProfileScreen from '../screens/AddProfileScreen';
import StoreSearchScreen from '../screens/StoreSearchScreen';
import BoardMsgRespScreen from '../screens/BoardMsgRespScreen';
import SimpleTextScreen from '../screens/SimpleTextScreen';
import UsimScreen from '../screens/UsimScreen';
import FaqScreen from '../screens/FaqScreen';
import GuideScreen from '../screens/GuideScreen';
import { colors } from '../constants/Colors';
import UsageDetailScreen from '../screens/UsageDetailScreen';

import Analytics from 'appcenter-analytics'

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {
    defaultNavigationOptions: {
      headerStyle: {
        height: 56,
        shadowColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
        borderBottomWidth: 0 
      },
    },
  },
});

const HomeStack = createStackNavigator();
const StoreStack = createStackNavigator();
const CartStack = createStackNavigator();
const UsimStack = createStackNavigator();
const MyPageStack = createStackNavigator();

const BadgeAppButton = withBadge(({notReadNoti}) => notReadNoti, 
  {badgeStyle:{right:-3,top:0}},
  (state) => ({notReadNoti: state.noti.get('notiList').filter(elm=> elm.isRead == 'F').length }))(AppButton)

function homeStack() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={({navigation}) => {
          return ({
          title: null,
          headerLeft : () =>  (<Text style={styles.title}>{i18n.t('appTitle')}</Text>),
          headerRight: () => (
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <AppButton key="cnter" style={styles.btnCnter} 
                onPress={() => navigation.navigate('Contact')} 
                iconName="btnCnter" />
      
              {/* //BadgeAppButton을 사용했을 때 위치가 변동됨 수정이 필요함 */}
              <BadgeAppButton key="alarm" style={styles.btnAlarm} 
                onPress={() => navigation.navigate('Noti', {mode:'noti'})} 
                iconName="btnAlarm" />
            </View>
          )
          })}}/>
      <HomeStack.Screen name="Recharge" component={RechargeScreen} />
      <HomeStack.Screen name="RegisterSim" component={RegisterSimScreen} />
      <HomeStack.Screen name="NewSim" component={NewSimScreen} />
      <HomeStack.Screen name="Noti" component={NotiScreen} />
      <HomeStack.Screen name="SimpleText" component={SimpleTextScreen} />
      <HomeStack.Screen name="Contact" component={ContactScreen} />
      <HomeStack.Screen name="ContactBoard" component={ContactBoardScreen} />
      <HomeStack.Screen name="BoardMsgResp" component={BoardMsgRespScreen} />
      <HomeStack.Screen name="Faq" component={FaqScreen} />
      <HomeStack.Screen name="Guide" component={GuideScreen} />

      <HomeStack.Screen name="Country" component={CountryScreen} />
      <HomeStack.Screen name="Payment" component={PaymentScreen} />
      <HomeStack.Screen name="PymMethod" component={SettingsScreen} />
      <HomeStack.Screen name="FindAddress" component={FindAddressScreen} />
      <HomeStack.Screen name="PaymentResult" component={PaymentResultScreen}/>
      <HomeStack.Screen name="CustomerProfile" component={CustomerProfileScreen} />
      <HomeStack.Screen name="AddProfile" component={AddProfileScreen} />
      <HomeStack.Screen name="PurchaseDetail" component={PurchaseDetailScreen} />
    </HomeStack.Navigator>
  );
}

function storeStack() {
  return (
    <StoreStack.Navigator>
      <StoreStack.Screen name="Store" component={StoreScreen} />
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
    <CartStack.Navigator>
      <CartStack.Screen name="Cart" component={CartScreen} />
      <CartStack.Screen name="Payment" component={PaymentScreen} />
      <CartStack.Screen name="PymMethod" component={PymMethodScreen} />
      <CartStack.Screen name="FindAddress" component={FindAddressScreen} />
      <CartStack.Screen name="SimpleText" component={SimpleTextScreen} />
      <CartStack.Screen name="PaymentResult" component={PaymentResultScreen} />
      <CartStack.Screen name="CustomerProfile" component={CustomerProfileScreen} />
      <CartStack.Screen name="AddProfile" component={AddProfileScreen} />
    </CartStack.Navigator>
  );
}

function usimStack() {
  return (
    <UsimStack.Navigator>
      <UsimStack.Screen name="Usim" component={UsimScreen} />
      <UsimStack.Screen name="UsageDetail" component={UsageDetailScreen} />

      {/* // 충전 관련 화면 */}
      <UsimStack.Screen name="Recharge" component={RechargeScreen} />
      <UsimStack.Screen name="Payment" component={PaymentScreen} />
      <UsimStack.Screen name="PymMethod" component={PymMethodScreen} />
      <UsimStack.Screen name="SimpleText" component={SimpleTextScreen} />
      <UsimStack.Screen name="PaymentResult" component={PaymentResultScreen} />
      <UsimStack.Screen name="RegisterSim" component={FaqScreen} />
    </UsimStack.Navigator>
  );
}

function myPageStack() {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen name="MyPage" component={MyPageScreen} />
      <MyPageStack.Screen name="PurchaseDetail" component={PurchaseDetailScreen} />
      <MyPageStack.Screen name="SimpleText" component={SimpleTextScreen} />

      <MyPageStack.Screen name="ContactBoard" component={ContactBoardScreen} />
      <MyPageStack.Screen name="BoardMsgResp" component={BoardMsgRespScreen} />

      <MyPageStack.Screen name="Recharge" component={RechargeScreen} />
      <MyPageStack.Screen name="Payment" component={PaymentScreen} />
      <MyPageStack.Screen name="PymMethod" component={PymMethodScreen} />
      <MyPageStack.Screen name="PaymentResult" component={PaymentScreen} />

      <MyPageStack.Screen name="RegisterSim" component={PymMethodScreen} />

      <MyPageStack.Screen name="Settings" component={PaymentResultScreen} />
      <MyPageStack.Screen name="MySim" component={PaymentResultScreen} />
    </MyPageStack.Navigator>
  );
}


// const HomeStack = createStackNavigator(
//   {
//     Home: HomeScreen,
//     Recharge: RechargeScreen,
//     RegisterSim: RegisterSimScreen,
//     NewSim: NewSimScreen,
//     Noti: NotiScreen,
//     SimpleText: SimpleTextScreen,
//     Contact: ContactScreen,
//     ContactBoard: ContactBoardScreen,
//     BoardMsgResp: BoardMsgRespScreen,
//     Faq: FaqScreen,
//     Guide: GuideScreen,

//     Country: CountryScreen,
//     // SIM card 바로 구매와 관련된 화면
//     Payment: PaymentScreen,
//     PymMethod: PymMethodScreen,
//     FindAddress: FindAddressScreen,
//     PaymentResult: {
//       screen:PaymentResultScreen,
//       navigationOptions: {
//         gesturesEnabled: false 
//       },
//     },
//     CustomerProfile: CustomerProfileScreen,
//     AddProfile: AddProfileScreen,
//     PurchaseDetail: PurchaseDetailScreen,
//   },
//   config
// );

// HomeStack.navigationOptions = ({navigation}) => ({
//   tabBarVisible: navigation.state.index == 0,
//   tabBarLabel: i18n.t('home'),
//   tabBarIcon: ({ focused }) => (
//     <AppIcon focused={focused} name="btnHome" style={styles.tabBarIcon}/>
//   ),
// })

// HomeStack.path = '';

// const StoreStack = createStackNavigator(
//   {
//     Store: StoreScreen,
//     StoreSearch: StoreSearchScreen,
//     RegisterSim: RegisterSimScreen,
//     Country: CountryScreen,
//     NewSim: NewSimScreen,
//     SimpleText: SimpleTextScreen,
//     ProductDetail: ProductDetailScreen,
//     Faq: FaqScreen,

//     // Roaming Product 바로 구매와 관련된 화면
//     Payment: PaymentScreen,
//     PymMethod: PymMethodScreen,
//     PaymentResult: {
//       screen:PaymentResultScreen,
//       navigationOptions: {
//         gesturesEnabled: false 
//       },
//     },
//   },
//   config, 
// );

// StoreStack.navigationOptions =  ({navigation}) => ({
//   tabBarVisible: navigation.state.index == 0,
//   tabBarLabel: i18n.t('store'),
//   tabBarIcon: ({ focused }) => (
//     <AppIcon focused={focused} name="btnStore" style={styles.tabBarIcon}/>
//   ),
// })

// StoreStack.path = '';

// const UsimStack = createStackNavigator(
//   {
//     Usim: UsimScreen,
//     UsageDetail: UsageDetailScreen,
    
//     // 충전 관련 화면
//     Recharge: RechargeScreen,
//     Payment: PaymentScreen,
//     PymMethod: PymMethodScreen,
//     SimpleText: SimpleTextScreen,
//     PaymentResult: {
//       screen:PaymentResultScreen,
//       navigationOptions: {
//         gesturesEnabled: false 
//       },
//     },

//     // SIM 카드 등록 화면
//     RegisterSim: {
//     screen: RegisterSimScreen,
//       navigationOptions: {
//         gesturesEnabled: false 
//       },
//     },

//   },
//   config
// );

// UsimStack.navigationOptions = ({navigation}) => ({
//   tabBarVisible: navigation.state.index == 0,
//   tabBarLabel: i18n.t('usim'),
//   tabBarIcon: ({ focused }) => (
//     <AppIcon focused={focused} name="btnUsim" style={styles.tabBarIcon}/>
//   ),
// })

// const MyPageStack = createStackNavigator(
//   {
//     MyPage: MyPageScreen,
//     PurchaseDetail: PurchaseDetailScreen,
//     SimpleText: SimpleTextScreen,
    
//     // 문의내역
//     ContactBoard: ContactBoardScreen,
//     BoardMsgResp: BoardMsgRespScreen,

//     // 충전 관련 화면
//     Recharge: RechargeScreen,
//     Payment: PaymentScreen,
//     PymMethod: PymMethodScreen,
//     PaymentResult: {
//       screen:PaymentResultScreen,
//       navigationOptions: {
//         gesturesEnabled: false 
//       },
//     },

//     // SIM 카드 등록 화면
//     RegisterSim: RegisterSimScreen,

//     //Settings 관련 화면
//     Settings: SettingsScreen,
//     MySim: MySimScreen
//   },
//   config
// );

// MyPageStack.navigationOptions = ({navigation}) => ({
//   tabBarVisible: navigation.state.index == 0,
//   tabBarLabel: i18n.t('mypage'),
//   tabBarIcon: ({ focused }) => (
//     <AppIcon focused={focused} name="btnMypage" style={styles.tabBarIcon}/>
//   )
// })

// MyPageStack.path = '';

// const CartStack = createStackNavigator(
//   {
//     Cart: CartScreen,
//     Payment: PaymentScreen,
//     PymMethod: PymMethodScreen,
//     FindAddress: FindAddressScreen,
//     SimpleText: SimpleTextScreen,
//     PaymentResult: {
//       screen:PaymentResultScreen,
//       navigationOptions: {
//         gesturesEnabled: false 
//       },
//     },
//     CustomerProfile: CustomerProfileScreen,
//     AddProfile: AddProfileScreen,
//   },
//   config
// );

// // redux store에서 cart에 추가된 상품 개수를 읽어서 배지에 표시한다.
// //
// const BadgedIcon = withBadge(({cartItems}) => cartItems, {badgeStyle : {top:4, left:8}}, 
//   (state) => ({
//     cartItems: (state.cart.get('orderItems') || []).reduce((acc,cur) => acc + cur.qty, 0)
//   }))(AppIcon)

// CartStack.navigationOptions = {
//   tabBarVisible: false,
//   tabBarLabel: i18n.t('cart'),
//   tabBarIcon: ({ focused }) => (
//     <BadgedIcon focused={focused} name="btnCart" style={styles.tabBarIcon}/>
//   ),
// }

// CartStack.path = '';


// redux store에서 cart에 추가된 상품 개수를 읽어서 배지에 표시한다.
//
const BadgedIcon = withBadge(({cartItems}) => cartItems, {badgeStyle : {top:4, left:8}}, 
  (state) => ({
    cartItems: (state.cart.get('orderItems') || []).reduce((acc,cur) => acc + cur.qty, 0)
  }))(AppIcon)

const TabNavigator = createBottomTabNavigator();

function tabNavigator() {
  return (
    <TabNavigator.Navigator>
      <TabNavigator.Screen 
        name="Home" 
        component={homeStack} 
        options={({route}) => ({
          tabBarVisible: route.state && route.state.index == 0,
          tabBarLabel: i18n.t('home'),
          tabBarIcon: ({ focused }) => (
            <AppIcon focused={focused} name="btnHome" style={styles.tabBarIcon}/>
          )
        })}
      />
      <TabNavigator.Screen 
        name="Store" 
        component={storeStack}
        options={({route}) => ({
          tabBarVisible: route.state && route.state.index == 0,
          tabBarLabel: i18n.t('store'),
          tabBarIcon: ({ focused }) => (
            <AppIcon focused={focused} name="btnStore" style={styles.tabBarIcon}/>
        )})}
      />
      <TabNavigator.Screen 
        name="Cart" 
        component={cartStack}
        options={({route}) => ({
          tabBarVisible: false,
          tabBarLabel: i18n.t('cart'),
          tabBarIcon: ({ focused }) => (
            <BadgedIcon focused={focused} name="btnCart" style={styles.tabBarIcon}/>
          )})}
        />
      <TabNavigator.Screen 
        name="Usim" 
        component={usimStack}
        options={({route}) => ({
          tabBarVisible: route.state && route.state.index == 0,
          tabBarLabel: i18n.t('usim'),
          tabBarIcon: ({ focused }) => (
            <AppIcon focused={focused} name="btnUsim" style={styles.tabBarIcon}/>
          )})}
        />
      <TabNavigator.Screen 
        name="MyPage" 
        component={myPageStack}
        options={({route}) => ({
          tabBarVisible: route.state && route.state.index == 0,
          tabBarLabel: i18n.t('mypage'),
          tabBarIcon: ({ focused }) => (
            <AppIcon focused={focused} name="btnMypage" style={styles.tabBarIcon}/>
          )})}
        />
    </TabNavigator.Navigator>
  );
}

// const TabNavigator = createBottomTabNavigator({
//   HomeStack,
//   StoreStack,
//   CartStack,
//   UsimStack,
//   MyPageStack,
// }, {
//   tabBarOptions: {
//     inactiveTintColor: colors.black,
//     labelStyle: {
//       marginTop: 0,
//       marginBottom:5
//     },
//     style: {
//       height: 56,
//     }
//   },
//   // safeAreaInset: {top: 'never', bottom:"always"},
// });

// TabNavigator.path = '';

const styles = StyleSheet.create({
  tabBarIcon: {
    marginTop: 5,
  },
  title: {
    ... appStyles.title,
    marginLeft: 20,
  },
  btnAlarm: {
    width: 40, 
    height: 40,
    marginRight: 10,
  },
  btnCnter: {
    width:40,
    height: 40,
    marginHorizontal: 18
  },
})
 
class AppTabNavigator extends React.Component {
  static router = TabNavigator.router

  componentDidUpdate(prevProps) {
    if ( prevProps.navigation.state != this.props.navigation.state) {
      const {navigation} = this.props,
        lastTab = navigation.state.routes[navigation.state.index].routeName

      if ( lastTab != this.props.lastTab[0]) {
        Analytics.trackEvent('Page_View_Count', {page : lastTab.substring(0,lastTab.length-5)})
        this.props.action.cart.pushLastTab(lastTab)
      }
    }
  }

  render() {
    const { navigation } = this.props

    return <tabNavigator navigation={navigation} />
  }
}

// export default connect((state) => ({
//   lastTab : state.cart.get('lastTab').toJS()
// }),
//   (dispatch) => ({
//     action:{
//       cart: bindActionCreators(cartActions, dispatch),
//     }
//   })
// )(AppTabNavigator)

export default tabNavigator