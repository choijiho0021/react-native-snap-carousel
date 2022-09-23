import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
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
import AppSvgIcon from '@/components/AppSvgIcon';
import {reduce} from 'underscore';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  cardExpiredBg: {
    backgroundColor: colors.whiteTwo,
    borderColor: colors.lightGrey,
    borderWidth: 1,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 0.8,
  },
  activeBottomBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usageListContainer: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.whiteThree,
  },
  infoCard: {
    // backgroundColor: colors.white,
    padding: 20,
    // borderWidth: 1,
    // borderColor: colors.whiteThree,
  },
  infoRadiusBorder: {
    // backgroundColor: colors.white,
    // borderRadius: 10,
    padding: 20,
    // borderWidth: 1,
    // borderBottomWidth: 0,
    // borderColor: colors.whiteThree,
  },
  giftButton: {
    flex: 1,
    flexDirection: 'row',
    // justifyCssssontent: 'center',
    height: 52,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderColor: colors.whiteThree,
  },
  chargeButtonDis: {
    flex: 1,
    flexDirection: 'row',
    // justifyCssssontent: 'center',
    height: 52,
    // borderWidth: 1,
    backgroundColor: '#2a7ff6',
    opacity: 0.6,
  },
  chargeButton: {
    flex: 1,
    flexDirection: 'row',
    // justifyCssssontent: 'center',
    height: 52,
    // borderWidth: 1,
    backgroundColor: '#2a7ff6',
    borderColor: colors.whiteThree,
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
    color: colors.warmGrey,
  },
  usageTitleBold: {
    ...appStyles.normal16Text,
    fontSize: isDeviceSize('small') ? 16 : 18,
    fontWeight: 'bold',
  },
  normal12WarmGrey: {
    ...appStyles.normal12Text,
    color: colors.warmGrey,
  },
  expiredBg: {
    backgroundColor: colors.whiteThree,
    borderRadius: 3,
    paddingBottom: 2,
    paddingTop: 2,
    paddingLeft: 6,
    paddingRight: 6,
    justifyContent: 'center',
  },
  checkUsage: {
    ...appStyles.bold14Text,
    color: colors.clearBlue,
  },
  normal14White: {
    ...appStyles.normal14Text,
    color: 'white',
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
  normal14Gray: {
    ...appStyles.normal14Text,
    color: '#777777',
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
  btn: {
    width: '30%',
    paddingTop: 19,
  },
  btnDis: {
    width: '30%',
    paddingTop: 19,
    opacity: 0.6,
  },
  btnTitle: {
    ...appStyles.normal14Text,
    textAlign: 'center',
    marginTop: 10,
  },
  btnTitle2: {
    ...appStyles.medium18,
    paddingBottom: 2,
    lineHeight: 22,
  },
  colorblack: {
    color: '#2c2c2c',
  },
  sendable: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  btnLeft: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginTop: 40,
  },
  btnRight: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    marginTop: 40,
  },
  btnFrame: {
    flex: 1,
    flexDirection: 'row',
  },
  redirectHK: {
    flexDirection: 'row',
    height: 50,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eff2f4',
    borderColor: colors.lightGrey,
    borderRadius: 3,
  },
  redirectText: {
    ...appStyles.medium16,
    letterSpacing: 0,
    marginLeft: 8,
    paddingBottom: 3,
    // lineHeight: 26,
    color: '#2c2c2c',
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
  lessInfo: {
    height: 40,
    backgroundColor: 'gray',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreInfo: {
    height: 40,
    backgroundColor: 'gray',
    // borderRadius: 10,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreInfoContent: {
    backgroundColor: 'white',
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  line: {
    height: 1,
    backgroundColor: 'white',
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
  },
  topInfo: {
    marginTop: 20,
  },
  arrow: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  badgeText: {
    ...appStyles.bold13Text,
  },
});

const EsimSubs = ({
  item,
  onPressQR,
  onPressUsage,
  onPressCharge,
  expired,
}: {
  item: RkbSubscription;
  onPressQR: (showQR: boolean) => void;
  onPressUsage: () => void;
  onPressCharge: () => void;
  expired: boolean;
}) => {
  const navigation = useNavigation();
  const {giftStatusCd} = item;
  const sendable = useMemo(
    () => !expired && !giftStatusCd,
    [expired, giftStatusCd],
  );
  const [isMoreInfo, setIsMoreInfo] = useState(false);
  const [isChargeable, setIsChargeable] = useState(true);
  const [isCharged, setIsCharged] = useState(false);
  const [chargeablePeriod, setChargeablePeriod] = useState('');

  useEffect(() => {
    const chargeabledate = new Date(
      parseInt(item.expireDate.split('-')[0], 10),
      parseInt(item.expireDate.split('-')[1], 10) - 1,
      parseInt(item.expireDate.split('-')[2], 10),
    );

    chargeabledate.setDate(chargeabledate.getDate() - 30);

    const today = new Date();

    setChargeablePeriod(
      `${chargeabledate.getFullYear()}.${
        chargeabledate.getMonth() + 1
      }.${chargeabledate.getDate()}`,
    );

    if (chargeabledate < today) setIsChargeable(false);
  }, [item.expireDate, setChargeablePeriod]);

  const getBadgeColor = useCallback((key) => {
    if (key === 'hot')
      return {
        backgroundColor: colors.veryLightPink,
        fontColor: colors.tomato,
      };

    if (key === 'sizeup')
      return {
        backgroundColor: colors.veryLightBlue,
        fontColor: colors.clearBlue,
      };
    if (key === 'doubleSizeup')
      return {
        backgroundColor: colors.lightSage,
        fontColor: colors.shamrock,
      };

    return {
      backgroundColor: colors.veryLightPink,
      fontColor: colors.tomato,
    };
  }, []);

  const redirectable = useMemo(
    () =>
      !expired &&
      giftStatusCd !== 'S' &&
      item.country?.includes('HK') &&
      /홍콩/gi.test(item.prodName!) &&
      item.partner === 'CMI',
    [expired, giftStatusCd, item.country, item.partner, item.prodName],
  );

  const title = useCallback(() => {
    const country = item.prodName?.split(' ')[0];
    return (
      <View style={styles.prodTitle}>
        <View style={styles.rowCenter}>
          <AppText
            key={item.key}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              expired || giftStatusCd === 'S'
                ? styles.usageTitleNormal
                : styles.usageTitleBold,
              {marginBottom: 10, marginRight: 8},
            ]}>
            {isCharged
              ? `${i18n.t('acc:rechargeDone')} ${country}`
              : item.prodName}
          </AppText>
          {sendable &&
            !expired &&
            item.promoFlag &&
            item.promoFlag.map((elm) => {
              const badgeColor = getBadgeColor(elm);
              return (
                <View
                  key={elm}
                  style={[
                    styles.badge,
                    {
                      backgroundColor: badgeColor.backgroundColor,
                    },
                  ]}>
                  <AppText
                    key="name"
                    style={[styles.badgeText, {color: badgeColor.fontColor}]}>
                    {i18n.t(elm)}
                  </AppText>
                </View>
              );
            })}
          {item.isStore && <AppIcon name="naverIcon" />}
        </View>

        {expired || giftStatusCd === 'S' ? (
          <View style={styles.expiredBg}>
            <AppText key={item.nid} style={appStyles.normal12Text}>
              {giftStatusCd === 'S'
                ? i18n.t('esim:S2')
                : i18n.t('esim:expired')}
            </AppText>
          </View>
        ) : (
          <Pressable
            onPress={() => {
              setIsMoreInfo(!isMoreInfo);
            }}
            style={styles.arrow}>
            {isMoreInfo ? (
              <AppSvgIcon name="topArrow" style={{marginRight: 8}} />
            ) : (
              <AppSvgIcon name="bottomArrow" style={{marginRight: 8}} />
            )}
          </Pressable>
        )}
      </View>
    );
  }, [
    expired,
    getBadgeColor,
    giftStatusCd,
    isCharged,
    isMoreInfo,
    item.isStore,
    item.key,
    item.nid,
    item.prodName,
    item.promoFlag,
    sendable,
  ]);

  const topInfo = useCallback(() => {
    return (
      <View style={styles.topInfo}>
        {item.type !== API.Subscription.CALL_PRODUCT && (
          <View style={styles.inactiveContainer}>
            <AppText style={styles.normal14Gray}>
              {i18n.t('esim:iccid')}
            </AppText>
            <AppText style={styles.normal14Gray}>{item.subsIccid}</AppText>
          </View>
        )}
        <View style={styles.inactiveContainer}>
          <AppText style={styles.normal14Gray}>
            {i18n.t('esim:usablePeriod')}
          </AppText>
          <AppText style={styles.normal14Gray}>{`${utils.toDateString(
            item.purchaseDate,
            'YYYY.MM.DD',
          )} - ${utils.toDateString(item.expireDate, 'YYYY.MM.DD')}`}</AppText>
        </View>
        <View style={styles.inactiveContainer}>
          <AppText style={styles.normal14Gray}>
            {i18n.t('esim:reghargeablePeriod')}
          </AppText>
          <AppText style={styles.normal14Gray}>{chargeablePeriod}</AppText>
        </View>
      </View>
    );
  }, [
    chargeablePeriod,
    item.expireDate,
    item.purchaseDate,
    item.subsIccid,
    item.type,
  ]);

  const QRnCopyInfo = useCallback(() => {
    // const usageCheckable =
    //   item.packageId?.startsWith('D') || item.partner === 'Quadcell';
    return (
      <View style={styles.activeBottomBox}>
        <AppButton
          style={styles.btn}
          onPress={() => onPressQR(true)}
          title={i18n.t('esim:showQR')}
          titleStyle={styles.btnTitle}
          iconName="btnQr2"
        />

        {/* {usageCheckable && ( */}
        <AppButton
          style={styles.btn}
          onPress={onPressUsage}
          title={i18n.t('usim:checkUsage')}
          titleStyle={styles.btnTitle}
          iconName="btnUsage"
        />
        {/* )} */}

        {isChargeable ? (
          <AppButton
            style={styles.btn}
            onPress={() =>
              isCharged
                ? navigation.navigate('ChargeHistory', {item})
                : onPressCharge()
            }
            title={i18n.t('esim:reghargeable')}
            titleStyle={styles.btnTitle}
            iconName="btnChargeable"
          />
        ) : (
          <AppButton
            style={styles.btnDis}
            title={i18n.t('esim:notreghargeable')}
            titleStyle={styles.btnTitle}
            iconName="btnNonChargeable"
          />
        )}
      </View>
    );
  }, [
    isChargeable,
    isCharged,
    item,
    navigation,
    onPressCharge,
    onPressQR,
    onPressUsage,
  ]);

  const renderBtn = useCallback(
    (t: string, isGift: boolean) => {
      return (
        <View style={isGift ? styles.btnLeft : styles.btnRight}>
          <AppButton
            title={t}
            titleStyle={[styles.btnTitle2, isGift && styles.colorblack]}
            style={
              // 충전하기 버튼 충전불가능일때 Disable
              // eslint-disable-next-line no-nested-ternary
              isGift
                ? styles.giftButton
                : isChargeable
                ? styles.chargeButton
                : styles.chargeButtonDis
            }
            onPress={() =>
              isGift
                ? navigation.navigate('Gift', {item})
                : isChargeable && onPressCharge()
            }
          />
        </View>
      );
    },
    [isChargeable, item, navigation, onPressCharge],
  );

  const renderHkBtn = useCallback(() => {
    return (
      <Pressable
        style={styles.redirectHK}
        onPress={() =>
          navigation.navigate('RedirectHK', {
            iccid: item.subsIccid,
            orderNo: item.subsOrderNo,
          })
        }>
        <AppIcon name="hkIcon" />
        <Text style={styles.redirectText}>{i18n.t('esim:redirectHK2')}</Text>
      </Pressable>
    );
  }, [item, navigation]);

  const renderHisBtn = useCallback(
    (t: string) => {
      return (
        <View style={styles.sendable}>
          <AppButton
            title={t}
            titleStyle={appStyles.bold14Text}
            style={styles.giftButton}
            onPress={() => navigation.navigate('Charge', {item})}
          />
        </View>
      );
    },
    [item, navigation],
  );

  return (
    <View
      style={[
        styles.usageListContainer,
        expired || giftStatusCd === 'S' ? styles.cardExpiredBg : styles.shadow,
      ]}>
      <View style={sendable ? styles.infoRadiusBorder : styles.infoCard}>
        {title()}

        {!expired &&
        giftStatusCd !== 'S' &&
        item.type !== API.Subscription.CALL_PRODUCT
          ? QRnCopyInfo()
          : topInfo()}
      </View>
      {isMoreInfo && (
        <View style={isMoreInfo && styles.moreInfoContent}>
          {topInfo()}
          {redirectable && renderHkBtn()}

          {isCharged ? (
            // 충전 내역이 있는 경우
            <>{renderHisBtn(`${i18n.t('acc:rechargeHistory2')}`)}</>
          ) : (
            // 충전 내역이 없는 경우
            <>
              {sendable && (
                <View style={styles.btnFrame}>
                  {renderBtn(`${i18n.t('esim:sendGift')}`, true)}
                  {renderBtn(`${i18n.t('esim:charge')}`, false)}
                </View>
              )}
            </>
          )}

          <View style={styles.line} />
        </View>
      )}
    </View>
  );
};

export default memo(EsimSubs);
