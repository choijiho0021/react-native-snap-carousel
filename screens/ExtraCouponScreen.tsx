import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {API} from '@/redux/api';
import {RkbExtraCoupon} from '@/redux/api/promotionApi';
import {windowWidth, windowHeight} from '@/constants/SliderEntry.style';
import AppModal from '@/components/AppModal';
import AppText from '@/components/AppText';
import {appStyles} from '../constants/Styles';
import AppSvgIcon from '@/components/AppSvgIcon';

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
  tabScroll: {
    marginTop: 16,
    marginBottom: 6,
  },
  image: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginRight: 8,
    borderRadius: 30,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalClose: {
    justifyContent: 'center',
    height: 56,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  contentStyle: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
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

const bannerHeight = 255;
const ExtraCouponListItem = memo(ExtraCouponListItem0);

const ExtraCouponScreen = () => {
  const [data, setData] = useState<RkbExtraCoupon[][]>();
  const [coupons, setCoupons] = useState<RkbExtraCoupon[]>([]);
  const [couponGrp, setCouponGrp] = useState<string[]>([]);
  const [selectedGrp, setSelectedGrp] = useState<string>('All');
  const [showItem, setShowItem] = useState<RkbExtraCoupon>();
  const [isTop, setIsTop] = useState(true);
  const [imgRatio, setImgRatio] = useState(windowWidth / windowHeight);
  const scrollY = useRef(new Animated.Value(bannerHeight)).current;

  useEffect(() => {
    if (coupons.length > 0)
      setData(
        coupons
          .filter(
            (elm) =>
              elm.group.split(',').includes(selectedGrp) ||
              selectedGrp === 'All',
          )
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
            ...new Set(
              rsp.objects.flatMap((elm) => elm.group?.split(',') || []),
            ),
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

  const renderGroup = useCallback(
    () => (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}>
        <View style={{width: 20}} />
        {couponGrp.map((grp) => {
          const isSelected = grp === selectedGrp;
          return (
            <Pressable
              style={[
                styles.image,
                {backgroundColor: isSelected ? colors.clearBlue : colors.white},
                {borderColor: isSelected ? colors.clearBlue : colors.gray},
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
        <View style={{width: 20}} />
      </ScrollView>
    ),
    [couponGrp, selectedGrp],
  );

  useEffect(() => {
    Animated.timing(scrollY, {
      toValue: isTop ? bannerHeight : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [scrollY, isTop]);

  useEffect(() => {
    if (showItem?.dimension) {
      const l = showItem?.dimension.split('x');
      if (l.length > 1) setImgRatio(Number(l[0]) / Number(l[1]));
    }
  }, [showItem?.dimension]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppBackButton
          title={i18n.t('extraCoupon')}
          style={{width: '70%', height: 56}}
        />
      </View>
      <Animated.View style={{height: scrollY, overflow: 'hidden'}}>
        <Image
          source={require('../assets/images/esim/couponBanner.png')}
          style={{width: '100%'}}
        />
      </Animated.View>
      <View>{renderGroup()}</View>

      <FlatList
        data={data}
        renderItem={renderItem}
        onScroll={({nativeEvent}) => {
          const {y} = nativeEvent.contentOffset;
          if (isTop && y > bannerHeight) setIsTop(false);
          else if (!isTop && y <= 0) setIsTop(true);
        }}
      />

      {showItem && (
        <AppModal
          type="close"
          contentStyle={styles.contentStyle}
          justifyContent="flex-end"
          safeAreaColor={colors.white}
          visible={showItem !== undefined}
          onOkClose={() => setShowItem(undefined)}
          titleViewStyle={{}}>
          <View style={{flex: 1}}>
            <View style={styles.modalClose}>
              <AppSvgIcon
                name="closeModal"
                onPress={() => setShowItem(undefined)}
              />
            </View>
            <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
              <Image
                style={{aspectRatio: imgRatio}}
                source={{uri: API.default.httpImageUrl(showItem.download)}}
                resizeMode="contain"
              />
            </ScrollView>
          </View>
        </AppModal>
      )}
    </SafeAreaView>
  );
};

export default ExtraCouponScreen;
