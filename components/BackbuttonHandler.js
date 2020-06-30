
import React from 'react';
import {
  BackHandler
} from 'react-native';
import _ from 'underscore'
import { useFocusEffect } from '@react-navigation/native';

export default function BackbuttonHandler({ navigation, back }) {
  useFocusEffect(
    React.useCallback(() => {

      const onBackPress = () => {
        if(back){
          console.log("aaaaa log",back)
          navigation.navigate(back)
        }
        else {
          navigation.goBack()
        }
        return true
      };
      
      let backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        backHandler.remove() 
      }

    },[navigation,back])
  );

  return null;
}