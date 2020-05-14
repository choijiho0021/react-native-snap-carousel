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

class OrderItem extends Component {

  shouldComponentUpdate(nextProps, nextState){

    return (this.props.item.state != nextProps.item.state)
  }

  render () {
    const {item, onPress} = this.props
    if ( _.isEmpty(item.orderItems) ) return <View></View>

    var label = item.orderItems[0].title
    if ( item.orderItems.length > 1) label = label + i18n.t('his:etcCnt').replace('%%', item.orderItems.length - 1)

    const isCanceled = item.state == 'canceled'
    const billingAmt = item.totalPrice + item.dlvCost

    console.log("order Iitem - aaaa")
    return (
      <TouchableOpacity onPress={onPress}>
        <View key={item.orderId} style={styles.order}>
          <LabelText style={styles.orderValue}
            label={utils.toDateString(item.orderDate, 'YYYY-MM-DD')}
            labelStyle={styles.date}
            valueStyle={{color:colors.tomato}}
            value={isCanceled && i18n.t('his:cancel')}/>
          <LabelText style={styles.orderValue}
            label={label}
            labelStyle={[{width:'70%'}, isDeviceSize('small') ? appStyles.normal14Text : appStyles.normal16Text]}
            value={billingAmt}
            color={isCanceled ? colors.warmGrey : colors.black}
            valueStyle={appStyles.price} format="price"/>
        </View>
      </TouchableOpacity>
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
      hasPhotoPermission: false,
      showEmailModal: false,
      isReloaded: false,
      isFocused: false,
    }

    this._info = this._info.bind(this)
    this._renderOrder = this._renderOrder.bind(this)
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
    const focus = this.props.navigation.isFocused()

    // 구매내역 원래 조건 확인 
    if(this.state.isFocused != focus){
      this.setState({isFocused: focus})
      if(focus){
        this.props.action.order.getOrders(this.props.auth)
      }
    }

    if ( this.props.uid && this.props.uid != prevProps.uid ) {
      // reload order history
      this.props.action.order.getOrders(this.props.auth)
    }

    if ( this.props.lastTab[0] === 'MyPageStack' && this.props.lastTab[0] !== prevProps.lastTab[0] ) {
      this.flatListRef.scrollToOffset({ animated: false, y: 0 })
    }
    
    // if(this.props.account.loggedIn != prevProps.account.loggedIn && ){
    //   console.log("goto login page - aa",this.props.account.loggedIn,prevProps.account.loggedIn)
    //   this.props.navigation.navigate('RegisterMobile')
    // }
  }

  async _didMount(){
    const permission = Platform.OS == 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    const result = await check(permission)

    this.setState({ hasPhotoPermission: result === 'granted'})

    if (this.props.uid) this.props.action.order.getOrders(this.props.auth)
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

    return this.props.navigation.navigate('Recharge',{mode : 'MyPage'})
  }

  _info() {
    const { account: { mobile, email, userPictureUrl, loggedIn } } = this.props

    return (
      <View style={{marginBottom:10}}>
        <View style={{marginTop:35, flex:1, flexDirection: 'row', marginHorizontal: 20, height: 76, marginBottom: 30}}>
          <View style={{flex:1, alignSelf: 'center'}}>
            <AppUserPic url={userPictureUrl} icon="imgPeopleL"
              style={styles.userPicture}
              onPress={this._changePhoto} />
            <AppIcon name="imgPeoplePlus" style={{bottom:20, right:-29, alignSelf:'center'}}/>
          </View>
          <View style={{flex:4, justifyContent: 'center'}}>
            <Text style={styles.label}>{utils.toPhoneNumber(mobile)}</Text>
            <LabelTextTouchable key='email' 
              label={email} labelStyle={styles.value}
              value={''}
              onPress={() => this._showEmailModal(true)}
              arrow='iconArrowRight'/>
          </View>
        </View>
        <TouchableOpacity style={{marginHorizontal: 20, borderColor: colors.lightGrey, borderWidth: 1, height: 40, justifyContent: 'center'}}
          onPress={()=> this.props.navigation.navigate('ContactBoard', {index:2})}>
          <Text style={[appStyles.normal16Text, {textAlign: 'center'}]}>{i18n.t("board:mylist")}</Text> 
        </TouchableOpacity>
        <View style={styles.divider}/>
        <Text style={styles.subTitle}>{i18n.t('acc:purchaseHistory')}</Text>
        <View style={styles.dividerSmall}/>
      </View>
    )
  }

  _onPressOrderDetail = (orderId) => () => {
    const { orders } = this.props.order
    this.props.navigation.navigate('PurchaseDetail', {detail: orders.find(item => item.orderId == orderId), auth: this.props.auth})
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
    Analytics.trackEvent('Page_View_Count', {page : 'Change Email'})
    this.setState({
      showEmailModal: false
    })
  }

  _renderOrder({item}) {
    return (<OrderItem item={item} onPress={this._onPressOrderDetail(item.orderId)}/>)
  }

  _empty(){
    if ( this.props.pending ) return null

    return (
      <Text style={styles.nolist}>{i18n.t('his:noPurchase')}</Text>
    )
  }

  render() {
    const { showEmailModal } = this.state
    const { orders } = this.props.order

    return (
      <View style={styles.container}>
        <FlatList ref={(ref) => { this.flatListRef = ref; }}
          data={orders} 
          ListHeaderComponent={this._info}
          ListEmptyComponent={this._empty()}
          renderItem={this._renderOrder} /> 

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
    marginLeft: 20,
    width: '100%',
    lineHeight: 40,
    color: colors.black
  },
  date: {
    ... appStyles.normal14Text,
    fontSize: isDeviceSize('small') ? 12 : 14,
    alignSelf:'flex-start',
    color: colors.warmGrey
  },
  dividerSmall: {
    borderBottomWidth:1, 
    margin: 20,
    marginBottom: 0,
    borderBottomColor: colors.black
  },
  divider: {
    height: 10,
    marginTop: 40,
    backgroundColor: colors.whiteTwo
  },
  subTitle: {
    ... appStyles.bold18Text,
    marginTop: 40,
    marginLeft: 20,
    color: colors.black
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
  nolist: {
    marginVertical: 60,
    textAlign: 'center'
  },
  userPicture: {
    width: 76, 
    height: 76
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