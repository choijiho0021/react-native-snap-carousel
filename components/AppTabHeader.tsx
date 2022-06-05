import React, {memo} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppButton from './AppButton';

const styles = StyleSheet.create({
  whiteTwoBackground: {
    backgroundColor: colors.whiteTwo,
    height: 60,
  },
  normal16WarmGrey: {
    ...appStyles.normal16Text,
    color: colors.warmGrey,
  },
  boldClearBlue: {
    color: colors.clearBlue,
    fontWeight: 'bold',
  },
  tabView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginHorizontal: 20,
    flex: 1,
  },
});

const TabHeader = ({
  index,
  routes,
  onIndexChange,
  style,
}: {
  index: number;
  routes: {key: string; title: string}[];
  onIndexChange: (n: number) => void;
  style?: ViewStyle;
}) => {
  return (
    <View style={style || styles.whiteTwoBackground}>
      <View style={styles.tabView}>
        {routes.map((elm, idx) => (
          <AppButton
            key={elm.key}
            style={{flex: 1}}
            titleStyle={[
              styles.normal16WarmGrey,
              idx === index ? styles.boldClearBlue : {},
            ]}
            title={elm.title}
            // title={i18n.t(`prodDetail:${elm}`)}
            onPress={() => onIndexChange(idx)}
          />
        ))}
      </View>
    </View>
  );
};
export default memo(TabHeader);
