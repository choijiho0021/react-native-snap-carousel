import React, {memo, useCallback, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {connect} from 'react-redux';
import {Map as ImmutableMap} from 'immutable';
import {API} from '@/redux/api';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import {isDeviceSize, windowWidth} from '@/constants/SliderEntry.style';
import {RootState} from '@/redux';
import {
  Currency,
  ProductByCategory,
  RkbLocalOp,
  RkbProduct,
} from '@/redux/api/productApi';
import {FlatList} from 'react-native-gesture-handler';
import Env from '@/environment';
import AppPrice from './AppPrice';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  text: {
    ...(isDeviceSize('small')
      ? appStyles.normal14Text
      : appStyles.normal16Text),
    textAlign: 'left',
    color: colors.clearBlue,
  },
  image: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productList: {
    width: windowWidth - 40,
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
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
        <Text style={styles.lowPrice}>{i18n.t('lowest')}</Text>
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
          <Text key="days" style={styles.text}>
            /Day
          </Text>,
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
          const bestPrice = elm.reduce((acc, {pricePerDay}) => {
            if (!acc) return pricePerDay;
            if (!pricePerDay || acc.currency !== pricePerDay.currency)
              return acc;
            return {
              value: Math.min(acc.value, pricePerDay.value),
              currency: pricePerDay.currency,
            };
          }, elm[0].pricePerDay);

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
                <Text key="cntry" style={styles.cntry}>
                  {API.Product.getTitle(localOp)}
                </Text>
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
  scrollToIndex: ({index}: {index: number}) => void;
};
type StoreListProps = {
  localOpList: ImmutableMap<string, RkbLocalOp>;
  data: ProductByCategory[];
  onPress: (p: RkbProduct[]) => void;
  storeListRef?: React.MutableRefObject<StoreListRef | null>;
};

const StoreList: React.FC<StoreListProps> = ({
  localOpList,
  data,
  onPress,
  storeListRef,
}) => {
  const ref = useRef<FlatList<any>>(null);
  useEffect(() => {
    if (storeListRef) {
      storeListRef.current = {
        scrollToIndex: ({index}) => {
          ref.current?.scrollToIndex({index, animated: false});
        },
      };
    }
  }, [storeListRef]);

  return (
    <View style={appStyles.container}>
      <FlatList
        data={data}
        ref={ref}
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

export default connect(({product}: RootState) => ({
  localOpList: product.localOpList,
}))(memo(StoreList));
