import React, {memo} from 'react';
import {Dimensions, Pressable, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {API} from '@/redux/api';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';

const {width} = Dimensions.get('window');

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
    marginTop: 20,
    marginHorizontal: 20,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.whiteThree,
  },
  giftButton: {
    flex: 1,
    flexDirection: 'row',
    // justifyCssssontent: 'center',
    height: 50,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.whiteThree,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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

const title = (
  item: RkbSubscription,
  expired: boolean,
  onPress: () => void,
) => {
  // console.log('@@ item', item);
  return (
    <View style={styles.prodTitle}>
      <AppText
        key={item.key}
        style={expired ? styles.usageTitleNormal : styles.usageTitleBold}>
        {item.prodName}
      </AppText>
      {/* {expired && (
        <View style={styles.expiredBg}>
          <AppText key={item.nid} style={appStyles.normal12Text}>
            {i18n.t('esim:expired')}
          </AppText>
        </View>
      )} */}
      {expired ? (
        <View style={styles.expiredBg}>
          <AppText key={item.nid} style={appStyles.normal12Text}>
            {i18n.t('esim:expired')}
          </AppText>
        </View>
      ) : (
        <Pressable style={styles.expiredBg} onPress={onPress}>
          <AppText key={item.nid} style={appStyles.normal12Text}>
            {i18n.t('usim:checkUsage')}
          </AppText>
        </Pressable>
      )}
    </View>
  );
};

const topInfo = (item: RkbSubscription) => {
  return (
    <View>
      {item.type !== API.Subscription.CALL_PRODUCT && (
        <View style={styles.inactiveContainer}>
          <AppText style={styles.normal12WarmGrey}>
            {i18n.t('esim:iccid')}
          </AppText>
          <AppText style={styles.normal14WarmGrey}>{item.subsIccid}</AppText>
        </View>
      )}
      <View style={styles.inactiveContainer}>
        <AppText style={styles.normal12WarmGrey}>
          {i18n.t('esim:usablePeriod')}
        </AppText>
        <AppText style={styles.normal14WarmGrey}>{`${utils.toDateString(
          item.purchaseDate,
          'YYYY-MM-DD',
        )} ~ ${item.expireDate}`}</AppText>
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

const EsimSubs = ({
  item,
  onPressQR,
  onPressUsage,
  expired,
}: {
  item: RkbSubscription;
  onPressQR: (showQR: boolean) => void;
  onPressUsage: () => void;
  expired: boolean;
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.usageListContainer}>
      <View style={[styles.infoCard, expired && styles.cardExpiredBg]}>
        {title(item, expired, onPressUsage)}
        {topInfo(item)}
        {!expired &&
          item.type !== API.Subscription.CALL_PRODUCT &&
          QRnCopyInfo(onPressQR)}
      </View>
      {!expired && (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{flex: 1, width: width - 60}}>
            <View
              style={{
                justifyContent: 'center',
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: colors.pinkishGrey,
                width: width - 60, // - 20 * 2 - 10 * 2,
              }}
            />
          </View>
          <AppButton
            title="선물하기"
            titleStyle={{color: colors.black}}
            style={styles.giftButton}
            onPress={() => navigation.navigate('Gift', {item})}
          />
        </View>
      )}
    </View>
  );
};

export default memo(EsimSubs);
