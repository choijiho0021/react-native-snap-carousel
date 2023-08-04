import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import CountryListItem from '@/components/CountryListItem';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {RkbProduct} from '@/redux/api/productApi';
import i18n from '@/utils/i18n';
import DailyProdFilter, {DailyProdFilterList} from './DailyProdFilter';

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

const ProdByType: React.FC<ProdByTypeProps> = ({
  prodData,
  prodType,
  isCharge = false,
  onPress,
  onTop = () => {},
}) => {
  const [filter, setFilter] = useState<DailyProdFilterList>('all');

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
        position={position(index, prodData)}
      />
    ),
    [onPress, prodData],
  );

  return (
    <FlatList
      data={
        filter === 'all'
          ? prodData
          : prodData.filter((p) => p.volume === filter)
      }
      ListEmptyComponent={renderEmpty}
      extraData={prodData}
      ListHeaderComponent={
        prodType === 'daily' ? (
          <DailyProdFilter onValueChange={setFilter} />
        ) : null
      }
      renderItem={renderItem}
      onScrollEndDrag={({
        nativeEvent: {
          contentOffset: {y},
        },
      }) => {
        if (y < -25) onTop(true);
        else if (y > 25) onTop(false);
      }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default React.memo(ProdByType);
