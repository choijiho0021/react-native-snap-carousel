import React, {useCallback} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import CountryListItem from '@/components/CountryListItem';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {RkbProduct} from '@/redux/api/productApi';
import i18n from '@/utils/i18n';

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
  isCharge?: boolean;
  onPress: (prod: RkbProduct) => void;
  onTop?: (v: boolean) => void;
};

const ProdByType: React.FC<ProdByTypeProps> = ({
  prodData,
  isCharge = false,
  onPress,
  onTop = () => {},
}) => {
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
    ({item, index}: {item: RkbProduct; index: number}) => {
      return (
        <CountryListItem
          key={item.sku}
          item={item}
          onPress={() => onPress(item)}
          position={position(index, prodData)}
          isCharge
        />
      );
    },
    [onPress, prodData],
  );

  return (
    <FlatList
      data={prodData}
      ListEmptyComponent={renderEmpty}
      extraData={prodData}
      renderItem={renderItem}
      onScrollBeginDrag={() => onTop(false)}
      onScroll={({
        nativeEvent: {
          contentOffset: {y},
        },
      }) => {
        if (y <= -5) onTop(true);
      }}
    />
  );
};

export default React.memo(ProdByType);
