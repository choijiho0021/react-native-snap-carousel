import React, {memo, useCallback, useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {API} from '@/redux/api';
import {RkbExtraCoupon} from '@/redux/api/promotionApi';
import {windowWidth} from '@/constants/SliderEntry.style';
import AppModal from '@/components/AppModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
  imageStyle: {
    height: (windowWidth - 60) / 3,
  },
  downloadStyle: {
    height: windowWidth * 1.83,
  },
});

const ExtraCouponListItem0 = ({
  item,
  onPress,
}: {
  item: RkbExtraCoupon[];
  onPress?: (i: RkbExtraCoupon) => void;
}) => {
  return (
    <View style={styles.row}>
      {item.map((i) => (
        <Pressable
          key={i.uuid}
          style={styles.button}
          onPress={() => onPress?.(i)}>
          <Image
            style={styles.imageStyle}
            resizeMode="contain"
            source={{uri: API.default.httpImageUrl(i.image)}}
          />
        </Pressable>
      ))}
      {item.length % 2 === 1 ? <View style={styles.button} /> : null}
    </View>
  );
};

const ExtraCouponListItem = memo(ExtraCouponListItem0);

const ExtraCouponScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState<RkbExtraCoupon[][]>();
  const [showItem, setShowItem] = useState<RkbExtraCoupon>();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AppBackButton title={i18n.t('settings')} />,
    });
  }, [navigation]);

  useEffect(() => {
    if (data === undefined) {
      API.Promotion.getExtraCoupon().then((rsp) => {
        if (rsp.result === 0)
          setData(
            rsp.objects.reduce((acc, cur, idx) => {
              if (idx % 2 === 0) return acc.concat([[cur]]);
              acc[acc.length - 1].push(cur);
              return acc;
            }, [] as RkbExtraCoupon[][]),
          );
        else setData([]);
      });
    }
  }, [data]);

  const renderItem = useCallback(
    ({item}: {item: RkbExtraCoupon[]}) => (
      <ExtraCouponListItem item={item} onPress={setShowItem} />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <FlatList data={data} renderItem={renderItem} />
      {showItem && (
        <AppModal
          type="close"
          contentStyle={{backgroundColor: 'transparent', width: '100%'}}
          visible={showItem !== undefined}
          onOkClose={() => setShowItem(undefined)}>
          <Image
            style={styles.downloadStyle}
            // resizeMode="contain"
            source={{uri: API.default.httpImageUrl(showItem.download)}}
          />
        </AppModal>
      )}
    </View>
  );
};

export default ExtraCouponScreen;
