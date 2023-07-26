import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
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
import AppAlert from '@/components/AppAlert';
import Env from '@/environment';
import AppSvgIcon from '@/components/AppSvgIcon';
import ProductDetailInfo from './component/ProductDetailInfo';
import {Currency} from '@/redux/api/productApi';
import {ProdDesc} from './CancelResult';

const {esimCurrency} = Env.get();

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
    width: 140,
    height: 40,
    marginLeft: 20,
    marginRight: 0,
    marginBottom: 10,
    borderWidth: 1,
  },
  reasonButtonFrame: {
    marginTop: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bar: {
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  item: {
    marginHorizontal: 20,
    height: 36,
    alignItems: 'center',
    minWidth: '25%',
  },
  btnCnter: {
    width: 40,
    height: 40,
    marginHorizontal: 18,
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

const CancelOrderScreen: React.FC<CancelOrderScreenProps> = ({
  navigation,
  route,
  account: {token},
  action,
  product,
  pending,
}) => {
  const REASON_MAX_BYTE = 500;
  const [order, setOrder] = useState<RkbOrder>();
  const [prods, setProds] = useState<ProdDesc[]>([]);
  const [step, setStep] = useState(0);
  const [balanceCharge, setBalanceCharge] = useState<Currency>();
  const loading = useRef(false);
  const [inputText, setInputText] = useState('');
  const [keyword, setKeyword] = useState<CancelKeywordType>();

  // 이건 3단계 그릴 떄 필요
  const [method, setMethod] = useState<RkbPayment>();
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('his:cancelDraft')} />,
      headerRight: () => (
        <AppSvgIcon
          name="closeModal"
          style={styles.btnCnter}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (route?.params?.order) {
      setOrder(route.params.order);
      setMethod(
        order?.paymentList?.find((item) => !isRokebiCash(item.paymentGateway)),
      );
    }
  }, [order?.paymentList, route.params.order]);

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

  const renderItem = useCallback(({item}: {item: ProdDesc}) => {
    return Array.from({length: item.qty}, (_, index) => {
      return <ProductDetailInfo key={item.title + index} item={item} />;
    });
  }, []);

  const renderStep1 = useCallback(() => {
    return (
      <FlatList
        contentContainerStyle={[_.isEmpty(prods) && {flex: 1}]}
        data={prods}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.title + index}
        ListHeaderComponent={
          <View style={{marginTop: 10, marginBottom: 20}}>
            <AppStyledText
              text={i18n.t('his:cancelHeaderTitle')}
              textStyle={[appStyles.bold20Text, {marginBottom: 20}]}
              format={{b: [appStyles.bold20Text, {color: 'purple'}]}}
            />
            <AppStyledText
              text={i18n
                .t('his:cancelHeaderTitle2')
                .replace('%', getCountProds(prods))}
              textStyle={{...appStyles.bold20Text}}
              format={{b: [appStyles.bold20Text, {color: 'red'}]}}
            />
          </View>
        }
      />
    );
  }, [prods, renderItem]);

  const renderStep2 = useCallback(() => {
    return (
      <View>
        <AppText style={appStyles.bold20Text}>
          {i18n.t('his:cancelHeaderTitle3')}
        </AppText>
        <View style={styles.reasonButtonFrame}>
          {[
            ['changed', 'mistake'] as CancelKeywordType[],
            ['complain', 'etc'] as CancelKeywordType[],
          ].map((key: CancelKeywordType[]) => {
            return [
              <View key={key.toString()} style={{flexDirection: 'row'}}>
                {key.map((btn) => (
                  <AppButton
                    key={`${btn}button`}
                    style={styles.reasonButton}
                    titleStyle={{color: 'black'}}
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
          <AppText style={appStyles.bold20Text}>
            {i18n.t('his:cancelReasonDetail')}
          </AppText>
          <AppText>{`${inputText.length || ''}/${REASON_MAX_BYTE}`}</AppText>
        </View>
        <AppTextInput
          style={{
            height: 150,
            ...appStyles.normal16Text,
            backgroundColor: 'gray',
            overflow: 'scroll',
          }}
          maxLength={REASON_MAX_BYTE}
          onChangeText={(v) => {
            setInputText(v);
          }}
          multiline
          value={inputText}
          enablesReturnKeyAutomatically
          clearTextOnFocus={false}
          onFocus={() => {}}
          onBlur={() => {}}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={i18n.t('his:cancelReasonDetail:placeholder')}
          placeholderTextColor={colors.greyish}
        />
      </View>
    );
  }, [inputText]);

  const renderStep3 = useCallback(() => {
    return (
      <View>
        <AppText style={appStyles.bold20Text}>
          {i18n.t('his:cancelHeaderTitle4')}
        </AppText>

        <View>
          <View style={styles.bar} />
          <LabelText
            key="productAmount"
            style={styles.item}
            label={i18n.t('his:cancelTotalAmount')}
            labelStyle={styles.label2}
            format="price"
            valueStyle={appStyles.roboto16Text}
            value={order.totalPrice}
            currencyStyle={[styles.normal16BlueTxt, {color: colors.black}]}
            balanceStyle={[styles.normal16BlueTxt, {color: colors.black}]}
          />
        </View>

        <View style={{flexDirection: 'column'}}>
          <View>
            <View>
              <AppText>{i18n.t('his:refundMethod')}</AppText>
            </View>

            {balanceCharge !== utils.toCurrency(0, esimCurrency) && (
              <LabelText
                key="deductBalance"
                style={styles.item}
                label={i18n.t('his:rokebiCash')}
                format="price"
                labelStyle={styles.label2}
                valueStyle={appStyles.roboto16Text}
                value={balanceCharge}
                balanceStyle={[styles.normal16BlueTxt, {color: colors.black}]}
                currencyStyle={[styles.normal16BlueTxt, {color: colors.black}]}
              />
            )}
          </View>
        </View>
      </View>
    );
  }, [order?.totalPrice, balanceCharge]);

  const renderGuide = useCallback(() => {
    return (
      <View>
        <AppText style={appStyles.bold18Text}>
          {i18n.t('his:cancelGuideLineTitle')}
        </AppText>
        <AppText>{i18n.t('his:cancelGuideLineBody')}</AppText>
      </View>
    );
  }, []);

  const cancelOrder = useCallback(() => {
    action.order
      .cancelDraftOrder({orderId: order?.orderId, token, reason: keyword})
      .then(({payload: resp}) => {
        navigation.navigate('CancelResult', {
          isSuccess: resp?.result === 0,
          prods,
          orderId: order?.orderId,
        });
      });
  }, [action.order, keyword, navigation, order?.orderId, prods, token]);

  const renderCheckButton = useCallback(() => {
    return (
      <>
        {renderGuide()}
        <Pressable
          onPress={() => {
            onCheck();
          }}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', width: '90%'}}>
            <AppIcon
              style={{marginRight: 20}}
              name="btnCheck2"
              checked={checked}
              size={22}
            />
            <AppText style={[appStyles.normal18Text, {marginVertical: 20}]}>
              {i18n.t('his:draftAgree')}
            </AppText>
          </View>
        </Pressable>
      </>
    );
  }, [checked, onCheck, renderGuide]);

  if (!order || !order.orderItems) return <View />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginHorizontal: 20, flex: 1}}>
        {step === 0 && renderStep1()}
        {step === 1 && renderStep2()}
        {step === 2 && renderStep3()}
      </View>
      <View style={{marginHorizontal: 20}}>
        {step === 2 && renderCheckButton()}
      </View>
      <View style={{flexDirection: 'row'}}>
        <AppButton
          style={styles.secondaryButton}
          type="secondary"
          title={i18n.t('his:backStep')}
          titleStyle={styles.secondaryButtonText}
          disabled={step === 0}
          onPress={() => {
            setStep((prev) => (prev - 1 <= 0 ? 0 : prev - 1));
          }}
        />

        <AppButton
          style={styles.button}
          type="primary"
          title={
            step === 2 ? i18n.t('his:cancelButton') : i18n.t('his:nextStep')
          }
          disabled={
            (step === 1 && inputText?.length < 20 && keyword === 'etc') ||
            (step === 1 && !keyword) ||
            (step === 2 && !checked)
          }
          disabledOnPress={() => {
            if (step === 1 && !keyword) {
              AppAlert.info(i18n.t('his:cancelReasonAlert1'));
            } else if (
              step === 1 &&
              inputText?.length < 20 &&
              keyword === 'etc'
            ) {
              AppAlert.info(i18n.t('his:cancelReasonAlert2'));
            } else if (step === 2 && !checked) {
              AppAlert.info(i18n.t('his:cancelReasonAlert3'));
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
