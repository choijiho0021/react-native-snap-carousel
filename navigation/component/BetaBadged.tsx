import AppIcon from '@/components/AppIcon';
import withBadge from '@/components/withBadge';
import {RootState} from '@/redux';

const BetaBadged = withBadge(
  ({product}: RootState) => ({
    betaLogo: product?.rule?.talk?.beta === '0',
  }),
  'betaLogo',
  {top: 0, right: -19, icon: true},
)(AppIcon);

export default BetaBadged;
