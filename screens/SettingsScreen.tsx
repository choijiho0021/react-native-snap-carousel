import firebase from '@react-native-firebase/app';
import Analytics from 'appcenter-analytics';
import React, {Component, memo} from 'react';
import {FlatList, StyleSheet, Text, Pressable, View} from 'react-native';
import VersionCheck from 'react-native-version-check';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {RootState} from '@/redux';
import AppBackButton from '@/components/AppBackButton';
import AppIcon from '@/components/AppIcon';
import AppModal from '@/components/AppModal';
import AppSwitch from '@/components/AppSwitch';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {
  AccountAction,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as cartActions, CartAction, Store} from '@/redux/modules/cart';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '@/navigation/navigation';
import {RouteProp} from '@react-navigation/native';

const {label} = Env.get();

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
        <Text style={styles.itemTitle}>{item.value}</Text>
        {
          // eslint-disable-next-line no-nested-ternary
          item.desc ? (
            <Text style={styles.itemDesc}>{item.desc}</Text>
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

type SettingsScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Settings'
>;

type SettingsScreenRouteProp = RouteProp<HomeStackParamList, 'SimpleText'>;

type SettingsScreenProps = {
  navigation: SettingsScreenNavigationProp;
  route: SettingsScreenRouteProp;

  isPushNotiEnabled?: boolean;
  loggedIn?: boolean;
  store: Store;
  action: {
    cart: CartAction;
    order: OrderAction;
    account: AccountAction;
  };
};

type SettingsScreenState = {
  showModal: boolean;
  data: SettingsItem[];
  isMounted: boolean;
};

class SettingsScreen extends Component<
  SettingsScreenProps,
  SettingsScreenState
> {
  constructor(props: SettingsScreenProps) {
    super(props);

    this.state = {
      showModal: false,
      data: [
        {
          key: 'setting:pushnoti',
          value: i18n.t('set:pushnoti'),
          toggle: props.isPushNotiEnabled,
        },
        {
          key: 'setting:globalMarket',
          value: i18n.t('set:globalMarket'),
          toggle: props.store === 'global',
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
          )} ${VersionCheck.getCurrentVersion()}/${label.replace(/v/g, '')}`,
        },
        {
          key: 'setting:aboutus',
          value: i18n.t('set:aboutus'),
          route: 'SimpleText',
        },
        {
          key: 'setting:logout',
          value: i18n.t(props.loggedIn ? 'set:logout' : 'set:login'),
        },
      ],
      isMounted: false,
    };

    this.onPress = this.onPress.bind(this);
    this.showModal = this.showModal.bind(this);
    this.logout = this.logout.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('settings')} />,
    });

    const {loggedIn} = this.props;
    this.setMount();

    if (loggedIn) {
      this.props.action.cart.cartFetch();
    } else {
      this.props.navigation.navigate('Auth');
    }
  }

  componentDidUpdate(prevProps: SettingsScreenProps) {
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

  onPress = (item: SettingsItem) => {
    const {key, value, route} = item;
    let isEnabled: boolean;
    switch (key) {
      case 'setting:logout':
        if (this.props.loggedIn) this.showModal(true);
        else this.props.navigation.navigate('Auth');

        break;

      case 'setting:pushnoti':
        isEnabled = this.state.data.find((i) => i.key === key)?.toggle || false;

        this.setData(key, {toggle: !isEnabled});

        this.props.action.account
          .changePushNoti({isPushNotiEnabled: !isEnabled})
          .catch(() => {
            if (this.state.isMounted)
              this.setData(key, {
                toggle: this.props.isPushNotiEnabled,
              });
          });

        break;

      case 'setting:globalMarket':
        isEnabled = this.state.data.find((i) => i.key === key)?.toggle || false;

        this.setData(key, {toggle: !isEnabled});

        // flag == On 이면 market을 'global'로 바꾼다.
        this.props.action.cart.changeStore({
          store: !isEnabled ? 'global' : 'kr',
        });

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

  logout() {
    this.props.action.cart.reset();
    this.props.action.order.reset();
    this.props.action.account.logout();

    this.props.navigation.reset({index: 0, routes: [{name: 'HomeStack'}]});

    // bhtak
    // firebase.notifications().setBadge(0);

    this.showModal(false);
  }

  showModal(value: boolean) {
    this.setState({
      showModal: value,
    });
  }

  renderItem({item}: {item: SettingsItem}) {
    return <SettingsListItem item={item} onPress={() => this.onPress(item)} />;
  }

  render() {
    const {showModal, data} = this.state;

    return (
      <View style={styles.container}>
        <FlatList data={data} renderItem={this.renderItem} />

        <AppModal
          title={i18n.t('set:confirmLogout')}
          onOkClose={this.logout}
          onCancelClose={() => this.showModal(false)}
          visible={showModal}
        />
      </View>
    );
  }
}

export default connect(
  ({account, cart}: RootState) => ({
    loggedIn: account.loggedIn,
    isPushNotiEnabled: account.isPushNotiEnabled,
    store: cart.store,
  }),
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
    },
  }),
)(SettingsScreen);
