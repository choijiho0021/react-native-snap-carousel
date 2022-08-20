import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
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

  useEffect(() => {
    if (list.length === 0) {
      setList(
        slides.length === 2 ? slides.concat(slides[0]) : slides.slice(0, 3),
      );
    }
  }, [list.length, slides]);

  useEffect(() => {
    if (loop || (idx > 0 && idx < slides.length - 1))
      ref.current?.scrollTo({x: sliderWidth, y: 0, animated: false});
  }, [sliderWidth, idx, slides.length, loop]);

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
    },
    [slides, loop, onSnapToItem],
  );

  useInterval(
    () => ref.current?.scrollToEnd({animated: true}),
    autoplay && loop ? 2500 : null,
  );

  return (
    <ScrollView
      ref={ref}
      pagingEnabled
      horizontal
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={({
        nativeEvent: {
          contentOffset: {x},
        },
      }) => {
        const i = Math.floor(x / sliderWidth);
        let newIdx = idx;
        if (loop) {
          if (i > 1) newIdx = (idx + 1) % slides.length;
          else if (i < 1) newIdx = (idx - 1 + slides.length) % slides.length;
        } else {
          // eslint-disable-next-line no-nested-ternary, no-lonely-if
          if (i === 1)
            newIdx = idx + (idx === 0 ? 1 : idx === slides.length - 1 ? -1 : 0);
          else if (i > 1 && idx < slides.length - 1) newIdx++;
          else if (i < 1 && idx > 0) newIdx--;
        }

        if (newIdx !== idx) moveSlide(newIdx);
      }}
      snapToAlignment="center">
      <View style={styles.container}>
        {list.map((item) => (
          <View
            key={keyExtractor ? keyExtractor(item) : item.key}
            style={{width: sliderWidth, flex: 1}}>
            {renderItem({item, index: idx})}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default AppCarousel;
