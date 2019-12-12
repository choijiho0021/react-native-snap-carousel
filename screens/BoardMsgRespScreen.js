import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image
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
import api from '../utils/api/api';
import { attachmentSize } from '../constants/SliderEntry.style'

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

  _renderAttachment(images) {
    return (
      <View style={styles.attachBox}>
      {
        images && images.map(uri => <Image key={uri} source={{uri}} style={styles.attach}/> )
      }
      </View>
    )
  }

  render() {
    const {idx} = this.state,
      {list = [], comment = []} = this.props.board,
      issue = ( idx >=0 ) ? list[idx] : {},
      resp = comment[0] || {}

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <View style={{flex:1}}>
            <Text style={[styles.inputBox, {marginTop:30}]}>{issue.title}</Text>
            <Text style={[styles.inputBox, {marginTop:15, paddingBottom:72}]}>{utils.htmlToString(issue.msg)}</Text>
            {
              issue.images && this._renderAttachment(issue.images)
            }
            {
              ! _.isEmpty(resp) && <View style={styles.resp}>
                <AppIcon name="btnReply" style={{justifyContent:'flex-start'}}/>
                <View style={{marginLeft:10}}>
                  <Text style={styles.replyTitle}>{i18n.t('board:resp')}</Text>
                  <Text style={styles.reply}>{resp.title + "\n"}</Text>
                  <Text style={styles.reply}>{resp.body}</Text>
                </View>
              </View>
            }
          </View>

          <AppActivityIndicator visible={this.props.pending} />
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  attachBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginHorizontal: 20
  },
  attach: {
    width: attachmentSize,
    height: attachmentSize,
  },
  reply: {
    ... appStyles.normal14Text,
    color: colors.black
  },
  replyTitle: {
    ... appStyles.normal12Text,
    marginBottom: 10,
    color: colors.warmGrey,
  },
  container: {
    flex: 1
  },
  inputBox: {
    ... appStyles.normal14Text,
    marginHorizontal: 20,
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
    justifyContent: 'flex-start'
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