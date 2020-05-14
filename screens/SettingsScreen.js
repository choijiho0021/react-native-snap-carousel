import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Platform
} from 'react-native';
import {connect} from 'react-redux'

import AppBackButton from '../components/AppBackButton';
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import * as accountActions from '../redux/modules/account'
import * as cartActions from '../redux/modules/cart'
import * as orderActions from '../redux/modules/order'
import { bindActionCreators } from 'redux'
import AppIcon from '../components/AppIcon';
import { colors } from '../constants/Colors';
import AppModal from '../components/AppModal';
import AppSwitch from '../components/AppSwitch';
import VersionCheck from 'react-native-version-check';
import getEnvVars from '../environment'
import Analytics from 'appcenter-analytics'

const { label } = getEnvVars();

class SettingsListItem extends PureComponent {
  render() {
    const {item, onPress} = this.props
    return (
      <TouchableOpacity onPress={onPress(item.key, item.value, item.route)}>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>{item.value}</Text>
          {item.desc ? <Text style={styles.itemDesc}>{item.desc}</Text> :
          item.hasOwnProperty('toggle') ? <AppSwitch value={item.toggle} onPress={onPress(item.key, item.value, item.route)}/> :
          <AppIcon style={{alignSelf:'center'}} name="iconArrowRight"/> }
        </View>
      </TouchableOpacity>
    )
  }
}


class SettingsScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <AppBackButton navigation={navigation} title={i18n.t('settings')}/>
      // <Text style={styles.title}>{i18n.t('settings')}</Text>
    ),
  })

  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      data: [
        { "key": "pushnoti", "value": i18n.t('set:pushnoti'), toggle: props.isPushNotiEnabled, route: undefined},
        { "key": "info", "value": i18n.t('set:info'), route: 'MySim'},
        { "key": "Contract", "value": i18n.t('set:contract'), route: 'SimpleText'},
        { "key": "Privacy", "value": i18n.t('set:privacy'), route: 'SimpleText'},
        { "key": "version", "value": i18n.t('set:version'), "desc": i18n.t('now') + ' ' + VersionCheck.getCurrentVersion() + '/' + label.replace(/v/g, ''), route: undefined},
        { "key": "aboutus", "value": i18n.t('set:aboutus'), route: 'SimpleText'},
        { "key": "logout", "value": i18n.t(props.loggedIn ? 'set:logout' : 'set:login'), route: undefined},
      ],
    }

    this._onPress = this._onPress.bind(this)
    this._showModal = this._showModal.bind(this)
    this._logout = this._logout.bind(this)

    this._isMounted = null
  }

  componentDidUpdate(prevProps) {
    const { loggedIn, isPushNotiEnabled, failure } = this.props

    if ( loggedIn != prevProps.loggedIn) {
      this.setState({
        data: this.state.data.map(item => item.key == 'logout' ? {
          ... item, 
          value: i18n.t(loggedIn ? 'set:logout' : 'set:login')
        } : item)
      })
    }

    if ( isPushNotiEnabled !== prevProps.isPushNotiEnabled && this._isMounted) {
      this.setState({
        data: this.state.data.map(item => item.key == 'pushnoti' ? {
          ... item, 
          toggle: isPushNotiEnabled
        } : item)
      })
    }

    if ( failure && failure !== prevProps.failure ) {
      AppAlert.error(i18n.t('set:fail'))
    }
  }

  componentDidMount(){
    const { loggedIn, isPushNotiEnabled} = this.props
    this._isMounted = true
 
    if(loggedIn){
      this.props.action.cart.cartFetch()
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  _onPress = (key, title, route) => () => {
    const { pending } = this.props

    switch(key) {
      case 'logout' :
        if ( this.props.loggedIn) this._showModal(true)
        else this.props.navigation.navigate('Auth')

        break;

      case 'pushnoti':
        if ( ! pending ) {
          this.props.action.account.changePushNoti()
        }

        break;

      default:
        if ( route) {
          Analytics.trackEvent('Page_View_Count', {page : 'MyPage' + key})
          this.props.navigation.navigate(route, {key,title})
        }
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
    return <SettingsListItem item={item} onPress={this._onPress} />
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
  itemDesc: {
    ... appStyles.normal12Text,
    color: colors.warmGrey
  },
  switch: {
    transform:[{ scaleX: 1 }, { scaleY: .7 }]
  }
});

const mapStateToProps = (state) => ({
  loggedIn: state.account.get('loggedIn'),
  isPushNotiEnabled: state.account.get('isPushNotiEnabled'),
  pending: state.pender.pending[accountActions.CHANGE_ATTR] ||
    state.pender.pending[accountActions.UPDATE_ACCOUNT] || false,
  failure: state.pender.failure[accountActions.CHANGE_ATTR]
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