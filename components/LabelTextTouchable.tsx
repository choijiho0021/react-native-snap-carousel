import React, {PureComponent} from 'react';
import {TouchableOpacity, View} from 'react-native';
import _ from 'underscore';
import AppIcon from './AppIcon';
import LabelText from './LabelText';

export default class LabelTextTouchable extends PureComponent {
  render() {
    const {
      onPress,
      arrow,
      style,
      disabled,
      format,
      labelStyle,
      arrowStyle,
      ...props
    } = this.props;

    return (
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View style={[style, {flexDirection: 'row', alignItems: 'center'}]}>
          <LabelText
            labelStyle={labelStyle}
            style={{flex: 1}}
            format={format}
            {...props}
          />
          {!_.isEmpty(arrow) && (
            <AppIcon
              style={[arrowStyle, {alignSelf: 'center', marginLeft: 10}]}
              name={arrow}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }
}
