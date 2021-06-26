import React, {memo} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import RegisterMobileScreen from '@/screens/RegisterMobileScreen';
import SimpleTextScreen from '@/screens/SimpleTextScreen';

// const AuthStack = createStackNavigator({ RegisterMobile: RegisterMobileScreen, SimpleTextForAuth: SimpleTextScreen });

const Auth = createStackNavigator();

function authStack() {
  return (
    <Auth.Navigator>
      <Auth.Screen name="RegisterMobile" component={RegisterMobileScreen} />
      <Auth.Screen name="SimpleTextForAuth" component={SimpleTextScreen} />
    </Auth.Navigator>
  );
}

export default memo(authStack);
