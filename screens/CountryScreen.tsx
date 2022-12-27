/* eslint-disable consistent-return */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {Image, SafeAreaView, SectionList, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {Map as ImmutableMap} from 'immutable';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {RkbProduct} from '@/redux/api/productApi';
import {actions as cartActions} from '@/redux/modules/cart';
import {ProductModelState} from '@/redux/modules/product';
import i18n from '@/utils/i18n';
import {device, windowWidth} from '@/constants/SliderEntry.style';
import CountryListItem from './HomeScreen/component/CountryListItem';
import ChannelTalk from '../components/ChannelTalk';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
  box: {
    height: 150,
    marginBottom: 8,
    // resizeMode: 'cover'
  },
  divider: {
    height: 10,
    backgroundColor: colors.whiteTwo,
    marginTop: 32,
  },
  textView: {
    flex: 1,
    alignItems: 'flex-start',
  },
  sectionHeader: {
    paddingTop: 32,
    paddingBottom: 20,
    marginHorizontal: 20,
    backgroundColor: colors.white,
  },
  detail: {
    height: windowWidth > device.small.window.width ? 48 : 36,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.black,
    marginTop: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    paddingLeft: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
});

export const makeProdData = (
  prodByPartner: ImmutableMap<string, RkbProduct[]>,
  partnerIds: string[],
) => {
  const prodByPartners = partnerIds.map((partnerId) =>
    prodByPartner.get(partnerId),
  );

  const list: RkbProduct[][] = prodByPartners
    ?.reduce((acc, cur) => (cur ? acc.concat(cur.filter((c) => !!c)) : acc), [])
    .reduce(
      (acc, cur) =>
        cur?.field_daily === 'daily'
          ? [acc[0].concat(cur), acc[1]]
          : [acc[0], acc[1].concat(cur)],
      [[], []],
    ) || [[], []];

  return [
    {
      title: 'daily',
      data: list[0].sort((a, b) => b.weight - a.weight) || [],
    },
    {
      title: 'total',
      data: list[1].sort((a, b) => b.weight - a.weight) || [],
    },
  ];
};

const position = (idx, arr) => {
  if (arr.length > 1) {
    if (idx === 0) return 'head';
    if (idx === arr.length - 1) return 'tail';
    return 'middle';
  }
  return 'onlyOne';
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

type ProdDataType = {title: string; data: RkbProduct[]};

const CountryScreen: React.FC<CountryScreenProps> = (props) => {
  const {navigation, route, product} = props;
  const {localOpList, prodByLocalOp, prodList, prodByPartner} = product;

  const [prodData, setProdData] = useState<ProdDataType[]>([]);
  const [imageUrl, setImageUrl] = useState<string>();
  const [localOpDetails, setLocalOpDetails] = useState<string>();
  const [partnerId, setPartnerId] = useState<string>();
  const headerTitle = useMemo(
    () => API.Product.getTitle(localOpList.get(route.params?.partner[0])),
    [localOpList, route.params?.partner],
  );
  // prodByPartner

  useEffect(() => {
    if (route.params?.partner) {
      const partnerIds = route.params.partner;

      const localOp = localOpList.get(partnerIds[0]);
      setPartnerId(partnerIds[0]);

      setImageUrl(localOp?.imageUrl);
      setLocalOpDetails(localOp?.detail);

      setProdData(makeProdData(prodByPartner, partnerIds));
    }
  }, [
    localOpList,
    prodByLocalOp,
    prodByPartner,
    prodList,
    route.params.partner,
  ]);

  const renderItem = useCallback(
    ({item, index, section}) => (
      <CountryListItem
        key={item.sku}
        item={item}
        onPress={() =>
          navigation.navigate('ProductDetail', {
            title: item.name,
            item: API.Product.toPurchaseItem(item),
            img: imageUrl,
            uuid: item.uuid,
            desc: item.desc,
            localOpDetails,
            partnerId,
          })
        }
        position={position(index, section.data)}
      />
    ),
    [imageUrl, localOpDetails, navigation, partnerId],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppBackButton title={headerTitle} style={{width: '70%', height: 56}} />
      </View>

      {imageUrl && (
        <Image
          style={styles.box}
          source={{uri: API.default.httpImageUrl(imageUrl)}}
        />
      )}

      <View style={{flex: 1}}>
        <SectionList
          sections={prodData}
          stickySectionHeadersEnabled
          // keyExtractor={(item, index) => item + index}
          renderItem={renderItem}
          renderSectionHeader={({section: {title, data}}) =>
            data.length >= 1 ? (
              <View style={styles.sectionHeader}>
                <AppText
                  style={{
                    ...appStyles.bold20Text,
                  }}>
                  {i18n.t(`country:${title}`)}
                </AppText>
              </View>
            ) : null
          }
          renderSectionFooter={({section: {title}}) =>
            title === 'daily' && prodData[1].data.length > 0 ? (
              prodData[0].data.length > 0 && <View style={styles.divider} />
            ) : (
              <View style={{width: '100%', height: 20}} />
            )
          }
        />
      </View>
      <AppActivityIndicator visible={props.pending} />

      <ChannelTalk />
    </SafeAreaView>
  );
};

export default connect(({product, status}: RootState) => ({
  product,
  pending:
    status.pending[cartActions.cartAddAndGet.typePrefix] ||
    status.pending[cartActions.checkStockAndPurchase.typePrefix] ||
    false,
}))(CountryScreen);
