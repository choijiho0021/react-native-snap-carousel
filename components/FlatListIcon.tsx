import React, {memo} from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {appStyles} from '../constants/Styles';

function FlatListIcon({key, name}) {
  return (
    <View style={appStyles.listForward}>
      <Icon key={key} name={name} size={32} />
    </View>
  );
}

export default memo(FlatListIcon);
