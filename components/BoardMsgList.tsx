import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {RkbBoard} from '@/redux/api/boardApi';
import utils from '@/redux/api/utils';
import {AccountModelState} from '@/redux/modules/account';
import {
  actions as boardActions,
  BoardAction,
  BoardModelState,
} from '@/redux/modules/board';
import i18n from '@/utils/i18n';
import {ValidationResult} from '@/utils/validationUtil';
import AppActivityIndicator from './AppActivityIndicator';
import AppButton from './AppButton';
import AppIcon from './AppIcon';
import AppModalForm from './AppModalForm';
import AppText from './AppText';
import AppTextInput from './AppTextInput';
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

type BoardMsgListProps = {
  board: BoardModelState;
  account: AccountModelState;
  pending: boolean;
  uid: number;
  onPress: (uuid: string, status: string) => void;

  action: {
    board: BoardAction;
  };
};

const BoardMsgList: React.FC<BoardMsgListProps> = ({
  board,
  action,
  account,
  uid,
  pending,
  onPress,
}) => {
  const [data, setData] = useState<RkbBoard[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState('');
  const [mobile, setMobile] = useState('');

  useEffect(() => {
    action.board.getIssueList();

    setMobile(utils.toPhoneNumber(account?.mobile));
  }, [account?.mobile, action.board, uid]);

  useEffect(() => {
    if (board?.list.length > 0) setData(board?.list);
  }, [board.list]);

  const onSubmit = useCallback(() => {
    if (mobile) {
      const number = mobile.replace(/-/g, '');

      setData(board.list.filter((item) => item.mobile.includes(number)));
    }
  }, [board.list, mobile]);

  // 응답 메시지 화면으로 이동한다.
  const onSubmitPin = useCallback(() => {
    setShowModal(false);

    if (selected) onPress(selected, status);
  }, [onPress, selected, status]);

  const onPressItem = useCallback(
    (uuid: string, st: string) => () => {
      if (uid === 0) {
        // anonymous인 경우에는 비밀 번호를 입력받아서 일치하면 보여준다.
        setShowModal(true);
        setSelected(uuid);
        setStatus(st);
      } else {
        // login 한 경우에는 곧바로 응답 결과를 보여준다.
        onPress(uuid, st);
      }
    },
    [onPress, uid],
  );

  // 입력된 PIN이 일치하는지 확인한다.
  const onValidate = useCallback(
    (value: string): ValidationResult => {
      const item = data.find((i) => i.uuid === selected);

      // PIN match
      if (item && item.pin === value) return undefined;
      return {pin: [i18n.t('board:pinMismatch')]};
    },
    [data, selected],
  );

  const onEndReached = useCallback(() => {
    action.board.getNextIssueList();
  }, [action.board]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const res = await action.board.getIssueList();
    if (res) setRefreshing(false);
  }, [action.board]);

  const header = useCallback(
    () => (
      <View>
        {uid === 0 && (
          <View>
            <AppText style={styles.label}>{i18n.t('board:contact')}</AppText>
            <View style={styles.inputBox}>
              <AppTextInput
                style={styles.inputMobile}
                placeholder={i18n.t('board:noMobile')}
                placeholderTextColor={colors.greyish}
                keyboardType="numeric"
                returnKeyType="done"
                maxLength={13}
                value={mobile}
                onSubmitEditing={onSubmit}
                onChangeText={setMobile}
              />

              <AppButton
                iconName="btnSearchOn"
                onPress={onSubmit}
                style={styles.button}
              />
            </View>

            <View style={styles.divider} />
          </View>
        )}

        <AppText style={styles.mylist}>
          {uid === 0 ? i18n.t('board:list') : i18n.t('board:mylist')}
        </AppText>
      </View>
    ),
    [mobile, onSubmit, uid],
  );

  const empty = useCallback(
    () => (
      <View style={{alignItems: 'center'}}>
        <AppIcon style={styles.mark} name="imgMark" />
        <AppText style={styles.noList}>
          {refreshing ? i18n.t('board:loading') : i18n.t('board:nolist')}
        </AppText>
      </View>
    ),
    [refreshing],
  );

  const renderItem = useCallback(
    ({item}: {item: RkbBoard}) => {
      return (
        <BoardMsg
          onPress={onPressItem(item.uuid, item.statusCode)}
          item={item}
          uid={uid}
        />
      );
    },
    [onPressItem, uid],
  );

  // const {mobile, data, showModal, refreshing} = this.state;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        // onEndReached={this._onEndReached}
        // onEndReachedThreshold={0.5}
        onScrollEndDrag={onEndReached} // 검색 시 onEndReached가 발생하는 버그가 Flatlist에 있어 끝까지 스크롤한 경우 list를 더 가져오도록 변경
        // onRefresh={this._onRefresh}
        // refreshing={refreshing}
        extraData={mobile}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.clearBlue]} // android 전용
            tintColor={colors.clearBlue} // ios 전용
          />
        }
      />

      <AppActivityIndicator visible={pending && !refreshing} />
      <AppModalForm
        visible={showModal}
        title={i18n.t('board:inputPass')}
        maxLength={4}
        valueType="pin"
        keyboardType="numeric"
        onOkClose={onSubmitPin}
        onCancelClose={() => setShowModal(false)}
        validate={onValidate}
      />
    </SafeAreaView>
  );
};

export default connect(
  ({board, account, status}: RootState) => ({
    board,
    account,
    uid: account.uid || 0,
    pending: status.pending[boardActions.fetchIssueList.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      board: bindActionCreators(boardActions, dispatch),
    },
  }),
)(BoardMsgList);
