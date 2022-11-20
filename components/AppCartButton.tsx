import React, {memo} from 'react';
import {Pressable, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@/redux';
import AppIcon from './AppIcon';
import Badge from './Badge';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    borderRadius: 9,
    height: 18,
    minWidth: 0,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: colors.tomato,
  },
  badgeContainer: {
    position: 'absolute',
  },
  badgeText: {
    ...appStyles.normal12Text,
    paddingHorizontal: 0,
    color: colors.white,
    lineHeight: 14,
  },
});

type AppCartButtonProps = {
  cartItems?: number;
  iconName?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};
const AppCartButton: React.FC<AppCartButtonProps> = ({
  cartItems,
  iconName,
  style,
  onPress,
}) => {
  const hidden = !cartItems;

  return (
    <Pressable onPress={onPress} style={style}>
      <AppIcon name={iconName || 'btnCart'} style={styles.icon} />
      {!hidden && (
        <Badge
          badgeStyle={styles.badge}
          textStyle={styles.badgeText}
          value={cartItems}
          containerStyle={[styles.badgeContainer, {top: 2, right: 10}]}
        />
      )}
    </Pressable>
  );
};

export default connect(({cart}: RootState) => ({
  cartItems: (cart.orderItems || []).reduce(
    (acc, cur) => acc + (cur.qty || 0),
    0,
  ),
}))(memo(AppCartButton));
