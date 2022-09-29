import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Pressable} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import {bindActionCreators} from 'redux';
import i18n from '@/utils/i18n';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import {connect} from 'react-redux';
import {RootState} from '@/redux';
import {
  actions as productActions,
  ProdDataType,
  ProductAction,
  ProductModelState,
} from '@/redux/modules/product';
import {getPromoFlagColor, RkbProduct} from '@/redux/api/productApi';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import {device, isDeviceSize, windowWidth} from '@/constants/SliderEntry.style';
import AppPrice from '@/components/AppPrice';
import _ from 'underscore';
import AppTabHeader from '@/components/AppTabHeader';
import {SceneMap, TabView} from 'react-native-tab-view';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 8,
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
  },
  priceStyle: {
    height: 24,
    // fontFamily: "Roboto",
    fontSize: isDeviceSize('medium') ? 24 : 26,
    fontWeight: 'bold',
    fontStyle: 'normal',
    // lineHeight: 22,
    // letterSpacing: 0.19,
    textAlign: 'right',
    color: colors.black,
  },
  title: {
    ...appStyles.bold18Text,
    fontSize: isDeviceSize('medium') ? 18 : 20,
    color: colors.clearBlue,
  },
  balanceStyle: {
    ...appStyles.bold22Text,
    fontSize: isDeviceSize('medium') ? 22 : 24,
    lineHeight: 24,
  },
  wonStyle: {
    ...appStyles.normal14Text,
    fontSize: isDeviceSize('medium') ? 14 : 12,
    lineHeight: 24,
    color: colors.black,
  },
  textView: {
    flex: 1,
    alignItems: 'flex-start',
  },
  badge: {
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badgeText: {
    ...appStyles.extraBold20,
    fontSize: 12,
    lineHeight: 16,
  },
  itemDivider: {
    marginHorizontal: 20,
    height: 1,
    backgroundColor: colors.whiteTwo,
  },
  itemOutDivider: {
    marginHorizontal: 20,
    height: 1,
    borderStyle: 'solid',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: colors.lightGrey,
    borderRightColor: colors.lightGrey,
  },
  sectionHeader: {
    paddingTop: 32,
    paddingBottom: 20,
    marginHorizontal: 20,
    backgroundColor: colors.white,
  },
  titleAndPrice: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleFrame: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detail: {
    height: windowWidth > device.small.window.width ? 48 : 36,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.black,
    marginTop: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    paddingLeft: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  tab: {
    backgroundColor: colors.white,
    height: 60,
  },
  tabTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
});

type ParamList = {
  ChargeScreen: {
    item: RkbSubscription;
    chargeableDate: string;
  };
};

type ChargeTabRouteKey = 'daily' | 'total';
type ChargeTabRoute = {
  key: ChargeTabRouteKey;
  title: string;
  category: string;
};

type ChargeScreenProps = {
  product: ProductModelState;
  action: {
    product: ProductAction;
  };
};

const toVolumeStr = (volume: number) => {
  if (volume <= 1000) return `${volume}MB`;
  return `${volume / 1024}GB`;
};

const CountryListItem0 = ({
  item,
  onPress,
}: {
  item: RkbProduct;
  onPress: () => void;
}) => {
  const color = useMemo(
    () => ({
      color:
        item.field_daily === 'total' ? colors.purplyBlue : colors.clearBlue,
    }),
    [item.field_daily],
  );
  const title = useMemo(
    () =>
      item.field_daily === 'total'
        ? toVolumeStr(Number(item.volume))
        : item.days + i18n.t(item.days > 1 ? 'days' : 'day'),
    [item.days, item.field_daily, item.volume],
  );

  return (
    <Pressable onPress={onPress}>
      <View key="product" style={[styles.card]}>
        <View key="text" style={styles.textView}>
          <View style={styles.titleAndPrice}>
            <View style={styles.titleFrame}>
              <AppText key="name" style={styles.title}>
                {title}
              </AppText>
              {!_.isEmpty(item.promoFlag) &&
                item.promoFlag.map((elm) => {
                  const badgeColor = getPromoFlagColor(elm);
                  return (
                    <View
                      key={elm}
                      style={[
                        styles.badge,
                        {
                          backgroundColor: badgeColor.backgroundColor,
                        },
                      ]}>
                      <AppText
                        key="name"
                        style={[
                          styles.badgeText,
                          {color: badgeColor.fontColor},
                        ]}>
                        {i18n.t(elm)}
                      </AppText>
                    </View>
                  );
                })}
            </View>
            <AppPrice
              price={item.price}
              balanceStyle={styles.balanceStyle}
              currencyStyle={styles.wonStyle}
            />
          </View>

          <AppText
            key="desc"
            style={[
              appStyles.normal13,
              {marginTop: 5, fontSize: isDeviceSize('medium') ? 13 : 15},
            ]}>
            {item.field_description}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
};

const CountryListItem = memo(CountryListItem0);

const ChargeScreen: React.FC<ChargeScreenProps> = ({product, action}) => {
  const {localOpList, prodByLocalOp, prodList} = product;
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ChargeScreen'>>();
  const params = useMemo(() => route?.params, [route?.params]);

  const [partnerIds, setPartnerIds] = useState<string[]>([]);

  console.log('@@@@@@params.item', params.item);
  useEffect(() => {
    const partnerTemp: string[] = [];
    product.prodByCountry.forEach((p) => {
      // eslint-disable-next-line eqeqeq
      if (p.country == params.item.country) {
        partnerTemp.push(p.partner);
      }
    });

    setPartnerIds(partnerTemp);
  }, [params.item.country, product.prodByCountry]);

  const [prodData, setProdData] = useState<ProdDataType[]>([]);

  useEffect(() => {
    action.product.getProdOfPartner(partnerIds);
  }, [action.product, partnerIds]);

  useEffect(() => {
    if (partnerIds) {
      const list: RkbProduct[][] = partnerIds
        .filter((partnerId) => {
          return localOpList.get(partnerId)?.partner === 'CMI';
        })
        .map((p) => prodByLocalOp.get(p)?.map((p2) => prodList.get(p2)))
        .reduce(
          (acc, cur) => (cur ? acc.concat(cur.filter((c) => !!c)) : acc),
          [],
        )
        .reduce(
          (acc, cur) =>
            cur?.field_daily === 'daily'
              ? [acc[0].concat(cur), acc[1]]
              : [acc[0], acc[1].concat(cur)],
          [[], []],
        ) || [[], []];
      setProdData([
        {
          title: 'daily',
          data: list[0].sort((a, b) => b.weight - a.weight) || [],
        },
        {
          title: 'total',
          data: list[1].sort((a, b) => b.weight - a.weight) || [],
        },
      ]);
    }
  }, [localOpList, partnerIds, prodByLocalOp, prodList]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('esim:charge')} />,
    });
  }, [navigation]);

  const [index, setIndex] = useState(0);
  const onIndexChange = useCallback((idx: number) => setIndex(idx), []);
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

  const dailyRoute = () => (
    <View>
      {prodData[0]?.data.map((data) => (
        <CountryListItem
          key={data.sku}
          item={data}
          onPress={() => {
            navigation.navigate('ChargeDetail', {
              data,
              prodname: params.item.prodName,
              chargeableDate: params.chargeableDate,
            });
          }}
        />
      ))}
    </View>
  );
  const totalRoute = () => (
    <View>
      {prodData[1]?.data.map((data) => (
        <CountryListItem
          key={data.sku}
          item={data}
          onPress={() => {
            navigation.navigate('ChargeDetail', {
              data,
              prodname: params.item.prodName,
              chargeableDate: params.chargeableDate,
            });
          }}
        />
      ))}
    </View>
  );

  const renderScene = SceneMap({
    daily: dailyRoute,
    total: totalRoute,
  });

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
          st
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
