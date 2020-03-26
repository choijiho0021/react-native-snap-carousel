import React, { PureComponent } from 'react';
import {
  TouchableOpacity,
  View,
} from 'react-native';
import AppIcon from './AppIcon';
import LabelText from './LabelText';
import _ from 'underscore'

export default class LabelTextTouchable extends PureComponent {
  render() {
    const {onPress, arrow, style, disabled, format, ... props} = this.props

    return (
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View style={[style, {flexDirection:'row', alignItems:'center'}]}>
          <LabelText style={{flex:1}} format={format} {... props} />
          {
            ! _.isEmpty(arrow) && <AppIcon style={{alignSelf:'center', marginLeft:20}} name={arrow}/>
          }
        </View>
      </TouchableOpacity>
    )
  }
}

