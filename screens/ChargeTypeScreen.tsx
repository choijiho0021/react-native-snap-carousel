import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Image} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import moment, {Moment} from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import {connect, useDispatch} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
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
import {AccountModelState} from '@/redux/modules/account';

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
  account: AccountModelState;
};

export const RESULT_OVER_LIMIT = 1;

const ChargeTypeScreen: React.FC<ChargeTypeScreenProps> = ({
  navigation,
  route: {params},
  account,
}) => {
  const [showSnackBar, setShowSnackBar] = useState<{
    text: string;
    visible: boolean;
    type: string;
  }>({text: '', visible: false, type: ''});
  const {mainSubs, chargeablePeriod, isChargeable} = params || {};
  const [chargeableItem, setChargeableItem] = useState<RkbSubscription>();
  const [statusLoading, setStatusLoading] = useState(false);
  const [addonLoading, setAddonLoading] = useState(false);
  const [addonEnable, setAddonEnable] = useState(false);
  const [remainDays, setRemainDays] = useState(0);
  const [expireTime, setExpireTime] = useState<Moment>();
  const [status, setStatus] = useState<UsageStatusType>();
  const [addOnDisReasonText, setAddOnDisReasonText] = useState('');
  const [extensionDisReason, setExtensionDisReason] = useState('');
  const [addonProds, setAddonProds] = useState<RkbAddOnProd[]>([]);
  const [chargeLoading, setChargeLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const extensionEnable = useRef(false);
  const extensionExpireCheck = extensionEnable.current && isChargeable;

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
    async (item: RkbSubscription, chargeSubsParam?: RkbSubscription[]) => {
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
        switch (rspStatus.statusCd) {
          // 사용 전
          case 'R':
            setStatus('R');
            break;
          // 사용중
          // 여기서 처리하는데, ChargeTypeScreen 빼고는 mainSubs 고정이다.
          // ChargeTypeScreen 코드를 빼서 여기로 옮길 것
          case 'A':
            setExpireTime(moment(rspStatus.endTime));

            if (extensionEnable.current) {
              if (chargeSubsParam) {
                const i = chargeSubsParam.find((s) => {
                  return s.subsOrderNo === rspStatus?.orderId;
                });

                setChargeableItem(i);
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
        setAddOnDisReasonText(i18n.t(`esim:chargeType:addOn:`));

        setAddonEnable(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (mainSubs) {
      const {iccid, token} = account;
      if (iccid && token && (mainSubs.cnt || 0 > 1)) {
        setChargeLoading(true);
        API.Subscription.getSubscription({
          iccid,
          token,
          uuid: mainSubs.subsIccid,
        }).then((rsp) => {
          setChargeLoading(false);
          const chargeSubs = (rsp?.objects as RkbSubscription[]).filter(
            (r) => r?.type === 'esim_product', // 일반 구매, 연장 상품은 esim_product
          ) || [mainSubs];
          checkStatus(mainSubs, chargeSubs);
        });
      } else checkStatus(mainSubs);
    }
  }, [account, checkStatus, mainSubs]);

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
    if (!extensionEnable.current) {
      if (!isChargeable) {
        setExtensionDisReason('expired');
        return;
      }
      setExtensionDisReason('unsupported');
    }
  }, [isChargeable]);

  const getAddOnProduct = useCallback(async () => {
    setAddonLoading(true);
    const subs = chargeableItem || mainSubs;

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
        links,
      }: {
        result: number;
        objects: RkbAddOnProd[];
        info?: {charge: string; msg: {kr: string}};
        links?: {charge: string; msg: {kr: string}};
      } = rsp;

      if (info?.charge === 'N' || links?.charge === 'N') {
        setAddOnDisReasonText(info?.msg?.kr || links?.msg?.kr);
        setAddonEnable(false);
      } else if (result === 0 || result === 1) {
        if ((objects?.length || 0) < 1) {
          // 상품 없음
          setAddonEnable(false);
          setAddOnDisReasonText(i18n.t(`esim:chargeType:addOn:noProd`));
        } else {
          setAddonEnable(true);
          setAddonProds(objects);
        }
      } else {
        setAddonEnable(false);
        setAddOnDisReasonText(i18n.t(`esim:chargeType:addOn:`));
      }

      // 모종의 이유로 실패, 모든 분기 진입 못할 시 '잠시 후 다시 시도해주세요' 출력
    }
    setAddonLoading(false);
  }, [chargeableItem, mainSubs, remainDays, status]);

  const unsupportExtension = useCallback(() => {
    extensionEnable.current = false;
    setAddOnDisReasonText(i18n.t(`esim:chargeType:addOn:unsupported`));
  }, []);

  const unsupportAddon = useCallback(() => {
    setAddonEnable(false);
    setAddOnDisReasonText(i18n.t(`esim:chargeType:addOn:unsupported`));
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
      extensionEnable.current = true;
    }
    if (addOnOption === AddOnOptionType.EXTENSTION) {
      extensionEnable.current = true;
      unsupportAddon();
      return;
    }
    if (addOnOption === AddOnOptionType.NEVER || !addOnOption) {
      unsupportExtension();
      unsupportAddon();
      return;
    }

    if (status) {
      // // 충전 조건 2. 사용 전, 용량 충전 가능한 상품 처리
      if (status === 'R' && mainSubs.partner?.startsWith('cmi')) {
        setAddonEnable(false);
        setAddOnDisReasonText(i18n.t(`esim:chargeType:addOn:reserved`));
        return;
      }

      // // 충전 조건 3. 모든 사용완료 상품은 충전 불가
      if (status === 'U') {
        setAddonEnable(false);
        setAddOnDisReasonText(i18n.t(`esim:chargeType:addOn:used`));
        return;
      }

      getAddOnProduct();
    }
  }, [getAddOnProduct, mainSubs, status, unsupportAddon, unsupportExtension]);

  const renderChargeModal = useCallback((type: 'addOn' | 'extension', onPress, disabed, reason) => {
    dispatch(
      modalActions.renderModal(() => (
        <ChargeTypeModal
          type={type}
          onPress={onPress}
          disabled={disabed}
          disReason={reason}
        />
      )),
    );
  } , [])

  // 연장하기
  const onPressExtension = useCallback(async () => {
    if (extensionExpireCheck) {
      const checked = await AsyncStorage.getItem(
        'esim.charge.extension.modal.check',
      );
      if (checked !== 'checked') {
        AsyncStorage.setItem(
          'esim.charge.extension.modal.check',
          'checked',
        );

        renderChargeModal('extension', onPressExtension, !extensionExpireCheck, extensionDisReason)

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

    // 이따 노트북 받고 적용
  }, [])

  const onPressAddon = useCallback(
    async () => {
        if (addonEnable) {
        const checked = await AsyncStorage.getItem(
          'esim.charge.addon.modal.check',
        );
        if (checked !== 'checked') {
          AsyncStorage.setItem('esim.charge.addon.modal.check', 'checked');
          renderChargeModal('addOn', onPressAddon, !addonEnable, addOnDisReasonText)
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
          text: addOnDisReasonText,
          visible: true,
          type: 'addOn',
        });
      }
    },
    [
      addOnDisReasonText,
      addonEnable,
      addonProds,
      chargeableItem,
      dispatch,
      expireTime,
      extensionDisReason,
      mainSubs,
      navigation,
      status,
    ],
  ); 

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={i18n.t('esim:charge')} />

      <AppActivityIndicator
        visible={statusLoading || addonLoading || chargeLoading}
      />
      <ScrollView style={{flex: 1}}>
        <View style={styles.top}>
          <AppText style={styles.topText}>{i18n.t('esim:charge:type')}</AppText>
          <Image
            style={{marginTop: 14}}
            source={require('@/assets/images/esim/chargeType.png')}
            resizeMode="stretch"
          />
        </View>
           <ChargeTypeButton
           type="addOn"
            key="addOn:button"
            title={i18n.t(`esim:charge:type:$addOn:detail`)}
            onPress={() => onPressAddon}
            disabled={!addonEnable}
            disReason={addOnDisReasonText}
          />
           <ChargeTypeButton
           type="extension"
            key="extension:button"
            title={i18n.t(`esim:charge:type:$addOn:extesion`)}
            onPress={() => onPressExtension}
            disabled={!extensionExpireCheck}
            disReason={extensionDisReason}
          />
        <AppSnackBar
          visible={showSnackBar.visible}
          onClose={() => setShowSnackBar((pre) => ({...pre, visible: false}))}
          textMessage={showSnackBar.text}
          bottom={20}
          preIcon={
            (showSnackBar.type === 'addOn' && addOnDisReasonText === '') ||
            (showSnackBar.type === 'extension' && extensionDisReason === '')
              ? undefined
              : 'cautionRed'
          }
        />     
      </ScrollView>
    </SafeAreaView>
  );
};

export default connect(({account}: RootState) => ({account}))(ChargeTypeScreen);
