import Clipboard from '@react-native-community/clipboard';
import Analytics from 'appcenter-analytics';
import React, {Component} from 'react';
import {
  FlatList,
  Linking,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  Pressable,
  View,
} from 'react-native';
import {
  check,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import {API} from '../../submodules/rokebi-utils';
import AppActivityIndicator from '../../components/AppActivityIndicator';
import AppAlert from '../../components/AppAlert';
import AppButton from '../../components/AppButton';
import AppIcon from '../../components/AppIcon';
import AppModal from '../../components/AppModal';
import AppUserPic from '../../components/AppUserPic';
import LabelTextTouchable from '../../components/LabelTextTouchable';
import {colors} from '../../constants/Colors';
import {Toast} from '../../constants/CustomTypes';
import {appStyles} from '../../constants/Styles';
import Env from '../../environment';
import * as accountActions from '../../redux/modules/account';
import * as orderActions from '../../redux/modules/order';
import * as toastActions from '../../redux/modules/toast';
import i18n from '../../utils/i18n';
import utils from '../../utils/utils';
import validationUtil from '../../utils/validationUtil';
import OrderItem from './components/OrderItem';

const {esimApp} = Env.get();

const ImagePicker = require('react-native-image-crop-picker').default;

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
    marginHorizontal: 20,
    color: colors.warmGrey,
  },
  value: {
    ...appStyles.roboto16Text,
    marginLeft: 20,
    maxWidth: '100%',
    lineHeight: 40,
    color: colors.black,
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
  },
  titleAndStatus: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.whiteTwo,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  btnCopy: (selected) => ({
    backgroundColor: colors.white,
    width: 62,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: selected ? colors.clearBlue : colors.whiteTwo,
  }),
  btnCopyTitle: (selected) => ({
    ...appStyles.normal14Text,
    color: selected ? colors.clearBlue : colors.black,
  }),
  titleStyle: {
    marginHorizontal: 20,
    fontSize: 20,
  },
  keyTitle: {
    ...appStyles.normal18Text,
    marginBottom: 10,
    color: colors.warmGrey,
  },
  modalBody: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  openRokebiTalk: {
    flexDirection: 'row',
    height: 70,
    marginBottom: 10,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  openRokebiTalkText: {
    ...appStyles.normal16Text,
    color: colors.clearBlue,
    marginLeft: 20,
  },
});

class MyPageScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasPhotoPermission: false,
      showEmailModal: false,
      showIdModal: false,
      isFocused: false,
      refreshing: false,
      isRokebiInstalled: false,
      copyString: '',
    };

    this.info = this.info.bind(this);
    this.renderOrder = this.renderOrder.bind(this);
    this.changePhoto = this.changePhoto.bind(this);
    this.showEmailModal = this.showEmailModal.bind(this);
    this.showIdModal = this.showIdModal.bind(this);
    this.validEmail = this.validEmail.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.recharge = this.recharge.bind(this);
    this.didMount = this.didMount.bind(this);
    this.getNextOrder = this.getNextOrder.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.checkPhotoPermission = this.checkPhotoPermission.bind(this);

    this.flatListRef = React.createRef();
  }

  componentDidMount() {
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

    // Logout시에 mount가 새로 되는데 login 페이지로 안가기 위해서 isFocused 조건 추가
    if (!this.props.account.loggedIn && this.props.navigation.isFocused()) {
      this.props.navigation.navigate('Auth');
    } else {
      this.didMount();
    }
  }

  shouldComponentUpdate(nextProps) {
    const {ordersIdx, account = {}} = this.props.order;
    return (
      account.userPictureUrl !== nextProps.account.userPictureUrl ||
      ordersIdx !== nextProps.order.ordersIdx
    );
  }

  componentDidUpdate(prevProps) {
    const focus = this.props.navigation.isFocused();

    // 구매내역 원래 조건 확인
    if (this.state.isFocused !== focus) {
      this.setFocus(focus);
      if (focus) {
        if (!this.props.account.loggedIn) {
          this.props.navigation.navigate('Auth');
        } else {
          this.props.action.order.getOrders(this.props.auth, 0);
        }
      }
    }

    if (this.props.uid && this.props.uid !== prevProps.uid) {
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
  }

  onRefresh() {
    this.setState({
      refreshing: true,
    });

    this.props.action.account.getUserId(
      this.props.account.mobile,
      this.props.auth,
    );
    this.props.action.order.getOrders(this.props.auth, 0).then((resp) => {
      if (resp) {
        this.setState({
          refreshing: false,
        });
      }
    });
  }

  setFocus(focus) {
    this.setState({isFocused: focus});
  }

  getNextOrder() {
    this.props.action.order.getOrders(this.props.auth);
  }

  onPressOrderDetail = (orderId) => () => {
    const {orders, ordersIdx} = this.props.order;
    this.props.navigation.navigate('PurchaseDetail', {
      detail: orders[ordersIdx.get(orderId)],
      auth: this.props.auth,
    });
  };

  copyToClipboard = (value) => () => {
    Clipboard.setString(value);
    this.setState({copyString: value});
    this.props.action.toast.push(Toast.COPY_SUCCESS);
  };

  // RokebiSIm에서 RokebiTalk 호출
  openRokebiTalk = async () => {
    const {iccid, pin} = this.props.account;

    let isRokebiInstalled;

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
      if (isRokebiInstalled)
        Linking.openURL(
          `rokebitalk://rokebitalk.com?actCode=${pin}&iccidStr=${iccid}`,
        );
      Linking.openURL(`http://naver.com`);
    }
  };

  modalBody = () => {
    const {iccid, pin} = this.props.account;
    const {copyString} = this.state;

    return (
      <View style={styles.modalBody}>
        <Text style={[appStyles.normal16Text, {marginBottom: 20}]}>
          {i18n.t('mypage:manualInput:body')}
        </Text>
        <View style={styles.titleAndStatus}>
          <View>
            <Text style={styles.keyTitle}>{i18n.t('mypage:iccid')}</Text>
            <Text style={appStyles.normal18Text}>{iccid}</Text>
          </View>
          <AppButton
            title={i18n.t('copy')}
            titleStyle={styles.btnCopyTitle(copyString === iccid)}
            style={styles.btnCopy(copyString === iccid)}
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
            titleStyle={styles.btnCopyTitle(copyString === pin)}
            style={styles.btnCopy(copyString === pin)}
            onPress={this.copyToClipboard(pin)}
          />
        </View>
        <Pressable
          style={styles.openRokebiTalk}
          // onPress={() => this.openRokebiTalk} // 로깨비톡으로 이동 X
        >
          <View>
            <Text style={[styles.openRokebiTalkText, {color: colors.warmGrey}]}>
              {i18n.t('mypage:openRokebiTalk')}
            </Text>
            <Text style={[styles.openRokebiTalkText, {fontWeight: 'bold'}]}>
              {i18n.t('mypage:preparing')}
            </Text>
          </View>
          <AppIcon name="imgDokebi2" style={{marginRight: 20}} />
        </Pressable>
      </View>
    );
  };

  async didMount() {
    const hasPhotoPermission = await this.checkPhotoPermission();

    this.setState({hasPhotoPermission});

    // if (this.props.uid) this.props.action.order.getOrders(this.props.auth)
  }

  showEmailModal(flag) {
    if (flag && !this.props.uid) {
      this.props.navigation.navigate('Auth');
    }

    this.setState({
      showEmailModal: flag,
    });
  }

  showIdModal(flag = false) {
    this.setState({showIdModal: flag});
  }

  async checkPhotoPermission() {
    if (!this.state.hasPhotoPermission) {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      const result = await check(permission);

      return result === RESULTS.GRANTED;
    }
    return true;
  }

  async changePhoto() {
    const checkNewPermission = await this.checkPhotoPermission();

    if (!this.props.uid) {
      this.props.navigation.navigate('Auth');
    }

    if (this.state.hasPhotoPermission || checkNewPermission) {
      if (ImagePicker) {
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
          .then((image) => {
            console.log('image', image);
            return (
              image && this.props.action.account.uploadAndChangePicture(image)
            );
          })
          .catch((err) => {
            console.log('failed to upload', err);
          });
      }
    } else {
      // 사진 앨범 조회 권한을 요청한다.
      AppAlert.confirm(i18n.t('settings'), i18n.t('acc:permPhoto'), {
        ok: () => openSettings(),
      });
    }
  }

  recharge() {
    if (!this.props.uid) {
      return this.props.navigation.navigate('Auth');
    }

    return this.props.navigation.navigate('Recharge', {mode: 'MyPage'});
  }

  info() {
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
            marginLeft: 20,
            height: 76,
            marginBottom: 30,
          }}>
          <Pressable
            style={{flex: 1, alignSelf: 'center'}}
            onPress={this.changePhoto}>
            <AppUserPic
              url={userPictureUrl}
              icon="imgPeopleL"
              style={styles.userPicture}
              onPress={this.changePhoto}
            />
            <AppIcon
              name="imgPeoplePlus"
              style={{bottom: 20, right: -29, alignSelf: 'center'}}
            />
          </Pressable>
          <View style={{flex: 3, justifyContent: 'center'}}>
            <Text style={styles.label}>{utils.toPhoneNumber(mobile)}</Text>
            <LabelTextTouchable
              key="email"
              label={email}
              labelStyle={styles.value}
              value=""
              arrowStyle={{paddingRight: 20}}
              onPress={() => this.showEmailModal(true)}
              arrow="iconArrowRight"
            />
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {esimApp && (
            <Pressable
              style={styles.btnIdCheck}
              onPress={() => this.showIdModal(true)}>
              <Text style={[appStyles.normal16Text, {textAlign: 'center'}]}>
                {i18n.t('mypage:idCheckTitle')}
              </Text>
            </Pressable>
          )}
          <Pressable
            style={styles.btnContactBoard}
            onPress={() =>
              this.props.navigation.navigate('ContactBoard', {index: 2})
            }>
            <Text style={[appStyles.normal16Text, {textAlign: 'center'}]}>
              {i18n.t('board:mylist')}
            </Text>
          </Pressable>
        </View>
        <View style={styles.divider} />
        <Text style={styles.subTitle}>{i18n.t('acc:purchaseHistory')}</Text>
        <View style={styles.dividerSmall} />
      </View>
    );
  }

  async validEmail(value) {
    const err = validationUtil.validate('email', value);
    if (!_.isEmpty(err)) return err.email;

    const {email} = this.props.account;

    if (email !== value) {
      // check duplicated email
      const resp = await API.User.getByMail(value, this.props.auth);
      if (resp.result === 0 && resp.objects.length > 0) {
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

  changeEmail(mail) {
    const {email} = this.props.account;

    if (email !== mail) {
      this.props.action.account.changeEmail(mail);
      Analytics.trackEvent('Page_View_Count', {page: 'Change Email'});
    }

    this.setState({
      showEmailModal: false,
    });
  }

  empty() {
    if (this.props.pending) return null;

    return <Text style={styles.nolist}>{i18n.t('his:noPurchase')}</Text>;
  }

  renderOrder({item}) {
    return (
      <OrderItem item={item} onPress={this.onPressOrderDetail(item.orderId)} />
    );
  }

  render() {
    const {showEmailModal, showIdModal, refreshing = false} = this.state;
    const {orders, ordersIdx} = this.props.order;

    return (
      <View style={styles.container}>
        <FlatList
          ref={this.flatListRef}
          data={orders}
          extraData={ordersIdx}
          ListHeaderComponent={this.info}
          ListEmptyComponent={this.empty()}
          renderItem={this.renderOrder}
          onEndReachedThreshold={0.4}
          onEndReached={this.getNextOrder}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              colors={[colors.clearBlue]} // android 전용
              tintColor={colors.clearBlue} // ios 전용
            />
          }
        />

        <AppActivityIndicator visible={this.props.pending} />

        <AppModal
          title={i18n.t('acc:changeEmail')}
          mode="edit"
          default={this.props.account.email}
          onOkClose={this.changeEmail}
          onCancelClose={() => this.showEmailModal(false)}
          validateAsync={this.validEmail}
          visible={showEmailModal}
          infoText={i18n.t('mypage:mailInfo')}
        />

        <AppModal
          type="close"
          title={i18n.t('mypage:idCheckTitle')}
          titleStyle={styles.titleStyle}
          titleIcon="btnId"
          body={() => this.modalBody()}
          onOkClose={() => {
            this.showIdModal(false);
          }}
          visible={showIdModal}
        />
      </View>
    );
  }
}

export default connect(
  ({
    cart,
    account,
    order,
    pender,
  }: {
    account: accountActions.AccountModelState;
  }) => ({
    account,
    lastTab: cart.get('lastTab').toJS(),
    order: order.toObject(),
    auth: accountActions.auth(account),
    uid: account.uid,
    pending:
      pender.pending[orderActions.GET_ORDERS] ||
      pender.pending[orderActions.GET_SUBS] ||
      pender.pending[accountActions.CHANGE_EMAIL] ||
      pender.pending[accountActions.UPLOAD_PICTURE] ||
      pender.pending[accountActions.CHANGE_PICTURE] ||
      false,
  }),
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(MyPageScreen);
