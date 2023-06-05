import React, {memo, useState} from 'react';
import {StyleSheet, Pressable, View} from 'react-native';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';
import {sliderWidth} from '@/constants/SliderEntry.style';
import AppSvgIcon from '@/components/AppSvgIcon';

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frame: {
    width: sliderWidth - 40,
    marginTop: 26,
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
    ...appStyles.bold18Text,
    lineHeight: 26,
    marginTop: 8,
  },
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
    <View style={styles.frame}>
      <View style={styles.row}>
        <AppSvgIcon
          style={{opacity: disabled ? 0.64 : 1}}
          name={`${type}Type`}
        />
        <AppSvgIcon name="info" />
      </View>
      <AppText style={[styles.detailText, {opacity: disabled ? 0.64 : 1}]}>
        {i18n.t(`esim:charge:type:${type}:detail`)}
      </AppText>
      <Pressable
        onPress={() => onPress()}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={[
          styles.btn,
          {backgroundColor: disabled ? colors.line : colors.clearBlue},
        ]}>
        <AppText style={styles.typeText}>
          {i18n.t(`esim:charge:type:${type}`)}
        </AppText>
      </Pressable>
    </View>
  );
};

export default memo(ChargeTypeButton);
