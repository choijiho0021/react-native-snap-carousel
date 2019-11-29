import React from 'react';
import Constants from 'expo-constants';
import _ from 'underscore'

export default function MyAppLoading({startAsync, onError, onFinish}) {
    /*
  if ( Constants.appOwnership === 'expo') {
    const AppLoading = require('expo').AppLoading
    return (
      <AppLoading startAsync={startAsync} onError={onError} onFinish={onFinish} />
    )
  }
    */

  if ( _.isFunction(startAsync)) {
    startAsync()
    onFinish()
  }

  return null
}

