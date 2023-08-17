import React, {memo, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import _ from 'underscore';
import LabelText from '@/components/LabelText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {RkbOrder} from '@/redux/api/orderApi';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';
import {getCountItems, isDraft} from '@/redux/modules/order';

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

const OrderItem = ({item, onPress}: {item: RkbOrder; onPress: () => void}) => {
  const label = useMemo(() => {
    let str = item.orderItems[0].title;
    if (item.orderItems && item.orderItems.length > 1) {
      str += i18n
        .t('his:etcCnt')
        .replace('%%', getCountItems(item?.orderItems, true));
    }
    return str;
  }, [item.orderItems]);

  const [status, statusColor, isCanceled] = useMemo(() => {
    if (item.state === 'canceled')
      return [i18n.t('his:cancel'), colors.tomato, true];

    if (item.orderType === 'refundable') {
      if (item.state === 'validation')
        return [i18n.t('his:draft'), colors.clearBlue, false];

      // 기존 상품 대기중은?
      if (item.usageList.find((v) => isDraft(v.status)))
        return [i18n.t('his:ready'), colors.clearBlue, false];
    }

    return [undefined];
  }, [item.orderType, item.state, item.usageList]);

  const billingAmt = useMemo(
    () => utils.addCurrency(item.totalPrice, item.dlvCost),
    [item.dlvCost, item.totalPrice],
  );

  if (_.isEmpty(item.orderItems)) return <View />;

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

export default memo(OrderItem);
