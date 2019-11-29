import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {appStyles} from '../constants/Styles'
import utils from '../utils/utils';
import i18n from '../utils/i18n';
import AppIcon from './AppIcon';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    width: '63%'
  }
});

export default function AddressCard({label, textStyle, mobileStyle, profile, mobile, style, format, color, labelStyle, valueStyle}) {
  const name = profile.recipient ? profile.recipient: profile.familyName + ' '+ profile.givenName
  return (
    <View style={[styles.container, style]}>
      <Text style={textStyle}>{name}</Text>
      {/* <Text style={textStyle}>{profile.recipient}</Text> */}
      {/* <Text style={textStyle}>{`${profile.familyName} ${profile.givenName}`}</Text> */}
      <Text style={mobileStyle}>{utils.toPhoneNumber(profile.recipientNumber)}</Text>
      <Text style={textStyle}>{profile.addressLine1}</Text>
      <Text style={textStyle}>{profile.addressLine2}</Text>
      <Text style={textStyle}>{profile.organization}</Text>
    </View> 
  )
}
