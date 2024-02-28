import React, {memo} from 'react';
import {Modal, Pressable, ScrollView, StyleSheet} from 'react-native';
import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  menu: {
    width: 254,
    position: 'absolute',
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 64,
    shadowOpacity: 1,
    left: 19,
    top: 125,
    backgroundColor: 'rgba(237, 237, 237, 0.8)',
    shadowColor: 'rgba(0, 0, 0, 0.16)',
  },
  menuItem: {
    height: 44,
    backgroundColor: colors.menu,
    borderBottomColor: colors.menuBorder,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
});

const PopupList = ({
  visible,
  onPress,
  data,
  height,
}: {
  data: {label: string; value: string}[];
  visible: boolean;
  height?: number | string;
  onPress: (id: string) => void;
}) => {
  return (
    <Modal visible={visible} transparent>
      <Pressable style={{flex: 1}} onPress={() => onPress('')}>
        <ScrollView style={[styles.menu, {height: height || '80%'}]}>
          {data.map(({label, value}, i) => (
            <Pressable
              key={value}
              style={[
                styles.menuItem,
                {borderBottomWidth: i === data.length - 1 ? 0 : 1},
              ]}
              onPress={() => onPress(value)}>
              <AppText style={appStyles.medium18}>{label}</AppText>
            </Pressable>
          ))}
        </ScrollView>
      </Pressable>
    </Modal>
  );
};

export default memo(PopupList);
