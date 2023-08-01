import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import AppIcon from '@/components/AppIcon';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  checkFrame: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 3,
    backgroundColor: colors.white,
    shadowColor: 'rgba(166, 168, 172, 0.44)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.whiteFive,
  },

  checkText: {
    ...appStyles.semiBold16Text,
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
      style={styles.checkFrame}>
      <View style={{flexDirection: 'row', alignItems: 'center', width: '90%'}}>
        <AppIcon
          style={{marginRight: 20}}
          name="btnCheck2"
          checked={checked}
          size={22}
        />
        <AppText style={styles.checkText}>{checkText}</AppText>
      </View>
    </Pressable>
  );
};

export default memo(FloatCheckButton);
