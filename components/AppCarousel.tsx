import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Platform, ScrollView, StyleSheet, View} from 'react-native';
import {useInterval} from '@/utils/useInterval';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

type AppCarouselProps<T> = {
  renderItem: ({item, index}: {item: T; index: number}) => React.ReactNode;
  data: T[];
  sliderWidth: number;
  onSnapToItem: (v: number) => void;
  keyExtractor?: (item: T) => string;
  autoplay?: boolean;
  loop?: boolean;
};
const AppCarousel: React.FC<AppCarouselProps<T>> = ({
  data,
  renderItem,
  sliderWidth,
  onSnapToItem,
  keyExtractor,
  autoplay = false,
  loop = false,
}) => {
  const slides = useMemo(
    () => (loop && data.length === 1 ? data.concat(data) : data),
    [data, loop],
  );
  const [list, setList] = useState<T>([]);
  const [idx, setIdx] = useState(loop ? 1 : 0);
  const ref = useRef<ScrollView>();
  const onMomentum = useRef(false);
  const [playInterval, setPlayInterval] = useState<number | null>(
    autoplay && loop ? 2500 : null,
  );

  useEffect(() => {
    if (list.length === 0) {
      console.log('@@ set init list');
      setList(
        slides.length === 2 ? slides.concat(slides[0]) : slides.slice(0, 3),
      );
    }
  }, [list.length, slides]);

  const moveSlide = useCallback(
    (newIdx: number) => {
      if (newIdx <= 0) {
        // left most
        if (loop && slides.length > 1)
          setList(
            slides.slice(slides.length - 1).concat(slides.slice(0, newIdx + 2)),
          );
      } else if (newIdx + 2 > slides.length) {
        // right most
        if (loop && slides.length > 1)
          setList(slides.slice(newIdx - 1).concat(slides[0]));
      } else if (slides.length > 1) {
        setList(slides.slice(newIdx - 1, newIdx + 2));
      }
      setIdx(newIdx);
      onSnapToItem(newIdx);
      if (loop || (newIdx > 0 && newIdx < slides.length - 1))
        ref.current?.scrollTo({x: sliderWidth, y: 0, animated: false});
    },
    [slides, onSnapToItem, loop, sliderWidth],
  );

  const onMomentumScrollStart = useCallback(() => {
    onMomentum.current = true;
    setPlayInterval(null);
  }, []);

  const onMomentumScrollEnd = useCallback(
    (x: number, slideIdx: number) => {
      if (onMomentum.current) {
        const i = Math.round(x / sliderWidth);
        let newIdx = slideIdx;
        if (loop) {
          if (i > 1) newIdx = (newIdx + 1) % slides.length;
          else if (i < 1) newIdx = (newIdx - 1 + slides.length) % slides.length;
        } else {
          // eslint-disable-next-line no-nested-ternary, no-lonely-if
          if (i === 1) {
            if (newIdx === 0) newIdx++;
            else if (newIdx === slides.length - 1) newIdx--;
          } else if (i > 1 && newIdx < slides.length - 1) newIdx++;
          else if (i < 1 && newIdx > 0) newIdx--;
        }

        if (newIdx !== slideIdx) moveSlide(newIdx);
      }
      onMomentum.current = false;
      setPlayInterval(autoplay && loop ? 2500 : null);
    },
    [autoplay, loop, moveSlide, sliderWidth, slides.length],
  );

  useInterval(() => {
    if (!onMomentum.current) {
      ref.current?.scrollToEnd({animated: true});
      if (Platform.OS === 'android') moveSlide((idx + 1) % slides.length);
    }
  }, playInterval);

  console.log('@@ render');

  return (
    <Animated.ScrollView
      ref={ref}
      pagingEnabled
      horizontal
      showsHorizontalScrollIndicator={false}
      onMomentumScrollBegin={onMomentumScrollStart}
      onMomentumScrollEnd={({
        nativeEvent: {
          contentOffset: {x},
        },
      }) => onMomentumScrollEnd(x, idx)}
      snapToAlignment="center">
      <View style={styles.container}>
        {list.map((item, i) => (
          <View
            key={keyExtractor ? keyExtractor(item) : item.key || i}
            style={{width: sliderWidth, flex: 1}}>
            {renderItem({item, index: i})}
          </View>
        ))}
      </View>
    </Animated.ScrollView>
  );
};

export default AppCarousel;
