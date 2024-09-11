import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators, RootState} from 'redux';
import Video from 'react-native-video';
import moment from 'moment';
import {HomeStackParamList} from '@/navigation/navigation';
import {
  actions as cartActions,
  CartAction,
  CartModelState,
} from '@/redux/modules/cart';
import {
  ProductAction,
  actions as productActions,
} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import AppPaymentGateway, {
  PaymentResultCallbackParam,
} from '@/components/AppPaymentGateway';
import {AccountModelState} from '@/redux/modules/account';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import AppAuthGateway from './AuthGateway';

const {isIOS} = Env.get();

type PaymentGatewayScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'PaymentGateway'
>;

type PaymentGatewayScreenRouteProp = RouteProp<
  HomeStackParamList,
  'PaymentGateway'
>;

type PaymentGatewayScreenProps = {
  navigation: PaymentGatewayScreenNavigationProp;
  route: PaymentGatewayScreenRouteProp;
  account: AccountModelState;
  cart: CartModelState;

  action: {
    cart: CartAction;
    product: ProductAction;
  };
};

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 80,
    right: 0,
  },
  loadingShadowBox: {
    elevation: 32,
    shadowColor: 'rgba(166, 168, 172, 0.24)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
  },
  loadingContainer: {
    backgroundColor: 'white',

    height: 200,
    marginTop: 10,
  },
  head: {
    height: 74,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 6,
  },
});

const AuthGatewayScreen: React.FC<AuthGatewayScreenProps> = ({
  route: {params},
  navigation,
  account,
  action,
  cart,
}) => {
  const [isOrderReady, setIsOrderReady] = useState(false);

  const callback = useCallback(
    async (status: PaymentResultCallbackParam, errorMsg?: string) => {},
    [],
  );

  useEffect(() => {
    setIsOrderReady(true);
  }, []);

  const renderLoading = useCallback(() => {
    const isKST = moment().format().includes('+09:00');

    return (
      <>
        <View style={{flex: 1, alignItems: 'stretch'}}>
          {/* <AppText style={styles.infoText}>{i18n.t('pym:loadingInfo')}</AppText> */}
        </View>
        {true && (
          <View
            style={[
              styles.loadingShadowBox,
              !isIOS && {shadowColor: 'rgb(52, 62, 95)'},
            ]}>
            <View style={styles.loadingContainer}>
              <View style={styles.head}>
                <AppText style={appStyles.bold18Text}>
                  {i18n.t('pym:wait:title')}
                </AppText>
              </View>
              <View>
                <AppText
                  style={{
                    ...appStyles.normal16Text,
                    paddingHorizontal: 20,
                  }}>
                  {i18n.t(isKST ? 'pym:wait:kst' : 'pym:wait:another')}
                </AppText>
              </View>
            </View>
          </View>
        )}
      </>
    );
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={appStyles.header}>
        <AppBackButton
          title={i18n.t(params?.isPaid ? 'his:AuthCompleted' : 'Auth')}
          disabled={params.isPaid}
          showIcon={!params.isPaid}
        />
      </View>

      {/* {renderLoading()} */}
      {isOrderReady ? (
        <AppAuthGateway info={params} callback={callback} />
      ) : (
        renderLoading()
      )}
    </SafeAreaView>
  );
};

export default connect(
  ({account, cart}: RootState) => ({account, cart}),
  (dispatch) => ({
    action: {
      cart: bindActionCreators(cartActions, dispatch),
      product: bindActionCreators(productActions, dispatch),
    },
  }),
)(AuthGatewayScreen);
