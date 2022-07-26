import {RootState} from '@reduxjs/toolkit';
import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import AppUserPic from '@/components/AppUserPic';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import utils from '@/redux/api/utils';
import {AccountModelState} from '@/redux/modules/account';
import AppText from './AppText';
import {isDeviceSize} from '../constants/SliderEntry.style';

const styles = StyleSheet.create({
  container: {
    marginTop: 35,
    // flex: 1,
    flexDirection: 'row',
    marginLeft: 20,
    height: 76,
    marginBottom: 30,
  },
  photo: {
    flex: 1,
    alignSelf: 'center',
  },
  label: {
    ...appStyles.normal14Text,
    marginHorizontal: 20,
    lineHeight: 22,
    color: colors.warmGrey,
    marginBottom: 4,
  },
  value: {
    ...appStyles.roboto16Text,
    fontSize: isDeviceSize('medium') ? 17 : 19,
    marginLeft: 20,
    maxWidth: '100%',
    lineHeight: 25,
    color: colors.black,
    marginRight: 20,
  },
  icon: {
    bottom: 20,
    right: -29,
    alignSelf: 'center',
  },
  userPicture: {
    width: 76,
    height: 76,
    borderRadius: 76 / 2,
    borderWidth: 1,
    borderColor: colors.whitefour,
  },
});

type ProfileProps = {
  account: AccountModelState;
  mobile?: string;
  email?: string;
  userPictureUrl?: string;
  onChangePhoto?: () => void;
  onPress?: (v: 'id' | 'email') => void;
};

const Profile: React.FC<ProfileProps> = ({
  account: {
    mobile: accountMobile,
    email: accountEmail,
    userPictureUrl: accountUserPictureUrl,
  },
  mobile,
  email,
  userPictureUrl,
  onChangePhoto = () => {},
  onPress = () => {},
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.photo}>
        <AppUserPic
          url={userPictureUrl || accountUserPictureUrl}
          icon="profileImg"
          style={styles.userPicture}
          isAbsolutePath={userPictureUrl !== undefined}
          onPress={onChangePhoto}
        />
      </View>
      <View style={{flex: 3, justifyContent: 'center'}}>
        <AppText style={styles.label}>
          {utils.toPhoneNumber(mobile || accountMobile).slice(0, -4)}****
        </AppText>
        <Pressable onPress={() => onPress('email')}>
          <AppText style={styles.value} numberOfLines={1} ellipsizeMode="tail">
            {email || accountEmail || ''}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};

export default connect(({account}: RootState) => ({account}))(memo(Profile));
