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
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {RkbOrder} from '@/redux/api/orderApi';
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
import {renderPromoFlag} from '../ChargeHistoryScreen';
import SplitText from '@/components/SplitText';
import ProductDetailList from '../CancelOrderScreen/component/ProductDetailList';
import GuideBox from '../CancelOrderScreen/component/GuideBox';
import FloatCheckButton from '../CancelOrderScreen/component/FloatCheckButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerNoti: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderColor: colors.lightGrey,
  },

  button: {
    ...appStyles.normal16Text,
    flex: 1,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: '#ffffff',
  },
  headerNotiText: {
    ...appStyles.bold16Text,
    color: colors.redError,
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
  qty: number;
};

const DraftScreen: React.FC<DraftScreenProps> = ({
  navigation,
  route,
  account: {token},
  action,
  product,
  pending,
}) => {
  const [order, setOrder] = useState<RkbOrder>({});
  const [prods, setProds] = useState<ProdDesc[]>([]);
  const loading = useRef(false);
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('his:draftTitle')} />,
    });
  }, [navigation]);

  useEffect(() => {
    if (route?.params?.order) setOrder(route.params?.order);
  }, [route?.params?.order]);

  const onCheck = useCallback(() => {
    setChecked((prev) => !prev);
  }, []);

  const onClickButton = useCallback(() => {
    action.order
      .changeDraft({
        orderId: order?.orderId,
        token,
      })
      .then((r) => {
        navigation.navigate('DraftResult', {
          isSuccess: r?.payload?.result === 0,
        });
      });
  }, [action.order, order?.orderId, token, navigation]);

  //
  const getProdDate = useCallback(() => {
    if (!loading.current && order?.orderItems?.length > 0) {
      order?.orderItems?.forEach((i) => {
        if (!product.prodList.has(i.uuid)) {
          // 해당 Uuid로 없다면 서버에서 가져온다.
          action?.product.getProdByUuid(i.uuid);
          loading.current = true;
        }
      });
    }
  }, [action?.product, order?.orderItems, product.prodList]);

  useEffect(() => {
    if (!order?.orderItems) return;

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

  const renderCheckButton = useCallback(() => {
    return (
      <FloatCheckButton
        onCheck={onCheck}
        checkText={i18n.t('his:draftAgree')}
        checked={checked}
      />
    );
  }, [checked, onCheck]);

  const renderDashedDiv = useCallback(() => {
    return (
      <View style={{overflow: 'hidden'}}>
        <View
          style={{
            borderStyle: 'dashed',
            borderWidth: 1,
            borderColor: colors.lightGrey,
            margin: -1,
            height: 0,
            marginBottom: 0,
          }}>
          <View style={{width: '100%'}} />
        </View>
      </View>
    );
  }, []);

  const headerNoti = useCallback(() => {
    if (!order || !order.orderItems) return <View />;

    return (
      <View>
        {Platform.OS === 'ios' && renderDashedDiv()}
        <View
          style={[
            styles.headerNoti,
            Platform.OS === 'android' && {
              borderStyle: 'dashed',
              borderTopWidth: 1,
            },
          ]}>
          <AppText style={styles.headerNotiText}>
            {i18n.t('his:draftNoti')}
          </AppText>
        </View>
      </View>
    );
  }, [order, renderDashedDiv]);

  if (!order || !order.orderItems) return <View />;

  // [physical] shipmentState : draft(취소 가능) / ready shipped (취소 불가능)
  // [draft] state = validation && status = inactive , reserved (취소 가능)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{flex: 1}}>
        <View style={{marginHorizontal: 20}}>
          <ProductDetailList
            style={{marginBottom: 40}}
            prods={prods}
            listTitle={i18n
              .t('his:draftItemText')
              .replace('%', getCountProds(prods))}
            footerComponent={headerNoti()}
            isGradient
          />
        </View>
        <View>
          <GuideBox
            iconName="bannerMark"
            title={i18n.t('his:draftCheckNotiTitle')}
            body={i18n.t('his:draftCheckNotiBody')}
          />
        </View>
      </ScrollView>
      {renderCheckButton()}
      <View style={{flexDirection: 'row'}}>
        <AppButton
          style={styles.button}
          type="primary"
          pressedStyle={{
            backgroundColor: checked ? colors.clearBlue : colors.gray,
          }}
          disabled={!checked}
          title={i18n.t('his:draftRequest')}
          onPress={() => {
            onClickButton();
          }}
          disabledCanOnPress
          disabledOnPress={() => {
            AppAlert.info(i18n.t('his:draftAlert'));
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
)(DraftScreen);
