import {useNavigation, useRoute} from '@react-navigation/native';
import React, {memo, useCallback} from 'react';
import {Pressable, View, ViewStyle, TextProps, ImageStyle} from 'react-native';
import {appStyles} from '@/constants/Styles';
import AppText from './AppText';
import {goBack} from '@/navigation/navigation';
import AppSvgIcon from './AppSvgIcon';
import {values} from 'underscore';

const AppBackButton = ({
  title,
  disabled = false,
  showIcon = true,
  onPress,
  style,
  imageStyle,
  textProps,
  disable,
  showCloseModal = false,
}: {
  title?: string;
  disabled?: boolean;
  showIcon?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  textProps?: TextProps;
  disable?: boolean;
  showCloseModal?: boolean;
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  const goback = useCallback(() => {
    if (disable) return;
    if (onPress) onPress();
    else goBack(navigation, route);
  }, [disable, navigation, onPress, route]);

  return (
    <Pressable
      style={{
        justifyContent: 'center',
        flex: 1,
        ...style,
      }}
      onPress={goback}
      disabled={disabled}>
      <View
        key="btn"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}>
        {showIcon ? (
          <View key="icon" style={{marginLeft: 20, ...imageStyle}}>
            <AppSvgIcon name="btnBack" />
          </View>
        ) : (
          <View key="empty" style={{marginLeft: 15}} />
        )}
        <AppText
          key="label"
          style={[appStyles.subTitle, {marginLeft: 16, fontSize: 20, flex: 1}]}
          numberOfLines={1}
          ellipsizeMode="tail"
          {...textProps}>
          {title}
        </AppText>
        {showCloseModal && (
          <AppSvgIcon
            name="closeModal"
            key="closeModal"
            onPress={goback}
            style={{marginRight: 20}}
          />
        )}
      </View>
    </Pressable>
  );
};

export default memo(AppBackButton);
