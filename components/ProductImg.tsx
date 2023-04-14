import React, {memo} from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  View,
  ViewStyle,
  ImageStyle,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';

const styles = StyleSheet.create({
  tagBox: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ProductImg = ({
  style,
  imageStyle,
  source,
  maxDiscount = 0,
  tags,
}: {
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  source: ImageSourcePropType;
  maxDiscount?: number;
  tags?: string[];
}) => {
  return (
    <View style={style}>
      <Image
        style={imageStyle}
        source={{uri: source.uri, cache: 'force-cache'}}
      />
      <View style={{position: 'absolute', flexDirection: 'row'}}>
        {tags &&
          tags.length > 0 &&
          tags.map((elm) => (
            <View style={[styles.tagBox, {backgroundColor: colors.purplyBlue}]}>
              <AppText style={{...appStyles.bold14Text, color: colors.white}}>
                {i18n.t(`localOp:tag:${elm}`)}
              </AppText>
            </View>
          ))}
        {maxDiscount > 1 && (
          <View style={[styles.tagBox, {backgroundColor: colors.red}]}>
            <AppText style={{...appStyles.bold14Text, color: colors.white}}>
              {maxDiscount}%
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(ProductImg);
