import React, {useCallback, useEffect, useMemo} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';
import AppBackButton from '@/components/AppBackButton';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import AppStyledText from '@/components/AppStyledText';
import AppButton from '@/components/AppButton';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import {RootState} from '@/redux';
import {AccountModelState} from '@/redux/modules/account';
import {API} from '@/redux/api';
import utils from '@/redux/api/utils';
import AppSvgIcon from '@/components/AppSvgIcon';
import {HomeStackParamList} from '@/navigation/navigation';

const styles = StyleSheet.create({
  paymentBtnFrame: {
    height: 52,
    flexDirection: 'row',
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
    borderTopWidth: 1,
    borderColor: '#d8d8d8',
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
    lineHeight: 32,
    fontWeight: '400',
    color: colors.white,
  },
  chargeItem: {
    ...appStyles.extraBold24,
    color: colors.white,
    lineHeight: 34,
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
    paddingRight: 40,
    paddingBottom: 60,
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

type ChargeDetailScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ChargeDetail'
>;

type ProductDetailScreenProps = {
  navigation: ChargeDetailScreenNavigationProp;
  route: RouteProp<HomeStackParamList, 'ChargeDetail'>;
  account: AccountModelState;
  action: {
    cart: CartAction;
  };
};

const ChargeDetailScreen: React.FC<ProductDetailScreenProps> = ({
  navigation,
  route: {params},
  account,
  action,
}) => {
  const purchaseItems = useMemo(
    () => [API.Product.toPurchaseItem(params?.data)],
    [params?.data],
  );

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton />,
    });
  }, [navigation]);

  const onPressBtnPurchase = useCallback(() => {
    const {balance} = account;

    // 구매 품목을 갱신한다.
    action.cart.purchase({
      purchaseItems,
      balance,
      esimIccid: params?.subsIccid,
    });

    navigation.navigate('PymMethod', {
      mode: 'roaming_product',
    });
  }, [account, action.cart, navigation, params?.subsIccid, purchaseItems]);

  const titleText = useCallback(
    (text: string, prodName: string, name: string) => (
      <AppStyledText
        text={text}
        textStyle={styles.mainBody}
        format={{b: styles.chargeItem}}
        data={{prodName, name}}
      />
    ),
    [],
  );
  const tailText = useCallback(
    (text: string, chargeablePeriod: string) => (
      <AppStyledText
        text={text}
        textStyle={styles.bodyTail}
        format={{b: styles.chargePeriod}}
        data={{chargeablePeriod}}
      />
    ),
    [],
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView style={{flex: 1}}>
        <ImageBackground
          source={
            params?.data.field_daily === 'daily'
              ? // eslint-disable-next-line global-require
                require('../assets/images/esim/img_bg_1.png')
              : // eslint-disable-next-line global-require
                require('../assets/images/esim/img_bg_2.png')
          }
          style={styles.bg}>
          <View style={styles.mainBodyFrame}>
            {titleText(
              i18n.t('esim:chargeDetail:body'),
              params?.prodName,
              params?.data.name,
            )}
          </View>

          <View>
            {tailText(
              i18n.t('esim:chargeDetail:body2'),
              params?.chargeablePeriod,
            )}
          </View>
        </ImageBackground>

        <View style={styles.caustionFrame}>
          <View style={styles.caustionTitle}>
            <AppSvgIcon name="cautionIcon" />
            <AppText style={styles.caustionTitleText}>
              {i18n.t('esim:chargeCaution:title')}
            </AppText>
          </View>
          <View style={styles.caustionBody}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => (
              <View key={k} style={{flexDirection: 'row'}}>
                <AppText
                  style={[
                    appStyles.normal14Text,
                    {marginHorizontal: 5, marginTop: 3},
                  ]}>
                  •
                </AppText>
                <AppStyledText
                  textStyle={styles.caustionBodyText}
                  text={i18n.t(`esim:chargeCaution:body${k}`)}
                  format={{
                    b: {
                      ...appStyles.bold14Text,
                      lineHeight: 22,
                      color: colors.clearBlue,
                    },
                  }}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.paymentBtnFrame}>
        <View style={styles.amountFrame}>
          <AppText style={styles.amountText}>
            {i18n.t('esim:charge:amount')}
            <AppText style={styles.amount}>
              {utils.currencyString(params?.data.price.value)}
            </AppText>
            {i18n.t(params?.data.price.currency)}
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
    },
  }),
)(ChargeDetailScreen);
