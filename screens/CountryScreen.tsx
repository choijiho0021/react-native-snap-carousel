/* eslint-disable consistent-return */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import _ from 'underscore';
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
import {isDeviceSize} from '../constants/SliderEntry.style';
import utils from '@/redux/api/utils';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
  box: {
    height: 150,
    // resizeMode: 'cover'
  },
  card: {
    // borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    // borderWidth: 1,
    // borderColor: 'transparent',
    // marginVertical: 7,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
  },
  divider: {
    height: 10,
    backgroundColor: colors.whiteTwo,
    marginTop: 32,
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
  wonStyle: {
    // height: 24,
    // fontFamily: "Roboto",
    fontSize: isDeviceSize('medium') ? 24 : 26,
    fontWeight: 'bold',
    fontStyle: 'normal',
    // lineHeight: 22,
    // letterSpacing: 0.19,
    color: colors.black,
  },
  textView: {
    flex: 1,
    alignItems: 'flex-start',
  },
  badge: {
    paddingHorizontal: 8,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badgeText: {
    ...appStyles.bold13Text,
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
});
const toVolumeStr = (volume: number) => {
  if (volume <= 1000) return `${volume}MB`;
  return `${volume / 1024}GB`;
};

const CountryListItem0 = ({
  item,
  position,
  onPress,
}: {
  item: RkbProduct;
  position?: string;
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
        : item.days + i18n.t('day'),
    [item.days, item.field_daily, item.volume],
  );

  const getBadgeColor = useCallback((key) => {
    if (key === 'hot')
      return {
        backgroundColor: colors.veryLightPink,
        fontColor: colors.tomato,
      };

    if (key === 'sizeup')
      return {
        backgroundColor: colors.veryLightBlue,
        fontColor: colors.clearBlue,
      };
    if (key === 'doubleSizeup')
      return {
        backgroundColor: colors.lightSage,
        fontColor: colors.shamrock,
      };

    return {
      backgroundColor: colors.veryLightPink,
      fontColor: colors.tomato,
    };
  }, []);

  const myStyle = useMemo(() => {
    switch (position) {
      case 'head':
        return {
          borderLeftWidth: 1,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderLeftColor: colors.lightGrey,
          borderTopColor: colors.lightGrey,
          borderRightColor: colors.lightGrey,
          paddingTop: 26,
          paddingBottom: 20,
        };
      case 'middle':
        return {
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderLeftColor: colors.lightGrey,
          borderRightColor: colors.lightGrey,
          paddingVertical: 20,
        };
      case 'tail':
        return {
          borderLeftWidth: 1,
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderLeftColor: colors.lightGrey,
          borderBottomColor: colors.lightGrey,
          borderRightColor: colors.lightGrey,
          paddingTop: 20,
          paddingBottom: 26,
        };
      default:
        return {borderWidth: 1, borderColor: colors.lightGrey};
    }
  }, [position]);

  return (
    <Pressable onPress={onPress}>
      <View key="product" style={[styles.card, myStyle]}>
        <View key="text" style={styles.textView}>
          <View style={styles.titleAndPrice}>
            <View style={{flexDirection: 'row'}}>
              <AppText
                key="name"
                style={[
                  isDeviceSize('medium')
                    ? appStyles.bold18Text
                    : appStyles.bold20Text,
                  color,
                ]}>
                {title}
              </AppText>
              {!_.isEmpty(item.promoFlag) &&
                item.promoFlag.map((elm) => {
                  const badgeColor = getBadgeColor(elm);
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
            <AppText
              key="price"
              style={[
                appStyles.bold24Text,
                {
                  fontSize: isDeviceSize('medium') ? 22 : 24,
                },
              ]}>
              {`${utils.currencyString(item.price.value)}${i18n.t(
                item.price.currency,
              )}`}
            </AppText>
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
      {position !== 'tail' && position !== 'onlyOne' && (
        <View style={styles.itemOutDivider}>
          <View style={styles.itemDivider} />
        </View>
      )}
    </Pressable>
  );
};

const CountryListItem = memo(CountryListItem0);

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

type ProdDataType = {title: string; data: RkbProduct[]};

const CountryScreen: React.FC<CountryScreenProps> = (props) => {
  const {navigation, route, product} = props;
  const {localOpList, prodByLocalOp, prodList} = product;

  const [prodData, setProdData] = useState<ProdDataType[]>([]);
  const [imageUrl, setImageUrl] = useState<string>();
  const [localOpDetails, setLocalOpDetails] = useState<string>();
  const [partnerId, setPartnerId] = useState<string>();

  useEffect(() => {
    const title = API.Product.getTitle(
      localOpList.get(route.params?.partner[0]),
    );

    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={title} />,
    });
  }, [localOpList, navigation, route.params?.partner]);

  useEffect(() => {
    if (route.params?.partner) {
      const partnerIds = route.params.partner;
      const list =
        partnerIds
          .map((p) => prodByLocalOp.get(p)?.map((p) => prodList.get(p)))
          .reduce(
            (acc, cur) => (cur ? acc.concat(cur.filter((c) => !!c)) : acc),
            [],
          )
          .reduce(
            (acc, cur) =>
              cur?.field_daily === 'daily'
                ? [(acc[0] || []).concat(cur), acc[1] || []]
                : [acc[0] || [], (acc[1] || []).concat(cur)],
            [],
          ) || [];

      const localOp = localOpList.get(partnerIds[0]);
      setPartnerId(partnerIds[0]);

      setProdData([
        {title: 'daily', data: list[0] || []},
        {title: 'total', data: list[1] || []},
      ]);
      setImageUrl(localOp?.imageUrl);
      setLocalOpDetails(localOp?.detail);
    }
  }, [localOpList, prodByLocalOp, prodList, route.params.partner]);

  const renderItem = useCallback(
    ({item, index, section}) => (
      <CountryListItem
        key={item.sku}
        item={item}
        onPress={() =>
          navigation.navigate('ProductDetail', {
            title: item.name,
            item: API.Product.toPurchaseItem(item),
            img: imageUrl,
            uuid: item.uuid,
            desc: item.desc,
            localOpDetails,
            partnerId,
          })
        }
        position={position(index, section.data)}
      />
    ),
    [imageUrl, localOpDetails, navigation, partnerId],
  );

  return (
    <SafeAreaView style={styles.container}>
      {imageUrl && (
        <Image
          style={styles.box}
          source={{uri: API.default.httpImageUrl(imageUrl)}}
        />
      )}

      <View style={{flex: 1}}>
        <SectionList
          sections={prodData}
          stickySectionHeadersEnabled
          // keyExtractor={(item, index) => item + index}
          renderItem={renderItem}
          renderSectionHeader={({section: {title, data}}) =>
            data.length >= 1 ? (
              <View style={styles.sectionHeader}>
                <AppText
                  style={{
                    ...appStyles.bold20Text,
                  }}>
                  {i18n.t(`country:${title}`)}
                </AppText>
              </View>
            ) : null
          }
          renderSectionFooter={({section: {title, data}}) =>
            title === 'daily' && prodData[1].data.length >= 1 ? (
              <View style={styles.divider} />
            ) : (
              <View style={{width: '100%', height: 20}} />
            )
          }
        />
      </View>
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
