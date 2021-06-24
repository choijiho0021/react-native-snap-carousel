import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Badge} from 'react-native-elements';
import _ from 'underscore';

const styles = StyleSheet.create({
  badge: {
    borderRadius: 9,
    height: 18,
    minWidth: 0,
    paddingLeft: 5,
    paddingRight: 5,
    // width: 18
  },
  badgeContainer: {
    position: 'absolute',
  },
  badgeText: {
    fontSize: 10,
    paddingHorizontal: 0,
  },
});

type WithBadgeOption = {
  top: number;
  right: number;
  left: number;
  bottom: number;
  hidden?: boolean;
};

const withBadge = (
  value: any | ((x: any) => any),
  options: WithBadgeOption,
  stateToProps = () => ({}),
) => (WrappedComponent: React.ReactNode) => {
  const badge = (props) => {
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

    const {top = -4, right = -4, left = 0, bottom = 0, ...badgeProps} =
      options || {};
    const badgeValue = typeof value === 'function' ? value(props) : value;
    const {hidden = !badgeValue} = options;

    return !_.isUndefined(props.onPress) ? (
      <TouchableOpacity onPress={props.onPress}>
        <View>
          <WrappedComponent {...props} />
          {!hidden && (
            <Badge
              badgeStyle={styles.badge}
              textStyle={styles.badgeText}
              value={badgeValue}
              status="error"
              // onPress={this.props.onPress}
              containerStyle={[
                styles.badgeContainer,
                {top, right, left, bottom},
              ]}
              {...badgeProps}
            />
          )}
        </View>
      </TouchableOpacity>
    ) : (
      <View>
        <WrappedComponent {...props} />
        {!hidden && (
          <Badge
            badgeStyle={styles.badge}
            textStyle={styles.badgeText}
            value={badgeValue}
            status="error"
            onPress={props.onPress}
            containerStyle={[styles.badgeContainer, {top, right, left, bottom}]}
            {...badgeProps}
          />
        )}
      </View>
    );
  };

  return connect(stateToProps)(badge);
};

export default withBadge;
