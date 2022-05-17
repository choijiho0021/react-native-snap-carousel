import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {Component, memo} from 'react';
import {FlatList, Pressable, StyleSheet, View, Platform} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
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
  toggle?: boolean;
  route?: string;
  desc?: string;
};

const SettingsListItem0 = ({
  item,
  onPress,
}: {
  item: SettingsItem;
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
          ) : item.hasOwnProperty('toggle') ? (
            <AppSwitch
              value={item.toggle || false}
              onPress={onPress}
              waitFor={1000}
            />
          ) : (
            <AppIcon style={{alignSelf: 'center'}} name="iconArrowRight" />
          )
        }
      </View>
    </Pressable>
  );
};

const SettingsListItem = memo(SettingsListItem0);

type AccountSettingsScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Settings'
>;

type AccountSettingsScreenRouteProp = RouteProp<
  HomeStackParamList,
  'SimpleText'
>;

type AccountSettingsScreenProps = {
  navigation: AccountSettingsScreenNavigationProp;
  route: AccountSettingsScreenRouteProp;

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

type AccountSettingsScreenState = {
  data: SettingsItem[];
  isMounted: boolean;
  showSnackBar: boolean;
};

class AccountSettingsScreen extends Component<
  AccountSettingsScreenProps,
  AccountSettingsScreenState
> {
  constructor(props: AccountSettingsScreenProps) {
    super(props);

    this.state = {
      data: [
        {
          key: 'setting:changeMail',
          value: i18n.t('set:changeMail'),
          route: 'SimpleText',
        },
        {
          key: 'setting:resign',
          value: i18n.t('resign'),
          route: 'SimpleText',
        },
      ],
      isMounted: false,
      showSnackBar: false,
    };

    this.onPress = this.onPress.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount = async () => {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('set:accountSettings')} />,
    });

    const {loggedIn} = this.props;
    this.setMount();

    if (!loggedIn) {
      this.props.navigation.navigate('Auth');
    }
  };

  componentDidUpdate(prevProps: AccountSettingsScreenProps) {
    const {loggedIn, isPushNotiEnabled} = this.props;
    const statePushNoti = this.state.data.find(
      (item) => item.key === 'setting:pushnoti',
    )?.toggle;

    if (loggedIn !== prevProps.loggedIn) {
      this.setData('setting:logout', {
        value: i18n.t(loggedIn ? 'set:logout' : 'set:login'),
      });
    }

    if (
      isPushNotiEnabled !== prevProps.isPushNotiEnabled &&
      isPushNotiEnabled !== statePushNoti
    ) {
      this.setData('setting:pushnoti', {toggle: isPushNotiEnabled});
    }
  }

  componentWillUnmount() {
    this.setMount();
  }

  setMount() {
    this.setState((prevState) => ({
      isMounted: !prevState.isMounted,
    }));
  }

  setData(key: string, obj: Partial<SettingsItem>) {
    this.setState((prevState) => ({
      data: prevState.data.map((item) =>
        item.key === key
          ? {
              ...item,
              ...obj,
            }
          : item,
      ),
    }));
  }

  onPress = async (item: SettingsItem) => {
    const {key, value, route} = item;

    switch (key) {
      case 'setting:changeMail':
        this.props.navigation.navigate('ChangeEmail');
        break;
      case 'setting:resign':
        this.props.navigation.navigate('Resign');
        break;

      default:
        if (route) {
          Analytics.trackEvent('Page_View_Count', {page: `MyPage${key}`});
          this.props.navigation.navigate(route as keyof HomeStackParamList, {
            key,
            title: value,
          });
        }
    }
  };

  renderItem({item}: {item: SettingsItem}) {
    return <SettingsListItem item={item} onPress={() => this.onPress(item)} />;
  }

  render() {
    const {data, showSnackBar} = this.state;

    return (
      <View style={styles.container}>
        <FlatList data={data} renderItem={this.renderItem} />

        <AppSnackBar
          visible={showSnackBar!}
          onClose={() => this.setState({showSnackBar: false})}
          textMessage={i18n.t('settings:deniedPush')}
        />
        <AppActivityIndicator visible={this.props.pending} />
      </View>
    );
  }
}

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
)(AccountSettingsScreen);
