import React, {memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';

import Env from '@/environment';
import AppPrice from '@/components/AppPrice';
import AppSvgIcon from '@/components/AppSvgIcon';

const {esimCurrency} = Env.get();
const styles = StyleSheet.create({
  chargeAmountView: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  amountTitle: {
    ...appStyles.medium16,
    lineHeight: 20,
    color: colors.black,
  },
  balance: {
    ...appStyles.robotoBold22Text,
    color: colors.clearBlue,
    lineHeight: 24,
  },
  currency: {
    ...appStyles.bold22Text,
    color: colors.clearBlue,
    lineHeight: 24,
  },
});

type RenderCharegeAmountProps = {
  amount: number;
  balance: number;
  containerStyle?: StyleProp<ViewStyle>;
};

const RenderCharegeAmount: React.FC<RenderCharegeAmountProps> = ({
  amount,
  balance,
  containerStyle,
}) => {
  return (
    <View>
      <View style={[styles.chargeAmountView, containerStyle]}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
          <AppSvgIcon style={{marginTop: 1}} name="lightningIcon" />
          <AppText
            key="label"
            style={[styles.amountTitle, {textAlign: 'left'}]}>
            {i18n.t('mypage:cash:amount')}
          </AppText>
        </View>
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
