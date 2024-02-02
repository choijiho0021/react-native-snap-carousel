import React, {useCallback, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {colors} from '@/constants/Colors';
import AppText from '@/components/AppText';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import AppIcon from '@/components/AppIcon';

const styles = StyleSheet.create({
  iconBox: {
    backgroundColor: colors.paleBlue2,
    paddingTop: 48,
    paddingBottom: 10,
    paddingHorizontal: 20,
    gap: 32,
  },
  iconBoxLine: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  iconWithText: {
    width: 110,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  iconText: {
    ...appStyles.semiBold14Text,
    lineHeight: 18,
    textAlign: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chargeBoxFrame: {
    height: 48,
    width: 79,
  },
  chargeBox: {
    borderWidth: 1,
    borderColor: colors.veryLightBlue,
    borderRadius: 3,
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  chargeBoxText: {
    ...appStyles.bold12Text,
    lineHeight: 16,
    color: colors.black,
  },
});

type ProductDetailSixIconProps = {
  isDaily: boolean;
  volume: string;
  volumeUnit: string;
  ftr: string;
  prodDays: string | number;
  fup: string;
  network: string;
  hotspot: string | boolean;

  addonOption: string;
  setShowChargeInfoModal: (v: boolean) => void;
};

const ProductDetailSixIcon: React.FC<ProductDetailSixIconProps> = ({
  isDaily,
  volume,
  volumeUnit,
  ftr,
  prodDays,
  network,
  fup,
  hotspot,

  addonOption,
  setShowChargeInfoModal,
}) => {
  const feature = ftr.toUpperCase() || 'Only';

  const noFup = useMemo(() => fup === 'N/A' || fup === '0', [fup]);

  const renderIconWithText = useCallback(
    (icon: string, text: string) => (
      <View style={styles.iconWithText} key={`${icon}${text}`}>
        <AppIcon name={icon} />
        <AppText style={styles.iconText}>{text}</AppText>
      </View>
    ),
    [],
  );

  const renderChargeDetail = useCallback(
    (icon: string, text: string) => (
      <View style={styles.row} key={`${icon}${text}`}>
        <AppText style={styles.chargeBoxText}>{text}</AppText>
        <AppIcon name={icon} />
      </View>
    ),
    [],
  );

  const renderChargeIcon = useCallback(() => {
    const isChargeOff = addonOption === 'N' || !addonOption;
    return (
      <Pressable
        style={styles.iconWithText}
        onPress={() => setShowChargeInfoModal(true)}>
        <AppIcon name={isChargeOff ? 'iconChargeOff' : 'iconCharge'} />
        <View style={styles.row}>
          <AppText style={styles.iconText}>
            {i18n.t(`prodDetail:icon:charge${isChargeOff ? 'Off' : ''}`)}
          </AppText>
          <AppIcon name="iconChargeInfo" />
        </View>
        <View style={styles.chargeBoxFrame}>
          {!isChargeOff && (
            <View style={styles.chargeBox}>
              {[
                {
                  icon: addonOption === 'E' ? 'iconX' : 'iconOk',
                  text: i18n.t('prodDetail:icon:charge:addOn'),
                },
                {
                  icon: addonOption === 'A' ? 'iconX' : 'iconOk',
                  text: i18n.t('prodDetail:icon:charge:extension'),
                },
              ].map((i) => renderChargeDetail(i.icon, i.text))}
            </View>
          )}
        </View>
      </Pressable>
    );
  }, [addonOption, renderChargeDetail, setShowChargeInfoModal]);

  return (
    <View style={styles.iconBox}>
      <View style={styles.iconBoxLine}>
        {[
          {
            icon: `iconData${feature}`,
            text: i18n.t(`prodDetail:icon:data${feature}`),
          },
          {
            icon: 'iconClock',
            text: i18n.t('prodDetail:icon:clock', {
              days: prodDays,
            }),
          },
          {
            icon: network
              ? network === '5G/LTE/3G'
                ? 'icon5G'
                : network === '3G'
                ? 'icon3G'
                : 'iconLTE'
              : '',
            text: network || '',
          },
        ].map((i) => renderIconWithText(i?.icon, i?.text))}
      </View>
      <View style={[styles.iconBoxLine, {marginBottom: !addonOption ? 38 : 0}]}>
        {[
          {
            icon: noFup
              ? volume === '1000'
                ? 'iconAllday'
                : 'iconTimer'
              : 'iconSpeed',
            text: i18n.t(
              `prodDetail:icon:${
                noFup ? (volume === '1000' ? 'allday' : 'timer') : 'speed'
              }${
                noFup && volume === '1000' ? '' : isDaily ? ':daily' : ':total'
              }`,
              {
                data: `${volume}${volumeUnit}`,
              },
            ),
          },
          {
            icon: hotspot ? 'iconWifi' : 'iconWifiOff',
            text: i18n.t(`prodDetail:icon:${hotspot ? 'wifi' : 'wifiOff'}`),
          },
        ].map((i) => renderIconWithText(i.icon, i.text))}
        {addonOption && renderChargeIcon()}
      </View>
    </View>
  );
};

export default ProductDetailSixIcon;
