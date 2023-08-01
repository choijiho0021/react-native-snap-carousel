import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Image} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import moment, {Moment} from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch} from 'react-redux';
import {async} from 'validate.js';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import AppBackButton from '@/components/AppBackButton';
import i18n from '@/utils/i18n';
import ChargeTypeButton from './EsimScreen/components/ChargeTypeButton';
import {API} from '@/redux/api';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import {actions as modalActions} from '@/redux/modules/modal';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';
import AppSnackBar from '@/components/AppSnackBar';
import {USAGE_TIME_INTERVAL} from './EsimScreen';
import {RkbAddOnProd} from '@/redux/api/productApi';
import ChargeTypeModal from './HomeScreen/component/ChargeTypeModal';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import ScreenHeader from '@/components/ScreenHeader';

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
    marginBottom: 27,
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

// A: 사용중
// R: 사용전
// U: 사용완료
export type UsageStatusType = 'A' | 'R' | 'U' | undefined;

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
    type: string;
  }>({text: '', visible: false, type: ''});
  const {mainSubs, chargeablePeriod, chargedSubs, isChargeable, addOnData} =
    params || {};
  const [chargeableItem, setChargeableItem] = useState<RkbSubscription>();
  const [statusLoading, setStatusLoading] = useState(false);
  const [addonLoading, setAddonLoading] = useState(false);
  const [addonEnable, setAddonEnable] = useState(false);
  const [remainDays, setRemainDays] = useState(0);
  const [expireTime, setExpireTime] = useState<Moment>();
  const [status, setStatus] = useState<UsageStatusType>();
  const [addOnDisReason, setAddOnDisReasen] = useState('');
  const [extensionDisReason, setExtensionDisReason] = useState('');
  const [addonProds, setAddonProds] = useState<RkbAddOnProd[]>([]);
  const dispatch = useDispatch();
  const extensionEnable = useMemo(
    () => mainSubs.partner === 'cmi' && isChargeable,
    [isChargeable, mainSubs.partner],
  );

  // 쿼드셀 무제한 상품의 경우 남은 기간 충전은 1회로 제한 됨
  const quadAddonOverLimited = useMemo(
    () =>
      mainSubs.partner === 'quadcell' &&
      mainSubs.daily === 'daily' &&
      addOnData?.find((a) => Number(a.prodDays) > 1),
    [addOnData, mainSubs],
  );

  const checkStatus = useCallback(async (item: RkbSubscription) => {
    setStatusLoading(true);
    let rsp;
    if (item.partner === 'cmi' && item?.subsIccid) {
      // CMI 종량제 addOn 미지원
      if (item.daily === 'total') {
        setStatusLoading(false);
        return;
      }
      rsp = await API.Subscription.cmiGetStatus({
        // iccid: item?.subsIccid || '',
        iccid: '89852342022011165627',
      });
    } else if (item.partner === 'quadcell' && item.imsi) {
      rsp = await API.Subscription.quadcellGetStatus({
        // imsi: item.imsi,
        imsi: '454070042547566',
      });
    }
    setStatusLoading(false);

    if (rsp && rsp.result.code === 0) {
      const rspStatus = rsp.objects[0]?.status;
      switch (rspStatus.statusCd) {
        // 사용 전
        case 'R':
          setStatus('R');
          break;
        // 사용중
        case 'A':
          setExpireTime(moment(rspStatus.endTime));
          if (item.partner === 'cmi') {
            if (chargedSubs) {
              const i = chargedSubs.find((s) => {
                return s.subsOrderNo === rspStatus?.orderId;
              });
              setChargeableItem(i);
            } else {
              setChargeableItem(mainSubs);
            }
          }
          setStatus('A');
          break;
        // 사용 완료
        case 'U':
          setStatus('U');
          break;
        default:
          break;
      }
    }
  }, []);

  useEffect(() => {
    if (mainSubs) checkStatus(mainSubs);
  }, [checkStatus, mainSubs]);

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
    // 남은 사용기간 구하기
    if (status === 'R' && mainSubs.prodDays) {
      setRemainDays(Number(mainSubs.prodDays));
    } else if (expireTime) {
      const today = moment();
      setRemainDays(Math.ceil(expireTime.diff(today, 'hours') / 24));
    }
  }, [expireTime, mainSubs, mainSubs.partner, status]);

  const getAddOnProduct = useCallback(async () => {
    setAddonLoading(true);
    if (mainSubs.nid && remainDays && remainDays > 0) {
      const data = await API.Product.getAddOnProduct(
        mainSubs.nid,
        mainSubs.daily === 'daily' ? remainDays.toString() : '1',
      );

      const rsp = data.objects;
      const remainDaysProd = rsp.filter((r) => r.days !== '1');

      if (rsp.length < 1) {
        // 상품 없음
        setAddonEnable(false);
        setAddOnDisReasen('noProd');
      } else if (
        // 남은 기간 충전에 대한 처리 건이 있으면 서버에서 하루 충전 상품만 내려줌
        // 사용전인 쿼드셀 무제한 상품의 경우 하루 충전은 지원하지 않음
        remainDaysProd.length < 1 &&
        mainSubs.partner === 'quadcell' &&
        status === 'R' &&
        mainSubs.daily === 'daily'
      ) {
        setAddonEnable(false);
        setAddOnDisReasen('overLimit');
      } else {
        setAddonEnable(true);
        setAddonProds(rsp);
      }
    }
    setAddonLoading(false);
  }, [mainSubs.daily, mainSubs.nid, mainSubs.partner, remainDays, status]);

  useEffect(() => {
    // BC 상품 및 cmi 종량제 상품 미지원
    if (
      mainSubs.partner === 'billionconnect' ||
      (mainSubs.partner === 'cmi' && mainSubs.daily === 'total')
    ) {
      setAddonEnable(false);
      setAddOnDisReasen('unsupported');
      return;
    }
    if (status) {
      // 모든 사용완료 상품은 충전 불가
      if (status === 'U') {
        setAddonEnable(false);
        setAddOnDisReasen('used');
        return;
      }

      // 쿼드셀 무제한상품 사용전 남은 기간 충전 이력이 있을 경우
      if (quadAddonOverLimited && status === 'R') {
        setAddonEnable(false);
        setAddOnDisReasen('overLimit');
        return;
      }

      // cmi 무제한 상품 사용전 상태에는 충전은 불가하지만 다음 페이지에로 넘어가서 해당 내용 안내
      if (
        status === 'R' &&
        mainSubs.partner === 'cmi' &&
        mainSubs.daily === 'daily'
      ) {
        setAddonEnable(true);
        return;
      }
      getAddOnProduct();
    }
  }, [
    getAddOnProduct,
    mainSubs.daily,
    mainSubs.partner,
    quadAddonOverLimited,
    status,
  ]);

  const onPress = useCallback(
    async (type: string) => {
      if (type === 'extension') {
        if (extensionEnable) {
          const checked = await AsyncStorage.getItem(
            'esim.charge.extension.modal.check',
          );
          if (checked !== 'checked') {
            AsyncStorage.setItem(
              'esim.charge.extension.modal.check',
              'checked',
            );
            dispatch(
              modalActions.renderModal(() => (
                <ChargeTypeModal
                  type={type}
                  onPress={() => onPress(type)}
                  disabled={!extensionEnable}
                  disReason={{
                    addOn: addOnDisReason,
                    extension: extensionDisReason,
                  }}
                />
              )),
            );
          } else {
            navigation.navigate('Charge', {
              mainSubs,
              chargeablePeriod,
            });
          }
        } else {
          setShowSnackBar({
            text: i18n.t(
              `esim:charge:disReason:extension:${extensionDisReason}`,
            ),
            visible: true,
            type: 'extension',
          });
        }
      } else if (addonEnable) {
        const checked = await AsyncStorage.getItem(
          'esim.charge.addon.modal.check',
        );
        if (checked !== 'checked') {
          AsyncStorage.setItem('esim.charge.addon.modal.check', 'checked');
          dispatch(
            modalActions.renderModal(() => (
              <ChargeTypeModal
                type={type}
                onPress={() => onPress(type)}
                disabled={!addonEnable}
                disReason={{
                  addOn: addOnDisReason,
                  extension: extensionDisReason,
                }}
              />
            )),
          );
        } else {
          navigation.navigate('AddOn', {
            mainSubs: chargeableItem || mainSubs,
            status,
            expireTime,
            addonProds,
          });
        }
      } else {
        setShowSnackBar({
          text: i18n.t(`esim:charge:disReason:addOn:${addOnDisReason}`),
          visible: true,
          type: 'addOn',
        });
      }
    },
    [
      addOnDisReason,
      addonEnable,
      addonProds,
      chargeableItem,
      chargeablePeriod,
      dispatch,
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
      <ScreenHeader title={i18n.t('esim:charge')} />

      <AppActivityIndicator visible={statusLoading || addonLoading} />
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
          preIcon={
            (showSnackBar.type === 'addOn' && addOnDisReason === '') ||
            (showSnackBar.type === 'extension' && extensionDisReason === '')
              ? undefined
              : 'cautionRed'
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChargeTypeScreen;
