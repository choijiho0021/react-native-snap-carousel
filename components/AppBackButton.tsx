import {useNavigation, useRoute} from '@react-navigation/native';
import React, {memo} from 'react';
import {Pressable, View, ViewStyle, TextProps, ImageStyle} from 'react-native';
import {appStyles} from '@/constants/Styles';
import AppText from './AppText';
import {goBack} from '@/navigation/navigation';
import AppSvgIcon from './AppSvgIcon';

const AppBackButton = ({
  title,
  disabled = false,
  showIcon = true,
  onPress,
  style,
  imageStyle,
  textProps,
  disable,
}: {
  title?: string;
  disabled?: boolean;
  showIcon?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  textProps?: TextProps;
  disable?: boolean;
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <Pressable
      style={{justifyContent: 'center', ...style}}
      onPress={() => {
        if (disable) return;
        if (onPress) onPress();
        else goBack(navigation, route);
      }}
      disabled={disabled}>
      <View
        key="btn"
        style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        {showIcon ? (
          <View key="icon" style={{marginLeft: 20, ...imageStyle}}>
            <AppSvgIcon name="btnBack" />
          </View>
        ) : (
          <View key="empty" style={{marginLeft: 15}} />
        )}
        <AppText
          key="label"
          style={[appStyles.subTitle, {marginLeft: 16, fontSize: 20}]}
          numberOfLines={1}
          ellipsizeMode="tail"
          {...textProps}>
          {title}
        </AppText>
      </View>
    </Pressable>
  );
};

export default memo(AppBackButton);
