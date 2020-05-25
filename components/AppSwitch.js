import React, {PureComponent} from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity } from 'react-native'
import { appStyles } from '../constants/Styles'
import { colors } from '../constants/Colors'
import _ from 'underscore'

export default class AppSwitch extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      animatedValue: new Animated.Value(0),
      circlePosXStart: 0,
      circlePosXEnd: 30
    }

    this._onPress = this._onPress.bind(this)
  }

  componentDidMount() {
    const isOn = this.props.value || false

    if (isOn) {
      Animated.timing(
        this.state.animatedValue,
        {
          toValue: isOn ? 1 : 0,
          duration: 0
        }
      ).start()
    }
  }

  componentDidUpdate(prevProps) {
    const isOn = this.props.value
    if (isOn !== prevProps.value) {
      Animated.timing(
        this.state.animatedValue,
        {
          toValue: isOn ? 1 : 0,
          easing: Easing.elastic(.2),
          duration: 300
        }
      ).start()
    }
  }

  _onPress() {
    const { onPress } = this.props

    if (_.isFunction(onPress)) {
      onPress()
    }
  }

  render() {
    const props = this.props,
      isOn = props.value || false,
      trackColor = {
        true: ((props.styles || {}).trackColor || {}).true || colors.clearBlue,
        false: ((props.styles || {}).trackColor || {}).false || colors.lightGrey,
      },
      thumbColor = (props.styles || {}).thumbColor || colors.white,
      { animatedValue, circlePosXStart, circlePosXEnd } = this.state

    return ( 
      <TouchableOpacity style={[styles.container, props.styles]} activeOpacity={0.7} onPress={this._onPress}>
        <Animated.View style={[styles.track, {
            backgroundColor: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [trackColor.false, trackColor.true],
            })
          }]}>
          <Animated.View style={[styles.thumb, {
            backgroundColor: thumbColor,
            transform: [{
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [circlePosXStart, circlePosXEnd],
              })
            }]
          }]} />
        </Animated.View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 30
  },
  track: {
    borderRadius: 32,
    padding: 5
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 32,
  }
});

