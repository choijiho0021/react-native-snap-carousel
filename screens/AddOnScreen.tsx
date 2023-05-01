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
  prodName: {
    marginTop: 10,
    paddingTop: 50,
    marginHorizontal: 20,
  },
  prodNameText: {
    ...appStyles.bold20Text,
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
  const mainSubs = useMemo(() => params.mainSubs, [params.mainSubs]);
  const remainDays = useMemo(() => '2', []);
  const [todayAddOnProd, setTodayAddOnProd] = useState<RkbAddOnProd[]>([]);
  const [remainDaysAddOnProd, setRemainDaysAddOnProd] = useState<
    RkbAddOnProd[]
  >([]);
  const [addOnTypeList, setAddOnTypeList] = useState<AddOnType[]>(['today']);
  const [selectedType, setSelectedType] = useState<AddOnType>('today');
  const [selectedAddOnProd, setSelectedAddOnProd] = useState<RkbAddOnProd>();
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.prodName}>
        <AppText style={styles.prodNameText}>{mainSubs.prodName}</AppText>
      </View>
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
        onPress={() => {}}
      />
    </SafeAreaView>
  );
};

export default AddOnScreen;
