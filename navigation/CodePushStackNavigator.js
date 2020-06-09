import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CodePushScreen from '../screens/CodePushScreen';

// const CodePushStack = createStackNavigator({ CodePushSync: CodePushScreen });

const CodePushStack = createStackNavigator();

function codePushStack() {
  return (
    <CodePushStack.Navigator>
      <CodePushStack.Screen name="CodePushSync" component={CodePushScreen} />
    </CodePushStack.Navigator>
  );
}

export default codePushStack;