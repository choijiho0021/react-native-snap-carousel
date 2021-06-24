import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList, RefreshControl} from 'react-native';

import SnackBar from 'react-native-snackbar-component';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'underscore';
import i18n from '../../utils/i18n';
import {appStyles} from '../../constants/Styles';
import {colors} from '../../constants/Colors';
import * as simActions from '../../redux/modules/sim';
import {actions as accountActions} from '../../redux/modules/account';
import {actions as notiActions} from '../../redux/modules/noti';
import * as infoActions from '../../redux/modules/info';
import * as cartActions from '../../redux/modules/cart';
import * as orderActions from '../../redux/modules/order';
import AppActivityIndicator from '../../components/AppActivityIndicator';
import {timer} from '../../constants/Timer';
import CardInfo from './components/CardInfo';
import UsageItem from './components/UsageItem';
import {RootState} from '@/redux';

const styles = StyleSheet.create({
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

class UsimScreen extends Component {
  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <Text style={styles.title}>{i18n.t('usim')}</Text>,
    });

    this.state = {
      refreshing: false,
      showSnackBar: false,
      // isFocused: false,
      // afterLogin: false,
    };

    this.init = this.init.bind(this);
    this.renderSubs = this.renderSubs.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.info = this.info.bind(this);
    this.showSnackBar = this.showSnackBar.bind(this);
  }

  componentDidMount() {
    const {iccid, token} = this.props.account;
    this.init(iccid, {token});
  }

  componentDidUpdate(prevProps) {
    const {
      account: {iccid, token},
      lastTab,
      loginPending,
      updatePending,
    } = this.props;
    const routeName = this.props.route.name;
    const isFocusedToUsimTab =
      (lastTab[0] || '').startsWith(routeName) &&
      lastTab[0] !== prevProps.lastTab[0];
    const updateSubs =
      !updatePending && prevProps.updatePending !== updatePending;

    if (
      updateSubs ||
      (isFocusedToUsimTab && !loginPending && !updatePending) ||
      (prevProps.account.iccid && iccid !== prevProps.account.iccid)
    ) {
      this.init(iccid, {token});
    }
  }

  onRefresh() {
    const {
      account: {iccid},
      auth,
    } = this.props;

    if (iccid) {
      this.setState({
        refreshing: true,
      });

      this.props.action.order
        .getSubsWithToast(iccid, auth)
        .then((_) => {
          this.props.action.account.getAccount(iccid, auth);
        })
        .finally(() => {
          this.setState({
            refreshing: false,
          });
        });
    }
  }

  empty = () => {
    if (this.props.pending) return null;

    return <Text style={styles.nolist}>{i18n.t('his:noUsage')}</Text>;
  };

  onPressSubsDetail = (key) => () => {
    const {subs} = this.props.order;
    this.props.navigation.navigate('SubsDetail', {
      detail: subs.find((item) => item.key === key),
    });
  };

  init(iccid, auth) {
    if (iccid && auth) {
      this.props.action.order.getSubsWithToast(iccid, auth);
    }
  }

  showSnackBar() {
    this.setState({
      showSnackBar: true,
    });
  }

  info() {
    const {
      account: {iccid, balance, expDate},
      navigation,
    } = this.props;
    return (
      <CardInfo
        iccid={iccid}
        balance={balance}
        expDate={expDate}
        navigation={navigation}
      />
    );
  }

  renderSubs({item}) {
    return (
      <UsageItem
        key={item.key}
        item={item}
        auth={this.props.auth}
        showSnackBar={this.showSnackBar}
        onPress={this.onPressSubsDetail(item.key)}
      />
    );
  }

  render() {
    const {subs} = this.props.order;
    const {refreshing, showSnackBar} = this.state;

    return (
      <View style={styles.container}>
        <View style={{backgroundColor: colors.whiteTwo}}>
          <FlatList
            data={subs}
            keyExtractor={(item) => item.key.toString()}
            ListHeaderComponent={this.info}
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
          <AppActivityIndicator
            visible={this.props.pending || this.props.loginPending}
          />
        </View>
        <SnackBar
          visible={showSnackBar}
          backgroundColor={colors.clearBlue}
          messageColor={colors.white}
          position="bottom"
          top={0}
          containerStyle={{borderRadius: 3, height: 48, marginHorizontal: 0}}
          autoHidingTime={timer.snackBarHidingTime}
          onClose={() => this.setState({showSnackBar: false})}
          textMessage={i18n.t('usim:failSnackBar')}
        />
      </View>
    );
  }
}

export default connect(
  ({order, account, noti, info, pender, sync, cart}: RootState) => ({
    order,
    account,
    auth: accountActions.auth(account),
    noti,
    info,
    loginPending:
      pender.pending[accountActions.LOGIN] ||
      pender.pending[accountActions.GET_ACCOUNT] ||
      false,
    pending: pender.pending[orderActions.GET_SUBS] || false,
    updatePending: pender.pending[orderActions.UPDATE_SUBS_STATUS] || false,
    sync,
    lastTab: cart.lastTab.toJS(),
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
