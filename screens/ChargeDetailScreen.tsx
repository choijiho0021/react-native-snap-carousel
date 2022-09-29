import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View, ImageBackground} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';
import AppBackButton from '@/components/AppBackButton';
import {RkbProduct} from '@/redux/api/productApi';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import AppIcon from '@/components/AppIcon';
import AppStyledText from '@/components/AppStyledText';
import AppButton from '@/components/AppButton';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import {RootState} from '@/redux';
import {AccountModelState} from '@/redux/modules/account';
import {API} from '@/redux/api';
import {actions as simActions, SimAction} from '@/redux/modules/sim';

const styles = StyleSheet.create({
  paymentBtnFrame: {
    height: 52,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#d8d8d8',
  },
  paymentBtn: {
    height: 52,
    backgroundColor: colors.clearBlue,
    flex: 0.65,
  },
  amountFrame: {
    flex: 0.35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  amountText: {
    ...appStyles.normal16Text,
    lineHeight: 36,
    letterSpacing: 0.26,
  },
  amount: {
    ...appStyles.robotoBold16Text,
    lineHeight: 36,
    letterSpacing: 0.26,
    color: colors.black,
  },
  paymentBtnTitle: {
    ...appStyles.medium18,
    color: colors.white,
    textAlign: 'center',
    width: '100%',
  },
  bg: {
    height: 288,
    paddingTop: 40,
    paddingLeft: 20,
  },
  mainBodyFrame: {
    marginBottom: 57,
  },
  mainBody: {
    ...appStyles.normal20Text,
    lineHeight: 30,
    color: colors.white,
  },
  chargeItem: {
    ...appStyles.extraBold24,
    lineHeight: 30,
  },
  bodyTail: {
    ...appStyles.normal14Text,
    lineHeight: 20,
    color: colors.white,
  },
  chargePeriod: {
    ...appStyles.robotoBold16Text,
    color: colors.white,
    lineHeight: 20,
  },
  caustionFrame: {
    paddingTop: 32,
    paddingLeft: 20,
    paddingRight: 20,
  },
  caustionTitle: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  caustionTitleText: {
    marginLeft: 9,
    ...appStyles.bold18Text,
    lineHeight: 24,
    color: '#2c2c2c',
  },
  caustionBodyText: {
    ...appStyles.normal14Text,
    lineHeight: 22,
  },
});

type ParamList = {
  ChargeDetailScreen: {
    data: RkbProduct;
    prodname: string;
    chargeableDate: string;
    subsIccid: string;
  };
};

type ProductDetailScreenProps = {
  account: AccountModelState;
  action: {
    cart: CartAction;
    sim: SimAction;
  };
};

const ChargeDetailScreen: React.FC<ProductDetailScreenProps> = ({
  account,
  action,
}) => {
  const route = useRoute<RouteProp<ParamList, 'ChargeDetailScreen'>>();
  const params = useMemo(() => route?.params, [route?.params]);
  const purchaseItems = useMemo(
    () => [API.Product.toPurchaseItem(params.data)],
    [params.data],
  );

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton />,
    });
  }, [navigation]);

  const onPressBtnPurchase = useCallback(() => {
    const {balance} = account;

    action.sim.update({esimIccid: params.subsIccid});

    // 구매 품목을 갱신한다.
    action.cart.purchase({
      purchaseItems,
      balance,
    });

    navigation.navigate('PymMethod', {
      mode: 'roaming_product',
    });
  }, [
    account,
    action.cart,
    action.sim,
    navigation,
    params.subsIccid,
    purchaseItems,
  ]);

  const titleText = useCallback(
    (text: string, prodname: string, name: string) => (
      <AppStyledText
        text={text}
        textStyle={styles.mainBody}
        format={{b: styles.chargeItem}}
        data={{prodname, name}}
      />
    ),
    [],
  );
  const tailText = useCallback(
    (text: string, chargeableDate: string) => (
      <AppStyledText
        text={text}
        textStyle={styles.bodyTail}
        format={{b: styles.chargePeriod}}
        data={{chargeableDate}}
      />
    ),
    [],
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ImageBackground
        source={
          params.data.field_daily === 'daily'
            ? // eslint-disable-next-line global-require
              require('../assets/images/esim/img_bg_1.png')
            : // eslint-disable-next-line global-require
              require('../assets/images/esim/img_bg_2.png')
        }
        style={styles.bg}>
        <View style={styles.mainBodyFrame}>
          {titleText(
            i18n.t('esim:chargeDetail:body'),
            params.prodname,
            params.data.name,
          )}
        </View>

        <View>
          {tailText(i18n.t('esim:chargeDetail:body2'), params.chargeableDate)}
        </View>
      </ImageBackground>

      <View style={styles.caustionFrame}>
        <View style={styles.caustionTitle}>
          <AppIcon name="cautionIcon" />
          <AppText style={styles.caustionTitleText}>
            {i18n.t('esim:chargeCaution:title')}
          </AppText>
        </View>
        <View style={styles.caustionBody}>
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <View key={k} style={{flexDirection: 'row'}}>
              <AppText style={[appStyles.normal14Text, {marginHorizontal: 5}]}>
                •
              </AppText>
              <AppStyledText
                textStyle={styles.caustionBodyText}
                text={i18n.t(`esim:chargeCaution:body${k}`)}
                format={{b: {...appStyles.bold14Text, color: colors.clearBlue}}}
              />
            </View>
          ))}
        </View>
      </View>
      <View style={styles.paymentBtnFrame}>
        <View style={styles.amountFrame}>
          <AppText style={styles.amountText}>
            {i18n.t('esim:charge:amount')}
            <AppText style={styles.amount}>{params.data.price.value}</AppText>
            {i18n.t(params.data.price.currency)}
          </AppText>
        </View>
        <AppButton
          style={styles.paymentBtn}
          type="primary"
          onPress={onPressBtnPurchase}
          title={i18n.t('esim:charge:payment')}
          titleStyle={styles.paymentBtnTitle}
        />
      </View>
    </SafeAreaView>
  );
};

export default connect(
  ({account}: RootState) => ({
    account,
  }),
  (dispatch) => ({
    action: {
      cart: bindActionCreators(cartActions, dispatch),
      sim: bindActionCreators(simActions, dispatch),
    },
  }),
)(ChargeDetailScreen);
