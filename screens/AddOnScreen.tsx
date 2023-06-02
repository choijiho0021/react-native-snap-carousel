import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Pressable} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import AppBackButton from '@/components/AppBackButton';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import {API} from '@/redux/api';
import {RkbAddOnProd} from '@/redux/api/productApi';
import {appStyles} from '@/constants/Styles';
import ButtonWithPrice from './EsimScreen/components/ButtonWithPrice';
import TextWithDot from './EsimScreen/components/TextWithDot';
import AppStyledText from '@/components/AppStyledText';
import AppSvgIcon from '@/components/AppSvgIcon';
import {sliderWidth} from '@/constants/SliderEntry.style';
import SelectedProdTitle from './EventBoardScreen/components/SelectedProdTitle';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  headerTitle: {
    height: 56,
    marginRight: 8,
  },
  addOnFrame: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flex: 1,
  },
  titleText: {
    ...appStyles.bold16Text,
    lineHeight: 24,
    marginVertical: 12,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  volumeBtnFrame: {
    marginBottom: 48,
    gap: 10,
  },
  typeBtn: {
    borderWidth: 1,
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 3,
    justifyContent: 'center',
  },
  typeBtnText: {
    ...appStyles.bold16Text,
    lineHeight: 24,
  },
  notice: {
    backgroundColor: colors.backGrey,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  noticeTitle: {
    padding: 16,
    paddingBottom: 8,
    display: 'flex',
    flexDirection: 'row',
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
  noticeText: {
    ...appStyles.medium14,
    lineHeight: 22,
  },
  noticeTextBold: {
    ...appStyles.bold14Text,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: colors.whiteFive,
    width: '100%',
  },
  divider2: {
    height: 1,
    marginTop: 40,
    marginBottom: 28,
    backgroundColor: colors.line,
    width: '100%',
  },
  noticeBody: {
    padding: 16,
    paddingBottom: 6,
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 6,
  },
  noticeBodyText: {
    ...appStyles.medium14,
    lineHeight: 22,
  },
  noticeBodyTextBold: {
    ...appStyles.bold14Text,
    lineHeight: 22,
  },
  noticeBox: {
    backgroundColor: colors.backGrey,
    padding: 16,
    paddingTop: 0,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  whiteBox: {
    borderRadius: 3,
    backgroundColor: colors.white,
    padding: 10,
  },
  useText: {
    ...appStyles.medium14,
    lineHeight: 22,
    color: colors.clearBlue,
    textAlign: 'center',
  },
  useTextBold: {
    ...appStyles.bold14Text,
    lineHeight: 22,
    color: colors.clearBlue,
    textAlign: 'center',
  },
  close: {
    height: 52,
    backgroundColor: colors.clearBlue,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    ...appStyles.medium18,
    lineHeight: 26,
    color: colors.white,
  },
  no: {
    width: '100%',
    marginTop: 105,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTitle: {
    ...appStyles.normal16Text,
    lineHeight: 24,
    textAlign: 'center',
  },
  noTitleBold: {
    ...appStyles.bold16Text,
    lineHeight: 24,
    color: colors.clearBlue,
    textAlign: 'center',
  },
  noBody: {
    ...appStyles.bold16Text,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 24,
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
  const {mainSubs, status, expireTime} = params || {};
  const [remainDays, setRemainDays] = useState(1);
  const [todayAddOnProd, setTodayAddOnProd] = useState<RkbAddOnProd[]>([]);
  const [remainDaysAddOnProd, setRemainDaysAddOnProd] = useState<
    RkbAddOnProd[]
  >([]);
  const [addOnTypeList, setAddOnTypeList] = useState<AddOnType[]>(['today']);
  const [selectedType, setSelectedType] = useState<AddOnType>('today');
  const [selectedAddOnProd, setSelectedAddOnProd] = useState<RkbAddOnProd>();
  // quadcell 기준 기본 한국시간 1시
  const [dataResetTime, setDataResetTime] = useState('01:00:00');

  useEffect(() => {
    if (mainSubs.daily === 'total') {
      setAddOnTypeList(['remainDays']);
      setSelectedType('remainDays');
      setSelectedAddOnProd(remainDaysAddOnProd[0]);
    }
  }, [mainSubs.daily, remainDaysAddOnProd, selectedAddOnProd]);

  useEffect(() => {
    if (expireTime) {
      // cmi의 리셋타임은 활성화 시간 기준으로 변경 됨
      if (mainSubs.partner === 'cmi')
        setDataResetTime(expireTime.format('HH:mm:ss'));

      // 남은 사용기간 구하기
      const today = moment();
      setRemainDays(Math.ceil(expireTime.diff(today, 'hours') / 24));
    }
  }, [expireTime, mainSubs.partner]);

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
      API.Product.getAddOnProduct(mainSubs.nid, remainDays.toString()).then(
        (data) => {
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
        },
      );
  }, [mainSubs, remainDays]);

  const renderTypeBtn = useCallback(
    (type: AddOnType) => (
      <Pressable
        style={[
          styles.typeBtn,
          {
            borderColor: selectedType === type ? colors.clearBlue : colors.line,
          },
          {width: (sliderWidth - 50) / 2},
        ]}
        onPress={() => {
          setSelectedType(type);
          if (type === 'today') setSelectedAddOnProd(todayAddOnProd[0]);
          else setSelectedAddOnProd(remainDaysAddOnProd[0]);
        }}>
        <AppText
          style={[
            styles.typeBtnText,
            {color: selectedType === type ? colors.clearBlue : colors.black},
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
              borderColor:
                selectedAddOnProd?.sku === item.sku
                  ? colors.clearBlue
                  : colors.line,
            },
            {width: (sliderWidth - 60) / 3, marginBottom: 10},
          ]}
          onPress={() => setSelectedAddOnProd(item)}>
          <AppText
            style={[
              styles.typeBtnText,
              {
                color:
                  selectedAddOnProd?.sku === item.sku
                    ? colors.clearBlue
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

  const renderUsagePrieod = useCallback(() => {
    const now = moment();
    const resetTime = moment(dataResetTime, 'HH:mm:ss');

    if (selectedType === 'today' && now.isAfter(resetTime))
      resetTime.add(1, 'day');

    return (
      <View style={styles.whiteBox}>
        {mainSubs.partner === 'quadcell' && status === 'unUsed' ? (
          <AppStyledText
            text={i18n.t('esim:charge:addOn:usagePeriod:unUsed')}
            textStyle={styles.useText}
            format={{b: styles.useTextBold}}
            data={{prodDays: mainSubs.prodDays || ''}}
          />
        ) : (
          <AppStyledText
            text={i18n.t('esim:charge:addOn:usagePeriod')}
            textStyle={styles.useText}
            format={{b: styles.useTextBold}}
            data={{
              usagePeriod:
                selectedType === 'remainDays'
                  ? expireTime?.format('YYYY년 MM월 DD일 HH:mm:ss') || ''
                  : resetTime.format('YYYY년 MM월 DD일 HH:mm:ss') || '',
            }}
          />
        )}
      </View>
    );
  }, [
    dataResetTime,
    expireTime,
    mainSubs.partner,
    mainSubs.prodDays,
    selectedType,
    status,
  ]);

  const renderNotice = useCallback(
    () => (
      <View style={styles.notice}>
        <View style={styles.noticeTitle}>
          <AppSvgIcon name="bluePin" style={{marginRight: 8}} />
          <View style={{paddingRight: 25}}>
            <AppStyledText
              text={i18n.t(`esim:charge:addOn:notice:${selectedType}`)}
              textStyle={styles.noticeText}
              format={{b: styles.noticeTextBold}}
            />
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.noticeBody}>
          <AppSvgIcon
            name="checkGreySmall"
            style={{marginRight: 4, alignSelf: 'center'}}
          />
          <AppStyledText
            text={i18n.t(`esim:charge:addOn:resetTime:${mainSubs.partner}`)}
            textStyle={styles.noticeBodyText}
            format={{b: styles.noticeBodyTextBold}}
            data={{expireTime: dataResetTime || ''}}
          />
        </View>
        <View style={styles.noticeBox}>{renderUsagePrieod()}</View>
      </View>
    ),
    [dataResetTime, mainSubs.partner, renderUsagePrieod, selectedType],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{flex: 1}}>
        <SelectedProdTitle
          isdaily={mainSubs.daily === 'daily'}
          prodName={mainSubs.prodName || ''}
        />

        {mainSubs.partner === 'cmi' && status === 'unUsed' ? (
          <View style={styles.no}>
            <AppSvgIcon name="blueNotice" style={{marginBottom: 16}} />
            <AppStyledText
              text={i18n.t('esim:charge:addOn:no:title')}
              textStyle={styles.noTitle}
              format={{b: styles.noTitleBold}}
            />
            <AppText style={styles.noBody}>
              {i18n.t('esim:charge:addOn:no:body')}
            </AppText>
          </View>
        ) : (
          <View style={styles.addOnFrame}>
            <AppText style={styles.titleText}>
              {i18n.t('esim:charge:addOn:type')}
            </AppText>
            <View style={[styles.row, {marginBottom: 16}]}>
              {addOnTypeList.map((t) => renderTypeBtn(t))}
            </View>
            {renderNotice()}
            <View style={styles.divider2} />
            <AppText style={styles.titleText}>
              {i18n.t('esim:charge:addOn:volume')}
            </AppText>
            <View style={[styles.row, styles.volumeBtnFrame]}>
              {selectedType === 'today'
                ? todayAddOnProd.map((t) => renderAddOnProd(t))
                : remainDaysAddOnProd.map((t) => renderAddOnProd(t))}
            </View>
          </View>
        )}
      </ScrollView>

      {mainSubs.partner === 'cmi' && status === 'unUsed' ? (
        <Pressable style={styles.close} onPress={() => navigation.goBack()}>
          <AppText style={styles.closeText}>{i18n.t('close')}</AppText>
        </Pressable>
      ) : (
        <ButtonWithPrice
          title={i18n.t('tutorial:next')}
          amount={selectedAddOnProd?.price.split(' ')[0] || '0'}
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
      )}
    </SafeAreaView>
  );
};

export default AddOnScreen;
