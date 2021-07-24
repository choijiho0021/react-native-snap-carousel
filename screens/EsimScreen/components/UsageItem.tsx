import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import AppButton from '@/components/AppButton';
import {appStyles} from '@/constants/Styles';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {utils} from '@/utils/utils';
import {API} from '@/redux/api';
import {RkbSubscription} from '@/redux/api/subscriptionApi';

const styles = StyleSheet.create({
  cardExpiredBg: {
    backgroundColor: colors.whiteTwo,
    borderColor: colors.lightGrey,
    borderWidth: 1,
  },
  activeBottomBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  usageListContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 3,
    padding: 20,
  },
  prodTitle: {
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inactiveContainer: {
    // paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  usageTitleNormal: {
    ...appStyles.normal16Text,
    fontSize: isDeviceSize('small') ? 14 : 16,
    maxWidth: '70%',
    color: colors.warmGrey,
  },
  usageTitleBold: {
    ...appStyles.normal16Text,
    fontSize: isDeviceSize('small') ? 14 : 16,
    maxWidth: '70%',
    fontWeight: 'bold',
  },
  normal12WarmGrey: {
    ...appStyles.normal12Text,
    color: colors.warmGrey,
  },
  expiredBg: {
    backgroundColor: colors.whiteThree,
    borderRadius: 3,
    padding: 5,
    height: '90%',
  },
  normal14WarmGrey: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
  btn: {
    width: '45%',
    paddingTop: 25,
  },
  btnTitle: {
    ...appStyles.normal14Text,
    textAlign: 'center',
    marginTop: 10,
  },
});

const title = (item: RkbSubscription, expired: boolean) => {
  return (
    <View style={styles.prodTitle}>
      <Text
        key={item.key}
        style={expired ? styles.usageTitleNormal : styles.usageTitleBold}>
        {item.prodName}
      </Text>
      {expired && (
        <View style={styles.expiredBg}>
          <Text key={item.nid} style={appStyles.normal12Text}>
            {i18n.t('esim:expired')}
          </Text>
        </View>
      )}
    </View>
  );
};

const topInfo = (item: RkbSubscription) => {
  return (
    <View>
      {item.type !== API.Subscription.CALL_PRODUCT && (
        <View style={styles.inactiveContainer}>
          <Text style={styles.normal12WarmGrey}>{i18n.t('esim:iccid')}</Text>
          <Text style={styles.normal14WarmGrey}>{item.subsIccid}</Text>
        </View>
      )}
      <View style={styles.inactiveContainer}>
        <Text style={styles.normal12WarmGrey}>
          {i18n.t('esim:usablePeriod')}
        </Text>
        <Text style={styles.normal14WarmGrey}>{`${utils.toDateString(
          item.purchaseDate,
          'YYYY-MM-DD',
        )} ~ ${item.expireDate}`}</Text>
      </View>
    </View>
  );
};

const QRnCopyInfo = (onPress: (showQR: boolean) => void) => {
  return (
    <View style={styles.activeBottomBox}>
      <AppButton
        style={styles.btn}
        onPress={() => onPress(true)}
        title={i18n.t('esim:showQR')}
        titleStyle={styles.btnTitle}
        iconName="btnQr"
      />
      <AppButton
        style={styles.btn}
        onPress={() => onPress(false)}
        title={i18n.t('esim:manualInput')}
        titleStyle={styles.btnTitle}
        iconName="btnPen"
      />
    </View>
  );
};

const UsageItem = ({
  item,
  onPress,
  expired,
}: {
  item: RkbSubscription;
  onPress: (showQR: boolean) => void;
  expired: boolean;
}) => {
  return (
    <View style={[styles.usageListContainer, expired && styles.cardExpiredBg]}>
      {title(item, expired)}
      {topInfo(item)}
      {!expired &&
        item.type !== API.Subscription.CALL_PRODUCT &&
        QRnCopyInfo(onPress)}
    </View>
  );
};

export default memo(UsageItem);
