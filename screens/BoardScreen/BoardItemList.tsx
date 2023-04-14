import React, {memo, useCallback, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RkbBoard} from '@/redux/api/boardApi';
import {AccountModelState} from '@/redux/modules/account';
import {BoardModelState} from '@/redux/modules/board';
import i18n from '@/utils/i18n';
import {ValidationResult} from '@/utils/validationUtil';
import AppText from '@/components/AppText';
import AppIcon from '@/components/AppIcon';
import AppModalForm from '@/components/AppModalForm';
import BoardMsg from '@/components/BoardMsg';

const styles = StyleSheet.create({
  noList: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
    marginTop: 27,
  },
  mark: {
    marginTop: 80,
  },
  container: {
    flex: 1,
  },
});

type BoardItemListProps = {
  data: RkbBoard[];
  board?: BoardModelState;
  eventBoard?: BoardModelState;
  account: AccountModelState;
  uid: number;
  onPress: (uuid: string, status: string) => void;

  onScrollEndDrag: () => void;
  onRefresh: () => void;
};

const BoardItemList: React.FC<BoardItemListProps> = ({
  data,
  uid,
  onPress,
  onScrollEndDrag,
  onRefresh,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState('');
  const [mobile, setMobile] = useState('');

  /*
  useEffect(() => {
    setMobile(utils.toPhoneNumber(account?.mobile));
  }, [account?.mobile]);

  useEffect(() => {
    if (isEvent && (eventBoard?.list.length || 0) > 0)
      setData(eventBoard?.list || []);
    else if ((board?.list.length || 0) > 0) setData(board?.list || []);
  }, [board?.list, eventBoard?.list, eventBoard?.list.length, isEvent]);

  const onSubmit = useCallback(() => {
    if (mobile) {
      const number = mobile.replace(/-/g, '');

      if (isEvent)
        setData(
          eventBoard?.list.filter((item) => item.mobile.includes(number)) || [],
        );
      else
        setData(
          board?.list.filter((item) => item.mobile.includes(number)) || [],
        );
    }
  }, [board?.list, eventBoard?.list, isEvent, mobile]);

  // 응답 메시지 화면으로 이동한다.
  const onSubmitPin = useCallback(() => {
    setShowModal(false);

    if (selected) onPress(selected, status);
  }, [onPress, selected, status]);
  */

  const onPressItem = useCallback(
    (uuid: string, st: string) => () => {
      onPress(uuid, st);
    },
    [onPress],
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

  /*
  const onEndReached = useCallback(() => {
    if (isEvent) action.eventBoard.getNextIssueList();
    else action.board.getNextIssueList();
  }, [action.board, action.eventBoard, isEvent]);
  */

  const onRefreshCallback = useCallback(async () => {
    // setRefreshing(true);
    onRefresh();
    /*
    if (isEvent) {
      const res = await action.eventBoard.getIssueList();
      if (res) setRefreshing(false);
    } else {
      const res = await action.board.getIssueList();
      if (res) setRefreshing(false);
    }
    */
  }, [onRefresh]);

  /*
  const header = useCallback(() => {
    if (isEvent) return <View style={{height: 6}} />;

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
    );
  }, [isEvent, mobile, onSubmit, uid]);
  */

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
        // ListHeaderComponent={header}
        ListEmptyComponent={empty}
        // onEndReachedThreshold={0.5}
        onScrollEndDrag={onScrollEndDrag} // 검색 시 onEndReached가 발생하는 버그가 Flatlist에 있어 끝까지 스크롤한 경우 list를 더 가져오도록 변경
        // refreshing={refreshing}
        extraData={mobile}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshCallback}
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
        // onOkClose={onSubmitPin}
        onCancelClose={() => setShowModal(false)}
        validate={onValidate}
      />
    </SafeAreaView>
  );
};

export default memo(BoardItemList);
