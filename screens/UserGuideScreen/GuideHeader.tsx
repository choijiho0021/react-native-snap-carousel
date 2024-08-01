import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import AppSvgIcon from '@/components/AppSvgIcon';

const styles = StyleSheet.create({
  header: {
    height: 56,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
});

const GuideHeader = ({onPress}: {onPress: () => void}) => (
  <View style={styles.header}>
    <AppSvgIcon
      key="closeModal"
      onPress={onPress}
      name="closeModal"
      style={{marginRight: 16}}
    />
  </View>
);
export default memo(GuideHeader);
