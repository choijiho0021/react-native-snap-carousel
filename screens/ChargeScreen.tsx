import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Modal,
  Pressable,
  ImageBackground,
  TouchableHighlightBase,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {SceneMap, TabView} from 'react-native-tab-view';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppBackButton from '@/components/AppBackButton';
import i18n from '@/utils/i18n';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import {RootState} from '@/redux';
import {
  actions as productActions,
  ProdDataType,
  ProductAction,
  ProductModelState,
} from '@/redux/modules/product';
import {appStyles} from '@/constants/Styles';
import {colors} from '@/constants/Colors';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import AppTabHeader from '@/components/AppTabHeader';
import {makeProdData} from './CountryScreen';
import CountryListItem from './HomeScreen/component/CountryListItem';
import AppIcon from '@/components/AppIcon';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {Button} from 'react-native-share';
import AppStyledText from '@/components/AppStyledText';
import {RNSVGSymbol} from 'react-native-svg';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
  title: {
    ...appStyles.bold18Text,
    fontSize: isDeviceSize('medium') ? 18 : 20,
    color: colors.clearBlue,
  },
  tab: {
    backgroundColor: colors.white,
    height: 60,
  },
  tabTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cautionBtn: {
    marginLeft: 9,
    width: 24,
    height: 24,
    marginTop: 2,
  },
  cautionModal: {
    marginRight: 20,
    marginLeft: 20,
    backgroundColor: 'rgb(247, 248, 250)',
    borderWidth: 1,
    borderColor: colors.whiteThree,
    // position: 'absolute',
    top: 50,
    // top: 40,
    padding: 16,
    paddingBottom: 20,
  },
  modalTitleFrame: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 36,
    marginBottom: 12,
    // paddingRight: 4,
  },
  modalTitleText: {
    ...appStyles.bold14Text,
    lineHeight: 20,
  },
  btnCancel: {
    width: 12,
    height: 12,
    padding: 8,
  },
  modalBody: {
    paddingRight: 30,
  },

  modalBodyText: {
    ...appStyles.normal14Text,
    lineHeight: 20,
  },
});

type ParamList = {
  ChargeScreen: {
    item: RkbSubscription;
    chargeableDate: string;
  };
};

type ChargeTabRouteKey = 'daily' | 'total';
type ChargeTabRoute = {
  key: ChargeTabRouteKey;
  title: string;
  category: string;
};

type ChargeScreenProps = {
  product: ProductModelState;
  action: {
    product: ProductAction;
  };
};

const ChargeScreen: React.FC<ChargeScreenProps> = ({product, action}) => {
  const {localOpList, prodByLocalOp, prodList, prodByPartner} = product;
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ChargeScreen'>>();
  const params = useMemo(() => route?.params, [route?.params]);
  const [index, setIndex] = useState(0);
  const [partnerIds, setPartnerIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const partnerTemp: string[] = [];
    product.prodByCountry.forEach((p) => {
      // eslint-disable-next-line eqeqeq
      if (p.country == params.item.country) {
        partnerTemp.push(p.partner);
      }
    });

    setPartnerIds(partnerTemp);
  }, [params.item.country, product.prodByCountry]);

  const [prodData, setProdData] = useState<ProdDataType[]>([]);

  useEffect(() => {
    action.product.getProdOfPartner(partnerIds);
  }, [action.product, partnerIds]);

  useEffect(() => {
    if (partnerIds) {
      const cmiPartnerIds = partnerIds.filter((partnerId) => {
        return localOpList.get(partnerId)?.partner === 'CMI';
      });

      setProdData(makeProdData(prodByPartner, cmiPartnerIds));
    }
  }, [localOpList, partnerIds, prodByLocalOp, prodByPartner, prodList]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <View style={styles.header}>
          <AppBackButton title={i18n.t('esim:charge')} />

          <AppButton
            style={styles.cautionBtn}
            onPress={() => {
              setShowModal(true);
            }}
            iconName="btnChargeCaution"
          />
        </View>
      ),
    });
  }, [navigation]);

  const onIndexChange = useCallback((idx: number) => setIndex(idx), []);
  const routes = useMemo(
    () =>
      [
        {
          key: 'daily',
          title: i18n.t('country:daily'),
          category: 'daily',
        },
        {
          key: 'total',
          title: i18n.t('country:total'),
          category: 'total',
        },
      ] as ChargeTabRoute[],
    [],
  );

  const renderCountryList = useCallback(
    (type: number) => (
      <ScrollView>
        {prodData[type]?.data.map((data) => (
          <CountryListItem
            key={data.sku}
            item={data}
            onPress={() => {
              navigation.navigate('ChargeDetail', {
                data,
                prodname: params.item.prodName,
                chargeableDate: params.chargeableDate,
                subsIccid: params.item.subsIccid,
              });
            }}
            isCharge
          />
        ))}
      </ScrollView>
    ),
    [navigation, params, prodData],
  );

  const dailyRoute = () => renderCountryList(0);
  const totalRoute = () => renderCountryList(1);

  const renderScene = SceneMap({
    daily: dailyRoute,
    total: totalRoute,
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <AppTabHeader
          index={index}
          routes={routes}
          onIndexChange={onIndexChange}
          style={styles.tab}
          tintColor={colors.black}
          titleStyle={styles.tabTitle}
        />
        <TabView
          sceneContainerStyle={{flex: 1}}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={onIndexChange}
          renderTabBar={() => null}
        />
      </View>
      <Modal visible={showModal} transparent>
        <SafeAreaView style={{flex: 1}}>
          <Pressable
            style={{
              flex: 1,
              backgroundColor: 'transparent',
            }}
            onPress={() => setShowModal(false)}>
            <Pressable style={styles.cautionModal} onPress={() => {}}>
              {/* <ImageBackground
                source={require('../assets/images/esim/chargeCautionBg.png')}
                }
                resizeMode="stretch"> */}
              <View style={styles.modalTitleFrame}>
                <AppText style={styles.modalTitleText}>
                  {i18n.t('esim:chargeCaution')}
                </AppText>
                <AppButton
                  style={styles.btnCancel}
                  onPress={() => {
                    setShowModal(false);
                  }}
                  iconName="btnCancel"
                />
              </View>
              <View style={styles.modalBody}>
                {[1, 2, 3].map((k) => (
                  <View key={k} style={{flexDirection: 'row'}}>
                    <AppText
                      style={[
                        appStyles.normal14Text,
                        {marginHorizontal: 5, marginTop: 3},
                      ]}>
                      •
                    </AppText>
                    <AppText style={styles.modalBodyText}>
                      {i18n.t(`esim:chargeCaution:modal${k}`)}
                    </AppText>
                  </View>
                ))}
              </View>
              {/* </ImageBackground> */}
            </Pressable>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default connect(
  ({product}: RootState) => ({
    product,
  }),
  (dispatch) => ({
    action: {
      product: bindActionCreators(productActions, dispatch),
    },
  }),
)(ChargeScreen);
