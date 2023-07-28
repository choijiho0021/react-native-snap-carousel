import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  InputAccessoryView,
  Platform,
  Pressable,
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
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {CancelKeywordType, RkbOrder, RkbPayment} from '@/redux/api/orderApi';
import utils from '@/redux/api/utils';
import {AccountModelState} from '@/redux/modules/account';
import {
  actions as orderActions,
  OrderAction,
  getCountProds,
} from '@/redux/modules/order';
import {
  actions as productActions,
  ProductModelState,
} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import AppStyledText from '@/components/AppStyledText';
import AppIcon from '@/components/AppIcon';
import LabelText from '@/components/LabelText';
import {countRokebiCash, isRokebiCash} from '../PurchaseDetailScreen';
import AppTextInput from '@/components/AppTextInput';
import Env from '@/environment';
import AppSvgIcon from '@/components/AppSvgIcon';
import ProductDetailInfo from './component/ProductDetailInfo';
import {Currency} from '@/redux/api/productApi';
import {ProdDesc} from './CancelResult';
import AppSnackBar from '@/components/AppSnackBar';

const {esimCurrency} = Env.get();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  stepFrame: {
    marginHorizontal: 20,
  },
  notiContainer: {
    marginTop: 20,
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
  cancelCountNotiFrame: {
    backgroundColor: colors.darkBlue,
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    paddingVertical: 12,

    shadowColor: colors.shadow2,
    shadowRadius: 10,

    shadowOpacity: 0.16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  cancelItemFrame: {
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.whiteFive,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: colors.shadow2,
    shadowRadius: 10,
    shadowOpacity: 0.16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  cancelItem: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderColor: colors.whiteFive,
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
    color: '#ffffff',
  },
  secondaryButton: {
    flex: 1,
    height: 52,
    backgroundColor: colors.white,
    borderColor: colors.dodgerBlue,
    borderWidth: 1,
    color: '#ffffff',
  },
  secondaryButtonText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
  },

  normal16BlueTxt: {
    ...appStyles.normal16Text,
    color: colors.clearBlue,
    lineHeight: 24,
    letterSpacing: 0.24,
  },
  label2: {
    ...appStyles.normal14Text,
    lineHeight: 36,
    color: colors.warmGrey,
  },
  reasonButton: {
    width: 161,
    height: 52,
    borderWidth: 1,
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
    ...appStyles.bold18Text,
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
    backgroundColor: colors.whiteFive,
    overflow: 'scroll',
    padding: 16,
  },
  orderItemContainer: {
    marginBottom: 25,
  },

  orderItemFrame: {
    paddingVertical: 25,
    borderColor: colors.lightGrey,
    borderBottomWidth: 1,
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
  refundGuideFrame: {
    paddingTop: 41,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.backGrey,
  },

  refundGuideTitle: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  refundGuideBody: {
    ...appStyles.normal14Text,
    lineHeight: 22,
  },
  refundGuideBodyBold: {
    ...appStyles.bold14Text,
    lineHeight: 22,
  },
  bannerMark: {
    marginRight: 8,
  },

  checkFrame: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 3,
    backgroundColor: colors.white,
    shadowColor: 'rgba(166, 168, 172, 0.44)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.whiteFive,
  },

  checkText: {
    ...appStyles.semiBold16Text,
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

  pending: boolean;

  action: {
    order: OrderAction;
  };
};

const inputAccessoryViewID = 'doneKbd';

const CancelOrderScreen: React.FC<CancelOrderScreenProps> = ({
  navigation,
  route,
  account: {token},
  action,
  product,
  pending,
}) => {
  const REASON_MAX_LENGTH = 500;
  const REASON_MIN_LENGTH = 10;
  const [order, setOrder] = useState<RkbOrder>();
  const [prods, setProds] = useState<ProdDesc[]>([]);
  const [step, setStep] = useState(0);
  const [balanceCharge, setBalanceCharge] = useState<Currency>();
  const loading = useRef(false);
  const [inputText, setInputText] = useState('');
  const [keyword, setKeyword] = useState<CancelKeywordType>();
  const [showSnackBar, setShowSnackBar] = useState('');
  const keybd = useRef();

  const [method, setMethod] = useState<RkbPayment>();
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('his:cancelDraft')} />,
      headerRight: () =>
        step !== 0 && (
          <AppSvgIcon
            name="closeModal"
            style={styles.btnCnter}
            onPress={() => navigation.goBack()}
          />
        ),
    });
  }, [navigation, step]);

  useEffect(() => {
    if (route?.params?.order) {
      setOrder(route.params.order);
      setMethod(
        order?.paymentList?.find((item) => !isRokebiCash(item.paymentGateway)),
      );

      console.log('method : ', method);
    }
  }, [method, order?.paymentList, route.params.order]);

  // 함수로 묶기
  const getProdDate = useCallback(() => {
    if (!loading.current && (order?.orderItems?.length || 0) > 0) {
      order.orderItems.forEach((i) => {
        if (!product.prodList.has(i.uuid)) {
          // 해당 Uuid로 없다면 서버에서 가져온다.
          action.product.getProdByUuid(i.uuid);
          loading.current = true;
        }
      });
    }
  }, [action?.product, order?.orderItems, product.prodList]);

  const onCheck = useCallback(() => {
    setChecked((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!order?.orderItems) return;

    setBalanceCharge(countRokebiCash(order));
    getProdDate();

    const prodList: ProdDesc[] = order.orderItems.map((r) => {
      const prod = product.prodList.get(r.uuid);

      if (prod)
        return {
          title: prod.name,
          field_description: prod.field_description,
          promoFlag: prod.promoFlag,
          qty: r.qty,
        };
      return null;
    });

    const isNeedUpdate = prodList.some((item) => item === null);

    if (isNeedUpdate) getProdDate();
    else setProds(prodList);
  }, [getProdDate, order, product.prodList]);

  const renderItem = useCallback(
    ({item, isLast}: {item: ProdDesc; isLast?: boolean}) => {
      console.log('item : ', item);
      console.log('index :', isLast);
      return (
        <>
          {Array.from({length: item?.qty}, (_, index) => {
            return (
              <ProductDetailInfo
                key={item.title + index}
                item={item}
                style={[styles.cancelItem, isLast && {borderBottomWidth: 0}]}
              />
            );
          })}
        </>
      );
    },
    [],
  );

  const renderStep1 = useCallback(() => {
    return (
      <ScrollView style={styles.stepFrame}>
        <View style={styles.notiContainer}>
          <View style={styles.notiFrame}>
            <AppSvgIcon style={styles.bannerCheck} name="bannerCheck" />
            <AppStyledText
              text={i18n.t('his:cancelHeaderTitle')}
              textStyle={styles.notiText}
              format={{b: [appStyles.bold14Text, {color: colors.violet500}]}}
            />
          </View>
          <View style={styles.cancelCountNotiFrame}>
            <AppStyledText
              text={i18n
                .t('his:cancelHeaderTitle2')
                .replace('%', getCountProds(prods))}
              textStyle={{...appStyles.normal20Text, color: colors.white}}
              format={{b: {...appStyles.bold20Text, color: colors.white}}}
            />
          </View>
        </View>

        {/* contentContainerStyle={[styles.cancelItemFrame]} */}

        <View style={styles.cancelItemFrame}>
          {prods.map((r, index) =>
            renderItem({item: r, isLast: index === prods.length - 1}),
          )}
        </View>
      </ScrollView>
    );
  }, [prods, renderItem]);

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
                {key.map((btn) => (
                  <AppButton
                    key={`${btn}button`}
                    style={[
                      styles.reasonButton,
                      btn === keyword && {
                        backgroundColor: colors.blue,
                        borderWidth: 0,
                      },
                      index === 0 && {marginBottom: 12},
                    ]}
                    titleStyle={[
                      styles.reasonButtonText,
                      btn === keyword && {color: colors.white},
                    ]}
                    onPress={() => {
                      setKeyword(btn);
                      setInputText('');
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
          style={styles.reasonDetailBox}
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
      <View style={styles.refundGuideFrame}>
        <View style={styles.refundGuideTitle}>
          <AppSvgIcon name="bannerMark" style={styles.bannerMark} />
          <AppText style={appStyles.bold18Text}>
            {i18n.t('his:cancelGuideLineTitle')}
          </AppText>
        </View>
        <AppStyledText
          text={i18n.t('his:cancelGuideLineBody')}
          textStyle={styles.refundGuideBody}
          format={{b: styles.refundGuideBodyBold}}
        />
      </View>
    );
  }, []);

  const renderCheckButton = useCallback(() => {
    return (
      <Pressable
        onPress={() => {
          onCheck();
        }}
        style={styles.checkFrame}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', width: '90%'}}>
          <AppIcon
            style={{marginRight: 20}}
            name="btnCheck2"
            checked={checked}
            size={22}
          />
          <AppText style={styles.checkText}>{i18n.t('his:draftAgree')}</AppText>
        </View>
      </Pressable>
    );
  }, [checked, onCheck]);
  const renderStep3 = useCallback(() => {
    return (
      <ScrollView>
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
              value={order?.totalPrice}
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
            {balanceCharge !== utils.toCurrency(0, esimCurrency) && (
              <LabelText
                key="deductBalance"
                style={styles.item}
                label={i18n.t('his:rokebiCash')}
                format="price"
                labelStyle={styles.label2}
                valueStyle={styles.itemCashText}
                value={balanceCharge}
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
              value={order?.totalPrice}
              currencyStyle={styles.totalCashCurrencyText}
              balanceStyle={styles.totalCashCurrencyText}
              color={colors.blue}
            />
          </View>
        </View>
        <View>{renderGuide()}</View>
      </ScrollView>
    );
  }, [balanceCharge, method, order?.totalPrice, renderGuide]);

  const cancelOrder = useCallback(() => {
    action.order
      .cancelDraftOrder({
        orderId: order?.orderId,
        token,
        reason: `${keyword}:${inputText}`,
      })
      .then(({payload: resp}) => {
        navigation.navigate('CancelResult', {
          isSuccess: resp?.result === 0,
          prods,
          orderId: order?.orderId,
        });
      });
  }, [
    action.order,
    inputText,
    keyword,
    navigation,
    order?.orderId,
    prods,
    token,
  ]);

  if (!order || !order.orderItems) return <View />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        {step === 0 && renderStep1()}
        {step === 1 && renderStep2()}
        {step === 2 && renderStep3()}

        <AppSnackBar
          visible={showSnackBar !== ''}
          onClose={() => setShowSnackBar('')}
          textMessage={showSnackBar}
          hideCancel
        />
      </View>
      {step === 2 && <View>{renderCheckButton()}</View>}
      <View style={{flexDirection: 'row'}}>
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
            (step === 2 && !checked)
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
              setShowSnackBar(i18n.t('his:cancelReasonAlert3'));
            }
          }}
          disabledCanOnPress
          onPress={() => {
            if (step === 2 && checked) {
              cancelOrder();
            }
            setStep((prev) => (prev + 1 >= 2 ? 2 : prev + 1));
          }}
        />
      </View>
      <AppActivityIndicator visible={pending} />
    </SafeAreaView>
  );
};

export default connect(
  ({account, product}: RootState) => ({
    account,
    product,
    pending: false,
  }),
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
      product: bindActionCreators(productActions, dispatch),
    },
  }),
)(CancelOrderScreen);
