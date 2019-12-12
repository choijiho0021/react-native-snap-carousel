import withBadge from './withBadge';
import AppButton from './AppButton';

const AppCartButton = withBadge(({cartItems}) => cartItems, {badgeStyle:{right:-5,top:5}}, 
  (state) => ({cartItems: (state.cart.get('orderItems') || []).reduce((acc,cur) => acc + cur.qty, 0)}))(AppButton)

export default AppCartButton
