import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
import api from '@/redux/api/api';
import {utils} from '@/utils/utils';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
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

export type RefSubsType = {
  expireTime: string;
  id: string;
  orderId: string;
  status: string;
};

type ChargeTypeScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ChargeType'
>;

type ChargeTypeScreenProps = {
  navigation: ChargeTypeScreenNavigationProp;
  route: RouteProp<HomeStackParamList, 'ChargeType'>;
  account: AccountModelState;
};

export const EXCEED_CHARGE_QUADCELL_RSP = 1;

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
  const [addonLoading, setAddonLoading] = useState(false);
  const [addonEnable, setAddonEnable] = useState(false);
  const [expireTime, setExpireTime] = useState<Moment>();
  const [status, setStatus] = useState<UsageStatusType>();
  const [addOnDisReason, setAddOnDisReason] = useState('');
  const [addonProds, setAddonProds] = useState<RkbAddOnProd[]>([]);
  const dispatch = useDispatch();
  const extensionEnable = useRef(false);
  const extensionExpireCheck = extensionEnable.current && isChargeable;
  const extensionDisReason = useMemo(() => {
    if (!extensionEnable.current) {
      if (!isChargeable) {
        return i18n.t('esim:charge:disReason:extension:expired');
      }
      return i18n.t('esim:charge:disReason:extension:unsupported');
    }
    return '';
  }, [isChargeable]);

  const unsupportExtension = useCallback(() => {
    extensionEnable.current = false;
    setAddOnDisReason(i18n.t(`esim:chargeType:addOn:unsupported`));
  }, []);

  const unsupportAddon = useCallback(() => {
    setAddonEnable(false);
    setAddOnDisReason(i18n.t(`esim:chargeType:addOn:unsupported`));
  }, []);

  const checkChargeOption = useCallback(
    (sub: RkbSubscription) => {
      const {addOnOption} = sub;

      if (addOnOption === AddOnOptionType.NEVER || !addOnOption) {
        unsupportExtension();
        unsupportAddon();
      } else if (addOnOption === AddOnOptionType.ADD_ON) {
        setAddonEnable(true);
        unsupportExtension();
      } else if (addOnOption === AddOnOptionType.BOTH) {
        setAddonEnable(true);
        extensionEnable.current = true;
      } else if (addOnOption === AddOnOptionType.EXTENSTION) {
        extensionEnable.current = true;
        unsupportAddon();
      }
    },
    [unsupportAddon, unsupportExtension],
  );

  const getAddOnProduct = useCallback(async () => {
    setAddonLoading(true);
    const subs = mainSubs;

    if (subs.nid) {
      const rsp = await API.Product.getAddOnProduct(subs.nid);

      const {
        result,
        objects,
        links,
      }: {
        result: number;
        objects: RkbAddOnProd[];
        links?: {
          charge: string;
          msg: {kr: string};
          refSubs: RefSubsType;
        };
      } = rsp;

      // console.log('@@@ result : ', result);
      // console.log('@@@ objects : ', objects);
      // console.log('@@@ links : ', links);

      // console.log('@@@ params?.chargedSubs : ', params?.chargedSubs);

      // 조건 변경 무조건 chargedSubs 조회하고, ChargeOption 확인
      if (
        result === 0 ||
        result === api.E_INVALID_STATUS ||
        result === EXCEED_CHARGE_QUADCELL_RSP
      ) {
        let chargedItem;

        if (mainSubs.partner?.startsWith('quadcell')) chargedItem = mainSubs;
        else if (params?.chargedSubs) {
          chargedItem = params?.chargedSubs?.find(
            (r) => r.nid === links?.refSubs.id,
          );
        } else
          chargedItem =
            mainSubs.nid === links?.refSubs.id ? mainSubs : undefined;

        if (!chargedItem || !links?.refSubs) {
          setAddOnDisReason(i18n.t(`esim:chargeType:addOn:`));
          extensionEnable.current = false;
          setAddonEnable(false);
          setAddonLoading(false);
          return;
        }

        const statusCd = links.refSubs.status;
        const endTime = links.refSubs.expireTime;

        checkChargeOption(chargedItem);

        setExpireTime(moment(endTime));
        setStatus(statusCd);
        setAddonProds(objects);
        setChargeableItem(chargedItem);

        if (links?.charge === 'N') {
          setAddOnDisReason(links?.msg?.kr);
          setAddonEnable(false);
        }
      } else {
        setAddOnDisReason(i18n.t(`esim:chargeType:addOn:`));
        extensionEnable.current = false;
      }

      // 모종의 이유로 실패, 모든 분기 진입 못할 시 '잠시 후 다시 시도해주세요' 출력
    }
    setAddonLoading(false);
  }, [checkChargeOption, mainSubs, params?.chargedSubs]);

  // 상품 비활성화 여부 체크하는 로직
  useEffect(() => {
    if (mainSubs) getAddOnProduct();
  }, [getAddOnProduct, mainSubs]);

  const renderChargeModal = useCallback(
    (type: 'addOn' | 'extension', onPress, disabed, reason) => {
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
    },
    [dispatch],
  );

  // 연장하기
  const onPressExtension = useCallback(async () => {
    if (extensionExpireCheck && chargeableItem) {
      const checked = await AsyncStorage.getItem(
        'esim.charge.extension.modal.check',
      );

      if (checked !== 'checked') {
        AsyncStorage.setItem('esim.charge.extension.modal.check', 'checked');

        renderChargeModal(
          'extension',
          onPressExtension,
          !extensionExpireCheck,
          extensionDisReason,
        );
      } else {
        navigation.navigate('Charge', {
          chargeableItem,
          chargeablePeriod:
            utils.toDateString(chargeableItem?.expireDate, 'YYYY.MM.DD') ||
            chargeablePeriod,
        });
      }
    } else {
      extensionEnable.current = false;
      setShowSnackBar({
        text: extensionDisReason,
        visible: true,
        type: 'extension',
      });
    }
  }, [
    chargeableItem,
    chargeablePeriod,
    extensionDisReason,
    extensionExpireCheck,
    navigation,
    renderChargeModal,
  ]);

  const onPressAddon = useCallback(async () => {
    if (addonEnable && chargeableItem) {
      const checked = await AsyncStorage.getItem(
        'esim.charge.addon.modal.check',
      );
      if (checked !== 'checked') {
        AsyncStorage.setItem('esim.charge.addon.modal.check', 'checked');
        renderChargeModal('addOn', onPressAddon, !addonEnable, addOnDisReason);
      } else {
        navigation.navigate('AddOn', {
          chargeableItem,
          status,
          expireTime,
          addonProds,
        });
      }
    } else {
      setAddonEnable(false);
      setShowSnackBar({
        text:
          addOnDisReason === ''
            ? i18n.t('esim:charge:disReason:extension:')
            : addOnDisReason, // i18n.t('esim:charge:disReason:extension:'),
        visible: true,
        type: 'addOn',
      });
    }
  }, [
    addOnDisReason,
    addonEnable,
    addonProds,
    chargeableItem,
    expireTime,
    navigation,
    renderChargeModal,
    status,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={i18n.t('esim:charge')} />

      <AppActivityIndicator visible={addonLoading} />
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
          title={i18n.t(`esim:charge:type:addOn:detail`)}
          onPress={onPressAddon}
          disabled={!addonEnable}
          disReason={addOnDisReason}
        />
        <ChargeTypeButton
          type="extension"
          key="extension:button"
          title={i18n.t(`esim:charge:type:extension:detail`)}
          onPress={onPressExtension}
          disabled={!extensionExpireCheck}
          disReason={extensionDisReason}
        />
        <AppSnackBar
          visible={showSnackBar.visible}
          onClose={() => setShowSnackBar((pre) => ({...pre, visible: false}))}
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

export default connect(({account}: RootState) => ({account}))(ChargeTypeScreen);
