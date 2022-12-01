import React, {Component, memo} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import i18n from '@/utils/i18n';
import {utils} from '@/utils/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  box: {
    width: '100%',
    height: 200,
    backgroundColor: 'skyblue',
  },
  date: {
    ...appStyles.itemValue,
    width: '60%',
  },
  amount: {
    ...appStyles.itemValue,
    width: '40%',
    textAlign: 'right',
  },
  prodName: {
    ...appStyles.itemValue,
    width: '100%',
    textAlign: 'right',
  },
});

const toPurchaseCnt = (value) => {
  if (_.isArray(value) && value.length > 0) {
    return (
      value[0].name +
      (value.length > 1
        ? i18n.t('his:etcCnt').replace('%%', value.length - 1)
        : '')
    );
  }
  return '';
};

const PymHistoryListItem0 = ({item, onPressItem}) => {
  const dt = utils.toDateString(item.created, 'YYYY-MM-DD');
  const amt = `${utils.numberToCommaString(
    item.amount + item.directPayment,
  )} ${i18n.t('won')}`;
  const prod =
    item.paymentType === 'R'
      ? i18n.t('recharge')
      : toPurchaseCnt(item.purchase);

  return (
    <View style={styles.container} key={item.key}>
      <TouchableOpacity onPress={onPressItem(item.key)}>
        <View style={styles.itemRow} key="date">
          <AppText style={styles.date} key="date">
            {dt}
          </AppText>
          <AppText style={styles.amount} key="detail">
            {i18n.t('his:detail')}
          </AppText>
        </View>
        <View style={styles.itemRow} key="payment">
          <AppText style={styles.date} key="prod">
            {prod}
          </AppText>
          <AppText style={styles.amount} key="amount">
            {amt}
          </AppText>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const PymHistoryListItem = memo(PymHistoryListItem0);

interface PymHistoryScreenProps {
  account: AccountModelState;
  navigation: any;
}

interface PymHistoryScreenState {
  querying: boolean;
  next?: string;
  data: any[];
}
class PymHistoryScreen extends Component<
  PymHistoryScreenProps,
  PymHistoryScreenState
> {
  LIST_SIZE = 12;

  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      title: i18n.t('pym'),
    });

    this.state = {
      data: [],
      querying: false,
    };

    this.getHistory = this.getHistory.bind(this);
    this.getNext = this.getNext.bind(this);
    this.onPressItem = this.onPressItem.bind(this);
  }

  componentDidMount() {
    this.getHistory();
  }

  getHistory(link?: string) {
    const {userId, auth} = this.props.account;
    if (_.isEmpty(auth)) return;

    this.setState({
      querying: true,
    });

    API.Payment.getHistory(userId, auth, link)
      .then((resp) => {
        const {data} = this.state;
        if (resp.result === 0) {
          const next = _.isEmpty(resp.links.next)
            ? undefined
            : resp.links.next.href;
          const list = resp.objects
            .filter(
              (item) => data.findIndex((org) => org.uuid == item.uuid) < 0,
            )
            .map((item) => ({
              ...item,
              key: item.uuid,
            }));

          this.setState({
            querying: false,
            data: data.concat(list),
            next,
          });

          if (data.length + list.length < this.LIST_SIZE && next) {
            // get more history
            this.getHistory(next);
          }
        } else {
          console.log('Failed to get payment history', resp);
          throw new Error('Failed to get payment history');
        }
      })
      .catch((err) => {
        this.setState({
          querying: false,
        });

        AppAlert.error(err.message);
      });
  }

  getNext() {
    const {next} = this.state;
    if (next) this.getHistory(next);
  }

  onPressItem = (key) => () => {
    const obj = this.state.data.find((item) => item.key === key);
    if (obj) {
      this.props.navigation.navigate('PurchaseDetail', {detail: obj});
    }
  };

  renderItem = ({item}) => {
    return <PymHistoryListItem item={item} onPress={this.onPressItem} />;
  };

  render() {
    return (
      <View style={appStyles.container}>
        <AppActivityIndicator visible={this.state.querying} />
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          onEndReachedThreshold={0.5}
          onEndReached={this.getNext}
        />
      </View>
    );
  }
}

export default connect(
  ({account}: RootState) => ({account}),
  (dispatch) => ({
    AccountActions: bindActionCreators(accountActions, dispatch),
  }),
)(PymHistoryScreen);
