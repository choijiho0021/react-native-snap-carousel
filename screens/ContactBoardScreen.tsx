/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, {Component} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import i18n from '@/utils/i18n';
import AppBackButton from '@/components/AppBackButton';
import BoardMsgAdd from '@/components/BoardMsgAdd';
import BoardMsgList from '@/components/BoardMsgList';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '@/navigation/navigation';
import {RouteProp} from '@react-navigation/native';
import {Utils} from '@/redux/api';

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
};

type TabRoute = {key: string; title: string};
type ContactBoardScreenState = {
  index: number;
  routes: TabRoute[];
  link?: string;
  fontSize?: number;
};
class ContactBoardScreen extends Component<
  ContactBoardScreenProps,
  ContactBoardScreenState
> {
  constructor(props: ContactBoardScreenProps) {
    super(props);

    const {params} = this.props.route;

    this.state = {
      index: params?.index ? params.index : 0,
      routes: [
        {key: 'new', title: i18n.t('board:new')},
        {key: 'list', title: i18n.t('board:list')},
      ],
      link: undefined,
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('board:title')} />,
    });

    Utils.fontScaling(16).then((v) =>
      this.setState({
        fontSize: v,
      }),
    );
  }

  renderScene = ({
    route,
    jumpTo,
  }: {
    route: TabRoute;
    jumpTo: (v: string) => void;
  }) => {
    if (route.key === 'new') {
      return <BoardMsgAdd jumpTo={jumpTo} />;
    }
    if (route.key === 'list') {
      return (
        <BoardMsgList
          onPress={(uuid: string, status: string) =>
            this.props.navigation.navigate('BoardMsgResp', {
              uuid,
              status,
            })
          }
        />
      );
    }
    return null;
  };

  renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        tabStyle={{backgroundColor: colors.gray}}
        labelStyle={[appStyles.normal16Text, {fontSize: this.state.fontSize}]}
        indicatorStyle={{
          borderBottomColor: colors.clearBlue,
          borderBottomWidth: 2,
        }}
        style={{paddingBottom: 2, backgroundColor: colors.white}}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <TabView
          style={styles.container}
          navigationState={this.state}
          renderScene={this.renderScene}
          onIndexChange={(index) => this.setState({index})}
          initialLayout={{width: Dimensions.get('window').width}}
          renderTabBar={this.renderTabBar}
        />
      </View>
    );
  }
}

export default ContactBoardScreen;
