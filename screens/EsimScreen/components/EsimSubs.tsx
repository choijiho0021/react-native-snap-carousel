/* eslint-disable no-nested-ternary */
import React, {memo, useCallback, useMemo, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  Platform,
  Modal,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
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
import SplitText from '@/components/SplitText';
import {renderPromoFlag} from '@/screens/ChargeHistoryScreen';
import AppStyledText from '@/components/AppStyledText';
import AppModal from '@/components/AppModal';

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
    padding: 20,
  },
  infoRadiusBorder: {
    padding: 20,
  },
  giftButton: {
    flex: 1,
    flexDirection: 'row',
    height: 52,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderColor: colors.whiteThree,
  },
  chargeButtonDis: {
    flex: 1,
    flexDirection: 'row',
    height: 52,
    backgroundColor: '#2a7ff6',
    opacity: 0.6,
  },
  chargeButton: {
    flex: 1,
    flexDirection: 'row',
    height: 52,
    backgroundColor: '#2a7ff6',
    borderColor: colors.whiteThree,
  },
  prodTitle: {
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
  btnExpired: {
    width: '30%',
    paddingTop: 19,
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
  cautionBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 28,
  },
  cautionText: {
    color: '#ee4422',
    ...appStyles.medium16,
    lineHeight: 20,
    marginRight: 36,
  },
  cautionIcon: {marginRight: 12, alignSelf: 'flex-start'},
  expiredDot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: 'red',
    right: '9%',
    top: 16,
  },
  expiredModal: {
    backgroundColor: colors.white,
    alignSelf: 'center',
    paddingTop: 25,
    paddingLeft: 30,
    paddingBottom: 9,
  },
  expiredModalTextFrame: {
    marginLeft: 30,
    marginBottom: 24,
  },
  expiredModalText: {
    ...appStyles.normal16Text,
    lineHeight: 26,
    color: 'rgb(44, 44, 44)',
  },
  highlightText: {
    ...appStyles.normal16Text,
    lineHeight: 26,
    color: 'rgb(238, 68, 35)',
  },
  forModalClose: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  closeBtn: {
    backgroundColor: colors.white,
    width: 88,
    height: 58,
    alignSelf: 'flex-end',
  },
  closeBtnText: {
    ...appStyles.normal16Text,
    color: 'rgb(119, 119, 119)',
    lineHeight: 19,
    letterSpacing: -0.03,
  },
  btnStyle: {
    marginTop: 0,
  },
});

const EsimSubs = ({
  item,
  onPressUsage,
  setShowModal,
  chargedSubs,
  expired,
  isCharged,
}: {
  item: RkbSubscription;
  onPressUsage: () => void;
  setShowModal: (visible: boolean) => void;
  chargedSubs: RkbSubscription[];
  expired: boolean;
  isCharged: boolean;
}) => {
  const navigation = useNavigation();
  const {giftStatusCd} = item;
  const sendable = useMemo(
    () => !expired && !giftStatusCd,
    [expired, giftStatusCd],
  );
  const [isMoreInfo, setIsMoreInfo] = useState(false);
  const [expiredModalVisible, setExpiredModalVisible] = useState(false);

  const chargeabledate = useMemo(() => {
    return moment(item.expireDate).subtract(30, 'd');
  }, [item.expireDate]);

  const chargeablePeriod = useMemo(() => {
    return chargeabledate.format('YYYY.MM.DD');
  }, [chargeabledate]);

  const isChargeable = useMemo(() => {
    if (item.partner !== 'CMI') return false;
    return true;
  }, [item.partner]);

  const isChargeExpired = useMemo(() => {
    const today = moment();
    if (chargeabledate < today) return true;
    return false;
  }, [chargeabledate]);

  const redirectable = useMemo(
    () =>
      !expired &&
      giftStatusCd !== 'S' &&
      item.country?.includes('HK') &&
      /홍콩/gi.test(item.prodName!) &&
      item.partner === 'CMI',
    [expired, giftStatusCd, item],
  );

  const title = useCallback(() => {
    const country = item.prodName?.split(' ')?.[0];

    return (
      <View style={styles.prodTitle}>
        <SplitText
          key={item.key}
          renderExpend={() =>
            sendable &&
            !expired &&
            !isCharged &&
            renderPromoFlag(item.promoFlag || [], item.isStore)
          }
          style={[
            expired || giftStatusCd === 'S'
              ? styles.usageTitleNormal
              : styles.usageTitleBold,
            {marginBottom: 10, alignSelf: 'center'},
          ]}
          numberOfLines={2}
          ellipsizeMode="tail">
          {isCharged && giftStatusCd !== 'S'
            ? `${i18n.t('acc:rechargeDone')} ${utils.removeBracketOfName(
                country,
              )}`
            : item.prodName}
        </SplitText>

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
              setIsMoreInfo((prev) => !prev);
            }}
            style={styles.arrow}>
            <AppSvgIcon
              name={isMoreInfo ? 'topArrow' : 'bottomArrow'}
              style={{marginRight: 8}}
            />
          </Pressable>
        )}
      </View>
    );
  }, [expired, giftStatusCd, isCharged, isMoreInfo, sendable, item]);

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
            {i18n.t('esim:rechargeablePeriod')}
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
          onPress={() => navigation.navigate('QrInfo', {item})}
          title={i18n.t('esim:showQR')}
          titleStyle={styles.btnTitle}
          iconName="btnQr2"
        />

        <AppButton
          style={styles.btn}
          onPress={() => {
            setShowModal(true);
            onPressUsage();
          }}
          title={i18n.t('esim:checkUsage')}
          titleStyle={styles.btnTitle}
          iconName="btnUsage"
        />

        {isChargeable ? (
          !isChargeExpired ? (
            <AppButton
              style={styles.btn}
              onPress={() =>
                isCharged
                  ? navigation.navigate('ChargeHistory', {
                      mainSubs: item,
                      chargeablePeriod,
                      onPressUsage,
                      chargedSubs,
                      isChargeable,
                    })
                  : navigation.navigate('Charge', {
                      item,
                      chargeableDate: chargeablePeriod,
                    })
              }
              title={i18n.t('esim:rechargeable')}
              titleStyle={styles.btnTitle}
              iconName="btnChargeable"
            />
          ) : (
            <AppButton
              style={styles.btnExpired}
              title={i18n.t('esim:rechargeExpired')}
              titleStyle={styles.btnTitle}
              onPress={() => setExpiredModalVisible(true)}
              iconName="btnChargeExpired"
            />
          )
        ) : (
          <AppButton
            style={styles.btnDis}
            title={i18n.t('esim:notrechargeable')}
            titleStyle={styles.btnTitle}
            iconName="btnNonChargeable"
          />
        )}
        {isChargeable && isChargeExpired && <View style={styles.expiredDot} />}
      </View>
    );
  }, [
    chargeablePeriod,
    chargedSubs,
    isChargeExpired,
    isChargeable,
    isCharged,
    item,
    navigation,
    onPressUsage,
    setShowModal,
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
                : isChargeable &&
                  navigation.navigate('Charge', {
                    item,
                    chargeableDate: chargeablePeriod,
                  })
            }
          />
        </View>
      );
    },
    [chargeablePeriod, isChargeable, item, navigation],
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
            onPress={() =>
              navigation.navigate('ChargeHistory', {
                mainSubs: item,
                chargeablePeriod,
                onPressUsage,
                chargedSubs,
                isChargeable,
              })
            }
          />
        </View>
      );
    },
    [
      chargeablePeriod,
      chargedSubs,
      isChargeable,
      item,
      navigation,
      onPressUsage,
    ],
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

          {(!!item.cautionApp || !!item.caution) && (
            <View style={styles.cautionBox}>
              <View style={styles.cautionIcon}>
                <AppIcon name="cautionIcon" />
              </View>
              <View>
                {!!item.caution && (
                  <Text style={styles.cautionText}>{item.caution}</Text>
                )}
                {!!item.cautionApp && (
                  <Text style={styles.cautionText}>{item.cautionApp}</Text>
                )}
              </View>
            </View>
          )}
          {isCharged ? (
            // 충전 내역이 있는 경우
            renderHisBtn(`${i18n.t('acc:rechargeHistory2')}`)
          ) : (
            // 충전 내역이 없는 경우
            <View>
              {sendable && (
                <View style={styles.btnFrame}>
                  {renderBtn(`${i18n.t('esim:sendGift')}`, true)}
                  {isChargeable && renderBtn(`${i18n.t('esim:charge')}`, false)}
                </View>
              )}
            </View>
          )}

          <View style={styles.line} />
        </View>
      )}
      <AppModal
        type="info"
        buttonStyle={styles.btnStyle}
        onOkClose={() => setExpiredModalVisible(false)}
        visible={expiredModalVisible}>
        <View style={styles.expiredModalTextFrame}>
          <AppStyledText
            textStyle={styles.expiredModalText}
            text={i18n.t('esim:charge:cautionExpired')}
            format={{r: styles.highlightText}}
          />
        </View>
      </AppModal>
    </View>
  );
};

export default memo(EsimSubs);
