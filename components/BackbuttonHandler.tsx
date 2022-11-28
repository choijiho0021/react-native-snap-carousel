import React from 'react';
import {BackHandler} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

export default function BackbuttonHandler({navigation, back}) {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (back) {
          navigation.navigate(back);
        } else {
          navigation.goBack();
        }
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => {
        backHandler.remove();
      };
    }, [navigation, back]),
  );

  return null;
}
