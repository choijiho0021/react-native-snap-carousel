import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as accountActions from '../redux/modules/account'
import * as orderActions from '../redux/modules/order'
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import utils from '../utils/utils';
import AppBackButton from '../components/AppBackButton';
import { colors } from '../constants/Colors';
import LabelText from '../components/LabelText';
import AppButton from '../components/AppButton';
import { SafeAreaView } from 'react-navigation';
class UsageDetailScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('his:detail')} />
  })

  constructor(props) {
    super(props)
    this.state = {
      activating : false,
      activatable : false
    }

    this._onSubmit = this._onSubmit.bind(this)
  }

  componentDidMount() {
    const detail = this.props.navigation.getParam('detail')
    const country = detail.country
    const uuid = detail.uuid
    const { usage } = this.props.order

    let activatable = false
    let activating = false

    usage.map(elm => { 
      if(elm.country == country && elm.statusCd == 'A' && elm.uuid == uuid) {
        activating = true
      }
      else if(elm.country == country && elm.statusCd == 'A') {
        activatable = true
      }
    })
    this.setState({activating, activatable, ... detail})
  }

  _onSubmit() {
    const { auth } = this.props
    const { uuid, activating, activatable } = this.state
    const status = activatable ? 'A' : 'R'
    
    //update status as Reserved
    // todo : Active로 변경하는 APi가 필요함 (현재 상태값만 A로변경 적용)
    if(!activating){
      this.props.action.order.updateUsageStatus( uuid, status, auth)
    }
    this.props.navigation.goBack()
  }

  render() {
    const {prodName, activationDate, endDate, expireDate, purchaseDate, activating, activatable} = this.state || {}
    const buttonTitle = activating ? i18n.t('ok') : activatable ? i18n.t('reg:RegisterToUse') : i18n.t('reg:ReserveToUse')

    return (
      <SafeAreaView style={styles.container} forceInset={{ top: 'never', bottom:"always"}}>
        <View style={styles.container}>
          <Text style={styles.notice}>{i18n.t('his:timeStd')}</Text>
          <Text style={styles.title}>{prodName}</Text>
          <View style={styles.divider} />
          <LabelText style={styles.info} valueStyle={{color:colors.black}}
            label={i18n.t('his:purchaseDate')} value={utils.toDateString(purchaseDate)} />
          <LabelText style={styles.info} valueStyle={{color:colors.black}}
            label={i18n.t('his:activationDate')} value={activationDate ? utils.toDateString(activationDate) : i18n.t('his:inactive')} />
          <LabelText style={styles.info} valueStyle={{color:colors.black}}
            label={i18n.t('his:termDate')} value={endDate ? utils.toDateString(endDate) : i18n.t('his:inactive')} />
          <LabelText style={styles.info} valueStyle={{color:colors.black}}
            label={i18n.t('his:expireDate')} value={utils.toDateString(expireDate, 'LL')} />
        </View>
        <AppButton style={appStyles.confirm} 
          title={buttonTitle} titleStyle={appStyles.confirmText}
          onPress={this._onSubmit}/>
      </SafeAreaView>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  notice: {
    ... appStyles.normal14Text,
    marginTop: 40,
    marginLeft: 20,
    color: colors.warmGrey
  },
  title: {
    ... appStyles.normal20Text,
    marginTop: 10,
    marginHorizontal: 20
  },
  divider: {
    marginTop: 40,
    marginBottom: 40,
    height: 10,
    backgroundColor: colors.whiteTwo
  },
  value: {
    ... appStyles.normal16Text,
    color: colors.black,
  },
  label: {
    ... appStyles.normal14Text,
    color: colors.warmGrey
  },
  info: {
    height: 36,
    marginHorizontal: 20
  }
});

const mapStateToProps = (state) => ({
  account : state.account.toJS(),
  auth: accountActions.auth(state.account),
  order: state.order.toJS()
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      account: bindActionCreators(accountActions, dispatch),
      order: bindActionCreators(orderActions, dispatch)
    }
  })
)(UsageDetailScreen)