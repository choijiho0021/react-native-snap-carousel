import React, {useCallback, useRef, useState} from 'react';
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
  console.log('@@@ invite promo', promo);
  return <AppWebView uri={promo.uri} />;
};

export default connect(({account, promotion}: RootState) => ({
  account,
  promotion,
}))(InvitePromoScreen);
