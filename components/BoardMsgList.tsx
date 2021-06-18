import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import {bindActionCreators} from 'redux';

import _ from 'underscore';
import {appStyles} from '../constants/Styles';
import i18n from '../utils/i18n';
import {colors} from '../constants/Colors';
import * as boardActions from '../redux/modules/board';
import * as accountActions from '../redux/modules/account';
import AppActivityIndicator from './AppActivityIndicator';
import utils from '../utils/utils';
import AppModal from './AppModal';
import AppButton from './AppButton';
import AppIcon from './AppIcon';
import BoardMsg from './BoardMsg';

const styles = StyleSheet.create({
  noList: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
    marginTop: 27,
  },
  mark: {
    marginTop: 80,
  },
  mylist: {
    ...appStyles.bold18Text,
    marginTop: 30,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  divider: {
    marginTop: 40,
    height: 10,
    backgroundColor: colors.whiteTwo,
  },
  button: {
    width: 40,
    height: 40,
  },
  label: {
    ...appStyles.normal14Text,
    marginLeft: 20,
    marginTop: 20,
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomColor: colors.warmGrey,
    borderBottomWidth: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },
  inputMobile: {
    ...appStyles.normal16Text,
    height: 40,
    color: colors.black,
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

class BoardMsgList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      mobile: undefined,
      showModal: false,
      selected: undefined,
      refreshing: false,
    };

    this.renderItem = this.renderItem.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.header = this.header.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitPin = this.onSubmitPin.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onValidate = this.onValidate.bind(this);
    this.init = this.init.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.empty = this.empty.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (this.props.board.list !== prevProps.board.list) {
      this.setState({
        data: this.props.board.list,
      });
    }

    if (this.props.uid !== prevProps.uid) {
      this.init();
    }

    if (!this.props.pending && this.props.pending !== prevProps.pending) {
      this.setState({
        refreshing: false,
      });
    }
  }

  onSubmit() {
    const {mobile} = this.state;
    const number = mobile.replace(/-/g, '');

    this.setState({
      data: this.props.board.list.filter((item) =>
        item.mobile.includes(number),
      ),
    });
  }

  // 응답 메시지 화면으로 이동한다.
  onSubmitPin() {
    this.setState({
      showModal: false,
    });

    this.props.onPress(this.state.selected, this.state.status);
  }

  onChangeValue = (key) => (value) => {
    this.setState({
      [key]: value,
    });
  };

  onPress = (uuid, status) => () => {
    if (this.props.uid === 0) {
      // anonymous인 경우에는 비밀 번호를 입력받아서 일치하면 보여준다.
      this.setState({
        showModal: true,
        selected: uuid,
        status,
      });
    } else {
      // login 한 경우에는 곧바로 응답 결과를 보여준다.
      this.props.onPress(uuid, status);
    }
  };

  // 입력된 PIN이 일치하는지 확인한다.
  onValidate(value) {
    const item = this.state.data.find((i) => i.uuid === this.state.selected);

    // PIN match
    if (item && item.pin === value) return undefined;
    return i18n.t('board:pinMismatch');
  }

  onEndReached() {
    this.props.action.board.getNextIssueList();
  }

  onRefresh() {
    this.setState({
      refreshing: true,
    });
    this.props.action.board.getIssueList();
  }

  init() {
    this.props.action.board.getIssueList();

    const {mobile} = this.props.account;
    const number = utils.toPhoneNumber(mobile);
    this.setState({
      mobile: number,
    });
  }

  header() {
    const {mobile} = this.state;

    return (
      <View>
        {this.props.uid === 0 && (
          <View>
            <Text style={styles.label}>{i18n.t('board:contact')}</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputMobile}
                placeholder={i18n.t('board:noMobile')}
                placeholderTextColor={colors.greyish}
                keyboardType="numeric"
                returnKeyType="done"
                maxLength={13}
                value={mobile}
                onSubmitEditing={this.onSubmit}
                onChangeText={this.onChangeValue('mobile')}
              />

              <AppButton
                iconName="btnSearchOn"
                onPress={this.onSubmit}
                style={styles.button}
              />
            </View>

            <View style={styles.divider} />
          </View>
        )}

        <Text style={styles.mylist}>
          {this.props.uid === 0 ? i18n.t('board:list') : i18n.t('board:mylist')}
        </Text>
      </View>
    );
  }

  empty() {
    return (
      <View style={{alignItems: 'center'}}>
        <AppIcon style={styles.mark} name="imgMark" />
        <Text style={styles.noList}>
          {this.state.refreshing
            ? i18n.t('board:loading')
            : i18n.t('board:nolist')}
        </Text>
      </View>
    );
  }

  renderItem({item}) {
    return (
      <BoardMsg
        onPress={this.onPress(item.uuid, item.statusCode)}
        item={item}
        uid={this.props.uid}
      />
    );
  }

  render() {
    const {mobile, data, showModal, refreshing} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          ListHeaderComponent={this.header}
          ListEmptyComponent={this.empty}
          // onEndReached={this._onEndReached}
          // onEndReachedThreshold={0.5}
          onScrollEndDrag={this.onEndReached} // 검색 시 onEndReached가 발생하는 버그가 Flatlist에 있어 끝까지 스크롤한 경우 list를 더 가져오도록 변경
          // onRefresh={this._onRefresh}
          // refreshing={refreshing}
          extraData={mobile}
          renderItem={this.renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              colors={[colors.clearBlue]} // android 전용
              tintColor={colors.clearBlue} // ios 전용
            />
          }
        />

        <AppActivityIndicator visible={this.props.pending && !refreshing} />
        <AppModal
          visible={showModal}
          title={i18n.t('board:inputPass')}
          mode="edit"
          maxLength={4}
          keyboardType="numeric"
          onOkClose={this.onSubmitPin}
          onCancelClose={() => this.onChangeValue('showModal')(false)}
          validate={this.onValidate}
        />
      </SafeAreaView>
    );
  }
}

export default connect(
  (state) => ({
    board: state.board.toJS(),
    account: state.account.toJS(),
    auth: accountActions.auth(state.account),
    uid: state.account.get('uid') || 0,
    pending: state.pender.pending[boardActions.FETCH_ISSUE_LIST] || false,
  }),
  (dispatch) => ({
    action: {
      board: bindActionCreators(boardActions, dispatch),
    },
  }),
)(BoardMsgList);
