import React, { PureComponent } from 'react'
import { 
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux'
import AppIcon from './AppIcon';
import { Badge } from 'react-native-elements';

class AppCartButton extends PureComponent {
  render() {
    const {cartItems, iconName, style, onPress} = this.props
    const hidden = ! cartItems 

    return (
      <TouchableOpacity onPress={onPress} style={style}>
        <AppIcon name={iconName || "btnCart"} style={styles.icon}/>
        {!hidden && (
          <Badge
            badgeStyle={styles.badge}
            textStyle={styles.badgeText}
            value={cartItems}
            status="error"
            onPress={onPress}
            containerStyle={[styles.badgeContainer, { top:-3, right:6}]}
          />
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
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
