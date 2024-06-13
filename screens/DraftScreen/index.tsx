import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {RkbOrder} from '@/redux/api/orderApi';
import {AccountModelState} from '@/redux/modules/account';
import {
  actions as orderActions,
  OrderAction,
  getCountItems,
  OrderModelState,
} from '@/redux/modules/order';
import {
  actions as productActions,
  ProductModelState,
} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import ProductDetailRender from '../CancelOrderScreen/component/ProductDetailRender';
import GuideBox from '../CancelOrderScreen/component/GuideBox';
import FloatCheckButton from '../CancelOrderScreen/component/FloatCheckButton';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';
import AppModalContent from '@/components/ModalContent/AppModalContent';
import {ProdInfo} from '@/redux/api/productApi';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  buttonFrame: {flexDirection: 'row'},
  button: {
    ...appStyles.normal16Text,
    flex: 1,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: colors.white,
  },
  proudctFrame: {
    paddingHorizontal: 20,
  },
  product: {
    marginBottom: 40,
  },
  modalText: {
    ...appStyles.semiBold16Text,
    lineHeight: 26,
    letterSpacing: -0.32,
    color: colors.black,
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
  order: OrderModelState;
  pending: boolean;

  action: {
    order: OrderAction;
    modal: ModalAction;
  };
};

const DraftScreen: React.FC<DraftScreenProps> = ({
  navigation,
  route,
  account: {iccid, token},
  action,
  product,
  order,
  pending,
}) => {
  const [draftOrder, setDraftOrder] = useState<RkbOrder>();
  const [checked, setChecked] = useState<boolean>(false);
  const [isClickButton, setIsClickButton] = useState(false);

  const scrollRef = useRef<ScrollView>();

  useEffect(() => {
    if (route?.params?.orderId)
      setDraftOrder(
        order.drafts.find((r) => r.orderId === route.params?.orderId) ||
          order.orders.get(route.params?.orderId),
      );
  }, [order.drafts, order.orders, route.params?.orderId]);

  const onCheck = useCallback(() => {
    if (!checked) scrollRef?.current.scrollToEnd();

    setChecked((prev) => !prev);
  }, [checked]);

  const onClickButton = useCallback(() => {
    setIsClickButton(true);
    action.order
      .changeDraft({
        orderId: draftOrder?.orderId,
        token,
      })
      .then((r) => {
        action.order.subsReload({
          iccid: iccid!,
          token: token!,
          hidden: false,
        });

        navigation.navigate('DraftResult', {
          isSuccess: r?.payload?.result === 0,
        });
      });
  }, [action.order, draftOrder?.orderId, token, iccid, navigation]);

  const renderCheckButton = useCallback(() => {
    return (
      <FloatCheckButton
        onCheck={onCheck}
        checkText={i18n.t('his:draftAgree')}
        checked={checked}
      />
    );
  }, [checked, onCheck]);

  if (!draftOrder || !draftOrder?.orderItems) return <View />;

  // [physical] shipmentState : draft(취소 가능) / ready shipped (취소 불가능)
  // [draft] state = validation && status = inactive , reserved (취소 가능)

  return (
    <SafeAreaView style={styles.container}>
      <View style={appStyles.header}>
        <AppBackButton title={i18n.t('his:draftTitle')} />
      </View>
      <ScrollView ref={scrollRef} style={{flex: 1}}>
        <View style={styles.proudctFrame}>
          <ProductDetailRender
            style={styles.product}
            orderItems={draftOrder?.orderItems}
            listTitle={i18n
              .t('his:draftItemText')
              .replace('%', getCountItems(draftOrder?.orderItems, false))}
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

      <View>{renderCheckButton()}</View>
      <View style={styles.buttonFrame}>
        <AppButton
          style={styles.button}
          type="primary"
          pressedStyle={{
            backgroundColor: checked ? colors.clearBlue : colors.gray,
          }}
          disabled={!checked || isClickButton}
          title={i18n.t('his:draftRequest')}
          onPress={() => {
            onClickButton();
          }}
          disabledCanOnPress
          disabledOnPress={() => {
            if (isClickButton) console.log('중복클릭');
            else
              action.modal.renderModal(() => (
                <AppModalContent
                  type="info"
                  onOkClose={() => {
                    action.modal.closeModal();
                  }}>
                  <View style={{marginLeft: 30}}>
                    <AppText style={styles.modalText}>
                      {i18n.t('his:draftAlert')}
                    </AppText>
                  </View>
                </AppModalContent>
              ));
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
)(DraftScreen);
