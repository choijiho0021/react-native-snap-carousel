import React from "react";
import {connect} from 'react-redux'
import { StyleSheet, View } from "react-native";
import { Badge } from "react-native-elements";

const styles = StyleSheet.create({
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

const withBadge = (value, options = {}, stateToProps=() => ({})) => WrappedComponent => {
  return connect(stateToProps)(
  class extends React.Component {

    render() {
      const { top = -4, right = -4, left = 0, bottom = 0, ...badgeProps } = options;
      const badgeValue = typeof value === "function" ? value(this.props) : value;
      const {hidden = ! badgeValue} = options

      return (
        <View>
          <WrappedComponent {...this.props} />
          {!hidden && (
            <Badge
              badgeStyle={styles.badge}
              textStyle={styles.badgeText}
              value={badgeValue}
              status="error"
              onPress={this.props.onPress}
              containerStyle={[styles.badgeContainer, { top, right, left, bottom }]}
              {...badgeProps}
            />
          )}
        </View>
      );
    }
  })
}

export default withBadge;
