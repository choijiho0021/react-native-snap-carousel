import React, {Component, PureComponent} from 'react';
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
import * as notiActions from '../redux/modules/noti'
import AppModal from '../components/AppModal';

class ContactListItem extends PureComponent {
  render() {
    const {item} = this.props
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
}


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
        { "key": "ktalk", "value": i18n.t('contact:ktalk'),
          onPress:() => {
            this._sendKTalk()
          }},
        { "key": "call", "value": i18n.t('contact:call'),
          onPress:() => {
            Linking.openURL(`tel:114`)
          }},
      ],
      showModal: false
    }

    this._sendKTalk = this._sendKTalk.bind(this);
    this._showModal = this._showModal.bind(this);

    this._cancelKtalk = null;
  } 

  componentDidUpdate(prevProps) {
    if ( ! _.isUndefined(this.props.noti.result)
      && prevProps.noti.result !== this.props.noti.result ) {
        this._showModal(true)
    }
  }

  _renderItem = ({item}) => {
    return <ContactListItem item={item} />
  }

  _showModal = (value) => {
    this.setState({ 'showModal': value })
  }

  _sendKTalk = () => {
    const resendable = this.props.noti.result !== 0 ||
      (this.props.noti.lastSent instanceof Date ? Math.round( (new Date() - this.props.noti.lastSent)/ (1000*60) ) > 0 : true)

    if ( ! this.props.account.loggedIn ) {
      this.props.navigation.navigate('Auth')
      return;
    }

    if (this.props.pending || ! resendable ) {
      this._showModal(true)
      return;
    }

    if ( this._cancelKtalk ) {
      this._cancelKtalk()
      this._cancelKtalk = null
    }

    const sendKtalk = this.props.action.noti.initAndSendAlimTalk({
      mobile: this.props.account.mobile,
      abortController: new AbortController()
    })

    this._cancelKtalk = sendKtalk.cancel
    sendKtalk.catch( err => console.log("failed to send alimtalk", err))
    
  }

  render() {
    const { showModal } = this.state

    return (
      <View style={styles.container}>
        <FlatList data={this.state.data} renderItem={this._renderItem} />

        <AppModal title={
            this.props.noti.result === 0 || _.isUndefined(this.props.noti.result) ?
              i18n.t('set:sendAlimTalk') :
              i18n.t('set:failedToSendAlimTalk')
          } 
          type={'info'}
          onOkClose={() => this._showModal(false)}
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
  info : state.info.toJS(),
  account : state.account.toJS(),
  noti : state.noti.toJS(),
  pending: state.pender.pending[notiActions.SEND_ALIM_TALK] || false 
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      info: bindActionCreators(infoActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch)
    }
  })
)(ContactScreen)