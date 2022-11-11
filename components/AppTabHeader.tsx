import React, {memo} from 'react';
import {StyleSheet, View, ViewStyle, TextStyle} from 'react-native';
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

const {whiteTwo, clearBlue} = colors || {};

const TabHeader = ({
  index,
  routes,
  onIndexChange,
  style,
  titleStyle = styles.normal16WarmGrey,
  tintColor = clearBlue,
  disabledTintColor = whiteTwo,
}: {
  index: number;
  routes: {key: string; title: string}[];
  onIndexChange: (n: number) => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  tintColor?: string;
  disabledTintColor?: string;
}) => {
  return (
    <View style={[{paddingHorizontal: 20}, style || styles.whiteTwoBackground]}>
      <View style={styles.tabView}>
        {routes.map((elm, idx) => (
          <View key={elm.key} style={{flex: 1}}>
            <AppButton
              style={{flex: 1}}
              titleStyle={[titleStyle, idx === index ? {color: tintColor} : {}]}
              title={elm.title}
              onPress={() => onIndexChange(idx)}
            />
            <View
              style={{
                height: 2,
                backgroundColor: idx === index ? tintColor : disabledTintColor,
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};
export default memo(TabHeader);
