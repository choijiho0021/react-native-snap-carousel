import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import _ from 'underscore';
import utils from '../utils/utils';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    width: '63%',
  },
});

function AddressCard({textStyle, mobileStyle, profile, style}) {
  const name = _.isEmpty(profile.recipient)
    ? `${profile.familyName} ${profile.givenName}`
    : profile.recipient;

  return (
    <View style={[styles.container, style]}>
      <Text style={textStyle}>{name}</Text>
      <Text style={mobileStyle}>
        {utils.toPhoneNumber(profile.prefix + profile.recipientNumber)}
      </Text>
      <Text style={textStyle}>{profile.addressLine1}</Text>
      <Text style={textStyle}>{profile.addressLine2}</Text>
      <Text style={textStyle}>{profile.detailAddr}</Text>
    </View>
  );
}

export default memo(AddressCard);
