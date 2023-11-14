/* eslint-disable consistent-return */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState, useMemo, useRef} from 'react';
import {Animated, SafeAreaView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {Map as ImmutableMap} from 'immutable';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {RkbProduct} from '@/redux/api/productApi';
import {actions as cartActions} from '@/redux/modules/cart';
import {
  ProductAction,
  actions as productActions,
  ProductModelState,
} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import ProductImg from '@/components/ProductImg';
import ProdByType from '@/components/ProdByType';
import ChatTalk from '@/components/ChatTalk';
import Env from '@/environment';
import TabBar from './TabBar';
import {bindActionCreators} from 'redux';
import ToolTip from './ToolTip';

const {isIOS} = Env.get();

const Tab = createMaterialTopTabNavigator();

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
  box: {
    height: 150,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.white,
    alignItems: 'center',
  },
});

type CountryScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Country'
>;

type CountryScreenRouteProp = RouteProp<HomeStackParamList, 'Country'>;

type CountryScreenProps = {
  navigation: CountryScreenNavigationProp;
  route: CountryScreenRouteProp;

  product: ProductModelState;
  pending: boolean;

  action: {
    product: ProductAction;
  };
};

// type ProdDataType = {title: string; data: RkbProduct[]};

const CountryScreen: React.FC<CountryScreenProps> = (props) => {
  const {navigation, route, product, action} = props;
  const {localOpList, prodByLocalOp, prodList} = product;

  const [prodData, setProdData] = useState<RkbProduct[][]>([]);
  const [imageUrl, setImageUrl] = useState<string>();
  const [localOpDetails, setLocalOpDetails] = useState<string>();
  const [partnerId, setPartnerId] = useState<string>();
  const isTop = useRef(true);
  const blockAnimation = useRef(false);
  const headerTitle = useMemo(
    () => API.Product.getTitle(localOpList.get(route.params?.partner[0])),
    [localOpList, route.params?.partner],
  );
  const animatedValue = useRef(new Animated.Value(150)).current;

  useEffect(() => {
    if (route.params?.partner) {
      const partnerIds = route.params.partner;

      const localOp = localOpList.get(partnerIds[0]);
      setPartnerId(partnerIds[0]);

      setImageUrl(localOp?.imageUrl);
      setLocalOpDetails(localOp?.detail);
      if (partnerIds.every((elm) => prodByLocalOp.has(elm))) {
        action.product.makeProdData({prodList, prodByLocalOp, partnerIds});
        // setProdData(makeProdData(prodList, prodByLocalOp, partnerIds));
      }
    }
  }, [
    action.product,
    localOpList,
    prodByLocalOp,
    prodList,
    route.params.partner,
  ]);

  useEffect(() => {
    setProdData(product.prodData);
  }, [product.prodData]);

  const onPress = useCallback(
    (prod: RkbProduct) =>
      navigation.navigate('ProductDetail', {
        title: prod.name,
        item: API.Product.toPurchaseItem(prod),
        img: imageUrl,
        uuid: prod.uuid,
        desc: prod.desc,
        localOpDetails,
        partnerId,
      }),
    [imageUrl, localOpDetails, navigation, partnerId],
  );

  const onTop = useCallback(
    (v: boolean) => {
      isTop.current = v;

      if (!blockAnimation.current) {
        blockAnimation.current = true;
        Animated.timing(animatedValue, {
          toValue: isTop.current ? 150 : 0,
          duration: 500,
          useNativeDriver: false,
        }).start(() => {
          blockAnimation.current = false;
        });
      }
    },
    [animatedValue],
  );

  const renderProdType = useCallback(
    (key: 'daily' | 'total') => () =>
      (
        <ProdByType
          prodData={prodData[key === 'daily' ? 0 : 1]}
          prodType={key}
          onTop={onTop}
          onPress={onPress}
          isCharge={false}
        />
      ),
    [onPress, onTop, prodData],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppBackButton
          title={headerTitle}
          style={{marginRight: 10, height: 56}}
          onPress={() => {
            navigation.goBack();
          }}
        />
        {(headerTitle.includes('(로컬망)') ||
          headerTitle.includes('(local)')) && <ToolTip />}
      </View>

      {imageUrl && (
        <Animated.View style={{height: animatedValue}}>
          <ProductImg
            imageStyle={styles.box}
            source={{uri: API.default.httpImageUrl(imageUrl)}}
          />
        </Animated.View>
      )}

      {prodData.length > 0 ? (
        <Tab.Navigator
          initialRouteName={prodData[0].length === 0 ? 'total' : 'daily'}
          tabBar={(props) => <TabBar {...props} />}
          sceneContainerStyle={{backgroundColor: colors.white}}>
          {['daily', 'total'].map((k) => (
            <Tab.Screen
              key={k}
              name={k}
              component={renderProdType(k)}
              options={{lazy: true, title: i18n.t(`country:${k}`)}}
            />
          ))}
        </Tab.Navigator>
      ) : null}

      <AppActivityIndicator visible={props.pending} />
      <ChatTalk visible bottom={isIOS ? 100 : 70} />
    </SafeAreaView>
  );
};

export default connect(
  ({product, status}: RootState) => ({
    product,
    pending:
      status.pending[cartActions.cartAddAndGet.typePrefix] ||
      status.pending[cartActions.checkStockAndPurchase.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
    },
  }),
)(CountryScreen);
