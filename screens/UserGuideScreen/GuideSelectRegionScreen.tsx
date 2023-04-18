import React, {memo, useEffect, useMemo} from 'react';
import {StyleSheet, SafeAreaView, View, Pressable} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import AppSvgIcon from '@/components/AppSvgIcon';
import {appStyles} from '@/constants/Styles';
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
  box: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.backGrey,
    marginHorizontal: 20,
    marginBottom: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxTitle: {
    ...appStyles.bold14Text,
    lineHeight: 20,
    color: colors.black,
  },
  boxBody: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.warmGrey,
  },
});

export type GuideRegion = 'korea' | 'local';

const GuideSelectRegionScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const guideOption = useMemo(
    () => route.params?.guideOption,
    [route.params?.guideOption],
  );

  useEffect(() => {
    navigation?.setOptions({
      title: null,
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <GuideHeader onPress={() => navigation?.goBack()} />
      <GuideTitle
        title={i18n.t(`userGuide:selectRegion:${guideOption}:title`)}
      />
      <View style={{height: 6}} />
      {guideOption === 'esimReg' ? (
        <Pressable
          style={styles.box}
          onPress={() =>
            dispatch(
              modalActions.showModal({
                content: (
                  <GuideModal guideOption={guideOption} isHome={false} />
                ),
              }),
            )
          }>
          <AppSvgIcon name="noticeFlag" style={{marginRight: 8}} />
          <View>
            <AppText style={styles.boxTitle}>
              {i18n.t('userGuide:selectRegion:esimReg:notice:title')}
            </AppText>
            <AppText style={styles.boxBody}>
              {i18n.t('userGuide:selectRegion:esimReg:notice:body')}
            </AppText>
          </View>
          <AppSvgIcon name="rightArrow" style={{marginLeft: 'auto'}} />
        </Pressable>
      ) : (
        <View style={{height: 40}} />
      )}
      {['korea', 'local'].map((v) => (
        <GuideButton
          key={v}
          item={v}
          onPress={() => {
            navigation?.navigate('UserGuideStep', {
              guideOption,
              region: v,
            });
          }}
          isHome={false}
        />
      ))}
    </SafeAreaView>
  );
};

export default memo(GuideSelectRegionScreen);
