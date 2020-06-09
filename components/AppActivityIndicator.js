import React, { PureComponent } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Layout from '../constants/Layout'
import { colors } from '../constants/Colors';

const styles = StyleSheet.create({
  indicator: {
    position: "absolute",
    zIndex: 100,
    alignSelf:'center'
  },
});

class AppActivityIndicator extends PureComponent {
  render() {
    const {size = 'large', visible = true } = this.props,
      width = size == 'large' ? 36 : 20,
      position = {
        left:Layout.window.width/2 - width/2, 
        top:Layout.window.height/2 - width/2
      }

    return <ActivityIndicator style={[styles.indicator, position]} animating={visible} size={size} color={colors.clearBlue}/>
  }
}

export default AppActivityIndicator

