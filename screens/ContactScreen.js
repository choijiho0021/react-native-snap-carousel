import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Linking
} from 'react-native';

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import _ from 'underscore'
import AppBackButton from '../components/AppBackButton'
import {colors} from '../constants/Colors'
import AppIcon from '../components/AppIcon'
import * as infoActions from '../redux/modules/info'


class ContactScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('contact:title')} />
  })


  constructor(props) {
    super(props)

    this.state = {
      data: [
        { "key": "noti", "value": i18n.t('contact:notice'), 
          onPress:() => {
            this.props.navigation.navigate('Noti', {mode: 'info', title:i18n.t('notice'), info: this.props.info.infoList})
          }},
        { "key": "faq", "value": i18n.t('contact:faq'), 
          onPress:() => {
            this.props.navigation.navigate('Faq')
          }},
        { "key": "board", "value": i18n.t('contact:board'), 
          onPress:() => {
            this.props.navigation.navigate('ContactBoard')
          }},
        { "key": "ktalk", "value": i18n.t('contact:ktalk')},
        { "key": "call", "value": i18n.t('contact:call'),
          onPress:() => {
            Linking.openURL(`tel:114`)
          }},
      ],
    }
  } 

  _renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={item.onPress}>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>{item.value}</Text>
          {
            item.onPress && <AppIcon style={{alignSelf:'center'}} name="iconArrowRight"/>
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

const mapStateToProps = (state) => ({
  info : state.info.toJS()
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      info: bindActionCreators(infoActions, dispatch),
    }
  })
)(ContactScreen)