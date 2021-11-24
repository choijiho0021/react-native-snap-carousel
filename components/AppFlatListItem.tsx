import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RkbInfo} from '@/redux/api/pageApi';
import utils from '@/redux/api/utils';
import React, {memo, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AppIcon from './AppIcon';
import AppText from './AppText';

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
    paddingBottom: 0,
    textAlign: 'justify',
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
          <AppText style={styles.title}>{item.title}</AppText>
          <AppIcon
            style={styles.button}
            name={checkedState ? 'iconArrowUp' : 'iconArrowDown'}
          />
        </View>
        {checkedState && (
          <AppText style={styles.body}>{utils.htmlToString(item.body)}</AppText>
        )}
      </View>
    </Pressable>
  );
};

export default memo(AppFlatListItem);
