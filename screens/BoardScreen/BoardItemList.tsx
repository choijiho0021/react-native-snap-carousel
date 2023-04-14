import React, {memo, useCallback} from 'react';
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
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import AppIcon from '@/components/AppIcon';
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
  uid: number;
  refreshing?: boolean;
  onPress: (item: RkbBoard) => void;
  onScrollEndDrag: () => void;
  onRefresh: () => void;
};

const BoardItemList: React.FC<BoardItemListProps> = ({
  data,
  uid,
  onPress,
  onScrollEndDrag,
  onRefresh,
  refreshing = false,
}) => {
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
    ({item}: {item: RkbBoard}) => (
      <BoardMsg onPress={() => onPress(item)} item={item} uid={uid} />
    ),
    [onPress, uid],
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        // ListHeaderComponent={header}
        ListEmptyComponent={empty}
        // onEndReachedThreshold={0.5}
        onScrollEndDrag={onScrollEndDrag} // 검색 시 onEndReached가 발생하는 버그가 Flatlist에 있어 끝까지 스크롤한 경우 list를 더 가져오도록 변경
        // refreshing={refreshing}
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
    </SafeAreaView>
  );
};

export default memo(BoardItemList);
