import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Linking,
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
import moment from 'moment'
import AppActivityIndicator from '../components/AppActivityIndicator'
import Constants from 'expo-constants'
import AppAlert from '../components/AppAlert';
import _ from 'underscore'
import AppUserPic from '../components/AppUserPic';
import AppModal from '../components/AppModal';
import * as Permissions from 'expo-permissions';
import validationUtil from '../utils/validationUtil';
import userApi from '../utils/api/userApi';
import LabelTextTouchable from '../components/LabelTextTouchable';

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

class MyPageScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <Text style={styles.title}>{i18n.t('acc:title')}</Text>
    ),
  })

  constructor(props) {
    super(props)
    this.state = {
      mode: 'purchase',
      hasCameraRollPermission: null,
      showEmailModal: false
    }

    this._info = this._info.bind(this)
    this._renderItem = this._renderItem.bind(this)
    this._changePhoto = this._changePhoto.bind(this)
    this._showEmailModal = this._showEmailModal.bind(this)
    this._validEmail = this._validEmail.bind(this)
    this._changeEmail = this._changeEmail.bind(this)
    this._recharge = this._recharge.bind(this)
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    this.setState({ hasCameraRollPermission: status === 'granted'})

    if ( this.props.uid) this.props.action.order.getOrders(this.props.auth)
  }

  componentDidUpdate(prevProps) {
    if ( this.props.uid && this.props.uid != prevProps.uid) {
      // reload order history
      this.props.action.order.getOrders(this.props.auth)
    }
  }

  _onPress = (key) => () => {
    this.setState({
      mode: key
    })
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
    if ( ! this.props.uid) {
      return this.props.navigation.navigate('Auth')
    }

    if ( this.state.hasCameraRollPermission ) {
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
      AppAlert.confirm( i18n.t('settings'), i18n.t('acc:permCamera'), {
        ok: () => Linking.openURL('app-settings:')
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
      <View style={{marginTop:20}}>
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

  _onPressDetail = (orderId) => () => {
    const { orders } = this.props.order
    this.props.navigation.navigate('PurchaseDetail', {detail: orders.find(item => item.orderId == orderId)})
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

  _renderItem({item}) {
    const label = `${item.orderItems[0].title}  ${item.orderItems.length > 1 ? i18n.t('his:etcCnt').replace('%%', item.orderItems.length) : ''}`
    return (
      <TouchableOpacity onPress={this._onPressDetail(item.orderId)}>
        <View key={item.orderId} style={styles.order}>
          <Text style={appStyles.normal14Text}>{moment(item.orderDate).format('YYYY-MM-DD')}</Text>
          <LabelText style={styles.orderValue}
            label={label} labelStyle={appStyles.normal16Text}
            value={item.totalPrice} format="price" />
        </View>
      </TouchableOpacity>
    )
  }

  _empty() {
    return (
      <Text style={styles.nolist}>{i18n.t('his:noPurchase')}</Text>
    )
  }

  render() {
    const { showEmailModal} = this.state
    const { orders } = this.props.order

    return (
      <View style={styles.container}>
        <FlatList data={orders} 
          ListHeaderComponent={this._info}
          ListEmptyComponent={this._empty}
          renderItem={this._renderItem} 
          keyExtractor={item => item.orderId}/> 

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
    marginTop: 30,
    marginHorizontal: 20
  },
  orderValue: {
    marginTop: 12,
  },
  button: {
    width: "50%",
    height: 48,
    borderWidth: 0.5,
  },
  nolist: {
    marginTop: 60,
    textAlign: 'center'
  },
  userPicture: {
    width: 76, 
    height: 76
  },
});

const mapStateToProps = state => ({
  account: state.account.toJS(),
  order: state.order.toJS(),
  auth: accountActions.auth( state.account),
  uid: state.account.get('uid'),
  pending: state.pender.pending[orderActions.GET_ORDERS] || 
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