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

type ContactBoardScreenState = {
  index: number;
  routes: {key: string; title: string}[];
  link?: string;
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

    this.onPress = this.onPress.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('board:title')} />,
    });
  }

  renderScene = (onPress) => ({route, jumpTo}) => {
    if (route.key === 'new') {
      return <BoardMsgAdd jumpTo={jumpTo} />;
    }
    if (route.key === 'list') {
      return <BoardMsgList jumpTo={jumpTo} onPress={onPress} />;
    }
    return null;
  };

  onPress = (key, status = 'O') => {
    this.props.navigation.navigate('BoardMsgResp', {key, status});
  };

  renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        tabStyle={{backgroundColor: colors.gray}}
        indicatorStyle={{
          borderBottomColor: colors.clearBlue,
          borderBottomWidth: 2,
        }}
        style={{paddingBottom: 2, backgroundColor: colors.white}}
        labelStyle={appStyles.normal16Text}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <TabView
          style={styles.container}
          navigationState={this.state}
          renderScene={this.renderScene(this.onPress)}
          onIndexChange={(index) => this.setState({index})}
          initialLayout={{width: Dimensions.get('window').width}}
          renderTabBar={this.renderTabBar}
        />
      </View>
    );
  }
}

export default ContactBoardScreen;
