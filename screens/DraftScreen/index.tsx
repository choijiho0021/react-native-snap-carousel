import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
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
import {
  actions as productActions,
  ProductModelState,
} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import {API} from '@/redux/api';
import {renderPromoFlag} from '../ChargeHistoryScreen';
import SplitText from '@/components/SplitText';
import _ from 'underscore';

const {esimApp, esimCurrency} = Env.get();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  button: {
    ...appStyles.normal16Text,
    flex: 1,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: '#ffffff',
  },

  descRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    width: '100%',
  },
});

type DraftScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Draft'
>;

type DraftScreenRouteProp = RouteProp<HomeStackParamList, 'Draft'>;

type DraftScreenProps = {
  navigation: DraftScreenNavigationProp;
  route: DraftScreenRouteProp;

  account: AccountModelState;
  product: ProductModelState;

  pending: boolean;

  action: {
    order: OrderAction;
  };
};

type ProdDesc = {
  title: string;
  field_description: string;
  promoFlag: string[];
};

const isRokebiCash = (pg: string) =>
  ['rokebi_cash', 'rokebi_point'].includes(pg);
const isUseNotiState = (state: OrderState) =>
  ['validation', 'completed'].includes(state);

const DraftScreen: React.FC<DraftScreenProps> = ({
  navigation,
  route,
  account,
  action,
  product,
  pending,
}) => {
  const [isCanceled, setIsCanceled] = useState(false);
  const [method, setMethod] = useState<RkbPayment>();
  const [order, setOrder] = useState<RkbOrder>();
  const [prods, setProds] = useState<ProdDesc[]>([]);
  const loading = useRef(false);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('his:detail')} />,
    });
  }, [navigation]);

  //
  const getProdDate = useCallback(() => {
    if (!loading.current) {
      order?.orderItems.forEach((i) => {
        const uuid = i.uuid;

        if (!product.prodList.has(uuid)) {
          console.log('i uuid : ', uuid);
          action.product.getProdByUuid(uuid);
          loading.current = true;
        }
      });
    }
  }, []);

  useEffect(() => {
    const item: RkbOrder = route.params.order;
    if (!item) return;

    const prodList = item.orderItems.map((r) => {
      const prod = product.prodList.get(r.uuid);
      console.log('prod : ', prod);

      if (prod)
        return {
          title: prod.name,
          field_description: prod.field_description,
          promoFlag: prod.promoFlag,
        };
      else {
        console.log('어떻게 처리해줄까');
      }
    });

    setProds(prodList);
  }, []);

  useEffect(() => {
    const item = route.params.order;

    loading.current = false;
    console.log('product : ', product.prodList);

    setOrder(item);

    // getProdDate();
    // const r = action.product.getProdByUuid(order.orderItems[0].uuid);
    // setOrder(route?.params.order);
  }, [route.params, product, action.product]);

  const renderItem = useCallback(({item}: {item: ProdDesc}) => {
    console.log('renderItem : ', item);
    return (
      <View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <SplitText
            renderExpend={() => renderPromoFlag(item.promoFlag || [], false)}
            numberOfLines={2}
            style={{...appStyles.bold16Text, marginRight: 8}}
            ellipsizeMode="tail">
            {utils.removeBracketOfName(item.title)}
          </SplitText>
        </View>
        <View>
          <AppText
            key="desc"
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[
              appStyles.normal14Text,
              {
                flex: 1,
                fontSize: isDeviceSize('medium') ? 14 : 16,
                lineHeight: isDeviceSize('medium') ? 20 : 22,
              },
            ]}>
            {item.field_description}
          </AppText>
        </View>
      </View>
    );
  }, []);

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
      </View>
    );
  }, [isCanceled, method?.paymentMethod, order]);

  if (!order || !order.orderItems) return <View />;

  // [physical] shipmentState : draft(취소 가능) / ready shipped (취소 불가능)
  // [draft] state = validation && status = inactive , reserved (취소 가능)

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginHorizontal: 20, flex: 1}}>
        <FlatList
          contentContainerStyle={[_.isEmpty(prods) && {flex: 1}]}
          data={prods}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.title + index}
          ListHeaderComponent={
            <View style={{marginTop: 10, marginBottom: 20}}>
              <AppText style={appStyles.bold18Text}>
                {`발권할 상품 3개를\n확인해주세요.`}
              </AppText>
            </View>
          }
          ListFooterComponent={<View>{headerNoti()}</View>}
        />
      </View>
      {/* {showPayment && paymentInfo()} */}
      <View style={{flexDirection: 'row'}}>
        {order?.state === 'validation' && (
          <AppButton
            style={[styles.button]}
            type="primary"
            title={i18n.t('his:draftRequest')}
            onPress={() => console.log('발권하기 화면으로 이동')}
          />
        )}
      </View>
      <AppActivityIndicator visible={pending} />
    </SafeAreaView>
  );
};

export default connect(
  ({account, status, product}: RootState) => ({
    account,
    product,
    pending:
      status.pending[orderActions.getOrders.typePrefix] ||
      status.pending[orderActions.cancelAndGetOrder.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
      product: bindActionCreators(productActions, dispatch),
    },
  }),
)(DraftScreen);
