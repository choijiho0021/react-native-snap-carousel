import React, {memo} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import AppFlatListItem from '@/components/AppFlatListItem';
import {colors} from '@/constants/Colors';
import {RkbInfo} from '@/redux/api/pageApi';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
});

const FaqList = ({data, titleNo}: {data: RkbInfo[]; titleNo?: string}) => {
  return (
    <View style={styles.container}>
      <FlatList
        renderItem={({item}) => {
          const checkNo =
            titleNo === undefined || titleNo === ''
              ? false
              : item.title.startsWith(titleNo);
          return (
            <AppFlatListItem key={item.key} item={item} checked={checkNo} />
          );
        }}
        data={data}
      />
    </View>
  );
};

export default memo(FaqList);
