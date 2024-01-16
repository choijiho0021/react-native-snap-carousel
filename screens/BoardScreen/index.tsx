import React, {memo, useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import {TabView} from 'react-native-tab-view';
import {useRoute} from '@react-navigation/native';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import {windowWidth} from '@/constants/SliderEntry.style';
import AppTabHeader from '@/components/AppTabHeader';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    alignItems: 'center',
    height: 56,
  },
  tab: {
    backgroundColor: colors.white,
    height: 50,
    paddingHorizontal: 20,
  },
  tabTitle: {
    ...appStyles.medium18,
    lineHeight: 26,
    color: colors.gray2,
  },
  selectedTabTitle: {
    ...appStyles.bold18Text,
    lineHeight: 26,
    color: colors.black,
  },
});

type TabRoute = {key: string; title: string};

type BoardScreenProps = {
  title: string;
  routes: (TabRoute & {
    render: (jumpto: (v: string) => void) => React.ReactElement;
  })[];

  pending: boolean;
};

const BoardScreen: React.FC<BoardScreenProps> = ({pending, title, routes}) => {
  const route = useRoute();
  const [index, setIndex] = useState(route?.params?.index || 0);

  const renderScene = useCallback(
    ({route, jumpTo}: {route: TabRoute; jumpTo: (v: string) => void}) => {
      return routes.find((r) => r.key === route.key)?.render(jumpTo) || null;
    },
    [routes],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppBackButton title={title} />
      </View>
      <AppTabHeader
        index={index}
        routes={routes}
        onIndexChange={(idx) => setIndex(idx)}
        style={styles.tab}
        tintColor={colors.black}
        titleStyle={styles.tabTitle}
        seletedStyle={styles.selectedTabTitle}
      />
      <TabView
        style={styles.container}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: windowWidth}}
        renderTabBar={() => null}
      />
      <AppActivityIndicator visible={pending} />
    </SafeAreaView>
  );
};

export default memo(BoardScreen);
