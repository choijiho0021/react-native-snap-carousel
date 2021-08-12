import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import i18n from '@/utils/i18n';
import AppBackButton from '@/components/AppBackButton';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import {colors} from '@/constants/Colors';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '@/navigation/navigation';
import {RouteProp} from '@react-navigation/native';
import {RootState} from '@reduxjs/toolkit';
import {connect, DispatchProp} from 'react-redux';
import {actions as infoActions, InfoModelState} from '@/redux/modules/info';
import FaqList from './components/FaqList';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
  tabBar: {
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
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

type TabViewRouteKey = 'general' | 'config' | 'payment' | 'etc';
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
        {key: 'general', title: i18n.t('faq:general')},
        {key: 'config', title: i18n.t('faq:config')},
        {key: 'payment', title: i18n.t('faq:payment')},
        {key: 'etc', title: i18n.t('faq:etc')},
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
    ({route}: {route: TabViewRoute}) => (
      <FaqList
        data={info.infoMap.get(`faq:${route.key}`, [])}
        titleNo={selectedTitleNo}
      />
    ),
    [info, selectedTitleNo],
  );

  useEffect(() => {
    const {key, num} = route.params || {};

    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('contact:faq')} />,
    });

    const idx = routes.findIndex((item) => item.key === key);
    if (idx > 0) {
      setIndex(idx);
      setSelectedTitleNo(num);
    }

    refreshData(idx > 0 ? idx : 0);
  }, [navigation, refreshData, route.params, routes]);

  return (
    <View style={styles.container}>
      <AppActivityIndicator visible={pending} />
      <TabView
        style={styles.container}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={onIndexChange}
        initialLayout={{width: Dimensions.get('window').width}}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            tabStyle={{backgroundColor: colors.whiteTwo}}
            activeColor={colors.clearBlue}
            inactiveColor={colors.warmGrey}
            pressColor={colors.white}
            style={styles.tabBar}
          />
        )}
      />
    </View>
  );
};

export default connect(({info, status}: RootState) => ({
  info,
  pending: status.pending[infoActions.getInfoList.typePrefix] || false,
}))(memo(FaqScreen));
