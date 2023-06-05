/* eslint-disable no-nested-ternary */
import React, {
  memo,
  MutableRefObject,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {Pressable, StyleSheet, View, Platform, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {API} from '@/redux/api';
import {isDisabled, RkbSubscription} from '@/redux/api/subscriptionApi';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';
import AppSvgIcon from '@/components/AppSvgIcon';
import SplitText from '@/components/SplitText';
import {renderPromoFlag} from '@/screens/ChargeHistoryScreen';
import AppStyledText from '@/components/AppStyledText';
import AppModal from '@/components/AppModal';

const styles = StyleSheet.create({
  cardExpiredBg: {
    backgroundColor: colors.backGrey,
    borderWidth: 1,
    borderColor: colors.whiteTwo,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeBottomBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
  },
  usageListContainer: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: colors.white,
  },
  infoCard: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  infoRadiusBorder: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  giftButton: {
    flex: 1,
    flexDirection: 'row',
    height: 52,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderColor: colors.whiteThree,
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
    paddingVertical: 10,
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
    fontSize: isDeviceSize('small') ? 18 : 20,
    color: colors.warmGrey,
  },
  usageTitleBold: {
    ...appStyles.normal16Text,
    fontSize: isDeviceSize('small') ? 18 : 20,
    fontWeight: 'bold',
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
  normal14Gray: {
    ...appStyles.normal14Text,
    color: '#777777',
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
  btn: {
    width: 85,
  },
  btnDis: {
    width: 85,
    opacity: 0.6,
  },
  btnExpired: {
    width: 85,
  },
  btnTitle: {
    ...appStyles.normal14Text,
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: -0.5,
  },
  btnTitle2: {
    ...appStyles.medium18,
    paddingBottom: 2,
    lineHeight: 22,
  },
  colorblack: {
    color: '#2c2c2c',
  },
  btnMove: {
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
    height: 50,
    marginBottom: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
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
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.whiteFive,

    elevation: 12,
    shadowColor: 'rgb(52, 62, 95)',
    shadowRadius: 12,
    shadowOpacity: 0.15,
    shadowOffset: {
      height: 4,
      width: 0,
    },
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
  topInfo: {
    marginTop: 24,
  },
  arrow: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cautionBox: {
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 24,
  },
  cautionTitle: {
    ...appStyles.bold16Text,
    color: colors.tomato,
    lineHeight: 20,
    marginRight: 36,
  },
  cautionText: {
    ...appStyles.medium14,
    color: colors.tomato,
    lineHeight: 18,
  },
  expiredDot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: 'red',
    right: 24,
    top: 5,
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
  btnStyle: {
    marginTop: 0,
  },
  cautionRow: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'center',
  },
  cautionTextContainer: {
    flexDirection: 'row',
  },
  blueText: {
    ...appStyles.medium16,
    color: colors.blue,
    lineHeight: 26,
    marginLeft: 6,
  },
});

const EsimSubs = ({
  flatListRef,
  index,
  mainSubs,
  chargedSubs,
  expired,
  isChargeExpired,
  isCharged,
  showDetail = false,
  onPressUsage,
  setShowModal,
}: {
  flatListRef?: MutableRefObject<FlatList<any> | undefined>;
  index: number;
  mainSubs: RkbSubscription;
  chargedSubs: RkbSubscription[];
  expired: boolean;
  isChargeExpired: boolean;
  isCharged: boolean;
  showDetail: boolean;
  onPressUsage: (subs: RkbSubscription) => Promise<{usage: any; status: any}>;
  setShowModal: (visible: boolean) => void;
}) => {
  const navigation = useNavigation();
  const sendable = useMemo(
    () => !expired && !mainSubs.giftStatusCd && !isCharged,
    [expired, mainSubs.giftStatusCd, isCharged],
  );
  const [showMoreInfo, setShowMoreInfo] = useState(showDetail);
  const [expiredModalVisible, setExpiredModalVisible] = useState(false);
  const isBc = useMemo(
    () => mainSubs.partner === 'BillionConnect',
    [mainSubs.partner],
  );
  const notCardInfo = useMemo(
    () =>
      !expired &&
      mainSubs.giftStatusCd !== 'S' &&
      mainSubs.type !== API.Subscription.CALL_PRODUCT,

    [expired, mainSubs.giftStatusCd, mainSubs.type],
  );

  const chargeablePeriod = useMemo(() => {
    return utils.toDateString(mainSubs.expireDate, 'YYYY.MM.DD');
  }, [mainSubs.expireDate]);

  const isChargeable = useMemo(
    () => !(mainSubs.partner === 'BillionConnect' || isChargeExpired),
    [isChargeExpired, mainSubs.partner],
  );

  useEffect(() => {
    if (showMoreInfo)
      flatListRef?.current?.scrollToIndex({index, animated: true});
  }, [flatListRef, index, showMoreInfo]);

  useEffect(() => {
    if (!notCardInfo) setShowMoreInfo(false);
  }, [notCardInfo]);

  const onPressRecharge = useCallback(
    (item: RkbSubscription) => {
      if (isCharged) {
        navigation.navigate('ChargeHistory', {
          mainSubs: item,
          chargeablePeriod,
          onPressUsage,
          chargedSubs,
          isChargeable,
        });
      } else if (isChargeable) {
        navigation.navigate('ChargeType', {
          mainSubs: item,
          chargeablePeriod,
        });
      }
    },
    [
      chargeablePeriod,
      chargedSubs,
      isChargeable,
      isCharged,
      navigation,
      onPressUsage,
    ],
  );

  const title = useCallback(() => {
    const country = mainSubs.prodName?.split(' ')?.[0];

    return (
      <Pressable
        style={styles.prodTitle}
        onPress={() => {
          if (notCardInfo) setShowMoreInfo((prev) => !prev);
        }}>
        <SplitText
          key={mainSubs.key}
          renderExpend={() =>
            !isDisabled(mainSubs) &&
            !isCharged &&
            renderPromoFlag(mainSubs.promoFlag || [], mainSubs.isStore)
          }
          style={[
            expired || mainSubs.giftStatusCd === 'S'
              ? styles.usageTitleNormal
              : styles.usageTitleBold,
            {
              alignSelf: 'center',
              lineHeight: isDeviceSize('small') ? 26 : 28,
              marginRight: 8,
            },
          ]}
          numberOfLines={2}
          ellipsizeMode="tail">
          {isCharged && mainSubs.giftStatusCd !== 'S'
            ? `${i18n.t('acc:rechargeDone')} ${utils.removeBracketOfName(
                country,
              )}`
            : utils.removeBracketOfName(mainSubs.prodName)}
        </SplitText>

        {expired || mainSubs.giftStatusCd === 'S' ? (
          <View style={styles.expiredBg}>
            <AppText key={mainSubs.nid} style={appStyles.normal12Text}>
              {mainSubs.giftStatusCd === 'S'
                ? i18n.t('esim:S2')
                : i18n.t('esim:expired')}
            </AppText>
          </View>
        ) : (
          <View style={styles.arrow}>
            <AppSvgIcon name={showMoreInfo ? 'topArrow' : 'bottomArrow'} />
          </View>
        )}
      </Pressable>
    );
  }, [mainSubs, expired, isCharged, showMoreInfo, notCardInfo]);

  const topInfo = useCallback(() => {
    return (
      <View style={[styles.topInfo, !notCardInfo && {marginTop: 28}]}>
        {mainSubs.type !== API.Subscription.CALL_PRODUCT && (
          <View style={styles.inactiveContainer}>
            <AppText style={styles.normal14Gray}>
              {i18n.t('esim:iccid')}
            </AppText>
            <AppText style={styles.normal14Gray}>{mainSubs.subsIccid}</AppText>
          </View>
        )}
        <View style={styles.inactiveContainer}>
          <AppText style={styles.normal14Gray}>
            {i18n.t('esim:usablePeriod')}
          </AppText>
          <AppText style={styles.normal14Gray}>{`${utils.toDateString(
            mainSubs.purchaseDate,
            'YYYY.MM.DD',
          )} - ${utils.toDateString(
            chargedSubs[chargedSubs.length - 1].expireDate,
            'YYYY.MM.DD',
          )}`}</AppText>
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
    chargedSubs,
    mainSubs.purchaseDate,
    mainSubs.subsIccid,
    mainSubs.type,
    notCardInfo,
  ]);

  const QRnCopyInfo = useCallback(() => {
    // const usageCheckable =
    //   item.packageId?.startsWith('D') || item.partner === 'Quadcell';
    return (
      <View style={styles.activeBottomBox}>
        <AppSvgIcon
          name="qrInfo"
          style={styles.btn}
          title={i18n.t('esim:showQR')}
          titleStyle={styles.btnTitle}
          onPress={() => navigation.navigate('QrInfo', {mainSubs})}
        />

        <AppSvgIcon
          style={[styles.btn, {opacity: 1}]}
          onPress={() => {
            if (isCharged) {
              onPressRecharge(mainSubs);
            } else {
              setShowModal(true);
              onPressUsage(mainSubs);
            }
          }}
          title={i18n.t('esim:checkUsage')}
          titleStyle={[styles.btnTitle, {opacity: 1}]}
          name="btnUsage"
        />

        {isChargeable ? (
          <AppSvgIcon
            style={styles.btn}
            onPress={() => onPressRecharge(mainSubs)}
            title={i18n.t('esim:rechargeable')}
            titleStyle={styles.btnTitle}
            name="btnChargeable"
          />
        ) : (
          <AppSvgIcon
            style={isChargeExpired ? styles.btnExpired : styles.btnDis}
            title={i18n.t(
              isChargeExpired ? 'esim:rechargeExpired' : 'esim:notrechargeable',
            )}
            titleStyle={[styles.btnTitle, {opacity: isChargeExpired ? 1 : 0.6}]}
            onPress={() => isChargeExpired && setExpiredModalVisible(true)}
            name={isChargeExpired ? 'btnChargeExpired' : 'btnNonChargeable'}
          />
        )}
        {isChargeExpired && <View style={styles.expiredDot} />}
      </View>
    );
  }, [
    isChargeExpired,
    isChargeable,
    isCharged,
    mainSubs,
    navigation,
    onPressRecharge,
    onPressUsage,
    setShowModal,
  ]);

  const renderHkBtn = useCallback(() => {
    if (
      !expired &&
      mainSubs.giftStatusCd !== 'S' &&
      mainSubs.noticeOption.includes('H')
    )
      return (
        <Pressable
          style={styles.redirectHK}
          onPress={() =>
            navigation.navigate('RedirectHK', {
              iccid: mainSubs.subsIccid,
              orderNo: mainSubs.subsOrderNo,
              uuid: mainSubs.uuid,
              imsi: mainSubs.imsi,
            })
          }>
          <View style={styles.row}>
            <AppSvgIcon name="hkIcon" />
            <AppText style={styles.redirectText}>
              {i18n.t('esim:redirectHK2')}
            </AppText>
          </View>
          {mainSubs.tag?.includes('HA') ? (
            <View style={[styles.row, {justifyContent: 'flex-end'}]}>
              <AppSvgIcon name="checkedBlueSmall" />
              <AppText style={styles.blueText}>
                {i18n.t('esim:redirectHK:done')}
              </AppText>
            </View>
          ) : (
            <AppSvgIcon name="rightArrow" />
          )}
        </Pressable>
      );
    return null;
  }, [expired, mainSubs, navigation]);

  const renderMoveBtn = useCallback(() => {
    const moveBtnList = [sendable, isCharged || isChargeable].filter(
      (elm) => elm,
    );
    if (moveBtnList.length === 0) return null;

    return (
      <View style={styles.btnFrame}>
        {moveBtnList.map((key, idx) => {
          const isLast = idx === moveBtnList.length - 1;
          const isSendBtn = sendable && idx === 0;
          const btnTitle = isSendBtn
            ? i18n.t('esim:sendGift')
            : i18n.t(isCharged ? 'esim:chargeHistory' : 'esim:charge');

          return (
            <View
              key={utils.generateKey(idx)}
              style={[styles.btnMove, {marginRight: !isLast ? 12 : 0}]}>
              <AppButton
                title={btnTitle}
                titleStyle={[styles.btnTitle2, !isLast && styles.colorblack]}
                style={!isLast ? styles.giftButton : styles.chargeButton}
                onPress={() =>
                  isSendBtn
                    ? navigation.navigate('Gift', {mainSubs})
                    : onPressRecharge(mainSubs)
                }
              />
            </View>
          );
        })}
      </View>
    );
  }, [
    isChargeable,
    isCharged,
    mainSubs,
    navigation,
    onPressRecharge,
    sendable,
  ]);

  const renderCautionText = useCallback(
    (caution: string, subNum: number, hasPreDot: boolean) => (
      <View
        key={caution + subNum}
        style={[
          styles.cautionTextContainer,
          {
            marginBottom: hasPreDot ? 10 : 0,
            marginRight: hasPreDot ? 36 : 0,
          },
        ]}>
        {hasPreDot && (
          <AppText
            key="centerDot"
            style={[styles.cautionText, {marginHorizontal: 8}]}>
            {i18n.t('centerDot')}
          </AppText>
        )}

        <AppText key={caution} style={styles.cautionText}>
          {caution.substring(subNum)}
        </AppText>
      </View>
    ),
    [],
  );

  const renderCautionList = useCallback(
    (caution: string, idx: number, arr: string[]) => {
      const hasPreDot = arr.length > 1;
      if (caution.startsWith('ios:') && Platform.OS === 'ios')
        return renderCautionText(caution, 4, hasPreDot);
      if (caution.startsWith('android:') && Platform.OS === 'android')
        return renderCautionText(caution, 8, hasPreDot);
      if (!caution.startsWith('ios:') && !caution.startsWith('android:'))
        return renderCautionText(caution, 0, hasPreDot);
      return null;
    },
    [renderCautionText],
  );

  return (
    <View
      style={[
        styles.usageListContainer,
        expired || mainSubs.giftStatusCd === 'S'
          ? styles.cardExpiredBg
          : styles.shadow,
      ]}>
      <View style={notCardInfo ? styles.infoRadiusBorder : styles.infoCard}>
        {title()}

        {notCardInfo ? QRnCopyInfo() : topInfo()}
      </View>
      {showMoreInfo && (
        <View style={showMoreInfo && styles.moreInfoContent}>
          {topInfo()}

          {!!mainSubs.caution || (mainSubs.cautionList?.length || 0) > 0 ? (
            <View style={styles.cautionBox}>
              <View style={styles.cautionRow}>
                <AppSvgIcon name="cautionIcon" style={{marginRight: 12}} />
                <AppText style={styles.cautionTitle}>
                  {i18n.t('esim:caution')}
                </AppText>
              </View>

              <View>
                {(mainSubs.cautionList || [])
                  .concat(mainSubs.caution || [])
                  ?.map(renderCautionList)}
              </View>
            </View>
          ) : (
            <View style={{height: 40}} />
          )}

          {renderHkBtn()}

          {renderMoveBtn()}
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
