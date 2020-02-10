import React from "react";
import {connect} from 'react-redux'
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Badge } from "react-native-elements";
import _ from 'underscore';

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

    /*
    shouldComponentUpdate(nextProps, nextState){

      if(nextProps.onPress != this.props.onPress){
        return true
      }

      if(typeof value === "function"){
        return value(this.props) != value(nextProps)
      }
      return false
    }
    */

    render() {
      const { top = -4, right = -4, left = 0, bottom = 0, ...badgeProps } = options;
      const badgeValue = typeof value === "function" ? value(this.props) : value;
      const {hidden = ! badgeValue} = options

      return (
        !_.isUndefined(this.props.onPress) ?
          <TouchableOpacity onPress={this.props.onPress}>
            <View>
              <WrappedComponent {...this.props} />
              {!hidden && (
                <Badge
                  badgeStyle={styles.badge}
                  textStyle={styles.badgeText}
                  value={badgeValue}
                  status="error"
                  // onPress={this.props.onPress}
                  containerStyle={[styles.badgeContainer, { top, right, left, bottom }]}
                  {...badgeProps}
                />
              )}
            </View>
          </TouchableOpacity> 
          :
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
