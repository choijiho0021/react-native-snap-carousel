//  Created by Artem Bogoslavskiy on 7/5/18.

import {Dimensions, Platform} from 'react-native';

const {width, height} = Dimensions.get('window');

export function isIphoneX() {
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 || width === 812)
  );
}

export function ifIphoneX(iphoneXStyle, regularStyle) {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
}

export function isAndroid() {
  return Platform.OS === 'android';
}

export function ifAndroid(androidStyle, regularStyle) {
  if (isAndroid()) {
    return androidStyle;
  }
  return regularStyle;
}

const isFunction = (input) => typeof input === 'function';
export function renderIf(predicate) {
  return (elemOrThunk) => {
    if (predicate) {
      return isFunction(elemOrThunk) ? elemOrThunk() : elemOrThunk;
    }
    return null;
  };
}
