import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterMobileScreen from '../screens/RegisterMobileScreen';
import SimpleTextScreen from '../screens/SimpleTextScreen';

// const AuthStack = createStackNavigator({ RegisterMobile: RegisterMobileScreen, SimpleTextForAuth: SimpleTextScreen });

const AuthStack = createStackNavigator();

function authStack() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="RegisterMobile" component={RegisterMobileScreen} />
      <AuthStack.Screen name="SimpleTextForAuth" component={SimpleTextScreen} />
    </AuthStack.Navigator>
  );
}

export default authStack;