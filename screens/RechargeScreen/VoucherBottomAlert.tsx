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
import RenderChargeAmount from './RenderChargeAmount';

const {isIOS} = Env.get();

const styles = StyleSheet.create({
  bodyBox: {
    position: 'absolute',
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderColor: colors.line,
    shadowColor: colors.black8,
    height: 272,
    bottom: 0,
    width: '100%',
  },
  confirm: {
    ...appStyles.confirm,
    bottom: 0,
    marginTop: 0,
  },
  modalClose: {
    justifyContent: 'center',
    // height: 56,
    alignItems: 'flex-end',
    width: 26,
    height: 26,
  },
  head: {
    height: 74,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 6,
  },
});

type VoucherBottomAlertProps = {
  visible: boolean;
  setVisible: (val: boolean) => void;
  onClickButton: (val) => void;
  balance: number;
};

const VoucherBottomAlert: React.FC<VoucherBottomAlertProps> = ({
  setVisible,
  visible,
  onClickButton,
  balance,
}) => {
  const navigation = useNavigation();
  const title = useMemo(() => {
    return (
      <View
        style={{
          height: 100,
        }}>
        <AppText style={[appStyles.bold16Text, {lineHeight: 30}]}>
          {`카카오 선물하기 상품권 10,000원권`}
        </AppText>
        <AppText style={[appStyles.medium16, {lineHeight: 24}]}>
          {`유효기간: 상품권 등록일로부터 5년`}
        </AppText>
      </View>
    );
  }, []);

  const body = useMemo(() => {
    console.log('bal:', balance);
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

        <RenderChargeAmount amount={5000} balance={balance} />
        <AppButton
          // style={{
          //   width: '100%',
          //   alignItems: 'center',
          //   height: 52,
          //   backgroundColor: colors.blue,
          // }}
          style={styles.confirm}
          title="인증하기"
          onPress={() => {
            // onClickButton('test');
            setVisible(false);
          }}
        />
      </>
    );
  }, []);
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
