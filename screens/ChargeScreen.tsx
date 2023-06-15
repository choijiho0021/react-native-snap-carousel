import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Animated} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {TabView} from 'react-native-tab-view';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';
import AppBackButton from '@/components/AppBackButton';
import i18n from '@/utils/i18n';
import {RootState} from '@/redux';
import {
  actions as productActions,
  ProductAction,
  ProductModelState,
} from '@/redux/modules/product';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppTabHeader from '@/components/AppTabHeader';
import {makeProdData} from './CountryScreen';
import {retrieveData} from '@/utils/utils';
import AppSvgIcon from '@/components/AppSvgIcon';
import {HomeStackParamList} from '@/navigation/navigation';
import {RkbProduct} from '@/redux/api/productApi';
import ProdByType from '@/components/ProdByType';
import SelectedProdTitle from './EventBoardScreen/components/SelectedProdTitle';
import AppStyledText from '@/components/AppStyledText';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
  tab: {
    backgroundColor: colors.white,
    height: 50,
    paddingHorizontal: 20,
  },
  tabTitle: {
    ...appStyles.medium18,
    lineHeight: 26,
    color: colors.gray2,
  },
  header: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  headerTitle: {
    height: 56,
    marginRight: 8,
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
  selectedTabTitle: {
    ...appStyles.bold18Text,
    color: colors.black,
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
  divider16: {
    height: 16,
    width: '100%',
    backgroundColor: colors.white,
  },
  divider24: {
    height: 24,
    width: '100%',
    backgroundColor: colors.white,
  },
});

type ChargeTabRouteKey = 'daily' | 'total';
type ChargeTabRoute = {
  key: ChargeTabRouteKey;
  title: string;
  category: string;
};

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
  const {localOpList, prodByPartner} = product;
  const [index, setIndex] = useState(0);
  const [showTip, setTip] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const [blockAnimation, setBlockAnimation] = useState(false);
  const animatedValue = useRef(new Animated.Value(264)).current;

  useEffect(() => {
    retrieveData('chargeTooltip').then((elm) => setTip(elm !== 'closed'));
  }, []);

  useEffect(() => {
    if (!blockAnimation) {
      setBlockAnimation(true);
      Animated.timing(animatedValue, {
        toValue: isTop ? 264 : 0,
        duration: 500,
        useNativeDriver: false,
      }).start(() => setBlockAnimation(false));
    }
  }, [animatedValue, blockAnimation, isTop]);

  const partnerIds = useMemo(() => {
    return product.prodByCountry.reduce((acc: string[], cur) => {
      const curArr = cur.country.split(',');
      const mainCntryArr = params?.mainSubs?.country || [];

      if (
        curArr.length === mainCntryArr.length &&
        curArr.filter((elm) => mainCntryArr.includes(elm)).length ===
          curArr.length
      )
        acc.push(cur.partner);

      return acc;
    }, []);
  }, [params?.mainSubs?.country, product.prodByCountry]);

  const prodData = useMemo(() => {
    if (partnerIds) {
      const cmiPartnerIds = partnerIds.filter(
        (partnerId) => localOpList.get(partnerId)?.partner === 'cmi',
      );

      // 중복 제거
      const uniqueList = cmiPartnerIds.filter(
        (item, i) => cmiPartnerIds.indexOf(item) === i,
      );

      return makeProdData(prodByPartner, uniqueList);
    }
    return [];
  }, [localOpList, partnerIds, prodByPartner]);

  useEffect(() => {
    action.product.getProdOfPartner(partnerIds);
  }, [action.product, partnerIds]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <View style={styles.header}>
          <AppBackButton
            title={i18n.t('esim:charge:type:extension')}
            style={styles.headerTitle}
          />
        </View>
      ),
    });
  }, [navigation, showTip]);

  const onIndexChange = useCallback((idx: number) => {
    setIndex(idx);
  }, []);
  const routes = useMemo(
    () =>
      [
        {
          key: 'daily',
          title: i18n.t('country:daily'),
          category: 'daily',
        },
        {
          key: 'total',
          title: i18n.t('country:total'),
          category: 'total',
        },
      ] as ChargeTabRoute[],
    [],
  );

  const onPress = useCallback(
    (data: RkbProduct) =>
      navigation.navigate('ChargeAgreement', {
        title: i18n.t('esim:charge:type:extension'),
        extensionProd: data,
        mainSubs: params.mainSubs,
        contents: {
          chargeProd: data.name,
          noticeTitle: i18n.t('esim:charge:extension:notice:title'),
          noticeBody: [1, 2, 3, 4, 5, 6].map((n) =>
            i18n.t(`esim:charge:extension:notice:body${n}`),
          ),
        },
      }),
    [navigation, params.mainSubs],
  );

  const renderScene = useCallback(
    ({route: sceneRoute}: {route: ChargeTabRoute}) => {
      return (
        <ProdByType
          prodData={prodData[sceneRoute.category === 'daily' ? 0 : 1]}
          onTop={setIsTop}
          onPress={onPress}
          isCharge
        />
      );
    },
    [onPress, prodData],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{height: animatedValue}}>
        <SelectedProdTitle
          isdaily={params?.mainSubs?.daily === 'daily'}
          prodName={params?.mainSubs?.prodName || ''}
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
                  moment(params?.chargeablePeriod, 'YYYY.MM.DD').format(
                    'YYYY년 MM월 DD일',
                  ) || '',
              }}
            />
          </View>
        </View>
      </Animated.View>

      <View style={styles.divider16} />

      <AppTabHeader
        index={index}
        routes={routes}
        onIndexChange={onIndexChange}
        style={styles.tab}
        tintColor={colors.black}
        titleStyle={styles.tabTitle}
        seletedStyle={styles.selectedTabTitle}
      />

      <View style={styles.divider24} />

      <TabView
        sceneContainerStyle={{flex: 1, backgroundColor: colors.white}}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={onIndexChange}
        renderTabBar={() => null}
      />
    </SafeAreaView>
  );
};

export default connect(
  ({product}: RootState) => ({
    product,
  }),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
    },
  }),
)(ChargeScreen);
