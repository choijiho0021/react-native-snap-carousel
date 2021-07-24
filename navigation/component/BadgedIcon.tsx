import AppIcon from '@/components/AppIcon';
import withBadge from '@/components/withBadge';
import {RootState} from '@/redux';

const BadgedIcon = withBadge(
  ({cart}: RootState) => ({
    cartItems: (cart.orderItems || []).reduce((acc, cur) => acc + cur.qty, 0),
  }),
  'cartItems',
)(AppIcon);

export default BadgedIcon;
