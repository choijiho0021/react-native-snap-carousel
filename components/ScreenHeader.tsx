import {useNavigation, useRoute} from '@react-navigation/native';
import React, {memo, useState} from 'react';
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {API} from '@/redux/api';
import i18n from '@/utils/i18n';
import AppIcon from './AppIcon';
import AppText from './AppText';
import AppBackButton from './AppBackButton';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

interface ScreenHeaderProps {
  title: string;
  renderLeft?: JSX.Element;
  renderRight?: JSX.Element;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  renderLeft,
  renderRight,
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.header}>
      <View style={{flexDirection: 'row'}}>
        <AppBackButton
          title={title}
          style={{marginRight: 10, height: 56}}
          onPress={() => {
            navigation.goBack();
          }}
        />
        {renderLeft}
      </View>
      {renderRight}
    </View>
  );
};

export default memo(ScreenHeader);
