import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Image} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import moment, {Moment} from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch} from 'react-redux';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import AppBackButton from '@/components/AppBackButton';
import i18n from '@/utils/i18n';
import ChargeTypeButton from './EsimScreen/components/ChargeTypeButton';
import {API} from '@/redux/api';
import {AddOnOptionType, RkbSubscription} from '@/redux/api/subscriptionApi';
import {actions as modalActions} from '@/redux/modules/modal';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';
import AppSnackBar from '@/components/AppSnackBar';
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

export const RESULT_OVER_LIMIT = 1;

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

  const [extensionEnable, setExtensionEnable] = useState(false);
  const extensionExpireCheck = useMemo(
    () => extensionEnable && isChargeable,
    [extensionEnable, isChargeable],
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

  const checkStatus = useCallback(
    async (item: RkbSubscription) => {
      setStatusLoading(true);

      let rsp;
      if (item.partner?.startsWith('cmi') && item?.subsIccid) {
        rsp = await API.Subscription.cmiGetStatus({
          iccid: item?.subsIccid || '',
        });
      } else if (item.partner?.startsWith('quadcell') && item.imsi) {
        rsp = await API.Subscription.quadcellGetUsage({
          imsi: item.imsi,
          partner: item.partner,
          usage: 'n',
        });
      }

      setStatusLoading(false);

      if (rsp && rsp.result?.code === 0) {
        const rspStatus = rsp.objects[0]?.status;
        // const rspStatus = {statusCd: 'A'};

        switch (rspStatus.statusCd) {
          // 사용 전
          case 'R':
            setStatus('R');
            break;
          // 사용중
          case 'A':
            setExpireTime(moment(rspStatus.endTime));

            if (extensionEnable) {
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
      } else {
        setAddOnDisReasen('');
        setAddonEnable(false);
      }
    },
    [chargedSubs, extensionEnable, mainSubs],
  );

  useEffect(() => {
    // 남은 사용기간 구하기
    if (status === 'R' && mainSubs.prodDays) {
      setRemainDays(Number(mainSubs.prodDays));
    } else if (expireTime) {
      const today = moment();
      setRemainDays(
        Math.ceil(expireTime.diff(today, 'seconds') / (24 * 60 * 60)),
      );
    }
  }, [expireTime, mainSubs, status]);

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
  }, [extensionEnable, isChargeable]);

  const getAddOnProduct = useCallback(async () => {
    setAddonLoading(true);
    const subs = chargeableItem || mainSubs;

    // console.log('remainDays : ', remainDays);
    // console.log('subs.nid : ', subs.nid);
    // console.log('status : ', status);

    // console.log('상품별 필드 조회  : ', subs.addOnOption);
    // console.log('파트너사 : ', subs.partner);
    // console.log('기존 상태값 : ', status);

    if (subs.nid && status && remainDays && remainDays > 0) {
      const rsp = await API.Product.getAddOnProduct(
        subs.nid,
        subs.daily === 'daily' ? remainDays.toString() : '1',
        status,
      );

      const {
        result,
        objects,
        info,
      }: {
        result: number;
        objects: RkbAddOnProd[];
        info?: {charge: string; msg: {kr: string}};
      } = rsp;

      // console.log('충전 상품 있는 지 : ', objects);
      // console.log(
      //   '무제한/종량제 : ',
      //   subs.daily === 'daily' ? '무제한' : '종량제',
      // );

      // cmi 무제한 상품 전 상태, 다음 페이지에서 불가능 안내 -> 확인 완료

      if (info?.charge === 'N') {
        setAddOnDisReasen(info.msg.kr);
        setAddonEnable(false);
      } else if (result === 0) {
        // 왜 objects가 아니라 rsp.length? 확인 필요
        if ((rsp?.length || 0) < 1) {
          // 상품 없음
          setAddonEnable(false);
          setAddOnDisReasen('noProd');
        } else {
          setAddonEnable(true);
          setAddonProds(objects);
        }
      } else {
        setAddonEnable(false);
        setAddOnDisReasen('');
      }

      // 모종의 이유로 실패, 모든 분기 진입 못할 시 '잠시 후 다시 시도해주세요' 출력
    }
    setAddonLoading(false);
  }, [chargeableItem, mainSubs, remainDays, status]);

  const unsupportExtension = useCallback(() => {
    setExtensionEnable(false);
    setExtensionDisReason('unsupported');
  }, []);

  const unsupportAddon = useCallback(() => {
    setAddonEnable(false);
    setAddOnDisReasen('unsupported');
  }, []);

  // 상품 비활성화 여부 체크하는 로직
  useEffect(() => {
    const {addOnOption} = mainSubs;

    // 충전 조건 1. 용량 충전 불가능 상품
    if (addOnOption === AddOnOptionType.ADD_ON) {
      setAddonEnable(true);
      unsupportExtension();
    }
    if (addOnOption === AddOnOptionType.BOTH) {
      setAddonEnable(true);
      setExtensionEnable(true);
    }
    if (addOnOption === AddOnOptionType.EXTENSTION) {
      setExtensionEnable(true);
      unsupportAddon();
      return;
    }
    if (addOnOption === AddOnOptionType.NEVER) {
      unsupportExtension();
      unsupportAddon();
      return;
    }

    console.log('@@@@@ getStatus? : ', status);
    if (status) {
      // // 충전 조건 2. 사용 전, 용량 충전 가능한 상품 처리
      if (status === 'R' && mainSubs.partner?.startsWith('cmi')) {
        setAddonEnable(false);
        setAddOnDisReasen('reserved');
        return;
      }

      // // 충전 조건 3. 모든 사용완료 상품은 충전 불가
      if (status === 'U') {
        setAddonEnable(false);
        setAddOnDisReasen('used');
        return;
      }

      getAddOnProduct();
    }
  }, [getAddOnProduct, mainSubs, status, unsupportAddon, unsupportExtension]);

  const onPress = useCallback(
    async (type: string) => {
      if (type === 'extension') {
        if (extensionExpireCheck) {
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
                  disabled={!extensionExpireCheck}
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
      extensionExpireCheck,
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
              (t === 'extension' && !extensionExpireCheck)
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
