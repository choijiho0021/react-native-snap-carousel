import {useNavigation} from '@react-navigation/native';
import React, {memo, useCallback, useState} from 'react';
import {
  Animated,
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {Pagination} from 'react-native-snap-carousel';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import VersionCheck from 'react-native-version-check';
import {StackNavigationProp} from '@react-navigation/stack';
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
import utils from '@/redux/api/utils';
import {HomeStackParamList} from '@/navigation/navigation';
import moment from 'moment';

export const DOT_MARGIN = 6;
export const INACTIVE_DOT_WIDTH = 6;

export const dotStyle = (
  width: number,
  marginLeft: number,
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

type PromotionCarouselNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'PromotionCarousel'
>;

type PromotionCarouselProps = {
  promotion: RkbPromotion[];
  product: ProductModelState;
  width: number;
  checkNeedUpdate?: () => void;
  action: {
    info: InfoAction;
  };
};

const PromotionCarousel: React.FC<PromotionCarouselProps> = ({
  promotion,
  product: {prodList},
  action,
  width,
  checkNeedUpdate,
}) => {
  const navigation = useNavigation<PromotionCarouselNavigationProp>();
  const [activeSlide, setActiveSlide] = useState(promotion.length - 1);

  const onPress = useCallback(
    (item: RkbPromotion) => {
      if (
        checkNeedUpdate &&
        item?.rule?.cond?.version &&
        utils.compareVersion(
          item?.rule?.cond?.version[Platform.OS],
          VersionCheck.getCurrentVersion(),
        )
      ) {
        checkNeedUpdate();
      } else if (item.product_uuid) {
        const prod = prodList.get(item.product_uuid);

        if (prod) {
          const prodOfCountry = prodList
            .filter((p) => _.isEqual(p.partnerId, prod.partnerId))
            .toList()
            .toArray();
          navigation.navigate('Country', {prodOfCountry});
        }
      } else if (item?.rule?.navigate) {
        if (item?.rule?.navigate?.startsWith('http')) {
          Linking.openURL(item?.rule?.navigate);
        } else if (item?.rule?.stack) {
          navigation.navigate(item?.rule?.stack, {
            screen: item.rule.navigate,
            initial: false,
          });
        } else {
          navigation.navigate(item.rule.navigate);
        }
      } else if (item.notice) {
        action.info.getInfoList('info');
        navigation.navigate('SimpleText', {
          key: 'noti',
          title: i18n.t('set:notiDetail'),
          bodyTitle: item.notice.title,
          body: item.notice.body,
          created: moment(item.notice.created),
          nid: item.notice.nid,
          rule: item.rule,
          image: item.notice.image,
          showTitle: true,
          mode: 'noti',
        });
      } else {
        navigation.navigate('Faq');
      }
    },
    [action.info, checkNeedUpdate, navigation, prodList],
  );

  const renderDots = useCallback(
    (activeIndex: number) => {
      const aniMationWidth = INACTIVE_DOT_WIDTH;
      const margin = INACTIVE_DOT_WIDTH;

      if (activeIndex === 0) {
        return promotion.map((elm, idx) =>
          idx === 0 ? (
            <Animated.View
              key={elm.uuid + idx.toString()}
              style={dotStyle(aniMationWidth, margin)}
            />
          ) : (
            <View
              key={utils.generateKey(idx.toString())}
              style={styles.inactiveDot}
            />
          ),
        );
      }

      return promotion.map((_elm, idx) => {
        if (activeIndex === idx)
          return (
            <Animated.View
              key={utils.generateKey(idx.toString())}
              style={dotStyle(aniMationWidth, DOT_MARGIN, colors.clearBlue)}
            />
          );

        return activeIndex === (idx + 1) % promotion.length ? (
          <Animated.View
            key={utils.generateKey(idx.toString())}
            style={dotStyle(margin, DOT_MARGIN, colors.lightGrey)}
          />
        ) : (
          <View
            key={utils.generateKey(idx.toString())}
            style={styles.inactiveDot}
          />
        );
      });
    },
    [promotion],
  );

  const renderItem = useCallback(
    ({item}: {item: RkbPromotion}) => (
      <PromotionImage item={item} onPress={onPress} width={width} />
    ),
    [onPress, width],
  );

  return (
    <View style={styles.carousel}>
      <AppCarousel
        data={promotion}
        renderItem={renderItem}
        autoplay={promotion?.length > 1}
        loop={promotion?.length > 1}
        onSnapToItem={setActiveSlide}
        sliderWidth={width}
      />
      {promotion?.length > 1 && (
        <View style={styles.pagination}>
          <Pagination
            dotsLength={promotion.length}
            activeDotIndex={activeSlide}
            containerStyle={styles.paginationContainer}
            renderDots={renderDots}
          />
        </View>
      )}
    </View>
  );
};

export default connect(
  ({product}: RootState) => ({
    product,
  }),
  (dispatch) => ({
    action: {
      info: bindActionCreators(infoActions, dispatch),
    },
  }),
)(memo(PromotionCarousel));
