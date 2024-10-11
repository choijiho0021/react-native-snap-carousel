import React, {useState} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import AppSvgIcon from '@/components/AppSvgIcon';

const buttonSize = isDeviceSize('medium', true) ? 68 : 80;

const styles = StyleSheet.create({
  key: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  keyText: {
    fontSize: 30,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 36,
    letterSpacing: -0.6,
    textAlign: 'center',
    color: colors.black,
  },
});

const KeyPadButton = ({
  name,
  onPress,
  onLongPress,
}: {
  name: string;
  onPress?: (v: string) => void;
  onLongPress?: (v: string) => void;
}) => {
  const [prsDigit, setPrsDigit] = useState<string>();

  if (name === 'keyNation' || name === 'keyDel') {
    return (
      <AppSvgIcon
        key={name}
        name={name}
        style={styles.key}
        onPress={() => onPress?.(name)}
        onLongPress={() => onLongPress?.(name)}
      />
    );
  }

  return (
    <Pressable
      style={[
        styles.key,
        name === prsDigit && {
          backgroundColor: colors.backGrey,
        },
      ]}
      key={name}
      onPressIn={() => setPrsDigit(name)}
      onPressOut={() => setPrsDigit('')}
      onPress={() => onPress?.(name)}>
      <Text style={styles.keyText}>{name}</Text>
    </Pressable>
  );
};

export default KeyPadButton;
