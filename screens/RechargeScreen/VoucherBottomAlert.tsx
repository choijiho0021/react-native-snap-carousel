import React, {memo, useCallback, useMemo} from 'react';
import {Image, StyleSheet, View} from 'react-native';

import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppBottomModal from '@/screens/DraftUsScreen/component/AppBottomModal';
import AppStyledText from '@/components/AppStyledText';
import i18n from '@/utils/i18n';
import AppButton from '@/components/AppButton';
import RenderChargeAmount from './RenderChargeAmount';
import AppSvgIcon from '@/components/AppSvgIcon';

const styles = StyleSheet.create({
  confirm: {
    ...appStyles.confirm,
    bottom: 0,
    marginTop: 16,
  },

  titleContainer: {
    alignItems: 'center',
    width: '100%',
  },
  grabber: {
    width: 46,
    height: 10,
    marginVertical: 10,
  },
  voucherTitleText: {
    ...appStyles.bold18Text,
    lineHeight: 26,
    marginTop: 16,
  },

  bodyContainer: {paddingHorizontal: 20, marginTop: 18, marginBottom: 20},

  bodyText: {
    ...appStyles.medium14,
    color: colors.warmGrey,
    lineHeight: 20,
    letterSpacing: 0,
  },

  amountContainer: {
    borderTopWidth: 1,
    paddingTop: 20,
    borderColor: colors.whiteFive,
  },
});

export type VoucherType = {
  title: string;
  amount: number;
  type?: string; // TODO : 차후 type에 따른 상품권 사진이 달라질 수도 있음.
  expireDxsesc?: string;
};

type VoucherBottomAlertProps = {
  visible: boolean;
  setVisible: (val: boolean) => void;
  onClickButton: () => void;
  voucherType: VoucherType;
  balance: number;
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
      case 5000:
        return require('@/assets/images/esim/voucher/voucher5000.jpg');
      case 10000:
        return require('@/assets/images/esim/voucher/voucher10000.jpg');
      case 20000:
        return require('@/assets/images/esim/voucher/voucher20000.jpg');
      case 30000:
        return require('@/assets/images/esim/voucher/voucher30000.jpg');
      case 50000:
        return require('@/assets/images/esim/voucher/voucher50000.jpg');

      // ?
      default:
        return require('@/assets/images/esim/voucher/voucher5000.jpg');
    }
  }, []);

  const title = useMemo(() => {
    return (
      <View style={styles.titleContainer}>
        <AppSvgIcon
          style={styles.grabber}
          onPress={() => setVisible(false)}
          name="grabber2"
        />
        <Image
          style={{marginTop: 10}}
          source={getVoucherImage(voucherType?.amount)}
          resizeMode="stretch"
        />
        <AppText style={styles.voucherTitleText}>{voucherType.title}</AppText>
      </View>
    );
  }, [getVoucherImage, setVisible, voucherType?.amount, voucherType.title]);

  const body = useMemo(() => {
    return (
      <>
        <View style={styles.bodyContainer}>
          <View style={{gap: 8}}>
            <AppStyledText
              text={i18n.t('esim:recharge:voucher:notice:body', {
                expireLine: `• 유효기간:${voucherType?.expireDesc}\n`,
              })}
              textStyle={styles.bodyText}
              format={{b: [appStyles.bold16Text, {color: colors.clearBlue}]}}
            />
          </View>
        </View>

        <RenderChargeAmount
          amount={voucherType?.amount}
          balance={balance}
          containerStyle={styles.amountContainer}
        />
        <AppButton
          style={styles.confirm}
          title={i18n.t('esim:recharge:voucher:btn')}
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
      boxStyle={{paddingTop: 0, paddingBottom: 20}}
    />
  );
};

export default memo(VoucherBottomAlert);
