import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

type AppCarouselProps<T> = {
  renderItem: ({item, idx}: {item: T; idx: number}) => React.ReactNode;
  data: T[];
  sliderWidth: number;
  onSnapToItem: (v: number) => void;
  autoplay?: boolean;
  loop?: boolean;
};
const AppCarousel: React.FC<AppCarouselProps<T>> = ({
  data,
  renderItem,
  sliderWidth,
  onSnapToItem,
  autoplay = false,
  loop = false,
}) => {
  console.log('@@@ carousel', data);
  const [list, setList] = useState(data.slice(0, 3));
  const [idx, setIdx] = useState(1);
  const ref = useRef<ScrollView>();

  useEffect(() => {
    if (loop || (idx > 0 && idx < data.length - 1))
      ref.current?.scrollTo({x: sliderWidth, y: 0, animated: false});
  }, [sliderWidth, idx, data.length, loop]);

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
        }
      }}
      snapToAlignment="center">
      <View style={styles.container}>
        {list.map((item, i) => renderItem({item, idx: idx - 1 + i}))}
      </View>
    </ScrollView>
  );
};

export default AppCarousel;
