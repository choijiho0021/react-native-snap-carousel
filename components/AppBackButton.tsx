import {useNavigation, useRoute} from '@react-navigation/native';
import React, {memo} from 'react';
import {
  Image,
  Pressable,
  View,
  ViewStyle,
  TextProps,
  ImageStyle,
} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@/redux';
import {appStyles} from '@/constants/Styles';
import AppText from './AppText';
import {goBack} from '@/navigation/navigation';

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
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        {!isPaid ? (
          <Image
            style={{marginLeft: 20, ...imageStyle}}
            source={require('../assets/images/header/btnBack.png')}
          />
        ) : (
          <View style={{marginLeft: 15}} />
        )}
        <AppText
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

export default connect(({cart}: RootState) => ({
  lastTab: cart.lastTab.toArray(),
}))(memo(AppBackButton));
