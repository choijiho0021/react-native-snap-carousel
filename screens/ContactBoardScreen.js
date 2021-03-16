/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, {Component} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import i18n from '../utils/i18n';
import AppBackButton from '../components/AppBackButton';
import BoardMsgAdd from '../components/BoardMsgAdd';
import BoardMsgList from '../components/BoardMsgList';
import {colors} from '../constants/Colors';
import {appStyles} from '../constants/Styles';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
class ContactBoardScreen extends Component {
  constructor(props) {
    super(props);

    const {params} = this.props.route;

    this.state = {
      index: params && params.index ? params.index : 0,
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
      headerLeft: () => (
        <AppBackButton
          navigation={this.props.navigation}
          title={i18n.t('board:title')}
        />
      ),
    });
  }

  renderScene({route, jumpTo}) {
    if (route.key === 'new') {
      return <BoardMsgAdd jumpTo={jumpTo} />;
    }
    if (route.key === 'list') {
      return <BoardMsgList jumpTo={jumpTo} onPress={this.onPress} />;
    }
  }

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
