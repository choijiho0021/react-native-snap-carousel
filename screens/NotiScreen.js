import React, {Component} from 'react';
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
import * as notiActions from '../redux/modules/noti'
import * as accountActions from '../redux/modules/account'
import AppBackButton from '../components/AppBackButton';
import moment from 'moment-with-locales-es6'

class NotiScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={navigation.getParam('title') || i18n.t('set:noti')} />
  })

  constructor(props) {
    super(props)

    this.state = {
      list : undefined
    }
  }

  componentDidMount() {
    const mode = this.props.navigation.getParam('mode')
    // navigation param으로 notiList를 받은 경우 처리 - 공지 사항
    // const list = ( mode == 'info') ? this.props.navigation.getParam('info') : this.props.noti.notiList
    // if ( list) {
    //   this.setState({list})
    // }
  }

  _onPress = (uuid, bodyTitle, body, notiType) => () => {
    if (uuid) {
      this.props.action.noti.notiReadAndGet(uuid, this.props.account.mobile, this.props.auth )

      switch (notiType) {
        case 'noti':
          this.props.navigation.navigate('SimpleText', {key:'noti', title:i18n.t('set:noti'), bodyTitle:bodyTitle, text:body})
        case 'reply':
          this.props.navigation.navigate('ContactBoard')
        default:
          this.props.navigation.navigate('SimpleText', {key:'noti', title:i18n.t('set:noti'), bodyTitle:bodyTitle, text:body})
      }
    }
  }

  _renderItem = ({item,index}) => {
      return (
        <TouchableOpacity onPress={this._onPress(item.uuid, item.title, item.body, item.notiType)}>
          <View key={item.uuid} style={[styles.notibox,{backgroundColor:item.isRead == "F" ? "#f7f8f9" : colors.white}]}>
            <View key='notitext' style={styles.notiText} >
              <Text key='created' style={styles.created}>{moment(item.created).format('LLL')}</Text>
              <View style={styles.title}>
                {index == 0 ? <Text key='titleHead' style={styles.titleHead}>●</Text> : null }
                <Text key='titleText' style={styles.titleText}>{item.title}</Text>
              </View>
              <Text key='body' style={styles.body} numberOfLines={3} ellipsizeMode={'tail'} >{utils.htmlToString(item.body)}
              </Text>
            </View>
            <View key='iconview' style={styles.Icon}>
              <AppIcon key='icon' name="iconArrowRight" size={10} />
            </View>
          </View>
        </TouchableOpacity>
      )
  }

  renderEmptyContainer () {
    return (<Text style={styles.emptyPage}>{i18n.t('noti:empty')}</Text>)
  }

  render() {
    const {notiList} = this.props.noti

    return (
      <View key={"container"} style={styles.container}>
        <FlatList 
          data={notiList} 
          renderItem={this._renderItem }
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
      height: 98,
      marginTop:7,
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
    height:98,
    flex:8,
  },
  body: {
    ... appStyles.normal14Text,
    height:48,
    lineHeight: 24,
    letterSpacing: 0.23,
    color: colors.warmGrey
  },
  Icon : {
    flex:2,
    justifyContent:'center',
    alignItems:'flex-end',
    height:98
  },
  emptyPage: {
    marginTop: 60,
    textAlign: 'center'
  },
});

const mapStateToProps = (state) => ({
  account : state.account.toJS(),
  auth: accountActions.auth(state.account),
  noti: state.noti.toJS()
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      account: bindActionCreators(accountActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
    }
  })
)(NotiScreen)