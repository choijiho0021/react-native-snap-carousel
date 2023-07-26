import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
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
import {connect} from 'react-redux';
import {OrderModelState, isExpiredDraft} from '@/redux/modules/order';

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

type ProdDesc = {
  title: string;
  field_description: string;
  promoFlag: string[];
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
    setIsSuccess(route?.params?.isSuccess);

    const orderResult = order.orders.get(route?.params?.orderId);

    setOrderResult(orderResult);
    setProds(route?.params?.prods);
  }, [order.orders, route?.params]);

  const renderItem = useCallback(({item}: {item: ProdDesc}) => {
    return Array.from({length: item.qty}, (_, index) => {
      return <ProductDetailInfo key={item.title + index} item={item} />;
    });
  }, []);

  const renderItemList = useCallback(() => {
    return (
      <FlatList
        style={{marginTop: 100}}
        contentContainerStyle={[_.isEmpty(prods) && {flex: 1}]}
        data={prods}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.title + index}
      />
    );
  }, [prods, renderItem]);

  const renderContent = useCallback(
    () => (
      <View>
        {isSuccess ? (
          <View>
            <AppText style={appStyles.bold20Text}>
              {i18n.t('his:cancelOrderTitle')}
            </AppText>
            <AppText style={appStyles.normal16Text}>
              {i18n.t('his:cancelOrderBody')}
            </AppText>
          </View>
        ) : isExpiredDraft(orderResult?.orderDate) ? (
          <View>
            <AppText style={appStyles.bold20Text}>
              {i18n.t('his:cancelOrderFail1Title')}
            </AppText>
            <AppText style={appStyles.normal16Text}>
              {i18n.t('his:cancelOrderFail1Body')}
            </AppText>
          </View>
        ) : (
          <View>
            <AppText style={appStyles.bold20Text}>
              {i18n.t('his:cancelOrderFail2Title')}
            </AppText>
            <AppText style={appStyles.normal16Text}>
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
      <View style={{marginHorizontal: 20, flex: 1}}>
        {renderContent()}
        {renderItemList()}
      </View>
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
