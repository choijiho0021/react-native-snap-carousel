import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import {RouteProp} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {TabView} from 'react-native-tab-view';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {StackNavigationProp} from '@react-navigation/stack';
import AppBackButton from '@/components/AppBackButton';
import i18n from '@/utils/i18n';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import {RootState} from '@/redux';
import {
  actions as productActions,
  ProductAction,
  ProductModelState,
} from '@/redux/modules/product';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import AppTabHeader from '@/components/AppTabHeader';
import {makeProdData} from './CountryScreen';
import CountryListItem from '@/components/CountryListItem';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {retrieveData, storeData} from '@/utils/utils';
import AppSvgIcon from '@/components/AppSvgIcon';
import {HomeStackParamList} from '@/navigation/navigation';
import {RkbProduct} from '@/redux/api/productApi';
import ProdByType from '@/components/ProdByType';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
  tab: {
    backgroundColor: colors.white,
    height: 60,
    paddingHorizontal: 25,
  },
  tabTitle: {
    fontSize: 16,
    lineHeight: 20,
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
    borderTopColor: colors.lightGrey,
    zIndex: 10,
  },
  triangle: {
    position: 'absolute',
    top: 32,
    backgroundColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: colors.backGrey,
    borderRightWidth: 8,
    borderRightColor: 'transparent',
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    width: 0,
    height: 0,
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
    padding: 8,
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
  emptyImage: {
    marginBottom: 21,
  },
  emptyData: {
    alignItems: 'center',
    marginTop: '45%',
  },
  emptyText1: {
    ...appStyles.medium14,
    color: colors.clearBlue,
    lineHeight: 20,
  },
  emptyText2: {
    ...appStyles.normal14Text,
    lineHeight: 20,
  },
  devider: {
    height: 14,
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
        (partnerId) => localOpList.get(partnerId)?.partner === 'CMI',
      );
      return makeProdData(prodByPartner, cmiPartnerIds);
    }
    return [];
  }, [localOpList, partnerIds, prodByPartner]);

  useEffect(() => {
    action.product.getProdOfPartner(partnerIds);
  }, [action.product, partnerIds]);

  const renderToolTip = useCallback(
    () => (
      <Tooltip
        isVisible={showTip}
        backgroundColor="rgba(0,0,0,0)"
        contentStyle={styles.toolTipBox}
        tooltipStyle={styles.toolTipStyle}
        arrowStyle={styles.arrowStyle}
        disableShadow
        arrowSize={{width: 16, height: 8}}
        content={
          <View>
            <View style={styles.toolTipTitleFrame}>
              <AppText style={styles.toolTipTitleText}>
                {i18n.t('esim:chargeCaution')}
              </AppText>
              <AppButton style={styles.btnCancel} iconName="btnCancelWhite" />
            </View>
            <View style={styles.toolTipBody}>
              {[1, 2, 3].map((k) => (
                <View key={k} style={{flexDirection: 'row'}}>
                  <AppText
                    style={[
                      appStyles.normal14Text,
                      {marginHorizontal: 5, marginTop: 3, color: colors.white},
                    ]}>
                    •
                  </AppText>
                  <AppText style={styles.toolTipBodyText}>
                    {i18n.t(`esim:chargeCaution:modal${k}`)}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        }
        onClose={() => {
          setTip(false);
          storeData('chargeTooltip', 'closed');
        }}
        placement="bottom">
        <AppSvgIcon
          style={styles.cautionBtn}
          onPress={() => {
            storeData('chargeTooltip', 'closed');
            setTip(true);
          }}
          name="btnChargeCaution"
        />
        {showTip && <View style={styles.triangle} />}
      </Tooltip>
    ),
    [showTip],
  );

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <View style={styles.header}>
          <AppBackButton
            title={i18n.t('esim:charge')}
            style={styles.headerTitle}
          />
          {renderToolTip()}
        </View>
      ),
    });
  }, [navigation, renderToolTip, showTip]);

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
      navigation.navigate('ChargeDetail', {
        data,
        prodName: params?.mainSubs?.prodName,
        chargeablePeriod: params?.chargeablePeriod,
        subsIccid: params?.mainSubs?.subsIccid,
      }),
    [
      navigation,
      params?.chargeablePeriod,
      params?.mainSubs?.prodName,
      params?.mainSubs?.subsIccid,
    ],
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
        <AppTabHeader
          index={index}
          routes={routes}
          onIndexChange={onIndexChange}
          style={styles.tab}
          tintColor={colors.black}
          titleStyle={styles.tabTitle}
        />

        <View style={styles.devider} />
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
