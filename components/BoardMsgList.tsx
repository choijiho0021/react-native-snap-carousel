import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {BoardMsgStatus, RkbBoard} from '@/redux/api/boardApi';
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
import {HomeStackParamList} from '@/navigation/navigation';

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
    marginTop: 30,
  },
  button: {
    width: 20,
    height: 40,
    marginLeft: 4,
    marginRight: 8,
  },
  label: {
    ...appStyles.semiBold14Text,
    lineHeight: 20,
    marginLeft: 20,
    marginTop: 16,
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomColor: colors.warmGrey,
    borderBottomWidth: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },

  cancelBtnView: {
    backgroundColor: colors.gray4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    height: 40,
  },

  okBtnView: {
    marginLeft: 12,
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: colors.clearBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
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
  const [mobile, setMobile] = useState('');
  return (
    <View>
      {uid === 0 && (
        <View>
          <AppText style={styles.label}>
            {i18n.t('board:notLoggin:search')}
          </AppText>
          <View style={styles.inputBox}>
            <AppButton
              iconName="btnSearchOn"
              onPress={() => onSubmit(value)}
              style={styles.button}
            />
            <AppTextInput
              style={styles.inputMobile}
              placeholder={i18n.t('board:noMobile')}
              placeholderTextColor={colors.greyish}
              keyboardType="numeric"
              returnKeyType="done"
              maxLength={Platform.OS === 'android' ? 13 : 11}
              value={value}
              onSubmitEditing={() => onSubmit(mobile)}
              onFocus={() => setValue(value.replace(/-/g, ''))}
              onBlur={() => setValue(utils.toPhoneNumber(mobile))}
              onChangeText={(v) => {
                const mobileNo = utils.toPhoneNumber(v);
                setMobile(mobileNo);
                setValue(v);
              }}
            />
          </View>
        </View>
      )}

      <View style={{marginTop: uid === 0 ? 24 : 6}} />
    </View>
  );
};
const InputMobile = memo(InputMobile0);

type BoardMsgListNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'BoardMsgList'
>;

type BoardMsgListProps = {
  board: BoardModelState;
  account: AccountModelState;
  uid: number;
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
}) => {
  const navigation = useNavigation<BoardMsgListNavigationProp>();
  const [data, setData] = useState<RkbBoard[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<RkbBoard>();
  const [mobile, setMobile] = useState('');

  useEffect(() => {
    setMobile(utils.toPhoneNumber(account?.mobile));
  }, [account?.mobile]);

  useEffect(() => {
    const number = mobile.replace(/-/g, '');

    // 익명이 아닌 경우에만 번호로 자동 새로고침
    if (number && uid !== 0) {
      action.board.searchIssueList(number);
    }
  }, [action.board, mobile, uid]);

  useEffect(() => {
    const number = mobile.replace(/-/g, '');
    setData(board.list.filter((item) => item.mobile.includes(number)) || []);
  }, [board.list, mobile]);

  const onPress = useCallback(
    (item: RkbBoard, st: string) => {
      if (st === 'Open' || st === 'Closed' || st === 'Processing') {
        navigation.navigate('BoardMsgResp', {
          item,
          status: st as BoardMsgStatus,
          type: 'board',
        });
      } else {
        navigation.navigate('BoardMsgResp', {
          item,
          status: 'Open',
          type: 'board',
        });
      }
    },
    [navigation],
  );

  const onSubmit = useCallback(
    (value: string) => {
      const number = value.replace(/-/g, '');
      setMobile(number);

      if (number) action.board.searchIssueList(number);
      else if (number?.length === 0) action.board.getIssueList();
    },
    [action.board],
  );

  // 응답 메시지 화면으로 이동한다.
  const onSubmitPin = useCallback(() => {
    setShowModal(false);

    if (selected) onPress(selected, status);
  }, [onPress, selected, status]);

  const onPressItem = useCallback(
    (item: RkbBoard, st: string) => () => {
      if (uid === 0) {
        // anonymous인 경우에는 비밀 번호를 입력받아서 일치하면 보여준다.
        setShowModal(true);
        setSelected(item);
        setStatus(st);
      } else {
        // login 한 경우에는 곧바로 응답 결과를 보여준다.
        onPress(item, st);
      }
    },
    [onPress, uid],
  );

  // 입력된 PIN이 일치하는지 확인한다.
  const onValidate = useCallback(
    (value: string): ValidationResult => {
      const item = data.find((i) => selected && i.uuid === selected.uuid);

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
    onSubmit(mobile.replace(/-/g, ''));
  }, [mobile, onSubmit]);

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
        onPress={onPressItem(item, item.statusCode)}
        item={item}
        uid={uid}
      />
    ),
    [onPressItem, uid],
  );

  return (
    <SafeAreaView style={styles.container}>
      <InputMobile uid={uid} onSubmit={onSubmit} />
      <FlatList
        data={data}
        ListEmptyComponent={empty}
        // onScrollEndDrag={onEndReached} // 검색 시 onEndReached가 발생하는 버그가 Flatlist에 있어 끝까지 스크롤한 경우 list를 더 가져오도록 변경
        extraData={mobile}
        renderItem={renderItem}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          onEndReached();
        }}
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
        secure
        titleViewStyle={{marginHorizontal: 30, marginTop: 14}}
        titleStyle={[appStyles.bold16Text, {lineHeight: 24}]}
        // valueType="pin"
        keyboardType="numeric"
        onOkClose={onSubmitPin}
        onCancelClose={() => setShowModal(false)}
        validate={onValidate}
        cancelButtonViewStyle={styles.cancelBtnView}
        okButtonViewStyle={styles.okBtnView}
        okButtonStyle={{
          ...appStyles.semiBold16Text,
          lineHeight: 24,
          color: colors.white,
        }}
        buttonBackgroundColor={colors.clearBlue}
      />
    </SafeAreaView>
  );
};

export default connect(
  ({account, board, status}: RootState) => ({
    account,
    board,
    uid: account.uid || 0,
    pending: status.pending[boardActions.getIssueList.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      board: bindActionCreators(boardActions, dispatch),
    },
  }),
)(BoardMsgList);
