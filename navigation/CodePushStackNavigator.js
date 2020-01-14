import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import CodePushScreen from '../screens/CodePushScreen';

const CodePushStack = createStackNavigator({ CodePushSync: CodePushScreen });

export default CodePushStack;