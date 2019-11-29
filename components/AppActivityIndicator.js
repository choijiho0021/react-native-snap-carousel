import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import Layout from '../constants/Layout'

const styles = StyleSheet.create({
  indicator: {
    position: "absolute",
    zIndex: 100,
    alignSelf:'center'
  },
});

export default function AppActivityIndicator({visible = true, size="large"}) {
  const width = size == 'large' ? 36 : 20
  const position = {
    left:Layout.window.width/2 - width/2, 
    top:Layout.window.height/2 - width/2
  }

  if (visible) return (
      <ActivityIndicator style={[styles.indicator, position]} size={size} />
    )
  return null
}

