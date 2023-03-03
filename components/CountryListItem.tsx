import React, {useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import _ from 'underscore';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {getPromoFlagColor, RkbProduct} from '@/redux/api/productApi';
import i18n from '@/utils/i18n';
import AppPrice from '@/components/AppPrice';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {renderPromoFlag} from '@/screens/ChargeHistoryScreen';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderStyle: 'solid',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
  },
  cardCharge: {
    backgroundColor: colors.white,
    marginHorizontal: 8,
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
  },

  balanceStyle: {
    fontSize: isDeviceSize('medium') ? 22 : 24,
    fontWeight: 'bold',
    textAlign: 'right',
    lineHeight: isDeviceSize('medium') ? 22 : 24,
  },
  wonStyleCharge: {
    fontSize: isDeviceSize('medium') ? 22 : 24,
    fontWeight: '600',
    lineHeight: isDeviceSize('medium') ? 22 : 24,
    color: colors.black,
  },
  disBalanceStyle: {
    fontSize: isDeviceSize('medium') ? 16 : 18,
    color: colors.greyish,
    fontWeight: 'bold',
    textAlign: 'right',
    lineHeight: 20,
  },
  disWonStyleCharge: {
    fontSize: isDeviceSize('medium') ? 16 : 18,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.greyish,
  },
  textView: {
    flex: 1,
    alignItems: 'flex-start',
  },
  itemDivider: {
    marginHorizontal: 20,
    height: 1,
    backgroundColor: colors.whiteTwo,
  },
  itemOutDivider: {
    marginHorizontal: 20,
    height: 1,
    borderStyle: 'solid',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: colors.lightGrey,
    borderRightColor: colors.lightGrey,
  },
  titleAndPrice: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  descRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    width: '100%',
  },
});

const toVolumeStr = (volume: number) => {
  if (volume <= 1000) return `${volume}MB`;
  return `${volume / 1024}GB`;
};

type CountryListItemProps = {
  item: RkbProduct;
  position?: string;
  onPress: () => void;
  isCharge?: boolean;
};

const CountryListItem: React.FC<CountryListItemProps> = ({
  item,
  position,
  onPress,
  isCharge = false,
}) => {
  const color = useMemo(
    () => ({
      color:
        item.field_daily === 'total' ? colors.purplyBlue : colors.clearBlue,
    }),
    [item.field_daily],
  );
  const title = useMemo(
    () =>
      item.field_daily === 'total'
        ? toVolumeStr(Number(item.volume))
        : item.days + i18n.t(item.days > 1 ? 'days' : 'day'),
    [item.days, item.field_daily, item.volume],
  );

  const myStyle = useMemo(() => {
    switch (position) {
      case 'head':
        return {
          borderLeftWidth: 1,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderLeftColor: colors.lightGrey,
          borderTopColor: colors.lightGrey,
          borderRightColor: colors.lightGrey,
          paddingTop: 26,
          paddingBottom: 20,
        };
      case 'middle':
        return {
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderLeftColor: colors.lightGrey,
          borderRightColor: colors.lightGrey,
          paddingVertical: 20,
        };
      case 'tail':
        return {
          borderLeftWidth: 1,
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderLeftColor: colors.lightGrey,
          borderBottomColor: colors.lightGrey,
          borderRightColor: colors.lightGrey,
          paddingTop: 20,
          paddingBottom: 26,
        };
      default:
        return {borderWidth: 1, borderColor: colors.lightGrey};
    }
  }, [position]);

  return (
    <Pressable onPress={onPress} style={{backgroundColor: colors.white}}>
      <View
        key="product"
        style={isCharge ? styles.cardCharge : [styles.card, myStyle]}>
        <View key="text" style={styles.textView}>
          <View style={styles.titleAndPrice}>
            <View style={{flexDirection: 'row'}}>
              <AppText
                key="name"
                style={[
                  isDeviceSize('medium')
                    ? appStyles.bold18Text
                    : appStyles.bold20Text,
                  color,
                ]}>
                {title}
              </AppText>
              {renderPromoFlag(item.promoFlag || [], false)}
            </View>
            <AppPrice
              price={item.price}
              balanceStyle={styles.balanceStyle}
              currencyStyle={styles.wonStyleCharge}
            />
          </View>

          <View style={styles.descRow}>
            <AppText
              key="desc"
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[
                appStyles.normal14Text,
                {
                  flex: 1,
                  fontSize: isDeviceSize('medium') ? 14 : 16,
                },
              ]}>
              {item.field_description}
            </AppText>
            {item.listPrice?.value > item.price?.value && (
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 10,
                }}>
                <AppPrice
                  price={item.listPrice}
                  balanceStyle={styles.disBalanceStyle}
                  currencyStyle={styles.disWonStyleCharge}
                  isDiscounted
                />
                <AppText
                  style={{
                    ...appStyles.bold16Text,
                    marginLeft: 4,
                    marginRight: 0,
                    color: colors.redError,
                  }}>
                  {Math.floor(
                    ((item.listPrice?.value - item.price.value) /
                      item.listPrice?.value) *
                      100,
                  )}
                  %
                </AppText>
              </View>
            )}
          </View>
        </View>
      </View>
      {position !== 'tail' && position !== 'onlyOne' && !isCharge && (
        <View style={styles.itemOutDivider}>
          <View style={styles.itemDivider} />
        </View>
      )}
    </Pressable>
  );
};

export default CountryListItem;
