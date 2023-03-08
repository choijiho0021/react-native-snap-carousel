import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import React, {memo, useCallback, useState, useEffect, useMemo} from 'react';
import {
  Image,
  Pressable,
  View,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';
import {Pagination} from 'react-native-snap-carousel';
import AppButton from '@/components/AppButton';
import AppModal from '@/components/AppModal';
import AppText from '@/components/AppText';
import {RkbPromotion} from '@/redux/api/promotionApi';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import {API} from '@/redux/api';
import ProgressiveImage from '../../../components/ProgressiveImage';
import AppCarousel from '@/components/AppCarousel';
import {
  ACTIVE_DOT_WIDTH,
  dotStyle,
  DOT_MARGIN,
  INACTIVE_DOT_WIDTH,
} from './PromotionCarousel';
import utils from '@/redux/api/utils';

const styles = StyleSheet.create({
  pagination: {
    marginBottom: 15,
    alignSelf: 'center',
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

type NotiModalProps = {
  onOkClose?: (v: string, item: RkbPromotion) => void;
  onCancelClose?: () => void;
  visible: boolean;
  // closeType?: 'redirect' | 'close' | 'exit';
  // popUp?: RkbPromotion;
  popUpList: RkbPromotion[];
};
const NotiModal: React.FC<NotiModalProps> = ({
  popUpList,
  // popUp,
  // closeType,
  visible,
  onOkClose,
  onCancelClose,
}) => {
  const dimensions = useMemo(() => Dimensions.get('window'), []);
  const [checked, setChecked] = useState(false);
  const [closeType, setCloseType] = useState<'close' | 'exit' | 'redirect'>(
    'redirect',
  );
  const [iamgeHight, setImageHeight] = useState(450);
  const [activeSlide, setActiveSlide] = useState(0);
  const [cur, setCur] = useState<RkbPromotion>(popUpList[0]);

  const setPopupDisabled = useCallback(() => {
    if (checked)
      AsyncStorage.setItem(
        'popupDisabled',
        moment().format('YYYY-MM-DD HH:mm'),
      );
  }, [checked]);

  const renderDots = useCallback(
    (activeIndex: number) => {
      const duration = 200;
      const aniMationWidth = new Animated.Value(INACTIVE_DOT_WIDTH);
      const margin = aniMationWidth.interpolate({
        inputRange: [INACTIVE_DOT_WIDTH, ACTIVE_DOT_WIDTH],
        outputRange: [ACTIVE_DOT_WIDTH, INACTIVE_DOT_WIDTH],
      });

      Animated.timing(aniMationWidth, {
        toValue: ACTIVE_DOT_WIDTH,
        duration,
        useNativeDriver: false,
      }).start();

      if (activeIndex === 0) {
        return popUpList.map((elm, idx) =>
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

      return popUpList.map((_elm, idx) => {
        if (activeIndex === idx)
          return (
            <Animated.View
              key={utils.generateKey(idx.toString())}
              style={dotStyle(aniMationWidth, DOT_MARGIN, colors.clearBlue)}
            />
          );

        return activeIndex === (idx + 1) % popUpList.length ? (
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
    [popUpList],
  );

  const renderItem = useCallback(
    ({item}: {item: RkbPromotion}) => {
      setCur(item);
      Image.getSize(
        API.default.httpImageUrl(item?.notice?.image?.noti),
        (width, height) => {
          setImageHeight(Math.ceil(height * ((dimensions.width - 40) / width)));
        },
      );
      setCloseType(item.rule ? 'redirect' : 'close');

      const uri = API.default.httpImageUrl(item?.notice?.image?.noti);
      const thumbnail = API.default.httpImageUrl(
        item?.notice?.image?.thumbnail,
      );
      return (
        <View style={{backgroundColor: 'transparent'}}>
          <Pressable
            style={{width: '100%', height: iamgeHight, marginBottom: 18}}
            onPress={() => {
              if (closeType === 'redirect') {
                onOkClose?.(closeType, item);
              }
            }}>
            <ProgressiveImage
              style={{width: '100%', height: iamgeHight}}
              thumbnailSource={{uri: thumbnail}}
              source={{uri}}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      );
    },
    [closeType, dimensions.width, iamgeHight, onOkClose],
  );

  useEffect(() => {
    console.log('@@@@ activeSlide', activeSlide);
    console.log('@@@@ popUpList.length', popUpList.length);
  }, [activeSlide, popUpList]);

  return (
    <AppModal
      // titleStyle={styles.infoModalTitle}
      // title={popUp?.title}
      contentStyle={{
        paddingTop: 0,
        marginTop: 0,
        marginHorizontal: 20,
        backgroundColor: colors.white,
        width: '100%',
      }}
      titleViewStyle={{marginTop: 20}}
      okButtonTitle={i18n.t(closeType || 'close')}
      type={closeType === 'redirect' ? closeType : 'close'}
      onOkClose={() => {
        onOkClose?.(closeType, cur);
        setPopupDisabled();
      }}
      onCancelClose={() => {
        onCancelClose?.();
        setPopupDisabled();
      }}
      visible={visible}>
      <AppCarousel
        data={popUpList}
        renderItem={renderItem}
        autoplay
        loop
        onSnapToItem={setActiveSlide}
        sliderWidth={dimensions.width - 40}
      />
      <View style={styles.pagination}>
        <Pagination
          dotsLength={popUpList.length}
          activeDotIndex={activeSlide}
          containerStyle={styles.paginationContainer}
          renderDots={renderDots}
        />
      </View>

      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 20,
          backgroundColor: 'white',
          height: 24,
        }}
        onPress={() => setChecked((prev) => !prev)}>
        <AppButton
          iconName="btnCheck"
          style={{marginRight: 10}}
          checked={checked}
          onPress={() => setChecked((prev) => !prev)}
        />
        <AppText>{i18n.t('close:week')}</AppText>
      </Pressable>
    </AppModal>
  );
};

export default memo(NotiModal);
