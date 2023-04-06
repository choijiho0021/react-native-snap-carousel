import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {API} from '@/redux/api';
import {RkbExtraCoupon} from '@/redux/api/promotionApi';
import {windowWidth} from '@/constants/SliderEntry.style';
import AppModal from '@/components/AppModal';
import AppText from '@/components/AppText';
import {appStyles} from '../constants/Styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    alignItems: 'center',
    height: 56,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
  imageStyle: {
    height: (windowWidth - 60) / 3,
  },
  downloadStyle: {
    height: windowWidth * 1.83,
  },
  tabScroll: {
    marginTop: 16,
    marginBottom: 24,
    paddingLeft: 20,
  },
  image: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginRight: 8,
    borderRadius: 30,
    borderColor: colors.gray,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ExtraCouponListItem0 = ({
  item,
  onPress,
}: {
  item: RkbExtraCoupon[];
  onPress?: (i: RkbExtraCoupon) => void;
}) => {
  return (
    <View style={styles.row}>
      {item.map((i) => (
        <Pressable
          key={i.uuid}
          style={styles.button}
          onPress={() => onPress?.(i)}>
          <Image
            style={styles.imageStyle}
            resizeMode="contain"
            source={{uri: API.default.httpImageUrl(i.image)}}
          />
        </Pressable>
      ))}
      {item.length % 2 === 1 ? <View style={styles.button} /> : null}
    </View>
  );
};

const ExtraCouponListItem = memo(ExtraCouponListItem0);

const ExtraCouponScreen = () => {
  const [data, setData] = useState<RkbExtraCoupon[][]>();
  const [coupons, setCoupons] = useState<RkbExtraCoupon[]>([]);
  const [couponGrp, setCouponGrp] = useState<string[]>([]);
  const [selectedGrp, setSelectedGrp] = useState<string>('All');
  const [showItem, setShowItem] = useState<RkbExtraCoupon>();

  useEffect(() => {
    if (coupons.length > 0)
      setData(
        coupons
          .filter((elm) => elm.group === selectedGrp || selectedGrp === 'All')
          .reduce((acc, cur, idx) => {
            if (idx % 2 === 0) return acc.concat([[cur]]);
            acc[acc.length - 1].push(cur);
            return acc;
          }, [] as RkbExtraCoupon[][]),
      );
  }, [coupons, selectedGrp]);

  useEffect(() => {
    if (data === undefined) {
      API.Promotion.getExtraCoupon().then((rsp) => {
        if (rsp.result === 0) {
          setCoupons(rsp.objects as RkbExtraCoupon[]);
          setCouponGrp([
            'All',
            ...new Set(rsp.objects.map((elm) => elm.group || 'All')),
          ]);
        } else setData([]);
      });
    }
  }, [couponGrp, data]);

  const renderItem = useCallback(
    ({item}: {item: RkbExtraCoupon[]}) => (
      <ExtraCouponListItem item={item} onPress={setShowItem} />
    ),
    [],
  );

  const renderBannerImg = useCallback(
    () => (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}>
        {couponGrp.map((grp) => {
          const isSelected = grp === selectedGrp;
          return (
            <Pressable
              style={[
                styles.image,
                {backgroundColor: isSelected ? colors.clearBlue : colors.white},
              ]}
              onPress={() => setSelectedGrp(grp)}>
              <AppText
                style={[
                  appStyles.medium14,
                  {color: isSelected ? colors.white : colors.warmGrey},
                ]}>
                {grp}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    ),
    [couponGrp, selectedGrp],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppBackButton
          title={i18n.t('extraCoupon')}
          style={{width: '70%', height: 56}}
        />
      </View>
      <Image
        source={require('../assets/images/esim/couponBanner.png')}
        style={{width: '100%'}}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        ListHeaderComponent={renderBannerImg()}
      />

      {showItem && (
        <AppModal
          type="close"
          titleViewStyle={{backgroundColor: 'red'}}
          contentStyle={{
            backgroundColor: 'transparent',
            width: '100%',
            height: '100%',
          }}
          justifyContent="flex-end"
          visible={showItem !== undefined}
          onOkClose={() => setShowItem(undefined)}>
          <Image
            style={styles.downloadStyle}
            // resizeMode="contain"
            source={{uri: API.default.httpImageUrl(showItem.download)}}
          />
        </AppModal>
      )}
    </SafeAreaView>
  );
};

export default ExtraCouponScreen;
