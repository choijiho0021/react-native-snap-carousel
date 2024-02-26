import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppSvgIcon from '../AppSvgIcon';

const styles = StyleSheet.create({
  oldEmail: {
    flexDirection: 'row',
    marginTop: 4,
    borderRadius: 3,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  oldEmailText: {
    ...appStyles.medium18,
    lineHeight: 22,
    color: colors.clearBlue,
    flex: 1,
    marginRight: 10,
    textAlign: 'left',
  },
  changeText: {
    ...appStyles.bold14Text,
    marginRight: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type ConfirmEmailProps = {
  title?: string;
  buttonTitle?: string;
  onPress?: () => void;
};

const ConfirmButton: React.FC<ConfirmEmailProps> = ({
  title,
  buttonTitle,
  onPress,
}) => {
  return (
    <Pressable style={styles.oldEmail} onPress={onPress}>
      <AppText style={styles.oldEmailText}>{title}</AppText>
      <View style={styles.row}>
        <AppText style={styles.changeText}>{buttonTitle}</AppText>
        <AppSvgIcon name="rightArrow10" />
      </View>
    </Pressable>
  );
};

export default memo(ConfirmButton);
