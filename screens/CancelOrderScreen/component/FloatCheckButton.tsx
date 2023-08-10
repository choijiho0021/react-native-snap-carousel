import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import AppIcon from '@/components/AppIcon';
import {appStyles} from '@/constants/Styles';
import {sliderWidth} from '@/constants/SliderEntry.style';

const styles = StyleSheet.create({
  agreement: {
    marginBottom: 12,
    marginHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.white,
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    width: sliderWidth - 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.whiteFive,

    elevation: 12,
    shadowColor: 'rgb(166, 168, 172)',
    shadowRadius: 12,
    shadowOpacity: 0.9,
    shadowOffset: {
      height: 4,
      width: 0,
    },
  },
  agreementText: {
    marginRight: 40,
    ...appStyles.semiBold16Text,
    lineHeight: 20,
  },
});

type FloatCheckButtonPros = {
  onCheck: () => void;
  checkText: string;
  checked: boolean;
};

const FloatCheckButton: React.FC<FloatCheckButtonPros> = ({
  onCheck,
  checkText,
  checked,
}) => {
  return (
    <Pressable
      onPress={() => {
        onCheck();
      }}
      style={styles.agreement}>
      <AppIcon
        style={{marginRight: 20}}
        name="btnCheck2"
        checked={checked}
        size={22}
      />
      <AppText style={styles.agreementText}>{checkText}</AppText>
    </Pressable>
  );
};

export default memo(FloatCheckButton);
