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
  ViewStyle,
} from 'react-native';
import {connect} from 'react-redux';
import _ from 'underscore';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppPrice from '@/components/AppPrice';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {device, windowWidth} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {RkbProduct} from '@/redux/api/productApi';
import {actions as cartActions} from '@/redux/modules/cart';
import {ProductModelState} from '@/redux/modules/product';
import i18n from '@/utils/i18n';

const {esimGlobal} = Env.get();

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
    borderRadius: 3,
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
    fontSize: windowWidth > device.small.window.width ? 20 : 16,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0.19,
    textAlign: 'right',
    color: colors.black,
  },
  wonStyle: {
    height: 24,
    // fontFamily: "Roboto",
    fontSize: windowWidth > device.small.window.width ? 14 : 12,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0.19,
    color: colors.black,
  },
  appPrice: {
    alignItems: 'flex-end',
    marginLeft: 10,
    width: esimGlobal ? 60 : 80,
    justifyContent: 'center',
  },
  textView: {
    flex: 1,
    alignItems: 'flex-start',
  },
  badge: {
    paddingHorizontal: 8,
    height: 22,
    borderRadius: 2,
    alignItems: 'center',
    paddingTop: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 16,
  },
  itemDivider: {
    marginHorizontal: 40,
    height: 1,
    backgroundColor: colors.whiteTwo,
  },
  itemOutDivider: {
    marginHorizontal: 20,
    height: 1,
    borderStyle: 'solid',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.lightGrey,

    // backgroundColor:'red'
  },
  sectionHeader: {
    paddingTop: 32,
    paddingBottom: 20,
    marginHorizontal: 20,
    backgroundColor: colors.white,
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
  const color = {
    color: item.field_daily === 'total' ? colors.purplyBlue : colors.clearBlue,
  };
  const title =
    item.field_daily === 'total'
      ? toVolumeStr(Number(item.volume))
      : item.days + i18n.t('day');
  let myStyle: ViewStyle = {};

  switch (position) {
    case 'head':
      myStyle = {
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftColor: colors.lightGrey,
        borderTopColor: colors.lightGrey,
        borderRightColor: colors.lightGrey,
      };
      break;
    case 'middle':
      myStyle = {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderLeftColor: colors.lightGrey,
        borderRightColor: colors.lightGrey,
      };
      break;
    case 'tail':
      myStyle = {
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderLeftColor: colors.lightGrey,
        borderBottomColor: colors.lightGrey,
        borderRightColor: colors.lightGrey,
      };
      break;
    default:
      myStyle = {};
      break;
  }

  return (
    <Pressable onPress={onPress}>
      <View key="product" style={[styles.card, myStyle]}>
        <View key="text" style={styles.textView}>
          <View style={{flexDirection: 'row'}}>
            <AppText
              key="name"
              style={[
                windowWidth > device.small.window.width
                  ? appStyles.bold16Text
                  : appStyles.bold14Text,
                color,
              ]}>
              {title}
            </AppText>

            {!_.isEmpty(item.promoFlag) &&
              item.promoFlag.map((elm) => (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        elm === 'hot' ? colors.tomato : colors.clearBlue,
                    },
                  ]}>
                  <AppText key="name" style={styles.badgeText}>
                    {i18n.t(elm)}
                  </AppText>
                </View>
              ))}
          </View>

          <AppText
            key="desc"
            style={[
              windowWidth > device.medium.window.width
                ? appStyles.normal14Text
                : appStyles.normal12Text,
              {marginTop: 5},
            ]}>
            {item.field_description}
          </AppText>
        </View>
        <View key="priceText" style={styles.appPrice}>
          <AppPrice
            key="price"
            price={item.price}
            balanceStyle={styles.priceStyle}
            currencyStyle={styles.wonStyle}
          />
        </View>
      </View>
      <View style={styles.itemOutDivider}>
        <View style={styles.itemDivider} />
      </View>
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
  const {localOpList, prodOfCountry} = product;

  const [prodData, setProdData] = useState<ProdDataType[]>([]);
  const [imageUrl, setImageUrl] = useState<string>();
  const [localOpDetails, setLocalOpDetails] = useState<string>();
  const [partnerId, setPartnerId] = useState<string>();

  const prodList = useMemo(
    () =>
      prodOfCountry.length > 0 ? prodOfCountry : route.params?.prodOfCountry,
    [prodOfCountry, route.params?.prodOfCountry],
  );

  useEffect(() => {
    const title =
      prodList && prodList.length > 0
        ? API.Product.getTitle(localOpList.get(prodList[0]?.partnerId))
        : '';

    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={title} />,
    });
  }, [localOpList, navigation, prodList]);

  useEffect(() => {
    if (!_.isEmpty(prodList)) {
      const localOp = localOpList.get(prodList[0]?.partnerId);
      setPartnerId(prodList[0]?.partnerId);

      const list = prodList.reduce(
        (group: RkbProduct[][], el) =>
          el.field_daily === 'daily'
            ? [(group[0] || []).concat(el), group[1] || []]
            : [group[0] || [], (group[1] || []).concat(el)],
        [],
      );

      setProdData([
        {title: 'daily', data: list[0] || []},
        {title: 'total', data: list[1] || []},
      ]);
      setImageUrl(localOp?.imageUrl);
      setLocalOpDetails(localOp?.detail);
    }
  }, [localOpList, prodList]);

  const renderItem = useCallback(
    ({item, index, section}) => {
      return (
        <CountryListItem
          item={item}
          onPress={() =>
            navigation.navigate('ProductDetail', {
              title: item.name,
              item,
              img: imageUrl,
              localOpDetails,
              partnerId,
            })
          }
          position={position(index, section.data)}
        />
      );
    },
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
            ) : null
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
