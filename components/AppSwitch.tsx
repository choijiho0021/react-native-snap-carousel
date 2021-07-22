import React, {PureComponent} from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewProps,
} from 'react-native';
import _ from 'underscore';
import {colors} from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 30,
  },
  track: {
    borderRadius: 32,
    padding: 5,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 32,
  },
});

type AppSwitchProps = {
  waitFor: number;
  value: boolean;
  onPress: () => void;
  style?: StyleProp<ViewProps>;
};

type AppSwitchState = {
  animatedValue: Animated.Value;
  circlePosXStart: number;
  circlePosXEnd: number;
  waitFor: number;
};

export default class AppSwitch extends PureComponent<
  AppSwitchProps,
  AppSwitchState
> {
  clickable: boolean;

  constructor(props: AppSwitchProps) {
    super(props);

    this.state = {
      animatedValue: new Animated.Value(0),
      circlePosXStart: 0,
      circlePosXEnd: 30,
      waitFor: typeof props.waitFor === 'number' ? props.waitFor : 1000,
    };

    this.onPress = this.onPress.bind(this);
    this.clickable = true;
  }

  componentDidMount() {
    const isOn = this.props.value || false;

    if (isOn) {
      Animated.timing(this.state.animatedValue, {
        toValue: isOn ? 1 : 0,
        duration: 0,
        useNativeDriver: false,
      }).start();
    }
  }

  componentDidUpdate(prevProps: AppSwitchProps) {
    const isOn = this.props.value;
    if (isOn !== prevProps.value) {
      Animated.timing(this.state.animatedValue, {
        toValue: isOn ? 1 : 0,
        easing: Easing.elastic(0.2),
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }

  onPress() {
    const {onPress} = this.props;
    const {waitFor} = this.state;

    if (_.isFunction(onPress) && this.clickable) {
      this.clickable = false;
      onPress();
      setTimeout(() => {
        this.clickable = true;
      }, waitFor);
    }
  }

  render() {
    const {style} = this.props;
    const {animatedValue, circlePosXStart, circlePosXEnd} = this.state;

    return (
      <TouchableOpacity
        style={[styles.container, style]}
        activeOpacity={0.7}
        onPress={this.onPress}>
        <Animated.View
          style={[
            styles.track,
            {
              backgroundColor: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [colors.lightGrey, colors.clearBlue],
              }),
            },
          ]}>
          <Animated.View
            style={[
              styles.thumb,
              {
                backgroundColor: colors.white,
                transform: [
                  {
                    translateX: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [circlePosXStart, circlePosXEnd],
                    }),
                  },
                ],
              },
            ]}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  }
}
