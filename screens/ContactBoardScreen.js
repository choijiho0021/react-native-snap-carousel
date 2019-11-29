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
import { TabView, SceneMap } from 'react-native-tab-view';
import BoardMsgAdd from '../components/BoardMsgAdd';
import BoardMsgList from '../components/BoardMsgList';

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
    console.log('goto screen', key)
    this.props.navigation.navigate('BoardMsgResp', {key})
  }


  renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'new':
        return <BoardMsgAdd jumpTo={jumpTo} navigation={this.props.navigation}/>
      case 'list':
        return <BoardMsgList jumpTo={jumpTo} onPress={this._onPress} />
    }
  };


  render() {
    return (
      <View style={styles.container}>
        <TabView style={styles.container} 
          navigationState={this.state}
          renderScene={this.renderScene}
          onIndexChange={index => this.setState({ index})}
          initialLayout={{ width: Dimensions.get('window').width }}
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