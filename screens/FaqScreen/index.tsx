import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootState} from '@reduxjs/toolkit';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, Platform, View} from 'react-native';
import {TabView} from 'react-native-tab-view';
import {connect, DispatchProp} from 'react-redux';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import {actions as infoActions, InfoModelState} from '@/redux/modules/info';
import i18n from '@/utils/i18n';
import FaqList from './components/FaqList';
import AppTabHeader from '@/components/AppTabHeader';
import {appStyles} from '@/constants/Styles';
import {windowWidth} from '@/constants/SliderEntry.style';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
  tab: {
    height: 56,
    backgroundColor: colors.white,
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  tabTitle: {
    ...appStyles.medium16,
    lineHeight: 24,
    color: colors.gray2,
  },
  selectedTabTitle: {
    ...appStyles.bold16Text,
    lineHeight: 24,
    color: colors.black,
  },
});

type FaqScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Faq'>;

type FaqScreenRouteProp = RouteProp<HomeStackParamList, 'Faq'>;

type FaqScreenProps = {
  navigation: FaqScreenNavigationProp;
  route: FaqScreenRouteProp;

  info: InfoModelState;
  pending: boolean;
};
type TabViewRouteAndroidKey =
  | 'general.android'
  | 'config.android'
  | 'payment.android'
  | 'etc.android';
type TabViewRouteIosKey =
  | 'general.ios'
  | 'config.ios'
  | 'payment.ios'
  | 'etc.ios';
type TabViewRouteKey =
  | 'general'
  | 'config'
  | 'payment'
  | 'etc'
  | TabViewRouteAndroidKey
  | TabViewRouteIosKey;
type TabViewRoute = {
  key: TabViewRouteKey;
  title: string;
};

const FaqScreen: React.FC<FaqScreenProps & DispatchProp> = ({
  info,
  dispatch,
  route,
  navigation,
  pending,
}) => {
  const [index, setIndex] = useState(0);
  const [selectedTitleNo, setSelectedTitleNo] = useState<string>();
  const routes = useMemo(
    () =>
      [
        {key: `general.${Platform.OS}`, title: i18n.t('faq:general')},
        {key: `config.${Platform.OS}`, title: i18n.t('faq:config')},
        {key: `payment.${Platform.OS}`, title: i18n.t('faq:payment')},
        {key: `etc.${Platform.OS}`, title: i18n.t('faq:etc')},
      ] as TabViewRoute[],
    [],
  );

  const refreshData = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= routes.length) return;

      const {key} = routes[idx];
      if (info.infoMap.has(`faq:${key}`)) return;

      dispatch(infoActions.getInfoList(`faq:${key}`));
    },
    [dispatch, info.infoMap, routes],
  );

  const onIndexChange = useCallback(
    (idx: number) => {
      refreshData(idx);

      setIndex(idx);
      setSelectedTitleNo(undefined);
    },
    [refreshData],
  );

  const renderScene = useCallback(
    ({route: tabViewRoute}: {route: TabViewRoute}) => (
      <FaqList
        data={info.infoMap.get(`faq:${tabViewRoute.key}`, [])}
        titleNo={selectedTitleNo}
      />
    ),
    [info, selectedTitleNo],
  );

  useEffect(() => {
    const {key, num} = route.params || {};
    if (key && num) {
      const idx = routes.findIndex((item) => item.key === key);
      if (idx >= 0) {
        setIndex(idx);
        setSelectedTitleNo(num);
      }

      refreshData(idx >= 0 ? idx : 0);

      navigation.setParams({
        key: undefined,
        num: undefined,
      });
    } else refreshData(0);
  }, [navigation, refreshData, route.params, routes]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={appStyles.header}>
        <AppBackButton title={i18n.t('contact:faq')} />
      </View>
      <AppActivityIndicator visible={pending} />
      <AppTabHeader
        index={index}
        routes={routes}
        onIndexChange={onIndexChange}
        style={styles.tab}
        tintColor={colors.black}
        titleStyle={styles.tabTitle}
        seletedStyle={styles.selectedTabTitle}
      />
      <TabView
        style={styles.container}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={onIndexChange}
        initialLayout={{width: windowWidth}}
        renderTabBar={() => null}
      />
    </SafeAreaView>
  );
};

export default connect(({info, status}: RootState) => ({
  info,
  pending: status.pending[infoActions.getInfoList.typePrefix] || false,
}))(memo(FaqScreen));
