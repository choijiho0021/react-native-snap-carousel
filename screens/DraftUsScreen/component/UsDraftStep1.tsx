import {ScrollView} from 'react-native-gesture-handler';
import {StyleSheet, View} from 'react-native';
import React from 'react';
import AppButton from '@/components/AppButton';
import AppNotiBox from '@/components/AppNotiBox';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RkbOrder} from '@/redux/api/orderApi';
import {getCountItems} from '@/redux/modules/order';
import ProductDetailList from '@/screens/CancelOrderScreen/component/ProductDetailList';
import i18n from '@/utils/i18n';
import {ProdInfo} from '@/redux/api/productApi';

const styles = StyleSheet.create({
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
});

interface UsDraftStep1Props {
  prods: ProdInfo;
  draftOrder: RkbOrder;
  onClick: () => void;
}

const UsDraftStep1: React.FC<UsDraftStep1Props> = ({
  prods,
  draftOrder,
  onClick,
}) => {
  return (
    <>
      <ScrollView style={{flex: 1}}>
        <AppNotiBox
          backgroundColor={colors.backRed}
          textColor={colors.redError}
          text="<b>발권 시 필수 정보를 입력해야 하는 상품입니다.</b>"
        />

        <View style={styles.proudctFrame}>
          <ProductDetailList
            style={styles.product}
            prods={prods}
            listTitle={i18n
              .t('his:draftItemText')
              .replace('%', getCountItems(draftOrder?.orderItems, false))}
            isGradient
            isFooter={false}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonFrame}>
        <AppButton
          style={styles.button}
          type="primary"
          // pressedStyle={{
          //   backgroundColor: checked ? colors.clearBlue : colors.gray,
          // }}
          title={i18n.t('esim:draftStart')}
          onPress={() => {
            onClick();
          }}
        />
      </View>
    </>
  );
};

export default UsDraftStep1;
