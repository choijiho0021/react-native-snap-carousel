import React, { Component } from 'react'
import { 
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux'
import AppIcon from './AppIcon';
import { Badge } from 'react-native-elements';

class AppCartButton extends Component {
  render() {
    const {cartItems, iconName, style, onPress} = this.props
    const top = -4, right = -4, left = 0, bottom = 0
    const hidden = ! cartItems 

    return (
      <TouchableOpacity onPress={onPress}>
        <AppIcon name={iconName || "btnCart"} style={[style, styles.icon]}/>
        {!hidden && (
          <Badge
            badgeStyle={styles.badge}
            textStyle={styles.badgeText}
            value={cartItems}
            status="error"
            onPress={onPress}
            containerStyle={[styles.badgeContainer, { top, right, left, bottom }]}
          />
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center'
  },
  badge: {
    borderRadius: 9,
    height: 18,
    minWidth: 0,
    paddingLeft:5,
    paddingRight:5
    // width: 18
  },
  badgeContainer: {
    position: "absolute"
  },
  badgeText: {
    fontSize: 10,
    paddingHorizontal: 0
  }
});
const mapStateToProps = (state) => ({
  cartItems: (state.cart.get('orderItems') || []).reduce((acc,cur) => acc + cur.qty, 0)
})

export default connect(mapStateToProps)(AppCartButton)
