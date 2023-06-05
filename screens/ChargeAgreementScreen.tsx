import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Pressable} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import {bindActionCreators} from 'redux';
import moment from 'moment';
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
import SelectedProdTitle from './EventBoardScreen/components/SelectedProdTitle';
import AppStyledText from '@/components/AppStyledText';
import {sliderWidth} from '@/constants/SliderEntry.style';

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
    borderWidth: 2,
    borderColor: colors.clearBlue,
    borderRadius: 3,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 32,
    marginHorizontal: 20,
    marginBottom: 40,
  },
  sticker: {
    backgroundColor: colors.clearBlue,
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
    borderRadius: 100,
    width: 69,
    marginBottom: 16,
  },
  stickerText: {
    ...appStyles.bold14Text,
    lineHeight: 20,
    color: colors.white,
  },
  title: {
    ...appStyles.bold20Text,
    lineHeight: 24,
    marginBottom: 8,
  },
  expPeriodText: {
    ...appStyles.medium14,
    lineHeight: 22,
    color: colors.redError,
  },
  expPeriodTextBold: {
    ...appStyles.bold14Text,
    lineHeight: 22,
    color: colors.redError,
  },
  notice: {
    backgroundColor: colors.backGrey,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 120,
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
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 100,
    marginHorizontal: 20,
    padding: 20,
    paddingBottom: 30,
    display: 'flex',
    flexDirection: 'row',
    width: sliderWidth - 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.whiteFive,

    elevation: 12,
    shadowColor: 'rgb(166, 168, 172)',
    shadowRadius: 12,
    shadowOpacity: 0.9,
    shadowOffset: {
      height: 4,
      width: 0,
    },
  },
  agreementText: {
    marginRight: 40,
    ...appStyles.semiBold16Text,
    lineHeight: 20,
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
  const expPeriod = useMemo(() => moment().add(180, 'day'), []);
  const [isPressed, setIsPressed] = useState(false);

  console.log('@@@@ expPeriod', expPeriod.format('YYYY년 MM월 DD일'));

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

  useEffect(() => {}, []);

  const onPressBtnPurchase = useCallback(() => {
    const {balance} = account;

    // 구매 품목을 갱신한다.
    action.cart.purchase({
      purchaseItems,
      balance,
      esimIccid: params.mainSubs.subsIccid,
      mainSubsId: params.mainSubs.nid,
    });

    navigation.navigate('PymMethod', {mode: 'roaming_product'});
  }, [account, action.cart, navigation, params.mainSubs, purchaseItems]);

  return (
    <SafeAreaView style={styles.container}>
      <SelectedProdTitle
        isdaily={params?.mainSubs?.daily === 'daily'}
        prodName={params?.mainSubs?.prodName || ''}
      />
      <ScrollView style={{flex: 1}}>
        <View style={styles.chargeProd}>
          <View style={styles.sticker}>
            <AppText style={styles.stickerText}>
              {i18n.t('esim:charge:selected:prod')}
            </AppText>
          </View>
          <AppText style={styles.title}>{contents.chargeProd}</AppText>
          <AppStyledText
            text={i18n.t('esim:charge:expPeriod')}
            textStyle={styles.expPeriodText}
            format={{b: styles.expPeriodTextBold}}
            data={{expPeriod: expPeriod.format('YYYY년 MM월 DD일')}}
          />
        </View>
        <View style={styles.notice}>
          <AppText style={styles.noticeTitle}>{contents.noticeTitle}</AppText>
          <AppText style={{marginTop: 30}}>
            {contents.noticeBody.map((k) => (
              <TextWithDot text={k} boldStyle={styles.noticeBold} />
            ))}
          </AppText>
        </View>
      </ScrollView>

      <Pressable
        style={styles.agreement}
        onPress={() => setIsPressed((prev) => !prev)}>
        <AppSvgIcon
          name={isPressed ? 'afterCheck' : 'beforeCheck'}
          style={{marginRight: 12}}
        />
        <AppText style={styles.agreementText}>
          {i18n.t('esim:charge:agreement')}
        </AppText>
      </Pressable>

      <ButtonWithPrice
        amount={
          params.addOnProd?.price ||
          params.extensionProd?.price.value.toString() ||
          '0'
        }
        currency={i18n.t('esim:charge:addOn:currency')}
        onPress={() => isPressed && onPressBtnPurchase}
        disable={!isPressed}
        title={i18n.t('esim:charge:payment:agree')}
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
