import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import _ from 'underscore';
import {isDraft} from '@reduxjs/toolkit';
import LabelText from '@/components/LabelText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {OrderState, RkbOrder} from '@/redux/api/orderApi';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';

const styles = StyleSheet.create({
  order: {
    marginVertical: 15,
    marginHorizontal: 20,
  },
  orderValue: {
    marginTop: 12,
  },
  date: {
    ...appStyles.normal14Text,
    fontSize: isDeviceSize('small') ? 14 : 16,
    alignSelf: 'flex-start',
    color: colors.warmGrey,
  },
});

const getStatus = (state?: OrderState, reserved?: string) => {
  if (state === 'canceled') return [i18n.t('his:cancel'), colors.tomato];
  if (state === 'validation') return [i18n.t('his:draft'), colors.clearBlue];

  // 기존 상품 대기중은?
  if (reserved) return [i18n.t('his:ready'), colors.clearBlue];
  return [undefined];
};

const OrderItem = ({item, onPress}: {item: RkbOrder; onPress: () => void}) => {
  let label = '';
  if (_.isEmpty(item.orderItems)) return <View />;

  label = item.orderItems[0].title;
  if (item.orderItems && item.orderItems.length > 1) {
    label += i18n
      .t('his:etcCnt')
      .replace('%%', (item.orderItems.length - 1).toString());
  }

  const isCanceled = item.state === 'canceled';
  const [status, statusColor] = getStatus(
    item?.state,
    item.usageList.find((v) => isDraft(v.status))?.status,
  );
  const billingAmt = utils.addCurrency(item.totalPrice, item.dlvCost);

  return (
    <Pressable onPress={onPress}>
      <View key={item.orderId} style={styles.order}>
        <LabelText
          style={styles.orderValue}
          label={utils.toDateString(item.orderDate, 'YYYY-MM-DD')}
          labelStyle={styles.date}
          valueStyle={statusColor && {color: statusColor}}
          value={status}
        />
        <LabelText
          style={styles.orderValue}
          label={label}
          labelStyle={[
            {width: '70%'},
            isDeviceSize('medium')
              ? appStyles.normal16Text
              : appStyles.normal18Text,
          ]}
          value={billingAmt}
          color={isCanceled ? colors.warmGrey : colors.black}
          valueStyle={appStyles.price}
          balanceStyle={{
            ...appStyles.normal16Text,
            fontWeight: 'bold',
            fontSize: isDeviceSize('medium') ? 22 : 24,
          }}
          currencyStyle={{
            ...appStyles.normal16Text,
            fontSize: isDeviceSize('medium') ? 16 : 18,
            top: -1,
          }}
          format="price"
        />
      </View>
    </Pressable>
  );
};

export default memo(
  OrderItem,
  (prevProps, nextProps) =>
    prevProps.item.state === nextProps.item.state &&
    JSON.stringify(prevProps.item.usageList) ===
      JSON.stringify(nextProps.item.usageList),
);
