import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {appStyles} from '../constants/Styles';
import i18n from '../utils/i18n';
import utils from '../utils/utils';
import _ from 'underscore';
import {colors} from '../constants/Colors';
import {isDeviceSize} from '../constants/SliderEntry.style';
import {API} from 'RokebiESIM/submodules/rokebi-utils';

class CountryItem extends PureComponent {
  render() {
    const {item, localOpList} = this.props;

    return (
      <View key={item.key} style={styles.productList}>
        {item.data.map((elm, idx) => {
          // 1개인 경우 사이 간격을 맞추기 위해서 width를 image만큼 넣음
          if (elm && elm.length > 0) {
            const localOp = localOpList.get(elm[0].partnerId) || {},
              bestPrice = elm.reduce(
                (acc, cur) =>
                  typeof acc === 'undefined'
                    ? cur.pricePerDay
                    : Math.min(acc, cur.pricePerDay),
                undefined,
              );

            return (
              <View
                key={elm[0].key}
                style={{flex: 1, marginLeft: idx == 1 ? 14 : 0}}>
                <TouchableOpacity
                  onPress={() => this.props.onPress && this.props.onPress(elm)}>
                  <Image
                    key={'img'}
                    source={{uri: API.default.httpImageUrl(localOp.imageUrl)}}
                    style={styles.image}
                  />
                  <Text key={'cntry'} style={styles.cntry}>
                    {API.Product.getTitle(elm[0].categoryId, localOp)}
                  </Text>
                  <View style={styles.priceRow}>
                    <View style={styles.price}>
                      <Text key={'price'} style={styles.priceNumber}>
                        {utils.numberToCommaString(bestPrice)}
                      </Text>
                      <Text
                        key={'days'}
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
  }
}

let CountryItemConnected = connect(state => ({
  localOpList: state.product.get('localOpList'),
}))(CountryItem);

class StoreList extends Component {
  constructor(props) {
    super(props);

    this._renderItem = this._renderItem.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.data != nextProps.data;
  }

  _renderItem = item => {
    return (
      <CountryItemConnected
        key={item.key}
        onPress={this.props.onPress}
        item={item}
      />
    );
  };

  render() {
    const {data} = this.props;

    return (
      <View style={appStyles.container}>
        {data.map(elm => this._renderItem(elm))}
        {/* <FlatList
          style={styles.container}
          data={data}
          renderItem={this._renderItem}
          windowSize={6}
        /> */}
      </View>
    );
  }
}

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

export default StoreList;
