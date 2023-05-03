import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {appStyles} from '@/constants/Styles';
import AppText from '@/components/AppText';

const styles = StyleSheet.create({
  prodName: {
    marginTop: 10,
    paddingTop: 50,
    marginHorizontal: 20,
  },
  prodNameText: {
    ...appStyles.bold20Text,
  },
});

const ChargeProdTitle = ({prodName}: {prodName: string}) => {
  return (
    <View style={styles.prodName}>
      <AppText style={styles.prodNameText}>{prodName}</AppText>
    </View>
  );
};

export default memo(ChargeProdTitle);
