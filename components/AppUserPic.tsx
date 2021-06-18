import React, {memo} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {API} from 'RokebiESIM/submodules/rokebi-utils';
import AppIcon from './AppIcon';

function AppUserPic({style, url, icon, onPress}) {
  return (
    <View style={[style, {alignSelf: 'center'}]}>
      <TouchableOpacity onPress={onPress}>
        {url ? (
          <Image
            source={{uri: API.default.httpImageUrl(url)}}
            style={[style, {borderRadius: style.width / 2}]}
          />
        ) : (
          <AppIcon name={icon} />
        )}
      </TouchableOpacity>
    </View>
  );
}

export default memo(AppUserPic);
