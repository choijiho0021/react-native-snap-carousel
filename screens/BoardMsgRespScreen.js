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
import AppButton from '../components/AppButton';
import { windowWidth } from '../constants/SliderEntry.style';

class BoardMsgRespScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('board:title')} />
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
    const status = this.props.navigation.getParam('status')

    if ( uuid ) {
      const {list = []} = this.props.board
      const idx = list.findIndex(item => item.uuid == uuid)
      this.setState({
        idx,
        uuid,
        status
      })
      if(status == 'Closed'){
        this.props.action.board.getIssueResp(uuid, this.props.auth)
      }
      else {
        this.props.action.board.resetIssueComment()
      }
    }
  }

  _renderAttachment(images) {
    return (
      <View style={styles.attachBox}>
        {
          images && images.filter(item => ! _.isEmpty(item))
            .map((url, idx) => <Image key={url+idx} source={{uri: api.httpImageUrl(url).toString()}} style={styles.attach}/>)
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
              this._renderAttachment(issue.images)
            }
            {
              ! _.isEmpty(resp) && <View style={styles.resp}>
                <AppIcon name="btnReply" style={{justifyContent:'flex-start'}}/>
                <View style={{marginLeft:10, marginRight:30}}>
                  <Text style={styles.replyTitle}>{i18n.t('board:resp')}</Text>
                  <Text style={styles.reply}>{resp.body}</Text>
                </View>
              </View>
            }
          </View>

          <AppActivityIndicator visible={this.props.pending} />
        </ScrollView>

        <AppButton style={styles.button} title={i18n.t('ok')} 
          onPress={() => this.props.navigation.goBack()}/>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  attachBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: windowWidth - 20,
    marginTop: 10,
    marginHorizontal: 20
  },
  attach: {
    // flex: 1,
    marginRight: 20,
    width: attachmentSize,
    height: attachmentSize,
  },
  reply: {
    ... appStyles.normal14Text,
    color: colors.black
  },
  replyTitle: {
    ... appStyles.normal12Text,
    textAlign: "left",
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
    marginBottom: 36,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.black,
    justifyContent: 'flex-start'
  },
  button: {
    ... appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: "center",
    color: "#ffffff"
  },
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