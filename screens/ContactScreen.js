import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Linking
} from 'react-native';

import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import _ from 'underscore'
import AppBackButton from '../components/AppBackButton';
import {colors} from '../constants/Colors'
import AppIcon from '../components/AppIcon';


class ContactScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('contact:title')} />
  })


  constructor(props) {
    super(props)

    this.state = {
      data: [
        { "key": "noti", "value": i18n.t('contact:notice'), route: undefined},
        { "key": "faq", "value": i18n.t('contact:faq'), route: 'Faq'},
        { "key": "board", "value": i18n.t('contact:board'), route: 'ContactBoard'},
        { "key": "ktalk", "value": i18n.t('contact:ktalk'), route: undefined},
        { "key": "call", "value": i18n.t('contact:call'), route: undefined},
      ],
    }
  } 

  _onPress = (key, route) => () => {
    switch(key) {
      case 'call' :
        Linking.openURL(`tel:114`)
        break
      default:
        if (route) {
          return this.props.navigation.navigate(route)
        }
    }
  }

  _renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={this._onPress(item.key, item.route)}>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>{item.value}</Text>
          {
            item.route && <AppIcon style={{alignSelf:'center'}} name="iconArrowRight"/>
          }
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList data={this.state.data} renderItem={this._renderItem} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    ... appStyles.title,
    marginLeft: 20,
  },
  container: {
    flex:1,
    alignItems: 'stretch'
  },
  row: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomColor: colors.whiteTwo,
    borderBottomWidth: 1
  },
  itemTitle: {
    ... appStyles.normal16Text,
    color: colors.black
  },
});


export default ContactScreen