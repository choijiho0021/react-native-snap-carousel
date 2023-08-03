import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  FlatList,
  ImageBackground,
  Pressable,
  Modal,
  Image,
  Animated,
  RefreshControl,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {connect} from 'react-redux';
import AppBackButton from '@/components/AppBackButton';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import {RkbSubscription} from '@/redux/api/subscriptionApi';
import AppButton from '@/components/AppButton';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {retrieveData, storeData, utils} from '@/utils/utils';
import {windowWidth} from '@/constants/SliderEntry.style';
import EsimModal from './EsimScreen/components/EsimModal';
import {getPromoFlagColor} from '@/redux/api/productApi';
import SplitText from '@/components/SplitText';
import Triangle from '@/components/Triangle';
import AppSvgIcon from '@/components/AppSvgIcon';
import {HomeStackParamList} from '@/navigation/navigation';
import {API} from '@/redux/api';
import ScreenHeader from '@/components/ScreenHeader';
import {AccountModelState} from '@/redux/modules/account';
import {RootState} from '@/redux';

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
    fontSize: 14,
  },
  boldl14Gray: {
    ...appStyles.bold14Text,
    color: colors.warmGrey,
    fontSize: 14,
  },
  boldl12Gray: {
    ...appStyles.bold12Text,
    color: colors.warmGrey,
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
  listContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  cautionText: {
    ...appStyles.bold14Text,
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
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.lightGrey,
    marginBottom: 16,
  },
  addOnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  rechargeTag: {
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    justifyContent: 'center',
  },
  newIcon: {
    position: 'absolute',
    top: -14,
    zIndex: 20,
    alignSelf: 'center',
  },
  newText: {
    position: 'absolute',
    top: -12,
    zIndex: 30,
    alignSelf: 'center',
    ...appStyles.bold12Text,
    lineHeight: 16,
    color: colors.white,
  },
  purchaseText: {
    ...appStyles.semiBold14Text,
    lineHeight: 20,
    color: colors.warmGrey,
    alignSelf: 'flex-start',
    marginTop: 16,
  },
});

export const renderPromoFlag = (flags: string[], isStore: boolean) => {
  return (
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
};

type OrderType = 'latest' | 'purchase';

type ChargeHistoryScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ChargeHistory'
>;

type ChargeHistoryScreenProps = {
  navigation: ChargeHistoryScreenNavigationProp;
  route: RouteProp<HomeStackParamList, 'ChargeHistory'>;
  account: AccountModelState;
};

// SVG 파일로 대체 불가. SVG는 이미지가 깨져보임
const dailyCardImg = require('../assets/images/esim/dailyCard.png');
const totalCardImg = require('../assets/images/esim/totalCard.png');

const ChargeHistoryScreen: React.FC<ChargeHistoryScreenProps> = ({
  navigation,
  route: {params},
  account,
}) => {
  const {
    mainSubs,
    chargeablePeriod,
    onPressUsage,
    isChargeable,
    chargedSubsParam,
  } = params || {};
  const [showModal, setShowModal] = useState(false);
  const [selectedSubs, setSelectedSubs] = useState<RkbSubscription>(mainSubs);
  const [pending, setPending] = useState(false);
  const [usage, setUsage] = useState({});
  const [status, setStatus] = useState({});
  const [orderModalVisible, setOrderModalVisible] = useState<boolean>(false);
  const [orderType, setOrderType] = useState<OrderType>('purchase');
  const orderTypeList: OrderType[] = useMemo(() => ['purchase', 'latest'], []);
  const [showTip, setShowTip] = useState(false);
  const [blockAnimation, setBlockAnimation] = useState(false);
  const [chargedSubs, setChargedSubs] = useState([mainSubs]);
  const topHeight = useMemo(() => {
    let height = 326;
    if (mainSubs?.partner === 'cmi') height += 22;
    if (!isChargeable) height += 74;
    return height;
  }, [isChargeable, mainSubs?.partner]);

  const animatedValue = useRef(new Animated.Value(topHeight)).current;

  const showTop = useCallback(
    (isTop: boolean) => {
      if (!blockAnimation) {
        setBlockAnimation(true);
        Animated.timing(animatedValue, {
          toValue: isTop ? topHeight : 0,
          duration: 500,
          useNativeDriver: false,
        }).start(() => setBlockAnimation(false));
      }
    },
    [animatedValue, blockAnimation, topHeight],
  );

  const data = useMemo(
    () =>
      orderType === 'purchase' ? chargedSubs : chargedSubs?.slice().reverse(),
    [chargedSubs, orderType],
  );

  const [prodData, addOnData] = useMemo(() => {
    const prod: RkbSubscription[] = [];
    const addOn: RkbSubscription[] = [];
    data.forEach((d) => {
      if (d?.type === 'esim_product') {
        prod.push(d);
      } else if (d?.type === 'add_on_product') {
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
    if (chargedSubsParam) {
      setChargedSubs(chargedSubsParam);
    } else {
      const {iccid, token} = account;
      if (iccid && token) {
        API.Subscription.getSubscription({
          iccid,
          token,
          uuid: mainSubs.subsIccid,
        }).then((rsp) => {
          setChargedSubs(rsp.objects);
        });
      }
    }
  }, [account, chargedSubsParam, mainSubs.subsIccid]);

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
          <AppText style={styles.boldl14Gray}>{i18n.t('esim:iccid')}</AppText>
          <AppText style={styles.normal14Gray}>{mainSubs?.subsIccid}</AppText>
        </View>

        <View style={styles.inactiveContainer}>
          <AppText style={styles.boldl14Gray}>
            {i18n.t('his:expireDate2')}
          </AppText>

          <AppText style={styles.normal14Gray}>
            {`${utils.toDateString(
              mainSubs.purchaseDate,
              'YYYY.MM.DD',
            )} - ${utils.toDateString(mainSubs.lastExpireDate, 'YYYY.MM.DD')}`}
          </AppText>
        </View>

        {chargeablePeriod && (
          <View style={styles.inactiveContainer}>
            <AppText style={styles.boldl14Gray}>
              {i18n.t('esim:rechargeablePeriod')}
            </AppText>
            <AppText style={styles.normal14Gray}>{chargeablePeriod}</AppText>
          </View>
        )}
      </View>
    );
  }, [chargeablePeriod, mainSubs]);

  const renderCard = useCallback(() => {
    const isDaily = chargedSubs[0]?.daily === 'daily';

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
          {mainSubs.flagImage !== '' && (
            <Image
              source={{uri: API.default.httpImageUrl(mainSubs.flagImage)}}
              style={{width: 20, height: 20, marginRight: 10}}
            />
          )}
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
      <View
        key="header"
        style={{
          flexDirection: 'row',
          marginBottom: 4,
          paddingBottom: 20,
          backgroundColor: colors.white,
        }}>
        <AppText style={[appStyles.bold18Text, {color: colors.black, flex: 1}]}>
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

  const toProdDaysString = useCallback((days: number) => {
    if (days <= 0) return '';
    return days + i18n.t('days');
  }, []);

  const navigateToChargeType = useCallback(() => {
    setShowModal(false);
    setStatus({});
    setUsage({});

    navigation.navigate('ChargeType', {
      mainSubs,
      chargeablePeriod,
      chargedSubs: prodData,
      isChargeable,
      addOnData,
    });
  }, [
    addOnData,
    chargeablePeriod,
    isChargeable,
    mainSubs,
    navigation,
    prodData,
  ]);

  const renderItem = useCallback(
    ({item}: {item: RkbSubscription}) => {
      return (
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.lightGrey,
            marginBottom: 16,
          }}>
          <View style={{alignItems: 'center', paddingHorizontal: 20}}>
            <AppText style={styles.purchaseText}>
              {i18n.t('purchase:date', {
                date: utils.toDateString(
                  item.provDate || item.purchaseDate,
                  'YYYY.MM.DD',
                ),
              })}
            </AppText>
            <View
              style={{flexDirection: 'row', marginBottom: 16, marginTop: 6}}>
              <View style={{flex: 1}}>
                <SplitText
                  renderExpend={() =>
                    renderPromoFlag(item.promoFlag || [], item.isStore)
                  }
                  numberOfLines={2}
                  style={{...appStyles.bold16Text, marginRight: 8}}
                  ellipsizeMode="tail">
                  {utils.removeBracketOfName(item.prodName)}
                </SplitText>
              </View>
              <Pressable
                style={{flexDirection: 'row'}}
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
                    appStyles.bold14Text,
                    {color: colors.clearBlue, marginRight: 8},
                  ]}>
                  {i18n.t('esim:checkUsage')}
                </AppText>
                <AppSvgIcon
                  name="rightBlueAngleBracket"
                  style={{marginRight: 8, marginTop: 4}}
                />
              </Pressable>
            </View>
          </View>

          <View style={{backgroundColor: colors.whiteTwo}}>
            {addOnData
              .filter((a) => a.refSubs === item.nid)
              .map((k, idx, arr) => (
                <View style={{flexDirection: 'row', paddingHorizontal: 20}}>
                  <AppSvgIcon
                    name="blueBulletPoint"
                    style={{marginTop: 23, marginRight: 16}}
                  />
                  <View style={{flex: 1}}>
                    <View style={styles.addOnRow}>
                      <AppText style={appStyles.bold16Text}>
                        {utils.toDataVolumeString(Number(k.dataVolume))}
                        {` ${toProdDaysString(Number(k.prodDays))}`}
                      </AppText>
                      <View style={styles.rechargeTag}>
                        <AppText style={styles.boldl12Gray}>
                          {i18n.t('recharge')}
                        </AppText>
                      </View>
                    </View>
                    <AppText style={{...styles.normal14Gray, marginBottom: 24}}>
                      {k.prodDays === '1'
                        ? i18n.t('his:today')
                        : i18n.t('his:remainDays')}
                    </AppText>

                    <View
                      style={
                        arr.length - 1 === idx
                          ? {width: '100%', height: 9}
                          : styles.divider
                      }
                    />
                  </View>
                </View>
              ))}
          </View>
        </View>
      );
    },
    [addOnData, onPressUsage, toProdDaysString],
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScreenHeader title={i18n.t('esim:chargeHistory')} />

      <Animated.View style={{height: animatedValue}}>
        {!isChargeable && (
          <View style={styles.cautionContainer}>
            <AppSvgIcon name="chargeHistoryCautionIcon" />
            <AppText style={styles.cautionText}>
              {i18n.t('esim:chargeHistory:caution')}
            </AppText>
          </View>
        )}

        {renderCard()}

        {topInfo()}

        <View
          style={{
            width: '100%',
            height: 10,
            backgroundColor: colors.whiteTwo,
          }}
        />
      </Animated.View>
      <View style={styles.listContainer}>
        <FlatList
          data={prodData}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, idx) => item.key + idx}
          overScrollMode="always"
          refreshControl={
            // Android에서는 -y로 스크롤이 안되기 때문에 refresh로 대체
            <RefreshControl
              refreshing={false}
              onRefresh={() => showTop(true)}
              colors={['transparent']} // android 전용
              tintColor="transparent" // ios 전용
            />
          }
          onScroll={({
            nativeEvent: {
              contentOffset: {y},
            },
          }) => {
            if (y >= 15 && !blockAnimation) showTop(false);
          }}
        />
        {showTip && renderTooltip()}
      </View>

      <EsimModal
        visible={showModal}
        subs={selectedSubs}
        cmiPending={pending}
        cmiUsage={usage}
        cmiStatus={status}
        onCancelClose={() => {
          setShowModal(false);
          setStatus({});
          setUsage({});
        }}
        onOkClose={navigateToChargeType}
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
        <View style={{position: 'relative'}}>
          <AppSvgIcon name="speechBubble" style={styles.newIcon} />
          <AppText style={styles.newText}>{i18n.t('new')}</AppText>
          <AppButton
            style={styles.chargeBtn}
            type="primary"
            onPress={navigateToChargeType}
            title={i18n.t('esim:charge')}
            titleStyle={styles.chargeBtnTitle}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default connect(({account}: RootState) => ({account}))(
  ChargeHistoryScreen,
);
