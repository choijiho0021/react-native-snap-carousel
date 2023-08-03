import React from 'react';
import {BackHandler} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

type BackHandlerParam = {
  navigation: any;
  onBack?: () => boolean;
};

export default function BackbuttonHandler({
  onBack = () => false,
}: BackHandlerParam) {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = onBack;

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => {
        backHandler.remove();
      };
    }, [onBack]),
  );

  return null;
}
