import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import moment, {Moment} from 'moment';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import AppBackButton from '@/components/AppBackButton';
import i18n from '@/utils/i18n';
import ChargeTypeButton from './EsimScreen/components/ChargeTypeButton';
import {API} from '@/redux/api';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import AppActivityIndicator from '@/components/AppActivityIndicator';

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
  const {mainSubs, chargeablePeriod, chargedSubs, isChargeable} = params || {};
  const [chargeableItem, setChargeableItem] = useState<RkbSubscription>();
  const [addonEnabled, setAddonEnable] = useState(false);
  const [expireTime, setExpireTime] = useState<Moment>();
  const [status, setStatus] = useState<StatusType>();
  const [loading, setLoading] = useState(false);
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
        setLoading(true);
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
        setLoading(false);
      }
    },
    [chargedSubs, mainSubs],
  );

  const checkQuadcellStatus = useCallback(async (item: RkbSubscription) => {
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
          setStatus('using');
          setAddonEnable(true);
          return;
        }
        // 사용 전
        setAddonEnable(true);
        setStatus('unUsed');
      }
    }
  }, []);

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
  }, [checkCmiStatus, checkQuadcellStatus, mainSubs]);

  useEffect(() => {
    console.log('@@@@', mainSubs.partner, mainSubs.daily, status);
  }, [mainSubs.daily, mainSubs.partner, status]);

  return (
    <SafeAreaView style={styles.container}>
      {['addOn', 'extension'].map((t) => (
        <ChargeTypeButton
          key={t}
          type={t}
          onPress={() => {
            if (t === 'extension') {
              navigation.navigate('Charge', {
                mainSubs: chargeableItem || mainSubs,
                chargeablePeriod,
              });
            } else if (addonEnabled) {
              // } else {
              navigation.navigate('AddOn', {
                mainSubs,
                status,
                expireTime,
              });
            }
          }}
          disabled={
            (t === 'addOn' && !addonEnabled) ||
            (t === 'extension' &&
              (mainSubs.partner === 'quadcell' || !isChargeable))
          }
        />
      ))}
      <AppActivityIndicator visible={loading} />
    </SafeAreaView>
  );
};

export default ChargeTypeScreen;
