/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import {List} from 'immutable';
import {Image as CropImage} from 'react-native-image-crop-picker';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {connect} from 'react-redux';
import {RootState, bindActionCreators} from 'redux';
import AppBackButton from '@/components/AppBackButton';
import BoardMsgAdd from '@/components/BoardMsgAdd';
import BoardMsgList from '@/components/BoardMsgList';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {Utils} from '@/redux/api';
import {RkbImage} from '@/redux/api/accountApi';
import {RkbIssue} from '@/redux/api/boardApi';
import {
  actions as boardActions,
  BoardAction,
  BoardModelState,
} from '@/redux/modules/board';
import AppActivityIndicator from '@/components/AppActivityIndicator';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
});

type BoardScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Board'
>;

type BoardScreenRouteProp = RouteProp<HomeStackParamList, 'Board'>;
type TabRoute = {key: string; title: string};

type BoardScreenProps = {
  navigation: BoardScreenNavigationProp;
  route: BoardScreenRouteProp;
  board: BoardModelState;

  title: string;
  routes: (TabRoute & {render: () => React.ReactElement})[];

  success: boolean;
  pending: boolean;

  action: {
    board: BoardAction;
  };
};

export type OnPressContactParams = {
  title?: string;
  msg?: string;
  mobile?: string;
  pin?: string;
  attachment: List<CropImage>;
};

const BoardScreen: React.FC<BoardScreenProps> = ({
  route: {params},
  navigation,
  action,
  pending,
  success,
  board,
  title,
  routes,
}) => {
  const [index, setIndex] = useState(params?.index ? params.index : 0);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    action.board.getIssueList();
  }, [action.board]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={title} />,
    });

    Utils.fontScaling(16).then(setFontSize);
  }, [navigation, title]);

  useEffect(() => {
    if (success) setIndex(1);
  }, [success]);

  const onPress = useCallback(
    ({title, msg, mobile, pin, attachment}: OnPressContactParams) => {
      if (!title || !msg) {
        console.log('@@@ invalid issue', title, msg);
        return false;
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
      return true;
    },
    [action.board],
  );

  const renderScene = useCallback(
    ({route, jumpTo}: {route: TabRoute; jumpTo: (v: string) => void}) => {
      return routes.find((r) => r.key === route.key)?.render() || null;
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
        initialLayout={{width: Dimensions.get('window').width}}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

export default connect(
  ({board, status}: RootState) => ({
    board,
    pending:
      status.pending[boardActions.postIssue.typePrefix] ||
      status.pending[boardActions.postAttach.typePrefix] ||
      status.pending[boardActions.fetchIssueList.typePrefix] ||
      false,
    success: status.fulfilled[boardActions.postIssue.typePrefix],
  }),
  (dispatch) => ({
    action: {
      board: bindActionCreators(boardActions, dispatch),
    },
  }),
)(BoardScreen);
