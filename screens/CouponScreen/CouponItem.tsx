import React, {memo} from 'react';
import moment from 'moment';
import {StyleSheet, View, ViewStyle} from 'react-native';
import AppPrice from '@/components/AppPrice';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RkbCoupon} from '@/redux/api/accountApi';
import AppStyledText from '@/components/AppStyledText';

const styles = StyleSheet.create({
  desc: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.warmGrey,
    marginVertical: 6,
  },
  descBold: {
    ...appStyles.bold14Text,
    lineHeight: 20,
    color: colors.warmGrey,
  },
  date: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dday: {
    ...appStyles.bold12Text,
    color: colors.clearBlue,
    backgroundColor: colors.veryLightBlue,
    height: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.veryLightBlue,
    marginRight: 8,
  },
  urgent: {
    backgroundColor: colors.backRed,
    color: colors.redError,
  },
});

const CouponItem = ({item}: {item: RkbCoupon}) => {
  const {
    prDisp,
    prDesc,
    endDate,
    offer: {percentage, amount},
  } = item;

  const diff = Math.floor(endDate.diff(moment(), 'days', true) || 0);
  if (diff < 0) return null;

  return (
    <View style={{flex: 1}}>
      {amount ? (
        <AppPrice
          price={amount}
          balanceStyle={[appStyles.robotoBold22Text, {lineHeight: 36}]}
          currencyStyle={[appStyles.bold22Text, {color: colors.clearBlue}]}
        />
      ) : percentage ? (
        <AppText style={appStyles.robotoBold22Text}>{percentage}</AppText>
      ) : null}
      <AppText style={{...appStyles.bold16Text, marginTop: 8}}>
        {prDisp}
      </AppText>
      <View style={{marginVertical: 2}}>
        <AppStyledText
          textStyle={styles.desc}
          text={prDesc || ''}
          numberOfLines={3}
          format={{
            b: {
              ...styles.descBold,
            },
          }}
        />
      </View>
      <View style={styles.date}>
        <AppText style={[styles.dday, diff < 10 ? styles.urgent : undefined]}>
          {`D-${diff}`}
        </AppText>
        <AppText style={appStyles.medium14}>
          {endDate.format('yyyy.MM.DD 까지')}
        </AppText>
      </View>
    </View>
  );
};

export default memo(CouponItem);
