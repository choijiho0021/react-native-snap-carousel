import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';

import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppBottomModal from '@/screens/DraftUsScreen/component/AppBottomModal';
import AppStyledText from '@/components/AppStyledText';
import i18n from '@/utils/i18n';
import Env from '@/environment';
import AppButton from '@/components/AppButton';
import RenderChargeAmount from './RenderChargeAmount';

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
  const title = useMemo(() => {
    return (
      <View
        style={{
          height: 100,
        }}>
        <AppText style={[appStyles.bold18Text, {lineHeight: 30}]}>
          {voucherType.title}
        </AppText>
        <AppText style={[appStyles.medium16, {lineHeight: 24}]}>
          {i18n.t('cashHistory:type:voucher:regist:notice')}
        </AppText>
      </View>
    );
  }, [voucherType]);

  const body = useMemo(() => {
    return (
      <>
        <View style={{paddingHorizontal: 20, paddingBottom: 16}}>
          <View style={{marginBottom: 48, gap: 8}}>
            <AppStyledText
              text={i18n.t('cashHistory:type:voucher:refund:notice:body')}
              textStyle={[
                appStyles.medium16,
                {color: colors.black, lineHeight: 24, letterSpacing: -0.16},
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
  }, [balance, onClickButton, setVisible, voucherType?.amount]);

  return (
    <AppBottomModal
      visible={visible}
      isCloseBtn={false}
      onClose={() => {
        setVisible(false);
      }}
      height={450}
      headerStyle={{height: isIOS ? 124 : 80}}
      title={title}
      body={body}
    />
  );
};

// export default memo(VoucherBottomAlert);

export default memo(VoucherBottomAlert);
