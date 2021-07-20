import React, {memo, useState} from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';

import utils from '@/submodules/rokebi-utils/utils';
import {RkbInfo} from '@/submodules/rokebi-utils/api/pageApi';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppIcon from './AppIcon';

const styles = StyleSheet.create({
  row: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.whiteTwo,
  },
  title: {
    ...appStyles.normal16Text,
    flex: 1,
    marginLeft: 20,
  },
  body: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
    backgroundColor: colors.whiteTwo,
    padding: 20,
  },
  button: {
    paddingHorizontal: 20,
  },
});

const AppFlatListItem = ({
  item,
  checked = false,
}: {
  item: RkbInfo;
  checked?: boolean;
}) => {
  const [checkedState, setCheckedState] = useState(checked);

  return (
    <Pressable onPress={() => setCheckedState(!checkedState)}>
      <View>
        <View style={styles.row}>
          <Text style={styles.title}>{item.title}</Text>
          <AppIcon
            style={styles.button}
            name={checkedState ? 'iconArrowUp' : 'iconArrowDown'}
          />
        </View>
        {checkedState && (
          <Text style={styles.body}>{utils.htmlToString(item.body)}</Text>
        )}
      </View>
    </Pressable>
  );
};

export default memo(AppFlatListItem);
