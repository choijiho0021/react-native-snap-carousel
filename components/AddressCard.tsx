import {RkbProfile} from '@/redux/api/profileApi';
import utils from '@/redux/api/utils';
import React, {memo} from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import _ from 'underscore';
import AppText from './AppText';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    width: '63%',
  },
});

const AddressCard = ({
  textStyle,
  mobileStyle,
  profile,
  style,
}: {
  textStyle: TextStyle;
  mobileStyle: StyleProp<TextStyle>;
  profile: RkbProfile;
  style?: ViewStyle;
}) => {
  const name = _.isEmpty(profile.recipient)
    ? `${profile.familyName} ${profile.givenName}`
    : profile.recipient;

  return (
    <View style={[styles.container, style]}>
      <AppText style={textStyle}>{name}</AppText>
      <AppText style={mobileStyle}>
        {utils.toPhoneNumber(profile.prefix + profile.recipientNumber)}
      </AppText>
      <AppText style={textStyle}>{profile.addressLine1}</AppText>
      <AppText style={textStyle}>{profile.addressLine2}</AppText>
      <AppText style={textStyle}>{profile.detailAddr}</AppText>
    </View>
  );
};

export default memo(AddressCard);
