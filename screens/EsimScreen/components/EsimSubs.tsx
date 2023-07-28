/* eslint-disable no-nested-ternary */
import React, {
  MutableRefObject,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Platform,
  FlatList,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
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
import {RootState} from '@/redux';
import {ProductModelState} from '@/redux/modules/product';
import AppSwitch from '@/components/AppSwitch';
import {
  actions as orderActions,
  OrderAction,
  OrderModelState,
} from '@/redux/modules/order';
import {AccountModelState} from '@/redux/modules/account';

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
  infoCardTop: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  infoRadiusBorderTop: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  infoCardBottom: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  infoRadiusBorderBottom: {
    paddingHorizontal: 16,
    paddingTop: 8,
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
  draftFrame: {
    flexDirection: 'row',
    marginTop: 10,
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
  newIcon: {
    position: 'absolute',
    top: -12,
    zIndex: 20,
    alignSelf: 'center',
  },
  newText: {
    position: 'absolute',
    top: -10,
    zIndex: 30,
    alignSelf: 'center',
    ...appStyles.bold12Text,
    lineHeight: 16,
    color: colors.white,
  },
  drafting: {
    ...appStyles.bold14Text,
    color: colors.clearBlue,
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
  isEditMode = false,
  onPressUsage,
  setShowModal,

  account: {token},
  product,
  action,
}: {
  flatListRef?: MutableRefObject<FlatList<any> | undefined>;
  index: number;
  mainSubs: RkbSubscription;
  chargedSubs: RkbSubscription[];
  expired: boolean;
  isChargeExpired: boolean;
  isCharged: boolean;
  showDetail: boolean;
  isEditMode: boolean;
  onPressUsage: (subs: RkbSubscription) => Promise<{usage: any; status: any}>;
  setShowModal: (visible: boolean) => void;

  account: AccountModelState;
  product: ProductModelState;
  action: {
    order: OrderAction;
  };
}) => {
  const navigation = useNavigation();
  const isDraft = useMemo(() => mainSubs?.statusCd === 'R', [mainSubs]);
  const sendable = useMemo(
    () => !expired && !mainSubs.giftStatusCd && !isCharged && !isDraft,
    [expired, mainSubs.giftStatusCd, isCharged, isDraft],
  );
  const [showMoreInfo, setShowMoreInfo] = useState(showDetail);
  const [showSubs, setShowSubs] = useState<boolean>(!mainSubs.hide);
  const [expiredModalVisible, setExpiredModalVisible] = useState(false);
  const isBc = useMemo(
    () => mainSubs.partner === 'billionconnect',
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

  const expireTime = useMemo(() => {
    const {expireDate} = chargedSubs.reduce((oldest, current) => {
      const oldestDateObj = new Date(oldest.expireDate);
      const currentDateObj = new Date(current.expireDate);

      if (currentDateObj > oldestDateObj) {
        return current;
      }
      return oldest;
    });

    return expireDate;
  }, [chargedSubs]);

  useEffect(() => {
    setShowMoreInfo(isDraft ? false : showDetail);
  }, [showDetail, isDraft]);

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
          isChargeable: !isChargeExpired,
          expireTime,
        });
      } else if (!isBc) {
        navigation.navigate('ChargeType', {
          mainSubs: item,
          chargeablePeriod,
          isChargeable: !isChargeExpired,
        });
      }
    },
    [
      chargeablePeriod,
      chargedSubs,
      expireTime,
      isBc,
      isChargeExpired,
      isCharged,
      navigation,
      onPressUsage,
    ],
  );

  const renderSwitch = useCallback(() => {
    return (
      <AppSwitch
        style={{marginRight: 10}}
        value={showSubs}
        onPress={async () => {
          const {
            payload: {result},
          } = await action.order.updateSubsInfo({
            token: token!,
            uuid: mainSubs.uuid,
            hide: !mainSubs.hide,
          });
          if (result === 0) setShowSubs((pre) => !pre);
        }}
        waitFor={1000}
        width={40}
      />
    );
  }, [action.order, mainSubs.hide, mainSubs.uuid, showSubs, token]);

  const title = useCallback(() => {
    const country = mainSubs.prodName?.split(' ')?.[0];
    return (
      <View
        style={notCardInfo ? styles.infoRadiusBorderTop : styles.infoCardTop}>
        {isDraft && (
          <View style={styles.draftFrame}>
            <AppText style={styles.drafting}>{i18n.t('esim:reserved')}</AppText>
          </View>
        )}
        <Pressable
          style={styles.prodTitle}
          onPress={() => {
            if (isDraft) return;

            if (notCardInfo) {
              setShowMoreInfo((prev) => !prev);
              flatListRef?.current?.scrollToIndex({index, animated: true});
            }
          }}>
          {isEditMode
            ? renderSwitch()
            : mainSubs.flagImage !== '' && (
                <Image
                  source={{uri: API.default.httpImageUrl(mainSubs.flagImage)}}
                  style={{width: 40, height: 40, marginRight: 20}}
                />
              )}
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
            // R 발송중인 상태에선 상품 발송중 표시

            !isDraft && (
              <View style={styles.arrow}>
                <AppSvgIcon name={showMoreInfo ? 'topArrow' : 'bottomArrow'} />
              </View>
            )
          )}
        </Pressable>
      </View>
    );
  }, [
    mainSubs,
    notCardInfo,
    isEditMode,
    renderSwitch,
    token,
    action,
    expired,
    isCharged,
    isDraft,
    showMoreInfo,
    flatListRef,
    index,
  ]);

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
          )} - ${utils.toDateString(expireTime, 'YYYY.MM.DD')}`}</AppText>
        </View>
        {!isBc && (
          <View style={styles.inactiveContainer}>
            <AppText style={styles.normal14Gray}>
              {i18n.t('esim:rechargeablePeriod')}
            </AppText>
            <AppText style={styles.normal14Gray}>{chargeablePeriod}</AppText>
          </View>
        )}
      </View>
    );
  }, [
    chargeablePeriod,
    expireTime,
    isBc,
    mainSubs.purchaseDate,
    mainSubs.subsIccid,
    mainSubs.type,
    notCardInfo,
  ]);

  const QRnCopyInfo = useCallback(() => {
    return (
      <View style={styles.activeBottomBox}>
        <AppSvgIcon
          name="prodInfo"
          style={styles.btn}
          title={i18n.t('esim:prodInfo')}
          titleStyle={styles.btnTitle}
          onPress={() => {
            const prod = product.prodList.get(mainSubs?.prodId || '0');
            if (prod)
              navigation.navigate('ProductDetail', {
                title: prod.name,
                item: API.Product.toPurchaseItem(prod),
                uuid: prod.uuid,
                desc: prod.desc,
              });
          }}
        />

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
      </View>
    );
  }, [
    isCharged,
    mainSubs,
    navigation,
    onPressRecharge,
    onPressUsage,
    product.prodList,
    setShowModal,
  ]);

  const renderHkBtn = useCallback(() => {
    if (
      !expired &&
      mainSubs.giftStatusCd !== 'S' &&
      mainSubs.noticeOption?.includes('H')
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
    const moveBtnList = [sendable, isCharged || !isBc].filter((elm) => elm);
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
              style={[
                styles.btnMove,
                {marginRight: !isLast ? 12 : 0},
                isSendBtn ? {} : {position: 'relative'},
              ]}>
              {!isSendBtn && !isCharged && (
                <>
                  <AppSvgIcon name="speechBubble" style={styles.newIcon} />
                  <AppText style={styles.newText}>{i18n.t('new')}</AppText>
                </>
              )}

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
  }, [isBc, isCharged, mainSubs, navigation, onPressRecharge, sendable]);

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
      {title()}
      <View
        pointerEvents={isEditMode ? 'none' : 'auto'}
        style={{opacity: isEditMode ? 0.6 : 1}}>
        <View
          style={
            notCardInfo ? styles.infoRadiusBorderBottom : styles.infoCardBottom
          }>
          {isDraft ? <View /> : notCardInfo ? QRnCopyInfo() : topInfo()}
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
      </View>
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

export default connect(
  ({account, product}: RootState) => ({
    account,
    product,
  }),
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
    },
  }),
)(EsimSubs);
