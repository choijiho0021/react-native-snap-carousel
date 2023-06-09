import React, {useCallback, useMemo} from 'react';
import {connect} from 'react-redux';
import {RootState} from '@/redux';
import AppWebView from '@/components/AppWebView';
import {AccountModelState} from '@/redux/modules/account';
import {PromotionModelState} from '@/redux/modules/promotion';

type InvitePromoScreenProps = {
  account: AccountModelState;
  promotion: PromotionModelState;
};

const InvitePromoScreen: React.FC<InvitePromoScreenProps> = ({
  promotion: {
    stat: {promo},
  },
  account,
}) => {
  const callback = useCallback((cmd: string) => {
    console.log('@@@ callback', cmd);
  }, []);

  const uri = useMemo(
    () => `${promo.uri}/${account.loggedIn ? account.uid : '0'}`,
    [account.loggedIn, account.uid, promo.uri],
  );

  return <AppWebView uri={uri} callback={({cmd}) => callback(cmd)} />;
};

export default connect(({account, promotion}: RootState) => ({
  account,
  promotion,
}))(InvitePromoScreen);
