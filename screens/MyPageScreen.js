import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
  RefreshControl,
  Linking,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {appStyles} from '../constants/Styles';
import i18n from '../utils/i18n';
import AppButton from '../components/AppButton';
import utils from '../utils/utils';
import LabelText from '../components/LabelText';
import {colors} from '../constants/Colors';
import AppIcon from '../components/AppIcon';
import * as orderActions from '../redux/modules/order';
import * as accountActions from '../redux/modules/account';
import * as toastActions from '../redux/modules/toast';
import AppActivityIndicator from '../components/AppActivityIndicator';
import AppAlert from '../components/AppAlert';
import _ from 'underscore';
import AppUserPic from '../components/AppUserPic';
import AppModal from '../components/AppModal';
import validationUtil from '../utils/validationUtil';
import LabelTextTouchable from '../components/LabelTextTouchable';
import {isDeviceSize} from '../constants/SliderEntry.style';
import {
  openSettings,
  check,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import Analytics from 'appcenter-analytics';
import {API} from 'RokebiESIM/submodules/rokebi-utils';
import {Toast} from '../constants/CustomTypes';
import Clipboard from '@react-native-community/clipboard';
import getEnvVars from '../environment';
const {esimApp} = getEnvVars();

let ImagePicker;
ImagePicker = require('react-native-image-crop-picker').default;

class OrderItem extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.item.state != nextProps.item.state;
  }

  render() {
    const {item, onPress} = this.props;
    if (_.isEmpty(item.orderItems)) return <View />;

    var label = item.orderItems[0].title;
    if (item.orderItems.length > 1)
      label =
        label + i18n.t('his:etcCnt').replace('%%', item.orderItems.length - 1);

    const isCanceled = item.state == 'canceled';
    const billingAmt = item.totalPrice + item.dlvCost;

    return (
      <TouchableOpacity onPress={onPress}>
        <View key={item.orderId} style={styles.order}>
          <LabelText
            style={styles.orderValue}
            label={utils.toDateString(item.orderDate, 'YYYY-MM-DD')}
            labelStyle={styles.date}
            valueStyle={{color: colors.tomato}}
            value={isCanceled && i18n.t('his:cancel')}
          />
          <LabelText
            style={styles.orderValue}
            label={label}
            labelStyle={[
              {width: '70%'},
              isDeviceSize('small')
                ? appStyles.normal14Text
                : appStyles.normal16Text,
            ]}
            value={billingAmt}
            color={isCanceled ? colors.warmGrey : colors.black}
            valueStyle={appStyles.price}
            format="price"
          />
        </View>
      </TouchableOpacity>
    );
  }
}

class MyPageScreen extends Component {
  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <Text style={styles.title}>{i18n.t('acc:title')}</Text>,
      headerRight: () => (
        <AppButton
          key="cnter"
          style={styles.settings}
          onPress={() => this.props.navigation.navigate('Settings')}
          iconName="btnSetup"
        />
      ),
    });

    this.state = {
      hasPhotoPermission: false,
      showEmailModal: false,
      showIdModal: false,
      isReloaded: false,
      isFocused: false,
      refreshing: false,
      isRokebiInstalled: false,
      page: 0,
    };

    this._info = this._info.bind(this);
    this._renderOrder = this._renderOrder.bind(this);
    this._changePhoto = this._changePhoto.bind(this);
    this._showEmailModal = this._showEmailModal.bind(this);
    this._showIdModal = this._showIdModal.bind(this);
    this._validEmail = this._validEmail.bind(this);
    this._changeEmail = this._changeEmail.bind(this);
    this._recharge = this._recharge.bind(this);
    this._didMount = this._didMount.bind(this);
    this._getNextOrder = this._getNextOrder.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);

    this.flatListRef = React.createRef();
  }

  shouldComponentUpdate(nextProps) {
    const {ordersIdx, account = {}} = this.props.order;
    return (
      account.userPictureUrl != nextProps.account.userPictureUrl ||
      ordersIdx != nextProps.order.ordersIdx
    );
  }

  componentDidMount() {
    //Logout시에 mount가 새로 되는데 login 페이지로 안가기 위해서 isFocused 조건 추가
    if (!this.props.account.loggedIn && this.props.navigation.isFocused()) {
      this.props.navigation.navigate('Auth');
    } else {
      this._didMount();
    }
  }

  componentDidUpdate(prevProps) {
    const focus = this.props.navigation.isFocused();

    // 구매내역 원래 조건 확인
    if (this.state.isFocused != focus) {
      this.setState({isFocused: focus});
      if (focus) {
        if (!this.props.account.loggedIn) {
          this.props.navigation.navigate('Auth');
        } else {
          this.props.action.order.getOrders(this.props.auth, 0);
        }
      }
    }

    if (this.props.uid && this.props.uid != prevProps.uid) {
      // reload order history
      this.props.action.order.getOrders(this.props.auth);
    }

    if (
      this.props.lastTab[0] === 'MyPageStack' &&
      this.props.lastTab[0] !== prevProps.lastTab[0] &&
      this.flatListRef.current
    ) {
      this.flatListRef.current.scrollToOffset({animated: false, y: 0});
    }

    // if(this.props.account.loggedIn != prevProps.account.loggedIn && ){
    //   console.log("goto login page - aa",this.props.account.loggedIn,prevProps.account.loggedIn)
    //   this.props.navigation.navigate('RegisterMobile')
    // }
  }

  async _didMount() {
    const permission =
      Platform.OS == 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    const result = await check(permission);

    this.setState({hasPhotoPermission: result === 'granted'});

    // if (this.props.uid) this.props.action.order.getOrders(this.props.auth)
  }

  _showEmailModal(flag) {
    if (flag && !this.props.uid) {
      return this.props.navigation.navigate('Auth');
    }

    this.setState({
      showEmailModal: flag,
    });
  }

  _showIdModal(flag = false) {
    this.setState({showIdModal: flag});
  }

  async _changePhoto() {
    let checkNewPermission = false;

    if (!this.state.hasPhotoPermission) {
      const permission =
        Platform.OS == 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      const result = await check(permission);

      checkNewPermission = result === RESULTS.GRANTED;
    }

    if (!this.props.uid) {
      return this.props.navigation.navigate('Auth');
    }

    if (this.state.hasPhotoPermission || checkNewPermission) {
      ImagePicker &&
        ImagePicker.openPicker({
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
        })
          .then(image => {
            console.log('image', image);
            image && this.props.action.account.uploadAndChangePicture(image);
          })
          .catch(err => {
            console.log('failed to upload', err);
          });
    } else {
      // 사진 앨범 조회 권한을 요청한다.
      AppAlert.confirm(i18n.t('settings'), i18n.t('acc:permPhoto'), {
        ok: () => openSettings(),
      });
    }
  }

  _recharge() {
    if (!this.props.uid) {
      return this.props.navigation.navigate('Auth');
    }

    return this.props.navigation.navigate('Recharge', {mode: 'MyPage'});
  }

  _info() {
    const {
      account: {mobile, email, userPictureUrl},
    } = this.props;

    return (
      <View style={{marginBottom: 10}}>
        <View
          style={{
            marginTop: 35,
            flex: 1,
            flexDirection: 'row',
            marginHorizontal: 20,
            height: 76,
            marginBottom: 30,
          }}>
          <TouchableOpacity
            style={{flex: 1, alignSelf: 'center'}}
            onPress={this._changePhoto}>
            <AppUserPic
              url={userPictureUrl}
              icon="imgPeopleL"
              style={styles.userPicture}
              onPress={this._changePhoto}
            />
            <AppIcon
              name="imgPeoplePlus"
              style={{bottom: 20, right: -29, alignSelf: 'center'}}
            />
          </TouchableOpacity>
          <View style={{flex: 3, justifyContent: 'center'}}>
            <Text style={styles.label}>{utils.toPhoneNumber(mobile)}</Text>
            <LabelTextTouchable
              key="email"
              label={email}
              labelStyle={styles.value}
              value={''}
              onPress={() => this._showEmailModal(true)}
              arrow="iconArrowRight"
            />
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {esimApp && (
            <TouchableOpacity
              style={styles.btnIdCheck}
              onPress={() => this._showIdModal(true)}>
              <Text style={[appStyles.normal16Text, {textAlign: 'center'}]}>
                {i18n.t('mypage:idCheckTitle')}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.btnContactBoard}
            onPress={() =>
              this.props.navigation.navigate('ContactBoard', {index: 2})
            }>
            <Text style={[appStyles.normal16Text, {textAlign: 'center'}]}>
              {i18n.t('board:mylist')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <Text style={styles.subTitle}>{i18n.t('acc:purchaseHistory')}</Text>
        <View style={styles.dividerSmall} />
      </View>
    );
  }

  _onPressOrderDetail = orderId => () => {
    const {orders, ordersIdx} = this.props.order;
    this.props.navigation.navigate('PurchaseDetail', {
      detail: orders[ordersIdx.get(orderId)],
      auth: this.props.auth,
    });
  };

  async _validEmail(value) {
    const err = validationUtil.validate('email', value);
    if (!_.isEmpty(err)) return err.email;

    const {email} = this.props.account;

    if (email !== value) {
      // check duplicated email
      const resp = await API.User.getByMail(value, this.props.auth);
      if (resp.result == 0 && resp.objects.length > 0) {
        // duplicated email
        return [i18n.t('acc:duplicatedEmail')];
      }
    } else {
      this.setState({
        showEmailModal: false,
      });
    }

    return undefined;
  }

  _changeEmail(mail) {
    const {email} = this.props.account;

    if (email !== mail) {
      this.props.action.account.changeEmail(mail);
      Analytics.trackEvent('Page_View_Count', {page: 'Change Email'});
    }

    this.setState({
      showEmailModal: false,
    });
  }

  _renderOrder({item}) {
    return (
      <OrderItem item={item} onPress={this._onPressOrderDetail(item.orderId)} />
    );
  }

  _empty() {
    if (this.props.pending) return null;

    return <Text style={styles.nolist}>{i18n.t('his:noPurchase')}</Text>;
  }

  _getNextOrder() {
    this.props.action.order.getOrders(this.props.auth);
  }

  _onRefresh() {
    this.setState({
      refreshing: true,
    });

    this.props.action.order.getOrders(this.props.auth, 0).then(resp => {
      if (resp.result == 0) {
        this.setState({
          refreshing: false,
        });
      }
    });
  }

  // RokebiSIm에서 RokebiTalk 호출
  openRokebiTalk = async () => {
    const {iccid, pin} = this.props.account;

    let isRokebiInstalled = undefined;

    // 네이버URL -> Store URL 변경필요
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        if (!this.state.isRokebiInstalled) {
          Linking.openURL(`http://naver.com`);
        }
      }, 1000);

      isRokebiInstalled = await Linking.openURL(
        `rokebitalk://?actCode=${pin}&iccidStr=${iccid}`,
      );
      this.setState({isRokebiInstalled: true});
    } else {
      isRokebiInstalled = await Linking.canOpenURL(
        `rokebitalk://rokebitalk.com?actCode=${pin}&iccidStr=${iccid}`,
      );
      isRokebiInstalled
        ? Linking.openURL(
            `rokebitalk://rokebitalk.com?actCode=${pin}&iccidStr=${iccid}`,
          )
        : Linking.openURL(`http://naver.com`);
    }
  };

  copyToClipboard = value => () => {
    Clipboard.setString(value);
    this.props.action.toast.push(Toast.COPY_SUCCESS);
  };

  _modalBody = () => () => {
    const {iccid, pin} = this.props.account;
    return (
      <View>
        <Text style={styles.body}>{i18n.t('mypage:manualInput:body')}</Text>
        <View style={styles.titleAndStatus}>
          <View>
            <Text style={styles.keyTitle}>{i18n.t('mypage:iccid')}</Text>
            <Text style={appStyles.normal18Text}>{iccid}</Text>
          </View>
          <AppButton
            title={i18n.t('copy')}
            titleStyle={{color: colors.black}}
            style={styles.btnCopy}
            onPress={this.copyToClipboard(iccid)}
          />
        </View>
        <View style={styles.titleAndStatus}>
          <View>
            <Text style={styles.keyTitle}>
              {i18n.t('mypage:activationCode')}
            </Text>
            <Text style={appStyles.normal18Text}>{pin}</Text>
          </View>
          <AppButton
            title={i18n.t('copy')}
            titleStyle={{color: colors.black}}
            style={styles.btnCopy}
            onPress={this.copyToClipboard(pin)}
          />
        </View>
      </View>
    );
  };

  render() {
    const {showEmailModal, showIdModal, refreshing = false} = this.state;
    const {orders, ordersIdx} = this.props.order;

    return (
      <View style={styles.container}>
        <FlatList
          ref={this.flatListRef}
          data={orders}
          extraData={ordersIdx}
          ListHeaderComponent={this._info}
          ListEmptyComponent={this._empty()}
          renderItem={this._renderOrder}
          onEndReachedThreshold={0.4}
          onEndReached={this._getNextOrder}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this._onRefresh}
              colors={[colors.clearBlue]} //android 전용
              tintColor={colors.clearBlue} //ios 전용
            />
          }
        />

        <AppActivityIndicator visible={this.props.pending} />

        <AppModal
          title={i18n.t('acc:changeEmail')}
          mode="edit"
          default={this.props.account.email}
          onOkClose={this._changeEmail}
          onCancelClose={() => this._showEmailModal(false)}
          validateAsync={this._validEmail}
          visible={showEmailModal}
        />

        <AppModal
          type="close"
          title={i18n.t('mypage:idCheckTitle')}
          titleStyle={styles.titleStyle}
          titleIcon={'btnId'}
          body={this._modalBody()}
          onOkClose={() => {
            this._showIdModal(false);
            // this.openRokebiTalk();
          }}
          onCancelClose={() => this._showIdModal(false)}
          visible={showIdModal}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginRight: 20,
  },
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  photo: {
    height: 76,
    width: 76,
    marginTop: 20,
    alignSelf: 'center',
  },
  label: {
    ...appStyles.normal14Text,
    marginLeft: 20,
    color: colors.warmGrey,
  },
  value: {
    ...appStyles.roboto16Text,
    marginLeft: 20,
    width: '100%',
    lineHeight: 40,
    color: colors.black,
  },
  date: {
    ...appStyles.normal14Text,
    fontSize: isDeviceSize('small') ? 12 : 14,
    alignSelf: 'flex-start',
    color: colors.warmGrey,
  },
  dividerSmall: {
    borderBottomWidth: 1,
    margin: 20,
    marginBottom: 0,
    borderBottomColor: colors.black,
  },
  divider: {
    height: 10,
    marginTop: 40,
    backgroundColor: colors.whiteTwo,
  },
  subTitle: {
    ...appStyles.bold18Text,
    marginTop: 40,
    marginLeft: 20,
    color: colors.black,
  },
  buttonTitle: {
    ...appStyles.normal16Text,
    textAlign: 'center',
  },
  order: {
    marginVertical: 15,
    marginHorizontal: 20,
  },
  orderValue: {
    marginTop: 12,
  },
  nolist: {
    marginVertical: 60,
    textAlign: 'center',
  },
  userPicture: {
    width: 76,
    height: 76,
  },
  settings: {
    marginRight: 20,
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
  },
  btnContactBoard: {
    marginRight: 20,
    marginLeft: esimApp ? 3 : 20,
    flex: 1,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    height: esimApp ? 60 : 30,
    justifyContent: 'center',
  },
  btnIdCheck: {
    marginLeft: 20,
    marginRight: 3,
    flex: 1,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    height: 60,
    justifyContent: 'center',
  },
  body: {
    ...appStyles.normal16Text,
    marginHorizontal: 30,
    marginVertical: 20,
    marginTop: 10,
  },
  titleAndStatus: {
    flexDirection: 'row',
    marginHorizontal: 30,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.whiteTwo,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  btnCopy: {
    backgroundColor: colors.white,
    width: 62,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.whiteTwo,
  },
  titleStyle: {
    marginHorizontal: 30,
    fontSize: 20,
  },
  keyTitle: {
    ...appStyles.normal18Text,
    marginBottom: 10,
    color: colors.warmGrey,
  },
});

const mapStateToProps = state => ({
  lastTab: state.cart.get('lastTab').toJS(),
  account: state.account.toJS(),
  order: state.order.toObject(),
  auth: accountActions.auth(state.account),
  uid: state.account.get('uid'),
  pending:
    state.pender.pending[orderActions.GET_ORDERS] ||
    state.pender.pending[orderActions.GET_SUBS] ||
    state.pender.pending[accountActions.CHANGE_EMAIL] ||
    state.pender.pending[accountActions.UPLOAD_PICTURE] ||
    false,
});

export default connect(
  mapStateToProps,
  dispatch => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(MyPageScreen);
