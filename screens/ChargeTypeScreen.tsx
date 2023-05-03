import React, {useEffect} from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import AppBackButton from '@/components/AppBackButton';
import i18n from '@/utils/i18n';
import ChargeTypeButton from './EsimScreen/components/ChargeTypeButton';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    // alignItems: 'stretch',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  headerTitle: {
    height: 56,
    marginRight: 8,
  },
});

type ChargeTypeScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ChargeType'
>;

type ChargeTypeScreenProps = {
  navigation: ChargeTypeScreenNavigationProp;
  route: RouteProp<HomeStackParamList, 'ChargeType'>;
};

const ChargeTypeScreen: React.FC<ChargeTypeScreenProps> = ({
  navigation,
  route: {params},
}) => {
  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <View style={styles.header}>
          <AppBackButton
            title={i18n.t('esim:charge')}
            style={styles.headerTitle}
          />
        </View>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {['addOn', 'extension'].map((t) => (
        <ChargeTypeButton
          key={t}
          type={t}
          onPress={() => {
            if (t === 'extension') {
              navigation.navigate('Charge', {
                mainSubs: params?.mainSubs,
                chargeablePeriod: params?.chargeablePeriod,
              });
            } else {
              navigation.navigate('AddOn', {
                mainSubs: params?.mainSubs,
                chargeablePeriod: params?.chargeablePeriod,
              });
            }
          }}
          disabled={
            params?.mainSubs.partner === 'quadcell' && t === 'extension'
          }
        />
      ))}
    </SafeAreaView>
  );
};

export default ChargeTypeScreen;
