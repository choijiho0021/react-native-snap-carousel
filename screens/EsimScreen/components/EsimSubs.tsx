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
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderBottomWidth: 0,
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
    height: 50,
    borderWidth: 1,
    borderTopWidth: 0,
    backgroundColor: colors.white,
    borderColor: colors.whiteThree,
    borderRadius: 10,
  },
  giftButtonDis: {
    flex: 1,
    flexDirection: 'row',
    // justifyCssssontent: 'center',
    height: 50,
    borderWidth: 1,
    borderTopWidth: 0,
    backgroundColor: colors.white,
    borderColor: colors.whiteThree,
    borderRadius: 10,
    opacity: 0.6,
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
  normal14White: {
    ...appStyles.normal14Text,
    color: 'white',
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
  sendable: {
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFrame: {
    flex: 1,
    flexDirection: 'row',
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
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
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
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreInfoContent: {
    backgroundColor: 'gray',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  line: {
    height: 1,
    backgroundColor: 'white',
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
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

  const redirectable = useMemo(
    () =>
      !expired &&
      giftStatusCd !== 'S' &&
      item.country?.includes('HK') &&
      /홍콩/gi.test(item.prodName!) &&
      item.partner === 'CMI',
    [expired, giftStatusCd, item.country, item.partner, item.prodName],
  );

  const title = useCallback(
    (onPress: () => void) => {
      const usageCheckable =
        item.packageId?.startsWith('D') || item.partner === 'Quadcell';

      const country = item.prodName?.split(' ')[0];
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
            {isCharged
              ? `${i18n.t('acc:rechargeDone')} ${country}`
              : item.prodName}
          </AppText>
          {item.isStore ? (
            <AppText>스토어상품</AppText>
          ) : (
            <AppText>일반상품</AppText>
          )}

          {expired || giftStatusCd === 'S' ? (
            <View style={styles.expiredBg}>
              <AppText key={item.nid} style={appStyles.normal12Text}>
                {giftStatusCd === 'S'
                  ? i18n.t('esim:S')
                  : i18n.t('esim:expired')}
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
    },
    [
      expired,
      giftStatusCd,
      isCharged,
      item.isStore,
      item.key,
      item.nid,
      item.packageId,
      item.partner,
      item.prodName,
    ],
  );

  const topInfo = useCallback(() => {
    return (
      <View>
        {item.type !== API.Subscription.CALL_PRODUCT && (
          <View style={styles.inactiveContainer}>
            <AppText style={styles.normal14White}>
              {i18n.t('esim:iccid')}
            </AppText>
            <AppText style={styles.normal14White}>{item.subsIccid}</AppText>
          </View>
        )}
        <View style={styles.inactiveContainer}>
          <AppText style={styles.normal14White}>
            {i18n.t('esim:usablePeriod')}
          </AppText>
          <AppText style={styles.normal14White}>{`${utils.toDateString(
            item.purchaseDate,
            'YYYY.MM.DD',
          )} - ${utils.toDateString(item.expireDate, 'YYYY.MM.DD')}`}</AppText>
        </View>
        <View style={styles.inactiveContainer}>
          <AppText style={styles.normal14White}>
            {i18n.t('esim:reghargeablePeriod')}
          </AppText>
          <AppText style={styles.normal14White}>{chargeablePeriod}</AppText>
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

  const QRnCopyInfo = useCallback(
    (onPress: (showQR: boolean) => void) => {
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
          <View
            style={{height: 32, backgroundColor: colors.whiteThree, width: 1}}
          />
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
              iconName="btnPen"
            />
          ) : (
            <AppButton
              style={styles.btnDis}
              title={i18n.t('esim:notreghargeable')}
              titleStyle={styles.btnTitle}
              iconName="btnPen"
            />
          )}
        </View>
      );
    },
    [isChargeable, isCharged, item, navigation, onPressCharge],
  );

  const renderBtn = useCallback(
    (t: string, isGift: boolean) => {
      return (
        <View style={[styles.sendable, styles.shadow]}>
          <AppButton
            title={t}
            titleStyle={appStyles.bold14Text}
            style={
              // 충전하기 버튼 충전불가능일때 Disable
              !isChargeable && !isGift
                ? styles.giftButtonDis
                : styles.giftButton
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
        <AppIcon name="iconCheckSmall" />
        <Text style={styles.redirectText}>{i18n.t('esim:redirectHK')}</Text>
      </Pressable>
    );
  }, [item, navigation]);

  const renderHisBtn = useCallback(
    (t: string) => {
      return (
        <View style={[styles.sendable, styles.shadow]}>
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
        {title(onPressUsage)}

        {!expired &&
          giftStatusCd !== 'S' &&
          item.type !== API.Subscription.CALL_PRODUCT &&
          QRnCopyInfo(onPressQR)}
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
                  {renderBtn(`${i18n.t('acc:goRecharge')}`, false)}
                  {renderBtn(`${i18n.t('esim:sendGift')}`, true)}
                </View>
              )}
            </>
          )}

          <View style={styles.line} />
        </View>
      )}
      <Pressable
        style={isMoreInfo ? styles.moreInfo : styles.lessInfo}
        onPress={() => {
          setIsMoreInfo(!isMoreInfo);
        }}>
        <Text>{isMoreInfo ? '접기' : '펼치기'}</Text>
      </Pressable>
    </View>
  );
};

export default memo(EsimSubs);
