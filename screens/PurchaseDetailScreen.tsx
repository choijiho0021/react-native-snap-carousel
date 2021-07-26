import React, {Component} from 'react';
import _ from 'underscore';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import SnackBar from 'react-native-snackbar-component';
import Analytics from 'appcenter-analytics';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import {API} from '@/redux/api';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AppAlert from '@/components/AppAlert';
import AppButton from '@/components/AppButton';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import LabelText from '@/components/LabelText';
import {isDeviceSize, windowHeight} from '@/constants/SliderEntry.style';
import LabelTextTouchable from '@/components/LabelTextTouchable';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import {
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import AppIcon from '@/components/AppIcon';
import {isAndroid} from '@/components/SearchBarAnimation/utils';
import AddressCard from '@/components/AddressCard';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import {timer} from '@/constants/Timer';
import Env from '@/environment';
import {RootState} from '@/redux';
import utils from '@/redux/api/utils';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RkbProfile} from '@/redux/api/profileApi';
import {RkbOrder} from '@/redux/api/orderApi';
import {HomeStackParamList} from '@/navigation/navigation';

const {esimApp} = Env.get();

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
  alias: {
    ...appStyles.bold18Text,
    // fontFamily: "AppleSDGothicNeo",
    marginVertical: 20,
    marginHorizontal: 20,
    color: colors.black,
  },
  profileTitle: {
    marginBottom: 6,
    marginLeft: 0,
    flex: 1,
    flexDirection: 'row',
  },
  profileTitleText: {
    color: colors.black,
    alignItems: 'flex-start',
    marginHorizontal: 20,
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  basicAddr: {
    ...appStyles.normal12Text,
    width: 52,
    height: isAndroid() ? 15 : 12,
    lineHeight: isAndroid() ? 15 : 12,
    fontSize: isAndroid() ? 11 : 12,
    color: colors.clearBlue,
    alignSelf: 'center',
  },
  basicAddrBox: {
    width: 68,
    height: 22,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.clearBlue,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  addrCard: {
    marginHorizontal: 20,
  },
  addrCardText: {
    ...appStyles.normal14Text,
    color: colors.black,
    lineHeight: 24,
  },
  title: {
    ...appStyles.bold18Text,
    height: 21,
    // fontFamily: "AppleSDGothicNeo",
    marginBottom: isDeviceSize('small') ? 10 : 20,
    marginHorizontal: 20,
    color: colors.black,
  },
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
  arrowIcon: {
    justifyContent: 'center',
    marginHorizontal: isDeviceSize('small') ? 15 : 20,
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
  cancelInfo: {
    ...appStyles.normal14Text,
    marginHorizontal: 20,
    marginBottom: 40,
    color: colors.warmGrey,
    lineHeight: 28,
  },
  deliveryTitle: {
    ...appStyles.normal18Text,
    color: colors.warmGrey,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  companyInfoTitle: {
    ...appStyles.normal14Text,
    lineHeight: 36,
    letterSpacing: 0.23,
    color: colors.warmGrey,
    width: '22%',
  },
  deliveryStatus: {
    ...appStyles.normal16Text,
    color: colors.greyishTwo,
    letterSpacing: 0.26,
    alignSelf: 'center',
  },
  bar: {
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginVertical: 30,
  },
  thickBar: {
    borderBottomColor: colors.black,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    // marginVertical: 20,
    marginBottom: 30,
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
  divider: {
    // marginTop: 25,
    // marginBottom: 20,
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
    marginBottom: 20,
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

  action: {
    order: OrderAction;
  };
};

type PurchaseDetailScreenState = {
  showPayment: boolean;
  showDelivery: boolean;
  cancelPressed: boolean;
  disableBtn: boolean;
  scrollHeight: number;
  borderBlue: boolean;
  isCanceled: boolean;

  balanceCharge?: number;
  billingAmt?: number;
  orderId?: number;
  profile?: RkbProfile;
  trackingCompany?: string;
  trackingCode?: string;
  shipmentState?: string;
  memo?: string;
} & RkbOrder;

class PurchaseDetailScreen extends Component<
  PurchaseDetailScreenProps,
  PurchaseDetailScreenState
> {
  snackRef: React.RefObject<SnackBar>;

  constructor(props: PurchaseDetailScreenProps) {
    super(props);

    this.state = {
      showPayment: true,
      showDelivery: true,
      cancelPressed: false, // 결제취소버튼 클릭시 true
      disableBtn: false,
      scrollHeight: 0,
      borderBlue: false,
      isCanceled: false,
    };

    this.snackRef = React.createRef();

    this.onPressPayment = this.onPressPayment.bind(this);
    this.onPressDelivery = this.onPressDelivery.bind(this);
    this.headerInfo = this.headerInfo.bind(this);
    this.paymentInfo = this.paymentInfo.bind(this);
    this.deliveryInfo = this.deliveryInfo.bind(this);
    this.profile = this.profile.bind(this);
    this.address = this.address.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('his:detail')} />,
    });

    const {detail} = this.props.route.params;

    Analytics.trackEvent('Page_View_Count', {page: 'Purchase Detail'});

    this.setState({
      ...detail,
      isCanceled: detail?.state === 'canceled' || false,
      billingAmt: (detail?.totalPrice || 0) + (detail?.dlvCost || 0),
      method: detail?.paymentList?.find(
        (item) => item.paymentGateway !== 'rokebi_cash',
      ),
      totalCnt: detail?.orderItems.reduce((acc, cur) => acc + cur.qty, 0) || 0,
      balanceCharge:
        detail?.paymentList?.find(
          (item) => item.paymentGateway === 'rokebi_cash',
        )?.amount || 0,
    });

    // load Profile by profile_id
    const {token} = this.props.account;
    if (detail?.orderType === 'physical') {
      API.Profile.getCustomerProfileById({id: detail.profileId, token}).then(
        (resp) => {
          if (resp.result === 0) this.profile(resp);
        },
        (err) => {
          console.log('Failed to get profile', err);
        },
      );
    }
  }

  componentDidUpdate() {
    if (this.state.cancelPressed) {
      setTimeout(() => {
        this.setState({
          disableBtn: true,
          isCanceled: true,
        });
      }, 3000);
    }
  }

  onScroll = (height: number) => {
    if (this.state.cancelPressed) {
      this.setState({
        scrollHeight: height,
      });
    }
  };

  onPressPayment() {
    this.setState((prevState) => ({
      showPayment: !prevState.showPayment,
    }));
  }

  onPressDelivery() {
    this.setState((prevState) => ({
      showDelivery: !prevState.showDelivery,
    }));
  }

  profile(profile) {
    this.setState({
      profile: profile.objects[0],
    });
  }

  cancelOrder() {
    let state;
    let shipmentState;
    let isCanceled;
    let disableBtn;

    const {token} = this.props.account;

    this.setState({borderBlue: true});

    AppAlert.confirm(i18n.t('his:cancel'), i18n.t('his:cancelAlert'), {
      ok: () => {
        this.props.action.order
          .cancelAndGetOrder({orderId: this.state.orderId, token})
          .then(
            ({payload: resp}) => {
              // getOrderById 에 대한 결과 확인
              // 기존에 취소했는데, 처리가 안되어 다시 취소버튼을 누르게 된 경우
              // 배송상태가 변화되었는데 refresh 되지 않아 취소버튼을 누른 경우 등
              if (resp.result === 0) this.setState({cancelPressed: true});
              else if (resp.result > 0) {
                state = resp.objects[0].state;
                shipmentState = resp.objects[0].shipmentState;
                isCanceled =
                  shipmentState === API.Order.shipmentState.CANCEL ||
                  state === 'canceled';
                disableBtn =
                  shipmentState === API.Order.shipmentState.READY ||
                  shipmentState === API.Order.shipmentState.SHIP;
                this.setState({
                  ...state,
                  shipmentState,
                  isCanceled,
                  disableBtn,
                });

                if (isCanceled) AppAlert.info(i18n.t('his:alreadyCanceled'));
                else {
                  if (disableBtn) AppAlert.info(i18n.t('his:deliveryProgress'));
                  AppAlert.info(i18n.t('his:refresh'));
                }
              } else {
                AppAlert.info(i18n.t('his:cancelFail'));
              }
            },
            (err) => {
              console.log('error', err);
              AppAlert.info(i18n.t('his:cancelError'));
            },
          );

        this.setState({borderBlue: false});
      },
      cancel: () => {
        this.setState({borderBlue: false});
      },
    });
  }

  address() {
    const {profile} = this.state;
    return (
      // 주소
      profile && (
        <View style={{marginBottom: 30}}>
          <View style={styles.profileTitle}>
            <Text style={styles.profileTitleText}>{profile.alias}</Text>
            {profile.isBasicAddr && (
              <View style={styles.basicAddrBox}>
                <Text style={styles.basicAddr}>{i18n.t('addr:basicAddr')}</Text>
              </View>
            )}
          </View>
          <AddressCard
            textStyle={styles.addrCardText}
            mobileStyle={[styles.addrCardText, {color: colors.warmGrey}]}
            style={styles.addrCard}
            profile={profile}
          />
        </View>
      )
    );
  }

  deliveryInfo() {
    const {trackingCompany, trackingCode, shipmentState, isCanceled, memo} =
      this.state;

    const ship = API.Order.shipmentState;

    return (
      <View>
        <View style={styles.thickBar} />
        <Text style={styles.deliveryTitle}>{i18n.t('his:shipmentState')}</Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginHorizontal: 20,
          }}>
          <Text
            style={[
              styles.deliveryStatus,
              (_.isEmpty(shipmentState) || shipmentState === ship.DRAFT) && {
                color: colors.clearBlue,
              },
            ]}>
            {i18n.t('his:paymentCompleted')}
          </Text>
          <AppIcon name="iconArrowRight" style={styles.arrowIcon} />
          <Text
            style={[
              styles.deliveryStatus,
              shipmentState === ship.READY && {color: colors.clearBlue},
            ]}>
            {i18n.t('his:ready')}
          </Text>
          <AppIcon name="iconArrowRight" style={styles.arrowIcon} />
          <Text
            style={[
              styles.deliveryStatus,
              shipmentState === ship.SHIP && {color: colors.clearBlue},
            ]}>
            {i18n.t('his:shipped')}
          </Text>
        </View>

        <View style={styles.bar} />
        <Text style={styles.deliveryTitle}>{i18n.t('his:addressInfo')}</Text>
        {
          // !_.isEmpty(this.state.profile) && this.address()
          this.address()
        }
        <View style={[styles.bar, {marginTop: 0}]} />
        <Text style={styles.deliveryTitle}>{i18n.t('his:memo')}</Text>
        <View style={{marginHorizontal: 20, marginBottom: 40}}>
          {!_.isEmpty(memo) &&
            _.isEmpty(
              API.Order.deliveryText.find((item) => item.value === memo),
            ) && (
              <Text style={[styles.label2, {marginBottom: 5, lineHeight: 24}]}>
                {i18n.t('his:input')}
              </Text>
            )}
          <Text style={appStyles.normal16Text}>
            {_.isEmpty(memo) ? i18n.t('his:notSelected') : memo}
          </Text>
        </View>

        {!isCanceled && shipmentState === API.Order.shipmentState.SHIP && (
          <View style={{marginBottom: 40}}>
            <View style={[styles.bar, {marginTop: 0}]} />
            <Text style={styles.deliveryTitle}>
              {i18n.t('his:companyInfo')}
            </Text>
            <LabelText
              key="trackingCompany"
              style={styles.item}
              format="shortDistance"
              label={i18n.t('his:trackingCompany')}
              labelStyle={styles.companyInfoTitle}
              value={trackingCompany}
              valueStyle={[styles.labelValue, {justifyContent: 'flex-start'}]}
            />
            <LabelText
              key="tel"
              style={styles.item}
              format="shortDistance"
              label={i18n.t('his:tel')}
              labelStyle={styles.companyInfoTitle}
              value={utils.toPhoneNumber('12341234')} // 택배사 전화번호
              valueStyle={styles.labelValue}
            />
            <LabelTextTouchable
              onPress={() =>
                this.props.navigation.navigate('SimpleText', {
                  key: 'info',
                  title: '',
                  mode: 'uri',
                  text: API.Order.deliveryTrackingUrl('CJ', trackingCode),
                })
              }
              label={i18n.t('his:trackingCode')}
              labelStyle={[
                styles.companyInfoTitle,
                {marginLeft: 20, width: '20%'},
              ]}
              format="shortDistance"
              value={trackingCode}
              valueStyle={[
                styles.labelValue,
                {color: colors.clearBlue, textDecorationLine: 'underline'},
              ]}
            />
          </View>
        )}
      </View>
    );
  }

  paymentInfo() {
    const {
      orderDate,
      orderItems,
      orderType,
      usageList,
      totalPrice,
      state,
      shipmentState,
      dlvCost,
      balanceCharge,
      isCanceled,
      method,
    } = this.state || {};

    const elapsedDay = Math.ceil(
      (new Date() - new Date(orderDate)) / (24 * 60 * 60 * 1000),
    );
    const paidAmount = method?.amount || 0;
    const isRecharge =
      orderItems.find((item) =>
        item.title.includes(i18n.t('sim:rechargeBalance')),
      ) || false;
    const isUsed =
      usageList?.find(
        (value) => value.status !== 'R' && value.status !== 'I',
      ) || false;
    const usedOrExpired = isUsed || elapsedDay > 7;
    const activateCancelBtn =
      orderType === 'physical'
        ? shipmentState === API.Order.shipmentState.DRAFT
        : (state === 'draft' || state === 'validation') && !isUsed;
    const disableBtn =
      isCanceled ||
      !activateCancelBtn ||
      this.state.cancelPressed ||
      elapsedDay > 7;

    let infoText;

    if (isCanceled) infoText = i18n.t('his:afterCancelInfo');
    else if (orderType === 'physical') infoText = i18n.t('his:simCancelInfo');
    else if (usedOrExpired) infoText = i18n.t('his:usedOrExpiredInfo');
    else i18n.t('his:dataCancelInfo');

    return (
      <View>
        <View style={styles.thickBar} />
        {orderItems &&
          orderItems.map((item, idx) => (
            <LabelText
              key={idx.toString()}
              style={styles.item}
              label={`${item.title}  ×  ${item.qty} ${i18n.t('qty')}`}
              labelStyle={styles.label}
              format="price"
              valueStyle={appStyles.roboto16Text}
              value={item.price}
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
            value={totalPrice}
          />
        </View>
        {/* )} */}

        {orderType === 'physical' && (
          <LabelText
            key="dvlCost"
            style={styles.item}
            label={i18n.t('cart:dlvCost')}
            labelStyle={styles.label2}
            format="price"
            valueStyle={appStyles.roboto16Text}
            value={dlvCost}
          />
        )}
        {!isRecharge && (
          <LabelText
            key="pymBalance"
            style={styles.item}
            label={i18n.t('pym:deductBalance')}
            format="price"
            labelStyle={styles.label2}
            valueStyle={appStyles.roboto16Text}
            value={balanceCharge || 0}
          />
        )}
        <View style={styles.bar} />
        <View style={[styles.row, {marginBottom: 5}]}>
          <Text style={[appStyles.normal16Text]}>
            {i18n.t('cart:totalCost')}{' '}
          </Text>
          <View
            style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Text style={[styles.normal16BlueTxt, {color: colors.black}]}>
              {i18n.t('total')}
            </Text>
            <Text
              style={[
                appStyles.price,
                styles.fontWeightBold,
                {marginHorizontal: 5},
              ]}>
              {utils.numberToCommaString(paidAmount)}
            </Text>
            <Text style={[styles.normal16BlueTxt, {color: colors.black}]}>
              {i18n.t('won')}
            </Text>
          </View>
        </View>
        {!isRecharge && !esimApp ? (
          <AppButton
            style={[
              styles.cancelBtn,
              {
                borderColor: this.state.borderBlue
                  ? colors.clearBlue
                  : colors.lightGrey,
              },
            ]}
            disableBackgroundColor={colors.whiteTwo}
            disableColor={this.state.pending ? colors.whiteTwo : colors.greyish}
            disabled={disableBtn || this.state.disableBtn || this.state.pending}
            onPress={() => this.cancelOrder()}
            title={i18n.t('his:cancel')}
            titleStyle={styles.normal16BlueTxt}
          />
        ) : (
          <View style={{marginBottom: 20}} />
        )}
        <Text style={styles.cancelInfo}>
          {!isRecharge && !esimApp && infoText}
        </Text>
      </View>
    );
  }

  headerInfo() {
    const {orderNo, orderDate, orderItems, isCanceled, method} =
      this.state || {};

    const pg = !_.isEmpty(method)
      ? method.paymentMethod
      : i18n.t('pym:balance');
    let label;

    if (_.isEmpty(orderItems)) return <View />;

    label = orderItems[0].title;
    if (orderItems.length > 1)
      label += i18n.t('his:etcCnt').replace('%%', orderItems.length - 1);

    return (
      <View>
        <Text style={styles.date}>
          {orderDate?.split('+')[0].replace('T', ' ')}
        </Text>
        <View style={styles.productTitle}>
          {isCanceled && (
            <Text style={[appStyles.bold18Text, {color: colors.tomato}]}>
              {`(${i18n.t('his:cancel')})`}{' '}
            </Text>
          )}
          <Text style={appStyles.bold18Text}>{label}</Text>
        </View>
        <View style={styles.bar} />
        <LabelText
          key="orderId"
          style={styles.item}
          label={i18n.t('his:orderId')}
          labelStyle={styles.label2}
          value={orderNo}
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
        <View style={styles.divider} />
      </View>
    );
  }

  render() {
    const {
      orderItems,
      orderType,
      isCanceled,
      shipmentState,
      billingAmt,
      showPayment,
      showDelivery,
      cancelPressed,
      totalCnt,
    } = this.state || {};
    const ship = API.Order.shipmentState;
    let shipStatus;

    if (_.isEmpty(orderItems)) return <View />;

    // [physical] shipmentState : draft(취소 가능) / ready shipped (취소 불가능)
    // [draft] state = validation && status = inactive , reserved (취소 가능)

    if (_.isEmpty(shipmentState) || shipmentState === ship.DRAFT)
      shipStatus = i18n.t('his:paymentCompleted');
    else if (shipmentState === ship.READY) shipStatus = i18n.t('his:ready');
    else i18n.t('his:shipped');

    return (
      <ScrollView
        style={styles.container}
        onScroll={({
          nativeEvent: {
            contentOffset: {y},
          },
        }) => this.onScroll(y)}
        scrollEventThrottle={16}>
        <SafeAreaView forceInset={{top: 'never', bottom: 'always'}}>
          <SnackBar
            ref={this.snackRef}
            visible={cancelPressed}
            backgroundColor={colors.clearBlue}
            textMessage={i18n.t('his:cancelSuccess')}
            messageColor={colors.white}
            position="top"
            top={this.state.scrollHeight + windowHeight / 2}
            containerStyle={{borderRadius: 3, height: 48, marginHorizontal: 10}}
            actionText="X"
            actionStyle={{paddingHorizontal: 20}}
            accentColor={colors.white}
            autoHidingTime={timer.snackBarHidingTime}
            onClose={() => this.setState({cancelPressed: false})}
            // distanceCallback={(distance) => {console.log('distance', distance)}}
            actionHandler={() => {
              this.snackRef.current.hideSnackbar();
            }}
          />
          {this.headerInfo()}
          <Pressable style={styles.dropDownBox} onPress={this.onPressPayment}>
            <Text style={styles.boldTitle}>{i18n.t('his:paymentDetail')}</Text>
            <View style={{flexDirection: 'row'}}>
              {!showPayment && (
                <View style={[styles.alignCenter, {flexDirection: 'row'}]}>
                  <Text style={styles.normal16BlueTxt}>{i18n.t('total')}</Text>
                  <Text style={[styles.normal16BlueTxt, styles.fontWeightBold]}>
                    {totalCnt}
                  </Text>
                  <Text style={styles.normal16BlueTxt}>{i18n.t('qty')} / </Text>
                  <Text style={[styles.normal16BlueTxt, styles.fontWeightBold]}>
                    {utils.numberToCommaString(billingAmt)}
                  </Text>
                  <Text style={styles.normal16BlueTxt}>{i18n.t('won')}</Text>
                </View>
              )}
              <AppButton
                style={{backgroundColor: colors.white, height: 70}}
                iconName={showPayment ? 'iconArrowUp' : 'iconArrowDown'}
                iconStyle={styles.dropDownIcon}
                onPress={this.onPressPayment}
              />
            </View>
          </Pressable>
          {showPayment && this.paymentInfo()}
          <View style={styles.divider} />
          {orderType === 'physical' && !isCanceled && (
            <View>
              <Pressable
                style={styles.dropDownBox}
                onPress={this.onPressDelivery}>
                <Text style={styles.boldTitle}>
                  {i18n.t('his:shipmentInfo')}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  {!showDelivery && (
                    <Text style={[styles.normal16BlueTxt, styles.alignCenter]}>
                      {shipStatus}
                    </Text>
                  )}
                  <AppButton
                    style={{backgroundColor: colors.white, height: 70}}
                    iconName={showDelivery ? 'iconArrowUp' : 'iconArrowDown'}
                    iconStyle={styles.dropDownIcon}
                  />
                </View>
              </Pressable>
              {
                showDelivery && this.deliveryInfo()
                // this.deliveryInfo(isCanceled)
              }
              <View style={styles.divider} />
            </View>
          )}
          <AppActivityIndicator visible={this.props.pending} />
        </SafeAreaView>
      </ScrollView>
    );
  }
}

export default connect(
  ({account, status}: RootState) => ({
    account,
    auth: accountActions.auth(account),
    uid: account.uid,
    pending:
      status.pending[orderActions.getOrders.typePrefix] ||
      status.pending[orderActions.cancelAndGetOrder.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(PurchaseDetailScreen);
