import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { bindActionCreators } from 'redux'

import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import _ from 'underscore'
import { colors } from '../constants/Colors';
import * as boardActions from '../redux/modules/board'
import * as accountActions from '../redux/modules/account'
import AppActivityIndicator from './AppActivityIndicator';
import utils from '../utils/utils';
import AppModal from './AppModal';
import AppButton from './AppButton';
import AppIcon from './AppIcon';


class BoardMsg extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps) {
    return this.props.item.uuid != nextProps.item.uuid || this.props.item.statusCode != nextProps.item.statusCode
  }

  render() {
    const {title, created, status, statusCode, uuid, mobile} = this.props.item,
      date = utils.toDateString(created),
      titleOrMobile = this.props.uid ? title : (mobile.substr(0,3) + "-****-" + mobile.substr(7))

    return (
      <TouchableOpacity onPress={() => statusCode == 'C' && this.props.onPress(uuid)}>
        <View style={styles.list} key="info">
          <View style={{flex:1}}>
            <Text key="title" style={styles.title}>{titleOrMobile || ''}</Text>
            <Text key="date" style={styles.date}>{date}</Text>
          </View>
          <Text key="status" style={[styles.status, {color: statusCode == 'C' ? colors.clearBlue : colors.warmGrey}]}>{status}</Text>
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
      selected: undefined,
      refreshing: false
    }

    this._renderItem = this._renderItem.bind(this)
    this._onEndReached = this._onEndReached.bind(this)
    this._header = this._header.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
    this._onSubmitPin = this._onSubmitPin.bind(this)
    this._onPress = this._onPress.bind(this)
    this._onValidate = this._onValidate.bind(this)
    this._init = this._init.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
  } 

  componentDidMount() {
    this._init()
  }

  componentDidUpdate(prevProps) {
    if ( this.props.board.list != prevProps.board.list) {
      this.setState({
        data: this.props.board.list
      })
    }

    if ( this.props.uid != prevProps.uid) {
      this._init()
    }

    if ( ! this.props.pending && this.props.pending != prevProps.pending) {
      this.setState({
        refreshing: false
      })
    }
  }

  _init() {
    this.props.action.board.getIssueList()

    const { mobile} = this.props.account,
      number = utils.toPhoneNumber(mobile)
    this.setState({
      mobile: number,
    })
  }

  _onSubmit() {
    const { mobile } = this.state,
      number = mobile.replace(/-/g, '')

    this.setState({
      data: this.props.board.list.filter(item => item.mobile.includes(number))
    })
  }

  _onChangeValue = (key) => (value) => {
    this.setState({
      [key] : value
    })
  }

  _onPress = (uuid) => () => {
    if ( this.props.uid == 0) {
      // anonymous인 경우에는 비밀 번호를 입력받아서 일치하면 보여준다.
      this.setState({
        showModal: true,
        selected: uuid
      })
    }
    else {
      // login 한 경우에는 곧바로 응답 결과를 보여준다.
      this.props.onPress(uuid)
    }
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

    // PIN match
    if ( item && item.pin == value) return undefined
    return i18n.t('board:pinMismatch')
  }


  _renderItem({item}) {
    return (<BoardMsg onPress={this._onPress(item.uuid)} item={item} uid={this.props.uid}/>)
  }

  _onEndReached() {
    this.props.action.board.getNextIssueList()
  }

  _onRefresh() {
    this.setState({
      refreshing: true
    })
    this.props.action.board.getIssueList()
  }

  _header() {
    const { mobile} = this.state

    return (
      <View>
        {
          this.props.uid == 0 && <View>
            <Text style={styles.label}>{i18n.t('board:contact')}</Text>
            <View style={styles.inputBox}>

              <TextInput style={styles.inputMobile} 
                placeholder={i18n.t('board:noMobile')}
                placeholderTextColor={colors.greyish}
                keyboardType='numeric'
                returnKeyType='done'
                maxLength={13}
                value={mobile}
                onSubmitEditing={this._onSubmit}
                onChangeText={this._onChangeValue('mobile')} /> 

              <AppButton iconName="btnSearchOn" 
                onPress={this._onSubmit}
                style={styles.button}/>
            </View>

          <View style={styles.divider}/>
          </View>
        }

        <Text style={styles.mylist}>{i18n.t('board:mylist')}</Text>

      </View>
    )
  }

  _empty() {
    return (
      <View style={{alignItems:'center'}}>
        <AppIcon style={styles.mark} name="imgMark"/>
        <Text style={styles.noList}>{i18n.t('board:nolist')}</Text>
      </View>
    )
  }

  render() {
    const {mobile, data, showModal, refreshing} = this.state

    return (
      <SafeAreaView style={styles.container}>
        <FlatList data={data} 
          ListHeaderComponent={this._header}
          ListEmptyComponent={this._empty}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.5}
          onRefresh={this._onRefresh}
          refreshing={refreshing}
          extraData={mobile}
          renderItem={this._renderItem} />

        <AppActivityIndicator visible={this.props.pending && ! refreshing}/>
        <AppModal visible={showModal}
          title={i18n.t('board:inputPass')}
          mode='edit'
          onOkClose={this._onSubmitPin}
          onCancelClose={() => this._onChangeValue('showModal')(false)}
          validate={this._onValidate}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  noList: {
    ... appStyles.normal14Text,
    color: colors.warmGrey,
    marginTop: 27,
  },
  mark: {
    marginTop: 80
  },
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
  uid: state.account.get('uid') || 0,
  pending: state.pender.pending[boardActions.FETCH_ISSUE_LIST] || false
})

export default connect(mapStateToProps,
  (dispatch) => ({
    action: {
      board : bindActionCreators(boardActions, dispatch)
    }
  })
)(BoardMsgList)