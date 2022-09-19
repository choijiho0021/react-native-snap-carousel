import React, {memo, useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import AppModal from '@/components/AppModal';
import AppText from '@/components/AppText';

const styles = StyleSheet.create({});
type ChargeModalProps = {};
const ChargeModal: React.FC<ChargeModalProps> = () => {
  return (
    <AppModal
      justifyContent="flex-end"
      contentStyle={{
        marginHorizontal: 0,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      }}>
      <View>
        <AppText>test</AppText>
      </View>
    </AppModal>
  );
};

export default memo(ChargeModal);
