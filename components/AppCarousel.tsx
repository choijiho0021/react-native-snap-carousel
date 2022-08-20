import React, {useCallback, useEffect, useRef, useState} from 'react';
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
  const [list, setList] = useState(data.slice(0, 3));
  const [idx, setIdx] = useState(loop ? 1 : 0);
  const ref = useRef<ScrollView>();

  useEffect(() => {
    if (loop || (idx > 0 && idx < data.length - 1))
      ref.current?.scrollTo({x: sliderWidth, y: 0, animated: false});
  }, [sliderWidth, idx, data.length, loop]);

  const moveSlide = useCallback(
    (newIdx: number) => {
      if (newIdx <= 0) {
        // left most
        if (loop)
          setList(
            data.slice(data.length - 1).concat(data.slice(0, newIdx + 2)),
          );
      } else if (newIdx + 2 > data.length) {
        // right most
        if (loop) setList(data.slice(newIdx - 1).concat(data[0]));
      } else {
        setList(data.slice(newIdx - 1, newIdx + 2));
      }
      setIdx(newIdx);
      onSnapToItem(newIdx);
    },
    [data, loop, onSnapToItem],
  );

  useInterval(
    () => {
      ref.current?.scrollToEnd({animated: true});
      moveSlide((idx + 1) % data.length);
    },
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
          if (i > 1) newIdx = (idx + 1) % data.length;
          else if (i < 1) newIdx = (idx - 1 + data.length) % data.length;
        } else {
          // eslint-disable-next-line no-nested-ternary, no-lonely-if
          if (i === 1)
            newIdx = idx + (idx === 0 ? 1 : idx === data.length - 1 ? -1 : 0);
          else if (i > 1 && idx < data.length - 1) newIdx++;
          else if (i < 1 && idx > 0) newIdx--;
        }

        if (newIdx !== idx) {
          moveSlide(newIdx);
        }
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
