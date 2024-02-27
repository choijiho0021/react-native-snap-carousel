import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppButton from '@/components/AppButton';
import AppSnackBar from '@/components/AppSnackBar';
import AppText from '@/components/AppText';
import LabelText from '@/components/LabelText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {OrderState, RkbOrder, RkbPayment} from '@/redux/api/orderApi';
import utils from '@/redux/api/utils';
import {AccountModelState} from '@/redux/modules/account';
import {
  actions as orderActions,
  OrderAction,
  getCountItems,
  OrderModelState,
  isExpiredDraft,
} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import {API} from '@/redux/api';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppStyledText from '@/components/AppStyledText';
import ScreenHeader from '@/components/ScreenHeader';
import DropDownHeader from './PymMethodScreen/DropDownHeader';
import ProductDetailInfo from './CancelOrderScreen/component/ProductDetailInfo';
import ProductDetailRender from './CancelOrderScreen/component/ProductDetailRender';
import {ProductModelState} from '@/redux/modules/product';
import ProductDetailList from './CancelOrderScreen/component/ProductDetailList';

const {esimCurrency, esimGlobal} = Env.get();
import PaymentSummary from '@/components/PaymentSummary';
import {PaymentReq} from '@/redux/modules/cart';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  hearNotiFrame: {
    alignItems: 'center',
    flexDirection: 'row',
    ...appStyles.normal14Text,
    backgroundColor: colors.noticeBackground,
    borderRadius: 3,
    marginTop: 20,
    padding: 16,
    marginHorizontal: 20,
  },
  headerNotiBoldText: {
    ...appStyles.bold14Text,
    color: colors.redError,
  },
  headerNotiText: {
    ...appStyles.normal14Text,
    lineHeight: 20,
    margin: 5,
    color: colors.redError,
  },
  date: {
    ...appStyles.normal14Text,
    marginTop: 24,
    marginLeft: 20,
    color: colors.warmGrey,
  },
  cancelButtonText: {
    ...appStyles.medium14,
    color: colors.blue,
    lineHeight: 24,
  },
  productTitle: {
    ...appStyles.bold18Text,
    lineHeight: 24,
    letterSpacing: 0.27,
    flexDirection: 'row',
    maxWidth: isDeviceSize('small') ? '70%' : '80%',
  },
  cancelDraftFrame: {
    marginHorizontal: 20,
    marginBottom: 26,
    marginTop: 32,
  },
  cancelDraftBtn: {
    borderRadius: 3,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.blue,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  cancelDraftBtnDisabled: {
    borderRadius: 3,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    backgroundColor: colors.whiteTwo,
    justifyContent: 'center',
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
  labelValue: {
    ...appStyles.robotoSemiBold16Text,
    lineHeight: 36,
    letterSpacing: 0.22,
    color: colors.black,
    marginLeft: 0,
  },
  dividerTop: {
    marginTop: 20,
    height: 10,
    backgroundColor: colors.whiteTwo,
  },
  label2: {
    ...appStyles.normal14Text,
    lineHeight: 36,
    color: colors.warmGrey,
  },
  secondaryButton: {
    flex: 1,
    height: 52,
    borderColor: colors.lightGrey,
    borderTopWidth: 1,
    color: colors.white,
  },
  secondaryButtonText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
  },
  button: {
    ...appStyles.normal16Text,
    flex: 1,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: colors.white,
  },
  cancelText: {
    ...appStyles.normal14Text,
    marginTop: 24,
    lineHeight: 22,
    marginHorizontal: 20,
    color: colors.warmGrey,
  },
});

type PurchaseDetailScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'PurchaseDetail'
>;

type PurchaseDetailScreenRouteProp = RouteProp<
  HomeStackParamList,
  'PurchaseDetail'
>;

type PurchaseDetailScreenProps = {
  navigation: PurchaseDetailScreenNavigationProp;
  route: PurchaseDetailScreenRouteProp;

  account: AccountModelState;
  orders: OrderModelState['orders'];
  product: ProductModelState;

  pending: boolean;

  action: {
    order: OrderAction;
  };
};

export const isRokebiCash = (pg: string) =>
  ['rokebi_cash', 'rokebi_point'].includes(pg);

const PurchaseDetailScreen: React.FC<PurchaseDetailScreenProps> = ({
  navigation,
  route,
  account,
  orders,
  pending,
  action,
  product,
}) => {
  const [order, setOrder] = useState<RkbOrder>();
  const [method, setMethod] = useState<RkbPayment>();
  const [showSnackBar, setShowSnackBar] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const isValidate = useMemo(
    () => order?.orderType === 'refundable' && order?.state === 'validation',
    [order?.orderType, order?.state],
  );

  const isValidation = useMemo(
    () => isValidate && !isExpiredDraft(order?.orderDate),
    [isValidate, order?.orderDate],
  );

  useEffect(() => {
    const {orderId} = route.params;

    Analytics.trackEvent('Page_View_Count', {page: 'Purchase Detail'});

    if (orderId) {
      const detail = orders.get(Number(orderId));
      if (detail) {
        // order 조회에 성공하면, state.order.orders redux store 값이 변경되기 때문에
        // useEffect()에 의해 이루틴이 다시 실행된다.
        // 그때는 detail 값이 존재하기 때문에, 상세 정보 처리가 가능해진다.

        setOrder(detail);
        setMethod(
          detail.paymentList?.find(
            (item) => !isRokebiCash(item.paymentGateway),
          ),
        );
      } else {
        // order를 못찾으면, 다시 읽어온다.
        const {mobile, token} = account;

        setLoading(true);

        action.order
          .getOrderById({
            user: mobile,
            token,
            orderId,
          })
          .then(({payload}) => {
            const {result} = payload || {};
            if (result !== 0) {
              // order 조회 실패하는 경우
              AppAlert.info(i18n.t('his:orderNotFound'));
              navigation.goBack();
            }
          })
          .finally(() => setLoading(false));
      }
    } else {
      AppAlert.info(i18n.t('his:orderNotFound'));
      navigation.goBack();
    }
  }, [account, action.order, navigation, orders, route.params]);

  const paymentInfo = useCallback(() => {
    if (!order) return null;

    const isRecharge =
      order.orderItems?.find((i) => i.type === 'recharge') || false;

    const pym = {
      subtotal: order.subtotal,
      discount: order.discount,
      rkbcash: order.deductBalance,
    } as PaymentReq;

    const pg = method?.paymentMethod || i18n.t('pym:balance');

    return (
      <View>
        <PaymentSummary
          data={pym}
          total={order.totalPrice}
          expandable={false}
          title={i18n.t('his:paymentDetail')}
          totalLabel={
            order.state === 'canceled' ? i18n.t('his:cancelAmount') : undefined
          }
          totalColor={order.state === 'canceled' ? colors.redError : undefined}
        />
        <LabelText
          style={styles.item}
          label={i18n.t('pym:method')}
          labelStyle={styles.label2}
          value={pg}
          valueStyle={styles.labelValue}
        />

        {order.state === 'canceled' ? (
          <AppText style={styles.cancelText}>
            {i18n.t('his:cancelText')}
          </AppText>
        ) : (
          !isRecharge && (
            <View key="btn" style={styles.cancelDraftFrame}>
              <AppButton
                style={styles.cancelDraftBtn}
                onPress={() => {
                  navigation.navigate('CancelOrder', {orderId: order?.orderId});
                }}
                disabled={!isValidation}
                disabledCanOnPress
                disabledOnPress={() => {
                  if (order?.state === 'completed') {
                    setShowSnackBar(
                      i18n.t(`his:draftButtonAlert:${order?.orderType}`),
                    );
                  } else if (order?.state === 'canceled') {
                    setShowSnackBar(i18n.t(`his:draftButtonAlert:canceled`));
                  } else if (isValidate && isExpiredDraft(order?.orderDate)) {
                    setShowSnackBar(i18n.t(`his:draftButtonAlert:auto`));
                  }
                }}
                disableStyle={styles.cancelDraftBtnDisabled}
                disableColor={colors.greyish}
                title={i18n.t('his:cancelDraft')}
                titleStyle={styles.cancelButtonText}
              />
            </View>
          )
        )}
      </View>
    );
  }, [isValidate, isValidation, method?.paymentMethod, navigation, order]);

  const pymId = useMemo(
    () =>
      order?.paymentList.find((p) => p.paymentGateway === 'iamport')?.remote_id,
    [order],
  );

  const showReciept = useCallback(
    (id?: string) => {
      async function getReceipt() {
        let receipt = null;
        // rokebi receipt
        if (id && account.token) {
          const rsp = await API.Payment.getRokebiPaymentReceipt({
            key: id,
            token: account.token,
          });
          if (rsp.result === 0 && rsp.objects[0]) {
            receipt = rsp.objects[0];
          }
        }

        if (!receipt && id) {
          // iamport receipt
          const resp = await API.Payment.getImpToken();
          if (resp.code === 0) {
            const rsp = await API.Payment.getMerchantId({
              id,
              token: resp.response?.access_token,
            });

            if (rsp.code === 0 && rsp.response?.receipt_url) {
              receipt = rsp.response;
            }
          }
        }

        if (receipt) navigation.navigate('Receipt', {order, receipt});
        else AppAlert.error(i18n.t('rcpt:fail'));
      }

      if (id) {
        getReceipt();
      }
    },
    [account.token, navigation, order],
  );

  const getNotiText = useCallback((orderParam: RkbOrder) => {
    switch (orderParam?.state) {
      case 'validation':
        return isExpiredDraft(orderParam?.orderDate)
          ? i18n.t('his:draftAutoNoti')
          : i18n.t('his:draftBeforeNoti');

      case 'completed':
        return i18n.t('his:draftAfterNoti');
      default:
        return '';
    }
  }, []);

  const headerNoti = useCallback(() => {
    if (!order || !order.orderItems || order?.orderType !== 'refundable')
      return <View />;

    const noti = getNotiText(order);

    if (!noti) return <View />;

    return (
      <View
        style={[
          styles.hearNotiFrame,
          {backgroundColor: isValidation ? colors.backRed : colors.backGrey},
        ]}>
        {
          // 자동 발권 처리 대기 상태는 아이콘 미표시
          <AppSvgIcon
            name={isValidation ? 'bannerMark' : 'bannerCheckBlue'}
            style={{marginRight: 9}}
          />
        }
        <AppStyledText
          text={noti}
          textStyle={{
            ...styles.headerNotiText,
            color: isValidation ? colors.redError : colors.blue,
          }}
          format={{
            b: [
              styles.headerNotiBoldText,
              {color: isValidation ? colors.redError : colors.blue},
            ],
          }}
        />
      </View>
    );
  }, [getNotiText, isValidation, order]);

  const getColor = useCallback((state?: OrderState) => {
    switch (state) {
      case 'canceled':
        return colors.redError;
      case 'completed':
      case 'validation':
        return colors.blue;
      default:
        return colors.black;
    }
  }, []);

  const headerInfo = useCallback(() => {
    if (!order || !order.orderItems) return <View />;

    const state = i18n.t(`pym:orderState:${order?.state}`);
    let label: string = order.orderItems[0].title;
    const etcCount = getCountItems(order?.orderItems, true);

    if (parseInt(etcCount, 10) > 0)
      label += i18n.t('his:etcCnt').replace('%%', etcCount);

    console.log('@@@@ order.orderItems :', order.orderItems);

    return (
      <View>
        <AppText style={styles.date}>
          {utils.toDateString(order?.orderDate, 'LLL')}
        </AppText>
        {/* <View style={styles.productTitle}>
          <AppText style={appStyles.bold18Text}>{label}</AppText>
        </View> */}
        <DropDownHeader
          title={label}
          style={{paddingTop: 16, paddingBottom: 20}}
          titleStyle={styles.productTitle}>
          <ProductDetailList
            style={{
              paddingBottom: 0,
              paddingHorizontal: 20,
            }}
            showPriceInfo
            product={product}
            orderItems={order?.orderItems}
          />
        </DropDownHeader>
        <View style={styles.bottomBar} />
        <LabelText
          key="orderId"
          style={styles.item}
          label={`${i18n.t('his:orderId')} ${order.orderNo}`}
          labelStyle={styles.label2}
          value={state}
          valueStyle={[styles.labelValue, {color: getColor(order?.state)}]}
        />
        <View style={styles.dividerTop} />
      </View>
    );
  }, [getColor, order]);

  if (!order || !order.orderItems) {
    return (
      <View style={styles.container}>
        <AppActivityIndicator visible={pending || loading} />
      </View>
    );
  }

  // [physical] shipmentState : draft(취소 가능) / ready shipped (취소 불가능)
  // [draft] state = validation && status = inactive , reserved (취소 가능)

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={i18n.t('his:detail')} />
      <ScrollView style={{flex: 1}}>
        {headerNoti()}
        {headerInfo()}
        {paymentInfo()}
      </ScrollView>
      <AppSnackBar
        visible={showSnackBar !== ''}
        onClose={() => setShowSnackBar('')}
        textMessage={showSnackBar}
        bottom={10}
        hideCancel
      />
      <View style={{flexDirection: 'row'}}>
        <AppButton
          style={[
            styles.secondaryButton,
            {backgroundColor: isValidation ? colors.white : colors.clearBlue},
          ]}
          type="secondary"
          title={i18n.t('his:receipt')}
          titleStyle={[
            styles.secondaryButtonText,
            {color: isValidation ? colors.black : colors.white},
          ]}
          disabled={!pymId}
          disableStyle={{borderWidth: 0, borderTopWidth: 0}}
          onPress={() => showReciept(pymId)}
        />

        {isValidation && (
          <AppButton
            style={styles.button}
            type="primary"
            title={i18n.t('his:draftRequest')}
            onPress={() => {
              navigation.navigate(
                order?.usageList.findIndex((elm) => elm.pid === 'ht') >= 0
                  ? 'DraftUs'
                  : 'Draft',
                {orderId: order?.orderId},
              );
            }}
          />
        )}
      </View>
      <AppActivityIndicator visible={pending || loading} />
    </SafeAreaView>
  );
};

export default connect(
  ({account, status, order, product}: RootState) => ({
    account,
    orders: order.orders,
    product,
    pending:
      status.pending[orderActions.getOrders.typePrefix] ||
      status.pending[orderActions.cancelDraftOrder.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
    },
  }),
)(PurchaseDetailScreen);
