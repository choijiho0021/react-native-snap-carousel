import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Pressable} from 'react-native';

import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {colors} from '@/constants/Colors';

import {HomeStackParamList} from '@/navigation/navigation';
import AppBackButton from '@/components/AppBackButton';
import i18n from '@/utils/i18n';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {sliderWidth} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
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
  btn: {
    width: sliderWidth - 40,
    marginTop: 22,
    marginHorizontal: 20,
    borderRadius: 3,
    padding: 30,
    borderWidth: 1,
    borderColor: colors.whiteFive,

    elevation: 12,
    shadowColor: 'rgb(166, 168, 172)',
    shadowRadius: 12,
    shadowOpacity: 0.16,
    shadowOffset: {
      height: 4,
      width: 0,
    },
  },
  detailText: {
    ...appStyles.normal14Text,
  },
  typeText: {
    ...appStyles.bold20Text,
    marginTop: 50,
    alignSelf: 'flex-end',
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
          type={t}
          onPress={() => {
            if (t === 'extension') {
              navigation.navigate('Charge', {
                mainSubs: params?.mainSubs,
                chargeablePeriod: params?.chargeablePeriod,
              });
            }
          }}
        />
      ))}
    </SafeAreaView>
  );
};

export default ChargeTypeScreen;
