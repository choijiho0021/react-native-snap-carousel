import React, {memo, useState} from 'react';
import {StyleSheet, Pressable} from 'react-native';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';
import {sliderWidth} from '@/constants/SliderEntry.style';

const styles = StyleSheet.create({
  btn: {
    width: sliderWidth - 40,
    marginTop: 22,
    marginHorizontal: 20,
    borderRadius: 3,
    padding: 30,
    borderWidth: 1,
    borderColor: colors.whiteFive,

    elevation: 12,
    shadowColor: 'rgb(166, 168, 172)',
    shadowRadius: 12,
    shadowOpacity: 0.16,
    shadowOffset: {
      height: 4,
      width: 0,
    },
  },
  detailText: {
    ...appStyles.normal14Text,
  },
  typeText: {
    ...appStyles.bold20Text,
    marginTop: 50,
    alignSelf: 'flex-end',
  },
});

const ChargeTypeButton = ({
  type,
  onPress,
  disabled = false,
}: {
  type: string;
  onPress: () => void;
  disabled: boolean;
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      style={[
        styles.btn,
        {
          backgroundColor: disabled
            ? colors.whiteTwo
            : isPressed
            ? colors.backGrey
            : colors.white,
        },
      ]}
      onPress={() => !disabled && onPress()}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}>
      <AppText style={styles.detailText}>
        {i18n.t(`esim:charge:type:${type}:detail`)}
      </AppText>
      <AppText style={styles.typeText}>
        {i18n.t(`esim:charge:type:${type}`)}
      </AppText>
    </Pressable>
  );
};

export default memo(ChargeTypeButton);
