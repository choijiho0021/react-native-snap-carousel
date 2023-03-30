import {useNavigation, useRoute} from '@react-navigation/native';
import React, {memo} from 'react';
import {Pressable, View, ViewStyle, TextProps, ImageStyle} from 'react-native';
import {appStyles} from '@/constants/Styles';
import AppText from './AppText';
import {goBack} from '@/navigation/navigation';
import pressIcons from './AppSvgIcon/pressIcon';

const AppBackButton = ({
  title,
  isPaid = false,
  onPress,
  style,
  imageStyle,
  textProps,
}: {
  title?: string;
  isPaid?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  textProps?: TextProps;
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <Pressable
      style={{justifyContent: 'center', ...style}}
      onPress={() => {
        if (onPress) onPress();
        else if (!isPaid) goBack(navigation, route);
      }}
      disabled={isPaid}>
      <View
        key="btn"
        style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        {!isPaid ? (
          <View key="icon" style={{marginLeft: 20, ...imageStyle}}>
            {pressIcons.btnBack}
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
