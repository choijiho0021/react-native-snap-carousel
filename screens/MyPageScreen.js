import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform
} from 'react-native';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import AppButton from '../components/AppButton'
import utils from '../utils/utils';
import LabelText from '../components/LabelText';
import { colors } from '../constants/Colors';
import AppIcon from '../components/AppIcon';
import * as orderActions from '../redux/modules/order'
import * as accountActions from '../redux/modules/account'
import AppActivityIndicator from '../components/AppActivityIndicator'
import Constants from 'expo-constants'
import AppAlert from '../components/AppAlert';
import _ from 'underscore'
import AppUserPic from '../components/AppUserPic';
import AppModal from '../components/AppModal';
import validationUtil from '../utils/validationUtil';
import userApi from '../utils/api/userApi';
import LabelTextTouchable from '../components/LabelTextTouchable';
import { isDeviceSize } from '../constants/SliderEntry.style';
import { openSettings, check, PERMISSIONS, RESULTS } from 'react-native-permissions';

let ImagePicker 
if (Constants.appOwnership === 'expo') {
  ImagePicker = {
    openPicker : function() {
      return Promise.resolve(undefined)
    }
  }
}
else {
  ImagePicker = require('react-native-image-crop-picker').default
}

class OrderItem extends PureComponent {
  render () {
    const {item, onPress} = this.props
    if ( _.isEmpty(item.orderItems) ) return <View></View>

    var label = item.orderItems[0].title
    if ( item.orderItems.length > 1) label = label + i18n.t('his:etcCnt').replace('%%', item.orderItems.length - 1)

    const isCanceled = item.state == 'canceled' ? '(결제취소)' : ''
    const billingAmt = item.totalPrice + item.dlvCost

    return (
      <TouchableOpacity onPress={onPress}>
        <View key={item.orderId} style={styles.order}>
          <Text style={[isDeviceSize('small') ? appStyles.normal12Text : appStyles.normal14Text, {alignSelf:'flex-start'}]}>{utils.toDateString(item.orderDate, 'YYYY-MM-DD')}</Text>
          <LabelText style={styles.orderValue}
            label={isCanceled + label} labelStyle={[{width:'70%'}, isDeviceSize('small') ? appStyles.normal14Text : appStyles.normal16Text]}
            value={billingAmt} format="price" />
        </View>
      </TouchableOpacity>
    )
  }
}

class UsageItem extends PureComponent {
  render () {
    const {item, onPress} = this.props,
      color = item.statusCd == 'A' ? colors.tomato : item.statusCd == 'E' ? colors.warmGrey : colors.clearBlue

    return (
      <LabelTextTouchable style={styles.usage}
        onPress={onPress}
        label={item.prodName} labelStyle={appStyles.normal16Text}
        value={item.status} valueStyle={[styles.usageValue, {color}]}/>
    )
  }
}

class MyPageScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <Text style={styles.title}>{i18n.t('acc:title')}</Text>
    ),
    headerRight: (
        <AppButton key="cnter" style={styles.settings} 
          onPress={() => navigation.navigate('Settings')} 
          iconName="btnSetup" />
    ),
  })

  constructor(props) {
    super(props)
    this.state = {
      mode: 'purchase',
      hasPhotoPermission: false,
      showEmailModal: false,
      isReloaded: false,
      isFocused: false,
    }

    this._info = this._info.bind(this)
    this._renderOrder = this._renderOrder.bind(this)
    this._renderUsage = this._renderUsage.bind(this)
    this._changePhoto = this._changePhoto.bind(this)
    this._showEmailModal = this._showEmailModal.bind(this)
    this._validEmail = this._validEmail.bind(this)
    this._changeEmail = this._changeEmail.bind(this)
    this._recharge = this._recharge.bind(this)
    this._didMount = this._didMount.bind(this)
  }

  componentDidMount() {
    if(!this.props.account.loggedIn){
      this.props.navigation.navigate('RegisterMobile')
    }
    else{
      this._didMount()
    }
  }
  componentDidUpdate(prevProps) {
    const { mode, isReloaded } = this.state
    const focus = this.props.navigation.isFocused()

    // 구매내역 원래 조건 확인 
    if(this.state.isFocused != focus){
      this.setState({isFocused: focus})
      if(focus){
        this.props.action.order.getOrders(this.props.auth)
        this.props.action.order.getUsage(this.props.account.iccid, this.props.auth)
      }
    }

    if ( this.props.uid && this.props.uid != prevProps.uid ) {
      // reload order history
      this.props.action.order.getOrders(this.props.auth)
    }

    if ( this.props.account ) {
      const { account: {iccid}, auth } = this.props
      if ( iccid && iccid !== (prevProps.account || {}).iccid && mode === 'usage' ) {
        this.props.action.order.getUsage(iccid, auth)
        this.setState({ isReloaded: true })
      }
    }

    if ( this.props.lastTab[0] === 'MyPageStack' && this.props.lastTab[0] !== prevProps.lastTab[0] ) {
      this.flatListRef.scrollToOffset({ animated: false, y: 0 })
      
      if ( mode === 'usage' && isReloaded ) {
        this.props.navigation.popToTop()
        this.setState({ isReloaded: false })
      }
    }
    
    if(this.props.account.loggedIn != prevProps.account.loggedIn){
      this.props.navigation.navigate('RegisterMobile')
    }
  }

  async _didMount(){
    const permission = Platform.OS == 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    const result = await check(permission)

    this.setState({ hasPhotoPermission: result === 'granted'})

    if (this.props.uid) this.props.action.order.getOrders(this.props.auth)
  }

  _onPress = (key) => () => {
    this.setState({
      mode: key
    })

    const { account: {iccid}, auth} = this.props
    if ( key == 'usage' && iccid) {
      this.props.action.order.getUsage( iccid, auth)
    }
  }

  _showEmailModal(flag) {
    if ( flag && ! this.props.uid) {
      return this.props.navigation.navigate('Auth')
    }

    this.setState({
      showEmailModal: flag
    })
  }

  async _changePhoto() {

    let checkNewPermission = false

    if(!this.state.hasPhotoPermission){
      const permission = Platform.OS == 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      const result = await check(permission)

      checkNewPermission =  result === RESULTS.GRANTED
    }

    if ( ! this.props.uid) {
      return this.props.navigation.navigate('Auth')
    }

    if ( this.state.hasPhotoPermission || checkNewPermission) {
      ImagePicker && ImagePicker.openPicker({
        width: 76,
        height: 76,
        cropping: true,
        cropperCircleOverlay: true,
        includeBase64: true,
        writeTempFile: false,
        mediaType: 'photo',
        forceJpb: true,
        cropperChooseText: i18n.t('select'),
        cropperCancelText: i18n.t('cancel'),
      }).then(image => {
        console.log( 'image', image);
        image && this.props.action.account.uploadAndChangePicture(image)
      }).catch(err => {
        console.log('failed to upload', err)
      })
    }
    else {
      // 사진 앨범 조회 권한을 요청한다.
      AppAlert.confirm( i18n.t('settings'), i18n.t('acc:permPhoto'), {
        ok: () => openSettings()
      })
    }
  }

  _recharge() {
    if ( ! this.props.uid) {
      return this.props.navigation.navigate('Auth')
    }

    return this.props.navigation.navigate('Recharge')
  }

  _info() {
    const { account: {iccid, mobile, balance, expDate, email, userPictureUrl, loggedIn}} = this.props,
      selected = (mode, disableColor = colors.lightGrey) => {
        return (mode == this.state.mode) ? colors.clearBlue : disableColor
      } 

    return (
      <View style={{marginTop:20, marginBottom:10}}>
        <View >
          <AppUserPic url={userPictureUrl} icon="imgPeopleL" 
            style={styles.userPicture} 
            onPress={this._changePhoto} />
          <AppIcon name="imgPeoplePlus" style={{bottom:20, right:-29, alignSelf:'center'}}/>
        </View>

        <LabelTextTouchable key='iccid' 
          style={styles.box}
          label={'ICCID'} labelStyle={styles.label} 
          value={iccid ? utils.toICCID(iccid) : i18n.t('reg:card')} valueStyle={styles.value}
          disabled={loggedIn && ! _.isEmpty(iccid)}
          onPress={() => this.props.navigation.navigate(loggedIn ? 'RegisterSim' : 'Auth')}
          arrow={_.isEmpty(iccid) && 'iconArrowRight'} />

        {
          iccid && <LabelText key='expDate' 
            style={styles.box}
            label={i18n.t('acc:expDate')} labelStyle={styles.label} 
            value={expDate} valueStyle={styles.value}/>
        }

        <LabelText key='mobile' 
          style={styles.box}
          label={i18n.t('acc:mobile')} labelStyle={styles.label} 
          value={ utils.toPhoneNumber(mobile)} valueStyle={styles.value} />

        <View style={styles.dividerSmall} />

        <LabelTextTouchable key='email' 
          style={styles.box}
          label={i18n.t('reg:email')} labelStyle={styles.label} 
          value={ email} valueStyle={styles.value} 
          onPress={() => this._showEmailModal(true)}
          arrow='iconArrowRight' />

        {
          iccid &&
            <LabelTextTouchable key='balance' 
              style={styles.box}
              label={i18n.t('acc:balance')} labelStyle={styles.label} 
              value={ utils.price(balance)} valueStyle={[styles.value, {color:colors.clearBlue}]} 
              onPress={this._recharge}
              arrow='iconArrowRight' />
        }

        <View style={styles.divider} />

        <Text style={styles.subTitle}>{i18n.t('acc:subTitle')}</Text>

        <View style={styles.buttonRow}>
          <AppButton style={[styles.button, {borderColor:selected('purchase')}]}
            titleStyle={[styles.buttonTitle, {color:selected('purchase', colors.warmGrey)}]}
            onPress={this._onPress('purchase')} title={i18n.t('acc:purchaseHistory')}/>
          <AppButton style={[styles.button, {borderColor:selected('usage')}]} 
            titleStyle={[styles.buttonTitle, {color:selected('usage', colors.warmGrey)}]} 
            onPress={this._onPress('usage')} title={i18n.t('acc:usageHistory')}/>
        </View>
      </View>
    )
  }

  _onPressOrderDetail = (orderId) => () => {
    const { orders } = this.props.order
    this.props.navigation.navigate('PurchaseDetail', {detail: orders.find(item => item.orderId == orderId), props: this.props})
  }

  _onPressUsageDetail = (key) => () => {
    const { usage } = this.props.order
    this.props.navigation.navigate('UsageDetail', {detail: usage.find(item => item.key == key)})
  }

  async _validEmail(value) {
    const err = validationUtil.validate('email', value)
    if ( ! _.isEmpty(err)) return err.email

    // check duplicated email
    const resp = await userApi.getByMail(value, this.props.auth)
    if (resp.result == 0 && resp.objects.length > 0) {
      // duplicated email
      return [ i18n.t('acc:duplicatedEmail')]
    }

    return undefined
  }

  _changeEmail(mail) {
    this.props.action.account.changeEmail(mail)

    this.setState({
      showEmailModal: false
    })
  }

  _renderOrder({item}) {
    return (<OrderItem item={item} onPress={this._onPressOrderDetail(item.orderId)}/>)
  }
  
  _renderUsage({item}) {
    return (<UsageItem item={item} onPress={this._onPressUsageDetail(item.key)}/>)
  }

  _empty = (mode) => () => {
    if ( this.props.pending) return null

    return (
      <Text style={styles.nolist}>{i18n.t(mode == 'purchase' ? 'his:noPurchase' : 'his:noUsage')}</Text>
    )
  }

  render() {
    const { showEmailModal, mode} = this.state
    const { orders, usage } = this.props.order

    return (
      <View style={styles.container}>
        <FlatList ref={(ref) => { this.flatListRef = ref; }}
          data={mode == 'purchase' ? orders : usage} 
          ListHeaderComponent={this._info}
          ListEmptyComponent={this._empty(mode)}
          renderItem={mode == 'purchase' ? this._renderOrder : this._renderUsage} /> 

        <AppActivityIndicator visible={this.props.pending}/>

        <AppModal title={i18n.t('acc:changeEmail')} 
          mode="edit"
          default={this.props.account.email}
          onOkClose={this._changeEmail}
          onCancelClose={() => this._showEmailModal(false)}
          validateAsync={this._validEmail}
          visible={showEmailModal} />
      </View>
    )
  }

}


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginRight: 20
  },
  title: {
    ... appStyles.title,
    marginLeft: 20,
  },
  container: {
    flex:1,
    alignItems: 'stretch'
  },
  photo: {
    height: 76,
    width: 76,
    marginTop: 20,
    alignSelf: 'center'
  },
  label: {
    ... appStyles.normal14Text,
    marginLeft: 20,
    color: colors.warmGrey
  },
  value: {
    ... appStyles.roboto16Text,
    lineHeight: 40,
    color: colors.black
  },
  box: {
    height: 36,
    alignItems: 'center',
    flex: 1,
    marginRight: 20,
  },
  dividerSmall: {
    borderBottomWidth:1, 
    marginHorizontal:20,
    marginVertical: 18,
    borderBottomColor: colors.lightGrey
  },
  divider: {
    height: 10,
    marginTop: 30,
    backgroundColor: colors.whiteTwo
  },
  subTitle: {
    ... appStyles.bold18Text,
    marginTop: 40,
    marginLeft: 20,
    color: colors.black
  },
  buttonRow: {
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttonTitle: {
    ... appStyles.normal16Text,
    textAlign: 'center'
  },
  order: {
    marginVertical: 15,
    marginHorizontal: 20
  },
  orderValue: {
    marginTop: 12
  },
  button: {
    width: "50%",
    height: 48,
    borderWidth: 0.5,
  },
  nolist: {
    marginVertical: 60,
    textAlign: 'center'
  },
  userPicture: {
    width: 76, 
    height: 76
  },
  usage: {
    // height: 36,
    marginVertical:5,
    marginHorizontal: 20
  },
  usageValue: {
    flex: 1,
    textAlign: 'right'
  },
  settings : {
    marginRight:20,
    justifyContent:"flex-end",
    backgroundColor:colors.white
  }
});

const mapStateToProps = state => ({
  lastTab: state.cart.get('lastTab').toJS(),
  account: state.account.toJS(),
  order: state.order.toJS(),
  auth: accountActions.auth( state.account),
  uid: state.account.get('uid'),
  pending: state.pender.pending[orderActions.GET_ORDERS] || 
    state.pender.pending[orderActions.GET_USAGE] || 
    state.pender.pending[accountActions.CHANGE_EMAIL] || 
    state.pender.pending[accountActions.UPLOAD_PICTURE] || false,
})

export default connect(mapStateToProps,
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
      account: bindActionCreators(accountActions, dispatch)
    }
  })
)(MyPageScreen)