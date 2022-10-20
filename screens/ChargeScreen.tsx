import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Platform} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
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
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';

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
  headerTitle: {
    marginRight: 8,
  },
  cautionBtn: {
    width: 24,
    height: 24,
    marginTop: 2,
  },
  toolTipStyle: {
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(52, 62, 95)',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: {
          height: 1,
          width: 1,
        },
      },
    }),
  },
  arrowStyle: {
    borderWidth: 1,
    borderTopColor: 'rgb(247, 248, 250)',
    zIndex: 10,
  },

  toolTipBox: {
    backgroundColor: 'rgb(247, 248, 250)',
    padding: 16,
    paddingBottom: 20,

    ...Platform.select({
      android: {
        elevation: 3,
      },
    }),
  },
  toolTipTitleFrame: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 36,
    marginBottom: 12,
  },
  toolTipTitleText: {
    ...appStyles.bold14Text,
    lineHeight: 20,
  },
  btnCancel: {
    width: 12,
    height: 12,
    padding: 8,
    marginRight: 8,
  },
  toolTipBody: {
    paddingRight: 30,
  },

  toolTipBodyText: {
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
  const {localOpList, prodByPartner} = product;
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ChargeScreen'>>();
  const params = useMemo(() => route?.params, [route?.params]);
  const [index, setIndex] = useState(0);
  const [showTip, setTip] = useState(true);

  const partnerIds = useMemo(() => {
    return product.prodByCountry.map(
      (p) => p.country == params.item.country && p.partner,
    );
  }, [params.item.country, product.prodByCountry]);

  const prodData = useMemo(() => {
    if (partnerIds) {
      const cmiPartnerIds = partnerIds.filter(
        (partnerId) => localOpList.get(partnerId)?.partner === 'CMI',
      );
      return makeProdData(prodByPartner, cmiPartnerIds);
    }
    return [];
  }, [localOpList, partnerIds, prodByPartner]);

  useEffect(() => {
    action.product.getProdOfPartner(partnerIds);
  }, [action.product, partnerIds]);

  const renderToolTip = useCallback(
    () => (
      <Tooltip
        isVisible={showTip}
        backgroundColor="rgba(0,0,0,0)"
        contentStyle={styles.toolTipBox}
        tooltipStyle={styles.toolTipStyle}
        arrowStyle={styles.arrowStyle}
        disableShadow
        content={
          <View>
            <View style={styles.toolTipTitleFrame}>
              <AppText style={styles.toolTipTitleText}>
                {i18n.t('esim:chargeCaution')}
              </AppText>
              <AppButton style={styles.btnCancel} iconName="btnCancel" />
            </View>
            <View style={styles.toolTipBody}>
              {[1, 2, 3].map((k) => (
                <View key={k} style={{flexDirection: 'row'}}>
                  <AppText
                    style={[
                      appStyles.normal14Text,
                      {marginHorizontal: 5, marginTop: 3},
                    ]}>
                    •
                  </AppText>
                  <AppText style={styles.toolTipBodyText}>
                    {i18n.t(`esim:chargeCaution:modal${k}`)}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        }
        onClose={() => setTip(false)}
        placement="bottom">
        <AppButton
          style={styles.cautionBtn}
          onPress={() => {
            setTip(true);
          }}
          iconName="btnChargeCaution"
        />
      </Tooltip>
    ),
    [showTip],
  );

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <View style={styles.header}>
          <AppBackButton
            title={i18n.t('esim:charge')}
            style={styles.headerTitle}
          />
          {renderToolTip()}
        </View>
      ),
    });
  }, [navigation, renderToolTip, showTip]);

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
