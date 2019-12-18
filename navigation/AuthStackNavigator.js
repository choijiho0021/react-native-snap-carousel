import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import RegisterMobileScreen from '../screens/RegisterMobileScreen';
import SimpleTextScreen from '../screens/SimpleTextScreen';

const AuthStack = createStackNavigator({ RegisterMobile: RegisterMobileScreen, SimpleTextForAuth: SimpleTextScreen });

export default AuthStack;