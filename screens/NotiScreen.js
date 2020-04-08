import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';
import {bindActionCreators} from 'redux'
import i18n from '../utils/i18n'
import {connect} from 'react-redux'
import {appStyles} from '../constants/Styles'
import { colors } from '../constants/Colors';
import AppIcon from '../components/AppIcon';
import utils from '../utils/utils';
import _ from 'underscore'
import * as orderActions from '../redux/modules/order'
import * as notiActions from '../redux/modules/noti'
import * as boardActions from '../redux/modules/board'
import * as accountActions from '../redux/modules/account'
import AppBackButton from '../components/AppBackButton';
import { Platform } from '@unimodules/core';

const MODE_NOTIFICATION = 'info'
const CONTACT_BOARD_LIST_INDEX = 1

class NotiListItem extends PureComponent {
  render() {
    const {item, onPress} = this.props
    // summary가 있으면, 우선적으로 표시한다.
    return (
      <TouchableOpacity onPress={() => onPress(item.uuid, item.title, item.body, item.notiType, item.format)}>
        <View key={item.uuid} style={[styles.notibox,{backgroundColor:item.isRead == "F" ? "#f7f8f9" : colors.white}]}>
          <View key='notitext' style={styles.notiText} >
            <Text key='created' style={styles.created}>{utils.toDateString(item.created)}</Text>
            <View style={styles.title}>
              <Text key='titleText' style={styles.titleText}>{item.title}</Text>
            </View>
            <Text key='body' style={styles.body} numberOfLines={3} ellipsizeMode={'tail'} >{utils.htmlToString(item.summary || item.body)}
            </Text>
          </View>
          { item.notiType != notiActions.NOTI_TYPE_NOTI ?
          <View key='iconview' style={styles.Icon}>
            <AppIcon key='icon' name="iconArrowRight" size={10} />
          </View> : null}
        </View>
      </TouchableOpacity>
    )
  }
}

class NotiScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={navigation.getParam('title') || i18n.t('set:noti')} />
  })

  constructor(props) {
    super(props)

    this.state = {
      list : undefined,
      refreshing : false
    }

    this._onRefresh = this._onRefresh.bind(this)
  }

  componentDidMount(){
    const mode = this.props.navigation.getParam('mode')
    const info = this.props.navigation.getParam('info')

    this.props.action.board.getIssueList()
    this.props.action.order.getOrders(this.props.auth)
    this.setState({mode,info})
  }

  componentDidUpdate(prevProps){
    if ( ! this.props.pending && this.props.pending != prevProps.pending) {
      const { notiList } = this.props.noti
      const notiCount = notiList.filter(item => item.isRead == 'F').length

      if(Platform.OS == 'android'){
        const firebase = require('react-native-firebase')
        
        firebase.notifications().setBadge(notiCount)
      }
      else if(Platform.OS == 'ios'){
        const PushNotificationIOS = require('@react-native-community/push-notification-ios')
        PushNotificationIOS.setApplicationIconBadgeNumber(notiCount)
      }
      
      this.setState({
        refreshing: false
      })
    }
  }

  _onPress = (uuid, bodyTitle, body, notiType, format = 'text') => {
    const { orders } = this.props.order

    const {mode} = this.state
    const split = notiType.split('/') 
    const type = split[0]
    const id = split[1]

    if (uuid) {
      // if ( mode != MODE_NOTIFICATION) this.props.action.noti.notiReadAndGet(uuid, this.props.account.mobile, this.props.auth )
      if ( mode != MODE_NOTIFICATION) this.props.action.noti.readNoti(uuid, this.props.auth )

      switch (type) {
        case notiActions.NOTI_TYPE_REPLY :
          this.props.navigation.navigate('BoardMsgResp', {key:id,status:'C'})
          break;
        case notiActions.NOTI_TYPE_PYM:
          this.props.navigation.navigate('PurchaseDetail', {detail: orders.find(item => item.orderId == id), auth: this.props.auth})
          break;
        case notiActions.NOTI_TYPE_USIM:
          this.props.navigation.navigate('Usim')
          break;
        case notiActions.NOTI_TYPE_NOTI:
        // 아무것도 하지 않음
          break;
        default: 
          this.props.navigation.navigate('SimpleText', {key:'noti', title:i18n.t('set:noti'), bodyTitle:bodyTitle, text:body, mode:format})
      }
    }
  }

  _renderItem = ({item,index}) => {
    return <NotiListItem item={item} index={index} onPress={this._onPress}/>
  }

  renderEmptyContainer () {
    return <Text style={styles.emptyPage}>{i18n.t('noti:empty')}</Text>
  }

  _onRefresh() {
    this.setState({
      refreshing: true
    })
    this.props.action.noti.getNotiList(this.props.account.mobile)
  }

  render() {
    const {notiList} = this.props.noti
    const {mode, info, refreshing} = this.state

    const data = mode == MODE_NOTIFICATION ? info : notiList

    return (
      <View key={"container"} style={styles.container}>
        <FlatList 
          data={data} 
          renderItem={this._renderItem }
          onRefresh={this._onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={this.renderEmptyContainer()}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ... appStyles.container,
    alignItems: 'stretch'
  },
  // notibox(color) {
  //   ({
  //     height: 98,
  //     marginTop:7,
  //     paddingLeft:18,
  //     paddingRight:20,
  //     alignItems:'center',
  //     justifyContent:'space-between',
  //     flexDirection: "row",
  //     backgroundColor: color || colors.white
  //   })
  // },
  notibox : {
      height: 126,
      marginTop:3,
      paddingTop:14,
      paddingLeft:18,
      paddingRight:20,
      alignItems:'center',
      justifyContent:'space-between',
      flexDirection: "row"
  },
  created: {
    ... appStyles.normal12Text,
    textAlign:'left'
  },
  title:{
    marginBottom:11,
    marginTop:5,
    flexDirection: "row",
    alignItems:"center"
  },
  titleText:{
    ... appStyles.normal16Text
  },
  titleHead:{
    fontSize: 8,
    color:colors.tomato,
    marginRight:6
  },
  renderItem : {
    height: 98,
    alignItems:'center',
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  notiText:{
    width:'90%',
    height:98
  },
  body: {
    ... appStyles.normal14Text,
    height:48,
    width:'100%',
    lineHeight: 24,
    letterSpacing: 0.23,
    color: colors.warmGrey
  },
  Icon : {
    justifyContent:'center',
    alignItems:'flex-end',
    height:98,
    width:10
  },
  emptyPage: {
    marginTop: 60,
    textAlign: 'center',
    color:colors.black
  },
});

const mapStateToProps = (state) => ({
  account : state.account.toJS(),
  auth: accountActions.auth(state.account),
  order: state.order.toJS(),
  board: state.board.toJS(),
  noti: state.noti.toJS(),
  pending: state.pender.pending[notiActions.GET_NOTI_LIST] || false
  // pending: state.pender.pending
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      order: bindActionCreators(orderActions, dispatch),
      board : bindActionCreators(boardActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
    }
  })
)(NotiScreen)