import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppButton from '@/components/AppButton';
import AppColorText from '@/components/AppColorText';
import AppIcon from '@/components/AppIcon';
import AppModal from '@/components/AppModal';
import AppModalForm from '@/components/AppModalForm';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {
  AccountAction,
  AccountModelState,
  actions as accountActions,
} from '@/redux/modules/account';
import {
  actions as orderActions,
  OrderAction,
  OrderModelState,
} from '@/redux/modules/order';
import {
  actions as toastActions,
  Toast,
  ToastAction,
} from '@/redux/modules/toast';
import i18n from '@/utils/i18n';
import validationUtil, {ValidationResult} from '@/utils/validationUtil';
import Clipboard from '@react-native-community/clipboard';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {Component} from 'react';
import {
  FlatList,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
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
import Info from './components/Info';
import OrderItem from './components/OrderItem';

const ImagePicker = require('react-native-image-crop-picker').default;

const styles = StyleSheet.create({
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  nolist: {
    marginVertical: 60,
    textAlign: 'center',
  },
  settings: {
    marginRight: 20,
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
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
  btnCopy: {
    backgroundColor: colors.white,
    width: 62,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 1,
    marginLeft: 20,
  },
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

type MyPageScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'MyPage'
>;

type MyPageScreenRouteProp = RouteProp<HomeStackParamList, 'MyPage'>;

type MyPageScreenProps = {
  navigation: MyPageScreenNavigationProp;
  route: MyPageScreenRouteProp;

  account: AccountModelState;
  order: OrderModelState;

  pending: boolean;
  uid?: number;
  lastTab: string[];

  action: {
    toast: ToastAction;
    order: OrderAction;
    account: AccountAction;
  };
};

type MyPageScreenState = {
  hasPhotoPermission: boolean;
  showEmailModal: boolean;
  showIdModal: boolean;
  isFocused: boolean;
  refreshing: boolean;
  isRokebiInstalled: boolean;
  copyString: string;
};
class MyPageScreen extends Component<MyPageScreenProps, MyPageScreenState> {
  flatListRef: React.RefObject<FlatList>;

  constructor(props: MyPageScreenProps) {
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

    this.flatListRef = React.createRef<FlatList>();
  }

  componentDidMount() {
    const {navigation, account} = this.props;

    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppText style={styles.title}>{i18n.t('acc:title')}</AppText>
      ),
      headerRight: () => (
        <AppButton
          key="cnter"
          style={styles.settings}
          onPress={() => navigation.navigate('Settings')}
          iconName="btnSetup"
        />
      ),
    });

    // Logout시에 mount가 새로 되는데 login 페이지로 안가기 위해서 isFocused 조건 추가
    if (!account.loggedIn && navigation.isFocused()) {
      navigation.navigate('Auth');
    } else {
      this.didMount();
    }
  }

  shouldComponentUpdate(nextProps: MyPageScreenProps) {
    return (
      this.props.account.userPictureUrl !== nextProps.account.userPictureUrl ||
      this.props.order.orders !== nextProps.order.orders ||
      this.props.navigation.isFocused() ||
      this.props.pending !== nextProps.pending
    );
  }

  componentDidUpdate(prevProps: MyPageScreenProps) {
    const {
      navigation,
      lastTab,
      uid,
      account: {loggedIn, mobile, token},
    } = this.props;

    const focus = navigation.isFocused();

    // 구매내역 원래 조건 확인
    if (this.state.isFocused !== focus) {
      this.setFocus(focus);
      if (focus) {
        if (!loggedIn) {
          navigation.navigate('Auth');
        } else {
          this.props.action.order.getOrders({user: mobile, token, page: 0});
        }
      }
    }

    if (uid && uid !== prevProps.account.uid) {
      // reload order history
      this.props.action.order.getOrders({user: mobile, token, page: 0});
    }

    if (
      lastTab[0] === 'MyPageStack' &&
      lastTab[0] !== prevProps.lastTab[0] &&
      this.flatListRef.current
    ) {
      this.flatListRef.current.scrollToOffset({animated: false, y: 0});
    }
  }

  onRefresh() {
    this.setState({
      refreshing: true,
    });

    const {
      account: {mobile, token},
    } = this.props;

    this.props.action.account.getUserId({
      name: mobile,
      token,
    });

    this.props.action.order
      .getOrders({user: mobile, token, page: 0})
      .then((resp) => {
        if (resp) {
          this.setState({
            refreshing: false,
          });
        }
      });
  }

  setFocus(focus: boolean) {
    this.setState({isFocused: focus});
  }

  getNextOrder() {
    const {
      account: {mobile, token},
    } = this.props;
    this.props.action.order.getOrders({user: mobile, token});
  }

  onPressOrderDetail = (orderId: number) => () => {
    const {orders} = this.props.order;
    this.props.navigation.navigate('PurchaseDetail', {
      detail: orders.get(orderId),
    });
  };

  copyToClipboard = (value?: string) => () => {
    if (value) {
      Clipboard.setString(value);
      this.setState({copyString: value});
      this.props.action.toast.push(Toast.COPY_SUCCESS);
    }
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
        <AppColorText
          style={[appStyles.normal16Text, {marginBottom: 20}]}
          text={i18n.t('mypage:manualInput:body')}
        />
        <View style={styles.titleAndStatus}>
          <View style={{flex: 9}}>
            <AppText style={styles.keyTitle}>{i18n.t('mypage:iccid')}</AppText>
            <AppText style={appStyles.normal18Text}>{iccid}</AppText>
          </View>
          <AppButton
            title={i18n.t('copy')}
            titleStyle={[
              appStyles.normal14Text,
              {color: copyString === iccid ? colors.clearBlue : colors.black},
            ]}
            style={[
              styles.btnCopy,
              {
                borderColor:
                  copyString === iccid ? colors.clearBlue : colors.whiteTwo,
              },
            ]}
            onPress={this.copyToClipboard(iccid)}
          />
        </View>
        <View style={styles.titleAndStatus}>
          <View style={{flex: 9}}>
            <AppText style={styles.keyTitle}>
              {i18n.t('mypage:activationCode')}
            </AppText>
            <AppText style={appStyles.normal18Text}>{pin}</AppText>
          </View>
          <AppButton
            title={i18n.t('copy')}
            titleStyle={[
              appStyles.normal14Text,
              {color: copyString === pin ? colors.clearBlue : colors.black},
            ]}
            style={[
              styles.btnCopy,
              {
                borderColor:
                  copyString === pin ? colors.clearBlue : colors.whiteTwo,
              },
            ]}
            onPress={this.copyToClipboard(pin)}
          />
        </View>
        <Pressable
          style={styles.openRokebiTalk}
          // onPress={() => this.openRokebiTalk} // 로깨비톡으로 이동 X
        >
          <View>
            <AppText
              style={[styles.openRokebiTalkText, {color: colors.warmGrey}]}>
              {i18n.t('mypage:openRokebiTalk')}
            </AppText>
            <AppText style={[styles.openRokebiTalkText, {fontWeight: 'bold'}]}>
              {i18n.t('mypage:preparing')}
            </AppText>
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

  showEmailModal(flag: boolean) {
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

  async validEmail(value: string): Promise<ValidationResult | undefined> {
    const err = validationUtil.validate('email', value);
    if (!_.isEmpty(err)) return err;

    const {email, token} = this.props.account;

    if (email !== value) {
      // check duplicated email
      const resp = await API.User.getByMail({mail: value, token});
      if (resp.result === 0 && resp.objects.length > 0) {
        // duplicated email
        return {email: [i18n.t('acc:duplicatedEmail')]};
      }
    } else {
      this.setState({
        showEmailModal: false,
      });
    }

    return undefined;
  }

  changeEmail(mail?: string) {
    const {email} = this.props.account;

    if (mail && email !== mail) {
      this.props.action.account.changeEmail(mail);
      Analytics.trackEvent('Page_View_Count', {page: 'Change Email'});
    }

    this.setState({
      showEmailModal: false,
    });
  }

  empty() {
    if (this.props.pending) return null;

    return <AppText style={styles.nolist}>{i18n.t('his:noPurchase')}</AppText>;
  }

  renderOrder({item}: {item: number}) {
    const {orders} = this.props.order;
    const orderItem = orders.get(item);
    return orderItem ? (
      <OrderItem
        item={orderItem}
        onPress={this.onPressOrderDetail(orderItem.orderId)}
      />
    ) : null;
  }

  render() {
    const {showEmailModal, showIdModal, refreshing = false} = this.state;
    const {orderList} = this.props.order;

    return (
      <View style={styles.container}>
        <FlatList
          ref={this.flatListRef}
          data={orderList}
          keyExtractor={(item) => `${item}`}
          ListHeaderComponent={
            <Info
              onChangePhoto={this.changePhoto}
              onPress={(key: 'id' | 'email') => {
                if (key === 'id') this.props.navigation.navigate('Faq');
                // if (key === 'id') this.showIdModal(true);
                else this.showEmailModal(true);
              }}
            />
          }
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

        <AppActivityIndicator visible={!refreshing && this.props.pending} />

        <AppModalForm
          title={i18n.t('acc:changeEmail')}
          defaultValue={this.props.account.email}
          valueType="email"
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
          onOkClose={() => {
            this.showIdModal(false);
          }}
          visible={showIdModal}>
          {this.modalBody()}
        </AppModal>
      </View>
    );
  }
}

export default connect(
  ({cart, account, order, status}: RootState) => ({
    account,
    lastTab: cart.lastTab.toArray(),
    order,
    auth: accountActions.auth(account),
    uid: account.uid,
    pending:
      status.pending[orderActions.getOrders.typePrefix] ||
      status.pending[orderActions.getSubs.typePrefix] ||
      status.pending[accountActions.changeEmail.typePrefix] ||
      status.pending[accountActions.uploadPicture.typePrefix] ||
      status.pending[accountActions.uploadAndChangePicture.typePrefix] ||
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
