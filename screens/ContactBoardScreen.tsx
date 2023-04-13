/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import {List} from 'immutable';
import {Image as CropImage} from 'react-native-image-crop-picker';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import i18n from '@/utils/i18n';
import AppBackButton from '@/components/AppBackButton';
import BoardMsgAdd from '@/components/BoardMsgAdd';
import BoardMsgList from '@/components/BoardMsgList';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {Utils} from '@/redux/api';
import {RkbImage} from '@/redux/api/accountApi';
import {RkbIssue} from '@/redux/api/boardApi';
import {actions as boardActions, BoardAction} from '@/redux/modules/board';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
});

type ContactBoardScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ContactBoard'
>;

type ContactBoardScreenRouteProp = RouteProp<
  HomeStackParamList,
  'ContactBoard'
>;

type ContactBoardScreenProps = {
  navigation: ContactBoardScreenNavigationProp;
  route: ContactBoardScreenRouteProp;

  action: {
    board: BoardAction;
  };
};

type TabRoute = {key: string; title: string};

export type OnPressContactParams = {
  title?: string;
  msg?: string;
  mobile?: string;
  pin?: string;
  attachment: List<CropImage>;
};

const ContactBoardScreen: React.FC<ContactBoardScreenProps> = ({
  route: {params},
  navigation,
  action,
}) => {
  const [index, setIndex] = useState(params?.index ? params.index : 0);
  const routes = useRef([
    {key: 'new', title: i18n.t('board:new')},
    {key: 'list', title: i18n.t('board:list')},
  ]).current;
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('board:title')} />,
    });

    Utils.fontScaling(16).then(setFontSize);
  }, [navigation]);

  const onPress = useCallback(
    ({title, msg, mobile, pin, attachment}: OnPressContactParams) => {
      if (!title || !msg) {
        console.log('@@@ invalid issue', title, msg);
        return;
      }
      const issue = {
        title,
        msg,
        mobile,
        pin,
        images: attachment
          .map(
            ({mime, size, width, height, data}) =>
              ({
                mime,
                size,
                width,
                height,
                data,
              } as RkbImage),
          )
          .toArray(),
      } as RkbIssue;
      action.board.postAndGetList(issue);
    },
    [action.board],
  );

  const renderScene = useCallback(
    ({route, jumpTo}: {route: TabRoute; jumpTo: (v: string) => void}) => {
      if (route.key === 'new') {
        return <BoardMsgAdd jumpTo={jumpTo} onPressContact={onPress} />;
      }
      if (route.key === 'list') {
        return (
          <BoardMsgList
            onPress={(uuid: string, status: string) =>
              navigation.navigate('BoardMsgResp', {
                uuid,
                status,
              })
            }
          />
        );
      }
      return null;
    },
    [navigation, onPress],
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

export default connect(
  () => ({}),
  (dispatch) => ({
    action: {
      board: bindActionCreators(boardActions, dispatch),
    },
  }),
)(ContactBoardScreen);
