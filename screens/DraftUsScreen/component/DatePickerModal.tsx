import React, {useCallback, useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import i18n from '@/utils/i18n';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppNotiBox from '@/components/AppNotiBox';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import AppBottomModal from './AppBottomModal';

const styles = StyleSheet.create({});

type DatePickerModalProps = {
  visible: boolean;
  onClose: (val: boolean) => void;
};

// TODO : 이름 변경하고 장바구니 모달도 해당 컴포넌트 사용하기
const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
}) => {
  LocaleConfig.locales['ko'] = {
    monthNames: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ],
    monthNamesShort: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ],
    dayNames: [
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
      '일요일',
    ],
    dayNamesShort: ['월', '화', '수', '목', '금', '토', '일'],
    today: '오늘',
  };

  LocaleConfig.defaultLocale = 'ko';

  const modalBody = useMemo(() => {
    console.log('@@@ why not return');

    return (
      <View>
        <AppNotiBox
          backgroundColor={colors.backGrey}
          textColor={colors.black}
          text={i18n.t('us:modal:selectDate:text')}
          iconName="emojiCheck"
        />
        <Calendar
          onDayPress={(day) => {
            console.log('selected day', day);
          }}
          monthFormat="yyyy년 MMMM"
          theme={{
            textDayFontFamily: 'AppleSDGothicNeo',
            textMonthFontFamily: 'AppleSDGothicNeo',
            textDayHeaderFontFamily: 'AppleSDGothicNeo',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 20,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
          }}
        />
      </View>
    );
  }, []);

  return (
    <AppBottomModal
      visible={visible}
      isCloseBtn={false}
      onClose={onClose}
      body={modalBody}
    />
  );
};

// export default memo(DatePickerModal);

export default DatePickerModal;
