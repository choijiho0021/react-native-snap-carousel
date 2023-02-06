import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  spaceBetweenBox: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boldTitle: {
    ...appStyles.bold18Text,
    color: colors.black,
    lineHeight: 22,
    alignSelf: 'center',
  },
  dropDownIcon: {
    flexDirection: 'column',
    alignSelf: 'flex-end',
  },
  alignCenter: {
    alignSelf: 'center',
    marginRight: 15,
  },
  normal16BlueTxt: {
    ...appStyles.normal16Text,
    color: colors.clearBlue,
    lineHeight: 24,
    letterSpacing: 0.24,
  },
});

const DropDownHeader = ({
  showModal,
  onPress,
  title,
  alias,
}: {
  showModal: boolean;
  onPress: () => void;
  title: string;
  alias?: string;
}) => {
  return (
    <Pressable style={styles.spaceBetweenBox} onPress={onPress}>
      <AppText style={styles.boldTitle}>{title}</AppText>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        {!showModal && (
          <AppText style={[styles.alignCenter, styles.normal16BlueTxt]}>
            {alias}
          </AppText>
        )}
        <AppButton
          style={{backgroundColor: colors.white, height: 70}}
          iconName={showModal ? 'iconArrowUp' : 'iconArrowDown'}
          iconStyle={styles.dropDownIcon}
        />
      </View>
    </Pressable>
  );
};

export default DropDownHeader;
