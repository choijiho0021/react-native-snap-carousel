import {useNavigation, useRoute} from '@react-navigation/native';
import React, {memo} from 'react';
import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppText from './AppText';
import AppBackButton from './AppBackButton';
import {goBack} from '@/navigation/navigation';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
  },
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
});

interface ScreenHeaderProps {
  title?: string;
  titleStyle?: TextStyle;
  showIcon?: boolean;
  isStackTop?: boolean;
  backHandler?: () => void;
  renderLeft?: React.ReactNode;
  renderRight?: React.ReactNode;
  headerStyle?: ViewStyle;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  titleStyle,
  showIcon,
  isStackTop,
  backHandler,
  renderLeft,
  renderRight,
  headerStyle,
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={[styles.header, headerStyle]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {isStackTop ? (
          <AppText style={[styles.title, titleStyle]}>{title}</AppText>
        ) : (
          <AppBackButton
            title={title}
            titleStyle={titleStyle}
            style={{marginRight: 10, height: 56}}
            onPress={() => {
              if (backHandler) {
                backHandler?.();
              } else {
                goBack(navigation, route);
              }
            }}
            showIcon={showIcon}
          />
        )}

        {renderLeft}
      </View>
      {renderRight}
    </View>
  );
};

export default memo(ScreenHeader);
