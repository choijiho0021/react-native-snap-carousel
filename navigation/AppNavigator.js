import React from 'react';
// import { createAppContainer, createSwitchNavigator } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';

import { createSwitchNavigator } from "@react-navigation/compat";

import MainTabNavigator from './MainTabNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import CodePushStack from './CodePushStackNavigator';

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

export default function createAppContainer() {
  return (
      <NavigationContainer>
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
