import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import utils from '../utils/utils';
import _ from 'underscore';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    width: '63%'
  }
});

export default function AddressCard({label, textStyle, mobileStyle, profile, style, format, color, labelStyle, valueStyle}) {
  const name = _.isEmpty(profile.recipient) ? (profile.familyName + ' ' + profile.givenName):  profile.recipient 
  console.log('address card recipient', profile.recipient)
  return (
    <View style={[styles.container, style]}>
      <Text style={textStyle}>{name}</Text>
      <Text style={mobileStyle}>{utils.toPhoneNumber(profile.recipientNumber)}</Text>
      <Text style={textStyle}>{profile.addressLine1}</Text>
      <Text style={textStyle}>{profile.addressLine2}</Text>
      <Text style={textStyle}>{profile.detailAddr}</Text>
    </View> 
  )
}
