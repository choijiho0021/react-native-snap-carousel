import {useNavigation} from '@react-navigation/native';
import React, {memo, useCallback, useState} from 'react';
import {Animated, Image, Pressable, StyleSheet, View} from 'react-native';
import {Pagination} from 'react-native-snap-carousel';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {RkbPromotion} from '@/redux/api/promotionApi';
import {ProductModelState} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import {actions as infoActions, InfoAction} from '@/redux/modules/info';
import AppCarousel from '@/components/AppCarousel';

const DOT_MARGIN = 6;
const INACTIVE_DOT_WIDTH = 6;
const ACTIVE_DOT_WIDTH = 20;

const dotStyle = (
  width: Animated.Value | Animated.AnimatedInterpolation,
  marginLeft: number | Animated.AnimatedInterpolation,
  backgroundColor: string = colors.clearBlue,
) => ({
  height: 6,
  borderRadius: 3.5,
  width,
  marginLeft,
  backgroundColor,
});

const styles = StyleSheet.create({
  carousel: {
    // paddingTop: 12,
    // marginBottom: 12,
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.white,
  },
  pagination: {
    marginRight: 30,
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  paginationContainer: {
    paddingBottom: 0,
    paddingTop: 2,
    paddingHorizontal: 0,
  },
  inactiveDot: {
    width: INACTIVE_DOT_WIDTH,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.lightGrey,
    marginLeft: DOT_MARGIN,
  },
});

const PromotionImage0 = ({
  width,
  item,
  onPress,
}: {
  width: number;
  item: RkbPromotion;
  onPress: (i: RkbPromotion) => void;
}) => {
  return (
    <Pressable style={{paddingHorizontal: 20}} onPress={() => onPress(item)}>
      {item.imageUrl ? (
        <Image
          source={{uri: API.default.httpImageUrl(item.imageUrl)}}
          style={{width: width - 40, aspectRatio: 335 / 100}}
          resizeMode="contain"
        />
      ) : (
        <AppText style={appStyles.normal16Text}>{item.title}</AppText>
      )}
    </Pressable>
  );
};
const PromotionImage = memo(
  PromotionImage0,
  (prev, next) => prev.item.imageUrl === next.item.imageUrl,
);

type PromotionCarouselProps = {
  promotion: RkbPromotion[];
  product: ProductModelState;
  width: number;
  action: {
    info: InfoAction;
  };
};

const PromotionCarousel: React.FC<PromotionCarouselProps> = ({
  promotion,
  product,
  action,
  width,
}) => {
  const navigation = useNavigation();
  const [activeSlide, setActiveSlide] = useState(0);
  const onPress = useCallback(
    (item: RkbPromotion) => {
      if (item.product_uuid) {
        const {prodList} = product;
        const prod = prodList.get(item.product_uuid);

        if (prod) {
          const prodOfCountry = prodList
            .filter((p) => _.isEqual(p.partnerId, prod.partnerId))
            .toList()
            .toArray();
          navigation.navigate('Country', {prodOfCountry});
        }
      } else if (item.rule?.navigate) {
        navigation.navigate(item.rule.navigate);
      } else if (item.notice) {
        action.info.getInfoList('info');
        navigation.navigate('SimpleText', {
          key: 'noti',
          title: i18n.t('set:noti'),
          bodyTitle: item.notice.title,
          body: item.notice.body,
          nid: item.notice.nid,
          rule: item.rule,
          image: item.notice.image,
          mode: 'noti',
        });
      } else {
        navigation.navigate('Faq');
      }
    },
    [action.info, navigation, product],
  );

  const renderDots = useCallback(
    (activeIndex: number) => {
      const duration = 200;
      const width = new Animated.Value(INACTIVE_DOT_WIDTH);
      const margin = width.interpolate({
        inputRange: [INACTIVE_DOT_WIDTH, ACTIVE_DOT_WIDTH],
        outputRange: [ACTIVE_DOT_WIDTH, INACTIVE_DOT_WIDTH],
      });

      Animated.timing(width, {
        toValue: ACTIVE_DOT_WIDTH,
        duration,
        useNativeDriver: false,
      }).start();

      if (activeIndex === 0) {
        return promotion.map((_, idx) =>
          idx === 0 ? (
            <Animated.View
              key={idx.toString()}
              style={dotStyle(width, margin)}
            />
          ) : (
            <View key={idx.toString()} style={styles.inactiveDot} />
          ),
        );
      }

      return promotion.map((_, idx) => {
        if (activeIndex === idx)
          return (
            <Animated.View
              key={idx.toString()}
              style={dotStyle(width, DOT_MARGIN, colors.clearBlue)}
            />
          );

        return activeIndex === (idx + 1) % promotion.length ? (
          <Animated.View
            key={idx.toString()}
            style={dotStyle(margin, DOT_MARGIN, colors.lightGrey)}
          />
        ) : (
          <View key={idx.toString()} style={styles.inactiveDot} />
        );
      });
    },
    [promotion],
  );

  const renderItem = useCallback(
    ({item, index}: {item: RkbPromotion; index: number}) => (
      <PromotionImage item={item} onPress={onPress} width={width} />
    ),
    [onPress, width],
  );

  return (
    <View style={styles.carousel}>
      <AppCarousel
        data={promotion}
        renderItem={renderItem}
        autoplay
        loop
        onSnapToItem={setActiveSlide}
        sliderWidth={width}
      />
      <View style={styles.pagination}>
        <Pagination
          dotsLength={promotion.length}
          activeDotIndex={activeSlide}
          containerStyle={styles.paginationContainer}
          renderDots={renderDots}
        />
      </View>
    </View>
  );
};

export default connect(
  ({promotion, product}: RootState) => ({
    product,
    promotion: promotion.promotion,
  }),
  (dispatch) => ({
    action: {
      info: bindActionCreators(infoActions, dispatch),
    },
  }),
)(memo(PromotionCarousel));
