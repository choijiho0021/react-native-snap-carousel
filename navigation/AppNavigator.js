import React from 'react';
import Analytics from 'appcenter-analytics'
import * as cartActions from '../redux/modules/cart'
// import { createAppContainer, createSwitchNavigator } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';

import { createSwitchNavigator } from "@react-navigation/compat";

import MainTabNavigator from './MainTabNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import CodePushStack from './CodePushStackNavigator';

const getActiveRouteName = state => {
    const route = state.routes[state.index];
  
    if (route.state) {
      // Dive into nested navigators
      return getActiveRouteName(route.state);
    }
  
    return route.name;
  };

const SwitchNavigator = createSwitchNavigator({
    Main: MainTabNavigator,
    Auth: AuthStackNavigator,
    CodePush: CodePushStack
},
{
  initialRouteName: "Main",
  backBehavior: 'history',
  resetOnBlur: false
});

export default function createAppContainer(props) {
    const navigationRef = React.useRef();
  return (
      <NavigationContainer 
        ref={navigationRef} 
        onStateChange={(state) => {
            const lastTab = getActiveRouteName(state)
            Analytics.trackEvent('Page_View_Count', {page : lastTab})
            props.store.dispatch(cartActions.pushLastTab(lastTab))
        }}
      >
        <SwitchNavigator />
      </NavigationContainer>   
  );
}

// export default createAppContainer(
//   createSwitchNavigator({
//     // You could add another route here for authentication.
//     // Read more at https://reactnavigation.org/docs/en/auth-flow.html
//     Main: MainTabNavigator,
//     Auth: AuthStackNavigator,
//     CodePush: CodePushStack
//   }, {
//     initialRouteName: 'Main',
//     backBehavior: 'history',
//     resetOnBlur: false
//   })
// );
