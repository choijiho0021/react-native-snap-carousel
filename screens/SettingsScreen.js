import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux'

import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import * as accountActions from '../redux/modules/account'
import utils from '../utils/utils';
import userApi from '../utils/api/userApi';
import { bindActionCreators } from 'redux'
import AppIcon from '../components/AppIcon';
import { colors } from '../constants/Colors';
import AppModal from '../components/AppModal';

class SettingsScreen extends Component {
  static navigationOptions = (navigation) => ({
    headerLeft: (
      <Text style={styles.title}>{i18n.t('settings')}</Text>
    ),
  })

  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      data: [
        { "key": "info", "value": i18n.t('set:info'), route: 'MySim'},
        { "key": "Contract", "value": i18n.t('set:contract'), route: 'SimpleText'},
        { "key": "Privacy", "value": i18n.t('set:privacy'), route: 'SimpleText'},
        { "key": "version", "value": i18n.t('set:version'), route: undefined},
        { "key": "aboutus", "value": i18n.t('set:aboutus'), route: 'SimpleText'},
        { "key": "logout", "value": i18n.t('set:logout'), route: undefined},
      ],
    }

    this._onPress = this._onPress.bind(this)
    this._showModal = this._showModal.bind(this)
    this._logout = this._logout.bind(this)
  }

  _onPress = (key, title, route) => () => {
    if ( key == 'logout') {
      this._showModal(true)
    }

    if ( route) {
      this.props.navigation.navigate(route, {key,title})
    }
  }

  async _logout() {
    await utils.removeData( userApi.KEY_ICCID)
    await utils.removeData( userApi.KEY_MOBILE)
    await utils.removeData( userApi.KEY_PIN)

    this.props.action.account.clearAccount()

    this.props.navigation.navigate('HomeStack')

    this._showModal(false)
  }

  _showModal(value) {
    this.setState({
      showModal: value
    })
  }

  _renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={this._onPress(item.key, item.value, item.route)}>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>{item.value}</Text>
          <AppIcon style={{alignSelf:'center'}} name="iconArrowRight"/>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { showModal } = this.state

    return (
      <View style={styles.container}>
        <FlatList data={this.state.data} renderItem={this._renderItem} />

        <AppModal title={i18n.t('set:confirmLogout')} 
          onOkClose={this._logout}
          onCancelClose={() => this._showModal(false)}
          visible={showModal} />
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
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      account : bindActionCreators(accountActions, dispatch)
    }
  })
)(SettingsScreen)