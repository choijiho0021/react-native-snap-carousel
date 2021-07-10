import React, {memo} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {API} from '@/submodules/rokebi-utils';
import AppIcon from './AppIcon';

type AppUserPicProps = {
  dimension: {width: number; height: number};
  url?: string;
  icon?: string;
  onPress?: () => void;
};
const AppUserPic: React.FC<AppUserPicProps> = ({
  dimension,
  url,
  icon,
  onPress = () => {},
}) => {
  return (
    <View style={[dimension, {alignSelf: 'center'}]}>
      <TouchableOpacity onPress={onPress}>
        {url ? (
          <Image
            source={{uri: API.default.httpImageUrl(url)}}
            style={[dimension, {borderRadius: dimension.width / 2}]}
          />
        ) : (
          <AppIcon name={icon} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default memo(AppUserPic);
