/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {connect} from 'react-redux';
import i18n from '@/utils/i18n';
import AppBackButton from '@/components/AppBackButton';
import BoardMsgAdd from '@/components/BoardMsgAdd';
import BoardMsgList from '@/components/BoardMsgList';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {Utils} from '@/redux/api';
import {RootState} from '@/redux';
import {PromotionModelState} from '@/redux/modules/promotion';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
});

type EventBoardScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'EventBoard'
>;

type EventBoardScreenRouteProp = RouteProp<HomeStackParamList, 'EventBoard'>;

type EventBoardScreenProps = {
  navigation: EventBoardScreenNavigationProp;
  route: EventBoardScreenRouteProp;
  promotion: PromotionModelState;
};

type TabRoute = {key: string; title: string};

const EventBoardScreen: React.FC<EventBoardScreenProps> = ({
  route: {params},
  navigation,
  promotion,
}) => {
  const [index, setIndex] = useState(params?.index ? params.index : 0);
  const routes = useRef([
    {key: 'new', title: i18n.t('event:new')},
    {key: 'list', title: i18n.t('event:list')},
  ]).current;
  const [fontSize, setFontSize] = useState(16);
  const eventList = useMemo(() => promotion.event || [], [promotion.event]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('event:title')} />,
    });

    Utils.fontScaling(16).then(setFontSize);
  }, [navigation]);

  const renderScene = useCallback(
    ({route, jumpTo}: {route: TabRoute; jumpTo: (v: string) => void}) => {
      if (route.key === 'new') {
        return <BoardMsgAdd jumpTo={jumpTo} isEvent eventList={eventList} />;
      }
      if (route.key === 'list') {
        return (
          <BoardMsgList
            isEvent
            onPress={(uuid: string, status: string) =>
              navigation.navigate('BoardMsgResp', {
                uuid,
                status,
                isEvent: true,
              })
            }
          />
        );
      }
      return null;
    },
    [eventList, navigation],
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
          borderBottomColor: colors.black,
          borderBottomWidth: 2,
        }}
        style={{
          paddingBottom: 2,
          backgroundColor: colors.white,
          marginHorizontal: 20,
        }}
        getLabelText={(scene) => scene.route.title}
      />
    ),
    [fontSize],
  );

  return (
    <View style={styles.container}>
      <TabView
        style={styles.container}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: Dimensions.get('window').width}}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

export default connect(({promotion}: RootState) => ({
  promotion,
}))(EventBoardScreen);
