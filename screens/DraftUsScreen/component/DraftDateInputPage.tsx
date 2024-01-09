import React, {
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppIcon from '@/components/AppIcon';
import moment from 'moment';

const styles = StyleSheet.create({
  DateBoxBtnFrame: {
    padding: 16,
    gap: 8,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

type DraftDateInputPageProps = {
  onClick: (val: boolean) => void;
  selected: string;
};

// TODO : 이름 변경하고 장바구니 모달도 해당 컴포넌트 사용하기
const DraftDateInputPage: React.FC<DraftDateInputPageProps> = ({
  onClick,
  selected,
}) => {
  return (
    <>
      <View style={{paddingHorizontal: 20, flex: 1}}>
        <View style={{marginVertical: 24, width: '50%'}}>
          <AppText style={appStyles.bold24Text}>
            {i18n.t('us:step1:title')}
          </AppText>
        </View>
        <View style={{gap: 8}}>
          <AppText style={[appStyles.normal14Text, {color: colors.greyish}]}>
            {i18n.t('us:date:text')}
          </AppText>

          <Pressable
            style={styles.DateBoxBtnFrame}
            onPress={() => {
              console.log('@@@ onPress 클릭');
              onClick(true);
              //   setShowPicker(true);
            }}>
            <AppText
              style={[
                appStyles.normal16Text,
                {color: selected === '' ? colors.greyish : colors.black},
              ]}>
              {selected === ''
                ? i18n.t('us:date:placeHolder')
                : moment(selected).format('YYYY년 MM월 DD일')}
            </AppText>
            <AppIcon
              style={{alignSelf: 'center', justifyContent: 'center'}}
              name="iconCalendar"
            />
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default connect(({product}: RootState) => ({
  product,
}))(DraftDateInputPage);
