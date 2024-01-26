import React, {
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppIcon from '@/components/AppIcon';
import moment from 'moment';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppStyledText from '@/components/AppStyledText';

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
  notiText: {
    ...appStyles.medium14,
    color: colors.black,
  },
  notiTextBold: {
    ...appStyles.bold14Text,
    color: colors.clearBlue,
  },
});

type UsDateInputProps = {
  onClick: (val: boolean) => void;
  actDate: string;
  animatedValue: Animated.value;
};

// TODO : 이름 변경하고 장바구니 모달도 해당 컴포넌트 사용하기
const UsDateInput: React.FC<UsDateInputProps> = ({
  onClick,
  actDate,
  animatedValue,
}) => {
  return (
    <Animated.View>
      <View style={{gap: 8, marginBottom: 8, marginTop: 10}}>
        <AppText style={[appStyles.normal14Text, {color: colors.greyish}]}>
          {i18n.t('us:actDate')}
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
              {color: actDate === '' ? colors.greyish : colors.black},
            ]}>
            {actDate === ''
              ? i18n.t('us:date:placeHolder')
              : moment(actDate).format('YYYY년 MM월 DD일')}
          </AppText>
          <AppText
            style={[
              appStyles.semiBold14Text,
              {
                color: colors.clearBlue,
                alignSelf: 'center',
                justifyContent: 'center',
              },
            ]}>
            {actDate ? (
              i18n.t('modify')
            ) : (
              <AppIcon
                style={{alignSelf: 'center', justifyContent: 'center'}}
                name="iconCalendar"
              />
            )}
          </AppText>
        </Pressable>
      </View>

      {actDate && (
        <View style={{gap: 6}}>
          {['1', '2'].map((i) => (
            <View
              style={{gap: 6, flexDirection: 'row', paddingRight: 20}}
              key={`dateInputNotice${i}`}>
              <AppSvgIcon name="checkedBlueSmall" />
              <AppStyledText
                text={i18n.t(`us:device:notice${i}`)}
                textStyle={styles.notiText}
                format={{b: styles.notiTextBold}}
              />
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
};

export default connect(({product}: RootState) => ({
  product,
}))(UsDateInput);
