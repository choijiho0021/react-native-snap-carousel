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
    fontSize: 14,
    fontWeight: '600',
    lineHeight: isDeviceSize('medium') ? 22 : 24,
    color: colors.black,
  },
  textView: {
    flex: 1,
    alignItems: 'flex-start',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    height: 20,
    alignSelf: 'center',
  },

  badgeText: {
    ...appStyles.extraBold12,
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
});

const toVolumeStr = (volume: number) => {
  if (volume <= 1000) return `${volume}MB`;
  return `${volume / 1024}GB`;
};

type CountryListItemProps = {
  item: RkbProduct;
  position?: string;
  onPress: () => void;
  isCharge: boolean;
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
    <Pressable onPress={onPress}>
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

          <AppText
            key="desc"
            style={[
              appStyles.normal13,
              {marginTop: 5, fontSize: isDeviceSize('medium') ? 13 : 15},
            ]}>
            {item.field_description}
          </AppText>
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
