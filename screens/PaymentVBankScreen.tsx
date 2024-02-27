import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {memo, useCallback, useMemo} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import moment from 'moment';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import i18n from '@/utils/i18n';
import ScreenHeader from '@/components/ScreenHeader';
import BackbuttonHandler from '@/components/BackbuttonHandler';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import AppStyledText from '@/components/AppStyledText';

const styles = StyleSheet.create({
  title: {
    ...appStyles.bold18Text,
    marginTop: 20,
    marginBottom: isDeviceSize('small') ? 10 : 20,
    marginHorizontal: 20,
    color: colors.black,
  },
  btnHomeText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    color: colors.white,
  },
  btnHome: {
    width: '100%',
    height: 52,
    backgroundColor: colors.clearBlue,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.whiteTwo,
  },
});

type PaymentVBankScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'PaymentVBank'
>;

type PaymentVBankScreenRouteProp = RouteProp<
  HomeStackParamList,
  'PaymentVBank'
>;

type PaymentVBankScreenProps = {
  navigation: PaymentVBankScreenNavigationProp;
  route: PaymentVBankScreenRouteProp;
};

const PaymentVBankScreen: React.FC<PaymentVBankScreenProps> = ({
  navigation,
  route: {params},
}) => {
  const isSuccess = useMemo(() => params?.pymVBank || false, [params]);
  const [expireDate, amount, vAcntNo] = useMemo(() => {
    if (params?.info) {
      const {expireDate, amount, vAcntNo} = params?.info;
      if (expireDate)
        return [
          moment(expireDate, 'YYYYMMDDHHmmss').utcOffset(9, true).format(),
          amount,
          vAcntNo,
        ];
    }
    return ['', '', ''];
  }, [params?.info]);

  const onNavigateScreen = useCallback(() => {
    navigation.popToTop();

    navigation.navigate('EsimStack', {
      screen: 'Esim',
      params: {
        actionStr: 'reload',
      },
    });
  }, [navigation]);

  console.log('@@@ vbank info', params?.info);

  // 결제 완료창에서 뒤로가기 시 확인과 똑같이 처리한다.
  BackbuttonHandler({
    navigation,
    onBack: () => {
      onNavigateScreen();
      return true;
    },
  });

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'stretch'}}>
      <ScreenHeader
        title={i18n.t(isSuccess ? 'his:paymentCompleted' : 'his:paymentFailed')}
        showIcon={false}
      />
      <ScrollView style={styles.scrollView}>
        <View>
          <AppText style={styles.title}>{i18n.t('pym:vbank:waiting')}</AppText>
          <AppStyledText
            text={i18n.t('pym:vbank:notice')}
            textStyle={styles.title}
            data={{date: expireDate}}
          />
          <AppText style={styles.title}>{i18n.t('pym:vbank:prod')}</AppText>
          <AppText style={styles.title}>{i18n.t('his:pymAmount')}</AppText>
          <AppText style={styles.title}>{amount}</AppText>
          <AppText style={styles.title}>{i18n.t('pym:vbank:acnt')}</AppText>
          <AppText style={styles.title}>{vAcntNo}</AppText>
          <AppText style={styles.title}>{i18n.t('pym:vbank:until')}</AppText>
          <AppText style={styles.title}>{expireDate}</AppText>
        </View>
      </ScrollView>
      <AppButton
        style={styles.btnHome}
        title={i18n.t('pym:toCheck')}
        titleStyle={styles.btnHomeText}
        type="primary"
        onPress={() => {
          onNavigateScreen();
        }}
      />
    </SafeAreaView>
  );
};

export default memo(PaymentVBankScreen);
