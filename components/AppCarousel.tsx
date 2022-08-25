import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Platform, ScrollView, View} from 'react-native';
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
  carouselRef?: MutableRefObject<AppCarouselRef | null>;
  optimize?: boolean;
};
const AppCarousel: React.FC<AppCarouselProps<T>> = ({
  data,
  renderItem,
  sliderWidth: sw,
  onSnapToItem,
  keyExtractor,
  autoplay = false,
  loop = false,
  optimize = true,
  carouselRef,
}) => {
  const slides = useMemo(
    () => (loop && data.length === 1 ? data.concat(data) : data),
    [data, loop],
  );
  const sliderWidth = useMemo(() => Math.floor(sw), [sw]);
  const [list, setList] = useState<T>(optimize ? [] : data);
  const idx = useRef(loop ? 1 : 0);
  const ref = useRef<ScrollView>();
  const onMomentum = useRef(false);
  const onMomentumStart = useRef(0);
  const [playInterval, setPlayInterval] = useState<number | null>(
    autoplay && loop ? 2500 : null,
  );

  useEffect(() => {
    if (list.length === 0) {
      setList(
        slides.length === 2 ? slides.concat(slides[0]) : slides.slice(0, 3),
      );
    }
  }, [list.length, slides]);

  const moveSlide = useCallback(
    (newIdx: number) => {
      if (optimize) {
        if (newIdx <= 0) {
          // left most
          if (loop && slides.length > 1)
            setList(
              slides
                .slice(slides.length - 1)
                .concat(slides.slice(0, newIdx + 2)),
            );
        } else if (newIdx + 2 > slides.length) {
          // right most
          if (loop && slides.length > 1)
            setList(slides.slice(newIdx - 1).concat(slides[0]));
        } else if (slides.length > 1) {
          setList(slides.slice(newIdx - 1, newIdx + 2));
        }

        if (loop || (newIdx > 0 && newIdx < slides.length - 1))
          ref.current?.scrollTo({x: sliderWidth, y: 0, animated: false});
      }
      idx.current = newIdx;
      onSnapToItem(newIdx);
    },
    [optimize, onSnapToItem, loop, slides, sliderWidth],
  );

  const onMomentumScrollStart = useCallback(
    ({
      nativeEvent: {
        contentOffset: {x},
      },
    }) => {
      onMomentumStart.current = x;
      onMomentum.current = true;
      setPlayInterval(null);
    },
    [],
  );

  const onMomentumScrollEnd = useCallback(
    ({
      nativeEvent: {
        contentOffset: {x},
      },
    }) => {
      if (onMomentum.current) {
        const i = Math.ceil(x / sliderWidth);
        const direction = x - onMomentumStart.current > 0 ? 1 : -1;
        let newIdx = idx.current;

        if (Math.abs(x / sliderWidth - i) > 0.1) {
          ref.current?.scrollTo({
            x: (direction > 0 ? i : i - 1) * sliderWidth,
            y: 0,
            animated: true,
          });
        }

        if (optimize) {
          const steps =
            Math.ceil(Math.abs(x - onMomentumStart.current) / sliderWidth) *
            direction;
          if (loop) {
            if (i !== 1)
              newIdx = (newIdx + steps + slides.length) % slides.length;
          } else {
            // eslint-disable-next-line no-nested-ternary, no-lonely-if
            if (i === 1) {
              if (newIdx === 0 || newIdx === slides.length - 1) newIdx += steps;
            } else if (newIdx > 0 && newIdx < slides.length - 1)
              newIdx += steps;
          }
        } else {
          newIdx = i;
        }

        if (newIdx !== idx.current) moveSlide(newIdx);
      }
      onMomentum.current = false;
      setPlayInterval(autoplay && loop ? 2500 : null);
    },
    [autoplay, loop, moveSlide, optimize, sliderWidth, slides.length],
  );

  useEffect(() => {
    if (carouselRef) {
      carouselRef.current = {
        snapToNext: () => {
          ref.current?.scrollTo({
            // eslint-disable-next-line no-nested-ternary
            x: optimize
              ? idx.current <= 1
                ? sliderWidth
                : sliderWidth * 2
              : (idx.current + 1) * sliderWidth,
            y: 0,
            animated: true,
          });
          moveSlide((idx.current + 1) % slides.length);
        },
      };
    }
  }, [carouselRef, moveSlide, optimize, sliderWidth, slides.length]);

  useInterval(() => {
    if (!onMomentum.current) {
      ref.current?.scrollToEnd({animated: true});
      if (Platform.OS === 'android')
        moveSlide((idx.current + 1) % slides.length);
    }
  }, playInterval);

  return (
    <ScrollView
      ref={ref}
      pagingEnabled
      horizontal
      showsHorizontalScrollIndicator={false}
      onMomentumScrollBegin={onMomentumScrollStart}
      onMomentumScrollEnd={onMomentumScrollEnd}
      snapToAlignment="center">
      {list.map((item, i) => (
        <View
          key={keyExtractor ? keyExtractor(item) : item.key || i}
          style={{width: sliderWidth, flex: 1}}>
          {renderItem({item, index: i})}
        </View>
      ))}
    </ScrollView>
  );
};

export default AppCarousel;
