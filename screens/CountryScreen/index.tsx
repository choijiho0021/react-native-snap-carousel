/* eslint-disable consistent-return */
import {RouteProp, useIsFocused} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState, useMemo, useRef} from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  View,
  Pressable,
} from 'react-native';
import {connect} from 'react-redux';
import {Map as ImmutableMap} from 'immutable';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {RkbProduct} from '@/redux/api/productApi';
import {actions as cartActions} from '@/redux/modules/cart';
import {ProductModelState} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import ProductImg from '@/components/ProductImg';
import ProdByType from '@/components/ProdByType';
import ChatTalk from '@/components/ChatTalk';
import Env from '@/environment';
import TabBar from './TabBar';
import ToolTip from './ToolTip';
import BackbuttonHandler from '@/components/BackbuttonHandler';
import AppText from '@/components/AppText';
import AppSvgIcon from '@/components/AppSvgIcon';
import {appStyles} from '@/constants/Styles';

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
  headPress: {
    marginRight: 10,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
});

export const makeProdData = (
  prodList: ImmutableMap<string, RkbProduct>,
  prodByLocalOp: ImmutableMap<string, string[]>,
  partnerIds: string[],
) => {
  const prodByPartners = partnerIds.map((partnerId) =>
    prodByLocalOp.get(partnerId)?.map((k) => prodList.get(k)),
  );

  const list: RkbProduct[][] = prodByPartners
    ?.reduce((acc, cur) => (cur ? acc.concat(cur.filter((c) => !!c)) : acc), [])
    ?.reduce(
      (acc, cur) =>
        cur?.field_daily === 'daily'
          ? [acc[0].concat(cur), acc[1]]
          : [acc[0], acc[1].concat(cur)],
      [[], []],
    ) || [[], []];

  return [
    list[0].sort((a, b) => b.weight - a.weight) || [],
    list[1].sort((a, b) => b.weight - a.weight) || [],
  ];
};

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
};

// type ProdDataType = {title: string; data: RkbProduct[]};
export type SelectedTabType = {
  type?: string;
  volume?: String;
  scroll?: string;
};

const CountryScreen: React.FC<CountryScreenProps> = (props) => {
  const {navigation, route, product} = props;
  const {localOpList, prodByLocalOp, prodList} = product;

  const [prodData, setProdData] = useState<RkbProduct[][]>([]);
  const [imageUrl, setImageUrl] = useState<string>();
  const [localOpDetails, setLocalOpDetails] = useState<string>();
  const isTop = useRef(true);
  const blockAnimation = useRef(false);
  const headerTitle = useMemo(
    () => API.Product.getTitle(localOpList.get(route.params?.partner[0])),
    [localOpList, route.params?.partner],
  );
  const [selectedTab, setSelectedTab] = useState({
    type: route.params?.type,
    volume: route.params?.volume,
    scroll: route.params?.scroll,
  });
  const animatedValue = useRef(new Animated.Value(150)).current;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (route.params?.partner) {
      const partnerIds = route.params.partner;

      const localOp = localOpList.get(partnerIds[0]);

      setImageUrl(localOp?.imageUrl);
      setLocalOpDetails(localOp?.detail);

      if (partnerIds.some((elm) => prodByLocalOp.has(elm))) {
        setProdData(makeProdData(prodList, prodByLocalOp, partnerIds));
      }
    }
  }, [localOpList, prodByLocalOp, prodList, route.params.partner]);

  const onPress = useCallback(
    (prod: RkbProduct) => {
      setSelectedTab({
        type: undefined,
        volume: undefined,
        scroll: undefined,
      });

      navigation.navigate('ProductDetail', {
        title: prod.name,
        item: API.Product.toPurchaseItem(prod),
        img: imageUrl,
        uuid: prod.uuid,
        desc: prod.desc,
        price: prod.price,
        listPrice: prod.listPrice,
        localOpDetails,
        partnerId: prod.partnerId,
        partner: localOpList.get(prod.partnerId)?.partner,
        prod,
      });
    },
    [imageUrl, localOpDetails, localOpList, navigation],
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
          selectedTabParam={key === selectedTab?.type ? selectedTab : undefined}
        />
      ),
    [onPress, onTop, prodData, selectedTab],
  );

  BackbuttonHandler({
    navigation,
  });

  const renderSelectedPane = useCallback(() => {
    return prodData.length > 0 && isFocused ? (
      <Tab.Navigator
        initialRouteName={
          prodData[0].length === 0 || selectedTab.type === 'total'
            ? 'total'
            : 'daily'
        }
        tabBar={(props) => <TabBar {...props} />}
        sceneContainerStyle={{backgroundColor: colors.white}}>
        {['daily', 'total'].map((k) => (
          <Tab.Screen
            key={k}
            name={k}
            component={renderProdType(k)}
            options={{
              lazy: true,
              title: i18n.t(`country:${k}`),
              swipeEnabled: false,
            }}
          />
        ))}
      </Tab.Navigator>
    ) : null;
  }, [isFocused, prodData, renderProdType, selectedTab.type]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.headPress}
          onPress={() => {
            navigation.goBack();
          }}>
          <AppSvgIcon name="btnBack" />
          <AppText style={[appStyles.subTitle, {marginLeft: 16, fontSize: 20}]}>
            {headerTitle}
          </AppText>
        </Pressable>
        {(headerTitle.includes('(로컬망)') ||
          headerTitle.includes('(local)')) &&
          isFocused && <ToolTip />}
      </View>

      {imageUrl && (
        <Animated.View style={{height: animatedValue}}>
          <ProductImg
            imageStyle={styles.box}
            source={{uri: API.default.httpImageUrl(imageUrl)}}
          />
        </Animated.View>
      )}

      {renderSelectedPane()}

      <AppActivityIndicator visible={props.pending} />
      <ChatTalk visible bottom={isIOS ? 100 : 70} />
    </SafeAreaView>
  );
};

export default connect(({product, status}: RootState) => ({
  product,
  pending: status.pending[cartActions.cartAddAndGet.typePrefix] || false,
}))(CountryScreen);
