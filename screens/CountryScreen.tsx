/* eslint-disable consistent-return */
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component, memo} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  SectionList,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {connect} from 'react-redux';
import _ from 'underscore';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppPrice from '@/components/AppPrice';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {device, windowWidth} from '@/constants/SliderEntry.style';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import {RkbProduct} from '@/redux/api/productApi';
import {actions as cartActions} from '@/redux/modules/cart';
import {ProductModelState} from '@/redux/modules/product';
import i18n from '@/utils/i18n';

const {esimGlobal} = Env.get();

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
  box: {
    height: 150,
    // resizeMode: 'cover'
  },
  card: {
    height: windowWidth > device.small.window.width ? 71 : 60,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    // marginVertical: 7,
    marginHorizontal: 20,
    padding: 15,
    flexDirection: 'row',
  },
  divider: {
    height: 10,
    backgroundColor: colors.whiteTwo,
    marginTop: 32,
  },
  priceStyle: {
    height: 24,
    // fontFamily: "Roboto",
    fontSize: windowWidth > device.small.window.width ? 20 : 16,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0.19,
    textAlign: 'right',
    color: colors.black,
  },
  wonStyle: {
    height: 24,
    // fontFamily: "Roboto",
    fontSize: windowWidth > device.small.window.width ? 14 : 12,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0.19,
    color: colors.black,
  },
  appPrice: {
    alignItems: 'flex-end',
    marginLeft: 10,
    width: esimGlobal ? 60 : 80,
    justifyContent: 'center',
  },
  textView: {
    flex: 1,
    alignItems: 'flex-start',
  },
  badge: {
    paddingHorizontal: 8,
    height: 22,
    borderRadius: 2,
    alignItems: 'center',
    paddingTop: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 16,
  },
  itemDivider: {
    marginHorizontal: 40,
    height: 1,
    backgroundColor: colors.whiteTwo,
  },
  sectionHeader: {
    paddingTop: 32,
    paddingBottom: 20,
    marginHorizontal: 20,
    backgroundColor: colors.white,
  },
});
const toVolumeStr = (volume: number) => {
  if (volume <= 1000) return `${volume}MB`;
  return `${volume / 1024}GB`;
};

const CountryListItem0 = ({
  item,
  position,
  onPress,
}: {
  item: RkbProduct;
  position?: string;
  onPress: (v: string) => () => void;
}) => {
  const color = {
    color: item.field_daily === 'total' ? colors.purplyBlue : colors.clearBlue,
  };
  const title =
    item.field_daily === 'total'
      ? toVolumeStr(Number(item.volume))
      : item.days + i18n.t('day');
  let myStyle: ViewStyle = {};

  switch (position) {
    case 'head':
      myStyle = {borderBottomColor: 'white'};
      break;
    case 'middle':
      myStyle = {borderTopColor: 'white', borderBottomColor: 'white'};
      break;
    case 'tail':
      myStyle = {borderTopColor: 'white'};
      break;
    default:
      myStyle = {};
      break;
  }

  return (
    <Pressable onPress={onPress(item)}>
      <View key="product" style={[styles.card, myStyle]}>
        <View key="text" style={styles.textView}>
          <View style={{flexDirection: 'row'}}>
            <AppText
              key="name"
              style={[
                windowWidth > device.small.window.width
                  ? appStyles.bold16Text
                  : appStyles.bold14Text,
                color,
              ]}>
              {title}
            </AppText>
            {!_.isEmpty(item.promoFlag) && (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      item.promoFlag[0] === 'hot'
                        ? colors.tomato
                        : colors.clearBlue,
                  },
                ]}>
                <AppText key="name" style={styles.badgeText}>
                  {i18n.t(item.promoFlag[0])}
                </AppText>
              </View>
            )}
          </View>

          <AppText
            key="desc"
            style={[
              windowWidth > device.medium.window.width
                ? appStyles.normal14Text
                : appStyles.normal12Text,
              {marginTop: 5},
            ]}>
            {item.field_description}
          </AppText>
        </View>
        <View key="priceText" style={styles.appPrice}>
          <AppPrice
            key="price"
            price={item.price}
            balanceStyle={styles.priceStyle}
            currencyStyle={styles.wonStyle}
          />
        </View>
      </View>
      <View style={styles.itemDivider} />
    </Pressable>
  );
};

const CountryListItem = memo(CountryListItem0);

const position = (idx, arr) => {
  if (arr.length > 1) {
    if (idx === 0) return 'head';
    if (idx === arr.length - 1) return 'tail';
    return 'middle';
  }
  return 'onlyOne';
};

type CountryScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Country'
>;

type CountryScreenRouteProp = RouteProp<HomeStackParamList, 'Country'>;

type CountryScreenProps = {
  navigation: CountryScreenNavigationProp;
  route: CountryScreenRouteProp;

  product: ProductModelState;
  pending: boolean;
};

type CountryScreenState = {
  prodData: {title: string; data: RkbProduct[]}[];
  imageUrl?: string;
  title?: string;
  localOpDetails?: string;
  partnerId?: string;
};
class CountryScreen extends Component<CountryScreenProps, CountryScreenState> {
  constructor(props: CountryScreenProps) {
    super(props);

    this.state = {
      prodData: [],
      imageUrl: undefined,
      localOpDetails: undefined,
      partnerId: undefined,
    };

    this.onPress = this.onPress.bind(this);
  }

  async componentDidMount() {
    const {navigation, route, product} = this.props;
    const {localOpList, prodOfCountry} = product;
    const prodList =
      prodOfCountry.length > 0 ? prodOfCountry : route.params?.prodOfCountry;

    const localOp = localOpList.get(prodList[0]?.partnerId);
    const title =
      prodList && prodList.length > 0
        ? API.Product.getTitle(localOpList.get(prodList[0]?.partnerId))
        : '';

    this.setState({partnerId: prodList[0]?.partnerId});
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={title} />,
    });

    const prodData: {daily: RkbProduct[]; total: RkbProduct[]} =
      prodList.reduce((group: {[key: string]: RkbProduct[]}, el) => {
        const daily = el.field_daily;

        if (group[daily] === undefined) {
          group[daily] = [];
        }

        group[daily].push(el);
        return group;
      }, {});

    if (!_.isEmpty(prodList)) {
      this.setState({
        prodData: [
          {title: 'daily', data: prodData.daily || []},
          {title: 'total', data: prodData.total || []},
        ],
        imageUrl: localOp?.imageUrl,
        localOpDetails: localOp?.detail,
      });
    }
  }

  shouldComponentUpdate(
    nextProps: CountryScreenProps,
    nextState: CountryScreenState,
  ) {
    return this.props !== nextProps || this.state !== nextState;
  }

  onPress = (item: RkbProduct) => () => {
    const {imageUrl, localOpDetails, partnerId} = this.state;

    this.props.navigation.navigate('ProductDetail', {
      title: item.name,
      item,
      img: imageUrl,
      localOpDetails,
      partnerId,
    });
  };

  renderItem = ({
    item,
    index,
    section,
  }: {
    item: RkbProduct;
    index: number;
    section: {title: string; data};
  }) => {
    return (
      <CountryListItem
        item={item}
        onPress={this.onPress}
        position={position(index, section.data)}
      />
    );
  };

  render() {
    const {pending} = this.props;
    const {prodData, imageUrl} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {imageUrl && (
          <Image
            style={styles.box}
            source={{uri: API.default.httpImageUrl(imageUrl)}}
          />
        )}

        <View style={{flex: 1}}>
          <SectionList
            sections={prodData}
            // keyExtractor={(item, index) => item + index}
            renderItem={this.renderItem}
            renderSectionHeader={({section: {title, data}}) =>
              data.length >= 1 ? (
                <View style={styles.sectionHeader}>
                  <AppText
                    style={{
                      ...appStyles.bold20Text,
                    }}>
                    {i18n.t(`country:${title}`)}
                  </AppText>
                </View>
              ) : null
            }
            renderSectionFooter={({section: {title, data}}) =>
              title === 'daily' && prodData[1].data.length >= 1 ? (
                <View style={styles.divider} />
              ) : null
            }
          />
        </View>
        <AppActivityIndicator visible={pending} />
      </SafeAreaView>
    );
  }
}

export default connect(({product, status}: RootState) => ({
  product,
  pending:
    status.pending[cartActions.cartAddAndGet.typePrefix] ||
    status.pending[cartActions.checkStockAndPurchase.typePrefix] ||
    false,
}))(CountryScreen);
