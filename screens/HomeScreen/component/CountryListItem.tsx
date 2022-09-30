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
    ...appStyles.bold24Text,
    fontSize: isDeviceSize('medium') ? 22 : 24,
  },
  balanceStyleCharge: {
    ...appStyles.bold22Text,
    fontSize: isDeviceSize('medium') ? 22 : 24,
    lineHeight: 24,
  },
  wonStyleCharge: {
    ...appStyles.normal14Text,
    fontSize: isDeviceSize('medium') ? 14 : 12,
    lineHeight: 24,
    color: colors.black,
  },
  textView: {
    flex: 1,
    alignItems: 'flex-start',
  },
  badge: {
    paddingHorizontal: 8,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badgeCharge: {
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badgeText: {
    ...appStyles.bold13Text,
  },
  badgeTextCharge: {
    ...appStyles.extraBold20,
    fontSize: 12,
    lineHeight: 16,
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
              {!_.isEmpty(item.promoFlag) &&
                item.promoFlag.map((elm) => {
                  const badgeColor = getPromoFlagColor(elm);
                  return (
                    <View
                      key={elm}
                      style={[
                        isCharge ? styles.badgeCharge : styles.badge,
                        {
                          backgroundColor: badgeColor.backgroundColor,
                        },
                      ]}>
                      <AppText
                        key="name"
                        style={[
                          isCharge ? styles.badgeTextCharge : styles.badgeText,

                          {color: badgeColor.fontColor},
                        ]}>
                        {i18n.t(elm)}
                      </AppText>
                    </View>
                  );
                })}
            </View>
            <AppPrice
              price={item.price}
              balanceStyle={
                isCharge ? styles.balanceStyleCharge : styles.balanceStyle
              }
              currencyStyle={isCharge && styles.wonStyleCharge}
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
