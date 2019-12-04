import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { bindActionCreators } from 'redux'

import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import _ from 'underscore'
import AppAlert from './AppAlert';
import moment from 'moment'
import { colors } from '../constants/Colors';
import * as boardActions from '../redux/modules/board'
import * as accountActions from '../redux/modules/account'
import AppActivityIndicator from './AppActivityIndicator';

class BoardMsg extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps) {
    return this.props.item.uuid != nextProps.item.uuid
  }

  render() {
    const {title, created, status, statusCode, uuid} = this.props.item
    const date = moment(created).format('YYYY-MM-DD hh:mm:ss a')

    return (
      <TouchableOpacity onPress={() => this.props.onPress(uuid)}>
        <View style={styles.list} key="info">
          <View style={{flex:1}}>
            <Text key="title" style={styles.title}>{title || ''}</Text>
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
    }

    this._renderItem = this._renderItem.bind(this)
    this._onEndReached = this._onEndReached.bind(this)
  } 

  componentDidMount() {
    this.props.action.board.getIssueList(this.props.auth)
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
  _renderItem({item}) {
    return (<BoardMsg onPress={() => this.props.onPress(item.uuid)} item={item} />)
  }

  _onEndReached() {
    console.log('on end reached')
    this.props.action.board.getNextIssueList()
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList data={this.props.board.list} 
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.5}
          renderItem={this._renderItem} />
        <AppActivityIndicator visible={this.props.pending}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
    color: colors.black
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
  auth: accountActions.auth(state.account),
  pending: state.pender.pending[boardActions.GET_ISSUE_LIST] || false
})

export default connect(mapStateToProps,
  (dispatch) => ({
    action: {
      board : bindActionCreators(boardActions, dispatch)
    }
  })
)(BoardMsgList)