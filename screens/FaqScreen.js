import React, {useState, Component} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';

import i18n from '../utils/i18n'
import _ from 'underscore'
import AppBackButton from '../components/AppBackButton';
import { TabView, SceneMap } from 'react-native-tab-view';
import AppActivityIndicator from '../components/AppActivityIndicator';
import pageApi from '../utils/api/pageApi';
import utils from '../utils/utils';
import AppIcon from '../components/AppIcon';
import { colors } from '../constants/Colors';
import { appStyles } from '../constants/Styles';

const renderItem = (checked, setChecked) => ({item}) => (
  <TouchableOpacity onPress={() => setChecked({
    ... checked,
    [item.uuid] : ! checked[item.uuid] 
  })} >
    <View>
      <View style={styles.row}>
        <Text style={styles.title}>{item.title}</Text>
        <AppIcon style={styles.button} name={checked[item.uuid] ? "iconArrowUp" : "iconArrowDown"} />
      </View>
      {
        checked[item.uuid] && <Text style={styles.body}>{utils.htmlToString(item.body)}</Text>
      }
    </View>
  </TouchableOpacity>
)
    //<Text>{utils.htmlToString(item.body)}</Text>

const FaqList = (data) => () => {
  const [ checked, setChecked] = useState({})

  return (
    <View style={styles.container}>
      <FlatList renderItem={renderItem(checked, setChecked)} 
        extraData={checked}
        data={data} 
        keyExtractor={item => item.uuid}/>
    </View>
  )
}

class FaqScreen extends Component {
  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({navigation, title:i18n.t('contact:faq')}),
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


  render() {
    const { general, payment, lost, refund, querying} = this.state

    return (
      <View style={styles.container}>
        <AppActivityIndicator visible={querying} />
        <TabView style={styles.container} 
          navigationState={this.state}
          renderScene={SceneMap({
            'general' : FaqList( general),
            'payment' : FaqList( payment),
            'lost' : FaqList( lost),
            'refund' : FaqList( refund),
          })}
          onIndexChange={this._onIndexChange}
          initialLayout={{ width: Dimensions.get('window').width }}
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
  }
});

export default FaqScreen