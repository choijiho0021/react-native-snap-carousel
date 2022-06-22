import {Map as ImmutableMap} from 'immutable';
import React, {memo, useCallback} from 'react';
import {
  Animated,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '@/constants/Colors';
import {isDeviceSize, windowWidth} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {API} from '@/redux/api';
import {
  Currency,
  ProductByCategory,
  RkbLocalOp,
  RkbProduct,
} from '@/redux/api/productApi';
import i18n from '@/utils/i18n';
import AppPrice from './AppPrice';
import AppText from './AppText';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  text: {
    ...(isDeviceSize('small')
      ? appStyles.normal16Text
      : appStyles.normal18Text),
    textAlign: 'left',
    color: colors.clearBlue,
  },

  image: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  productList: {
    width: windowWidth - 40,
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  lowPrice: {
    ...appStyles.normal12Text,
    fontSize: isDeviceSize('small') ? 10 : 12,
    color: colors.black,
  },
  lowPriceView: {
    width: isDeviceSize('small') ? 30 : 41,
    height: 22,
    borderRadius: 1,
    backgroundColor: colors.whiteTwo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  price: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceNumber: {
    // fontFamily: "Roboto-Regular",
    fontSize: isDeviceSize('small') ? 18 : 20,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0.19,
    color: colors.clearBlue,
    textAlign: 'left',
  },
  cntry: {
    ...appStyles.bold14Text,
    fontSize: isDeviceSize('small') ? 12 : 14,
    marginTop: 11,
    marginBottom: isDeviceSize('small') ? 4 : 9,
  },
});

const CountryItem0 = ({
  item,
  localOpList,
  onPress,
}: {
  item: ProductByCategory;
  localOpList: ImmutableMap<string, RkbLocalOp>;
  onPress?: (p: RkbProduct[]) => void;
}) => {
  const renderLowest = useCallback(
    () => (
      <View key="lowest" style={styles.lowPriceView}>
        <AppText style={styles.lowPrice}>{i18n.t('lowest')}</AppText>
      </View>
    ),
    [],
  );

  const renderPrice = useCallback(
    (bestPrice?: Currency) => (
      <View key="price" style={styles.price}>
        {bestPrice && [
          <AppPrice
            key="price"
            style={styles.price}
            price={bestPrice}
            balanceStyle={styles.priceNumber}
            currencyStyle={styles.text}
          />,
          <AppText key="days" style={[styles.text, {marginLeft: 3, top: -2}]}>
            {i18n.t('startFrom')}
          </AppText>,
        ]}
      </View>
    ),
    [],
  );

  return (
    <View key={item.key} style={styles.productList}>
      {item.data.map((elm, idx) => {
        // 1개인 경우 사이 간격을 맞추기 위해서 width를 image만큼 넣음
        if (elm && elm.length > 0) {
          const localOp = localOpList && localOpList.get(elm[0].partnerId);
          const bestPrice: Currency = elm.reduce((acc, {price}) => {
            if (!acc) return price;
            if (!price || acc.currency !== price.currency) return acc;
            return {
              value: Math.min(acc.value, price.value),
              currency: price.currency,
            };
          }, elm[0].price);

          return (
            <View
              key={elm[0].key}
              style={{flex: 1, marginLeft: idx === 1 ? 14 : 0}}>
              <TouchableOpacity onPress={() => onPress && onPress(elm)}>
                <Image
                  key="img"
                  source={{uri: API.default.httpImageUrl(localOp?.imageUrl)}}
                  style={styles.image}
                />
                <AppText key="cntry" style={styles.cntry}>
                  {API.Product.getTitle(localOp)}
                </AppText>
                <View style={styles.priceRow}>
                  {i18n.locale === 'ko'
                    ? [renderPrice(bestPrice), renderLowest()]
                    : [renderLowest(), renderPrice(bestPrice)]}
                </View>
              </TouchableOpacity>
            </View>
          );
        }

        return <View key="unknown" style={{flex: 1}} />;
      })}
    </View>
  );
};
const CountryItem = memo(CountryItem0);

export type StoreListRef = {
  scrollToTop: () => void;
};

type StoreListProps = {
  localOpList: ImmutableMap<string, RkbLocalOp>;
  data: ProductByCategory[];
  onPress: (p: RkbProduct[]) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

const StoreList = ({localOpList, data, onPress, onScroll}: StoreListProps) => {
  return (
    <View style={appStyles.container}>
      <Animated.FlatList
        data={data}
        onScroll={onScroll}
        bounces={false}
        renderItem={({item}) => (
          <CountryItem
            key={item.key}
            onPress={onPress}
            item={item}
            localOpList={localOpList}
          />
        )}
      />
    </View>
  );
};

export default memo(StoreList);
