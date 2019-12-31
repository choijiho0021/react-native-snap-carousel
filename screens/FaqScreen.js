import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
} from 'react-native';

import i18n from '../utils/i18n'
import _ from 'underscore'
import AppBackButton from '../components/AppBackButton';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AppActivityIndicator from '../components/AppActivityIndicator';
import pageApi from '../utils/api/pageApi';
import { colors } from '../constants/Colors';
import { appStyles } from '../constants/Styles';
import AppFlatListItem from '../components/AppFlatListItem';


class FaqList extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.data != this.props.data
  }

  _renderItem({item}) {
    return (<AppFlatListItem key={item.key} item={item} />)
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList renderItem={this._renderItem} data={this.props.data} />
      </View>
    )
  }
}

class FaqScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('contact:faq')} />
  })

  constructor(props) {
    super(props)

    this.state = {
      querying: false,
      index: 0,
      routes: [
        { key: 'general', title: i18n.t('faq:general') },
        { key: 'payment', title: i18n.t('faq:payment') },
        { key: 'lost', title: i18n.t('faq:lost') },
        { key: 'refund', title: i18n.t('faq:refund') },
      ],
      general: [], 
      payment: [],
      lost: [], 
      refund: []
    }

    this._onPress = this._onPress.bind(this)
    this._onIndexChange = this._onIndexChange.bind(this)
    this._refreshData = this._refreshData.bind(this)
    this._renderScene = this._renderScene.bind(this)
  } 

  componentDidMount() {
    this._refreshData(0)
  }

  _refreshData(index) {
    if ( index < 0 || index >= this.state.routes.length) return 

    const {key} = this.state.routes[index]
    if ( this.state[key].length > 0) return

    this.setState({
      querying: true
    })

    pageApi.getPageByCategory('faq:' + key).then(resp => {
      if ( resp.result == 0 && resp.objects.length > 0) {
        this.setState({
          [key]: resp.objects
        })
      }
      else throw new Error('failed to get page:' + key)
    }).catch(err => {
      console.log('failed to get page', key, err)
    }).finally(_ => {
      this.setState({
        querying: false
      })
    })

  }

  _onPress = (key) => {
    console.log('goto screen', key)
    this.props.navigation.navigate('BoardMsgResp', {key})
  }

  _onIndexChange(index) {
    this._refreshData(index)

    this.setState({
      index
    })
  }

  _renderScene = ({ route, jumpTo }) => {
    return <FaqList data={this.state[route.key]} jumpTp={jumpTo} />
  }

  _renderTabBar = (props) => {
    return <TabBar
      {...props}
      tabStyle={{backgroundColor:colors.whiteTwo}}
      activeColor={colors.clearBlue}
      inactiveColor={colors.warmGrey}
      pressColor={colors.white}
      style={styles.tabBar}
    />
  }

  render() {

    return (
      <View style={styles.container}>
        <AppActivityIndicator visible={this.state.querying} />
        <TabView style={styles.container} 
          navigationState={this.state}
          renderScene={this._renderScene}
          onIndexChange={this._onIndexChange}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={this._renderTabBar}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  row: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.whiteTwo
  },
  title: {
    ... appStyles.normal16Text,
    flex: 1,
    marginLeft: 20
  },
  body: {
    ... appStyles.normal14Text,
    color: colors.warmGrey,
    backgroundColor: colors.whiteTwo,
    padding: 20
  },
  button: {
    paddingHorizontal: 20
  },
  tabBarLabel: {
    ... appStyles.normal14Text
  },
  tabBar : {
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  }
});

export default FaqScreen