import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
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

const {esimCurrency, esimGlobal} = Env.get();

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
  normal16BlueTxt: {
    ...appStyles.normal16Text,
    color: colors.clearBlue,
    lineHeight: 24,
    letterSpacing: 0.24,
  },
  cancelButtonText: {
    ...appStyles.medium14,
    color: colors.blue,
    lineHeight: 24,
  },
  boldTitle: {
    ...appStyles.bold18Text,
    color: colors.black,
    lineHeight: 22,
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
  cancelDraftFrame: {
    marginHorizontal: 20,
    marginBottom: 26,
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
  thickBar: {
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    marginHorizontal: 20,
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
    backgroundColor: colors.clearBlue,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    color: colors.white,
  },
  secondaryButtonText: {
    ...appStyles.normal18Text,
    textAlign: 'center',
    color: colors.white,
  },
  button: {
    ...appStyles.normal16Text,
    flex: 1,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: colors.white,
  },
  priceStyle: {
    ...appStyles.bold22Text,
    color: colors.blue,
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

  pending: boolean;

  action: {
    order: OrderAction;
  };
};

export const isRokebiCash = (pg: string) =>
  ['rokebi_cash', 'rokebi_point'].includes(pg);

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

const PurchaseDetailScreen: React.FC<PurchaseDetailScreenProps> = ({
  navigation,
  route,
  account,
  orders,
  pending,
  action,
}) => {
  const [showPayment, setShowPayment] = useState(true);
  const [method, setMethod] = useState<RkbPayment>();
  const [balanceCharge, setBalanceCharge] = useState<Currency>();
  const [order, setOrder] = useState<RkbOrder>();
  const [showSnackBar, setShowSnackBar] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const paidAmount = useMemo(
    () => method?.amount || utils.toCurrency(0, esimCurrency),
    [method?.amount],
  );

  const isValidate = useMemo(
    () => order?.state === 'validation',
    [order?.state],
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

        setBalanceCharge(countRokebiCash(detail));
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
      order.orderItems?.find((item) =>
        item.title.includes(i18n.t('sim:rechargeBalance')),
      ) || false;
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
            deduct={balanceCharge?.value}
            balanceStyle={[styles.normal16BlueTxt, {color: colors.black}]}
            currencyStyle={[styles.normal16BlueTxt, {color: colors.black}]}
          />
        )}
        <View style={styles.bar} />
        <View style={[styles.row, {marginBottom: 5}]}>
          <AppText style={appStyles.normal16Text}>
            {i18n.t('cart:totalCost')}
          </AppText>
          <View
            style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <AppPrice
              price={paidAmount}
              balanceStyle={[styles.priceStyle, {marginRight: 5}]}
              currencyStyle={styles.priceStyle}
            />
          </View>
        </View>

        {!isRecharge && <View style={{marginBottom: 20}} />}

        {!isRecharge && (
          <View style={styles.cancelDraftFrame}>
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
        )}
      </View>
    );
  }, [
    balanceCharge?.value,
    isValidate,
    isValidation,
    navigation,
    order,
    paidAmount,
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
          {
            backgroundColor: isValidation ? colors.backRed : colors.backGrey,
          },
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
              {
                color: isValidation ? colors.redError : colors.blue,
              },
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

    const pg = method?.paymentMethod || i18n.t('pym:balance');
    const state = i18n.t(`pym:orderState:${order?.state}`);
    let label: string = order.orderItems[0].title;
    if (order.orderItems.length > 1)
      label += i18n
        .t('his:etcCnt')
        .replace('%%', getCountItems(order?.orderItems, true));
    return (
      <View>
        <AppText style={styles.date}>
          {utils.toDateString(
            order?.orderDate,
            esimGlobal ? 'LLL' : 'YYYY년 MM월 DD일 A h:mm',
          )}
        </AppText>
        <View style={styles.productTitle}>
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
          style={styles.item}
          label={i18n.t('pym:method')}
          labelStyle={styles.label2}
          value={pg}
          valueStyle={styles.labelValue}
        />
        <LabelText
          key="orderState"
          style={[styles.item, {marginBottom: 20}]}
          label={i18n.t('pym:orderState')}
          labelStyle={styles.label2}
          value={state}
          valueStyle={[styles.labelValue, {color: getColor(order?.state)}]}
        />
        <View style={styles.dividerTop} />
      </View>
    );
  }, [getColor, method?.paymentMethod, order]);

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
                {utils.price(paidAmount)}
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
          style={styles.secondaryButton}
          type="secondary"
          title={i18n.t('his:receipt')}
          titleStyle={styles.secondaryButtonText}
          disabled={!pymId}
          disableStyle={{borderWidth: 0}}
          onPress={() => showReciept(pymId)}
        />

        {isValidation && (
          <AppButton
            style={styles.button}
            type="primary"
            title={i18n.t('his:draftRequest')}
            onPress={() => {
              navigation.navigate('Draft', {orderId: order?.orderId});
            }}
          />
        )}
      </View>
      <AppActivityIndicator visible={pending || loading} />
    </SafeAreaView>
  );
};

export default connect(
  ({account, status, order}: RootState) => ({
    account,
    orders: order.orders,
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
