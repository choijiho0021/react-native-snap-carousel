import {useNavigation, useRoute} from '@react-navigation/native';
import React, {memo} from 'react';
import {Image, Pressable, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@/redux';
import {appStyles} from '@/constants/Styles';
import AppText from './AppText';
import {goBack} from '@/navigation/navigation';

const AppBackButton = ({
  title,
  isPaid = false,
  onPress,
}: {
  title?: string;
  isPaid?: boolean;
  onPress?: () => void;
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <Pressable
      style={{justifyContent: 'center'}}
      onPress={() => {
        if (onPress) onPress();
        else if (!isPaid) goBack(navigation, route);
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
        <AppText style={[appStyles.subTitle, {marginLeft: 16, fontSize: 20}]}>
          {title}
        </AppText>
      </View>
    </Pressable>
  );
};

export default connect(({cart}: RootState) => ({
  lastTab: cart.lastTab.toArray(),
}))(memo(AppBackButton));
