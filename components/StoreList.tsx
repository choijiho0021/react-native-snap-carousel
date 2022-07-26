import {Map as ImmutableMap} from 'immutable';
import React, {memo, useCallback} from 'react';
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
import {isDeviceSize, windowWidth} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {API} from '@/redux/api';
import {Currency, RkbLocalOp} from '@/redux/api/productApi';
import i18n from '@/utils/i18n';
import AppPrice from './AppPrice';
import AppText from './AppText';
import {RkbPriceInfo} from '@/redux/modules/product';

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
}: {
  item: RkbPriceInfo[];
  localOpList: ImmutableMap<string, RkbLocalOp>;
  onPress?: (p: RkbPriceInfo) => void;
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
    <View key={item[0].country} style={styles.productList}>
      {item.map((elm, idx) => {
        // 1개인 경우 사이 간격을 맞추기 위해서 width를 image만큼 넣음
        const localOp = localOpList && localOpList.get(elm.partner);

        return (
          <View
            key={elm.country}
            style={{flex: 1, marginLeft: idx === 1 ? 14 : 0}}>
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
      {item.length === 1 && (
        <View key="unknown" style={{flex: 1, marginLeft: 14}} />
      )}
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
            key={item[0].country}
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
