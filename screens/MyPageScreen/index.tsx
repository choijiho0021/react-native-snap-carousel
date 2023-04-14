import {useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Platform,
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
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
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
import i18n from '@/utils/i18n';
import Info from './components/Info';
import OrderItem from './components/OrderItem';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppSnackBar from '@/components/AppSnackBar';
import ChatTalk from '@/components/ChatTalk';

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
  const [refreshing, setRefreshing] = useState(false);
  const [showSnackBar, setShowSnackbar] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();

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

      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackbar(false)}
        textMessage={i18n.t('copyMsg')}
      />

      <ChatTalk visible bottom={100 - tabBarHeight} />
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
    },
  }),
)(MyPageScreen);
