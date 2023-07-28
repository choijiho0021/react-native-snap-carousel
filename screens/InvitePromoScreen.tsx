import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {connect} from 'react-redux';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootState} from '@/redux';
import AppWebView from '@/components/AppWebView';
import {HomeStackParamList} from '@/navigation/navigation';
import {AccountModelState} from '@/redux/modules/account';
import {PromotionModelState} from '@/redux/modules/promotion';
import AppSnackBar from '@/components/AppSnackBar';
import i18n from '@/utils/i18n';
import {sendLink} from './InviteScreen';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppButton from '@/components/AppButton';
import ScreenHeader from '@/components/ScreenHeader';

const styles = StyleSheet.create({
  button: {
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: '#ffffff',
  },
});

type InvitePromoScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'InvitePromo'
>;

type InvitePromoScreenProps = {
  navigation: InvitePromoScreenNavigationProp;
  account: AccountModelState;
  promotion: PromotionModelState;
};

const InvitePromoScreen: React.FC<InvitePromoScreenProps> = ({
  navigation,
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
    () => `${promo.uri}/${account.loggedIn ? account.userId : '0'}`,
    [account, promo.uri],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader title={i18n.t('inv:title')} />
      <AppWebView uri={uri} callback={({cmd}) => callback(cmd)} />

      {!account.loggedIn && (
        <AppButton
          style={styles.button}
          type="primary"
          title={i18n.t('promo:login')}
          onPress={() =>
            navigation.navigate('Auth', {
              screen: 'RegisterMobile',
              params: {
                screen: 'Invite',
              },
            })
          }
        />
      )}
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
