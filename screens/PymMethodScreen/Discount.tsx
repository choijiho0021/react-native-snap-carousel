import {RootState} from '@reduxjs/toolkit';
import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {AccountModelState} from '@/redux/modules/account';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import AppButton from '@/components/AppButton';
import {OrderPromo} from '@/redux/api/cartApi';
import AppPrice from '@/components/AppPrice';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  title: {
    ...appStyles.bold18Text,
    // fontFamily: "AppleSDGothicNeo",
    marginTop: 20,
    marginBottom: isDeviceSize('small') ? 10 : 20,
    marginHorizontal: 20,
    color: colors.black,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
});

type DiscountProps = {
  account: AccountModelState;
  promo?: OrderPromo[];
};

const Discount: React.FC<DiscountProps> = ({account, promo}) => {
  const maxPromo = useMemo(
    () =>
      promo?.reduce((acc, cur) => {
        if (acc && acc.adj.amount > cur.adj.amount) {
          return cur;
        }
        return cur;
      }, undefined),
    [promo],
  );

  return (
    <View style={styles.container}>
      <AppText style={styles.title}>{i18n.t('pym:discount')}</AppText>
      <View style={styles.row}>
        <AppText>{i18n.t('pym:coupon')}</AppText>
        <AppText>{i18n.t('unit', {unit: account.coupon?.length || 0})}</AppText>
      </View>
      <View style={styles.row}>
        <AppPrice price={maxPromo?.adj} />
        <AppButton title={i18n.t('pym:selectCoupon')} />
      </View>
    </View>
  );
};

export default memo(connect(({account}: RootState) => ({account}))(Discount));
