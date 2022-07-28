import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Badge, colors} from 'react-native-elements';
import {RootState} from '../redux';
import {appStyles} from '../constants/Styles';

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
    ...appStyles.bold12Text,
    paddingHorizontal: 0,
    color: colors.white,
  },
  location: {
    top: -4,
    right: -4,
    left: 0,
    bottom: 0,
  },
});

type WithBadgeOption = {
  top?: number;
  right?: number;
  left?: number;
  bottom?: number;
  hidden?: boolean;
};

const withBadge =
  (
    stateToProps: (v: RootState) => object,
    key: string,
    options?: WithBadgeOption,
  ) =>
  (WrappedComponent: React.ReactNode) => {
    const badge = (props) => {
      const badgeValue = props[key];
      const {hidden = !badgeValue} = options || {};

      return props.onPress ? (
        <TouchableOpacity onPress={props.onPress}>
          <View>
            <WrappedComponent {...props} />
            {!hidden && (
              <Badge
                textProps={{allowFontScaling: false}}
                badgeStyle={styles.badge}
                textStyle={styles.badgeText}
                value={badgeValue}
                status="error"
                // onPress={this.props.onPress}
                containerStyle={[
                  styles.badgeContainer,
                  options || styles.location,
                ]}
              />
            )}
          </View>
        </TouchableOpacity>
      ) : (
        <View>
          <WrappedComponent {...props} />
          {!hidden && (
            <Badge
              textProps={{allowFontScaling: false}}
              badgeStyle={styles.badge}
              textStyle={styles.badgeText}
              value={badgeValue}
              status="error"
              onPress={props.onPress}
              containerStyle={[
                styles.badgeContainer,
                options || styles.location,
              ]}
            />
          )}
        </View>
      );
    };

    return connect(stateToProps)(badge);
  };

export default withBadge;
