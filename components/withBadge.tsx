import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Pressable} from 'react-native';
import {RootState} from '@/redux';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import Badge from './Badge';

const miniSize = 8;

const styles = StyleSheet.create({
  miniBadge: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    minWidth: miniSize,
    height: miniSize,
    borderRadius: miniSize / 2,
  },
  text: {
    fontSize: 12,
    color: 'white',
    paddingHorizontal: 4,
  },
  badge: {
    borderRadius: 9,
    height: 18,
    minWidth: 0,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: colors.tomato,
    // width: 18
  },
  badgeContainer: {
    position: 'absolute',
  },
  badgeText: {
    ...appStyles.bold12Text,
    fontSize: 11,
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
        <Pressable onPress={props.onPress}>
          <View>
            <WrappedComponent {...props} />
            {!hidden && (
              <Badge
                badgeStyle={styles.badge}
                textStyle={styles.badgeText}
                value={badgeValue}
                onPress={props.onPress}
                containerStyle={[
                  styles.badgeContainer,
                  options || styles.location,
                ]}
              />
            )}
          </View>
        </Pressable>
      ) : (
        <View>
          <WrappedComponent {...props} />
          {!hidden && (
            <Badge
              badgeStyle={styles.badge}
              textStyle={styles.badgeText}
              value={badgeValue}
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
