import React, {Component} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
} from 'react-native';
import {connect} from 'react-redux'

import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import * as simActions from '../redux/modules/sim'
import { bindActionCreators } from 'redux'
import AppBackButton from '../components/AppBackButton';
import { colors } from '../constants/Colors';
import _ from 'underscore'
import LabelText from '../components/LabelText';
import AppActivityIndicator from '../components/AppActivityIndicator';

class MySimScreen extends Component {
  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({navigation, title:i18n.t('acc:mysim')}),
    tabBarVisible: false,
  })

  constructor(props) {
    super(props)

    this.state = {
      data: [
//        {key: "accNo", value: props.account.iccid},
        {key: "name"},
        {key: "mccmnc"},
        {key: "operator"},
      ],
    }
  }

  componentDidMount() {
    if ( _.isEmpty(this.props.sim.simPartner)) {
      this.props.action.sim.updateSimPartner( this.props.account.simPartnerId)
    }
  }

  _renderItem = ({item}) => {
    const { simPartner = {} } = this.props.sim
    return (
      <LabelText style={styles.row}
        label={i18n.t('mysim:' + item.key)} labelStyle={styles.title}
        value={simPartner[item.key]} valueStyle={styles.value}
        />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <AppActivityIndicator visible={this.props.pending} />
        <FlatList style={{marginTop:30}} data={this.state.data} renderItem={this._renderItem}
          extraData={this.props.sim.simPartner} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'stretch'
  },
  row: {
    height: 40,
    marginHorizontal: 20,
  },
  title : {
    ... appStyles.normal14Text,
    color: colors.warmGrey
  },
  value : {
    ... appStyles.normal16Text,
    color: colors.black
  },
});

const mapStateToProps = (state) => ({
  sim: state.sim.toJS(),
  account: state.account.toJS(),
  pending: state.pender.pending[simActions.UPDATE_SIM_PARTNER]
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action: {
      sim: bindActionCreators(simActions, dispatch),
    }
  })
)(MySimScreen)