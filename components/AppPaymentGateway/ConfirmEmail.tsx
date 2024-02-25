import {RootState} from '@reduxjs/toolkit';
import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {AccountModelState} from '@/redux/modules/account';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import AppSvgIcon from '../AppSvgIcon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.white,
    marginHorizontal: 20,
  },
  title: {
    ...appStyles.bold18Text,
    marginTop: 20,
    marginBottom: isDeviceSize('small') ? 10 : 20,
    color: colors.black,
    flex: 1,
  },
  oldEmail: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 32,
    borderRadius: 3,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  oldEmailText: {
    ...appStyles.medium18,
    lineHeight: 22,
    color: colors.clearBlue,
    flex: 1,
    marginRight: 10,
    textAlign: 'left',
  },
  changeText: {
    ...appStyles.bold14Text,
    marginRight: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type ConfirmEmailProps = {
  account: AccountModelState;
  onPress?: () => void;
};

const ConfirmEmail: React.FC<ConfirmEmailProps> = ({account, onPress}) => {
  return (
    <View style={styles.container}>
      <AppText style={styles.title}>{i18n.t('pym:email')}</AppText>
      <Pressable style={styles.oldEmail} onPress={onPress}>
        <AppText style={styles.oldEmailText}>{account.email}</AppText>
        <View style={styles.row}>
          <AppText style={styles.changeText}>
            {i18n.t('changeEmail:short')}
          </AppText>
          <AppSvgIcon name="rightArrow10" />
        </View>
      </Pressable>
    </View>
  );
};

export default memo(
  connect(({account}: RootState) => ({account}))(ConfirmEmail),
);
