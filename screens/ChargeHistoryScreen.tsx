import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  FlatList,
  ImageBackground,
  Pressable,
  Modal,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import AppButton from '@/components/AppButton';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {retrieveData, storeData, utils} from '@/utils/utils';
import {isDeviceSize, windowWidth} from '@/constants/SliderEntry.style';
import EsimModal from './EsimScreen/components/EsimModal';
import {getPromoFlagColor} from '@/redux/api/productApi';
import SplitText from '@/components/SplitText';
import Triangle from '@/components/Triangle';
import AppSvgIcon from '@/components/AppSvgIcon';
import {HomeStackParamList} from '@/navigation/navigation';

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
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    height: 20,
    alignSelf: 'center',
    borderRadius: 3,
    marginTop: 3,
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
    marginVertical: 8,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.paleGrey,
    borderRadius: 3,
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    marginHorizontal: 0,
  },
  sortModalContent: {
    padding: 20,
    backgroundColor: colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tooltipContainer: {
    zIndex: 100,
    width: windowWidth - 40,
    position: 'absolute',
    left: 20,
    top: 0,
  },
  tooltipContent: {
    flexDirection: 'row',
    backgroundColor: 'rgba(44,44,44,0.86)',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 3,
    borderWidth: 0,
    padding: 16,
  },
  closeTooltip: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const renderPromoFlag = (flags: string[], isStore: boolean) => (
  <Fragment>
    {flags
      .filter((elm) => elm !== 'hot')
      .map((elm) => {
        const badgeColor = getPromoFlagColor(elm);
        return (
          <View
            key={elm}
            style={[
              styles.badge,
              {
                backgroundColor: badgeColor.backgroundColor,
                marginRight: 8,
              },
            ]}>
            <AppText
              key="name"
              style={[
                styles.badgeText,
                {color: badgeColor.fontColor, top: -1},
              ]}>
              {i18n.t(elm)}
            </AppText>
          </View>
        );
      })}
    {isStore && (
      <AppSvgIcon name="naverIcon" style={{justifyContent: 'center'}} />
    )}
  </Fragment>
);

type OrderType = 'latest' | 'purchase';

type ChargeHistoryScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ChargeHistory'
>;

type ChargeHistoryScreenProps = {
  navigation: ChargeHistoryScreenNavigationProp;
  route: RouteProp<HomeStackParamList, 'ChargeHistory'>;
};

// SVG 파일로 대체 불가. SVG는 이미지가 깨져보임
const dailyCardImg = require('../assets/images/esim/dailyCard.png');
const totalCardImg = require('../assets/images/esim/totalCard.png');

const ChargeHistoryScreen: React.FC<ChargeHistoryScreenProps> = ({
  navigation,
  route: {params},
}) => {
  const {mainSubs, chargeablePeriod, chargedSubs, onPressUsage, isChargeable} =
    params || {};
  const [showModal, setShowModal] = useState(false);
  const [selectedSubs, setSelectedSubs] = useState<RkbSubscription>(mainSubs);
  const [pending, setPending] = useState(false);
  const [usage, setUsage] = useState({});
  const [status, setStatus] = useState({});
  const [orderModalVisible, setOrderModalVisible] = useState<boolean>(false);
  const [orderType, setOrderType] = useState<OrderType>('purchase');
  const orderTypeList: OrderType[] = useMemo(() => ['purchase', 'latest'], []);
  const [showTip, setShowTip] = useState(false);
  const data = useMemo(
    () =>
      orderType === 'purchase' ? chargedSubs : chargedSubs?.slice().reverse(),
    [chargedSubs, orderType],
  );

  const [prodData, addOnData] = useMemo(() => {
    const prod: RkbSubscription[] = [];
    const addOn: RkbSubscription[] = [];
    data.forEach((d) => {
      if (d.prodType === 'esim_product') {
        prod.push(d);
      } else if (d.prodType === 'add_on_product') {
        addOn.push(d);
      }
    });
    return [prod, addOn];
  }, [data]);

  useEffect(() => {
    retrieveData('chargeHistoryTooltip').then((elm) =>
      setShowTip(elm !== 'closed'),
    );
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('esim:chargeHistory')} />,
    });
  }, [navigation]);

  const renderTooltip = useCallback(() => {
    return (
      <View style={styles.tooltipContainer}>
        <View style={styles.tooltipContent}>
          <AppText
            style={[
              appStyles.medium14,
              {flex: 1, color: colors.white, marginRight: 10},
            ]}>
            <AppText style={[appStyles.bold14Text, {color: colors.white}]}>
              {i18n.t('esim:chargeHistory:tooltip1')}
            </AppText>
            {i18n.t('esim:chargeHistory:tooltip2')}
          </AppText>
          <Pressable
            style={styles.closeTooltip}
            onPress={() => {
              storeData('chargeHistoryTooltip', 'closed');
              setShowTip(false);
            }}>
            <AppSvgIcon name="closeSnackBar" style={{marginHorizontal: 8}} />
          </Pressable>
        </View>
        <View style={{alignItems: 'flex-end', marginRight: 50}}>
          <Triangle width={20} height={10} color="rgba(44,44,44,0.86)" />
        </View>
      </View>
    );
  }, []);

  const topInfo = useCallback(() => {
    return (
      <View style={styles.topInfo}>
        <View style={styles.inactiveContainer}>
          <AppText style={styles.normal14Gray}>{i18n.t('esim:iccid')}</AppText>
          <AppText style={styles.normal14Gray}>{mainSubs?.subsIccid}</AppText>
        </View>

        <View style={styles.inactiveContainer}>
          <AppText style={styles.normal14Gray}>
            {i18n.t('esim:rechargeablePeriod')}
          </AppText>
          <AppText style={styles.normal14Gray}>{chargeablePeriod}</AppText>
        </View>
      </View>
    );
  }, [chargeablePeriod, mainSubs?.subsIccid]);

  const renderCard = useCallback(() => {
    const isDaily = chargedSubs[0].daily === 'daily';

    const title = utils.removeBracketOfName(
      mainSubs?.prodName?.split(' ')?.[0],
    );
    return (
      <View key="card">
        <View key="card" style={{alignItems: 'center'}}>
          <ImageBackground
            source={isDaily ? dailyCardImg : totalCardImg}
            resizeMode="cover"
            style={styles.card}>
            <AppText style={[appStyles.bold14Text, {color: colors.white}]}>
              {i18n.t(`esim:prodType:${mainSubs?.daily}`)}
            </AppText>
            <AppText
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[appStyles.bold20Text, {color: colors.white}]}>
              {title}
            </AppText>
          </ImageBackground>
        </View>
        <View style={styles.cardTitle}>
          <AppText
            key={mainSubs?.key}
            style={appStyles.bold20Text}
            numberOfLines={2}
            ellipsizeMode="tail">
            {title}
          </AppText>
        </View>
      </View>
    );
  }, [chargedSubs, mainSubs]);

  const renderHeader = useCallback(() => {
    return (
      <View key="header" style={{flexDirection: 'row', marginBottom: 4}}>
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
          <AppSvgIcon name="sortTriangle" style={{marginRight: 8}} />
        </Pressable>
      </View>
    );
  }, [orderType]);

  const renderItem = useCallback(
    ({item}: {item: RkbSubscription}) => {
      return (
        <View style={{paddingVertical: 16}}>
          <View style={styles.itemRow}>
            <View style={{flex: 1}}>
              <SplitText
                renderExpend={() =>
                  renderPromoFlag(item.promoFlag || [], item.isStore)
                }
                style={{...appStyles.bold16Text, marginRight: 8}}
                numberOfLines={2}
                ellipsizeMode="tail">
                {utils.removeBracketOfName(item.prodName)}
              </SplitText>
            </View>
            <Pressable
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => {
                setPending(true);
                setSelectedSubs(item);
                onPressUsage(item)?.then((u) => {
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
          <AppText style={[appStyles.normal14Text, {color: colors.gray}]}>
            {i18n.t('his:purchaseDate2', {
              purchaseDate: utils.toDateString(
                item.purchaseDate,
                'YYYY.MM.DD HH:mm:ss',
              ),
            })}
          </AppText>
          <AppText style={[appStyles.normal14Text, {color: colors.gray}]}>
            {i18n.t('his:expireDate2', {
              purchaseDate: utils.toDateString(item.purchaseDate, 'YYYY.MM.DD'),
              expireDate: utils.toDateString(item.expireDate, 'YYYY.MM.DD'),
            })}
          </AppText>
          {addOnData
            .filter((a) => a.refSubs === item.nid)
            .map((k) => (
              <View>
                <View style={[styles.itemRow, {marginTop: 10}]}>
                  <AppSvgIcon name="plus" />
                  <AppText style={appStyles.bold16Text}>{k.prodName}</AppText>
                </View>
                <AppText style={[appStyles.normal14Text, {color: colors.gray}]}>
                  {i18n.t('his:purchaseDate2', {
                    purchaseDate: utils.toDateString(
                      k.purchaseDate,
                      'YYYY.MM.DD HH:mm:ss',
                    ),
                  })}
                </AppText>
              </View>
            ))}
        </View>
      );
    },
    [addOnData, onPressUsage],
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {!isChargeable && (
        <View style={styles.cautionContainer}>
          <AppSvgIcon name="cautionIcon" />
          <AppText style={styles.cautionText}>
            {i18n.t('esim:chargeHistory:caution')}
          </AppText>
        </View>
      )}

      {renderCard()}

      {topInfo()}

      <View style={styles.listContainer}>
        <FlatList
          data={prodData}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          keyExtractor={(item, idx) => item.key + idx}
        />
        {showTip && renderTooltip()}
      </View>

      <EsimModal
        visible={showModal}
        subs={selectedSubs}
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
                  {orderType === elm && <AppSvgIcon name="selected" />}
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
            navigation.navigate('ChargeType', {
              mainSubs,
              chargeablePeriod,
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
