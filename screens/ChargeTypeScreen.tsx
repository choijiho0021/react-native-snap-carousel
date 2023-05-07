import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import moment from 'moment';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import AppBackButton from '@/components/AppBackButton';
import i18n from '@/utils/i18n';
import ChargeTypeButton from './EsimScreen/components/ChargeTypeButton';
import {API} from '@/redux/api';
import {RkbSubscription} from '@/redux/api/subscriptionApi';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    // alignItems: 'stretch',
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
  const [status, setStatus] = useState<StatusType>();
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
            today.isBetween(moment(b.activeTime), moment(b.expireTime)),
        );
        if (inUseItem) {
          if (chargedSubs) {
            setChargeableItem(
              chargedSubs.find((s) => s.subsOrderNo === inUseItem.orderID),
            );
          } else {
            setChargeableItem(mainSubs);
          }
          setStatus('using');
          return;
        }

        // 사용 전 상품이 있는지 체크
        if (bundles.find((b) => b.status === 1)) {
          setStatus('unUsed');
          return;
        }

        // 사용 완료
        setStatus('expired');
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
          return;
        }
        // 사용 전
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
    console.log('@@@@ partner, status', mainSubs.partner, status);
  }, [mainSubs.partner, status]);

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
            } else if (status && status !== 'expired') {
              navigation.navigate('AddOn', {
                mainSubs,
                chargeablePeriod,
                status,
              });
            }
          }}
          disabled={
            (t === 'addOn' && status === 'expired') ||
            (t === 'extension' &&
              (mainSubs.partner === 'quadcell' || !isChargeable))
          }
        />
      ))}
    </SafeAreaView>
  );
};

export default ChargeTypeScreen;
