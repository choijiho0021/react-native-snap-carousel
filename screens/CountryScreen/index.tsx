/* eslint-disable consistent-return */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState, useMemo, useRef} from 'react';
import {Animated, SafeAreaView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {Map as ImmutableMap} from 'immutable';
import {TabView} from 'react-native-tab-view';
import Tooltip from 'react-native-walkthrough-tooltip';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {RkbProduct} from '@/redux/api/productApi';
import {actions as cartActions} from '@/redux/modules/cart';
import {ProductModelState} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import ProductImg from '@/components/ProductImg';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppTabHeader from '@/components/AppTabHeader';
import AppButton from '@/components/AppButton';
import {retrieveData, storeData} from '@/utils/utils';
import ProdByType from '@/components/ProdByType';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
  box: {
    height: 150,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  tab: {
    backgroundColor: colors.white,
    height: 84,
    paddingHorizontal: 25,
    paddingBottom: 24,
  },
  tabTitle: {
    fontSize: 18,
    lineHeight: 20,
    color: colors.gray2,
  },
  toolTipBox: {
    backgroundColor: colors.black,
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
    marginLeft: 16,
  },
  btnCancel: {
    padding: 8,
    marginRight: 8,
  },
  toolTipBody: {
    marginLeft: 16,
    paddingRight: 30,
  },
  toolTipBodyText: {
    ...appStyles.normal14Text,
    color: colors.white,
    lineHeight: 20,
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
});

export const makeProdData = (
  prodByPartner: ImmutableMap<string, RkbProduct[]>,
  partnerIds: string[],
) => {
  const prodByPartners = partnerIds.map((partnerId) =>
    prodByPartner.get(partnerId),
  );

  const list: RkbProduct[][] = prodByPartners
    ?.reduce((acc, cur) => (cur ? acc.concat(cur.filter((c) => !!c)) : acc), [])
    ?.reduce(
      (acc, cur) =>
        cur?.field_daily === 'daily'
          ? [acc[0].concat(cur), acc[1]]
          : [acc[0], acc[1].concat(cur)],
      [[], []],
    ) || [[], []];

  return [
    list[0].sort((a, b) => b.weight - a.weight) || [],
    list[1].sort((a, b) => b.weight - a.weight) || [],
  ];
};

type CountryScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Country'
>;

type CountryScreenRouteProp = RouteProp<HomeStackParamList, 'Country'>;

type CountryScreenProps = {
  navigation: CountryScreenNavigationProp;
  route: CountryScreenRouteProp;

  product: ProductModelState;
  pending: boolean;
};

// type ProdDataType = {title: string; data: RkbProduct[]};

type TabRouteKey = 'daily' | 'total';
type TabRoute = {
  key: TabRouteKey;
  title: string;
};

const CountryScreen: React.FC<CountryScreenProps> = (props) => {
  const {navigation, route, product} = props;
  const {localOpList, prodByLocalOp, prodList, prodByPartner} = product;

  const [prodData, setProdData] = useState<RkbProduct[][]>([[], []]);
  const [imageUrl, setImageUrl] = useState<string>();
  const [localOpDetails, setLocalOpDetails] = useState<string>();
  const [partnerId, setPartnerId] = useState<string>();
  const [index, setIndex] = useState<number>();
  const [showTip, setTip] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const headerTitle = useMemo(
    () => API.Product.getTitle(localOpList.get(route.params?.partner[0])),
    [localOpList, route.params?.partner],
  );
  const animatedValue = useRef(new Animated.Value(150)).current;
  const routes = useMemo(
    () =>
      [
        {
          key: 'daily',
          title: i18n.t('country:daily'),
        },
        {
          key: 'total',
          title: i18n.t('country:total'),
        },
      ] as TabRoute[],
    [],
  );

  useEffect(() => {
    retrieveData('LocalProdTooltip').then((elm) => {
      setTip(elm !== 'closed');
      storeData('LocalProdTooltip', 'closed');
    });
  }, []);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isTop ? 150 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, isTop]);

  useEffect(() => {
    if (route.params?.partner) {
      const partnerIds = route.params.partner;

      const localOp = localOpList.get(partnerIds[0]);
      setPartnerId(partnerIds[0]);

      setImageUrl(localOp?.imageUrl);
      setLocalOpDetails(localOp?.detail);
      if (partnerIds.every((elm) => prodByPartner.has(elm))) {
        const data = makeProdData(prodByPartner, partnerIds);
        setProdData(data);
        if (data[0].length === 0) setIndex(1);
        else setIndex(0);
      }
    }
  }, [
    localOpList,
    prodByLocalOp,
    prodByPartner,
    prodList,
    route.params.partner,
  ]);

  const onIndexChange = useCallback((idx: number) => {
    setIndex(idx);
  }, []);

  const onPress = useCallback(
    (prod: RkbProduct) =>
      navigation.navigate('ProductDetail', {
        title: prod.name,
        item: API.Product.toPurchaseItem(prod),
        img: imageUrl,
        uuid: prod.uuid,
        desc: prod.desc,
        localOpDetails,
        partnerId,
      }),
    [imageUrl, localOpDetails, navigation, partnerId],
  );

  const renderScene = useCallback(
    ({route}: {route: TabRoute}) => {
      return (
        <ProdByType
          prodData={prodData[route.key === 'daily' ? 0 : 1]}
          onTop={setIsTop}
          onPress={onPress}
          isCharge={false}
        />
      );
    },
    [onPress, prodData],
  );

  const renderToolTip = useCallback(
    () => (
      <Tooltip
        isVisible={showTip}
        backgroundColor="rgba(0,0,0,0)"
        contentStyle={styles.toolTipBox}
        tooltipStyle={styles.toolTipStyle}
        arrowStyle={styles.arrowStyle}
        disableShadow
        arrowSize={{width: 20, height: 12}}
        content={
          <View>
            <View style={styles.toolTipTitleFrame}>
              <AppText style={styles.toolTipTitleText}>
                {i18n.t('local:noticeBox:title')}
              </AppText>
              <AppButton
                style={styles.btnCancel}
                iconName="btnCancel"
                onPress={() => setTip(false)}
              />
            </View>
            <View style={styles.toolTipBody}>
              {[1, 2].map((k) => (
                <View key={k} style={{flexDirection: 'row'}}>
                  <AppText
                    style={[
                      appStyles.normal14Text,
                      {marginHorizontal: 5, marginTop: 3, color: colors.white},
                    ]}>
                    •
                  </AppText>
                  <AppText style={styles.toolTipBodyText}>
                    {i18n.t(`local:noticeBox:body${k}`)}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        }
        onClose={() => {
          setTip(false);
        }}
        placement="bottom">
        <AppSvgIcon
          style={styles.cautionBtn}
          onPress={() => {
            storeData('LocalProdTooltip', 'closed');
            setTip(true);
          }}
          name="btnChargeCaution"
        />
        {/* {showTip && <View style={styles.triangle} />} */}
      </Tooltip>
    ),
    [showTip],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppBackButton
          title={headerTitle}
          style={{marginRight: 10, height: 56}}
          onPress={() => {
            navigation.navigate('Home');
          }}
        />
        {(headerTitle.includes('(로컬망)') ||
          headerTitle.includes('(local)')) &&
          renderToolTip()}
      </View>

      {imageUrl && (
        <Animated.View style={{height: animatedValue}}>
          <ProductImg
            imageStyle={styles.box}
            source={{uri: API.default.httpImageUrl(imageUrl)}}
          />
        </Animated.View>
      )}

      {index !== undefined && (
        <View style={{backgroundColor: colors.white, flex: 1}}>
          <AppTabHeader
            index={index}
            routes={routes}
            onIndexChange={onIndexChange}
            style={styles.tab}
            tintColor={colors.black}
            titleStyle={styles.tabTitle}
          />

          <TabView
            sceneContainerStyle={{flex: 1}}
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={onIndexChange}
            renderTabBar={() => null}
          />
        </View>
      )}
      <AppActivityIndicator visible={props.pending} />
    </SafeAreaView>
  );
};

export default connect(({product, status}: RootState) => ({
  product,
  pending:
    status.pending[cartActions.cartAddAndGet.typePrefix] ||
    status.pending[cartActions.checkStockAndPurchase.typePrefix] ||
    false,
}))(CountryScreen);
