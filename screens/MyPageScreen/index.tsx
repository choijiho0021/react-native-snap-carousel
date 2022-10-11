import Clipboard from '@react-native-community/clipboard';
import {useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import ImagePicker from 'react-native-image-crop-picker';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppButton from '@/components/AppButton';
import AppColorText from '@/components/AppColorText';
import AppIcon from '@/components/AppIcon';
import AppModal from '@/components/AppModal';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
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
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import i18n from '@/utils/i18n';
import Info from './components/Info';
import OrderItem from './components/OrderItem';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppSnackBar from '@/components/AppSnackBar';

const styles = StyleSheet.create({
  title: {
    ...appStyles.title,
    marginLeft: 20,
    marginRight: 20,
  },
  container: {
    flex: 1,
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
  email: {
    marginHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: 'white',
  },
});

type MyPageScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'MyPage'
>;

type MyPageScreenProps = {
  navigation: MyPageScreenNavigationProp;

  account: AccountModelState;
  order: OrderModelState;

  pending: boolean;

  action: {
    toast: ToastAction;
    order: OrderAction;
    account: AccountAction;
  };
};

const MyPageScreen: React.FC<MyPageScreenProps> = ({
  navigation,
  account,
  order,
  pending,
  action,
}) => {
  const {uid} = account;
  const flatListRef = useRef<FlatList>(null);
  const [hasPhotoPermission, setHasPhotoPermission] = useState(false);
  const [showIdModal, setShowIdModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isRokebiInstalled, setIsRokebiInstalled] = useState(false);
  const [copyString, setCopyString] = useState('');
  const [showSnackBar, setShowSnackbar] = useState(false);

  const checkPhotoPermission = useCallback(async () => {
    if (!hasPhotoPermission) {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      const result = await check(permission);

      return result === RESULTS.GRANTED;
    }
    return true;
  }, [hasPhotoPermission]);

  useEffect(() => {
    async function didMount() {
      const perm = await checkPhotoPermission();

      setHasPhotoPermission(perm);

      // if (this.props.uid) this.props.action.order.getOrders(this.props.auth)
    }

    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <View style={{flexDirection: 'row'}}>
          <AppText style={styles.title}>{i18n.t('acc:title')}</AppText>
          {/* <AppButton
            // style={{marginLeft: }}
            titleStyle={{color: 'white'}}
            title={i18n.t('esim:pedometer:title')}
            onPress={() => navigation.navigate('Pedometer')}
          /> */}
        </View>
      ),
      headerRight: () => (
        <AppSvgIcon
          name="btnSetup"
          style={styles.settings}
          onPress={() => navigation.navigate('Settings')}
        />
      ),
    });

    // Logout시에 mount가 새로 되는데 login 페이지로 안가기 위해서 isFocused 조건 추가
    if (!account.loggedIn && navigation.isFocused()) {
      navigation.navigate('Auth');
    } else {
      didMount();
    }
  }, [account.loggedIn, checkPhotoPermission, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const {loggedIn, mobile, token} = account;
      if (!loggedIn) {
        navigation.navigate('Auth');
      } else {
        action.order.getOrders({user: mobile, token, page: 0});
        flatListRef.current?.scrollToOffset({animated: false, offset: 0});
      }
    }, [account, action.order, navigation]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    const {mobile, token, iccid} = account;

    action.account.getUserId({
      name: mobile,
      token,
    });

    action.order.getOrders({user: mobile, token, page: 0}).then((resp) => {
      if (resp) {
        action.account.getAccount({iccid, token}).then((r) => {
          if (r) setRefreshing(false);
        });
      }
    });
  }, [account, action.account, action.order]);

  const getNextOrder = useCallback(() => {
    const {mobile, token} = account;
    action.order.getOrders({user: mobile, token});
  }, [account, action.order]);

  const onPressOrderDetail = useCallback(
    (orderId: number) => {
      navigation.navigate('PurchaseDetail', {
        detail: order.orders.get(orderId),
      });
    },
    [navigation, order],
  );

  const copyToClipboard = useCallback((value?: string) => {
    if (value) {
      Clipboard.setString(value);
      setCopyString(value);
      setShowSnackbar(true);
    }
  }, []);

  // RokebiSIm에서 RokebiTalk 호출
  const openRokebiTalk = useCallback(async () => {
    const {iccid, pin} = account;

    // let isRokebiInstalled;

    // 네이버URL -> Store URL 변경필요
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        if (!isRokebiInstalled) {
          Linking.openURL(`http://naver.com`);
        }
      }, 1000);

      const installed = await Linking.openURL(
        `rokebitalk://?actCode=${pin}&iccidStr=${iccid}`,
      );
      setIsRokebiInstalled(true);
    } else {
      const installed = await Linking.canOpenURL(
        `rokebitalk://rokebitalk.com?actCode=${pin}&iccidStr=${iccid}`,
      );
      if (installed)
        Linking.openURL(
          `rokebitalk://rokebitalk.com?actCode=${pin}&iccidStr=${iccid}`,
        );
      else Linking.openURL(`http://naver.com`);
    }
  }, [account, isRokebiInstalled]);

  const modalBody = useCallback(() => {
    const {iccid, pin} = account;

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
            onPress={() => copyToClipboard(iccid)}
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
            onPress={() => copyToClipboard(pin)}
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
  }, [account, copyString, copyToClipboard]);

  const changePhoto = useCallback(async () => {
    const checkNewPermission = await checkPhotoPermission();

    if (!uid) {
      navigation.navigate('Auth');
    } else if (hasPhotoPermission || checkNewPermission) {
      if (ImagePicker) {
        ImagePicker.openPicker({
          width: 76 * 3,
          height: 76 * 3,
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
            return image && action.account.uploadAndChangePicture(image);
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
  }, [
    action.account,
    checkPhotoPermission,
    hasPhotoPermission,
    navigation,
    uid,
  ]);

  const empty = useCallback(
    () =>
      pending ? null : (
        <AppText style={styles.nolist}>{i18n.t('his:noPurchase')}</AppText>
      ),
    [pending],
  );

  const renderOrder = useCallback(
    ({item}) => {
      const orderItem = order.orders.get(item);
      return orderItem ? (
        <OrderItem
          item={orderItem}
          onPress={() => onPressOrderDetail(orderItem.orderId)}
        />
      ) : null;
    },
    [onPressOrderDetail, order],
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={{flex: 1}}
        ref={flatListRef}
        data={order.orderList}
        keyExtractor={(item) => `${item}`}
        ListHeaderComponent={<Info onChangePhoto={changePhoto} />}
        ListEmptyComponent={empty()}
        renderItem={renderOrder}
        onEndReachedThreshold={0.4}
        onEndReached={getNextOrder}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.clearBlue]} // android 전용
            tintColor={colors.clearBlue} // ios 전용
          />
        }
      />

      <AppActivityIndicator visible={!refreshing && pending} />

      <AppModal
        type="close"
        title={i18n.t('mypage:idCheckTitle')}
        titleStyle={styles.titleStyle}
        titleIcon="btnId"
        onOkClose={() => {
          setShowIdModal(false);
        }}
        visible={showIdModal}>
        {modalBody()}
      </AppModal>
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackbar(false)}
        textMessage={i18n.t('copyMsg')}
      />
    </View>
  );
};

export default connect(
  ({account, order, status}: RootState) => ({
    account,
    order,
    pending:
      status.pending[orderActions.getOrders.typePrefix] ||
      status.pending[orderActions.getSubs.typePrefix] ||
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
