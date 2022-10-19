import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  FlatList,
  ImageBackground,
  Pressable,
  Modal,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import AppButton from '@/components/AppButton';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {utils} from '@/utils/utils';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import EsimModal from './EsimScreen/components/EsimModal';
import {getPromoFlagColor} from '@/redux/api/productApi';
import AppIcon from '@/components/AppIcon';
import SplitText from '@/components/SplitText';
import Triangle from '@/components/Triangle';
import AppSvgIcon from '@/components/AppSvgIcon';

type ParamList = {
  ChargeHistoryScreen: {
    mainSubs: RkbSubscription;
    chargedSubs: RkbSubscription[];
    onPressUsage: () => Promise<{usage: {}; status: {}}>;
    chargeablePeriod: string;
    isChargeable: boolean;
  };
};

const styles = StyleSheet.create({
  chargeBtn: {
    height: 52,
    backgroundColor: colors.clearBlue,
  },
  chargeBtnTitle: {
    ...appStyles.medium18,
    color: colors.white,
    textAlign: 'center',
    width: '100%',
  },
  activeBottomBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btn: {
    width: '30%',
    paddingTop: 19,
  },
  btnDis: {
    width: '30%',
    paddingTop: 19,
    opacity: 0.6,
  },
  btnTitle: {
    ...appStyles.normal14Text,
    textAlign: 'center',
    marginTop: 10,
  },
  normal14Gray: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
  topInfo: {
    marginTop: 20,
    backgroundColor: 'white',
    paddingVertical: 8,
    marginBottom: 32,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  inactiveContainer: {
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 8,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    height: 20,
    alignSelf: 'center',
  },
  badgeText: {
    ...appStyles.bold13Text,
  },
  itemRow: {
    flexDirection: 'row',
    marginTop: 2,
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.whiteTwo,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  cautionText: {
    marginLeft: 10,
    color: colors.redError,
  },
  cautionContainer: {
    marginHorizontal: 20,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.paleGrey,
  },
  card: {
    width: 151,
    height: 112,
    marginVertical: 16,
    justifyContent: 'flex-end',
    paddingBottom: 14,
    paddingHorizontal: 10,
  },
  cardTitle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  orderTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 62,
  },
  sortModalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    marginHorizontal: 0,
  },
  sortModalContent: {
    padding: 20,
    backgroundColor: colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  promoFlag: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export const renderPromoFlag = (flags: string[], isStore: boolean) => (
  <>
    {flags.map((elm) => {
      const badgeColor = getPromoFlagColor(elm);
      return (
        <View
          key={elm}
          style={[
            styles.badge,
            {
              backgroundColor: badgeColor.backgroundColor,
            },
          ]}>
          <AppText
            key="name"
            style={[styles.badgeText, {color: badgeColor.fontColor}]}>
            {i18n.t(elm)}
          </AppText>
          {isStore && <AppIcon name="naverIcon" />}
        </View>
      );
    })}
    {isStore && (
      <AppIcon
        name="naverIcon"
        style={{marginLeft: 8, justifyContent: 'center'}}
      />
    )}
  </>
);

type OrderType = 'latest' | 'purchase';

const ChargeHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ChargeHistoryScreen'>>();
  const params = useMemo(() => route?.params, [route?.params]);
  const {mainSubs, chargeablePeriod, chargedSubs, onPressUsage, isChargeable} =
    params;
  const [showModal, setShowModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [usage, setUsage] = useState({});
  const [status, setStatus] = useState({});
  const [orderModalVisible, setOrderModalVisible] = useState<boolean>(false);
  const [orderType, setOrderType] = useState<OrderType>('purchase');
  const orderTypeList: OrderType[] = useMemo(() => ['latest', 'purchase'], []);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('esim:chargeHistory')} />,
    });
  }, [navigation, params.mainSubs.prodName]);

  const topInfo = useCallback(() => {
    return (
      <View style={styles.topInfo}>
        <View style={styles.inactiveContainer}>
          <AppText style={styles.normal14Gray}>{i18n.t('esim:iccid')}</AppText>
          <AppText style={styles.normal14Gray}>{mainSubs.subsIccid}</AppText>
        </View>
        <View style={styles.inactiveContainer}>
          <AppText style={styles.normal14Gray}>
            {i18n.t('esim:usablePeriod')}
          </AppText>
          <AppText style={styles.normal14Gray}>{`${utils.toDateString(
            mainSubs.purchaseDate,
            'YYYY.MM.DD',
          )} - ${utils.toDateString(
            mainSubs.expireDate,
            'YYYY.MM.DD',
          )}`}</AppText>
        </View>
        <View style={styles.inactiveContainer}>
          <AppText style={styles.normal14Gray}>
            {i18n.t('esim:rechargeablePeriod')}
          </AppText>
          <AppText style={styles.normal14Gray}>{chargeablePeriod}</AppText>
        </View>
      </View>
    );
  }, [
    chargeablePeriod,
    mainSubs.expireDate,
    mainSubs.purchaseDate,
    mainSubs.subsIccid,
  ]);

  const renderCard = useCallback(() => {
    const isDaily = chargedSubs[0].daily === 'daily';
    const dailyCardImg = require('../assets/images/esim/dailyCard.png');
    const totalCardImg = require('../assets/images/esim/totalCard.png');

    return (
      <View style={{alignItems: 'center'}}>
        <ImageBackground
          source={isDaily ? dailyCardImg : totalCardImg}
          resizeMode="cover"
          style={styles.card}>
          <AppText style={[appStyles.bold14Text, {color: colors.white}]}>
            {i18n.t(`esim:prodType:${mainSubs.daily}`)}
          </AppText>
          <AppText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[appStyles.bold20Text, {color: colors.white}]}>
            {mainSubs.prodName}
          </AppText>
        </ImageBackground>
        <View style={styles.cardTitle}>
          <SplitText
            key={mainSubs.key}
            renderExpend={() =>
              renderPromoFlag(mainSubs.promoFlag || [], mainSubs.isStore)
            }
            style={appStyles.bold20Text}
            numberOfLines={2}
            ellipsizeMode="tail">
            {utils.removeBracketOfName(mainSubs.prodName)}
          </SplitText>
        </View>
      </View>
    );
  }, [chargedSubs, mainSubs]);

  const renderHeader = useCallback(() => {
    return (
      <View style={{flexDirection: 'row', marginBottom: 4}}>
        <AppText
          style={[appStyles.bold14Text, {color: colors.warmGrey, flex: 1}]}>
          {i18n.t('esim:chargeHistory:usage')}
        </AppText>
        <Pressable
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => setOrderModalVisible(true)}>
          <AppText
            style={[appStyles.medium14, {color: colors.black, marginRight: 8}]}>
            {i18n.t(`esim:chargeHistory:orderType:${orderType}`)}
          </AppText>
          <Triangle width={8} height={6} color={colors.black} />
        </Pressable>
      </View>
    );
  }, [orderType]);

  const renderItem = useCallback(
    ({item}: {item: RkbSubscription}) => {
      return (
        <View style={{paddingVertical: 16}}>
          <AppText style={[appStyles.normal14Text, {color: colors.gray}]}>
            {utils.toDateString(item.purchaseDate, 'YYYY.MM.DD HH:mm:ss')}
          </AppText>
          <View style={styles.itemRow}>
            <View style={{flex: 1}}>
              <SplitText
                renderExpend={() =>
                  renderPromoFlag(item.promoFlag || [], item.isStore)
                }
                style={appStyles.bold16Text}
                numberOfLines={2}
                ellipsizeMode="tail">
                {utils.removeBracketOfName(item.prodName)}
              </SplitText>
            </View>
            <Pressable
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => {
                setPending(true);
                onPressUsage().then((u) => {
                  setUsage(u.usage);
                  setStatus(u.status);
                  setPending(false);
                });
                setShowModal(true);
              }}>
              <AppText
                style={[
                  appStyles.medium14,
                  {color: colors.black, marginRight: 8},
                ]}>
                {i18n.t('esim:checkUsage')}
              </AppText>
              <AppSvgIcon name="bottomArrow" style={{marginRight: 8}} />
            </Pressable>
          </View>
        </View>
      );
    },
    [onPressUsage],
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {!isChargeable && (
        <View style={styles.cautionContainer}>
          <AppIcon name="cautionIcon" />
          <AppText style={styles.cautionText}>
            {i18n.t('esim:chargeHistory:caution')}
          </AppText>
        </View>
      )}

      {renderCard()}

      {topInfo()}

      <View style={styles.listContainer}>
        <FlatList
          data={orderType === 'purchase' ? chargedSubs : chargedSubs.reverse()}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          extraData={orderType}
        />
      </View>

      <EsimModal
        visible={showModal}
        subs={mainSubs}
        cmiPending={pending}
        cmiUsage={usage}
        cmiStatus={status}
        onOkClose={() => {
          setShowModal(false);
          setStatus({});
          setUsage({});
        }}
      />

      <Modal transparent visible={orderModalVisible}>
        <Pressable
          style={styles.sortModalContainer}
          onPress={() => setOrderModalVisible(false)}>
          <Pressable style={styles.sortModalContent}>
            <AppText style={appStyles.bold18Text}>
              {i18n.t('esim:chargeHistory:orderType')}
            </AppText>
            <View style={{marginTop: 30}}>
              {orderTypeList.map((elm) => (
                <Pressable
                  key={elm}
                  onPress={() => {
                    setOrderType(elm);
                    setOrderModalVisible(false);
                  }}
                  style={styles.orderTypeItem}>
                  <AppText
                    style={[
                      appStyles.normal18Text,
                      {
                        color:
                          orderType === elm ? colors.black : colors.warmGrey,
                      },
                    ]}>
                    {i18n.t(`esim:chargeHistory:orderType:${elm}`)}
                  </AppText>
                  {orderType === elm && <AppSvgIcon name="checkedBlue" />}
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
        <SafeAreaView style={{backgroundColor: colors.white}} />
      </Modal>

      {isChargeable && (
        <AppButton
          style={styles.chargeBtn}
          type="primary"
          onPress={() =>
            navigation.navigate('Charge', {
              item: mainSubs,
              chargeableDate: chargeablePeriod,
            })
          }
          title={i18n.t('esim:charge')}
          titleStyle={styles.chargeBtnTitle}
        />
      )}
    </SafeAreaView>
  );
};

export default ChargeHistoryScreen;
