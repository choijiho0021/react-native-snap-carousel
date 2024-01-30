import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import React, {memo, useCallback, useState} from 'react';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import {OrderPromo} from '@/redux/api/cartApi';
import AppPrice from '@/components/AppPrice';
import AppButton from '@/components/AppButton';
import {appStyles} from '@/constants/Styles';
import AppActionMenu from '@/components/ModalContent/AppActionMenu';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    alignItems: 'center',
    height: 56,
  },
  coupon: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
  },
});

type SelectCouponProps = {
  promo: OrderPromo[];
  couponId?: string;
  onPress?: (coupon: string) => void;
};

const SelectCoupon: React.FC<SelectCouponProps> = ({
  promo,
  couponId,
  onPress = () => {},
}) => {
  const [coupon, setCoupon] = useState({
    couponId,
    adj: promo.find((p) => p.coupon_id === couponId)?.adj,
  });

  const renderCoupon = useCallback(
    ({item}: {item: OrderPromo}) => {
      return (
        <Pressable
          style={styles.coupon}
          onPress={() => setCoupon({couponId: item.coupon_id, adj: item.adj})}>
          <AppText>{item.coupon_id === couponId ? 'Selected' : ''}</AppText>
          <AppText>{item.title}</AppText>
          <AppPrice price={item.adj} />
        </Pressable>
      );
    },
    [couponId],
  );

  return (
    <AppActionMenu>
      <View style={styles.container}>
        <AppText key="title" style={styles.header}>
          {i18n.t('pym:sel:coupon:title')}
        </AppText>
        <AppText key="noti" style={styles.header}>
          {i18n.t('pym:sel:coupon:noti')}
        </AppText>
        <FlatList
          style={{flex: 1}}
          data={promo || []}
          keyExtractor={(item) => item.coupon_id}
          renderItem={renderCoupon}
          ItemSeparatorComponent={<View style={styles.separator} />}
          extraData={couponId}
          ListFooterComponent={
            <AppButton
              title="No Coupon"
              onPress={() => setCoupon({couponId: undefined, adj: undefined})}
            />
          }
        />
      </View>
      <AppButton
        title={`${coupon.adj?.value || '0'} ${i18n.t('pym:sel:coupon:apply')}`}
        titleStyle={appStyles.medium18}
        onPress={() => onPress(coupon.couponId)}
        style={appStyles.confirm}
        type="primary"
      />
    </AppActionMenu>
  );
};

export default memo(SelectCoupon);
