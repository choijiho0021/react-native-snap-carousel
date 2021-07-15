import React, {memo} from 'react';
import {Image, ImageStyle, Pressable} from 'react-native';
import {API} from '@/submodules/rokebi-utils';
import AppIcon from './AppIcon';

type AppUserPicProps = {
  style: ImageStyle;
  crop?: boolean;
  url?: string;
  icon?: string;
  onPress?: () => void;
};
const AppUserPic: React.FC<AppUserPicProps> = ({
  style,
  url,
  icon,
  onPress = () => {},
}) => {
  return (
    <Pressable style={{alignSelf: 'center'}} onPress={onPress}>
      {url ? (
        <Image
          style={style}
          source={{uri: API.default.httpImageUrl(url)}}
          resizeMode="contain"
        />
      ) : (
        <AppIcon name={icon} />
      )}
    </Pressable>
  );
};

export default memo(AppUserPic);
