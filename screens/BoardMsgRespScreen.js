import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import i18n from '../utils/i18n'
import _ from 'underscore'
import AppBackButton from '../components/AppBackButton';
import * as boardActions from '../redux/modules/board'
import * as accountActions from '../redux/modules/account'
import {bindActionCreators} from 'redux'
import { appStyles } from '../constants/Styles';
import { colors } from '../constants/Colors';
import AppActivityIndicator from '../components/AppActivityIndicator';
import AppIcon from '../components/AppIcon';
import utils from '../utils/utils';


class BoardMsgRespScreen extends Component {
  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({navigation, title:i18n.t('board:title')}),
  })

  constructor(props) {
    super(props)

    this.state = {
      idx: undefined,
      uuid: undefined,
    }
  } 

  componentDidMount() {
    const uuid = this.props.navigation.getParam('key')
    if ( uuid ) {
      const {list = []} = this.props.board
      const idx = list.findIndex(item => item.uuid == uuid)
      this.setState({
        idx,
        uuid
      })

      this.props.action.board.getIssueResp(uuid, this.props.auth)
    }
  }

  render() {
    const {idx} = this.state,
      {list = [], comment = []} = this.props.board,
      issue = ( idx >=0 ) ? list[idx] : {},
      resp = comment[0] || {}

    return (
      <View style={styles.container}>
        <View style={{flex:1}}>
          <Text style={styles.inputBox}>{issue.title}</Text>
          <Text style={[styles.inputBox, {height:208}]}>{utils.htmlToString(issue.msg)}</Text>
          {
            ! _.isEmpty(resp) && <View style={styles.resp}>
              <AppIcon name="btnReply" />
              <View style={{marginLeft:10}}>
                <Text style={{marginBottom:10}}>{i18n.t('board:resp')}</Text>
                <Text>{resp.title}</Text>
                <Text>{resp.body}</Text>
              </View>
            </View>
          }
        </View>

        <AppActivityIndicator visible={this.props.pending} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputBox: {
    ... appStyles.normal14Text,
    marginTop: 30,
    marginHorizontal: 20,
    height: 50,
    borderRadius: 3,
    backgroundColor: colors.whiteTwo,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.lightGrey,
    color: colors.greyish,
    padding: 15,
  },
  resp: {
    flexDirection: 'row',
    marginTop: 18,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.black,
    alignContent: 'flex-start'
  }
});

const mapStateToProps = (state) => ({
  board: state.board.toJS(),
  auth: accountActions.auth(state.account),
  pending: state.pender.pending[boardActions.GET_ISSUE_RESP] || false
})

export default connect(mapStateToProps,
  (dispatch) => ({
    action: {
      board : bindActionCreators(boardActions, dispatch)
    }
  })
)(BoardMsgRespScreen)