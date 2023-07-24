import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppPrice from '@/components/AppPrice';
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
import {Currency} from '@/redux/api/productApi';
import utils from '@/redux/api/utils';
import {AccountModelState} from '@/redux/modules/account';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import {API} from '@/redux/api';

const {esimApp, esimCurrency} = Env.get();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  dropDownBox: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropDownIcon: {
    flexDirection: 'column',
    alignSelf: 'flex-end',
  },
  headerNoti: {
    marginHorizontal: 20,
    opacity: 0.6,
    backgroundColor: colors.noticeBackground,
    marginTop: 20,
    borderRadius: 10,
  },
  headerNotiText: {margin: 5},
  date: {
    ...appStyles.normal14Text,
    marginTop: 40,
    marginLeft: 20,
    color: colors.warmGrey,
  },
  normal16BlueTxt: {
    ...appStyles.normal16Text,
    color: colors.clearBlue,
    lineHeight: 24,
    letterSpacing: 0.24,
  },
  normal16RedTxt: {
    ...appStyles.normal18Text,
    color: colors.red,
    lineHeight: 24,
    letterSpacing: 0.24,
  },
  boldTitle: {
    ...appStyles.bold18Text,
    color: colors.black,
    lineHeight: 22,
    // marginTop: 20,
    alignSelf: 'center',
  },
  productTitle: {
    ...appStyles.bold18Text,
    lineHeight: 24,
    letterSpacing: 0.27,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginVertical: 10,
    maxWidth: isDeviceSize('small') ? '70%' : '80%',
  },
  cancelBtn: {
    backgroundColor: colors.white,
    borderRadius: 3,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    margin: 20,
    height: 48,
    justifyContent: 'center',
  },
  cancelDraftBtn: {
    borderWidth: 1,
    borderColor: colors.red,
    backgroundColor: colors.white,
    height: 36,
    justifyContent: 'center',
  },
  cancelDraftBtnDisabled: {
    borderWidth: 0,
    backgroundColor: colors.white,
    height: 36,
    justifyContent: 'center',
  },
  cancelInfo: {
    ...appStyles.normal14Text,
    marginHorizontal: 20,
    marginBottom: 40,
    color: colors.warmGrey,
    lineHeight: 28,
  },
  bar: {
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  thickBar: {
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    // marginVertical: 20,
    marginBottom: 20,
  },
  item: {
    marginHorizontal: 20,
    height: 36,
    alignItems: 'center',
    minWidth: '25%',
  },
  label: {
    ...appStyles.bold16Text,
    fontSize: isDeviceSize('small') ? 14 : 16,
    lineHeight: 36,
    letterSpacing: 0.26,
    color: colors.black,
  },
  labelValue: {
    ...appStyles.normal16Text,
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
  divider: {
    height: 10,
    backgroundColor: colors.whiteTwo,
  },
  label2: {
    ...appStyles.normal14Text,
    lineHeight: 36,
    color: colors.warmGrey,
  },
  row: {
    ...appStyles.itemRow,
    paddingHorizontal: 20,
    height: isDeviceSize('small') ? 30 : 36,
    alignItems: 'center',
    borderBottomWidth: 0,
    // marginBottom: 20,
  },
  fontWeightBold: {
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: 0.22,
  },
  alignCenter: {
    alignSelf: 'center',
    marginRight: 15,
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
  button: {
    ...appStyles.normal16Text,
    flex: 1,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: '#ffffff',
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

  pending: boolean;

  action: {
    order: OrderAction;
  };
};

export const isRokebiCash = (pg: string) =>
  ['rokebi_cash', 'rokebi_point'].includes(pg);

// const list = detail?.paymentList?.filter((item) =>
//   isRokebiCash(item.paymentGateway),
// );
// if (list?.[0]) {
//   setBalanceCharge(
//     list.reduce(
//       (acc, cur) => ({
//         value: acc.value + cur.amount.value,
//         currency: acc.currency,
//       }),
//       {
//         value: 0,
//         currency: list[0].amount.currency,
//       } as Currency,
//     ),
//   );
// }

export const countRokebiCash = (order: RkbOrder) => {
  const list = order?.paymentList?.filter((item) =>
    isRokebiCash(item.paymentGateway),
  );
  if (list?.[0]) {
    return list.reduce(
      (acc, cur) => ({
        value: acc.value + cur.amount.value,
        currency: acc.currency,
      }),
      {
        value: 0,
        currency: list[0].amount.currency,
      } as Currency,
    );
  }
};

const isUseNotiState = (state: OrderState) =>
  ['validation', 'completed'].includes(state);

const PurchaseDetailScreen: React.FC<PurchaseDetailScreenProps> = ({
  navigation,
  route,
  account,
  action,
  pending,
}) => {
  const [showPayment, setShowPayment] = useState(true);
  const [cancelPressed, setCancelPressed] = useState(false); // 결제취소버튼 클릭시 true
  const [disableBtn, setDisableBtn] = useState(false);
  const [borderBlue, setBorderBlue] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [billingAmt, setBillingAmt] = useState<Currency>();
  const [method, setMethod] = useState<RkbPayment>();
  const [balanceCharge, setBalanceCharge] = useState<Currency>();
  const [order, setOrder] = useState<RkbOrder>();

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('his:detail')} />,
    });
  }, [navigation]);

  useEffect(() => {
    const {detail} = route.params;

    Analytics.trackEvent('Page_View_Count', {page: 'Purchase Detail'});

    setOrder(detail);
    setIsCanceled(detail?.state === 'canceled' || false);
    setBillingAmt(utils.addCurrency(detail?.totalPrice, detail?.dlvCost));
    setMethod(
      detail?.paymentList?.find((item) => !isRokebiCash(item.paymentGateway)),
    );

    setBalanceCharge(countRokebiCash(detail));
  }, [account, route.params]);

  useEffect(() => {
    if (cancelPressed) {
      setTimeout(() => {
        setDisableBtn(true);
        setIsCanceled(true);
      }, 3000);
    }
  }, [cancelPressed]);

  const cancelOrder = useCallback(
    (o: RkbOrder) => {
      const {token} = account;

      setBorderBlue(true);

      AppAlert.confirm(i18n.t('his:cancel'), i18n.t('his:cancelAlert'), {
        ok: () => {
          action.order.cancelAndGetOrder({orderId: o.orderId, token}).then(
            ({payload: resp}) => {
              // getOrderById 에 대한 결과 확인
              // 기존에 취소했는데, 처리가 안되어 다시 취소버튼을 누르게 된 경우
              // 배송상태가 변화되었는데 refresh 되지 않아 취소버튼을 누른 경우 등
              if (resp.result === 0) setCancelPressed(true);
              else if (resp.result > 0) {
                setOrder(resp.objects[0]);

                const canceled = resp.objects[0].state === 'canceled';
                setIsCanceled(canceled);

                if (canceled) AppAlert.info(i18n.t('his:alreadyCanceled'));
                else AppAlert.info(i18n.t('his:refresh'));
              } else {
                AppAlert.info(i18n.t('his:cancelFail'));
              }
            },
            (err) => {
              console.log('error', err);
              AppAlert.info(i18n.t('his:cancelError'));
            },
          );

          setBorderBlue(false);
        },
        cancel: () => {
          setBorderBlue(false);
        },
      });
    },
    [account, action.order],
  );

  const paymentInfo = useCallback(() => {
    if (!order) return null;

    const elapsedDay = order.orderDate
      ? moment().diff(moment(order.orderDate), 'days')
      : 0;
    const paidAmount = method?.amount || utils.toCurrency(0, esimCurrency);
    const isRecharge =
      order.orderItems?.find((item) =>
        item.title.includes(i18n.t('sim:rechargeBalance')),
      ) || false;
    const isUsed =
      order.usageList?.find(
        (value) => value.status !== 'R' && value.status !== 'I',
      ) || false;
    const usedOrExpired = isUsed || elapsedDay > 7;
    const activateCancelBtn =
      (order.state === 'draft' || order.state === 'validation') && !isUsed;
    const disabled =
      isCanceled || !activateCancelBtn || cancelPressed || elapsedDay > 7;

    // eslint-disable-next-line no-nested-ternary
    const infoText = isCanceled
      ? i18n.t('his:afterCancelInfo')
      : usedOrExpired
      ? i18n.t('his:usedOrExpiredInfo')
      : i18n.t('his:dataCancelInfo');

    return (
      <View>
        <View style={styles.thickBar} />
        {order.orderItems &&
          order.orderItems.map((item, idx) => (
            <LabelText
              key={utils.generateKey(idx.toString())}
              style={styles.item}
              label={`${item.title}  ×  ${item.qty}`}
              labelStyle={styles.label}
              format="price"
              valueStyle={appStyles.roboto16Text}
              value={item.price}
              balanceStyle={[styles.normal16BlueTxt, {color: colors.black}]}
              currencyStyle={[styles.normal16BlueTxt, {color: colors.black}]}
            />
          ))}
        {/* {!esimApp && ( */}
        <View>
          <View style={styles.bar} />
          <LabelText
            key="productAmount"
            style={styles.item}
            label={i18n.t('his:productAmount')}
            labelStyle={styles.label2}
            format="price"
            valueStyle={appStyles.roboto16Text}
            value={order.totalPrice}
            currencyStyle={[styles.normal16BlueTxt, {color: colors.black}]}
            balanceStyle={[styles.normal16BlueTxt, {color: colors.black}]}
          />
        </View>
        {/* )} */}

        {!isRecharge && (
          <LabelText
            key="pymBalance"
            style={styles.item}
            label={i18n.t('pym:deductBalance')}
            format="price"
            labelStyle={styles.label2}
            valueStyle={appStyles.roboto16Text}
            value={balanceCharge}
            balanceStyle={[styles.normal16BlueTxt, {color: colors.black}]}
            currencyStyle={[styles.normal16BlueTxt, {color: colors.black}]}
          />
        )}
        <View style={styles.bar} />
        <View style={[styles.row, {marginBottom: 5}]}>
          <AppText style={appStyles.normal16Text}>
            {i18n.t('cart:totalCost')}{' '}
          </AppText>
          <View
            style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <AppPrice
              price={paidAmount}
              balanceStyle={[
                appStyles.price,
                styles.fontWeightBold,
                {marginHorizontal: 5},
              ]}
              currencyStyle={[styles.normal16BlueTxt, {color: colors.black}]}
            />
          </View>
        </View>

        {!isRecharge && !esimApp ? (
          <AppButton
            style={[
              styles.cancelBtn,
              {
                borderColor: borderBlue ? colors.clearBlue : colors.lightGrey,
              },
            ]}
            disableBackgroundColor={colors.whiteTwo}
            disableColor={pending ? colors.whiteTwo : colors.greyish}
            disabled={disabled || disableBtn || pending}
            onPress={() => cancelOrder(order)}
            title={i18n.t('his:cancel')}
            titleStyle={styles.normal16BlueTxt}
          />
        ) : (
          <View style={{marginBottom: 20}} />
        )}

        {!isRecharge && !esimApp && (
          <AppText style={styles.cancelInfo}>
            {!isRecharge && !esimApp && infoText}
          </AppText>
        )}

        {/* */}
        {!isRecharge && (
          <AppButton
            style={styles.cancelDraftBtn}
            onPress={() => {
              navigation.navigate('CancelOrder', {order});
              console.log('취소 화면 미구현 ');
            }}
            disabled={order.state !== 'validation'}
            disableStyle={styles.cancelDraftBtnDisabled}
            disableColor={colors.gray}
            title={i18n.t('his:cancelDraft')}
            titleStyle={styles.normal16RedTxt}
          />
        )}
      </View>
    );
  }, [
    balanceCharge,
    borderBlue,
    cancelOrder,
    cancelPressed,
    disableBtn,
    isCanceled,
    method?.amount,
    order,
    pending,
  ]);

  const pymId = useMemo(
    () =>
      order?.paymentList.find((p) => p.paymentGateway === 'iamport')?.remote_id,
    [order],
  );

  const showReciept = useCallback(
    (id?: string) => {
      async function getReceipt() {
        let receipt = null;
        if (id?.startsWith('r_')) {
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

  const headerNoti = useCallback(() => {
    if (!order || !order.orderItems || !isUseNotiState(order?.state))
      return <View />;

    const getNoti = () => {
      switch (order?.state) {
        case 'validation':
          return i18n.t('his:draftBeforeNoti');
        case 'completed':
          return i18n.t('his:draftAfterNoti');
        default:
          return '';
      }
    };

    return (
      <View
        style={[
          styles.headerNoti,
          {
            backgroundColor:
              order?.state === 'validation'
                ? colors.backRed
                : colors.veryLightBlue,
          },
        ]}>
        <AppText style={styles.headerNotiText}>{getNoti()}</AppText>
      </View>
    );
  }, [order]);

  const headerInfo = useCallback(() => {
    if (!order || !order.orderItems) return <View />;

    const pg = method?.paymentMethod || i18n.t('pym:balance');
    let label: string = order.orderItems[0].title;
    if (order.orderItems.length > 1)
      label += i18n
        .t('his:etcCnt')
        .replace('%%', (order.orderItems.length - 1).toString());

    return (
      <View>
        <AppText style={styles.date}>
          {utils.toDateString(order?.orderDate)}
        </AppText>
        <View style={styles.productTitle}>
          {isCanceled && (
            <AppText style={[appStyles.bold18Text, {color: colors.tomato}]}>
              {`(${i18n.t('his:cancel')})`}{' '}
            </AppText>
          )}
          <AppText style={appStyles.bold18Text}>{label}</AppText>
        </View>
        <View style={styles.bar} />
        <LabelText
          key="orderId"
          style={styles.item}
          label={i18n.t('his:orderId')}
          labelStyle={styles.label2}
          value={order.orderNo}
          valueStyle={styles.labelValue}
        />
        <LabelText
          key="pymMethod"
          style={[styles.item, {marginBottom: 20}]}
          label={i18n.t('pym:method')}
          labelStyle={styles.label2}
          value={pg}
          valueStyle={styles.labelValue}
        />
        <View style={styles.dividerTop} />
      </View>
    );
  }, [isCanceled, method?.paymentMethod, order]);

  if (!order || !order.orderItems) return <View />;

  // [physical] shipmentState : draft(취소 가능) / ready shipped (취소 불가능)
  // [draft] state = validation && status = inactive , reserved (취소 가능)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{flex: 1}}>
        {headerNoti()}
        {headerInfo()}
        <Pressable
          style={styles.dropDownBox}
          onPress={() => setShowPayment((prev) => !prev)}>
          <AppText style={styles.boldTitle}>
            {i18n.t('his:paymentDetail')}
          </AppText>
          <View style={{flexDirection: 'row'}}>
            {!showPayment && (
              <AppText
                style={[
                  styles.normal16BlueTxt,
                  styles.fontWeightBold,
                  styles.alignCenter,
                ]}>
                {utils.price(billingAmt)}
              </AppText>
            )}
            <AppButton
              style={{backgroundColor: colors.white, height: 70}}
              iconName={showPayment ? 'iconArrowUp' : 'iconArrowDown'}
              iconStyle={styles.dropDownIcon}
              onPress={() => setShowPayment((prev) => !prev)}
            />
          </View>
        </Pressable>
        {showPayment && paymentInfo()}
        <View style={styles.divider} />
      </ScrollView>
      <AppSnackBar
        visible={cancelPressed}
        onClose={() => setCancelPressed(false)}
        textMessage={i18n.t('his:cancelSuccess')}
        bottom={10}
      />
      <View style={{flexDirection: 'row'}}>
        <AppButton
          style={styles.secondaryButton}
          type="secondary"
          title={i18n.t('his:receipt')}
          titleStyle={styles.secondaryButtonText}
          disabled={!pymId}
          onPress={() => showReciept(pymId)}
        />

        {order?.state === 'validation' && (
          <AppButton
            style={[styles.button]}
            type="primary"
            title={i18n.t('his:draftRequest')}
            onPress={() => {
              navigation.navigate('Draft', {order});
            }}
          />
        )}
      </View>
      <AppActivityIndicator visible={pending} />
    </SafeAreaView>
  );
};

export default connect(
  ({account, status}: RootState) => ({
    account,
    pending:
      status.pending[orderActions.getOrders.typePrefix] ||
      status.pending[orderActions.cancelAndGetOrder.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
    },
  }),
)(PurchaseDetailScreen);
