import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
});

const EmptyResult = () => {
  return (
    <View style={styles.container}>
      <AppIcon style={{marginBottom: 16}} name="imgDot" />
      <AppText>{i18n.t('talk:search:none')}</AppText>
    </View>
  );
};

export default memo(EmptyResult);
