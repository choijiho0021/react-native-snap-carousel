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

type AddOnScreenScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ChargeType'
>;

type AddOnScreenScreenProps = {
  navigation: AddOnScreenScreenNavigationProp;
  route: RouteProp<HomeStackParamList, 'AddOn'>;
};

const AddOnScreen: React.FC<AddOnScreenScreenProps> = ({
  navigation,
  route: {params},
}) => {
  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <View style={styles.header}>
          <AppBackButton
            title={i18n.t('esim:charge:type:addOn')}
            style={styles.headerTitle}
          />
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    console.log('@@@@ params', params.mainSubs);
  }, [params]);

  return <SafeAreaView style={styles.container} />;
};

export default AddOnScreen;
