import React, {memo, useCallback, useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {API} from '@/redux/api';
import {RkbExtraCoupon} from '@/redux/api/promotionApi';
import {windowWidth} from '@/constants/SliderEntry.style';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  imageStyle: {
    width: windowWidth - 40,
    height: (windowWidth - 40) / 1.5,
    marginHorizontal: 20,
    marginVertical: 10,
  },
});

const ExtraCouponListItem0 = ({
  item,
  onPress,
}: {
  item: RkbExtraCoupon;
  onPress: () => void;
}) => {
  console.log('item', item);
  return (
    <Pressable onPress={onPress}>
      <Image
        style={styles.imageStyle}
        source={{uri: API.default.httpImageUrl(item.field_image)}}
      />
    </Pressable>
  );
};

const ExtraCouponListItem = memo(ExtraCouponListItem0);

const ExtraCouponScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState<RkbExtraCoupon[]>();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AppBackButton title={i18n.t('settings')} />,
    });
  }, [navigation]);

  useEffect(() => {
    if (data === undefined) {
      API.Promotion.getExtraCoupon().then((rsp) => {
        console.log('@@@ coupon extra', rsp);
        if (rsp.result === 0) setData(rsp.objects);
        else setData([]);
      });
    }
  }, [data]);

  const renderItem = useCallback(
    ({item}: {item: RkbExtraCoupon}) => (
      <ExtraCouponListItem item={item} onPress={() => {}} />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <FlatList data={data} renderItem={renderItem} />
    </View>
  );
};

export default ExtraCouponScreen;
