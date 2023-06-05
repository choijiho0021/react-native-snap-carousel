import React, {memo, useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {colors} from '@/constants/Colors';
import AppSvgIcon from '@/components/AppSvgIcon';

const styles = StyleSheet.create({
  minusBtn: {
    borderRadius: 3,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
});

interface MinusButtonProps {
  onPress?: () => void;
}

const MinusButton: React.FC<MinusButtonProps> = ({onPress}) => {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      style={[
        styles.minusBtn,
        {backgroundColor: pressed ? colors.lightGrey : colors.backGrey},
      ]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}>
      <AppSvgIcon name="minus16" />
    </Pressable>
  );
};

export default memo(MinusButton);
