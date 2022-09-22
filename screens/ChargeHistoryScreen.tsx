import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, Pressable} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';

import i18n from '@/utils/i18n';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import ChargeModal from './EsimScreen/components/ChargeModal';
import AppButton from '@/components/AppButton';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';

type ParamList = {
  ChargeHistoryScreen: {
    item: RkbSubscription;
  };
};

const styles = StyleSheet.create({
  chargeBtn: {
    height: 52,
    backgroundColor: colors.clearBlue,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  chargeBtnTitle: {
    ...appStyles.medium18,
    color: colors.white,
    textAlign: 'center',
    width: '100%',
  },
});

const ChargeHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ChargeHistoryScreen'>>();
  const params = useMemo(() => route?.params, [route?.params]);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [isPressClose, setIsPressClose] = useState(false);
  const [modal, setModal] = useState<ModalType>('');
  // const [showModal, setShowModal] = useState(false);
  const [subs, setSubs] = useState<RkbSubscription>();

  const onPressCharge = useCallback((item: RkbSubscription) => {
    setShowChargeModal(true);
    setModal('charge');
    setSubs(item);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('esim:chargeHistory')} />,
      //   headerRight: () => (),
    });
  }, [navigation]);
  return (
    <SafeAreaView style={{flex: 1}}>
      <AppText>test</AppText>
      <ChargeModal
        visible={showChargeModal}
        onOkClose={() => {
          setShowChargeModal(false);
          setIsPressClose(true);
        }}
        item={params.item}
      />
      <AppButton
        style={styles.chargeBtn}
        type="primary"
        onPress={() => onPressCharge(params.item)}
        title={i18n.t('esim:charge')}
        titleStyle={styles.chargeBtnTitle}
      />
    </SafeAreaView>
  );
};

export default ChargeHistoryScreen;
