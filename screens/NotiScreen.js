import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import {bindActionCreators} from 'redux'
import Analytics from 'appcenter-analytics'
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

const MODE_NOTIFICATION = 'info'

class NotiListItem extends Component {

  shouldComponentUpdate(nextProps, nextState){
    const {isRead} = nextProps.item

    return this.props.item.isRead != isRead
  }

  render() {
    const {item, onPress} = this.props
    // summary가 있으면, 우선적으로 표시한다.
    return (
      <TouchableOpacity onPress={() => onPress(item)}>
        <View key={item.uuid} style={[styles.notibox, {backgroundColor:item.isRead == "F" ? colors.whiteTwo : colors.white}]}>
          <View key='notitext' style={styles.notiText} >
            <Text key='created' style={styles.created}>{utils.toDateString(item.created)}</Text>
            <View style={styles.title}>
              <Text key='titleText' style={styles.titleText}>{item.title}</Text>
            </View>
            <Text key='body' style={styles.body} numberOfLines={3} ellipsizeMode={'tail'} >{utils.htmlToString(item.summary || item.body)}
            </Text>
          </View>
          <View key='iconview' style={styles.Icon}>
            <AppIcon key='icon' name="iconArrowRight" size={10} />
          </View> 
        </View>
      </TouchableOpacity>
    )
  }
}

class NotiScreen extends Component {

  constructor(props) {
    super(props)

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (<AppBackButton navigation={this.props.navigation} title={(this.props.route.params && this.props.route.params.title) || i18n.t('set:noti')} />)
    })

    this.state = {
      list : undefined,
      refreshing : false,
      mode : 'noti'
    }

    this._onRefresh = this._onRefresh.bind(this)
  }

  componentDidMount(){
    const {params} = this.props.route
    const mode = params && params.mode ? params.mode : 'noti'
    const info = params && params.info

    Analytics.trackEvent('Page_View_Count', {page : 'Noti'})

    // this.props.action.board.getIssueList()
    this.setState({mode, info})
  }

  componentDidUpdate(prevProps){
    if ( ! this.props.pending && this.props.pending != prevProps.pending) {
      const { notiList } = this.props.noti
      const notiCount = notiList.filter(item => item.isRead == 'F').length
      
      this.setState({
        refreshing: false
      })
    }
  }

  // 공지사항의 경우 notiType이 없으므로 Notice/0으로 기본값 설정
  _onPress = ({uuid, isRead, bodyTitle, body, notiType = 'Notice/0', format = 'text'}) => {
    const { auth } = this.props

    const {mode} = this.state
    const split = notiType.split('/') 
    const type = split[0]
    const id = split[1]

    Analytics.trackEvent('Page_View_Count', {page : 'Noti Detail'})

    if (uuid) {
      // if ( mode != MODE_NOTIFICATION) this.props.action.noti.notiReadAndGet(uuid, this.props.account.mobile, this.props.auth )
      if ( mode != MODE_NOTIFICATION && isRead == 'F') this.props.action.noti.readNoti(uuid, this.props.auth )

      switch (type) {
        case notiActions.NOTI_TYPE_REPLY :
          this.props.navigation.navigate('BoardMsgResp', {key:id,status:'Closed'})
          break;
        case notiActions.NOTI_TYPE_PYM:
          // read orders if not read before
          this.props.action.order.checkAndGetOrderById(auth, id).then(_ => {
            this.props.navigation.navigate('PurchaseDetail', {detail: this.props.order.orders[ this.props.order.ordersIdx.get(Number(id)) ], auth})
          })
          break;
        case notiActions.NOTI_TYPE_USIM:
          this.props.navigation.navigate('Usim')
          break;
        default:
          //아직 일반 Noti 알림은 없으므로 공지사항 용으로만 사용, 후에 일반 Noti 상세페이지(notitype = noti)가 사용될 수 있도록 함 
          this.props.navigation.navigate('SimpleText', {
            key:'noti', 
            title:type == notiActions.NOTI_TYPE_NOTI ? i18n.t('set:noti') : i18n.t('contact:noticeDetail'), 
            bodyTitle:bodyTitle, 
            text:body, 
            mode:format
          })
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
          // refreshing={refreshing}
          // onRefresh={this._onRefresh}
          ListEmptyComponent={this.renderEmptyContainer()}
          tintColor={colors.clearBlue}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this._onRefresh}
              colors={[colors.clearBlue]} //android 전용
              tintColor={colors.clearBlue} //ios 전용
            />
          }
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
      paddingTop:10,
      paddingBottom:14,
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
  order: state.order.toObject(),
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