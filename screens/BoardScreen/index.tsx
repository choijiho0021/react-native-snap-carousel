import React, {memo, useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import {useNavigation, useRoute} from '@react-navigation/native';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {Utils} from '@/redux/api';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import {windowWidth} from '@/constants/SliderEntry.style';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
});

type TabRoute = {key: string; title: string};

type BoardScreenProps = {
  title: string;
  routes: (TabRoute & {
    render: (jumpto: (v: string) => void) => React.ReactElement;
  })[];

  success: boolean;
  pending: boolean;
};

const BoardScreen: React.FC<BoardScreenProps> = ({
  pending,
  success,
  title,
  routes,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [index, setIndex] = useState(route?.params?.index || 0);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={title} />,
    });

    Utils.fontScaling(16).then(setFontSize);
  }, [navigation, title]);

  const renderScene = useCallback(
    ({route, jumpTo}: {route: TabRoute; jumpTo: (v: string) => void}) => {
      return routes.find((r) => r.key === route.key)?.render(jumpTo) || null;
    },
    [routes],
  );

  const renderTabBar = useCallback(
    (props) => (
      <TabBar
        {...props}
        tabStyle={{paddingVertical: 15}}
        labelStyle={[appStyles.normal16Text, {fontSize}]}
        activeColor={colors.black}
        inactiveColor={colors.warmGrey}
        indicatorStyle={{
          borderBottomColor: colors.clearBlue,
          borderBottomWidth: 2,
        }}
        style={{paddingBottom: 2, backgroundColor: colors.white}}
        getLabelText={(scene) => scene.route.title}
      />
    ),
    [fontSize],
  );

  return (
    <View style={styles.container}>
      <AppActivityIndicator visible={pending} />
      <TabView
        style={styles.container}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: windowWidth}}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

export default memo(BoardScreen);
