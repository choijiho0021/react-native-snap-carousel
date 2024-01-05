import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {appStyles} from '@/constants/Styles';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import {HomeStackParamList, navigate} from '@/navigation/navigation';
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
import AppModalContent from '@/components/ModalContent/AppModalContent';
import {Moment} from 'moment';
import moment from 'moment';
import DraftStartPage from './component/DraftStartPage';
import AppText from '@/components/AppText';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  const [step, setStep] = useState(0);

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
      {step === 1 && (
        <>
          <View style={{paddingHorizontal: 20}}>
            <View style={{marginTop: 24, width: '50%'}}>
              <AppText style={appStyles.bold24Text}>
                {'상품 사용 시작일을 선택해주세요!'}
              </AppText>
            </View>
            <View>
              <AppText>{'상품 사용 시작일'}</AppText>
              <View>{/* 캘린더 컴포넌트 */}</View>
            </View>
          </View>
        </>
      )}
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
