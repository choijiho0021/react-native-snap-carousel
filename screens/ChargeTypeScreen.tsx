import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Image} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import moment, {Moment} from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import AppBackButton from '@/components/AppBackButton';
import i18n from '@/utils/i18n';
import ChargeTypeButton from './EsimScreen/components/ChargeTypeButton';
import {API} from '@/redux/api';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';
import AppSnackBar from '@/components/AppSnackBar';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  headerTitle: {
    height: 56,
    marginRight: 8,
  },
  top: {
    marginTop: 50,
    paddingHorizontal: 20,
    marginBottom: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topText: {
    ...appStyles.bold24Text,
    lineHeight: 28,
  },
});

type CMIBundlesType = {
  createTime: string;
  activeTime: string;
  expireTime: string;
  endTime: string;
  orderID: string;
  status: number;
};

type StatusType = 'using' | 'unUsed' | 'expired' | undefined;

type ChargeTypeScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ChargeType'
>;

type ChargeTypeScreenProps = {
  navigation: ChargeTypeScreenNavigationProp;
  route: RouteProp<HomeStackParamList, 'ChargeType'>;
};

const ChargeTypeScreen: React.FC<ChargeTypeScreenProps> = ({
  navigation,
  route: {params},
}) => {
  const [showSnackBar, setShowSnackBar] = useState<{
    text: string;
    visible: boolean;
  }>({text: '', visible: false});
  const {mainSubs, chargeablePeriod, chargedSubs, isChargeable, addOnData} =
    params || {};
  const [chargeableItem, setChargeableItem] = useState<RkbSubscription>();
  const [addonEnable, setAddonEnable] = useState(false);
  const [expireTime, setExpireTime] = useState<Moment>();
  const [status, setStatus] = useState<StatusType>();
  const [addOnDisReason, setAddOnDisReasen] = useState('');
  const [extensionDisReason, setExtensionDisReason] = useState('');

  const extensionEnable = useMemo(
    () => mainSubs.partner?.toLowerCase() === 'cmi' && isChargeable,
    [isChargeable, mainSubs.partner],
  );
  const quadAddonOverLimited = useMemo(
    () =>
      mainSubs.partner?.toLowerCase() === 'quadcell' &&
      mainSubs.daily === 'daily' &&
      (addOnData?.length || 0) > 0,
    [addOnData?.length, mainSubs.daily, mainSubs.partner],
  );
  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <View style={styles.header}>
          <AppBackButton
            title={i18n.t('esim:charge')}
            style={styles.headerTitle}
          />
        </View>
      ),
    });
  }, [navigation]);

  const checkCmiStatus = useCallback(
    async (item: RkbSubscription) => {
      if (item?.subsIccid && item?.packageId) {
        const rsp = await API.Subscription.cmiGetSubsStatus({
          iccid: item?.subsIccid,
        });

        const today = moment();
        const {userDataBundles} = rsp.objects || {};

        const bundles: CMIBundlesType[] = userDataBundles
          .map((b) => ({
            createTime: b.createTime,
            activeTime: b.activeTime,
            expireTime: b.expireTime,
            endTime: b.endTime,
            orderID: b.orderID,
            status: b.status,
          }))
          .sort((a, b) => moment(a.createTime).diff(moment(b.createTime)));

        // 사용중인 상품이 있는지 체크
        const inUseItem = bundles.find(
          (b) =>
            b.status === 3 &&
            today.isBetween(
              moment(b.activeTime).add(9, 'h'),
              moment(b.expireTime).add(9, 'h'),
            ),
        );
        if (inUseItem) {
          setExpireTime(moment(inUseItem.expireTime).add(9, 'h'));
          if (chargedSubs) {
            const i = chargedSubs.find(
              (s) => s.subsOrderNo === inUseItem.orderID,
            );
            setChargeableItem(i);
            if (i?.daily === 'daily') setAddonEnable(true);
          } else {
            if (mainSubs.daily === 'daily') setAddonEnable(true);
            setChargeableItem(mainSubs);
          }
          setStatus('using');
          return;
        }

        // 사용 전 상품이 있는지 체크
        if (bundles.find((b) => b.status === 1)) {
          setAddonEnable(true);
          setStatus('unUsed');
          return;
        }

        // 사용 완료
        setStatus('expired');
      }
    },
    [chargedSubs, mainSubs],
  );

  const checkQuadcellStatus = useCallback(
    async (item: RkbSubscription) => {
      if (item?.imsi) {
        const status = await API.Subscription.quadcellGetData({
          imsi: item.imsi,
          key: 'packlist',
        });

        const dataPack = status.objects?.packList?.find(
          (elm) =>
            elm?.packOrderSn !== undefined && Number(elm?.packCode) <= 900000,
        );

        if (status.result === 0 && status.objects?.retCode === '000000') {
          const exp = moment(dataPack?.expTime, 'YYYYMMDDHHmmss').add(1, 'h');
          setExpireTime(exp);

          // 사용 완료
          if (!dataPack) {
            setStatus('expired');
            return;
          }
          if (dataPack?.effTime) {
            if (moment().isAfter(exp)) {
              // 사용 완료
              setStatus('expired');
              return;
            }
            // 사용 중
            if (quadAddonOverLimited) {
              setStatus('using');
              return;
            }
            setStatus('using');
            setAddonEnable(true);
            return;
          }
          // 사용 전
          if (quadAddonOverLimited) {
            setStatus('unUsed');
            return;
          }
          setAddonEnable(true);
          setStatus('unUsed');
        }
      }
    },
    [quadAddonOverLimited],
  );

  useEffect(() => {
    switch (mainSubs.partner) {
      case 'cmi':
        checkCmiStatus(mainSubs);
        break;
      case 'quadcell':
        checkQuadcellStatus(mainSubs);
        break;
      default:
        break;
    }
  }, [addOnData?.length, checkCmiStatus, checkQuadcellStatus, mainSubs]);

  useEffect(() => {
    if (!extensionEnable) {
      if (!isChargeable) {
        setExtensionDisReason('expired');
        return;
      }
      setExtensionDisReason('unsupported');
    }
  }, [extensionEnable, isChargeable, mainSubs.partner]);

  useEffect(() => {
    if (!addonEnable) {
      // 쿼드셀 무제한 상품 1회 충전 제한
      if (quadAddonOverLimited) {
        setAddOnDisReasen('overLimit');
        return;
      }
      if (status === 'expired') {
        setAddOnDisReasen('used');
        return;
      }
      if (
        mainSubs.partner?.toLowerCase() === 'billionconnect' ||
        (mainSubs.partner?.toLowerCase() === 'cmi' &&
          mainSubs.daily === 'total')
      ) {
        setAddOnDisReasen('unsupported');
        return;
      }
      setAddOnDisReasen('noProd');
    }
  }, [
    addOnData,
    addonEnable,
    mainSubs.daily,
    mainSubs.partner,
    quadAddonOverLimited,
    status,
  ]);

  const onPress = useCallback(
    (type: string) => {
      if (type === 'extension') {
        if (extensionEnable)
          navigation.navigate('Charge', {
            mainSubs: chargeableItem || mainSubs,
            chargeablePeriod,
          });
        else {
          setShowSnackBar({
            text: i18n.t(
              `esim:charge:snackBar:extension:${extensionDisReason}`,
            ),
            visible: true,
          });
        }
      } else if (addonEnable) {
        navigation.navigate('AddOn', {
          mainSubs,
          status,
          expireTime,
        });
      } else {
        setShowSnackBar({
          text: i18n.t(`esim:charge:snackBar:addOn:${addOnDisReason}`),
          visible: true,
        });
      }
    },
    [
      addOnDisReason,
      addonEnable,
      chargeableItem,
      chargeablePeriod,
      expireTime,
      extensionDisReason,
      extensionEnable,
      mainSubs,
      navigation,
      status,
    ],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{flex: 1}}>
        <View style={styles.top}>
          <AppText style={styles.topText}>{i18n.t('esim:charge:type')}</AppText>
          <Image
            style={{marginTop: 14}}
            source={require('@/assets/images/esim/chargeType.png')}
            resizeMode="stretch"
          />
        </View>
        {['addOn', 'extension'].map((t) => (
          <ChargeTypeButton
            key={t}
            type={t}
            onPress={() => onPress(t)}
            disabled={
              (t === 'addOn' && !addonEnable) ||
              (t === 'extension' && !extensionEnable)
            }
            disReason={{addOn: addOnDisReason, extension: extensionDisReason}}
          />
        ))}
        <AppSnackBar
          visible={showSnackBar.visible}
          onClose={() =>
            setShowSnackBar((pre) => ({text: pre.text, visible: false}))
          }
          textMessage={showSnackBar.text}
          bottom={20}
          preIcon="cautionRed"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChargeTypeScreen;
