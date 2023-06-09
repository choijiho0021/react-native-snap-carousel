import React, {useCallback, useMemo, useState} from 'react';
import {connect} from 'react-redux';
import {SafeAreaView} from 'react-native';
import {RootState} from '@/redux';
import AppWebView from '@/components/AppWebView';
import {AccountModelState} from '@/redux/modules/account';
import {PromotionModelState} from '@/redux/modules/promotion';
import AppSnackBar from '@/components/AppSnackBar';
import i18n from '@/utils/i18n';
import {sendLink} from './InviteScreen';

type InvitePromoScreenProps = {
  account: AccountModelState;
  promotion: PromotionModelState;
};

const InvitePromoScreen: React.FC<InvitePromoScreenProps> = ({
  promotion,
  promotion: {
    stat: {promo},
  },
  account,
}) => {
  const [showSnackBar, setShowSnackbar] = useState(false);

  const callback = useCallback(
    (cmd: string) => {
      switch (cmd) {
        case 'send_link':
          sendLink('share', promotion, account, setShowSnackbar);
          break;
        case 'copy_link':
          sendLink('copy', promotion, account, setShowSnackbar);
          break;
        default:
          break;
      }
    },
    [account, promotion],
  );

  const uri = useMemo(
    () => `${promo.uri}/${account.loggedIn ? account.uid : '0'}`,
    [account.loggedIn, account.uid, promo.uri],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <AppWebView uri={uri} callback={({cmd}) => callback(cmd)} />
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackbar(false)}
        textMessage={i18n.t('inv:copyMsg')}
      />
    </SafeAreaView>
  );
};

export default connect(({account, promotion}: RootState) => ({
  account,
  promotion,
}))(InvitePromoScreen);
