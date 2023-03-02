import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import CountryListItem from '../HomeScreen/component/CountryListItem';
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
  onPress: (prod: RkbProduct) => void;
  onTop: (v: boolean) => void;
};

const ProdByType: React.FC<ProdByTypeProps> = ({prodData, onPress, onTop}) => {
  return (
    <ScrollView
      style={{backgroundColor: colors.white}}
      onScrollBeginDrag={() => onTop(false)}
      scrollEventThrottle={100}
      onScroll={({
        nativeEvent: {
          contentOffset: {y},
        },
      }) => {
        if (y <= -5) onTop(true);
      }}>
      {prodData.length > 0 ? (
        prodData.map((data, idx) => (
          <CountryListItem
            key={data.sku}
            item={data}
            onPress={() => onPress(data)}
            position={position(idx, prodData)}
          />
        ))
      ) : (
        <View style={styles.emptyData}>
          <AppSvgIcon name="threeDots" style={styles.emptyImage} />

          <AppText style={styles.emptyText1}>
            {i18n.t('country:noProd1')}
          </AppText>
          <AppText style={styles.emptyText2}>
            {i18n.t('country:noProd2')}
          </AppText>
        </View>
      )}
    </ScrollView>
  );
};

export default React.memo(ProdByType);
