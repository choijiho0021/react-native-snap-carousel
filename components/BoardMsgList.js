import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { bindActionCreators } from 'redux'

import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import _ from 'underscore'
import moment from 'moment'
import { colors } from '../constants/Colors';
import * as boardActions from '../redux/modules/board'
import * as accountActions from '../redux/modules/account'
import AppActivityIndicator from './AppActivityIndicator';
import utils from '../utils/utils';
import AppModal from './AppModal';
import AppButton from './AppButton';

class BoardMsg extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps) {
    return this.props.item.uuid != nextProps.item.uuid
  }

  render() {
    const {title, created, status, statusCode, uuid, mobile} = this.props.item,
      date = moment(created).format('YYYY-MM-DD hh:mm:ss a'),
      titleOrMobile = this.props.uid ? title : (mobile.substr(0,3) + "-****-" + mobile.substr(7))

    return (
      <TouchableOpacity onPress={() => statusCode == 'C' && this.props.onPress(uuid)}>
        <View style={styles.list} key="info">
          <View style={{flex:1}}>
            <Text key="title" style={styles.title}>{titleOrMobile || ''}</Text>
            <Text key="date" style={styles.date}>{date}</Text>
          </View>
          <Text key="status" style={[styles.status, statusCode == 'C' ? colors.clearBlue : colors.warmGrey]}>{status}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}


class BoardMsgList extends Component {
  static navigationOptions = {
    title: i18n.t('board:title')
  }

  constructor(props) {
    super(props)

    this.state = {
      data : [],
      mobile: undefined,
      showModal: false,
      selected: undefined
    }

    this._renderItem = this._renderItem.bind(this)
    this._onEndReached = this._onEndReached.bind(this)
    this._header = this._header.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
    this._onSubmitPin = this._onSubmitPin.bind(this)
    this._onPress = this._onPress.bind(this)
    this._onValidate = this._onValidate.bind(this)
  } 

  componentDidMount() {
    const { uid, auth} = this.props
    this.props.action.board.getIssueList( uid, auth)

    const { mobile} = this.props.account,
      number = utils.toPhoneNumber(mobile)

    this.setState({
      mobile: number,
    })
  }

  componentDidUpdate(prevProps) {
    if ( this.props.board.list != prevProps.board.list) {
      this.setState({
        data: this.props.board.list
      })
    }
  }


  /*
  _getIssueList() {
    const { link } = this.state
    const { auth } = this.props

    this.setState({
      querying: true
    })

    boardApi.getHistory( auth, link).then(resp => {
      const {data} = this.state
      if ( resp.result == 0) {

        const next = _.isEmpty(resp.links.next) ? undefined : resp.links.next.href
        const list = resp.objects.filter(item => data.findIndex(org => org.uuid == item.uuid) < 0)
 
        this.setState({
          querying: false,
          data : data.concat( list).sort((a,b) => a.created < b.created ? 1 : -1),
          next
        })

        if ( data.length + list.length < this.LIST_SIZE && next) {
          // get more history
          this._getIssueList( next)
        }
      }
      else {
        console.log('Failed to get message hisotyr', resp)
        throw new Error('Failed to get message history')
      }
    }).catch(err => {
      this.setState({
        querying: false,
      })

      AppAlert.error(err.message)
    })
  }

  _getNext() {
    const { next } = this.state
    if ( next) this._getIssueList(next)
  }
  */

    /*
    const {uuid, userName} = this.props.navigation.getParam('issue')
    this.setState({
      userName
    })
    this._getMsgList(uuid)
    */

    /*
  _getMsgList(uuid) {
    const { auth } = this.props.account

    this.setState({
      querying: true
    })

    boardApi.getComments( uuid, auth).then(resp => {
      if ( resp.result == 0) {
 
        this.setState({
          querying: false,
          data : resp.objects,
        })
      }
      else {
        console.log('Failed to get message hisotyr', resp)
        throw new Error('Failed to get message history')
      }
    }).catch(err => {
      this.setState({
        querying: false,
      })

      AppAlert.error(err.message)
    })
  }
  */

  _onSubmit() {
    const { mobile } = this.state,
      number = mobile.replace(/-/g, '')

    this.setState({
      data: this.props.board.list.filter(item => item.mobile.startsWith(number))
    })
  }

  _onChangeValue = (key) => (value) => {
    this.setState({
      [key] : value
    })
  }

  _onPress = (uuid) => () => {
    this.setState({
      showModal: true,
      selected: uuid
    })
  }

  // 응답 메시지 화면으로 이동한다.
  _onSubmitPin() {
    this.setState({
      showModal: false
    })

    this.props.onPress(this.state.selected)
  }

  // 입력된 PIN이 일치하는지 확인한다. 
  _onValidate(value) {
    const item = this.state.data.find(item => item.uuid == this.state.selected)
    console.log('validate', item, value, this.state.selected)
    // PIN match
    if ( item && item.pin == value) return undefined
    return i18n.t('board:pinMismatch')
  }


  _renderItem({item}) {
    return (<BoardMsg onPress={this._onPress(item.uuid)} item={item} uid={this.props.uid}/>)
  }

  _onEndReached() {
    console.log('on end reached')
    this.props.action.board.getNextIssueList()
  }

  _header() {
    const { mobile} = this.state

    return (
      <View>
        <Text style={styles.label}>{i18n.t('board:contact')}</Text>
        <View style={styles.inputBox}>
          <TextInput style={styles.inputMobile} 
            placeholder={i18n.t('board:noMobile')}
            keyboardType='numeric'
            returnKeyType='done'
            maxLength={13}
            value={utils.toPhoneNumber(mobile)}
            onSubmitEditing={this._onSubmit}
            onChangeText={this._onChangeValue('mobile')} /> 
          <AppButton iconName="btnSearchOn" 
            onPress={this._onSubmit}
            style={styles.button}/>
        </View>

        <View style={styles.divider}/>

        <Text style={styles.mylist}>{i18n.t('board:mylist')}</Text>

      </View>
    )
  }

  render() {
    const {mobile, data, showModal} = this.state

    return (
      <View style={styles.container}>
        <FlatList data={data} 
          ListHeaderComponent={this._header}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.5}
          extraData={mobile}
          renderItem={this._renderItem} />
        <AppActivityIndicator visible={this.props.pending}/>
        <AppModal visible={showModal}
          title={i18n.t('board:inputPass')}
          mode='edit'
          onOkClose={this._onSubmitPin}
          onCancelClose={() => this._onChangeValue('showModal')(false)}
          validate={this._onValidate}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mylist: {
    ... appStyles.bold18Text,
    marginTop: 30,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  divider: {
    marginTop: 40,
    height: 10,
    backgroundColor: colors.whiteTwo
  },
  button: {
    width: 40,
    height: 40
  },
  label: {
    ... appStyles.normal14Text,
    marginLeft: 20,
    marginTop: 20
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomColor: colors.warmGrey,
    borderBottomWidth: 1,
    marginTop: 10,
    marginHorizontal: 20
  },
  inputMobile : {
    ... appStyles.normal16Text,
    height: 40,
    color: colors.black,
    flex: 1
  },
  container: {
    flex: 1,
  },
  list: {
    height: 74,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor: colors.whiteTwo,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  title : {
    ... appStyles.normal16Text,
    color: colors.black,
    marginBottom: 12,
  },
  date : {
    ... appStyles.normal12Text,
    color: colors.warmGrey,
    textAlign: 'left'
  },
  status : {
    ... appStyles.normal14Text,
  },
});

const mapStateToProps = (state) => ({
  board: state.board.toJS(),
  account: state.account.toJS(),
  auth: accountActions.auth(state.account),
  uid: state.account.get('uid'),
  pending: state.pender.pending[boardActions.GET_ISSUE_LIST] || false
})

export default connect(mapStateToProps,
  (dispatch) => ({
    action: {
      board : bindActionCreators(boardActions, dispatch)
    }
  })
)(BoardMsgList)