import React, {PropsWithChildren, memo, useState} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  spaceBetweenBox: {
    paddingTop: 24,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summary: {
    ...appStyles.robotoBold16Text,
    color: colors.clearBlue,
    marginRight: 8,
  },
});

type DropDownHeaderProps = {
  title: string;
  summary?: string;
  titleStyle?: StyleProp<ViewStyle>;
  style: StyleProp<ViewStyle>;
};

const DropDownHeader: React.FC<PropsWithChildren<DropDownHeaderProps>> = ({
  title,
  summary,
  children,
  style,
  titleStyle,
}) => {
  const [showContent, setShowContent] = useState(true);

  return (
    <View>
      <Pressable
        style={[
          styles.spaceBetweenBox,
          {borderBottomWidth: showContent ? 1 : 0},
          {paddingBottom: showContent ? 20 : 0},
          style,
        ]}
        onPress={() => setShowContent((prev) => !prev)}>
        <AppText style={[styles.boldTitle, titleStyle]}>{title}</AppText>
        <View style={styles.row}>
          {!showContent && <AppText style={styles.summary}>{summary}</AppText>}
          <AppButton
            style={{backgroundColor: colors.white}}
            iconName={showContent ? 'iconArrowUp' : 'iconArrowDown'}
            iconStyle={styles.dropDownIcon}
            onPress={() => setShowContent((prev) => !prev)}
          />
        </View>
      </Pressable>
      {showContent ? children : null}
    </View>
  );
};

export default memo(DropDownHeader);
