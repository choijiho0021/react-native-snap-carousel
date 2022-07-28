import React, {memo, useMemo} from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  View,
  Text,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Line, Svg} from 'react-native-svg';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {API} from '@/redux/api';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';
import AppIcon from '@/components/AppIcon';

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
    alignItems: 'center',
  },
  usageListContainer: {
    marginTop: 24,
    marginHorizontal: 20,
  },
  infoCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.whiteThree,
  },
  infoRadiusBorder: {
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
    backgroundColor: colors.white,
    borderColor: colors.whiteThree,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  prodTitle: {
    paddingBottom: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inactiveContainer: {
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  usageTitleNormal: {
    ...appStyles.normal16Text,
    fontSize: isDeviceSize('small') ? 16 : 18,
    maxWidth: '70%',
    color: colors.warmGrey,
  },
  usageTitleBold: {
    ...appStyles.normal16Text,
    fontSize: isDeviceSize('small') ? 16 : 18,
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
    justifyContent: 'center',
  },
  checkUsage: {
    ...appStyles.bold14Text,
    color: colors.clearBlue,
  },
  normal14WarmGrey: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
  btn: {
    width: '45%',
    paddingTop: 19,
  },
  btnTitle: {
    ...appStyles.normal14Text,
    textAlign: 'center',
    marginTop: 10,
  },
  sendable: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redirectHK: {
    flexDirection: 'row',
    height: 41,
    padding: 10,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.whiteTwo,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  redirectText: {
    ...appStyles.normal14Text,
    marginLeft: 4,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(52, 62, 95)',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: {
          height: 1,
          width: 1,
        },
      },
      android: {
        elevation: 3,
      },
    }),
  },
});

const title = (
  item: RkbSubscription,
  expired: boolean,
  onPress: () => void,
) => {
  const {giftStatusCd} = item;
  const usageCheckable =
    item.packageId?.startsWith('D') || item.partner === 'Quadcell';
  return (
    <View style={styles.prodTitle}>
      <AppText
        key={item.key}
        numberOfLines={1}
        ellipsizeMode="tail"
        style={
          expired || giftStatusCd === 'S'
            ? styles.usageTitleNormal
            : styles.usageTitleBold
        }>
        {item.prodName}
      </AppText>

      {expired || giftStatusCd === 'S' ? (
        <View style={styles.expiredBg}>
          <AppText key={item.nid} style={appStyles.normal12Text}>
            {giftStatusCd === 'S' ? i18n.t('esim:S') : i18n.t('esim:expired')}
          </AppText>
        </View>
      ) : (
        // expired 제외의 경우에는 사용량 확인 출력?
        usageCheckable && (
          <Pressable
            onPress={onPress}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <AppText key={item.nid} style={styles.checkUsage}>
              {i18n.t('usim:checkUsage')}
            </AppText>
            <AppIcon name="iconArrowRightBlue" style={{marginLeft: 4}} />
          </Pressable>
        )
      )}
    </View>
  );
};

const topInfo = (item: RkbSubscription) => {
  return (
    <View>
      {item.type !== API.Subscription.CALL_PRODUCT && (
        <View style={styles.inactiveContainer}>
          <AppText style={styles.normal14WarmGrey}>
            {i18n.t('esim:iccid')}
          </AppText>
          <AppText style={styles.normal14WarmGrey}>{item.subsIccid}</AppText>
        </View>
      )}
      <View style={styles.inactiveContainer}>
        <AppText style={styles.normal14WarmGrey}>
          {i18n.t('esim:usablePeriod')}
        </AppText>
        <AppText style={styles.normal14WarmGrey}>{`${utils.toDateString(
          item.purchaseDate,
          'YYYY.MM.DD',
        )} - ${utils.toDateString(item.expireDate, 'YYYY.MM.DD')}`}</AppText>
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
      <View
        style={{height: 32, backgroundColor: colors.whiteThree, width: 1}}
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
  const {giftStatusCd} = item;
  const sendable = useMemo(
    () => !expired && !giftStatusCd,
    [expired, giftStatusCd],
  );

  const redirectable = useMemo(
    () =>
      !expired &&
      giftStatusCd !== 'S' &&
      item.country?.includes('HK') &&
      /홍콩/gi.test(item.prodName!) &&
      item.partner === 'CMI',
    [expired, giftStatusCd, item.country, item.partner, item.prodName],
  );

  return (
    <View style={styles.usageListContainer}>
      <View
        style={[
          sendable ? styles.infoRadiusBorder : styles.infoCard,
          expired || giftStatusCd === 'S'
            ? styles.cardExpiredBg
            : styles.shadow,
        ]}>
        {title(item, expired, onPressUsage)}
        {topInfo(item)}
        {!expired &&
          giftStatusCd !== 'S' &&
          item.type !== API.Subscription.CALL_PRODUCT &&
          QRnCopyInfo(onPressQR)}
        {redirectable && (
          <Pressable
            style={styles.redirectHK}
            onPress={() =>
              navigation.navigate('RedirectHK', {
                iccid: item.subsIccid,
                orderNo: item.subsOrderNo,
              })
            }>
            <AppIcon name="iconCheckSmall" />
            <Text style={styles.redirectText}>{i18n.t('esim:redirectHK')}</Text>
          </Pressable>
        )}
      </View>
      {sendable && (
        <View style={[styles.sendable, styles.shadow]}>
          <View style={{flex: 1, width: width - 60}}>
            <Svg height={2} width="100%">
              <Line
                stroke={colors.pinkishGrey}
                strokeWidth="2"
                strokeDasharray="5, 5"
                x1="0%"
                y1="0"
                x2="100%"
                y2="0"
              />
            </Svg>
          </View>
          <AppButton
            title={i18n.t('esim:sendGift')}
            titleStyle={appStyles.bold14Text}
            style={styles.giftButton}
            onPress={() => navigation.navigate('Gift', {item})}
          />
        </View>
      )}
    </View>
  );
};

export default memo(EsimSubs);
