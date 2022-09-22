import React, {useEffect, useMemo} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';

import i18n from '@/utils/i18n';
import {RkbSubscription} from '@/redux/api/subscriptionApi';

type ParamList = {
  ChargeScreen: {
    item: RkbSubscription;
  };
};

const styles = StyleSheet.create({});

const ChargeScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ChargeScreen'>>();
  const params = useMemo(() => route?.params, [route?.params]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('esim:charge')} />,
      //   headerRight: () => (),
    });
  }, [navigation]);
  return (
    <SafeAreaView style={{flex: 1}}>
      <AppText>test</AppText>
    </SafeAreaView>
  );
};

export default ChargeScreen;
