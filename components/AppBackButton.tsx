import React, {memo, useCallback} from 'react';
import {Image, View, Text, Pressable} from 'react-native';
import {connect} from 'react-redux';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {useNavigation} from '@react-navigation/native';

const AppBackButton = ({
  title,
  isPaid = false,
  back,
  lastTab = ['0', '1'],
  onPress,
}: {
  back?: string;
  title?: string;
  isPaid?: boolean;
  lastTab: string[];
  onPress?: () => void;
}) => {
  const navigation = useNavigation();

  const goBack = useCallback(() => {
    // 활성화 안된 AppBackButton의 핸들러가 작동하지 않도록 추가
    if (navigation.isFocused()) {
      if (back === 'Home') navigation.navigate('Home');
      // if ( back == 'home') return navigation.reset({routes: [{ name: 'Home' }] });
      else if (back === 'top') navigation.popToTop();
      else if (back === 'lastTab') navigation.navigate(lastTab[1]);
      else navigation.goBack();
    }
  }, [back, lastTab, navigation]);

  return (
    <Pressable
      style={{justifyContent: 'center'}}
      onPress={() => {
        if (onPress) onPress();
        else if (!isPaid) goBack();
      }}
      disabled={isPaid}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {!isPaid ? (
          <Image
            style={{marginLeft: 20}}
            source={require('../assets/images/header/btnBack.png')}
          />
        ) : (
          <View style={{marginLeft: 15}} />
        )}
        <Text style={[appStyles.subTitle, {marginLeft: 16}]}>{title}</Text>
      </View>
    </Pressable>
  );
};

export default connect(({cart}: RootState) => ({
  lastTab: cart.lastTab.toArray(),
}))(memo(AppBackButton));
