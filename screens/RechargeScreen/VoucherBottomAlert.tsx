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
          {`유효기간: 상품권 등록일로부터 5년`}
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
              text={`<b>충전 전 확인하세요!</b>\n• 로깨비캐시로 충전된 상품권은 로밍도깨비 앱에서 현금처럼 사용하실 수 있습니다.\n• [1만원 이하 상품권] 로깨비캐시로 충전 후 상품권 권면 금액의 60% 이상을 사용하고 남은 금액은 환급받을 수 있습니다.\n•[1만원 초과 상품권] 로깨비캐시로 충전 후 상품권 권면 금액의 80% 이상을 사용하고 남은 금액은 환급받을 수 있습니다.\n•단, 무상으로 제공받은 상품권은 환급되지 않습니다.`}
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
