import {useNavigation, useRoute} from '@react-navigation/native';
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
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
  showIcon?: boolean;
  isStackTop?: boolean;
  backHandler?: () => void;
  renderLeft?: JSX.Element;
  renderRight?: JSX.Element;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showIcon,
  isStackTop,
  backHandler,
  renderLeft,
  renderRight,
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.header}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {isStackTop ? (
          <AppText style={styles.title}>{title}</AppText>
        ) : (
          <AppBackButton
            title={title}
            style={{marginRight: 10, height: 56}}
            onPress={() => {
              if (backHandler) {
                backHandler();
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
