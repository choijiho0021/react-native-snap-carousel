import {Map as ImmutableMap} from 'immutable';
import React, {memo, useCallback, useMemo, useState} from 'react';
import {
  Animated,
  Image,
  Keyboard,
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
import utils from '@/redux/api/utils';
import ProductImg from '@/components/ProductImg';

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
  },
  productList: {
    // width: windowWidth - 40,
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 12,
    marginHorizontal: 20,
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
  index,
  showImage = false,
}: {
  item: RkbPriceInfo[];
  localOpList: ImmutableMap<string, RkbLocalOp>;
  onPress?: (p: RkbPriceInfo) => void;
  columns: number;
  width: number;
  index: number;
  showImage?: boolean;
}) => {
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
        const localOp = localOpList?.get(elm.partner);

        return (
          <View
            key={elm.country}
            style={{flex: 1, marginLeft: idx >= 1 ? 14 : 0}}>
            <Pressable onPress={() => onPress?.(elm)}>
              <View style={styles.image}>
                {(index <= 4 || showImage) && (
                  <ProductImg
                    key="img"
                    source={{uri: API.default.httpImageUrl(localOp?.imageUrl)}}
                    style={{flex: 1}}
                    imageStyle={{flex: 1}}
                    maxDiscount={Math.floor(Number(elm.maxDiscount) * 100)}
                  />
                )}
              </View>

              <AppText key="cntry" style={styles.cntry}>
                {API.Product.getTitle(localOp)}
              </AppText>
              {renderPrice(elm.minPrice)}
            </Pressable>
          </View>
        );
      })}
      {item.length < columns
        ? Array(columns - item.length)
            .fill(1)
            .map((elm, idx) => (
              <View
                key={utils.generateKey(idx)}
                style={{flex: 1, marginLeft: 14}}
              />
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
  onEndReached?: () => void;
  scrollEnabled?: boolean;
  width: number;
};

const StoreList = ({
  localOpList,
  data,
  onPress,
  onScroll,
  onEndReached,
  scrollEnabled = true,
  width,
}: StoreListProps) => {
  const [showImage, setShowImage] = useState(false);
  const isFolder = useMemo(() => isFolderOpen(width), [width]);
  const renderItem = useCallback(
    ({item, index}: {item: RkbPriceInfo[]; index: number; separators: any}) => (
      <CountryItem
        key={item[0]?.country}
        onPress={onPress}
        item={item}
        localOpList={localOpList}
        width={width}
        columns={isFolder ? 3 : 2}
        index={index}
        showImage={showImage}
      />
    ),
    [isFolder, localOpList, onPress, showImage, width],
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
        onEndReached={onEndReached}
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => {
          setShowImage(true);
          Keyboard.dismiss();
        }}
      />
    </View>
  );
};

export default memo(StoreList);
