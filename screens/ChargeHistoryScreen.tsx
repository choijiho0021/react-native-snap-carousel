import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View, FlatList} from 'react-native';
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
import EsimModal, {ModalType} from './EsimScreen/components/EsimModal';
import {getPromoFlagColor} from '@/redux/api/productApi';

type ParamList = {
  ChargeHistoryScreen: {
    item: RkbSubscription;
    onPressUsage: () => Promise<{usage: {}; status: {}}>;
    chargeablePeriod: string;
  };
};

const styles = StyleSheet.create({
  chargeBtn: {
    height: 52,
    backgroundColor: colors.clearBlue,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
  moreInfoContent: {
    backgroundColor: 'white',
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  normal14Gray: {
    ...appStyles.normal14Text,
    color: '#777777',
    fontSize: isDeviceSize('small') ? 12 : 14,
  },
  topInfo: {
    marginTop: 20,
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
    marginRight: 8,
  },
  badgeText: {
    ...appStyles.bold13Text,
  },
  itemRow: {
    flexDirection: 'row',
    marginTop: 2,
    height: 30,
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.whiteTwo,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
});

const ChargeHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'ChargeHistoryScreen'>>();
  const params = useMemo(() => route?.params, [route?.params]);
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState<ModalType>('');
  const [pending, setPending] = useState(false);
  const [usage, setUsage] = useState({});
  const [status, setStatus] = useState({});
  const {item, chargeablePeriod, chargedSubs, onPressUsage} = params;

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton title={params.item.prodName?.split(' ')[0]} />
      ),
    });
  }, [navigation, params.item.prodName]);

  const QRnCopyInfo = useCallback(() => {
    return (
      <View style={styles.activeBottomBox}>
        <AppButton
          style={styles.btn}
          onPress={() => {
            setModal('showQR');
            setShowModal(true);
          }}
          title={i18n.t('esim:showQR')}
          titleStyle={styles.btnTitle}
          viewStyle={{backgroundColor: 'white'}}
          iconName="btnQr2"
        />

        <AppButton
          style={styles.btn}
          onPress={async () => {
            setPending(true);
            onPressUsage().then((u) => {
              setUsage(u.usage);
              setStatus(u.status);
              setPending(false);
            });
            setModal('usage');
            setShowModal(true);
          }}
          title={i18n.t('usim:checkUsage')}
          titleStyle={styles.btnTitle}
          iconName="btnUsage"
        />

        <AppButton
          style={styles.btn}
          title={i18n.t('esim:rechargeable')}
          titleStyle={styles.btnTitle}
          iconName="btnChargeable"
        />
      </View>
    );
  }, [onPressUsage]);

  const topInfo = useCallback(() => {
    return (
      <View style={styles.topInfo}>
        <View style={styles.inactiveContainer}>
          <AppText style={styles.normal14Gray}>{i18n.t('esim:iccid')}</AppText>
          <AppText style={styles.normal14Gray}>{item.subsIccid}</AppText>
        </View>
        <View style={styles.inactiveContainer}>
          <AppText style={styles.normal14Gray}>
            {i18n.t('esim:usablePeriod')}
          </AppText>
          <AppText style={styles.normal14Gray}>{`${utils.toDateString(
            item.purchaseDate,
            'YYYY.MM.DD',
          )} - ${utils.toDateString(item.expireDate, 'YYYY.MM.DD')}`}</AppText>
        </View>
        <View style={styles.inactiveContainer}>
          <AppText style={styles.normal14Gray}>
            {i18n.t('esim:rechargeablePeriod')}
          </AppText>
          <AppText style={styles.normal14Gray}>{chargeablePeriod}</AppText>
        </View>
      </View>
    );
  }, [chargeablePeriod, item.expireDate, item.purchaseDate, item.subsIccid]);

  const renderHeader = useCallback(() => {
    return (
      <View style={{marginBottom: 8}}>
        <AppText style={[appStyles.bold14Text, {color: colors.gray}]}>
          {i18n.t('esim:chargeHistory')}
        </AppText>
      </View>
    );
  }, []);

  const renderItem = useCallback(({item}: {item: RkbSubscription}) => {
    return (
      <View style={{paddingVertical: 16}}>
        <AppText style={[appStyles.normal14Text, {color: colors.gray}]}>
          {utils.toDateString(item.purchaseDate, 'YYYY.MM.DD HH:mm:ss')}
        </AppText>
        <View style={styles.itemRow}>
          <AppText style={[appStyles.bold16Text]}>{item.prodName}</AppText>
          {item.promoFlag?.map((elm) => {
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
              </View>
            );
          })}
        </View>
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{padding: 20}}>{QRnCopyInfo()}</View>
      <View style={styles.moreInfoContent}>{topInfo()}</View>
      <View style={styles.listContainer}>
        <FlatList
          data={chargedSubs}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
        />
      </View>

      <EsimModal
        visible={showModal}
        modal={modal}
        subs={item}
        cmiPending={pending}
        cmiUsage={usage}
        cmiStatus={status}
        onOkClose={() => {
          setShowModal(false);
          setStatus({});
          setUsage({});
        }}
      />
      <AppButton
        style={styles.chargeBtn}
        type="primary"
        onPress={() => navigation.navigate('Charge', {item})}
        title={i18n.t('esim:charge')}
        titleStyle={styles.chargeBtnTitle}
      />
    </SafeAreaView>
  );
};

export default ChargeHistoryScreen;
