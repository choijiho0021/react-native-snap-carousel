import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import i18n from '@/utils/i18n';
import ProductDetailInfo from './component/ProductDetailInfo';
import {RkbOrder} from '@/redux/api/orderApi';
import {OrderModelState, isExpiredDraft} from '@/redux/modules/order';
import AppIcon from '@/components/AppIcon';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import BackbuttonHandler from '@/components/BackbuttonHandler';

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
  headerContentFrame: {
    marginBottom: 32,
  },
  itemListFrame: {
    borderWidth: 1,
    borderColor: colors.whiteFive,
    borderRadius: 3,
    paddingHorizontal: 16,
  },

  item: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderColor: colors.whiteFive,
  },
  titleText: {
    ...appStyles.bold24Text,
    marginBottom: 16,
  },

  bodyText: {
    ...appStyles.normal16Text,
    lineHeight: 24,
  },
});

type CancelResultScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'CancelResult'
>;

type CancelResultScreenRouteProp = RouteProp<
  HomeStackParamList,
  'CancelResult'
>;

type CancelResultScreenProps = {
  navigation: CancelResultScreenNavigationProp;
  route: CancelResultScreenRouteProp;
  order: OrderModelState;

  account: AccountModelState;
  action: {
    account: AccountAction;
  };
};

export type ProdDesc = {
  title: string;
  field_description: string;
  promoFlag: string[];
  qty: number;
};

// 내용 별거 없으면 그냥 CancelResult랑 합칠까
const CancelResultScreen: React.FC<CancelResultScreenProps> = ({
  navigation,
  route,
  order,
  account,
  action,
}) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [prods, setProds] = useState<ProdDesc[]>([]);
  const [orderResult, setOrderResult] = useState<RkbOrder>();

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: null,
    });
  }, [navigation]);

  // 완료창에서 뒤로가기 시 확인과 똑같이 처리한다.
  BackbuttonHandler({
    navigation,
    onBack: () => {
      navigation.navigate('PurchaseDetail', {
        orderId: orderResult?.orderId,
      });
      return true;
    },
  });

  useEffect(() => {
    console.log('@@@@ 이거 호출 여러번 하나?');

    if (!route?.params?.orderId) return;

    setIsSuccess(route?.params?.isSuccess);
    setOrderResult(order.orders.get(route?.params?.orderId));
    setProds(route?.params?.prods);
  }, [order.orders, route?.params]);

  const renderItem = useCallback(
    ({item, isLast}: {item: ProdDesc; isLast?: boolean}) => {
      return Array.from({length: item.qty}, (_, index) => {
        return (
          <ProductDetailInfo
            style={[styles.item, isLast && {borderBottomWidth: 0}]}
            key={item.title + index}
            item={item}
          />
        );
      });
    },
    [],
  );

  const renderItemList = useCallback(() => {
    return (
      <View style={styles.itemListFrame}>
        {prods.map((r, index) =>
          renderItem({item: r, isLast: prods.length - 1 === index}),
        )}
      </View>
    );
  }, [prods, renderItem]);

  const renderContent = useCallback(
    () => (
      <View style={styles.headerContentFrame}>
        {isSuccess ? (
          <View>
            <AppText style={styles.titleText}>
              {i18n.t('his:cancelOrderTitle')}
            </AppText>
            <AppText style={styles.bodyText}>
              {i18n.t('his:cancelOrderBody')}
            </AppText>
          </View>
        ) : isExpiredDraft(orderResult?.orderDate) ? (
          <View>
            <AppText style={styles.titleText}>
              {i18n.t('his:cancelOrderFail1Title')}
            </AppText>
            <AppText style={styles.bodyText}>
              {i18n.t('his:cancelOrderFail1Body')}
            </AppText>
          </View>
        ) : (
          <View>
            <AppText style={styles.titleText}>
              {i18n.t('his:cancelOrderFail2Title')}
            </AppText>
            <AppText style={styles.bodyText}>
              {i18n.t('his:cancelOrderFail2Body')}
            </AppText>
          </View>
        )}
      </View>
    ),
    [isSuccess, orderResult],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{marginHorizontal: 20, flex: 1}}>
        {renderContent()}
        {isSuccess && renderItemList()}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 100,
          }}>
          {!isSuccess && <AppIcon name="goodsError" size={252} />}
        </View>
      </ScrollView>
      <View style={{flexDirection: 'row'}}>
        <AppButton
          style={styles.button}
          type="primary"
          title={i18n.t('his:cancelOrderButton')}
          onPress={() => {
            action.account.getAccount({
              iccid: account.iccid,
              token: account.token,
            });

            navigation.navigate('PurchaseDetail', {
              orderId: orderResult?.orderId,
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default connect(
  ({account, order}: RootState) => ({
    account,
    order,
    pending: false,
  }),
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
    },
  }),
)(CancelResultScreen);
