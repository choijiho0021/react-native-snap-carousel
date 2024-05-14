import React, {
  useCallback,
  useState,
  useMemo,
  useEffect,
  Fragment,
} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import CountryListItem from '@/components/CountryListItem';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {RkbProduct} from '@/redux/api/productApi';
import i18n from '@/utils/i18n';
import DailyProdFilter, {DailyProdFilterList} from './DailyProdFilter';
import NetworkFilter, {NetworkFilterList} from './NetworkFilter';

const styles = StyleSheet.create({
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
});

const position = (idx: number, arr: RkbProduct[]) => {
  if (arr.length > 1) {
    if (idx === 0) return 'head';
    if (idx === arr.length - 1) return 'tail';
    return 'middle';
  }
  return 'onlyOne';
};

type ProdByTypeProps = {
  prodData: RkbProduct[];
  prodType: 'daily' | 'total';
  isCharge?: boolean;
  onPress: (prod: RkbProduct) => void;
  onTop?: (v: boolean) => void;
};

const DEFAULT_FILTER_LIST = [
  'all',
  '500',
  '1024',
  '2048',
  '3072',
  '4096',
  '5120',
  '1024000',
];

const ProdByType: React.FC<ProdByTypeProps> = ({
  prodData,
  prodType,
  isCharge = false,
  onPress,
  onTop = () => {},
}) => {
  const [filter, setFilter] = useState<DailyProdFilterList>('all');
  const [networkFilter, setNetworkFileter] = useState<NetworkFilterList[]>([
    'fiveG',
    'else',
  ]);
  const [list, setList] = useState<DailyProdFilterList[]>([]);

  const toNetworkFileter = useCallback((promoFlag?: string[]) => {
    if (promoFlag?.includes('fiveG')) return 'fiveG';
    return 'else';
  }, []);

  const data = useMemo(
    () =>
      prodData.filter((p) => {
        const networkMatch = networkFilter.includes(
          toNetworkFileter(p.promoFlag),
        );
        const volumeMatch = filter === 'all' || p.volume === filter;
        return networkMatch && volumeMatch;
      }),
    [filter, networkFilter, prodData, toNetworkFileter],
  );

  const showNetFilter = useMemo(
    () =>
      prodData.length > 1 &&
      prodData.some((elm) => toNetworkFileter(elm.promoFlag) === 'fiveG') &&
      prodData.some((elm) => toNetworkFileter(elm.promoFlag) === 'else'),
    [prodData, toNetworkFileter],
  );

  const renderEmpty = useCallback(() => {
    return (
      <View style={styles.emptyData}>
        <AppSvgIcon name="threeDots" style={styles.emptyImage} />
        <AppText style={styles.emptyText1}>
          {i18n.t(isCharge ? 'esim:charge:noProd1' : 'country:noProd1')}
        </AppText>
        <AppText style={styles.emptyText2}>
          {i18n.t(isCharge ? 'esim:charge:noProd2' : 'country:noProd2')}
        </AppText>
      </View>
    );
  }, [isCharge]);

  const renderItem = useCallback(
    ({item, index}: {item: RkbProduct; index: number}) => (
      <CountryListItem
        key={item.sku}
        item={item}
        onPress={() => onPress(item)}
        position={position(index, data)}
      />
    ),
    [data, onPress],
  );

  useEffect(() => {
    setList(
      DEFAULT_FILTER_LIST.filter((r) =>
        prodData.find((prod) => prod.volume === r),
      ) as DailyProdFilterList[],
    );
  }, [prodData]);

  return (
    <FlatList
      data={data}
      ListEmptyComponent={renderEmpty}
      extraData={data}
      ListHeaderComponent={
        <Fragment>
          {prodType === 'daily' && prodData.length > 0 ? (
            <DailyProdFilter
              filterList={['all', ...list]}
              onValueChange={setFilter}
            />
          ) : null}
          {showNetFilter ? (
            <NetworkFilter
              filterList={['fiveG', 'else']}
              onValueChange={setNetworkFileter}
            />
          ) : null}
        </Fragment>
      }
      renderItem={renderItem}
      onScrollEndDrag={({
        nativeEvent: {
          contentOffset: {y},
        },
      }) => {
        if (y <= 0) onTop(true);
        else if (y > 150) onTop(false);
      }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default React.memo(ProdByType);
