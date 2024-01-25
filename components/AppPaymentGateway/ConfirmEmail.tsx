import {RootState} from '@reduxjs/toolkit';
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {AccountModelState} from '@/redux/modules/account';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import AppButton from '@/components/AppButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  title: {
    ...appStyles.bold18Text,
    marginTop: 20,
    marginBottom: isDeviceSize('small') ? 10 : 20,
    marginHorizontal: 20,
    color: colors.black,
  },
  oldEmail: {
    height: 46,
    marginTop: 4,
    marginBottom: 32,
    backgroundColor: colors.whiteTwo,
    borderRadius: 3,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  oldEmailText: {
    ...appStyles.normal16Text,
    lineHeight: 22,
    color: colors.black,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
});

type ConfirmEmailProps = {
  account: AccountModelState;
  onPress?: () => void;
};

const ConfirmEmail: React.FC<ConfirmEmailProps> = ({account, onPress}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <AppText style={styles.title}>{i18n.t('pym:email')}</AppText>
        {onPress ? (
          <AppButton title={i18n.t('pym:email:change')} onPress={onPress} />
        ) : null}
      </View>
      <View style={styles.oldEmail}>
        <AppText style={styles.oldEmailText}>{account.email}</AppText>
      </View>
    </View>
  );
};

export default memo(
  connect(({account}: RootState) => ({account}))(ConfirmEmail),
);
