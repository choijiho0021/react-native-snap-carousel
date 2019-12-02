import React from "react";
import {connect} from 'react-redux'
import { StyleSheet, View } from "react-native";
import { Badge } from "react-native-elements";

const styles = StyleSheet.create({
  badge: {
    borderRadius: 9,
    height: 18,
    minWidth: 0,
    width: 18
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

    shouldComponentUpdate(nextProps, nextState){
      if(typeof value === "function"){
        return value(this.props) != value(nextProps)
      }
      return false
    }

    render() {
      const { top = -4, right = -4, left = 0, bottom = 0, ...badgeProps } = options;
      const badgeValue = typeof value === "function" ? value(this.props) : value;
      const onPress = this.props.onPress
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
              containerStyle={[styles.badgeContainer, { top, right, left, bottom }]}
              onPress={onPress}
              {...badgeProps}
            />
          )}
        </View>
      );
    }
  })
}

export default withBadge;
