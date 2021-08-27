import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppSnackBar from '@/components/AppSnackBar';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {actions as cartActions} from '@/redux/modules/cart';
import {actions as infoActions} from '@/redux/modules/info';
import {actions as notiActions} from '@/redux/modules/noti';
import {
  actions as orderActions,
  OrderAction,
  OrderModelState,
} from '@/redux/modules/order';
import {actions as simActions} from '@/redux/modules/sim';
import i18n from '@/utils/i18n';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import UsageItem from './components/UsageItem';
import UsimCardInfo from './components/UsimCardInfo';

const styles = StyleSheet.create({
  container: {flex: 1},
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
  nolist: {
    marginVertical: '40%',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

type UsimScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Usim'>;
type UsimScreenRouteProp = RouteProp<HomeStackParamList, 'Usim'>;

type UsimScreenProps = {
  navigation: UsimScreenNavigationProp;
  route: UsimScreenRouteProp;

  lastTab: string[];
  pending: boolean;
  refreshing: boolean;

  account: AccountModelState;
  order: OrderModelState;

  action: {
    order: OrderAction;
    account: AccountAction;
  };
};
type UsimScreenState = {
  showSnackBar: boolean;
};

class UsimScreen extends Component<UsimScreenProps, UsimScreenState> {
  constructor(props: UsimScreenProps) {
    super(props);

    this.state = {
      showSnackBar: false,
      // isFocused: false,
      // afterLogin: false,
    };

    this.init = this.init.bind(this);
    this.renderSubs = this.renderSubs.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentDidMount() {
    const {iccid, token} = this.props.account;
    this.init({iccid, token});

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppText style={styles.title}>{i18n.t('usim')}</AppText>
      ),
    });
  }

  componentDidUpdate(prevProps: UsimScreenProps) {
    const {
      account: {iccid, token},
      lastTab,
      pending,
    } = this.props;
    const routeName = this.props.route.name;
    const isFocusedToUsimTab =
      (lastTab[0] || '').startsWith(routeName) &&
      lastTab[0] !== prevProps.lastTab[0];

    if (
      (isFocusedToUsimTab && !pending) ||
      (prevProps.account.iccid && iccid !== prevProps.account.iccid)
    ) {
      this.init({iccid, token});
    }
  }

  onRefresh() {
    const {
      account: {iccid, token},
    } = this.props;

    if (iccid) {
      this.props.action.order.getSubsWithToast({iccid, token}).then((_) => {
        this.props.action.account.getAccount({iccid, token});
      });
    }
  }

  empty = () => {
    return this.props.pending ? null : (
      <AppText style={styles.nolist}>{i18n.t('his:noUsage')}</AppText>
    );
  };

  init({iccid, token}: {iccid?: string; token?: string}) {
    if (iccid && token) {
      this.props.action.order.getSubsWithToast({iccid, token});
    }
  }

  renderSubs({item}: {item: RkbSubscription}) {
    const {subs} = this.props.order;
    return (
      <UsageItem
        key={item.key}
        item={item}
        showSnackbar={() => this.setState({showSnackBar: true})}
        onPress={() =>
          this.props.navigation.navigate('SubsDetail', {
            detail: subs.find((s) => s.key === item.key),
          })
        }
      />
    );
  }

  render() {
    const {subs} = this.props.order;
    const {
      account: {iccid, balance},
      refreshing,
    } = this.props;

    const {showSnackBar} = this.state;

    return (
      <View style={styles.container}>
        <View style={{backgroundColor: colors.whiteTwo}}>
          <FlatList
            data={subs}
            keyExtractor={(item) => item.key.toString()}
            ListHeaderComponent={
              <UsimCardInfo iccid={iccid} balance={balance} />
            }
            ListEmptyComponent={this.empty}
            renderItem={this.renderSubs}
            // onRefresh={this.onRefresh}
            // refreshing={refreshing}
            extraData={subs}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.onRefresh}
                colors={[colors.clearBlue]} //android 전용
                tintColor={colors.clearBlue} //ios 전용
              />
            }
          />
          <AppActivityIndicator visible={this.props.pending} />
        </View>
        <AppSnackBar
          visible={showSnackBar}
          onClose={() => this.setState({showSnackBar: false})}
          textMessage={i18n.t('usim:failSnackBar')}
        />
      </View>
    );
  }
}

export default connect(
  ({order, account, noti, info, status, sync, cart}: RootState) => ({
    order,
    account,
    auth: accountActions.auth(account),
    noti,
    info,
    pending:
      status.pending[accountActions.logInAndGetAccount.typePrefix] ||
      status.pending[accountActions.getAccount.typePrefix] ||
      status.pending[orderActions.getSubs.typePrefix] ||
      status.pending[orderActions.updateSubsStatus.typePrefix] ||
      false,
    sync,
    lastTab: cart.lastTab.toJS(),
    refreshing:
      status.pending[orderActions.getSubs.typePrefix] ||
      status.pending[accountActions.getAccount.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),

      sim: bindActionCreators(simActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      info: bindActionCreators(infoActions, dispatch),
    },
  }),
)(UsimScreen);
