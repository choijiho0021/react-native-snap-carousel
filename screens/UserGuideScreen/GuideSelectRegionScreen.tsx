/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Pressable} from 'react-native';

import {RouteProp} from '@react-navigation/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {HomeStackParamList} from '@/navigation/navigation';

import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import AppSvgIcon from '@/components/AppSvgIcon';
import {
  guideModal,
  renderBtn,
  renderHeader,
  renderTitle,
} from './GuideHomeScreen';
import {appStyles} from '@/constants/Styles';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';

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

type UserGuideScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ContactBoard'
>;

type GuideSelectRegionScreenProps = {
  navigation: UserGuideScreenNavigationProp;
  route: RouteProp<HomeStackParamList, 'GuideHome'>;
  actions: {
    modal: ModalAction;
  };
};

export type GuideRegion = 'korea' | 'local';

const GuideSelectRegionScreen: React.FC<GuideSelectRegionScreenProps> = ({
  navigation,
  route: {params},
  actions,
}) => {
  const [region, setRegion] = useState<GuideRegion>('korea');
  const guideOption = useMemo(() => params?.guideOption, [params?.guideOption]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader(() => [1, 2].forEach(() => navigation.goBack()))}
      {renderTitle(i18n.t(`userGuide:selectRegion:${guideOption}:title`))}
      <View style={{height: 6}} />
      {guideOption === 'esimReg' ? (
        <Pressable
          style={styles.box}
          onPress={() =>
            actions.modal.showModal({
              content: guideModal(actions, guideOption, false),
            })
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
      {['korea', 'local'].map((v) =>
        renderBtn(
          v,
          () => {
            setRegion(v);
            navigation.navigate('UserGuide', {
              guideOption,
              region: v,
            });
          },
          false,
        ),
      )}
    </SafeAreaView>
  );
};

export default connect(
  // eslint-disable-next-line no-empty-pattern
  ({}) => ({}),
  (dispatch) => ({
    actions: {
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(GuideSelectRegionScreen);
