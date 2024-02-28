import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {appStyles} from '@/constants/Styles';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import {colors} from '@/constants/Colors';
import {HomeStackParamList, goBack} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {RkbOrder} from '@/redux/api/orderApi';
import {AccountModelState} from '@/redux/modules/account';
import {
  actions as orderActions,
  OrderAction,
  OrderModelState,
} from '@/redux/modules/order';
import {
  actions as productActions,
  ProductModelState,
} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import AppButton from '@/components/AppButton';
import AppSnackBar from '@/components/AppSnackBar';
import DatePickerModal from './component/DatePickerModal';
import UsDraftStep1 from './component/UsDraftStep1';
import UsDraftStep2, {UsDeviceInputType} from './component/UsDraftStep2';
import UsDraftStep3 from './component/UsDraftStep3';
import AppAlert from '@/components/AppAlert';
import api from '@/redux/api/api';
import AppSvgIcon from '@/components/AppSvgIcon';
import ScreenHeader from '@/components/ScreenHeader';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  button: {
    ...appStyles.normal16Text,
    flex: 1,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: colors.white,
  },
  btnCnter: {
    width: 40,
    height: 40,
    marginHorizontal: 18,
  },

  secondaryButton: {
    flex: 1,
    height: 52,
    backgroundColor: colors.white,
    borderColor: colors.lightGrey,

    borderTopWidth: 1,
  },
  secondaryButtonText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
  },
});

type DraftUsScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'DraftUs'
>;

type DraftUsScreenRouteProp = RouteProp<HomeStackParamList, 'Draft'>;

type DraftUsScreenProps = {
  navigation: DraftUsScreenNavigationProp;
  route: DraftUsScreenRouteProp;

  account: AccountModelState;
  product: ProductModelState;
  order: OrderModelState;
  pending: boolean;

  action: {
    order: OrderAction;
    modal: ModalAction;
  };
};

export type DeviceDataType = {
  eid: string;
  imei2: string;
};

const DraftUsScreen: React.FC<DraftUsScreenProps> = ({
  navigation,
  route,
  account: {iccid, token},
  action,
  order,
  pending,
}) => {
  const [draftOrder, setDraftOrder] = useState<RkbOrder>();
  const loading = useRef(false);
  const [showSnackBar, setShowSnackBar] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [step, setStep] = useState(0);
  const [actDate, setActDate] = useState('');
  const [checked, setChecked] = useState<boolean>(false);
  const [isClickButton, setIsClickButton] = useState(false);
  const [deviceInputType, setDeviceInputType] =
    useState<UsDeviceInputType>('none');

  const [deviceData, setDeviceData] = useState<DeviceDataType>({
    eid: '',
    imei2: '',
  });

  const disabled = useCallback(
    (isAlert: boolean) => {
      if (step === 1) {
        if (actDate === '') {
          if (isAlert) setShowSnackBar(i18n.t('us:validate:date'));
          return true;
        }
        if (deviceData.eid.length < 32 || deviceData.imei2.length < 15) {
          if (isAlert) setShowSnackBar(i18n.t('us:validate:device'));
          return true;
        }
      } else if (step === 2) {
        if (!checked) {
          if (isAlert) AppAlert.info(i18n.t('us:validate:checked'));
          return true;
        }
      }
      return false;
    },
    [actDate, deviceData, step, checked],
  );

  useEffect(() => {
    console.log('@@@ draftOrder : ', draftOrder);
  }, [draftOrder]);

  useEffect(() => {
    if (route?.params?.orderId)
      setDraftOrder(
        order.drafts.find((r) => r.orderId === route.params?.orderId) ||
          order.orders.get(route.params?.orderId),
      );
  }, [order.drafts, order.orders, route.params?.orderId]);

  const onClickStart = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const requestDraft = useCallback(() => {
    setIsClickButton(true);

    // 발권하기 API
    action.order
      .changeDraft({
        orderId: draftOrder?.orderId,
        eid: deviceData.eid,
        activation_date: `${actDate}T00:00:00`,
        imei2: deviceData.imei2,
        token,
      })
      .then((result) => {
        if (result?.payload?.result !== 0)
          AppAlert.info(
            [api.E_INVALID_PARAMETER, api.E_RESOURCE_NOT_FOUND].includes(
              result?.payload?.result,
            )
              ? result?.payload?.desc
              : '알 수 없는 오류로 발권에 실패했습니다.',
            '',
            () => {
              setStep(1);
              setIsClickButton(false);
              setChecked(false);
            },
          );
        else {
          action.order.subsReload({
            iccid: iccid!,
            token: token!,
            hidden: false,
          });
          navigation.navigate('DraftResult', {
            isSuccess: result?.payload?.result === 0,
          });
        }
      });
  }, [
    actDate,
    action.order,
    deviceData,
    draftOrder?.orderId,
    iccid,
    navigation,
    token,
  ]);

  const renderBottomBtn = useCallback(
    (onClick?: () => void) => {
      return (
        <View style={{flexDirection: 'row'}}>
          {step !== 0 && (
            <AppButton
              style={styles.secondaryButton}
              type="secondary"
              title={i18n.t('us:btn:back')}
              titleStyle={styles.secondaryButtonText}
              onPress={() => {
                setStep((prev) => (prev - 1 <= 0 ? 0 : prev - 1));
              }}
            />
          )}
          <AppButton
            style={styles.button}
            type="primary"
            title={i18n.t(step === 2 ? 'his:draftTitle' : 'us:btn:next')}
            disabled={disabled(false) || isClickButton}
            disabledOnPress={() => {
              disabled(true);
            }}
            disabledCanOnPress
            onPress={() => {
              console.log('onClick : ', onClick);
              if (onClick) {
                onClick();
              } else {
                setStep((prev) => (prev + 1 >= 2 ? 2 : prev + 1));
              }
            }}
          />
        </View>
      );
    },
    [disabled, step, isClickButton],
  );

  if (!draftOrder || !draftOrder?.orderItems) return <View />;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={i18n.t('his:draftTitle')}
        backHandler={() => {
          if (step === 0) goBack(navigation, route);
          else setStep((prev) => prev - 1);
        }}
        renderRight={
          step !== 0 && (
            <AppSvgIcon
              name="closeModal"
              style={styles.btnCnter}
              onPress={() => {
                goBack(navigation, route);
              }}
            />
          )
        }
      />
      {step === 0 && (
        <UsDraftStep1 draftOrder={draftOrder} onClick={onClickStart} />
      )}

      {step === 1 && (
        <>
          <UsDraftStep2
            actDate={actDate}
            setDateModalVisible={setShowPicker}
            deviceData={deviceData}
            setDeviceData={setDeviceData}
            deviceInputType={deviceInputType}
            setDeviceInputType={setDeviceInputType}
          />
          {renderBottomBtn(() => {
            setStep((prev) => (prev + 1 >= 2 ? 2 : prev + 1));
          })}
        </>
      )}

      {step === 2 && (
        <>
          <UsDraftStep3
            actDate={actDate}
            deviceData={deviceData}
            checked={checked}
            orderItems={draftOrder?.orderItems}
            setChecked={setChecked}
          />
          {renderBottomBtn(() => {
            requestDraft();
          })}
        </>
      )}

      <DatePickerModal
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        selected={actDate}
        onSelected={setActDate}
      />

      <AppSnackBar
        visible={showSnackBar !== ''}
        onClose={() => setShowSnackBar('')}
        textMessage={showSnackBar}
        bottom={70}
        hideCancel
      />
      <AppActivityIndicator visible={pending} />
    </SafeAreaView>
  );
};

export default connect(
  ({account, order}: RootState) => ({
    account,
    order,
    pending: false,
  }),
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
      product: bindActionCreators(productActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(DraftUsScreen);
