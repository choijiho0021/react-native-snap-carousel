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
import * as cartActions from '../redux/modules/cart'
import * as orderActions from '../redux/modules/order'
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
        { "key": "logout", "value": i18n.t(props.loggedIn ? 'set:logout' : 'set:login'), route: undefined},
      ],
    }

    this._onPress = this._onPress.bind(this)
    this._showModal = this._showModal.bind(this)
    this._logout = this._logout.bind(this)
  }

  componentDidUpdate(prevProps) {
    const { loggedIn} = this.props
    if ( loggedIn != prevProps.loggedIn) {
      this.setState({
        data: this.state.data.map(item => item.key == 'logout' ? {
          ... item, 
          value: i18n.t(loggedIn ? 'set:logout' : 'set:login')
        } : item)
      })
    }

  }

  _onPress = (key, title, route) => () => {
    if ( key == 'logout') {
      if ( this.props.loggedIn) this._showModal(true)
      else this.props.navigation.navigate('Auth')
    }
    else if ( route) {
      this.props.navigation.navigate(route, {key,title})
    }
  }

  _logout() {

    this.props.action.cart.reset()
    this.props.action.order.reset()
    this.props.action.account.logout()

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
  loggedIn: state.account.get('loggedIn')
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      account : bindActionCreators(accountActions, dispatch),
      cart : bindActionCreators(cartActions, dispatch),
      order : bindActionCreators(orderActions, dispatch),
    }
  })
)(SettingsScreen)