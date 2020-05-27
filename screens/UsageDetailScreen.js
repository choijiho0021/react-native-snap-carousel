import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as productActions from '../redux/modules/product'
import * as accountActions from '../redux/modules/account'
import * as orderActions from '../redux/modules/order'
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import _ from 'underscore'
import utils from '../utils/utils';
import AppBackButton from '../components/AppBackButton';
import { colors } from '../constants/Colors';
import LabelText from '../components/LabelText';
import AppButton from '../components/AppButton';
import AppModal from '../components/AppModal';
import { SafeAreaView } from 'react-navigation';

const STATUS = {
  ACTIVE : "A",               // 사용중
  RESERVED : "R",             // 사용 대기 중
  INACTIVE : "I",             // 미사용
  EXPIRED : "E",              // 사용 기한 종료
  USED : "U",                 // 사용 완료
  CANCELED : "C"              // 사용 완료
}

const activateBtn = 'activateBtn';
const deactivateBtn = 'deactivateBtn';

class UsageDetailScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('his:detail')} />
  })

  constructor(props) {
    super(props)
    this.state = {
      activatable : false,
      showModal : {
        deactivateBtn: false,
        activateBtn: false
      }
    }

    this._onSubmit = this._onSubmit.bind(this)
  }

  componentDidMount() {
    const detail = this.props.navigation.getParam('detail'),
      { country, uuid } = detail,
      prodList = this.props.product.get('prodList'),
      { price } = prodList.get(detail.prodId) || {},
      { usage } = this.props.order

    let activatable = false

    usage.map(elm => { 
      if(elm.country == country && elm.statusCd == STATUS.ACTIVE) {
        activatable = true
      }
    })
    this.setState({activatable, price, ... detail})
  }

  _onSubmit(modal=undefined, targetStatus=undefined) {
    const { account:{iccid}, auth } = this.props
    const { uuid, statusCd, showModal, country } = this.state
    const { usage } = this.props.order

    let deact_prod_uuid = []

    if(targetStatus) {
      if(targetStatus == STATUS.ACTIVE){
        usage.map(elm => {
          if(elm.statusCd == STATUS.ACTIVE && utils.compareArr(elm.country, country).length > 0){
            deact_prod_uuid.push(elm.uuid)
          }
        })
      }
  
      // 사용 등록 시 한번 더 물어보도록 한다.
      if(statusCd == STATUS.RESERVED && !showModal[modal] && targetStatus == STATUS.ACTIVE ){
        !_.isEmpty(modal) && this._showModal(modal,true)
        return
      }
      else if(statusCd == STATUS.INACTIVE && targetStatus == STATUS.USED ){
        // 로깨비캐시로 전환
        if(showModal[modal]){
            this.props.action.order.updateSubsToCash(uuid, auth, targetStatus).then(resp =>
              {
                // 업데이트 후 정렬된 usage list 가져오기
                if(resp.result == 0){
                  this.props.action.order.getUsage(iccid, auth)
                  this.props.action.account.getAccount(iccid, auth)
                }
              })
        }else{
          !_.isEmpty(modal) && this._showModal(modal, true)
          return
        }
      } 
      else {
        this.props.action.order.updateUsageStatus( uuid, targetStatus, auth, deact_prod_uuid).then(resp =>
          {
            if(resp.result == 0){
              this.props.action.order.getUsage(iccid, auth)
            }
          })
      }
      this.props.navigation.goBack()
    }
}

  _showModal(title, value) {
    this.setState({
      showModal: {
        ... this.state.showModal,
        [title]: value
      }
    })
  }

  render() {
    const {prodName, activationDate, endDate, expireDate, purchaseDate, statusCd, showModal, price} = this.state || {}
    let buttonTitle, targetStatus, disable
    
    switch (statusCd) {
      case STATUS.RESERVED:
        buttonTitle = i18n.t('reg:registerToUse')
        targetStatus = STATUS.ACTIVE
        disable = false
        break
      case STATUS.INACTIVE:
        buttonTitle = i18n.t('reg:reserveToUse')
        targetStatus = STATUS.RESERVED
        disable = false
        break
      case STATUS.EXPIRED:
        buttonTitle = i18n.t('reg:expired')
        targetStatus = undefined
        disable = true
        break
      case STATUS.USED:
        buttonTitle = i18n.t('reg:used')
        targetStatus = undefined
        disable = true
        break
      case STATUS.CANCELED:
        buttonTitle = i18n.t('reg:canceled')
        targetStatus = undefined
        disable = true
        break        
      default:
        buttonTitle = i18n.t('ok')
        targetStatus = undefined
        disable = false
        break
    }

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
        
        <View style={{flexDirection: 'row'}}>
          { 
            statusCd == STATUS.RESERVED && 
            <AppButton style={[styles.confirm,{backgroundColor:colors.white}]}
              title={i18n.t('reg:cancelReservation')} titleStyle={[appStyles.confirmText,{color:colors.black}]}
              style={{borderWidth:1, borderColor: colors.lightGrey, flex:1}}
              onPress={() => this._onSubmit(deactivateBtn, STATUS.INACTIVE)}/> 
          }
          { 
            statusCd == STATUS.INACTIVE && 
            <AppButton style={[styles.confirm,{backgroundColor:colors.white}]}
              title={i18n.t('reg:toRokebiCash')} titleStyle={[appStyles.confirmText,{color:colors.black}]}
              style={{borderWidth:1, borderColor: colors.lightGrey, flex:1}}
              onPress={() => this._onSubmit(deactivateBtn, STATUS.USED)}/> 
          }
          <AppButton style={styles.confirm}
            title={buttonTitle} titleStyle={appStyles.confirmText}
            disabled={disable}
            onPress={() => this._onSubmit(activateBtn, targetStatus)}/>
        </View>

        {
          showModal.activateBtn ?
          <AppModal title={i18n.t('reg:activateProduct')}
            onOkClose={() => this._onSubmit(activateBtn, STATUS.ACTIVE)}
            onCancelClose={() => this._showModal(activateBtn,false)}
            visible={showModal.activateBtn} />
          :
          <AppModal title={i18n.t('reg:toCash')}
          onOkClose={() => this._onSubmit(deactivateBtn, STATUS.USED)}
          onCancelClose={() => this._showModal(deactivateBtn,false)}
          toRokebiCash={utils.numberToCommaString(price)}
          visible={showModal.deactivateBtn} />
        }  
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
  },
  confirm: {
    height: 52,
    flex:1,
    backgroundColor: colors.clearBlue
  },
});

const mapStateToProps = (state) => ({
  product: state.product,
  account : state.account.toJS(),
  auth: accountActions.auth(state.account),
  order: state.order.toJS()
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      product: bindActionCreators(productActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      order: bindActionCreators(orderActions, dispatch)
    }
  })
)(UsageDetailScreen)