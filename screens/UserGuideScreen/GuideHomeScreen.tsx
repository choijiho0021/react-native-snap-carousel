import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import AppIcon from '@/components/AppIcon';
import {actions as modalActions} from '@/redux/modules/modal';
import GuideModal from './GuideModal';
import GuideHeader from './GuideHeader';
import GuideTitle from './GuideTitle';
import GuideButton from './GuideButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  logo: {
    alignSelf: 'flex-end',
    marginRight: 20,
  },
});

export type GuideOption = 'esimReg' | 'checkSetting';

const GuideHomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [guideOption, setGuideOption] = useState<GuideOption>('esimReg');

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <GuideHeader onPress={() => navigation.goBack()} />

      <GuideTitle title={i18n.t('userGuide:home:title')} />

      <AppIcon name="guideHomeLogo" style={styles.logo} />

      {['esimReg', 'checkSetting'].map((v) => (
        <GuideButton
          key={v}
          item={v}
          onPress={async () => {
            setGuideOption(v);
            const checked = await AsyncStorage.getItem(
              'esim.guide.modal.check',
            );

            if (v === 'esimReg' && checked !== 'checked') {
              AsyncStorage.setItem('esim.guide.modal.check', 'checked');

              dispatch(
                modalActions.renderModal(() => (
                  <GuideModal guideOption={guideOption} isHome />
                )),
              );
            } else {
              navigation.navigate('UserGuideSelectRegion', {guideOption: v});
            }
          }}
          isHome
        />
      ))}
    </SafeAreaView>
  );
};

export default memo(GuideHomeScreen);
