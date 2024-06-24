import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {StyleSheet, SafeAreaView, View, Animated} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import i18n from '@/utils/i18n';
import {RootState} from '@/redux';
import {
  actions as productActions,
  ProductAction,
  ProductModelState,
} from '@/redux/modules/product';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import {makeProdData} from './CountryScreen';
import AppSvgIcon from '@/components/AppSvgIcon';
import {HomeStackParamList} from '@/navigation/navigation';
import {RkbProduct} from '@/redux/api/productApi';
import ProdByType from '@/components/ProdByType';
import SelectedProdTitle from './EventBoardScreen/components/SelectedProdTitle';
import AppStyledText from '@/components/AppStyledText';
import ScreenHeader from '@/components/ScreenHeader';
import TabBar from './CountryScreen/TabBar';

const Tab = createMaterialTopTabNavigator();

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
  whiteBox: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: colors.white,
  },
  greyBox: {
    padding: 16,
    backgroundColor: colors.backGrey,
    display: 'flex',
    flexDirection: 'row',
  },
  clock: {
    marginRight: 6,
    alignSelf: 'center',
  },
  chargeablePeriodText: {
    ...appStyles.medium14,
    lineHeight: 22,
    color: colors.clearBlue,
  },
  chargeablePeriodTextBold: {
    ...appStyles.bold14Text,
    lineHeight: 22,
  },
});

type ChargeScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Charge'
>;

type ChargeScreenProps = {
  navigation: ChargeScreenNavigationProp;
  route: RouteProp<HomeStackParamList, 'Charge'>;
  product: ProductModelState;
  action: {
    product: ProductAction;
  };
};

const ChargeScreen: React.FC<ChargeScreenProps> = ({
  navigation,
  route: {params},
  product,
  action,
}) => {
  const {prodByLocalOp, prodList} = product;
  const {chargeableItem, chargeablePeriod} = params || {};
  const isTop = useRef(true);
  const blockAnimation = useRef(false);
  const animatedValue = useRef(new Animated.Value(264)).current;

  const prodData = useMemo(() => {
    if (chargeableItem?.localOpId) {
      return makeProdData(
        prodList,
        prodByLocalOp,
        [chargeableItem?.localOpId].concat(chargeableItem?.extLocalOps || []),
      );
    }
    return [];
  }, [
    chargeableItem.extLocalOps,
    chargeableItem?.localOpId,
    prodByLocalOp,
    prodList,
  ]);

  useEffect(() => {
    if (chargeableItem?.localOpId) {
      action.product.getProdOfPartner([chargeableItem?.localOpId]);
    }
  }, [action.product, chargeableItem?.localOpId]);

  const onPress = useCallback(
    (data: RkbProduct) =>
      navigation.navigate('ChargeAgreement', {
        title: i18n.t('esim:charge:type:extension'),
        type: 'extension',
        extensionProd: data,
        chargeableItem,
        contents: {
          chargeProd: data.name,
          noticeTitle: i18n.t('esim:charge:extension:notice:title'),
          noticeBody: [1, 2, 3, 4, 5, 6].map((n) =>
            i18n.t(`esim:charge:extension:notice:body${n}`),
          ),
        },
      }),
    [navigation, chargeableItem],
  );

  const onTop = useCallback(
    (v: boolean) => {
      isTop.current = v;

      if (!blockAnimation.current) {
        blockAnimation.current = true;
        Animated.timing(animatedValue, {
          toValue: isTop.current ? 264 : 0,
          duration: 500,
          useNativeDriver: false,
        }).start(() => {
          blockAnimation.current = false;
        });
      }
    },
    [animatedValue],
  );

  const renderProdType = useCallback(
    (key: 'daily' | 'total') => () =>
      (
        <ProdByType
          prodData={prodData[key === 'daily' ? 0 : 1]}
          prodType={key}
          onTop={onTop}
          onPress={onPress}
          isCharge
        />
      ),
    [onPress, onTop, prodData],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={i18n.t('esim:charge:type:extension')} />

      <Animated.View style={{height: animatedValue}}>
        <SelectedProdTitle
          isdaily={chargeableItem?.daily === 'daily'}
          prodName={chargeableItem?.prodName || ''}
        />
        <View style={styles.whiteBox}>
          <View style={styles.greyBox}>
            <AppSvgIcon name="blueClock" style={styles.clock} />
            <AppStyledText
              text={i18n.t('esim:rechargeablePeriod2')}
              textStyle={styles.chargeablePeriodText}
              format={{b: styles.chargeablePeriodTextBold}}
              data={{
                chargeablePeriod:
                  moment(chargeablePeriod, 'YYYY.MM.DD').format(
                    'YYYY년 MM월 DD일',
                  ) || '',
              }}
            />
          </View>
        </View>
      </Animated.View>

      {prodData.length > 0 ? (
        <Tab.Navigator
          initialRouteName={prodData[0].length === 0 ? 'total' : 'daily'}
          tabBar={(props) => <TabBar {...props} />}
          sceneContainerStyle={{backgroundColor: colors.white}}>
          {['daily', 'total'].map((k) => (
            <Tab.Screen
              key={k}
              name={k}
              component={renderProdType(k)}
              options={{lazy: true, title: i18n.t(`country:${k}`)}}
            />
          ))}
        </Tab.Navigator>
      ) : null}
    </SafeAreaView>
  );
};

export default connect(
  ({product}: RootState) => ({product}),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
    },
  }),
)(ChargeScreen);
