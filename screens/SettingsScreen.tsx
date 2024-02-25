import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  Platform,
  SafeAreaView,
} from 'react-native';
import Config from 'react-native-config';
import {openSettings} from 'react-native-permissions';
import VersionCheck from 'react-native-version-check';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ShortcutBadge from 'react-native-app-badge';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
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
import {retrieveData} from '@/utils/utils';
import {API} from '@/redux/api';

const {isProduction} = Env.get();
const PUSH_ENABLED = 0;
const styles = StyleSheet.create({
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
  onPress: () => Promise<void>;
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
  const [showNetStat, setShowNetStat] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [resetDisabled, setResetDisable] = useState(false);

  const data = useMemo(
    () => [
      {
        key: 'setting:accountSettings',
        value: i18n.t('set:accountSettings'),
      },
      {
        key: 'setting:pushnoti',
        value: i18n.t('set:pushnoti'),
      },
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
        )} ${VersionCheck.getCurrentVersion()}/${DeviceInfo.getBuildNumber()} ${
          !isProduction ? `(${Config.NODE_ENV})` : ''
        }`,
      },
      {
        key: 'setting:reSetting',
        value: i18n.t('set:reSetting'),
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
    if (showNetStat) {
      setTimeout(() => {
        setShowNetStat(false);
      }, 30000);
    }
  }, [showNetStat]);

  useEffect(() => {
    if (resetDisabled) {
      setTimeout(() => {
        setResetDisable(false);
      }, 30000);
    }
  }, [resetDisabled]);

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

        case 'setting:reSetting':
          if (!resetDisabled) {
            setResetDisable(true);
            NetInfo.fetch().then((state) => {
              setShowNetStat(true);
              setIsConnected(state?.isConnected || false);
            });

            await action.account.logInAndGetAccount({
              mobile: await retrieveData(API.User.KEY_MOBILE, true),
              pin: await retrieveData(API.User.KEY_PIN, true),
            });
          }

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
    [action.account, isPushNotiEnabled, loggedIn, navigation, resetDisabled],
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
    <SafeAreaView style={styles.container}>
      <View style={appStyles.header}>
        <AppBackButton title={i18n.t('settings')} />
      </View>
      <View style={styles.container}>
        {showNetStat && (
          <View
            style={{
              alignItems: 'center',
              backgroundColor: isConnected ? colors.clearBlue : colors.redError,
            }}>
            <AppText
              style={[
                appStyles.bold16Text,
                {color: colors.white, marginVertical: 5},
              ]}>
              {isConnected
                ? i18n.t('set:netstat:connected')
                : i18n.t('set:netstat:disconnected')}
            </AppText>
          </View>
        )}
      </View>
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
    </SafeAreaView>
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
