import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from 'react-native';
import {useInterval} from '@/utils/useInterval';

export type AppCarouselRef = {
  snapToNext: () => void;
};

type AppCarouselProps<T> = {
  renderItem: ({item, index}: {item: T; index: number}) => React.ReactNode;
  data: T[];
  sliderWidth: number;
  onSnapToItem: (v: number) => void;
  keyExtractor?: (item: T) => string;
  autoplay?: boolean;
  loop?: boolean;
  interval?: number;
  carouselRef?: MutableRefObject<AppCarouselRef | null>;
};
const AppCarousel: React.FC<AppCarouselProps<T>> = ({
  data,
  renderItem,
  sliderWidth: sw,
  onSnapToItem,
  autoplay = false,
  loop = false,
  interval = 2500,
  carouselRef,
}) => {
  const sliderWidth = useMemo(() => Math.floor(sw), [sw]);
  const slides = useMemo(
    () => (loop ? data.slice(-1).concat(data, data.slice(0, 1)) : data),
    [data, loop],
  );
  const idx = useRef(loop ? 1 : 0);
  const ref = useRef<FlatList>(null);
  const onMomentum = useRef(false);
  const [playInterval, setPlayInterval] = useState<number | null>(
    autoplay && loop ? interval : null,
  );

  useEffect(() => {
    // initial position
    ref.current?.scrollToOffset({offset: sliderWidth, animated: false});
  }, [sliderWidth]);

  const onMomentumScrollStart = useCallback(() => {
    onMomentum.current = true;
    setPlayInterval(null);
  }, []);

  useEffect(() => {
    if (carouselRef) {
      carouselRef.current = {
        snapToNext: () => {
          idx.current += 1;
          if (loop) idx.current %= data.length;
          ref.current?.scrollToIndex({
            index: idx.current,
            animated: true,
          });
          if (Platform.OS === 'android') onSnapToItem?.(idx.current);
        },
      };
    }
  }, [carouselRef, data.length, loop, onSnapToItem]);

  useInterval(() => {
    if (!onMomentum.current) {
      idx.current += 1;
      if (Platform.OS === 'android') {
        if (idx.current >= slides.length - 1) idx.current = 1;
        onSnapToItem?.(idx.current - 1);
      }
      ref.current?.scrollToIndex({index: idx.current, animated: true});
    }
  }, playInterval);

  const onMomentumScrollEnd = useCallback(
    ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
      const {contentOffset, contentSize} = nativeEvent;
      const x = Math.round(contentOffset.x);
      const viewSize = nativeEvent.layoutMeasurement;
      const maxOffset = Math.round(contentSize.width - viewSize.width);

      const oldIdx = idx.current;
      idx.current = Math.round(x / sliderWidth);
      if (loop) {
        if (x <= 0) {
          if (idx.current !== oldIdx) {
            ref.current?.scrollToIndex({
              index: slides.length - 2,
              animated: false,
            });
          }
          idx.current = slides.length - 3;
        } else if (x + 5 >= maxOffset) {
          if (idx.current !== oldIdx) {
            ref.current?.scrollToIndex({index: 1, animated: false});
          }
          idx.current = 0;
        } else {
          idx.current -= 1;
        }
      }
      if (idx.current !== oldIdx) onSnapToItem?.(idx.current);
      onMomentum.current = false;
      if (autoplay && loop) setPlayInterval(interval);
    },
    [autoplay, interval, loop, onSnapToItem, sliderWidth, slides.length],
  );

  return (
    <FlatList
      data={slides}
      renderItem={renderItem}
      horizontal
      pagingEnabled
      snapToInterval={sliderWidth}
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={onMomentumScrollEnd}
      onMomentumScrollBegin={onMomentumScrollStart}
      scrollEventThrottle={16}
      disableIntervalMomentum
      ref={ref}
    />
  );
};

export default AppCarousel;
