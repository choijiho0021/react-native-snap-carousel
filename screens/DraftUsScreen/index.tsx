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
  getCountItems,
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
import AppNotiBox from '@/components/AppNotiBox';
import DraftDateInputPage from './component/DraftDateInputPage';
import AppBottomModal from './component/AppBottomModal';
import DatePickerModal from './component/DatePickerModal';
import AppSvgIcon from '@/components/AppSvgIcon';
import DraftInputPage from './component/DraftInputPage';
import ProductDetailList from '../CancelOrderScreen/component/ProductDetailList';
import FloatCheckButton from '../CancelOrderScreen/component/FloatCheckButton';

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

  proudctFrame: {
    paddingHorizontal: 20,
  },
  product: {
    marginBottom: 40,
  },

  divider2: {
    height: 1,
    marginTop: 40,
    marginBottom: 28,
    backgroundColor: colors.line,
    width: '100%',
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
  const [selected, setSelected] = useState('');
  const [checked, setChecked] = useState<boolean>(false);

  const [deviceData, setDeviceData] = useState<DeviceDataType>({
    eid: '',
    imei2: '',
  });

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
              title={i18n.t('us:btn:back')}
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
            title={i18n.t('us:btn:next')}
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

  const onCheck = useCallback(() => {
    if (!checked) scrollRef?.current.scrollToEnd();

    setChecked((prev) => !prev);
  }, [checked]);

  const renderCheckButton = useCallback(() => {
    return (
      <FloatCheckButton
        onCheck={onCheck}
        checkText={i18n.t('his:draftAgree')}
        checked={checked}
      />
    );
  }, [checked, onCheck]);

  useEffect(() => {
    console.log('@@@@@ snackbar working : ', showSnackBar);
  }, [showSnackBar]);

  if (!draftOrder || !draftOrder?.orderItems) return <View />;

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
          <DraftInputPage
            selected={selected}
            setDateModalVisible={setShowPicker}
            deviceData={deviceData}
            setDeviceData={setDeviceData}
          />
          {renderBottomBtn(() => {
            if (selected === '') setShowSnackBar(i18n.t('us:alert:selectDate'));
            else setStep((prev) => (prev + 1 >= 2 ? 2 : prev + 1));
          })}
        </>
      )}

      {step === 2 && (
        <>
          <View style={{paddingHorizontal: 20, flex: 1}}>
            <View style={{marginVertical: 24}}>
              <AppText style={appStyles.bold20Text}>
                {'입력한 정보 및 발권 전 유의사항을 확인해 주세요.'}
              </AppText>
              <View style={styles.proudctFrame}>
                <ProductDetailList
                  style={styles.product}
                  prods={prods}
                  isHeader={false}
                  isBody
                  bodyComponent={
                    <View
                      style={{
                        borderTopWidth: 1,
                        borderColor: colors.whiteFive,
                        paddingVertical: 24,
                      }}>
                      <View style={{gap: 4, flexDirection: 'row'}}>
                        <AppText
                          style={[appStyles.bold16Text, {lineHeight: 24}]}>
                          {'필수 정보'}
                        </AppText>
                        <AppSvgIcon name="star" />
                      </View>
                      <View style={{gap: 6, marginTop: 10}}>
                        <AppText
                          style={[
                            appStyles.extraBold12,
                            {color: colors.greyish},
                          ]}>
                          {'상품 사용 시작일'}
                        </AppText>
                        <AppText
                          style={[
                            appStyles.semiBold16Text,
                            {color: colors.black, lineHeight: 24},
                          ]}>
                          {'2023년 3월 14일'}
                        </AppText>
                      </View>

                      <View style={{marginTop: 16, gap: 6}}>
                        <AppText
                          style={[
                            appStyles.extraBold12,
                            {color: colors.greyish},
                          ]}>
                          {'사용할 단말 정보'}
                        </AppText>
                        <View>
                          <AppText
                            style={[
                              appStyles.bold14Text,
                              {color: colors.greyish},
                            ]}>
                            {'EID'}
                          </AppText>
                          <AppText
                            style={[
                              appStyles.semiBold16Text,
                              {color: colors.black},
                            ]}>
                            {'123124123123213'}
                          </AppText>
                        </View>
                        <View>
                          <AppText
                            style={[
                              appStyles.bold14Text,
                              {color: colors.greyish},
                            ]}>
                            {'IMEI2(eSIM)'}
                          </AppText>
                          <AppText
                            style={[
                              appStyles.semiBold16Text,
                              {color: colors.black},
                            ]}>
                            {'00 00000 00000 0'}
                          </AppText>
                        </View>
                      </View>
                    </View>
                  }
                />
              </View>
            </View>
          </View>
          <View>{renderCheckButton()}</View>

          {renderBottomBtn(() => {
            if (selected === '') setShowSnackBar(i18n.t('us:alert:selectDate'));
            else setStep((prev) => (prev + 1 >= 2 ? 2 : prev + 1));
          })}
        </>
      )}

      <DatePickerModal
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        selected={selected}
        onSelected={setSelected}
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
