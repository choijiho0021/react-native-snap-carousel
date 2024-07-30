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
    marginTop: 14,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  orderValue: {
    marginTop: 6,
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
    let str = item.orderItems[0]?.title;
    const etcCount = getCountItems(item?.orderItems, true);

    if (item.orderItems && parseInt(etcCount, 10) > 0) {
      str += i18n.t('his:etcCnt').replace('%%', etcCount);
    }
    return str;
  }, [item.orderItems]);

  const [status, statusColor, isCanceled] = useMemo(() => {
    if (item.paymentList.find((elm) => elm.state === 'partially_refunded'))
      return [i18n.t('his:partialCancel'), colors.tomato, true];

    if (item.state === 'canceled') {
      return [i18n.t('his:cancel'), colors.tomato, true];
    }

    if (item.orderType === 'refundable' && item.state === 'validation')
      return [i18n.t('his:draft'), colors.clearBlue, false];

    // 기존 상품 대기중은?
    if (item.usageList.find((v) => isDraft(v.status)))
      return [i18n.t('his:ready'), colors.clearBlue, false];

    return [undefined];
  }, [item.orderType, item.paymentList, item.state, item.usageList]);

  if (_.isEmpty(item.orderItems)) return <View />;

  return (
    <Pressable onPress={onPress}>
      <View key={item.orderId} style={styles.order}>
        <LabelText
          style={styles.orderValue}
          label={utils.toDateString(item.orderDate, 'YYYY.MM.DD')}
          labelStyle={styles.date}
          valueStyle={
            statusColor
              ? {...appStyles.bold16Text, color: statusColor}
              : undefined
          }
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
          value={item.subtotal}
          color={isCanceled ? colors.warmGrey : colors.black}
          valueStyle={appStyles.price}
          balanceStyle={{
            ...appStyles.robotoBold16Text,
            fontWeight: 'bold',
            fontSize: isDeviceSize('medium') ? 22 : 24,
          }}
          currencyStyle={{
            ...appStyles.normal16Text,
            fontWeight: 'bold',
            fontSize: isDeviceSize('medium') ? 18 : 20,
            top: -1,
          }}
          format="price"
        />
      </View>
    </Pressable>
  );
};

export default memo(OrderItem);
