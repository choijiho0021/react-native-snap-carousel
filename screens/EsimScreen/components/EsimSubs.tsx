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
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {isPending} from '@reduxjs/toolkit';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {API} from '@/redux/api';
import {
  AddOnOptionType,
  isDisabled,
  RkbSubscription,
  STATUS_ACTIVE,
  STATUS_EXPIRED,
  STATUS_PENDING,
  STATUS_RESERVED,
} from '@/redux/api/subscriptionApi';
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
  isDraft,
  isHt,
} from '@/redux/modules/order';
import {AccountModelState} from '@/redux/modules/account';
import {HomeStackParamList} from '@/navigation/navigation';
import HowToCallModal from './HowToCallModal';
import HtQrModal from './HtQrModal';
import AppNotiBox from '@/components/AppNotiBox';
import Env from '@/environment';

const {isIOS} = Env.get();
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
    paddingTop: 6,
    paddingBottom: 24,
  },

  usageListContainer: {
    marginTop: 24,
    marginHorizontal: 20,
    paddingTop: 16,
    backgroundColor: colors.white,
  },
  infoCardTop: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  infoRadiusBorderTop: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  infoRadiusBorderTopDraft: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 0,
  },

  infoCardBottom: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  infoRadiusBorderBottom: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  giftButton: {
    flex: 1,
    flexDirection: 'row',
    height: 52,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderColor: colors.blue,
    borderRadius: 3,
  },
  chargeButton: {
    flex: 1,
    flexDirection: 'row',
    height: 52,
    backgroundColor: '#2a7ff6',
    borderColor: colors.whiteThree,
    borderRadius: 3,
  },
  prodTitle: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 0,
  },
  inactiveContainer: {
    marginBottom: 6,
    flexDirection: 'row',
    // alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  usageTitleNormal: {
    ...appStyles.normal16Text,
    fontSize: isDeviceSize('small') ? 18 : 20,
    lineHeight: isDeviceSize('small') ? 26 : 28,
    color: colors.warmGrey,
  },
  usageTitleBold: {
    ...appStyles.normal16Text,
    fontSize: isDeviceSize('small') ? 18 : 20,
    lineHeight: isDeviceSize('small') ? 26 : 28,
    fontWeight: 'bold',
  },
  reservedSubsTitle: {
    ...appStyles.normal16Text,
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
  },
  expiredText: {
    ...appStyles.extraBold12,
    height: 16,
    textAlign: 'center',
    color: colors.warmGrey,
  },
  expiredBg: {
    backgroundColor: colors.whiteThree,
    height: 20,
    borderRadius: 3,
    paddingLeft: 6,
    paddingRight: 6,
    marginTop: 4,
    justifyContent: 'center',
  },
  normal14Gray: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
  esimButton: {
    ...appStyles.bold14Text,
    lineHeight: 22,
  },
  btnTitle2: {
    ...appStyles.medium18,
    color: colors.white,
    paddingBottom: 2,
    lineHeight: 22,
  },
  sendBtn: {
    color: colors.blue,
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
    backgroundColor: colors.white,
    borderColor: colors.lightGrey,
    borderRadius: 3,
    borderWidth: 1,
  },
  redirectText: {
    ...appStyles.medium16,
    letterSpacing: 0,
    marginLeft: 8,
    color: colors.black,
  },
  redirectButtonText: {
    ...appStyles.medium16,
    letterSpacing: 0,
    marginRight: 5,
    color: colors.blue,
  },

  border: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.whiteFive,
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
    paddingBottom: 24,
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
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  draftFrame: {
    flexDirection: 'row',
    marginBottom: 12,
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
  greenText: {
    ...appStyles.medium16,
    color: colors.shamrock,
    lineHeight: 26,
    marginLeft: 6,
  },
  newIcon: {
    position: 'absolute',
    top: -9,
    zIndex: 20,
    alignSelf: 'center',
  },
  newText: {
    position: 'absolute',
    top: -7,
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

  notiBox: {
    alignItems: 'center',
    flexDirection: 'row',
    ...appStyles.normal14Text,
    backgroundColor: colors.backRed,
    borderRadius: 3,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 6,
  },
  htqr: {
    justifyContent: 'center',
    backgroundColor: colors.white,
    flexDirection: 'row',
    marginTop: 4,
  },
});

type EsimSubsNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'EsimSubs'
>;

type EsimSubsProps = {
  // navigation: EsimSubsNavigationProp;
  flatListRef?: MutableRefObject<FlatList<any> | undefined>;
  index: number;
  mainSubs: RkbSubscription;
  showDetail: boolean;
  isEditMode: boolean;
  onPressUsage: (
    subs: RkbSubscription,
    isChargeableParam?: boolean,
  ) => Promise<{usage: any; status: any}>;
  setShowUsageModal: (visible: boolean) => void;

  account: AccountModelState;
  product: ProductModelState;
  action: {
    order: OrderAction;
  };
};

const EsimSubs: React.FC<EsimSubsProps> = ({
  // navigation,
  flatListRef,
  index,
  mainSubs,
  showDetail = false,
  isEditMode = false,
  onPressUsage,
  setShowUsageModal,

  account: {token},
  product,
  action,
}) => {
  const [
    isht,
    isTypeDraft,
    isCharged,
    isBC,
    expired,
    failed,
    chargeablePeriod,
    notCardInfo,
    sendable,
    isChargeButton,
  ] = useMemo(() => {
    const now = moment();
    const checkHt = mainSubs.partner === 'ht';
    const expd = mainSubs.lastExpireDate?.isBefore(now) || false;
    const isFailed = mainSubs.statusCd === STATUS_EXPIRED;

    return [
      checkHt,
      isDraft(mainSubs?.statusCd),

      // mainSubs?.addOnOption 이 없는 경우도 NEVER
      (mainSubs.cnt || 0) > 1,
      mainSubs.partner === 'billionconnect',
      expd,
      isFailed,
      utils.toDateString(mainSubs.expireDate, 'YYYY.MM.DD'),
      !expd &&
        mainSubs.giftStatusCd !== 'S' &&
        mainSubs.type !== API.Subscription.CALL_PRODUCT &&
        !isFailed,
      !expd &&
        !mainSubs.giftStatusCd &&
        (mainSubs.cnt || 0) === 1 &&
        !isDraft(mainSubs?.statusCd),
      mainSubs?.addOnOption &&
        mainSubs.addOnOption !== AddOnOptionType.NEVER &&
        !(mainSubs.expireDate && mainSubs.expireDate.isBefore(now)),
    ];
  }, [mainSubs]);

  const cautionList: string[] = useMemo(
    () =>
      mainSubs.cautionList?.filter((c) => {
        const condition = c.includes(':') ? c.split(':')[0] : '';
        return (
          !condition.includes('web') &&
          (isIOS ? !condition.includes('android') : !condition.includes('ios'))
        );
      }) || [],
    [mainSubs.cautionList],
  );

  const [showMoreInfo, setShowMoreInfo] = useState(showDetail);
  const [showSubs, setShowSubs] = useState<boolean>(!mainSubs.hide);
  const [expiredModalVisible, setExpiredModalVisible] = useState(false);
  const [showHtcModal, setShowHtcModal] = useState<boolean>(false);
  const [showHtQrModal, setShowHtQrModal] = useState<boolean>(false);
  const navigation = useNavigation<EsimSubsNavigationProp>();

  useEffect(() => {
    if (showDetail) setShowMoreInfo(showDetail);
    else setShowMoreInfo(false);
  }, [isEditMode, showDetail]);

  useEffect(() => {
    if (isTypeDraft || !notCardInfo) setShowMoreInfo(false);
    else setShowMoreInfo(showDetail);
  }, [showDetail, isTypeDraft, notCardInfo]);

  const onPressRecharge = useCallback(
    (item: RkbSubscription) => {
      // 기존 사용하던 isChargeExpired는 isChargeButton에 포함됨

      if (isCharged) {
        navigation.navigate('ChargeHistory', {
          mainSubs: item,
          chargeablePeriod,
          isChargeable: isChargeButton || false,
        });
      }
      // isBC 대신 애드온 옵션으로 처리하기로 결정됨
      else if (!isBC)
        navigation.navigate('ChargeType', {
          mainSubs: item,
          chargeablePeriod,
          isChargeable: isChargeButton || false,
        });
    },
    [chargeablePeriod, isBC, isChargeButton, isCharged, navigation],
  );

  const renderSwitch = useCallback(() => {
    return (
      <AppSwitch
        style={{
          marginRight: 10,
          justifyContent: 'center',
        }}
        value={showSubs}
        isSmall
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
        style={
          notCardInfo
            ? isTypeDraft
              ? styles.infoRadiusBorderTopDraft
              : styles.infoRadiusBorderTop
            : styles.infoCardTop
        }>
        {isTypeDraft && (
          <View style={styles.draftFrame}>
            <AppText style={styles.drafting}>{i18n.t('esim:reserved')}</AppText>
          </View>
        )}

        <Pressable
          style={styles.prodTitle}
          onPress={() => {
            if (isTypeDraft || failed) return;

            if (notCardInfo) {
              setShowMoreInfo((prev) => !prev);
              flatListRef?.current?.scrollToIndex({index, animated: true});
            }
          }}>
          {isEditMode
            ? renderSwitch()
            : mainSubs.flagImage !== '' &&
              !expired &&
              mainSubs.giftStatusCd !== 'S' && (
                <Image
                  source={{uri: API.default.httpImageUrl(mainSubs.flagImage)}}
                  style={{
                    width: 40,
                    height: 30,
                    marginRight: 10,
                    alignSelf: 'center',
                  }}
                />
              )}
          <SplitText
            key={mainSubs.key}
            renderExpend={() =>
              !isDisabled(mainSubs) &&
              !isCharged &&
              renderPromoFlag({
                flags: mainSubs.promoFlag || [],
                isStore: mainSubs.isStore,
                storeName: mainSubs.storeName,
                storeOrderId: mainSubs.storeOrderId,
              })
            }
            style={[
              [STATUS_RESERVED, STATUS_PENDING, STATUS_ACTIVE].includes(
                mainSubs.statusCd,
              )
                ? styles.reservedSubsTitle
                : expired || mainSubs.giftStatusCd === 'S'
                ? styles.usageTitleNormal
                : styles.usageTitleBold,
              {
                alignSelf: 'center',
                marginRight: mainSubs.isStore ? 8 : 0,
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
              <AppText key={mainSubs.nid} style={styles.expiredText}>
                {mainSubs.giftStatusCd === 'S'
                  ? i18n.t('esim:S2')
                  : i18n.t(isHt(mainSubs) ? 'esim:expired:ht' : 'esim:expired')}
              </AppText>
            </View>
          ) : (
            // R 발송중인 상태에선 상품 발송중 표시
            !(isTypeDraft || failed) && (
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
    isTypeDraft,
    isEditMode,
    renderSwitch,
    expired,
    isCharged,
    showMoreInfo,
    failed,
    flatListRef,
    index,
  ]);

  const failNotiBox = useCallback(() => {
    return (
      failed && (
        <View>
          <AppNotiBox
            iconName="bannerWarning"
            containerStyle={styles.notiBox}
            backgroundColor={colors.backRed}
            textColor={colors.redError}
            text={i18n.t('esim:draft:failNoti')}
          />
        </View>
      )
    );
  }, [failed]);

  const topInfo = useCallback(() => {
    if (isht) {
      console.log('@@@@ mainSubs.statusCd = ', mainSubs.statusCd);

      return (
        <>
          {failNotiBox()}
          <View style={[styles.topInfo, !notCardInfo && {marginVertical: 16}]}>
            {mainSubs.type !== API.Subscription.CALL_PRODUCT && (
              <View style={styles.inactiveContainer}>
                <AppText style={{...styles.normal14Gray, fontWeight: '700'}}>
                  {i18n.t('eid')}
                </AppText>
                <AppText
                  style={[
                    styles.normal14Gray,
                    {marginLeft: 80, textAlign: 'right', flex: 1},
                  ]}>
                  {mainSubs.eid}
                </AppText>
              </View>
            )}
            <View style={styles.inactiveContainer}>
              <AppText style={{...styles.normal14Gray, fontWeight: '700'}}>
                {i18n.t('imei2:esim')}
              </AppText>
              <AppText style={styles.normal14Gray}>{mainSubs.imei2}</AppText>
            </View>

            {!isBC && (
              <View style={styles.inactiveContainer}>
                <AppText style={{...styles.normal14Gray, fontWeight: '700'}}>
                  {i18n.t('esim:activationDate')}
                </AppText>
                <AppText style={styles.normal14Gray}>
                  {mainSubs.activationDate?.format('YYYY.MM.DD')}
                </AppText>
              </View>
            )}
          </View>
        </>
      );
    }
    return (
      <>
        {failNotiBox()}
        <View style={[styles.topInfo, !notCardInfo && {marginVertical: 16}]}>
          {mainSubs.type !== API.Subscription.CALL_PRODUCT && (
            <View style={styles.inactiveContainer}>
              <AppText style={styles.normal14Gray}>
                {i18n.t('esim:iccid')}
              </AppText>
              <AppText style={styles.normal14Gray}>
                {mainSubs.subsIccid || '-'}
              </AppText>
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
              mainSubs?.lastExpireDate,
              'YYYY.MM.DD',
            )}`}</AppText>
          </View>

          {!isBC && (
            <View style={styles.inactiveContainer}>
              <AppText style={styles.normal14Gray}>
                {i18n.t('esim:rechargeablePeriod')}
              </AppText>
              <AppText style={styles.normal14Gray}>
                {chargeablePeriod || '-'}
              </AppText>
            </View>
          )}
        </View>
      </>
    );
  }, [
    isht,
    failNotiBox,
    notCardInfo,
    mainSubs.type,
    mainSubs.subsIccid,
    mainSubs.purchaseDate,
    mainSubs?.lastExpireDate,
    mainSubs.statusCd,
    mainSubs.eid,
    mainSubs.imei2,
    mainSubs.activationDate,
    isBC,
    chargeablePeriod,
  ]);

  const QRnCopyInfo = useCallback(() => {
    return (
      <View style={styles.activeBottomBox}>
        <AppButton
          style={{
            flex: 1,
            marginRight: 8,
            backgroundColor: isEditMode ? colors.backGrey : colors.gray4,
            paddingVertical: 8,
            borderRadius: 3,
          }}
          titleStyle={{
            ...styles.esimButton,
            color: isEditMode ? colors.lightGrey : colors.black,
          }}
          title={i18n.t('esim:prodInfo')}
          onPress={() => {
            const prod = product.prodList.get(mainSubs?.prodId || '0');
            const localOp = product.localOpList.get(prod?.partnerId || '0');

            if (prod)
              navigation.navigate('ProductDetail', {
                title: prod.name,
                item: API.Product.toPurchaseItem(prod),
                price: prod.price,
                listPrice: prod.listPrice,
                uuid: prod.uuid,
                desc: prod.desc,
                partner: mainSubs.partner,
                partnerId: prod.partnerId,
                img: localOp?.imageUrl,
                prod,
              });
          }}
        />

        {!isht && (
          <AppButton
            style={{
              flex: 1,
              backgroundColor: isEditMode ? colors.backGrey : colors.gray4,
              paddingVertical: 8,
              marginRight: 8,
              borderRadius: 3,
            }}
            titleStyle={{
              ...styles.esimButton,
              color: isEditMode ? colors.lightGrey : colors.black,
            }}
            title={i18n.t('esim:showQR')}
            onPress={() => navigation.navigate('QrInfo', {mainSubs})}
          />
        )}

        <AppButton
          style={{
            flex: 1,
            backgroundColor: isEditMode ? colors.backGrey : colors.gray4,
            paddingVertical: 8,
            borderRadius: 3,
          }}
          titleStyle={{
            ...styles.esimButton,
            color: isEditMode ? colors.lightGrey : colors.black,
          }}
          title={i18n.t('esim:checkUsage')}
          onPress={() => {
            if (isCharged) {
              onPressRecharge(mainSubs);
            } else {
              setShowUsageModal(true);
              onPressUsage(mainSubs, !isBC && isChargeButton);
            }
          }}
        />
      </View>
    );
  }, [
    isBC,
    isChargeButton,
    isCharged,
    isEditMode,
    isht,
    mainSubs,
    navigation,
    onPressRecharge,
    onPressUsage,
    product.localOpList,
    product.prodList,
    setShowUsageModal,
  ]);

  const renderHkBtn = useCallback(() => {
    const isSuccess = mainSubs.tag?.includes('HA');
    if (
      !expired &&
      mainSubs.giftStatusCd !== 'S' &&
      mainSubs.noticeOption?.includes('H')
    )
      return (
        <Pressable
          style={[
            styles.redirectHK,
            {
              backgroundColor: isSuccess ? colors.backGrey : colors.white,
            },
          ]}
          onPress={() =>
            navigation.navigate('RedirectHK', {
              iccid: mainSubs?.subsIccid!,
              orderNo: mainSubs?.subsOrderNo!,
              uuid: mainSubs?.uuid,
              imsi: mainSubs?.imsi!,
            })
          }>
          <View style={styles.row}>
            <AppSvgIcon name="redirectFlag" style={{marginTop: 1}} />
            <AppText style={styles.redirectText}>
              {i18n.t('esim:redirectHK2')}
            </AppText>
          </View>
          {isSuccess ? (
            <View style={[styles.row, {justifyContent: 'flex-end'}]}>
              <AppText style={styles.greenText}>
                {i18n.t('esim:redirectHK:done')}
              </AppText>
              <AppSvgIcon name="checkGreenSmall" />
            </View>
          ) : (
            <View style={[styles.row, {justifyContent: 'flex-end'}]}>
              <AppText style={styles.redirectButtonText}>
                {i18n.t('esim:redirectHK2:button')}
              </AppText>
              <AppSvgIcon name="bluePlus" />
            </View>
          )}
        </Pressable>
      );
    return null;
  }, [expired, mainSubs, navigation]);

  const renderHowToCall = useCallback(() => {
    const showHowModal =
      mainSubs?.clMtd &&
      ['ustotal', 'usdaily', 'ais', 'dtac', 'mvtotal'].includes(
        mainSubs?.clMtd,
      );
    if (showHowModal)
      return (
        <View>
          <Pressable
            style={[
              styles.redirectHK,
              {
                backgroundColor: colors.white,
              },
            ]}
            onPress={() => {
              if (mainSubs?.clMtd) setShowHtcModal(true);
            }}>
            <View style={styles.row}>
              <AppSvgIcon name="phone" style={{marginTop: 1}} />
              <AppText style={styles.redirectText}>
                {i18n.t('esim:howToCall')}
              </AppText>
            </View>

            <View style={[styles.row, {justifyContent: 'flex-end'}]}>
              <AppText style={styles.blueText}>
                {i18n.t('esim:howToCall:check')}
              </AppText>
              <AppSvgIcon name="rightBlueBracket" />
            </View>
          </Pressable>
        </View>
      );
    return null;
  }, [mainSubs?.clMtd]);

  const renderMvHtQr = useCallback(() => {
    if (mainSubs.daily === 'daily' && mainSubs.partner === 'ht')
      return (
        <Pressable
          style={styles.htqr}
          onPress={() => {
            setShowHtQrModal(true);
          }}>
          <AppText style={styles.drafting}>
            {i18n.t('esim:howToCall:moveToQr')}
          </AppText>
          <AppSvgIcon name="rightBlueBracket" style={{marginTop: 2}} />
        </Pressable>
      );

    return null;
  }, [mainSubs.daily, mainSubs.partner]);

  const renderMoveBtn = useCallback(() => {
    // 충전 버튼 출력 조건
    // 충전 내역 조회 -> 충전 내역이 있음
    // 상품별 충전 필드 조회 -> 용량 충전, 상품 연장이 1개 이상 Y인 경우
    // 충전 가능 기간 조회 -> 충전 가능 기간 내
    const moveBtnList = [
      sendable,
      isCharged || (!isBC && isChargeButton),
    ].filter((elm) => elm);

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
                titleStyle={[
                  styles.btnTitle2,
                  !isLast && styles.sendBtn,
                  isEditMode && {color: colors.greyish},
                ]}
                style={[
                  styles.chargeButton,
                  !isLast && styles.giftButton,
                  isEditMode && {
                    backgroundColor: !isLast ? colors.white : colors.lightGrey,
                    borderColor: colors.lightGrey,
                  },
                ]}
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
    isBC,
    isChargeButton,
    isCharged,
    isEditMode,
    mainSubs,
    navigation,
    onPressRecharge,
    sendable,
  ]);

  const renderCautionList = useCallback(
    (caution: string, idx: number, arr: string[]) => {
      const hasPreDot = arr.length > 1;
      const cautionText = caution.includes(':')
        ? caution.split(':')[1]
        : caution;
      return (
        <View
          key={cautionText}
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
          <AppText key={cautionText} style={styles.cautionText}>
            {cautionText}
          </AppText>
        </View>
      );
    },
    [],
  );

  return (
    <>
      <View
        style={[
          styles.usageListContainer,
          expired || mainSubs.giftStatusCd === 'S'
            ? styles.cardExpiredBg
            : isTypeDraft
            ? styles.border
            : styles.shadow,
          isTypeDraft && {paddingBottom: 16},
        ]}>
        {title()}
        <View
          pointerEvents={isEditMode ? 'none' : 'auto'}
          style={{opacity: isEditMode ? 0.6 : 1}}>
          <View
            style={
              notCardInfo
                ? {
                    ...styles.infoRadiusBorderBottom,
                    paddingTop: isTypeDraft ? 0 : 6,
                  }
                : styles.infoCardBottom
            }>
            {isTypeDraft ? <View /> : notCardInfo ? QRnCopyInfo() : topInfo()}
          </View>

          {showMoreInfo && (
            <View style={showMoreInfo && styles.moreInfoContent}>
              {topInfo()}

              {!!mainSubs.caution || (cautionList?.length || 0) > 0 ? (
                <View style={styles.cautionBox}>
                  <View style={styles.cautionRow}>
                    <AppSvgIcon name="cautionIcon" style={{marginRight: 12}} />
                    <AppText style={styles.cautionTitle}>
                      {i18n.t('esim:caution')}
                    </AppText>
                  </View>

                  <View>
                    {(cautionList || [])
                      .concat(mainSubs.caution || [])
                      ?.map(renderCautionList)}
                  </View>
                </View>
              ) : (
                <View style={{height: 30}} />
              )}

              {renderHkBtn()}

              {renderHowToCall()}

              {renderMvHtQr()}

              {!isht && renderMoveBtn()}
            </View>
          )}
        </View>

        {mainSubs?.clMtd && (
          <HowToCallModal
            visible={showHtcModal}
            clMtd={mainSubs?.clMtd}
            onOkClose={() => setShowHtcModal(false)}
          />
        )}

        <HtQrModal
          visible={showHtQrModal}
          onOkClose={() => setShowHtQrModal(false)}
        />

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
    </>
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
