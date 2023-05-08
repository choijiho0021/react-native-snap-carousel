import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Pressable} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import AppBackButton from '@/components/AppBackButton';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import {API} from '@/redux/api';
import {RkbAddOnProd} from '@/redux/api/productApi';
import {appStyles} from '@/constants/Styles';
import ButtonWithPrice from './EsimScreen/components/ButtonWithPrice';
import ChargeProdTitle from './EsimScreen/components/ChargeProdTitle';
import TextWithDot from './EsimScreen/components/TextWithDot';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    // alignItems: 'stretch',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  headerTitle: {
    height: 56,
    marginRight: 8,
  },
  addOnFrame: {
    paddingHorizontal: 10,
    paddingTop: 20,
    marginTop: 20,
    backgroundColor: colors.babyBlue,
    flex: 1,
  },
  addonType: {
    ...appStyles.bold18Text,
    marginLeft: 10,
  },
  addonVolume: {
    marginTop: 50,
    ...appStyles.bold18Text,
    marginLeft: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeBtnFrame: {
    marginVertical: 20,
    marginHorizontal: 5,
  },
  typeBtn: {
    flex: 1,
    borderColor: colors.clearBlue,
    borderWidth: 1,
    paddingVertical: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
  },
  typeBtnText: {
    ...appStyles.bold18Text,
  },
  dot: {
    ...appStyles.normal14Text,
    marginHorizontal: 5,
    marginTop: 3,
    color: colors.red,
  },
  dotText: {
    ...appStyles.normal14Text,
    lineHeight: 22,
    color: colors.red,
  },
});

type AddOnScreenScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ChargeType'
>;

type AddOnScreenScreenProps = {
  navigation: AddOnScreenScreenNavigationProp;
  route: RouteProp<HomeStackParamList, 'AddOn'>;
};

type AddOnType = 'today' | 'remainDays';

const AddOnScreen: React.FC<AddOnScreenScreenProps> = ({
  navigation,
  route: {params},
}) => {
  // const mainSubs = useMemo(() => params.mainSubs, [params.mainSubs]);
  const {mainSubs, status, expireTime} = params || {};
  const remainDays = useMemo(() => '2', []);
  const [todayAddOnProd, setTodayAddOnProd] = useState<RkbAddOnProd[]>([]);
  const [remainDaysAddOnProd, setRemainDaysAddOnProd] = useState<
    RkbAddOnProd[]
  >([]);
  const [addOnTypeList, setAddOnTypeList] = useState<AddOnType[]>(['today']);
  const [selectedType, setSelectedType] = useState<AddOnType>('today');
  const [selectedAddOnProd, setSelectedAddOnProd] = useState<RkbAddOnProd>();

  useEffect(() => {
    if (expireTime) {
      console.log('@@@@ expireTime', expireTime);
    }
  }, [expireTime]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => (
        <View style={styles.header}>
          <AppBackButton
            title={i18n.t('esim:charge:type:addOn')}
            style={styles.headerTitle}
          />
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (mainSubs.nid)
      API.Product.getAddOnProduct(mainSubs.nid, remainDays).then((data) => {
        if (data.result === 0) {
          const rsp = data.objects;
          console.log('@@@@ rsp', rsp);
          const todayProd = rsp.filter((r) => r.days === '1');
          const remainDaysProd = rsp.filter((r) => r.days !== '1');
          if (remainDaysProd.length > 0)
            setAddOnTypeList(['today', 'remainDays']);
          setTodayAddOnProd(todayProd);
          setSelectedAddOnProd(todayProd[0]);
          setRemainDaysAddOnProd(remainDaysProd);
        }
      });
  }, [mainSubs, remainDays]);

  const renderTypeBtn = useCallback(
    (type: AddOnType) => (
      <Pressable
        style={[
          styles.typeBtn,
          {
            backgroundColor:
              selectedType === type ? colors.clearBlue : colors.white,
          },
        ]}
        onPress={() => {
          setSelectedType(type);
          if (type === 'today') setSelectedAddOnProd(todayAddOnProd[0]);
          else setSelectedAddOnProd(remainDaysAddOnProd[0]);
        }}>
        <AppText
          style={[
            styles.typeBtnText,
            {color: selectedType === type ? colors.white : colors.black},
          ]}>
          {i18n.t(`esim:charge:addOn:type:${type}`)}
        </AppText>
      </Pressable>
    ),
    [remainDaysAddOnProd, selectedType, todayAddOnProd],
  );

  const renderAddOnProd = useCallback(
    (item: RkbAddOnProd) => {
      const volume = Number(item.volume);
      return (
        <Pressable
          style={[
            styles.typeBtn,
            {
              backgroundColor:
                selectedAddOnProd?.sku === item.sku
                  ? colors.clearBlue
                  : colors.white,
            },
          ]}
          onPress={() => setSelectedAddOnProd(item)}>
          <AppText
            style={[
              styles.typeBtnText,
              {
                color:
                  selectedAddOnProd?.sku === item.sku
                    ? colors.white
                    : colors.black,
              },
            ]}>
            {volume > 500 ? `${volume / 1024}GB` : `${volume}MB`}
          </AppText>
        </Pressable>
      );
    },
    [selectedAddOnProd?.sku],
  );

  useEffect(() => {
    console.log('@@@@ partner, status', mainSubs.partner, status);
  }, [mainSubs.partner, status]);

  return (
    <SafeAreaView style={styles.container}>
      <ChargeProdTitle prodName={mainSubs.prodName || ''} />

      {mainSubs.partner === 'cmi' && status === 'unUsed' ? (
        <AppText>CMI 사용전 충전 불가</AppText>
      ) : (
        <>
          <View style={styles.addOnFrame}>
            <AppText style={styles.addonType}>
              {i18n.t('esim:charge:addOn:type')}
            </AppText>
            <View style={[styles.row, styles.typeBtnFrame]}>
              {addOnTypeList.map((t) => renderTypeBtn(t))}
            </View>
            <AppText style={styles.addonVolume}>
              {i18n.t('esim:charge:addOn:volume')}
            </AppText>
            <View style={[styles.row, styles.typeBtnFrame]}>
              {selectedType === 'today'
                ? todayAddOnProd.map((t) => renderAddOnProd(t))
                : remainDaysAddOnProd.map((t) => renderAddOnProd(t))}
            </View>
          </View>
          <ButtonWithPrice
            amount={selectedAddOnProd?.price || '0'}
            currency={i18n.t('esim:charge:addOn:currency')}
            onPress={() => {
              navigation.navigate('ChargeAgreement', {
                title: i18n.t('esim:charge:type:addOn'),
                addOnProd: selectedAddOnProd,
                mainSubs,
                contents: {
                  chargeProd: selectedAddOnProd?.title || '',
                  period: (
                    <TextWithDot
                      text={i18n.t('esim:charge:addOn:body', {
                        date: '0000년 00월 00일 00:00:00',
                      })}
                      dotStyle={styles.dot}
                      textStyle={styles.dotText}
                    />
                  ),
                  noticeTitle: i18n.t('esim:charge:addOn:notice:title'),
                  noticeBody: [1, 2, 3, 4, 5].map((n) =>
                    i18n.t(`esim:charge:addOn:notice:body${n}`),
                  ),
                },
              });
            }}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default AddOnScreen;
