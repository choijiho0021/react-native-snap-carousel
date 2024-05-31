import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppNotiBox from '@/components/AppNotiBox';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import AppBottomModal from './AppBottomModal';
import moment from 'moment';
import AppSvgIcon from '@/components/AppSvgIcon';
import {utils} from '@/utils/utils';

const styles = StyleSheet.create({
  headNotiFrame: {
    alignItems: 'center',
    flexDirection: 'row',
    ...appStyles.normal14Text,
    backgroundColor: colors.backGrey,
    borderRadius: 3,
    marginTop: 20,
    padding: 16,
    paddingRight: 30,
    marginHorizontal: 20,
  },
});

type DatePickerModalProps = {
  visible: boolean;
  onClose: (val: boolean) => void;
  selected: string;
  onSelected: (val: string) => void;
};

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
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};

LocaleConfig.defaultLocale = 'ko';

// TODO : 이름 변경하고 장바구니 모달도 해당 컴포넌트 사용하기
const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onSelected,
}) => {
  const [month, setMonth] = useState('');

  const modalBody = useMemo(() => {
    const minDate = moment()
      .utcOffset('-05:00')
      .add(1, 'days')
      .format('YYYY-MM-DD'); // 2024-01-27

    // 오류 체크용 로그
    utils.log(
      `핸드폰의 moment ${moment().format()},, @@@@ moment().utcOffset('-05:00') : ${moment()
        .utcOffset('-05:00')
        .format()} \n`,
    );

    const today = moment().isBefore(minDate);

    const isLeftDisable = moment(month).isBefore(minDate);

    const markedDate = {
      [minDate]: {
        customStyles: {
          container: {
            backgroundColor: colors.clearBlue,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 100,
          },
          text: {
            color: 'white',
          },
        },
      },
    };

    return (
      <View style={{paddingBottom: 20}}>
        <AppNotiBox
          containerStyle={styles.headNotiFrame}
          backgroundColor={colors.backGrey}
          textColor={colors.black}
          text={i18n.t('us:modal:selectDate:text')}
          iconName="emojiCheck"
        />
        <Calendar
          minDate={minDate}
          onDayPress={(day) => {
            console.log('selected day', day);
            onSelected(day.dateString);
            onClose();
          }}
          onMonthChange={(date) => {
            setMonth(date.dateString);
          }}
          monthFormat="yyyy년 MMMM"
          renderArrow={(direction) =>
            direction === 'left' ? (
              isLeftDisable ? (
                <AppSvgIcon name="leftCalendarDisabledIcon" />
              ) : (
                <AppSvgIcon name="leftCalendarIcon" />
              )
            ) : (
              <AppSvgIcon name="rightCalendarIcon" />
            )
          }
          disableArrowLeft={isLeftDisable}
          markingType={'custom'}
          markedDates={markedDate}
          theme={{
            'stylesheet.day.basic': {
              base: {
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 100,
              },
            },
            todayTextColor: today ? colors.lightGrey : colors.black,
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
  }, [month, onClose, onSelected]);

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
