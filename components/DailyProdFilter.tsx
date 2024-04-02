import React, {useCallback, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import i18n from '@/utils/i18n';
import {colors} from '@/constants/Colors';
import AppButton from './AppButton';
import {appStyles} from '../constants/Styles';
import AppSvgIcon from './AppSvgIcon';

const styles = StyleSheet.create({
  button: {
    borderColor: colors.lightGrey,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 100,
  },
});

export type DailyProdFilterList = 'all' | '500' | '1024' | '2048' | '3072';

type DailyProdFilterProps = {
  onValueChange: (v: DailyProdFilterList) => void;
  filterList: DailyProdFilterList[];
};

const DailyProdFilter: React.FC<DailyProdFilterProps> = ({
  onValueChange,
  filterList,
}) => {
  const scrollRef = useRef<ScrollView>();
  const [filter, setFilter] = useState<DailyProdFilterList>('all');
  const [scrollEnd, setScrollEnd] = useState<boolean>(false);
  const [showIcon, setShowIcon] = useState<boolean>(true);

  const renderScrollIcon = useCallback(
    () => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={['#FFFFFF00', colors.white]}
          style={{
            width: 40,
            height: 34,
            position: 'absolute',
            right: 40,
            zIndex: 200,
          }}
        />

        <View
          style={{
            marginRight: 20,
            marginLeft: 4,
            height: 34,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}>
          <AppSvgIcon
            name="scrollRightArrow"
            style={{}}
            onPress={() => {
              setShowIcon(false);
              scrollRef?.current.scrollToEnd();
            }}
          />
        </View>
      </View>
    ),
    [],
  );

  const handleScroll = useCallback((event) => {
    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;
    const ontentWidth = contentSize.width;
    const scrollViewWidth = layoutMeasurement.width;
    const scrollPosition = contentOffset.x;

    // Calculate if scrolled to the end
    const isScrolledToEnd = ontentWidth - 2 <= scrollPosition + scrollViewWidth;
    setScrollEnd(isScrolledToEnd);
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
      }}>
      <ScrollView
        style={{
          flexDirection: 'row',
          paddingVertical: 24,
          width: '100%',
        }}
        ref={scrollRef}
        onScroll={handleScroll}
        onScrollBeginDrag={() => {
          setShowIcon(true);
        }}
        onMomentumScrollEnd={() => {
          setShowIcon(!scrollEnd);
        }}
        horizontal
        showsHorizontalScrollIndicator={false}>
        <View style={{width: 20, height: 34}} />

        {filterList.map((elm, idx) => (
          <AppButton
            onPress={() => {
              setFilter(elm);
              onValueChange?.(elm);
            }}
            key={elm}
            style={{
              marginRight: 8,
              backgroundColor: elm === filter ? colors.clearBlue : colors.white,
              borderWidth: 1,
              borderRadius: 100,
              borderColor: elm === filter ? colors.clearBlue : colors.lightGrey,
              // width: 70,
              height: 34,
            }}
            titleStyle={[
              styles.button,
              {
                ...appStyles.bold14Text,
                color: elm === filter ? colors.white : colors.black,
              },
            ]}
            title={i18n.t(`daily:filter:${elm}`)}
          />
        ))}

        <View style={{width: 20, height: 34}} />
      </ScrollView>

      {showIcon && renderScrollIcon()}
    </View>
  );
};

export default DailyProdFilter;
