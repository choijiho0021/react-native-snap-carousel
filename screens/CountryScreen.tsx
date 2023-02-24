/* eslint-disable consistent-return */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState, useMemo, useRef} from 'react';
import {
  Pressable,
  SafeAreaView,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {Map as ImmutableMap} from 'immutable';
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
import CountryListItem from './HomeScreen/component/CountryListItem';
import ProductImg from '@/components/ProductImg';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppTabHeader from '@/components/AppTabHeader';
import {TabView} from 'react-native-tab-view';
import {ScrollView} from 'react-native-gesture-handler';
import Tooltip from 'react-native-walkthrough-tooltip';
import AppButton from '@/components/AppButton';
import {retrieveData, storeData} from '@/utils/utils';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
  box: {
    height: 150,
    marginBottom: 8,
    // resizeMode: 'cover'
  },
  divider: {
    height: 10,
    backgroundColor: colors.whiteTwo,
    marginTop: 32,
  },
  sectionHeader: {
    paddingTop: 32,
    paddingBottom: 20,
    marginHorizontal: 20,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  localNoticeBox: {
    marginTop: 16,
    marginBottom: 24,
    padding: 20,
    backgroundColor: colors.backGrey,
    marginHorizontal: 20,
  },
  localNoticeTitle: {
    ...appStyles.bold18Text,
    lineHeight: 22,
    marginBottom: 8,
  },
  localNoticeBody: {
    ...appStyles.semiBold14Text,
    marginTop: 8,
    lineHeight: 20,
    color: colors.warmGrey,
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
  toolTipBox: {
    backgroundColor: colors.backGrey,
    borderWidth: 1,
    borderColor: colors.lightGrey,
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

  // return [
  //   {
  //     title: 'daily',
  //     data: list[0].sort((a, b) => b.weight - a.weight) || [],
  //   },
  //   {
  //     title: 'total',
  //     data: list[1].sort((a, b) => b.weight - a.weight) || [],
  //   },
  // ];
};

const position = (idx, arr) => {
  if (arr.length > 1) {
    if (idx === 0) return 'head';
    if (idx === arr.length - 1) return 'tail';
    return 'middle';
  }
  return 'onlyOne';
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

  const [prodData, setProdData] = useState<RkbProduct[][]>([[]]);
  const [imageUrl, setImageUrl] = useState<string>();
  const [localOpDetails, setLocalOpDetails] = useState<string>();
  const [partnerId, setPartnerId] = useState<string>();
  const [index, setIndex] = useState(0);
  const [showTip, setTip] = useState(false);
  const headerTitle = useMemo(
    () => API.Product.getTitle(localOpList.get(route.params?.partner[0])),
    [localOpList, route.params?.partner],
  );

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
    retrieveData('LocalProdTooltip').then((elm) => setTip(elm !== 'closed'));
  }, []);

  useEffect(() => {
    if (route.params?.partner) {
      const partnerIds = route.params.partner;

      const localOp = localOpList.get(partnerIds[0]);
      setPartnerId(partnerIds[0]);

      setImageUrl(localOp?.imageUrl);
      setLocalOpDetails(localOp?.detail);

      setProdData(makeProdData(prodByPartner, partnerIds));
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

  const renderScene = useCallback(
    ({route: sceneRoute}: {route: TabRoute}) => {
      const prodDataC = prodData[sceneRoute.key === 'daily' ? 0 : 1];

      return (
        <ScrollView>
          {prodDataC.length > 0 ? (
            prodDataC.map((data) => (
              <CountryListItem
                key={data.sku}
                item={data}
                onPress={() =>
                  navigation.navigate('ProductDetail', {
                    title: data.name,
                    item: API.Product.toPurchaseItem(data),
                    img: imageUrl,
                    uuid: data.uuid,
                    desc: data.desc,
                    localOpDetails,
                    partnerId,
                  })
                }
                isCharge
              />
            ))
          ) : (
            <View style={styles.emptyData}>
              <AppSvgIcon name="threeDots" style={styles.emptyImage} />

              <AppText style={styles.emptyText1}>
                {i18n.t('esim:charge:noProd1')}
              </AppText>
              <AppText style={styles.emptyText2}>
                {i18n.t('esim:charge:noProd2')}
              </AppText>
            </View>
          )}
        </ScrollView>
      );
    },
    [imageUrl, localOpDetails, navigation, partnerId, prodData],
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
        arrowSize={{width: 16, height: 8}}
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
                      {marginHorizontal: 5, marginTop: 3},
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
          storeData('LocalProdTooltip', 'closed');
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
        {showTip && <View style={styles.triangle} />}
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
        <ProductImg
          imageStyle={styles.box}
          source={{uri: API.default.httpImageUrl(imageUrl)}}
          // maxDiscount={} 상품 리스트 화면의 이미지에는 일단 할인 태그 붙이지 않음 추후 반영 예정
        />
      )}

      {/* {(headerTitle.includes('(로컬망)') ||
        headerTitle.includes('(local)')) && (
        <Pressable
          style={styles.localNoticeBox}
          onPress={() => setShowMoreInfo((pre) => !pre)}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <AppText style={styles.localNoticeTitle}>
              {i18n.t('local:noticeBox:title')}
            </AppText>
            <AppSvgIcon
              name={showMoreInfo ? 'upArrow' : 'downArrow'}
              style={{alignItems: 'center', justifyContent: 'center'}}
            />
          </View>
          {showMoreInfo && (
            <AppText style={styles.localNoticeBody}>
              {i18n.t('local:noticeBox:body')}
            </AppText>
          )}
        </Pressable>
      )} */}

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
