import React, {memo, useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TabView} from 'react-native-tab-view';
import {useNavigation, useRoute} from '@react-navigation/native';
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
  const navigation = useNavigation();
  const route = useRoute();
  const [index, setIndex] = useState(route?.params?.index || 0);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={title} />,
    });
  }, [navigation, title]);

  const renderScene = useCallback(
    ({route, jumpTo}: {route: TabRoute; jumpTo: (v: string) => void}) => {
      return routes.find((r) => r.key === route.key)?.render(jumpTo) || null;
    },
    [routes],
  );

  return (
    <View style={styles.container}>
      <AppActivityIndicator visible={pending} />

      <AppTabHeader
        index={index}
        routes={routes}
        onIndexChange={(idx) => setIndex(idx)}
        style={styles.tab}
        tintColor={colors.black}
        titleStyle={styles.tabTitle}
      />
      <TabView
        style={styles.container}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: windowWidth}}
        renderTabBar={() => null}
      />
    </View>
  );
};

export default memo(BoardScreen);
