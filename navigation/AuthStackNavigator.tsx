import React, {memo} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignupScreen from '@/screens/RegisterMobileScreen/Signup';
import SimpleTextScreen from '@/screens/SimpleTextScreen';
import RegisterMobileScreen from '@/screens/RegisterMobileScreen';

// const AuthStack = createStackNavigator({ RegisterMobile: RegisterMobileScreen, SimpleTextForAuth: SimpleTextScreen });

const Auth = createStackNavigator();

function authStack() {
  return (
    <Auth.Navigator screenOptions={{headerShown: false}}>
      <Auth.Screen name="RegisterMobile" component={RegisterMobileScreen} />
      <Auth.Group
        screenOptions={{animationEnabled: true, presentation: 'modal'}}>
        <Auth.Screen name="Signup" component={SignupScreen} />
        <Auth.Screen name="SimpleTextForAuth" component={SimpleTextScreen} />
      </Auth.Group>
    </Auth.Navigator>
  );
}

export default memo(authStack);
