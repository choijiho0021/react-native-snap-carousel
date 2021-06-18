import React, {Component, PureComponent} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {connect} from 'react-redux';
import _ from 'underscore';
import {API} from 'RokebiESIM/submodules/rokebi-utils';
import {appStyles} from '../constants/Styles';
import i18n from '../utils/i18n';
import utils from '../utils/utils';
import {colors} from '../constants/Colors';
import {isDeviceSize} from '../constants/SliderEntry.style';
import {RootState} from '@/redux';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  text: {
    textAlign: 'left',
    color: colors.clearBlue,
  },
  image: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productList: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  lowPrice: {
    ...appStyles.normal12Text,
    fontSize: isDeviceSize('small') ? 10 : 12,
    color: colors.black,
  },
  lowPriceView: {
    width: isDeviceSize('small') ? 30 : 41,
    height: 22,
    borderRadius: 1,
    backgroundColor: colors.whiteTwo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceNumber: {
    // fontFamily: "Roboto-Regular",
    fontSize: isDeviceSize('small') ? 18 : 20,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0.19,
    color: colors.clearBlue,
    textAlign: 'left',
  },
  cntry: {
    ...appStyles.bold14Text,
    fontSize: isDeviceSize('small') ? 12 : 14,
    marginTop: 11,
    marginBottom: isDeviceSize('small') ? 4 : 9,
  },
});

const CountryItem = ({item, localOpList, onPress}) => {
  return (
    <View key={item.key} style={styles.productList}>
      {item.data.map((elm, idx) => {
        // 1개인 경우 사이 간격을 맞추기 위해서 width를 image만큼 넣음
        if (elm && elm.length > 0) {
          const localOp =
            (localOpList && localOpList.get(elm[0].partnerId)) || {};
          const bestPrice = elm.reduce(
            (acc, cur) =>
              typeof acc === 'undefined'
                ? cur.pricePerDay
                : Math.min(acc, cur.pricePerDay),
            undefined,
          );

          return (
            <View
              key={elm[0].key}
              style={{flex: 1, marginLeft: idx === 1 ? 14 : 0}}>
              <TouchableOpacity onPress={() => onPress && onPress(elm)}>
                <Image
                  key="img"
                  source={{uri: API.default.httpImageUrl(localOp.imageUrl)}}
                  style={styles.image}
                />
                <Text key="cntry" style={styles.cntry}>
                  {API.Product.getTitle(localOp)}
                </Text>
                <View style={styles.priceRow}>
                  <View style={styles.price}>
                    <Text key="price" style={styles.priceNumber}>
                      {utils.numberToCommaString(bestPrice)}
                    </Text>
                    <Text
                      key="days"
                      style={[
                        isDeviceSize('small')
                          ? appStyles.normal14Text
                          : appStyles.normal16Text,
                        styles.text,
                      ]}>{` ${i18n.t('won')}/Day`}</Text>
                  </View>
                  <View style={styles.lowPriceView}>
                    <Text style={styles.lowPrice}>{i18n.t('lowest')}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        }

        return <View key="unknown" style={{flex: 1}} />;
      })}
    </View>
  );
};

class StoreList extends Component {
  shouldComponentUpdate(nextProps) {
    const {data, refreshTrigger} = this.props;

    return (
      data !== nextProps.data ||
      (data === [] && refreshTrigger !== nextProps.refreshTrigger)
    );
  }

  render() {
    const {data, localOpList, onPress} = this.props;

    return (
      <View style={appStyles.container}>
        {data.map((elm) => (
          <CountryItem
            key={elm.key}
            onPress={onPress}
            item={elm}
            localOpList={localOpList}
          />
        ))}
      </View>
    );
  }
}

export default connect(({product}: RootState) => ({
  localOpList: product.localOpList,
}))(StoreList);
