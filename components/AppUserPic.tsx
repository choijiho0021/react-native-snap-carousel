import React, {memo, useCallback} from 'react';
import {Image, ImageResizeMode, ImageStyle, Pressable} from 'react-native';
import {API} from '@/redux/api';

type AppUserPicProps = {
  style: ImageStyle;
  url?: string;
  icon?: React.ReactNode;
  resizeMode?: ImageResizeMode;
  isAbsolutePath?: boolean;
  onPress?: () => void;
};
const AppUserPic: React.FC<AppUserPicProps> = ({
  style,
  url,
  icon,
  resizeMode = 'cover',
  isAbsolutePath = false,
  onPress,
}) => {
  const render = useCallback(() => {
    if (url)
      return (
        <Image
          style={style}
          source={{uri: isAbsolutePath ? url : API.default.httpImageUrl(url)}}
          resizeMode={resizeMode}
        />
      );

    return icon || null;
  }, [icon, isAbsolutePath, resizeMode, style, url]);

  return onPress ? (
    <Pressable style={{alignSelf: 'center', width: '100%'}} onPress={onPress}>
      {render()}
    </Pressable>
  ) : (
    render()
  );
};

export default memo(AppUserPic);
