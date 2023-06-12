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

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  headerTitle: {
    height: 56,
    marginRight: 8,
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

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <View style={styles.header}>
          <AppBackButton
            title={i18n.t('invite:friend')}
            style={styles.headerTitle}
          />
        </View>
      ),
    });
  }, [navigation]);

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
    () => `${promo.uri}/${account.loggedIn ? account.uuid : '0'}`,
    [account.loggedIn, account.uuid, promo.uri],
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
