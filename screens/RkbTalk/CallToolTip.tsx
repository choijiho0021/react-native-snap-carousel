import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: 20,
    marginTop: 8,
  },
  triangle: {
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  textFrame: {
    borderRadius: 3,
    flexDirection: 'row',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.black92,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.white,
  },
});

const CallToolTip = ({
  text,
  icon,
  arrowPos,
}: {
  text: string;
  icon?: string;
  arrowPos?: string;
}) => {
  const position = useMemo(() => {
    switch (arrowPos) {
      case 'start':
        return 'flex-start';
      case 'center':
        return 'center';
      default:
        return 'flex-end';
    }
  }, [arrowPos]);

  return (
    <View style={{...styles.container, alignItems: position}}>
      <View
        style={{
          ...styles.triangle,
          marginLeft: position === 'flex-start' ? 20 : 0,
          marginRight: position === 'flex-end' ? 20 : 0,
        }}
      />
      <View style={styles.textFrame}>
        {icon && <AppSvgIcon key={icon} name={icon} style={{marginRight: 6}} />}
        <AppText style={styles.text}>{text}</AppText>
      </View>
    </View>
  );
};
export default memo(CallToolTip);
