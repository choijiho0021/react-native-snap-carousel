import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';

import _ from 'underscore';
import {bindActionCreators} from 'redux';
import {API} from '../submodules/rokebi-utils';
import i18n from '../utils/i18n';
import AppBackButton from '../components/AppBackButton';
import * as boardActions from '../redux/modules/board';
import * as accountActions from '../redux/modules/account';
import {appStyles} from '../constants/Styles';
import {colors} from '../constants/Colors';
import AppActivityIndicator from '../components/AppActivityIndicator';
import AppIcon from '../components/AppIcon';
import utils from '@/submodules/rokebi-utils/utils';
import {attachmentSize, windowWidth} from '../constants/SliderEntry.style';
import AppButton from '../components/AppButton';
import {RootState} from '@/redux';

const styles = StyleSheet.create({
  attachBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: windowWidth - 20,
    marginTop: 10,
    marginHorizontal: 20,
  },
  attach: {
    // flex: 1,
    marginRight: 20,
    width: attachmentSize,
    height: attachmentSize,
  },
  reply: {
    ...appStyles.normal14Text,
    color: colors.black,
  },
  replyTitle: {
    ...appStyles.normal12Text,
    textAlign: 'left',
    marginBottom: 10,
    color: colors.warmGrey,
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  inputBox: {
    ...appStyles.normal14Text,
    marginHorizontal: 20,
    borderRadius: 3,
    backgroundColor: colors.whiteTwo,
    borderStyle: 'solid',
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
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.black,
    justifyContent: 'flex-start',
  },
  button: {
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: '#ffffff',
  },
});
class BoardMsgRespScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      idx: undefined,
      uuid: undefined,
    };
  }

  componentDidMount() {
    const {params} = this.props.route;

    const uuid = params && params.key;
    const status = params && params.status;

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton
          navigation={this.props.navigation}
          title={i18n.t('board:title')}
        />
      ),
    });

    if (uuid) {
      // issue list를 아직 가져오지 않은 경우에는, 먼저 가져와서 처리한다.
      this.props.action.board.getIssueList(false).then(() => {
        this.setState({
          idx: this.props.board.list.findIndex((item) => item.uuid === uuid),
          uuid,
          status,
        });

        if (status === 'Closed') {
          this.props.action.board.getIssueResp(uuid, this.props.auth);
        } else {
          this.props.action.board.resetIssueComment();
        }
      });
    }
  }

  renderAttachment(images) {
    return (
      <View style={styles.attachBox}>
        {images &&
          images
            .filter((item) => !_.isEmpty(item))
            .map((url, idx) => (
              <Image
                key={url + idx}
                source={{uri: API.default.httpImageUrl(url).toString()}}
                style={styles.attach}
              />
            ))}
      </View>
    );
  }

  render() {
    const {idx} = this.state,
      {list = [], comment = []} = this.props.board,
      issue = idx >= 0 ? list[idx] : {},
      resp = comment[0] || {};

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <View style={{flex: 1}}>
            <Text style={[styles.inputBox, {marginTop: 30}]}>
              {issue.title}
            </Text>
            <Text style={[styles.inputBox, {marginTop: 15, paddingBottom: 72}]}>
              {utils.htmlToString(issue.msg)}
            </Text>
            {this.renderAttachment(issue.images)}
            {!_.isEmpty(resp) && (
              <View style={styles.resp}>
                <AppIcon
                  name="btnReply"
                  style={{justifyContent: 'flex-start'}}
                />
                <View style={{marginLeft: 10, marginRight: 30}}>
                  <Text style={styles.replyTitle}>{i18n.t('board:resp')}</Text>
                  <Text style={styles.reply}>{resp.body}</Text>
                </View>
              </View>
            )}
          </View>

          <AppActivityIndicator visible={this.props.pending} />
        </ScrollView>

        <AppButton
          style={styles.button}
          title={i18n.t('ok')}
          onPress={() => this.props.navigation.goBack()}
        />
      </SafeAreaView>
    );
  }
}

export default connect(
  ({board, account, pender}: RootState) => ({
    board,
    auth: accountActions.auth(account),
    pending: pender.pending[boardActions.GET_ISSUE_RESP] || false,
  }),
  (dispatch) => ({
    action: {
      board: bindActionCreators(boardActions, dispatch),
    },
  }),
)(BoardMsgRespScreen);
