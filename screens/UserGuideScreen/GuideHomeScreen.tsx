import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, ScrollView, View} from 'react-native';
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
    marginBottom: 24,
  },
});

export type GuideOption = 'esimReg' | 'checkSetting' | 'esimDel';

const GuideHomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [guideOption, setGuideOption] = useState<GuideOption>('esimReg');

  return (
    <SafeAreaView style={styles.container}>
      <GuideHeader onPress={() => navigation.goBack()} />
      <ScrollView style={{flex: 1, paddingTop: 40}}>
        <GuideTitle title={i18n.t('userGuide:home:title')} />

        <AppIcon name="guideHomeLogo" style={styles.logo} />

        {['esimReg', 'checkSetting', 'esimDel'].map((v) => (
          <GuideButton
            key={v}
            item={v}
            style={v === 'esimDel' && {marginTop: 20, marginBottom: 36}}
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
              } else if (v === 'esimDel') {
                navigation?.navigate('UserGuideStep', {
                  guideOption: v,
                });
              } else {
                navigation.navigate('UserGuideSelectRegion', {guideOption: v});
              }
            }}
            isHome
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(GuideHomeScreen);
