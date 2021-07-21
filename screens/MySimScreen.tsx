import React, {Component, memo} from 'react';
import {StyleSheet, FlatList, Platform, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import {actions as simActions} from '@/redux/modules/sim';
import {bindActionCreators} from 'redux';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import _ from 'underscore';
import LabelText from '@/components/LabelText';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppButton from '@/components/AppButton';
import {RootState} from '@/redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  row: {
    height: 40,
    marginHorizontal: 20,
  },
  title: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
  },
  value: {
    ...appStyles.normal16Text,
    color: colors.black,
  },
  button: {
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: '#ffffff',
  },
});

const MySimListItem0 = ({item, value}) => {
  return (
    <LabelText
      style={styles.row}
      label={i18n.t(`mysim:${item.key}`)}
      labelStyle={styles.title}
      value={value}
      valueStyle={styles.value}
    />
  );
};
const MySimListItem = memo(MySimListItem0);

class MySimScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        //        {key: "accNo", value: props.account.iccid},
        {key: 'name'},
        {key: 'mccmnc'},
        {key: 'operator'},
      ],
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('acc:mysim')} />,
    });

    if (_.isEmpty(this.props.sim.simPartner)) {
      this.props.action.sim.updateSimPartner(this.props.account.simPartnerId);
    }
  }

  _renderItem = ({item}) => {
    const {simPartner = {}} = this.props.sim;
    return <MySimListItem item={item} value={simPartner[item.key]} />;
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <AppActivityIndicator visible={this.props.pending} />
        <FlatList
          style={{marginTop: 30}}
          data={this.state.data}
          renderItem={this._renderItem}
          extraData={this.props.sim.simPartner}
        />
        {Platform.OS === 'ios' ? (
          <AppButton
            style={styles.button}
            title={i18n.t('ok')}
            onPress={() => this.props.navigation.goBack()}
          />
        ) : null}
      </SafeAreaView>
    );
  }
}

export default connect(
  ({sim, account, status}: RootState) => ({
    sim,
    account,
    pending: status.pending[simActions.updateSimPartner.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      sim: bindActionCreators(simActions, dispatch),
    },
  }),
)(MySimScreen);
