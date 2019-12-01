import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

import i18n from '../utils/i18n'
import _ from 'underscore'
import AppBackButton from '../components/AppBackButton';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import BoardMsgAdd from '../components/BoardMsgAdd';
import BoardMsgList from '../components/BoardMsgList';
import {colors} from '../constants/Colors'
import { appStyles } from '../constants/Styles';

class ContactBoardScreen extends Component {
  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({navigation, title:i18n.t('board:title')}),
  })

  constructor(props) {
    super(props)

    this.state = {
      index: 0,
      routes: [
        { key: 'new', title: i18n.t('board:new') },
        { key: 'list', title: i18n.t('board:list') },
      ],
      link: undefined
    }

    this._onPress = this._onPress.bind(this)
  } 

  _onPress = (key) => {
    this.props.navigation.navigate('BoardMsgResp', {key})
  }


  _renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'new':
        return <BoardMsgAdd jumpTo={jumpTo} navigation={this.props.navigation}/>
      case 'list':
        return <BoardMsgList jumpTo={jumpTo} onPress={this._onPress} />
    }
  };


  _renderTabBar = (props) => {
    return <TabBar
      {...props}
      tabStyle={{backgroundColor:colors.white}}
      indicatorStyle={{borderBottomColor:colors.clearBlue, borderBottomWidth:2}}
      style={{paddingBottom:2, backgroundColor:colors.white}}
      labelStyle={appStyles.normal16Text}
    />
  }

  render() {
    return (
      <View style={styles.container}>
        <TabView style={styles.container} 
          navigationState={this.state}
          renderScene={this._renderScene}
          onIndexChange={index => this.setState({ index})}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={this._renderTabBar}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default ContactBoardScreen