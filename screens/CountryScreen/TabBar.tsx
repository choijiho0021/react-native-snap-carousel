import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppButton from '@/components/AppButton';

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    backgroundColor: colors.white,
    height: 50,
  },
  tabTitle: {
    ...appStyles.medium18,
    lineHeight: 26,
    color: colors.gray2,
  },
  selectedTabTitle: {
    ...appStyles.bold18Text,
    color: colors.black,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingBottom: 24,
    paddingTop: 16,
  },
  separator: {
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 2,
    backgroundColor: 'yello',
    width: 20,
  },
});

const TabBar = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.container}>
      <View key="left" style={styles.separator} />
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };

        return (
          <AppButton
            style={[
              styles.tab,
              {
                borderBottomColor: isFocused ? colors.black : colors.lightGrey,
                borderBottomWidth: 2,
              },
            ]}
            titleStyle={[
              styles.tabTitle,
              isFocused ? styles.selectedTabTitle : {},
            ]}
            title={label}
            onPress={onPress}
          />
        );
      })}
      <View key="right" style={styles.separator} />
    </View>
  );
};

export default memo(TabBar);
