import React, {memo, useMemo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppBottomModal from '@/screens/DraftUsScreen/component/AppBottomModal';
import AppStyledText from '@/components/AppStyledText';
import i18n from '@/utils/i18n';

import Env from '@/environment';
import AppButton from '@/components/AppButton';
import {useNavigation} from '@react-navigation/native';
import AppPrice from '@/components/AppPrice';

const {esimCurrency} = Env.get();
const styles = StyleSheet.create({
  chargeAmountView: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.gray02,
  },
  balance: {
    ...appStyles.robotoBold28Text,
    color: colors.black,
    lineHeight: 40,
  },
  currency: {
    ...appStyles.bold26Text,
    color: colors.black,
    lineHeight: 40,
    marginRight: 4,
  },
});

type RenderCharegeAmountProps = {
  amount: number;
  balance: number;
};

const RenderCharegeAmount: React.FC<RenderCharegeAmountProps> = ({
  amount,
  balance,
}) => {
  return (
    <View style={{marginHorizontal: 20}}>
      <View style={styles.chargeAmountView}>
        <AppText
          key="label"
          style={[appStyles.robotoBold22Text, {textAlign: 'left'}]}>
          {i18n.t('mypage:cash:amount')}
        </AppText>
        <AppPrice
          price={{value: (balance || 0) + amount, currency: esimCurrency}}
          balanceStyle={styles.balance}
          currencyStyle={styles.currency}
        />
      </View>
    </View>
  );
};

// export default memo(RenderCharegeAmount);

export default memo(RenderCharegeAmount);
