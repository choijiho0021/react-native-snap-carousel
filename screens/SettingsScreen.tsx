import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, View, Platform} from 'react-native';
import Config from 'react-native-config';
import {openSettings} from 'react-native-permissions';
import VersionCheck from 'react-native-version-check';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ShortcutBadge from 'react-native-app-badge';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import AppIcon from '@/components/AppIcon';
import AppModal from '@/components/AppModal';
import AppSnackBar from '@/components/AppSnackBar';
import AppSwitch from '@/components/AppSwitch';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {
  AccountAction,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as cartActions, CartAction} from '@/redux/modules/cart';
import {actions as notiActions, NotiAction} from '@/redux/modules/noti';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import i18n from '@/utils/i18n';

const {label = '', isProduction} = Env.get();
const PUSH_ENABLED = 0;
const styles = StyleSheet.create({
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  row: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomColor: colors.whiteTwo,
    borderBottomWidth: 1,
  },
  itemTitle: {
    ...appStyles.normal16Text,
    color: colors.black,
  },
  itemDesc: {
    ...appStyles.normal12Text,
    color: colors.warmGrey,
  },
  switch: {
    transform: [{scaleX: 1}, {scaleY: 0.7}],
  },
});

type SettingsItem = {
  key: string;
  value: string;
  route?: string;
  desc?: string;
};

const SettingsListItem0 = ({
  item,
  onPress,
  toggle,
}: {
  item: SettingsItem;
  toggle?: boolean;
  onPress: () => void;
}) => {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.row}>
        <AppText style={styles.itemTitle}>{item.value}</AppText>
        {
          // eslint-disable-next-line no-nested-ternary
          item.desc ? (
            <AppText style={styles.itemDesc}>{item.desc}</AppText>
          ) : toggle !== undefined ? (
            <AppSwitch value={toggle} onPress={onPress} waitFor={1000} />
          ) : (
            <AppIcon style={{alignSelf: 'center'}} name="iconArrowRight" />
          )
        }
      </View>
    </Pressable>
  );
};

const SettingsListItem = memo(SettingsListItem0);

type SettingsScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Settings'
>;

type SettingsScreenProps = {
  navigation: SettingsScreenNavigationProp;

  isPushNotiEnabled?: boolean;
  loggedIn?: boolean;
  pending: boolean;
  action: {
    cart: CartAction;
    order: OrderAction;
    account: AccountAction;
    noti: NotiAction;
  };
};

const SettingsScreen: React.FC<SettingsScreenProps> = (props) => {
  const {navigation, isPushNotiEnabled, loggedIn, pending, action} = props;
  const [showModal, setShowModal] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const data = useMemo(
    () => [
      {
        key: 'setting:accountSettings',
        value: i18n.t('set:accountSettings'),
        route: 'SimpleText',
      },
      {
        key: 'setting:pushnoti',
        value: i18n.t('set:pushnoti'),
      },
      // { "key": "info", "value": i18n.t('set:info'), route: 'MySim'},
      {
        key: 'setting:contract',
        value: i18n.t('set:contract'),
        route: 'SimpleText',
      },
      {
        key: 'setting:privacy',
        value: i18n.t('set:privacy'),
        route: 'SimpleText',
      },
      {
        key: 'setting:version',
        value: i18n.t('set:version'),
        desc: `${i18n.t(
          'now',
        )} ${VersionCheck.getCurrentVersion()}/${label.replace(/v/g, '')} ${
          !isProduction ? `(${Config.NODE_ENV})` : ''
        }`,
      },
      {
        key: 'setting:aboutus',
        value: i18n.t('set:aboutus'),
        route: 'SimpleText',
      },
      {
        key: 'setting:logout',
        value: i18n.t(loggedIn ? 'set:logout' : 'set:login'),
      },
    ],
    [loggedIn],
  );

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('settings')} />,
    });
  }, [navigation]);

  useEffect(() => {
    async function perm() {
      const pushPermission = await messaging().requestPermission();
      if (pushPermission === PUSH_ENABLED) {
        setShowSnackBar(true);
        action.account.changePushNoti({
          isPushNotiEnabled: false,
        });
      }
    }

    if (loggedIn) {
      action.cart.cartFetch();
      perm();
    } else {
      navigation.navigate('Auth');
    }
  }, [action.account, action.cart, loggedIn, navigation]);

  const onPress = useCallback(
    async (item: SettingsItem) => {
      const {key, value, route} = item;
      let pushPermission: number;

      switch (key) {
        case 'setting:accountSettings':
          navigation.navigate(loggedIn ? 'AccountSettings' : 'Auth');
          break;

        case 'setting:logout':
          if (loggedIn) setShowModal(true);
          else navigation.navigate('Auth');
          break;

        case 'setting:pushnoti':
          pushPermission = await messaging().requestPermission();
          if (pushPermission === PUSH_ENABLED && !isPushNotiEnabled) {
            AppAlert.alert(
              i18n.t('settings:reqPushSet'),
              '',
              i18n.t('settings:openSettings'),
              openSettings,
            );
          }

          console.log('@@@ push noti', isPushNotiEnabled);
          action.account.changePushNoti({
            isPushNotiEnabled: !isPushNotiEnabled,
          });

          break;

        default:
          if (route) {
            Analytics.trackEvent('Page_View_Count', {page: `MyPage${key}`});
            navigation.navigate(route as keyof HomeStackParamList, {
              key,
              title: value,
            });
          }
      }
    },
    [action.account, isPushNotiEnabled, loggedIn, navigation],
  );

  const logout = useCallback(() => {
    Promise.all([
      action.cart.reset(),
      action.order.reset(),
      action.noti.init({mobile: undefined}),
      action.account.logout(),
    ]).then(async () => {
      navigation.navigate('HomeStack', {screen: 'Home'});
      // TODO : check social login
      if (Platform.OS === 'ios')
        PushNotificationIOS.setApplicationIconBadgeNumber(0);
      else {
        ShortcutBadge.setCount(0);
        // const isSignedin = await GoogleSignin.isSignedIn();
        // if (isSignedin) {
        //   try {
        //     GoogleSignin.signOut();
        //   } catch (e) {
        //     console.error(e);
        //   }
        // }
      }

      setShowModal(false);
    });
  }, [action.account, action.cart, action.noti, action.order, navigation]);

  const renderItem = useCallback(
    ({item}: {item: SettingsItem}) => (
      <SettingsListItem
        item={item}
        onPress={() => onPress(item)}
        toggle={item.key === 'setting:pushnoti' ? isPushNotiEnabled : undefined}
      />
    ),
    [isPushNotiEnabled, onPress],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        extraData={isPushNotiEnabled}
      />

      <AppModal
        title={i18n.t('set:confirmLogout')}
        onOkClose={logout}
        onCancelClose={() => setShowModal(false)}
        visible={showModal}
      />

      <AppSnackBar
        visible={showSnackBar!}
        onClose={() => setShowSnackBar(false)}
        textMessage={i18n.t('settings:deniedPush')}
      />
      <AppActivityIndicator visible={pending} />
    </View>
  );
};

export default connect(
  ({account, status}: RootState) => ({
    loggedIn: account.loggedIn,
    isPushNotiEnabled: account.isPushNotiEnabled,
    pending: status.pending[accountActions.logout.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
    },
  }),
)(SettingsScreen);
