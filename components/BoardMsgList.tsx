import React, {memo, useCallback, useEffect, useState} from 'react';
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

const InputMobile0 = ({
  uid,
  onSubmit,
}: {
  uid: number;
  onSubmit: (v: string) => void;
}) => {
  const [value, setValue] = useState('');
  return (
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
              value={value}
              onSubmitEditing={() => onSubmit(value)}
              onChangeText={setValue}
            />

            <AppButton
              iconName="btnSearchOn"
              onPress={() => onSubmit(value)}
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
  );
};
const InputMobile = memo(InputMobile0);

type BoardMsgListProps = {
  board?: BoardModelState;
  account: AccountModelState;
  uid: number;
  onPress: (uuid: string, status: string) => void;
  pending: boolean;

  action: {
    board: BoardAction;
  };
};

const BoardMsgList: React.FC<BoardMsgListProps> = ({
  board,
  action,
  account,
  pending,
  uid,
  onPress,
}) => {
  const [data, setData] = useState<RkbBoard[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState('');
  const [mobile, setMobile] = useState('');

  useEffect(() => {
    setMobile(utils.toPhoneNumber(account?.mobile));
  }, [account?.mobile]);

  useEffect(() => {
    if ((board?.list.length || 0) > 0) setData(board?.list || []);
  }, [board?.list]);

  const onSubmit = useCallback(
    (value: string) => {
      if (value) {
        const number = value.replace(/-/g, '');

        setData(
          board?.list.filter((item) => item.mobile.includes(number)) || [],
        );
        setMobile(number);
      }
    },
    [board?.list],
  );

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

  const onRefresh = useCallback(() => {
    action.board.getIssueList();
  }, [action.board]);

  const empty = useCallback(
    () => (
      <View style={{alignItems: 'center'}}>
        <AppIcon style={styles.mark} name="imgMark" />
        <AppText style={styles.noList}>
          {pending ? i18n.t('board:loading') : i18n.t('board:nolist')}
        </AppText>
      </View>
    ),
    [pending],
  );

  const renderItem = useCallback(
    ({item}: {item: RkbBoard}) => (
      <BoardMsg
        onPress={onPressItem(item.uuid, item.statusCode)}
        item={item}
        uid={uid}
      />
    ),
    [onPressItem, uid],
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        ListHeaderComponent={<InputMobile uid={uid} onSubmit={onSubmit} />}
        ListEmptyComponent={empty}
        onScrollEndDrag={onEndReached} // 검색 시 onEndReached가 발생하는 버그가 Flatlist에 있어 끝까지 스크롤한 경우 list를 더 가져오도록 변경
        extraData={mobile}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={pending}
            onRefresh={onRefresh}
            colors={[colors.clearBlue]} // android 전용
            tintColor={colors.clearBlue} // ios 전용
          />
        }
      />

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
  ({account, status}: RootState) => ({
    account,
    uid: account.uid || 0,
    pending: status.pending[boardActions.getIssueList.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      board: bindActionCreators(boardActions, dispatch),
    },
  }),
)(BoardMsgList);
