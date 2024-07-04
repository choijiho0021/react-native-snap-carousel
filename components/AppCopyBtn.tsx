import React, {memo, useState} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppText from './AppText';

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.white,
    marginLeft: 10,
    width: 62,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 3,
  },
  text: {
    ...appStyles.normal14Text,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface AppCopyBtnProps {
  style?: StyleProp<ViewStyle>;
  title: string;
  onPress?: () => void;
  titleStyle?: StyleProp<TextStyle>;
}

const AppCopyBtn: React.FC<AppCopyBtnProps> = ({
  style,
  title,
  onPress,
  titleStyle,
}) => {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      style={[
        style || styles.button,
        {borderColor: pressed ? colors.clearBlue : colors.lightGrey},
      ]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}>
      <View style={styles.container}>
        <AppText
          style={[
            titleStyle || styles.text,
            {color: pressed ? colors.clearBlue : colors.black},
          ]}>
          {title}
        </AppText>
      </View>
    </Pressable>
  );
};

export default memo(AppCopyBtn);
