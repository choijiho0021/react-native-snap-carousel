import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
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
      showEmailModal: false
    }

    this._info = this._info.bind(this)
    this._renderItem = this._renderItem.bind(this)
    this._changePhoto = this._changePhoto.bind(this)
    this._showEmailModal = this._showEmailModal.bind(this)
  }

  componentDidMount() {
    this.props.action.order.getOrders(this.props.auth)
  }

  _onPress = (key) => () => {
    this.setState({
      mode: key
    })
  }

  _showEmailModal(flag) {
    this.setState({
      showEmailModal: flag
    })
  }

  _recharge() {
    console.log('recharge')
  }

  _changePhoto() {
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
      AppAlert.error(err)
    })
  }

  _info() {
    const {iccid, mobile, balance, expDate, email, userPictureUrl} = this.props.account
    const selected = (mode) => {
      return (mode == this.state.mode) ? colors.clearBlue : colors.lightGrey
    } 

    return (
      <View style={{marginTop:20, marginBottom:30}}>
        <View >
          <AppUserPic url={userPictureUrl} icon="imgPeopleL" style={styles.userPicture} onPress={this._changePhoto} />
          <AppIcon name="imgPeoplePlus" style={{bottom:20, right:-29}}/>
        </View>

        <LabelText key='iccid' 
          style={styles.box}
          label={'ICCID'} labelStyle={styles.label} 
          value={utils.toICCID(iccid)} valueStyle={styles.value}/>

        <LabelText key='expDate' 
          style={styles.box}
          label={i18n.t('acc:expDate')} labelStyle={styles.label} 
          value={ expDate} valueStyle={styles.value}/>

        <LabelText key='mobile' 
          style={styles.box}
          label={i18n.t('acc:mobile')} labelStyle={styles.label} 
          value={ utils.toPhoneNumber(mobile)} valueStyle={styles.value} />

        <View style={{borderBottomWidth:1, marginHorizontal:20}} />

        <TouchableOpacity onPress={() => this._showEmailModal(true)}>
          <View style={styles.row}>
            <LabelText key='email' 
              style={styles.box}
              label={i18n.t('reg:email')} labelStyle={styles.label} 
              value={ email} valueStyle={styles.value} />
            <AppIcon style={{alignSelf:'center'}} name="iconArrowRight"/>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this._showEmailModal(true)}>
          <View style={styles.row}>
            <LabelText key='balance' 
              style={styles.box}
              label={i18n.t('acc:balance')} labelStyle={styles.label} 
              value={ utils.price(balance)} valueStyle={[styles.value, {color:colors.clearBlue}]} />
            <AppIcon style={{alignSelf:'center'}} name="iconArrowRight"/>
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.subTitle}>{i18n.t('acc:subTitle')}</Text>

        <View style={styles.buttonRow}>
          <AppButton style={[styles.button, {borderColor:selected('purchase')}]}
            titleStyle={[styles.buttonTitle, {color:selected('purchase')}]}
            onPress={this._onPress('purchase')} title={i18n.t('acc:purchaseHistory')}/>
          <AppButton style={[styles.button, {borderColor:selected('usage')}]} 
            titleStyle={[styles.buttonTitle, {color:selected('usage')}]} 
            onPress={this._onPress('usage')} title={i18n.t('acc:usageHistory')}/>
        </View>
      </View>
    )
  }

  _onPressDetail = (orderId) => () => {
    const { orders } = this.props.order
    this.props.navigation.navigate('PurchaseDetail', {detail: orders.find(item => item.orderId == orderId)})
  }

  _renderItem({item}) {
    if (item.orderId == 'info') return this._info()

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

  render() {
    const { showEmailModal} = this.state
    const orders = [{
      orderId: 'info'
    }].concat(this.props.order.orders)

    return (
      <View style={styles.container}>
        {
          orders && orders.length > 0 ?
            <FlatList data={orders} renderItem={this._renderItem} keyExtractor={item => item.orderId}/> :
            <Text style={styles.nolist}>{i18n.t('his:noPurchase')}</Text>
        }
        <AppActivityIndicator visible={this.props.pending}/>
        <AppModal title={i18n.t('acc:changeEmail')} 
          mode="edit"
          default={this.props.account.email}
          onOkClose={() => this._showEmailModal(false)}
          onCancelClose={() => this._showEmailModal(false)}
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
    ... appStyles.normal16Texta,
    marginRight: 20,
    color: colors.black
  },
  box: {
    height: 36,
    alignItems: 'center',
    flex: 1
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
    ... appStyles.normal14Text,
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
  pending: state.pender.pending[orderActions.GET_ORDERS] || 
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