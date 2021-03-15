import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import _ from 'underscore';
import LabelText from '../../../components/LabelText';
import { colors } from '../../../constants/Colors';
import { isDeviceSize } from '../../../constants/SliderEntry.style';
import { appStyles } from '../../../constants/Styles';
import i18n from '../../../utils/i18n';
import utils from '../../../utils/utils';

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
    fontSize: isDeviceSize('small') ? 12 : 14,
    alignSelf: 'flex-start',
    color: colors.warmGrey,
  }
});

class OrderItem extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.item.state !== nextProps.item.state;
  }

  render() {
    const {item, onPress} = this.props;
    let label = ''
    if (_.isEmpty(item.orderItems)) return <View />;

    label = item.orderItems[0].title;
    if (item.orderItems.length > 1)
      label += i18n.t('his:etcCnt').replace('%%', item.orderItems.length - 1);

    const isCanceled = item.state === 'canceled';
    const billingAmt = item.totalPrice + item.dlvCost;

    return (
      <TouchableOpacity onPress={onPress}>
        <View key={item.orderId} style={styles.order}>
          <LabelText
            style={styles.orderValue}
            label={utils.toDateString(item.orderDate, 'YYYY-MM-DD')}
            labelStyle={styles.date}
            valueStyle={{color: colors.tomato}}
            value={isCanceled && i18n.t('his:cancel')}
          />
          <LabelText
            style={styles.orderValue}
            label={label}
            labelStyle={[
              {width: '70%'},
              isDeviceSize('small')
                ? appStyles.normal14Text
                : appStyles.normal16Text,
            ]}
            value={billingAmt}
            color={isCanceled ? colors.warmGrey : colors.black}
            valueStyle={appStyles.price}
            format="price"
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export default OrderItem;