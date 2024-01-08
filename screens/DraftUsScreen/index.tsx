import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {appStyles} from '@/constants/Styles';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import {HomeStackParamList, goBack, navigate} from '@/navigation/navigation';
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
import {Moment} from 'moment';
import moment from 'moment';
import DraftStartPage from './component/DraftStartPage';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppSnackBar from '@/components/AppSnackBar';
import DatePickerModal from './component/DatePickerModal';
import AppNotiBox from '@/components/AppNotiBox';

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

  modalText: {
    ...appStyles.semiBold16Text,
    lineHeight: 26,
    letterSpacing: -0.32,
    color: colors.black,
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

  DateBoxBtnFrame: {
    padding: 16,
    gap: 8,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

export type UsProdDesc = {
  title: string;
  field_description: string;
  promoFlag: string[];
  qty: number;
  activateDate: Moment;
  eid: string;
  imei2: string;
};

const DraftUsScreen: React.FC<DraftUsScreenProps> = ({
  navigation,
  route,
  account: {iccid, token},
  action,
  product,
  order,
  pending,
}) => {
  const [draftOrder, setDraftOrder] = useState<RkbOrder>();
  const [prods, setProds] = useState<UsProdDesc[]>([]);
  const loading = useRef(false);
  const [showSnackBar, setShowSnackBar] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [step, setStep] = useState(0);
  const [actDate, setActDate] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton
          title={i18n.t('his:draftTitle')}
          onPress={() => {
            if (step === 0) goBack(navigation, route);
            else setStep((prev) => prev - 1);
          }}
        />
      ),
    });
  }, [navigation, route, step]);

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

  //
  const getProdDate = useCallback(() => {
    if (!loading.current && draftOrder?.orderItems?.length > 0) {
      draftOrder?.orderItems?.forEach((i) => {
        if (!product.prodList.has(i.uuid)) {
          // 해당 Uuid로 없다면 서버에서 가져온다.
          action?.product.getProdByUuid(i.uuid);
          loading.current = true;
        }
      });
    }
  }, [action?.product, draftOrder?.orderItems, product.prodList]);

  useEffect(() => {
    if (!draftOrder?.orderItems) return;

    const prodList: UsProdDesc = draftOrder.orderItems.map((r) => {
      const prod = product.prodList.get(r.uuid);

      console.log('@@@@@ prod : ', prod);

      if (prod)
        return {
          title: prod.name,
          field_description: prod.field_description,
          promoFlag: prod.promoFlag,
          qty: r.qty,
          // test 임시 데이터
          eid: 'eid2',
          activateDate: moment(),
          imei2: 'imei2test',
        } as UsProdDesc;

      return null;
    });

    const isNeedUpdate = prodList.some((item) => item === null);

    if (isNeedUpdate) getProdDate();
    else setProds(prodList);
  }, [draftOrder?.orderItems, getProdDate, product.prodList]);

  const renderBottomBtn = useCallback(
    (onClick?: () => void) => {
      return (
        <View style={{flexDirection: 'row'}}>
          {step !== 0 && (
            <AppButton
              style={styles.secondaryButton}
              type="secondary"
              title={i18n.t('his:backStep')}
              titleStyle={styles.secondaryButtonText}
              disabled={step === 0}
              disableStyle={{borderWidth: 0}}
              onPress={() => {
                setStep((prev) => (prev - 1 <= 0 ? 0 : prev - 1));
              }}
            />
          )}
          <AppButton
            style={styles.button}
            type="primary"
            title={i18n.t('his:nextStep')}
            disabledOnPress={() => {}}
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
    [step],
  );

  useEffect(() => {
    console.log('@@@@@ snackbar working : ', showSnackBar);
  }, [showSnackBar]);

  const renderModalBody = useCallback(() => {
    return (
      <View>
        <AppNotiBox
          backgroundColor={colors.backGrey}
          textColor={colors.black}
          text={i18n.t('us:modal:selectDate:text')}
          iconName="emojiCheck"
        />
        <Calendar
          onDayPress={(day) => {
            console.log('selected day', day);
          }}
        />
      </View>
    );
  }, []);

  if (!draftOrder || !draftOrder?.orderItems) return <View />;

  // [physical] shipmentState : draft(취소 가능) / ready shipped (취소 불가능)
  // [draft] state = validation && status = inactive , reserved (취소 가능)

  return (
    <SafeAreaView style={styles.container}>
      {step === 0 && (
        <DraftStartPage
          prods={prods}
          draftOrder={draftOrder}
          onClick={onClickStart}
        />
      )}

      {/* 스텝 1도 컴포넌트로 분리하기 */}
      {step === 1 && (
        <>
          <View style={{paddingHorizontal: 20, flex: 1}}>
            <View style={{marginVertical: 24, width: '50%'}}>
              <AppText style={appStyles.bold24Text}>
                {i18n.t('us:step1:title')}
              </AppText>
            </View>
            <View style={{gap: 8}}>
              <AppText
                style={[appStyles.normal14Text, {color: colors.greyish}]}>
                {i18n.t('us:date:text')}
              </AppText>

              <Pressable
                style={styles.DateBoxBtnFrame}
                onPress={() => {
                  console.log('@@@ onPress 클릭');
                  setShowPicker(true);
                }}>
                <AppText
                  style={[appStyles.normal16Text, {color: colors.greyish}]}>
                  {i18n.t('us:date:placeHolder')}
                </AppText>
                <AppIcon
                  style={{alignSelf: 'center', justifyContent: 'center'}}
                  name="iconCalendar"
                />
              </Pressable>
            </View>
          </View>
          {renderBottomBtn(() => {
            if (actDate === '') setShowSnackBar(i18n.t('us:alert:selectDate'));
            else setStep((prev) => (prev + 1 >= 2 ? 2 : prev + 1));
          })}
        </>
      )}
      {step === 2 && (
        <>
          <View style={{flex: 1}}></View>
          {renderBottomBtn()}
        </>
      )}

      <DatePickerModal
        visible={showPicker}
        isCloseBtn={false}
        onClose={() => setShowPicker(false)}
        // title={i18n.t('us:modal:selectDate:title')}
        body={renderModalBody()}
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
  ({account, product, order}: RootState) => ({
    account,
    product,
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
