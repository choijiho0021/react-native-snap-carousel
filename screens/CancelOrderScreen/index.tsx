import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  InputAccessoryView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {CancelKeywordType, RkbOrder, RkbPayment} from '@/redux/api/orderApi';
import {AccountModelState} from '@/redux/modules/account';
import {
  actions as orderActions,
  OrderAction,
  getCountItems,
  OrderModelState,
} from '@/redux/modules/order';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';

import {
  ProductAction,
  actions as productActions,
  ProductModelState,
} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import AppStyledText from '@/components/AppStyledText';
import LabelText from '@/components/LabelText';
import {isRokebiCash} from '../PurchaseDetailScreen';
import AppTextInput from '@/components/AppTextInput';
import AppSvgIcon from '@/components/AppSvgIcon';
import {ProdInfo} from '@/redux/api/productApi';
import AppSnackBar from '@/components/AppSnackBar';
import ProductDetailList from './component/ProductDetailList';
import GuideBox from './component/GuideBox';
import FloatCheckButton from './component/FloatCheckButton';
import AppModalContent from '@/components/ModalContent/AppModalContent';
import BackbuttonHandler from '@/components/BackbuttonHandler';
import ScreenHeader from '@/components/ScreenHeader';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  stepFrame: {
    paddingHorizontal: 20,
  },
  notiFrame: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 17,
    backgroundColor: colors.backGrey,
  },
  notiText: {
    ...appStyles.normal14Text,
    textAlign: 'center',
    alignContent: 'center',
    color: colors.violet500,
  },
  bannerCheck: {
    width: 24,
    height: 24,
    marginRight: 9,
  },
  button: {
    ...appStyles.normal16Text,
    flex: 1,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: colors.white,
  },
  secondaryButton: {
    flex: 1,
    height: 52,
    backgroundColor: colors.white,
    borderColor: colors.lightGrey,

    borderTopWidth: 1,
    color: colors,
  },
  secondaryButtonText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
  },
  label2: {
    ...appStyles.normal14Text,
    lineHeight: 36,
    color: colors.warmGrey,
  },
  reasonButton: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: colors.lightGrey,
  },
  reasonButtonFrame: {
    marginTop: 20,
    marginBottom: 24,
    height: 116,
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  reasonButtonText: {
    ...appStyles.medium18,
    color: colors.black,
    lineHeight: 26,
    letterSpacing: 0,
  },
  reasonDetailTitle: {
    ...appStyles.semiBold14Text,
    marginBottom: 6,
  },
  reasonDetailLength: {
    ...appStyles.semiBold14Text,
    color: colors.warmGrey,
  },
  reasonDetailBox: {
    height: 208,
    ...appStyles.normal16Text,
    textAlignVertical: 'top',
    backgroundColor: colors.backGrey,
    overflow: 'scroll',
    padding: 16,
    paddingTop: 16,
    borderWidth: 1,
    borderColor: colors.whiteFive,
    marginTop: 6,
    borderRadius: 3,
  },
  orderItemContainer: {
    marginBottom: 25,
  },

  orderItemFrame: {
    paddingVertical: 25,
    borderColor: colors.lightGrey,
    borderBottomWidth: 1,
  },

  modalText: {
    ...appStyles.semiBold16Text,
    lineHeight: 26,
    letterSpacing: -0.32,
    color: colors.black,
  },

  item: {
    alignItems: 'center',
  },

  itemCashText: {
    ...appStyles.normal14Text,
  },

  itemCashCurrencyText: {
    ...appStyles.roboto16Text,
  },

  totalCashCurrencyText: {
    ...appStyles.robotoBold22Text,
  },

  btnCnter: {
    width: 40,
    height: 40,
    marginHorizontal: 18,
  },

  inputAccessoryText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    margin: 5,
  },
  inputAccessory: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: colors.lightGrey,
    padding: 5,
  },

  cancelReasonTitleFrame: {
    height: 69,
    justifyContent: 'center',
    marginTop: 24,
    borderBottomWidth: 1,
    borderColor: colors.black,
  },
  refundTitleFrame: {
    height: 69,
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
});

type CancelOrderScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'CancelOrder'
>;

type CancelOrderScreenRouteProp = RouteProp<HomeStackParamList, 'CancelOrder'>;

type CancelOrderScreenProps = {
  navigation: CancelOrderScreenNavigationProp;
  route: CancelOrderScreenRouteProp;

  account: AccountModelState;
  product: ProductModelState;
  order: OrderModelState;

  pending: boolean;

  action: {
    order: OrderAction;
    modal: ModalAction;
    product: ProductAction;
  };
};

const inputAccessoryViewID = 'doneKbd';

const CancelOrderScreen: React.FC<CancelOrderScreenProps> = ({
  navigation,
  route,
  account: {token},
  order,
  action,
  product,
  pending,
}) => {
  const REASON_MAX_LENGTH = 500;
  const REASON_MIN_LENGTH = 10;
  const [selectedOrder, setSelectedOrder] = useState<RkbOrder>();
  const [prods, setProds] = useState<ProdInfo[]>([]);
  const [step, setStep] = useState(0);
  const loading = useRef(false);
  const [inputText, setInputText] = useState('');
  const [keyword, setKeyword] = useState<CancelKeywordType>();
  const [showSnackBar, setShowSnackBar] = useState('');
  const keybd = useRef();
  const scrollRef = useRef<ScrollView>();
  const [isClickButton, setIsClickButton] = useState(false);

  const [method, setMethod] = useState<RkbPayment>();
  const [checked, setChecked] = useState<boolean>(false);

  const onBackStep = useCallback(() => {
    setStep((prev) => (prev - 1 <= 0 ? 0 : prev - 1));
  }, []);

  const backHandler = useCallback(() => {
    if (step === 0) navigation.goBack();
    else {
      onBackStep();
    }
    return true;
  }, [navigation, onBackStep, step]);

  // 완료창에서 뒤로가기 시 확인과 똑같이 처리한다.
  BackbuttonHandler({
    navigation,
    onBack: backHandler,
  });

  useEffect(() => {
    if (route?.params?.orderId) {
      const foundOrder = order?.orders.get(route.params.orderId);
      setSelectedOrder(foundOrder);
      setMethod(
        foundOrder?.paymentList?.find(
          (item) => !isRokebiCash(item.paymentGateway),
        ),
      );
    }
  }, [method, order?.orders, route.params.orderId]);

  // 함수로 묶기
  const getProdDate = useCallback(() => {
    if (!loading.current && (selectedOrder?.orderItems?.length || 0) > 0) {
      selectedOrder?.orderItems.forEach((i) => {
        if (!product.prodList.has(i.uuid)) {
          // 해당 Uuid로 없다면 서버에서 가져온다.
          action.product.getProdByUuid(i.uuid);
          loading.current = true;
        }
      });
    }
  }, [action.product, selectedOrder?.orderItems, product.prodList]);

  const onCheck = useCallback(() => {
    if (!checked) scrollRef.current?.scrollToEnd();

    setChecked((prev) => !prev);
  }, [checked]);

  useEffect(() => {
    if (!selectedOrder?.orderItems) return;

    getProdDate();

    const prodList: ProdInfo[] = selectedOrder.orderItems.map((r) => {
      const prod = product.prodList.get(r.uuid);
      return prod
        ? {
            title: prod.name,
            field_description: prod.field_description,
            promoFlag: prod.promoFlag,
            qty: r.qty,
          }
        : undefined;
    });

    const isNeedUpdate = prodList.some((item) => item === null);

    if (isNeedUpdate) getProdDate();
    else setProds(prodList);
  }, [getProdDate, product.prodList, selectedOrder]);

  const renderStep1 = useCallback(() => {
    return (
      <ScrollView>
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}>
          <ProductDetailList
            prods={prods}
            listTitle={i18n
              .t('his:cancelHeaderTitle2')
              .replace('%', getCountItems(selectedOrder?.orderItems, false))}
            notiComponent={
              <View style={styles.notiFrame}>
                <AppSvgIcon style={styles.bannerCheck} name="bannerCheck" />
                <AppStyledText
                  text={i18n.t('his:cancelHeaderTitle')}
                  textStyle={styles.notiText}
                  format={{
                    b: [appStyles.bold14Text, {color: colors.violet500}],
                  }}
                />
              </View>
            }
            isFooter={false}
          />
        </View>
      </ScrollView>
    );
  }, [selectedOrder?.orderItems, prods]);

  const renderStep2 = useCallback(() => {
    return (
      <KeyboardAwareScrollView style={styles.stepFrame} enableOnAndroid>
        <View style={styles.cancelReasonTitleFrame}>
          <AppText style={appStyles.bold20Text}>
            {i18n.t('his:cancelHeaderTitle3')}
          </AppText>
        </View>
        <View style={styles.reasonButtonFrame}>
          {[
            ['changed', 'mistake'] as CancelKeywordType[],
            ['complain', 'etc'] as CancelKeywordType[],
          ].map((key: CancelKeywordType[], index) => {
            return [
              <View
                key={key.toString()}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignContent: 'space-between',
                }}>
                {key.map((btn, idx) => (
                  <AppButton
                    key={`${btn}button`}
                    style={[
                      styles.reasonButton,
                      btn === keyword && {
                        backgroundColor: colors.blue,
                        borderWidth: 0,
                      },

                      idx === 0 && {marginRight: 12},
                      index === 0 && {marginBottom: 12},
                    ]}
                    titleStyle={[
                      styles.reasonButtonText,
                      btn === keyword && {
                        color: colors.white,
                        fontWeight: '700',
                      },
                    ]}
                    onPress={() => {
                      setKeyword(btn);
                    }}
                    title={`${i18n.t(`his:cancelReason:${btn}`)}`}
                  />
                ))}
              </View>,
            ];
          })}
          <View style={{flexDirection: 'row'}} />
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <AppText style={styles.reasonDetailTitle}>
            {i18n.t('his:cancelReasonDetail')}
          </AppText>
          <AppText style={styles.reasonDetailLength}>{`${
            inputText.length || '0'
          }/${REASON_MAX_LENGTH}`}</AppText>
        </View>

        <AppTextInput
          style={[
            styles.reasonDetailBox,
            inputText
              ? {borderColor: colors.black, backgroundColor: colors.white}
              : undefined,
          ]}
          maxLength={REASON_MAX_LENGTH}
          onChangeText={(v) => {
            setInputText(v);
          }}
          ref={keybd}
          multiline
          value={inputText}
          inputAccessoryViewID={inputAccessoryViewID}
          enablesReturnKeyAutomatically
          clearTextOnFocus={false}
          onFocus={() => {}}
          onBlur={() => {}}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={i18n.t('his:cancelReasonDetail:placeholder')}
          placeholderTextColor={colors.greyish}
        />
      </KeyboardAwareScrollView>
    );
  }, [inputText, keyword]);

  const renderGuide = useCallback(() => {
    return (
      <GuideBox
        iconName="bannerMark"
        title={i18n.t('his:cancelGuideLineTitle')}
        body={i18n.t('his:cancelGuideLineBody')}
      />
    );
  }, []);

  const renderCheckButton = useCallback(() => {
    return (
      <FloatCheckButton
        onCheck={onCheck}
        checkText={i18n.t('his:cancelAgree')}
        checked={checked}
      />
    );
  }, [checked, onCheck]);

  const renderStep3 = useCallback(() => {
    return (
      <ScrollView ref={scrollRef}>
        <View style={styles.stepFrame}>
          <View style={styles.refundTitleFrame}>
            <AppText style={appStyles.bold20Text}>
              {i18n.t('his:cancelHeaderTitle4')}
            </AppText>
          </View>
          <View style={styles.orderItemContainer}>
            <LabelText
              key="productAmount"
              style={styles.orderItemFrame}
              label={i18n.t('his:orderTotalAmount')}
              labelStyle={[appStyles.bold14Text, {color: colors.black}]}
              format="price"
              valueStyle={appStyles.roboto16Text}
              value={selectedOrder?.totalPrice}
              currencyStyle={[appStyles.bold14Text, {color: colors.black}]}
              balanceStyle={[appStyles.robotoBold16Text, {color: colors.black}]}
            />

            {method && (
              <LabelText
                key="cashBalance"
                style={[styles.item, {marginTop: 10}]}
                label={method?.paymentMethod}
                format="price"
                labelStyle={styles.label2}
                valueStyle={styles.itemCashCurrencyText}
                value={method?.amount}
                balanceStyle={styles.itemCashCurrencyText}
                currencyStyle={styles.itemCashCurrencyText}
                color={colors.warmGrey}
              />
            )}
            {selectedOrder?.deductBalance?.value != 0 && (
              <LabelText
                key="deductBalance"
                style={[styles.item, {marginTop: method ? 0 : 10}]}
                label={i18n.t('his:rokebiCash')}
                format="price"
                labelStyle={styles.label2}
                valueStyle={styles.itemCashText}
                value={selectedOrder?.deductBalance?.value}
                balanceStyle={styles.itemCashCurrencyText}
                currencyStyle={styles.itemCashCurrencyText}
                color={colors.warmGrey}
              />
            )}

            <LabelText
              key="totalRefund"
              style={styles.item}
              label={i18n.t('his:cancelTotalAmount')}
              labelStyle={appStyles.bold16Text}
              format="price"
              valueStyle={appStyles.roboto16Text}
              value={selectedOrder?.totalPrice}
              currencyStyle={styles.totalCashCurrencyText}
              balanceStyle={styles.totalCashCurrencyText}
              color={colors.blue}
            />
          </View>
        </View>
        <View>{renderGuide()}</View>
      </ScrollView>
    );
  }, [
    method,
    renderGuide,
    selectedOrder?.deductBalance?.value,
    selectedOrder?.totalPrice,
  ]);

  const cancelOrder = useCallback(() => {
    setIsClickButton(true);

    action.order
      .cancelDraftOrder({
        orderId: selectedOrder?.orderId,
        token,
        reason: `${keyword}:${inputText}`,
      })
      .then(({payload: resp}) => {
        navigation.navigate('CancelResult', {
          isSuccess: resp?.result === 0,
          prods,
          orderId: selectedOrder?.orderId,
        });
      });
  }, [
    action.order,
    inputText,
    keyword,
    navigation,
    prods,
    selectedOrder?.orderId,
    token,
  ]);

  if (!selectedOrder || !selectedOrder.orderItems) return <View />;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={i18n.t('his:cancelDraft')}
        backHandler={backHandler}
        renderRight={
          step !== 0 ? (
            <AppSvgIcon
              name="closeModal"
              style={styles.btnCnter}
              onPress={() => navigation.goBack()}
            />
          ) : null
        }
      />
      <View style={{flex: 1}}>
        {step === 0
          ? renderStep1()
          : step === 1
          ? renderStep2()
          : step === 2
          ? renderStep3()
          : null}

        <AppSnackBar
          visible={showSnackBar !== ''}
          onClose={() => setShowSnackBar('')}
          textMessage={showSnackBar}
          bottom={20}
          hideCancel
        />
      </View>
      {step === 2 && <View>{renderCheckButton()}</View>}
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

        {Platform.OS === 'ios' ? (
          <InputAccessoryView nativeID={inputAccessoryViewID}>
            <AppButton
              style={styles.inputAccessory}
              title={i18n.t('done')}
              titleStyle={[
                styles.inputAccessoryText,
                {color: _.isEmpty(inputText) ? colors.white : colors.blue},
              ]}
              onPress={() => keybd.current?.blur()}
            />
          </InputAccessoryView>
        ) : null}

        <AppButton
          style={styles.button}
          type="primary"
          title={
            step === 2 ? i18n.t('his:cancelButton') : i18n.t('his:nextStep')
          }
          disabled={
            (step === 1 &&
              inputText?.length < REASON_MIN_LENGTH &&
              keyword === 'etc') ||
            (step === 1 && !keyword) ||
            (step === 2 && !checked) ||
            isClickButton
          }
          disabledOnPress={() => {
            if (step === 1 && !keyword) {
              setShowSnackBar(i18n.t('his:cancelReasonAlert1'));
            } else if (
              step === 1 &&
              inputText?.length < REASON_MIN_LENGTH &&
              keyword === 'etc'
            ) {
              setShowSnackBar(
                i18n
                  .t('his:cancelReasonAlert2')
                  .replace('%', REASON_MIN_LENGTH.toString()),
              );
            } else if (step === 2 && !checked) {
              action.modal.renderModal(() => (
                <AppModalContent
                  type="info"
                  onOkClose={() => {
                    action.modal.closeModal();
                  }}>
                  <View style={{marginLeft: 30}}>
                    <AppText style={styles.modalText}>
                      {i18n.t('his:cancelReasonAlert3')}
                    </AppText>
                  </View>
                </AppModalContent>
              ));
            }
          }}
          disabledCanOnPress
          onPress={() => {
            if (isClickButton) console.log('중복 클릭');
            else {
              if (step === 2 && checked) {
                cancelOrder();
              }
              setStep((prev) => (prev + 1 >= 2 ? 2 : prev + 1));
            }
          }}
        />
      </View>
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
)(CancelOrderScreen);
