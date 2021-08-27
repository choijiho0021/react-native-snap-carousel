import AppIcon from '@/components/AppIcon';
import AppUserPic from '@/components/AppUserPic';
import LabelTextTouchable from '@/components/LabelTextTouchable';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import utils from '@/redux/api/utils';
import {AccountModelState} from '@/redux/modules/account';
import {RootState} from '@reduxjs/toolkit';
import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import AppText from './AppText';

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
    color: colors.warmGrey,
  },
  value: {
    ...appStyles.roboto16Text,
    marginLeft: 20,
    maxWidth: '100%',
    lineHeight: 40,
    color: colors.black,
  },
  icon: {
    bottom: 20,
    right: -29,
    alignSelf: 'center',
  },
});

type ProfileProps = {
  account: AccountModelState;
  mobile?: string;
  email?: string;
  userPictureUrl?: string;
  icon?: string;
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
  icon,
  onChangePhoto = () => {},
  onPress = () => {},
}) => {
  const userPicture = {
    width: 76,
    height: 76,
    borderRadius: 76 / 2,
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.photo} onPress={onChangePhoto}>
        <AppUserPic
          url={userPictureUrl || accountUserPictureUrl}
          icon="imgPeopleL"
          style={userPicture}
          onPress={onChangePhoto}
          isAbsolutePath={userPictureUrl !== undefined}
        />
        <AppIcon name="imgPeoplePlus" style={styles.icon} />
      </Pressable>
      <View style={{flex: 3, justifyContent: 'center'}}>
        <AppText style={styles.label}>
          {utils.toPhoneNumber(mobile || accountMobile)}
        </AppText>
        <LabelTextTouchable
          key="email"
          label={email || accountEmail || ''}
          labelStyle={styles.value}
          value=""
          arrowStyle={{paddingRight: 20}}
          onPress={() => onPress('email')}
          arrow={icon}
        />
      </View>
    </View>
  );
};

export default connect(({account}: RootState) => ({account}))(memo(Profile));
