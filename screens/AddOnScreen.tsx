import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View, Pressable} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import {colors} from '@/constants/Colors';
import {HomeStackParamList} from '@/navigation/navigation';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import {RkbAddOnProd} from '@/redux/api/productApi';
import {appStyles} from '@/constants/Styles';
import ButtonWithPrice from './EsimScreen/components/ButtonWithPrice';
import AppStyledText from '@/components/AppStyledText';
import AppSvgIcon from '@/components/AppSvgIcon';
import {sliderWidth, windowHeight} from '@/constants/SliderEntry.style';
import SelectedProdTitle from './EventBoardScreen/components/SelectedProdTitle';
import ScreenHeader from '@/components/ScreenHeader';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
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
  flex: {
    display: 'flex',
    height: windowHeight - 374,
    alignItems: 'center',
    justifyContent: 'center',
  },
  no: {
    width: '100%',
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
  const {chargeableItem, status, expireTime, addonProds} = params || {};
  const [todayAddOnProd, setTodayAddOnProd] = useState<RkbAddOnProd[]>([]);
  const [remainDaysAddOnProd, setRemainDaysAddOnProd] = useState<
    RkbAddOnProd[]
  >([]);
  const [addOnTypeList, setAddOnTypeList] = useState<AddOnType[]>(['today']);
  const [selectedType, setSelectedType] = useState<AddOnType>('today');
  const [selectedAddOnProd, setSelectedAddOnProd] = useState<RkbAddOnProd>();
  // quadcell 기준 기본 한국시간 1시
  const [dataResetTime, setDataResetTime] = useState('01:00:00');
  const [noProd, setNoProd] = useState(false);
  const format = 'YYYY년 MM월 DD일 HH:mm:ss';

  const usagePeriod = useMemo(() => {
    const now = moment().utcOffset(9);
    const resetTime = moment(dataResetTime, 'HH:mm:ss');

    if (selectedType === 'today') {
      const n = moment(now.format(format), format);
      const r = moment(resetTime.format(format), format);
      if (n.isAfter(r)) resetTime.add(1, 'day');
    }

    if (chargeableItem.partner?.startsWith('quadcell') && status === 'R') {
      return {
        text: i18n.t('esim:charge:addOn:usagePeriod:unUsed'),
        period: chargeableItem.prodDays || '',
      };
    }
    return {
      text: i18n.t('esim:charge:addOn:usagePeriod'),
      period:
        selectedType === 'remainDays' ||
        (expireTime && expireTime.diff(now, 'hours') < 24)
          ? expireTime?.utcOffset(9).format(format) || ''
          : resetTime.format(format) || '',
      format,
    };
  }, [
    dataResetTime,
    expireTime,
    chargeableItem.partner,
    chargeableItem.prodDays,
    selectedType,
    status,
  ]);

  useEffect(() => {
    if (expireTime) {
      // cmi의 리셋타임은 활성화 시간 기준으로 변경 됨
      if (
        chargeableItem.partner?.startsWith('cmi') ||
        chargeableItem.partner === 'quadcell2'
      ) {
        setDataResetTime(expireTime.utcOffset(9).format('HH:mm:ss'));
      }
    }
  }, [expireTime, chargeableItem.partner]);

  useEffect(() => {
    // 충전 가능 상품 있는 지 여부 확인

    if (addonProds) {
      const todayProd = addonProds.filter((r) => r.days === '1');
      const remainDaysProd = addonProds.filter((r) => r.days !== '1');

      if (todayProd.length < 1 && remainDaysProd.length < 1) {
        setNoProd(true);
        return;
      }

      if (remainDaysProd.length > 0) {
        // 쿼드셀 무제한 (사용전), 쿼드셀 종량제의 경우 하루 충전 지원 x
        if (
          chargeableItem.partner?.startsWith('quadcell') &&
          (status === 'R' || chargeableItem.daily === 'total')
        ) {
          setAddOnTypeList(['remainDays']);
          setSelectedType('remainDays');
          setSelectedAddOnProd(remainDaysProd[0]);
          setRemainDaysAddOnProd(remainDaysProd);
          return;
        }

        setAddOnTypeList(['today', 'remainDays']);
      }

      setTodayAddOnProd(todayProd);
      setSelectedAddOnProd(todayProd[0]);
      setRemainDaysAddOnProd(remainDaysProd);
    } else {
      setNoProd(true);
    }
  }, [addonProds, chargeableItem.daily, chargeableItem.partner, status]);

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

  const prodTitle = useCallback(
    (volume: number) => {
      const dailyPrefix =
        chargeableItem.daily === 'daily' ? `${i18n.t(`days`)} ` : '';
      return `${dailyPrefix}${
        volume > 500 ? `${volume / 1024}GB` : `${volume}MB`
      }`;
    },
    [chargeableItem.daily],
  );

  const renderAddOnProd = useCallback(
    (item: RkbAddOnProd, index: number) => {
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
            {width: (sliderWidth - 61) / 3, marginBottom: 10},
            //  margin 확인 필요
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
            {prodTitle(volume)}
          </AppText>
        </Pressable>
      );
    },
    [prodTitle, selectedAddOnProd?.sku],
  );

  const renderUsagePrieod = useCallback(
    () => (
      <View style={styles.whiteBox}>
        <AppStyledText
          text={usagePeriod.text}
          textStyle={styles.useText}
          format={{b: styles.useTextBold}}
          data={{date: usagePeriod.period}}
        />
      </View>
    ),
    [usagePeriod],
  );

  const renderNotice = useCallback(() => {
    return (
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
        {chargeableItem.daily === 'daily' && (
          <View style={styles.noticeBody}>
            <AppSvgIcon
              name="checkGreySmall"
              style={{marginRight: 4, alignSelf: 'center'}}
            />

            <AppStyledText
              text={i18n.t(
                `esim:charge:addOn:resetTime:${status}:${chargeableItem.partner}`,
              )}
              textStyle={styles.noticeBodyText}
              format={{b: styles.noticeBodyTextBold}}
              data={{expireTime: dataResetTime || ''}}
            />
          </View>
        )}
        <View style={styles.noticeBox}>{renderUsagePrieod()}</View>
      </View>
    );
  }, [
    chargeableItem.partner,
    chargeableItem.daily,
    status,
    selectedType,
    dataResetTime,
    renderUsagePrieod,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={i18n.t('esim:charge:type:addOn')} />
      <ScrollView style={{flex: 1}}>
        <SelectedProdTitle
          isdaily={chargeableItem.daily === 'daily'}
          prodName={chargeableItem.prodName || ''}
          isAddOn
        />

        {(chargeableItem.partner?.startsWith('cmi') && status === 'R') ||
        noProd ? (
          <View style={styles.flex}>
            <View style={styles.no}>
              <AppSvgIcon name="blueNotice" style={{marginBottom: 16}} />
              <AppStyledText
                text={i18n.t(
                  `esim:charge:addOn:${
                    chargeableItem.partner?.startsWith('cmi') && status === 'R'
                      ? 'no'
                      : 'empty'
                  }:title`,
                )}
                textStyle={styles.noTitle}
                format={{b: styles.noTitleBold}}
              />
              {chargeableItem.partner?.startsWith('cmi') && status === 'R' && (
                <AppText style={styles.noBody}>
                  {i18n.t('esim:charge:addOn:no:body')}
                </AppText>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.addOnFrame}>
            <AppText style={styles.titleText}>
              {i18n.t('esim:charge:addOn:type')}
            </AppText>
            <View
              style={[
                styles.row,
                {marginBottom: 16, justifyContent: 'space-between'},
              ]}>
              {addOnTypeList.map((t) => renderTypeBtn(t))}
            </View>
            {renderNotice()}
            <View style={styles.divider2} />
            <AppText style={styles.titleText}>
              {i18n.t('esim:charge:addOn:volume')}
            </AppText>
            <View style={[styles.row, styles.volumeBtnFrame]}>
              {selectedType === 'today'
                ? todayAddOnProd.map((t, i) => renderAddOnProd(t, i))
                : remainDaysAddOnProd.map((t, i) => renderAddOnProd(t, i))}
            </View>
          </View>
        )}
      </ScrollView>

      {(chargeableItem.partner?.startsWith('cmi') && status === 'R') ||
      noProd ? (
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
              type: 'addOn',
              usagePeriod,
              status,
              chargeableItem,
              expireTime,
              contents: {
                chargeProd: selectedAddOnProd?.title || '',
                noticeTitle: i18n.t('esim:charge:addOn:notice:title'),
                noticeBody:
                  chargeableItem.partner?.startsWith('quadcell') &&
                  chargeableItem.daily === 'daily'
                    ? i18n
                        .t('esim:charge:addOn:notice:body:quadcellD')
                        .split('\n')
                    : i18n.t('esim:charge:addOn:notice:body').split('\n'),
              },
            });
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default AddOnScreen;
