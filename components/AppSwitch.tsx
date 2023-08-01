import React, {PureComponent} from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
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
  width?: number;
  onPress: () => Promise<void>;
  style?: StyleProp<ViewStyle>;
};

type AppSwitchState = {
  animatedValue: Animated.Value;
  circlePosXStart: number;
  circlePosXEnd: number;
  width: number;
  waitFor: number;
  isOn: boolean;
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
      circlePosXEnd: typeof props.width === 'number' ? props.width - 30 : 30,
      width: typeof props.width === 'number' ? props.width : 60,
      waitFor: typeof props.waitFor === 'number' ? props.waitFor : 1000,
      isOn: props.value || false,
    };

    this.onPress = this.onPress.bind(this);
    this.refresh = this.refresh.bind(this);
    this.clickable = true;
  }

  componentDidMount() {
    // const isOn = this.props.value || false;
    const {isOn} = this.state;
    if (isOn) {
      Animated.timing(this.state.animatedValue, {
        toValue: isOn ? 1 : 0,
        duration: 0,
        useNativeDriver: false,
      }).start();
    }
  }

  componentDidUpdate(prevProps: AppSwitchProps, prevState: AppSwitchState) {
    const {isOn} = this.state;

    if (isOn !== prevState.isOn) {
      Animated.timing(this.state.animatedValue, {
        toValue: isOn ? 1 : 0,
        easing: Easing.elastic(0.2),
        duration: 300,
        useNativeDriver: false,
      }).start();
    }

    if (prevProps.value !== this.props.value) {
      this.setState({isOn: this.props.value});
    }
  }

  onPress() {
    const {onPress, value} = this.props;
    const {waitFor} = this.state;

    if (_.isFunction(onPress) && this.clickable) {
      this.setState((prevState) => ({
        isOn: !prevState.isOn,
      }));
      this.clickable = false;
      onPress().then(() => {
        this.refresh();
      });
      setTimeout(() => {
        this.clickable = true;
      }, waitFor);
    }
  }

  refresh() {
    const {value} = this.props;
    const {isOn} = this.state;
    if (isOn !== value) {
      this.setState({isOn: value});
    }
  }

  render() {
    const {style} = this.props;
    const {animatedValue, circlePosXStart, circlePosXEnd} = this.state;

    return (
      <TouchableOpacity
        style={[styles.container, style, {width: this.state.width}]}
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
