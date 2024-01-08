import {ScrollView} from 'react-native-gesture-handler';
import {Platform, StyleSheet, View} from 'react-native';
import React, {useCallback} from 'react';
import AppButton from '@/components/AppButton';
import AppNotiBox from '@/components/AppNotiBox';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RkbOrder} from '@/redux/api/orderApi';
import {getCountItems} from '@/redux/modules/order';
import ProductDetailList from '@/screens/CancelOrderScreen/component/ProductDetailList';
import i18n from '@/utils/i18n';
import {UsProdDesc} from '..';

const styles = StyleSheet.create({
  headerNoti: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderColor: colors.lightGrey,
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
  headerNotiText: {
    ...appStyles.bold16Text,
    color: colors.redError,
  },
  dashContainer: {
    overflow: 'hidden',
  },
  dashFrame: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    margin: -1,
    height: 0,
    marginBottom: 0,
  },
  dash: {
    width: '100%',
  },
  proudctFrame: {
    paddingHorizontal: 20,
  },
  product: {
    marginBottom: 40,
  },
});

interface DraftStartPageProps {
  prods: UsProdDesc;
  draftOrder: RkbOrder;
  onClick: () => void;
}

const DraftStartPage: React.FC<DraftStartPageProps> = ({
  prods,
  draftOrder,
  onClick,
}) => {
  const renderDashedDiv = useCallback(() => {
    return (
      <View style={styles.dashContainer}>
        <View style={styles.dashFrame}>
          <View style={styles.dash} />
        </View>
      </View>
    );
  }, []);
  const headerNoti = useCallback(() => {
    if (!draftOrder || !draftOrder?.orderItems) return <View />;

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
  }, [draftOrder, renderDashedDiv]);

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
            footerComponent={headerNoti()}
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

export default DraftStartPage;
