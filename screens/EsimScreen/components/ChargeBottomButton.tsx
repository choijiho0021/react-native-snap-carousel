import React, {memo, useState} from 'react';
import {StyleSheet, Pressable} from 'react-native';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';

const styles = StyleSheet.create({
  typeText: {
    ...appStyles.bold18Text,
    lineHeight: 26,
    color: colors.white,
    textAlign: 'center',
  },
  btn: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
});

const ChargeBottomButton = ({
  onPress,
  disabled = false,
  title,
}: {
  onPress: () => void;
  disabled: boolean;
  title?: string;
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPress={() => onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.btn,
        {
          backgroundColor: disabled
            ? colors.line
            : isPressed
            ? colors.dodgerBlue
            : colors.clearBlue,
        },
      ]}>
      <AppText style={styles.typeText}>
        {title}
      </AppText>
    </Pressable>
  );
};

export default memo(ChargeBottomButton);
