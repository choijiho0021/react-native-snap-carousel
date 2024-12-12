import React, {memo, useCallback, useMemo} from 'react';
import {Image, StyleSheet, View} from 'react-native';

import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppBottomModal from '@/screens/DraftUsScreen/component/AppBottomModal';
import AppStyledText from '@/components/AppStyledText';
import i18n from '@/utils/i18n';
import Env from '@/environment';
import AppButton from '@/components/AppButton';
import RenderChargeAmount from './RenderChargeAmount';
import AppIcon from '@/components/AppIcon';
import AppSvgIcon from '@/components/AppSvgIcon';

const {isIOS} = Env.get();

const styles = StyleSheet.create({
  confirm: {
    ...appStyles.confirm,
    bottom: 0,
    marginTop: 0,
  },
});

export type VoucherType = {
  title: string;
  amount: number;
  expireDesc: string;
  type: string;
};

type VoucherBottomAlertProps = {
  visible: boolean;
  setVisible: (val: boolean) => void;
  onClickButton: () => void;
  voucherType: VoucherType;
  balance: number;
  expireDesc: string;
};

const VoucherBottomAlert: React.FC<VoucherBottomAlertProps> = ({
  setVisible,
  visible,
  onClickButton,
  voucherType,
  balance,
}) => {
  const getVoucherImage = useCallback((amount) => {
    switch (amount) {
      case '5000':
        return require('@/assets/images/esim/voucher/voucher5000.jpg');
      case '10000':
        return require('@/assets/images/esim/voucher/voucher10000.jpg');
      case '20000':
        return require('@/assets/images/esim/voucher/voucher20000.jpg');
      case '30000':
        return require('@/assets/images/esim/voucher/voucher30000.jpg');
      case '50000':
        return require('@/assets/images/esim/voucher/voucher50000.jpg');

      // ?
      default:
        return require('@/assets/images/esim/voucher/voucher5000.jpg');
    }
  }, []);

  const title = useMemo(() => {
    return (
      <View
        style={{
          alignItems: 'center',
          width: '100%',
        }}>
        <AppSvgIcon
          style={{
            width: 46,
            height: 10,
            marginVertical: 10,
          }}
          name="grabber2"
        />
        <Image
          style={{marginTop: 10}}
          source={getVoucherImage(voucherType?.amount)}
          resizeMode="stretch"
        />
        <AppText style={[appStyles.bold18Text, {lineHeight: 30}]}>
          {voucherType.title}
        </AppText>
      </View>
    );
  }, [getVoucherImage, voucherType.amount, voucherType.title]);

  const body = useMemo(() => {
    console.log('@@@ voucherType : ', voucherType);
    return (
      <>
        <View style={{paddingHorizontal: 20, marginTop: 18, paddingBottom: 16}}>
          <View style={{marginBottom: 48, gap: 8}}>
            <AppStyledText
              text={i18n.t('cashHistory:type:voucher:refund:notice:body', {
                expireLine: `• 유효기간:${voucherType?.expireDesc}\n`,
              })}
              textStyle={[
                appStyles.medium14,
                {color: colors.black, lineHeight: 20, letterSpacing: 0},
              ]}
              format={{b: [appStyles.bold16Text, {color: colors.clearBlue}]}}
            />
          </View>
        </View>

        <RenderChargeAmount amount={voucherType?.amount} balance={balance} />
        <AppButton
          style={styles.confirm}
          title="인증하기"
          onPress={() => {
            onClickButton();
            setVisible(false);
          }}
        />
      </>
    );
  }, [balance, onClickButton, setVisible, voucherType]);

  return (
    <AppBottomModal
      visible={visible}
      isCloseBtn={false}
      onClose={() => {
        setVisible(false);
      }}
      title={title}
      titleType="component"
      body={body}
      boxStyle={{paddingTop: 0}}
    />
  );
};

// export default memo(VoucherBottomAlert);

export default memo(VoucherBottomAlert);
