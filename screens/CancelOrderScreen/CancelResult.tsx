import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import i18n from '@/utils/i18n';
import _ from 'underscore';
import ProductDetailInfo from './component/ProductDetailInfo';
import {RkbOrder} from '@/redux/api/orderApi';
import {RootState} from '@reduxjs/toolkit';
import {OrderModelState, isExpiredDraft} from '@/redux/modules/order';
import AppIcon from '@/components/AppIcon';

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

  useEffect(() => {
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

  // 제플린에 실패 시 이미지 있기는 한데, 파편화 되어 있어서 문의 필요

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
            // MyPage 재 클릭시 결과 창으로 복귀 방지
            // navigation.popToTop();

            navigation.navigate('PurchaseDetail', {
              detail: orderResult,
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default connect(({order}: RootState) => ({
  order,
  pending: false,
}))(CancelResultScreen);
