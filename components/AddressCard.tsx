import {RkbProfile} from '@/redux/api/profileApi';
import utils from '@/redux/api/utils';
import React, {memo} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import _ from 'underscore';

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
      <Text style={textStyle}>{name}</Text>
      <Text style={mobileStyle}>
        {utils.toPhoneNumber(profile.prefix + profile.recipientNumber)}
      </Text>
      <Text style={textStyle}>{profile.addressLine1}</Text>
      <Text style={textStyle}>{profile.addressLine2}</Text>
      <Text style={textStyle}>{profile.detailAddr}</Text>
    </View>
  );
};

export default memo(AddressCard);
