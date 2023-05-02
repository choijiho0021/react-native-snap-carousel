import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Pressable} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import {bindActionCreators} from 'redux';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import AppBackButton from '@/components/AppBackButton';
import ChargeProdTitle from './EsimScreen/components/ChargeProdTitle';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import TextWithDot from './EsimScreen/components/TextWithDot';
import ButtonWithPrice from './EsimScreen/components/ButtonWithPrice';
import {API} from '@/redux/api';
import {AccountModelState} from '@/redux/modules/account';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  headerTitle: {
    height: 56,
    marginRight: 8,
  },
  chargeProd: {
    backgroundColor: colors.babyBlue,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    padding: 20,
    paddingRight: 30,
  },
  title: {
    ...appStyles.bold16Text,
    marginTop: 10,
  },
  notice: {
    backgroundColor: colors.backGrey,
    marginTop: 10,
    paddingTop: 30,
    paddingHorizontal: 20,
    flex: 1,
  },
  noticeTitle: {
    ...appStyles.bold20Text,
  },
  noticeBold: {
    ...appStyles.bold14Text,
    lineHeight: 22,
    color: colors.black,
  },
  agreement: {
    backgroundColor: colors.backGrey,
    padding: 20,
    paddingBottom: 30,
    display: 'flex',
    flexDirection: 'row',
  },
  btn: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.gray,
    marginRight: 10,
  },
  agreementText: {
    ...appStyles.normal18Text,
  },
});

type ChargeAgreementScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ChargeAgreement'
>;

type ChargeAgreementScreenProps = {
  navigation: ChargeAgreementScreenNavigationProp;
  route: RouteProp<HomeStackParamList, 'ChargeAgreement'>;
  account: AccountModelState;
  action: {
    cart: CartAction;
  };
};

const ChargeAgreementScreen: React.FC<ChargeAgreementScreenProps> = ({
  navigation,
  route: {params},
  account,
  action,
}) => {
  const contents = useMemo(() => params.contents, [params.contents]);
  const purchaseItems = useMemo(
    () =>
      params?.addOnProd
        ? [
            API.Product.toPurchaseAddOnItem(
              params.mainSubs.key,
              params.addOnProd,
            ),
          ]
        : [API.Product.toPurchaseItem(params?.extensionProd)],
    [params?.addOnProd, params?.extensionProd, params?.mainSubs.key],
  );
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <View style={styles.header}>
          <AppBackButton title={params.title} style={styles.headerTitle} />
        </View>
      ),
    });
  }, [navigation, params.title]);

  const onPressBtnPurchase = useCallback(() => {
    const {balance} = account;

    // 구매 품목을 갱신한다.
    action.cart.purchase({
      purchaseItems,
      balance,
      esimIccid: params.mainSubs.key,
    });

    navigation.navigate('PymMethod', {
      mode: 'roaming_product',
    });
  }, [account, action.cart, navigation, params.mainSubs.key, purchaseItems]);

  return (
    <SafeAreaView style={styles.container}>
      <ChargeProdTitle prodName={params.mainSubs.prodName || ''} />
      <View style={styles.chargeProd}>
        <AppSvgIcon name="plus" />
        <AppText style={styles.title}>{contents.chargeProd}</AppText>
        {contents.period}
      </View>

      <ScrollView style={styles.notice}>
        <AppText style={styles.noticeTitle}>{contents.noticeTitle}</AppText>
        <AppText style={{marginTop: 30}}>
          {contents.noticeBody.map((k) => (
            <TextWithDot text={k} boldStyle={styles.noticeBold} />
          ))}
        </AppText>
      </ScrollView>

      <Pressable
        style={styles.agreement}
        onPress={() => setIsPressed((prev) => !prev)}>
        <View
          style={[
            styles.btn,
            {backgroundColor: isPressed ? colors.clearBlue : colors.backGrey},
          ]}
        />
        <AppText style={styles.agreementText}>
          {i18n.t('esim:charge:agreement')}
        </AppText>
      </Pressable>

      <ButtonWithPrice
        amount={
          params.addOnProd?.price || params.extensionProd?.price.value || '0'
        }
        currency={i18n.t('esim:charge:addOn:currency')}
        onPress={onPressBtnPurchase}
      />
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
)(ChargeAgreementScreen);
