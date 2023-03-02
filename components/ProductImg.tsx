import React, {memo} from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {ImageStyle} from 'react-native';
import Env from '@/environment';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const ProductImg = ({
  style,
  imageStyle,
  source,
  maxDiscount = 0,
}: {
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  source: ImageSourcePropType;
  maxDiscount?: number;
}) => {
  return (
    <View style={style}>
      <Image style={imageStyle} source={source} />
      {maxDiscount > 1 && (
        <View
          style={{
            backgroundColor: 'red',
            paddingHorizontal: 10,
            paddingVertical: 4,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppText style={{...appStyles.bold14Text, color: colors.white}}>
            {maxDiscount}%
          </AppText>
        </View>
      )}
    </View>
  );
};

export default memo(ProductImg);
