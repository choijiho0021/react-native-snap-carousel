import {Map as ImmutableMap} from 'immutable';
import React, {memo, useCallback, useMemo} from 'react';
import {
  Animated,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {API} from '@/redux/api';
import {Currency, RkbLocalOp} from '@/redux/api/productApi';
import i18n from '@/utils/i18n';
import AppPrice from './AppPrice';
import AppText from './AppText';
import {RkbPriceInfo} from '@/redux/modules/product';
import {isFolderOpen} from '../constants/SliderEntry.style';

const styles = StyleSheet.create({
  text: {
    ...appStyles.normal16Text,
    fontSize: isDeviceSize('small') ? 16 : 18,
    textAlign: 'left',
    color: colors.clearBlue,
    fontWeight: '600',
  },

  image: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  productList: {
    // width: windowWidth - 40,
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
    fontSize: isDeviceSize('medium') ? 14 : 16,
    marginTop: 10,
    marginBottom: 2,
    fontWeight: '600',
  },
});

const CountryItem0 = ({
  item,
  localOpList,
  onPress,
  columns,
  width,
}: {
  item: RkbPriceInfo[];
  localOpList: ImmutableMap<string, RkbLocalOp>;
  onPress?: (p: RkbPriceInfo) => void;
  columns: number;
  width: number;
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
    (bestPrice: Currency) => (
      <View key="price" style={styles.price}>
        {bestPrice !== undefined
          ? [
              <AppPrice
                key="price"
                style={styles.price}
                price={bestPrice}
                balanceStyle={styles.priceNumber}
                currencyStyle={styles.text}
              />,
              <AppText
                key="days"
                style={[styles.text, {marginLeft: 3, top: -2}]}>
                {i18n.t('startFrom')}
              </AppText>,
            ]
          : null}
      </View>
    ),
    [],
  );

  return (
    <View
      key={item[0]?.country}
      style={[styles.productList, {width: width - 40}]}>
      {item.map((elm, idx) => {
        // 1개인 경우 사이 간격을 맞추기 위해서 width를 image만큼 넣음
        const localOp = localOpList && localOpList.get(elm.partner);

        return (
          <View
            key={elm.country}
            style={{flex: 1, marginLeft: idx >= 1 ? 14 : 0}}>
            <Pressable onPress={() => onPress?.(elm)}>
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
                  ? [renderPrice(elm.minPrice), renderLowest()]
                  : [renderLowest(), renderPrice(elm.minPrice)]}
              </View>
            </Pressable>
          </View>
        );
      })}
      {item.length < columns
        ? Array(columns - item.length)
            .fill(1)
            .map((x, i) => (
              <View key={`blank${i}`} style={{flex: 1, marginLeft: 14}} />
            ))
        : null}
    </View>
  );
};
const CountryItem = memo(CountryItem0);

export type StoreListRef = {
  scrollToTop: () => void;
};

type StoreListProps = {
  localOpList: ImmutableMap<string, RkbLocalOp>;
  data: RkbPriceInfo[][];
  onPress: (p: RkbPriceInfo) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  width: number;
};

const StoreList = ({
  localOpList,
  data,
  onPress,
  onScroll,
  width,
}: StoreListProps) => {
  const isFolder = useMemo(() => isFolderOpen(width), [width]);
  const renderItem = useCallback(
    ({item}) => (
      <CountryItem
        key={item[0]?.country}
        onPress={onPress}
        item={item}
        localOpList={localOpList}
        width={width}
        columns={isFolder ? 3 : 2}
      />
    ),
    [isFolder, localOpList, onPress, width],
  );

  const list = useMemo(
    () =>
      isFolder
        ? data.reduce(
            (acc, cur) => {
              const last = acc[acc.length - 1];
              if (last.length + cur.length <= 3) {
                acc[acc.length - 1] = last.concat(cur);
                return acc;
              }
              acc[acc.length - 1] = last.concat(cur.slice(0, 3 - last.length));
              return cur.length > 3 - last.length
                ? acc.concat([cur.slice(3 - last.length)])
                : acc;
            },
            [[]] as RkbPriceInfo[][],
          )
        : data,
    [data, isFolder],
  );

  return (
    <View style={appStyles.container}>
      <Animated.FlatList
        data={list}
        onScroll={onScroll}
        bounces={false}
        renderItem={renderItem}
      />
    </View>
  );
};

export default memo(StoreList);
