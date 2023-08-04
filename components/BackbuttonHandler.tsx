import React from 'react';
import {BackHandler} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {goBack} from '@/navigation/navigation';

type BackHandlerParam = {
  navigation: any;
  route?: any;
  onBack?: () => boolean;
};

export default function BackbuttonHandler({
  navigation,
  route,
  onBack,
}: BackHandlerParam) {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress =
        onBack ||
        (() => {
          goBack(navigation, route);
          return true;
        });

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => {
        backHandler.remove();
      };
    }, [navigation, onBack, route]),
  );

  return null;
}
