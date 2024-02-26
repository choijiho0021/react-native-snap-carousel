import React, {PropsWithChildren, memo, useState} from 'react';
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
});

type DropDownHeaderProps = {
  title: string;
};

const DropDownHeader: React.FC<PropsWithChildren<DropDownHeaderProps>> = ({
  title,
  children,
}) => {
  const [showContent, setShowContent] = useState(false);
  return (
    <View>
      <Pressable
        style={[
          styles.spaceBetweenBox,
          {borderBottomWidth: showContent ? 1 : 0},
        ]}
        onPress={() => setShowContent((prev) => !prev)}>
        <AppText style={styles.boldTitle}>{title}</AppText>
        <AppButton
          style={{backgroundColor: colors.white, height: 68}}
          iconName={showContent ? 'iconArrowUp' : 'iconArrowDown'}
          iconStyle={styles.dropDownIcon}
        />
      </Pressable>
      {showContent ? children : null}
    </View>
  );
};

export default memo(DropDownHeader);
