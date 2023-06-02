import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import {RouteProp} from '@react-navigation/native';
import {TabView} from 'react-native-tab-view';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {StackNavigationProp} from '@react-navigation/stack';
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
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {retrieveData, storeData} from '@/utils/utils';
import AppSvgIcon from '@/components/AppSvgIcon';
import {HomeStackParamList} from '@/navigation/navigation';
import {RkbProduct} from '@/redux/api/productApi';
import ProdByType from '@/components/ProdByType';
import TextWithDot from './EsimScreen/components/TextWithDot';
import SelectedProdTitle from './EventBoardScreen/components/SelectedProdTitle';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
  tab: {
    backgroundColor: colors.white,
    height: 74,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  tabTitle: {
    ...appStyles.medium18,
    lineHeight: 26,
    color: colors.gray2,
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
  cautionBtn: {
    width: 24,
    height: 24,
    marginTop: 2,
  },
  toolTipStyle: {
    borderRadius: 5,
  },
  arrowStyle: {
    borderTopColor: colors.black,
    zIndex: 10,
  },
  toolTipBox: {
    backgroundColor: colors.black,
    // borderWidth: 1,
    // borderColor: colors.lightGrey,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    height: '100%',
  },
  toolTipTitleFrame: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 36,
    marginBottom: 12,
  },
  toolTipTitleText: {
    ...appStyles.bold14Text,
    color: colors.white,
    lineHeight: 20,
  },
  btnCancel: {
    width: 12,
    height: 12,
    marginRight: 8,
  },
  toolTipBody: {
    paddingRight: 30,
  },

  toolTipBodyText: {
    ...appStyles.normal14Text,
    color: colors.white,
    lineHeight: 20,
  },
  selectedTabTitle: {
    ...appStyles.bold18Text,
    color: colors.black,
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

  useEffect(() => {
    retrieveData('chargeTooltip').then((elm) => setTip(elm !== 'closed'));
  }, []);

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
      return makeProdData(prodByPartner, cmiPartnerIds);
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
          period: (
            <TextWithDot
              text={i18n.t('esim:charge:extension:body', {
                date: '0000년 00월 00일',
              })}
            />
          ),
          noticeTitle: i18n.t('esim:charge:extension:notice:title'),
          noticeBody: [1, 2, 3, 4, 5, 6, 7].map((n) =>
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
          onPress={onPress}
          isCharge
        />
      );
    },
    [onPress, prodData],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <SelectedProdTitle
          isdaily={params?.mainSubs?.daily === 'daily'}
          prodName={params?.mainSubs?.prodName || ''}
        />
        <AppTabHeader
          index={index}
          routes={routes}
          onIndexChange={onIndexChange}
          style={styles.tab}
          tintColor={colors.black}
          titleStyle={styles.tabTitle}
          seletedStyle={styles.selectedTabTitle}
        />

        <TabView
          sceneContainerStyle={{flex: 1}}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={onIndexChange}
          renderTabBar={() => null}
        />
      </View>
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
