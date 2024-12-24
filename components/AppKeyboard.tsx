/**
 *  KT Robocare App version 1.0
 *
 *  Copyright ®œ 2022 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
import {useEffect, useState} from 'react';
import {Keyboard, KeyboardEvent, Platform} from 'react-native';
import {isDeviceSize} from '@/constants/SliderEntry.style';

const smallDevice = isDeviceSize('medium') || isDeviceSize('small');
const height = Platform.OS === 'android' ? 48.5 : smallDevice ? 50 : 83;

export const useKeyboard = (): [number] => {
  const [keyboardHeight, setKeyboardHeight] = useState(300);

  function onKeyboardDidShow(e: KeyboardEvent): void {
    setKeyboardHeight(e.endCoordinates.height - height);
  }

  // function onKeyboardDidHide(): void {
  //   setKeyboardHeight(0);
  // }

  useEffect(() => {
    const keyboardListener = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardDidShow,
    );
    // Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return (): void => {
      keyboardListener?.remove();
      // Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
    };
  }, []);

  return [keyboardHeight];
};
