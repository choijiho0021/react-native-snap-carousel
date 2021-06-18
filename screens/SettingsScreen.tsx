import firebase from '@react-native-firebase/app';
import Analytics from 'appcenter-analytics';
import React, {Component, memo} from 'react';
import {FlatList, StyleSheet, Text, Pressable, View} from 'react-native';
import VersionCheck from 'react-native-version-check';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppBackButton from '../components/AppBackButton';
import AppIcon from '../components/AppIcon';
import AppModal from '../components/AppModal';
import AppSwitch from '../components/AppSwitch';
import {colors} from '../constants/Colors';
import {appStyles} from '../constants/Styles';
import Env from '../environment';
import * as accountActions from '../redux/modules/account';
import * as cartActions from '../redux/modules/cart';
import * as orderActions from '../redux/modules/order';
import i18n from '../utils/i18n';

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

const button = (item, child, onPress) => {
  if (item.desc) {
    return <Text style={styles.itemDesc}>{item.desc}</Text>;
  }
  if (item.hasOwnProperty('toggle')) {
    return (
      <AppSwitch
        value={item.toggle}
        ref={child}
        onPress={onPress(item.key, item.value, item.route)}
        waitFor={1000}
      />
    );
  }
  return <AppIcon style={{alignSelf: 'center'}} name="iconArrowRight" />;
};

const SettingsListItem0 = ({item, onPress}) => {
  const child = React.createRef();

  return (
    <Pressable
      onPress={
        _.isFunction((child.current || {}).onPress)
          ? child.current.onPress
          : onPress(item.key, item.value, item.route)
      }>
      <View style={styles.row}>
        <Text style={styles.itemTitle}>{item.value}</Text>
        {button(item, child, onPress)}
      </View>
    </Pressable>
  );
};

const SettingsListItem = memo(SettingsListItem0);

class SettingsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      data: [
        {
          key: 'setting:pushnoti',
          value: i18n.t('set:pushnoti'),
          toggle: props.isPushNotiEnabled,
          route: undefined,
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
          route: undefined,
        },
        {
          key: 'setting:aboutus',
          value: i18n.t('set:aboutus'),
          route: 'SimpleText',
        },
        {
          key: 'setting:logout',
          value: i18n.t(props.loggedIn ? 'set:logout' : 'set:login'),
          route: undefined,
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
      headerLeft: () => (
        <AppBackButton
          navigation={this.props.navigation}
          title={i18n.t('settings')}
        />
      ),
    });

    const {loggedIn} = this.props;
    this.setMount();

    if (loggedIn) {
      this.props.action.cart.cartFetch();
    } else {
      this.props.navigation.navigate('Auth');
    }
  }

  componentDidUpdate(prevProps) {
    const {loggedIn, isPushNotiEnabled} = this.props;
    const statePushNoti = (
      this.state.data.find((item) => item.key === 'setting:pushnoti') || {}
    ).toggle;

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

  setData(key, obj) {
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

  onPress = (key, title, route) => () => {
    let isEnabled;
    switch (key) {
      case 'setting:logout':
        if (this.props.loggedIn) this.showModal(true);
        else this.props.navigation.navigate('Auth');

        break;

      case 'setting:pushnoti':
        isEnabled = (
          this.state.data.find((item) => item.key === 'setting:pushnoti') || {}
        ).toggle;
        this.setState((prevState) => ({
          data: prevState.data.map((item) =>
            item.key === 'setting:pushnoti'
              ? {
                  ...item,
                  toggle: !isEnabled,
                }
              : item,
          ),
        }));
        this.props.action.account
          .changePushNoti({isPushNotiEnabled: !isEnabled})
          .catch(() => {
            if (this.state.isMounted)
              this.setData('setting:pushnoti', {
                toggle: this.props.isPushNotiEnabled,
              });
          });

        break;

      default:
        if (route) {
          Analytics.trackEvent('Page_View_Count', {page: `MyPage${key}`});
          this.props.navigation.navigate(route, {key, title});
        }
    }
  };

  logout() {
    this.props.action.cart.reset();
    this.props.action.order.reset();
    this.props.action.account.logout();

    this.props.navigation.reset({index: 0, routes: [{name: 'HomeStack'}]});

    firebase.notifications().setBadge(0);

    this.showModal(false);
  }

  showModal(value) {
    this.setState({
      showModal: value,
    });
  }

  renderItem({item}) {
    return <SettingsListItem item={item} onPress={this.onPress} />;
  }

  render() {
    const {showModal} = this.state;

    return (
      <View style={styles.container}>
        <FlatList data={this.state.data} renderItem={this.renderItem} />

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
  ({account}: RootState) => ({
    loggedIn: account.loggedIn,
    isPushNotiEnabled: account.isPushNotiEnabled,
  }),
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
    },
  }),
)(SettingsScreen);
