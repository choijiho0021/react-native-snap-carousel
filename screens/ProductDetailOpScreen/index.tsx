/* eslint-disable no-param-reassign */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppEventsLogger} from 'react-native-fbsdk';
import {getTrackingStatus} from 'react-native-tracking-transparency';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import AppTextInput from '@/components/AppTextInput';
import StoreList from '@/components/StoreList';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {RkbProduct} from '@/redux/api/productApi';
import {
  actions as productActions,
  ProductAction,
  ProductModelState,
} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import {retrieveData, storeData} from '@/utils/utils';
import {SafeAreaView} from 'react-native';
import AppIcon from '@/components/AppIcon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    marginHorizontal: 20,
    marginTop: 30,
    ...appStyles.normal18Text,
  },
  subTitle: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 36,
    ...appStyles.normal14Text,
  },
  divider: {
    height: 10,
    backgroundColor: colors.whiteTwo,
  },
  showSearchBar: {
    marginBottom: 48,
    marginHorizontal: 20,
    backgroundColor: colors.white,
    height: 43,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: colors.black,
    flexDirection: 'row',
  },
});

type ProductDetailOpScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'StoreSearch'
>;

type ProductDetailOpScreenRouteProp = RouteProp<
  HomeStackParamList,
  'StoreSearch'
>;

type ProductDetailOpScreenProps = {
  navigation: ProductDetailOpScreenNavigationProp;
  route: ProductDetailOpScreenRouteProp;

  product: ProductModelState;
  action: {
    product: ProductAction;
  };
};

const ProductDetailOpScreen: React.FC<ProductDetailOpScreenProps> = ({
  navigation,
  route,
  product,
  action,
}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={route.params?.title} />,
    });

    setData(
      route.params.apn
        .split(',')
        .map((elm) => elm.split('/'))
        .map((elm2) => ({
          country: elm2[0],
          operator: elm2[1],
          apn: elm2[2] ? elm2[2].split('&') : [],
        })),
    );
  }, [navigation, route.params.apn, route.params?.title]);

  return (
    <SafeAreaView style={styles.container}>
      <AppText style={styles.title}>{i18n.t('prodDetailOp:title')}</AppText>
      <AppText style={styles.subTitle}>
        {i18n.t('prodDetailOp:subTitle')}
      </AppText>

      <View style={styles.showSearchBar}>
        <AppTextInput
          style={[appStyles.normal16Text, {color: colors.clearBlue, flex: 1}]}
          placeholder={i18n.t('prodDetailOp:search')}
        />
        <AppIcon name={'btnSearchBlue'} />
      </View>

      <AppText>{route.params.apn}</AppText>

      <View style={styles.divider} />
    </SafeAreaView>
  );
};

export default connect(
  ({product}: RootState) => ({product}),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
    },
  }),
)(ProductDetailOpScreen);
