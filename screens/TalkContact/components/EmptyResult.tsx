import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import AppIcon from '@/components/AppIcon';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  title: {
    ...appStyles.normal16Text,
    lineHeight: 24,
    color: colors.warmGrey,
  },
});

const EmptyResult = ({title}: {title?: string}) => {
  return (
    <View style={styles.container}>
      <View style={{flex: 3}} />

      <AppIcon style={{marginBottom: 16}} name="imgDot" />
      <AppText style={styles.title}>
        {title || i18n.t('talk:search:none')}
      </AppText>

      <View style={{flex: 7}} />
    </View>
  );
};

export default memo(EmptyResult);
