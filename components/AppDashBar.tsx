import React, {memo, useCallback} from 'react';
import {Platform, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {colors} from '@/constants/Colors';

const styles = StyleSheet.create({
  dashContainer: {
    overflow: 'hidden',
  },
  dashFrame: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    margin: -1,
    height: 0,
    marginVertical: 23,
  },
  dash: {
    width: '100%',
  },
  headerNoti: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.lightGrey,
  },
});

interface AppDashBarProps {
  style?: StyleProp<ViewStyle>;
}

const AppDashBar: React.FC<AppDashBarProps> = ({style}) => {
  const renderDashedDiv = useCallback(() => {
    return (
      <View style={[styles.dashContainer, style]}>
        <View style={styles.dashFrame}>
          <View style={styles.dash} />
        </View>
      </View>
    );
  }, [style]);

  return (
    <View>
      {Platform.OS === 'ios' && renderDashedDiv()}
      <View
        style={[
          styles.headerNoti,
          Platform.OS === 'android' && {
            borderStyle: 'dashed',
            borderTopWidth: 1,
          },
        ]}
      />
    </View>
  );
};

export default memo(AppDashBar);
