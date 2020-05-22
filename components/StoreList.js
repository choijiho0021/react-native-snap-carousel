import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {connect} from 'react-redux'
import {appStyles} from "../constants/Styles"
import productApi from '../utils/api/productApi';
import i18n from '../utils/i18n';
import utils from '../utils/utils';
import api from '../utils/api/api'
import _ from 'underscore'
import { colors } from '../constants/Colors';
import { isDeviceSize } from '../constants/SliderEntry.style';
import { _Image } from 'react-native';

class CountryItem extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const {item} = this.props

    return (
      <View key={item.key} style={styles.productList}>
        {item.data.map((elm,idx) => (
            // 1개인 경우 사이 간격을 맞추기 위해서 width를 image만큼 넣음
          elm && elm.length > 0 ? 
          <View key={elm[0].ccode[0] + idx} style={{flex:1, marginLeft:idx == 1 ? 14 : 0}}>
            <TouchableOpacity onPress={() => this.props.onPress && this.props.onPress(elm)}>
              <Image key={"img"} source={{uri:api.httpImageUrl(elm[0].imageUrl)}} style={styles.image}/>
              <Text key={"cntry"} style={styles.cntry}>{productApi.getTitle(elm[0])}</Text>
              <View style={styles.priceRow}>
                <View style={styles.price}>
                  <Text key={"price"} style={styles.priceNumber}>{utils.numberToCommaString(elm[0].pricePerDay)}</Text> 
                  <Text key={"days"} style={[isDeviceSize('small') ? appStyles.normal14Text : appStyles.normal16Text,styles.text]}>{` ${i18n.t('won')}/Day`}</Text>
                </View>
                <View style={styles.lowPriceView}>
                  <Text style={styles.lowPrice}>{i18n.t('lowest')}</Text>
                </View>
              </View>
            </TouchableOpacity> 
          </View> : <View key="unknown" style={{flex:1}}/>
        ))}
      </View>
    )
  }
}

class StoreList extends Component {
  constructor(props) {
    super(props)

    this._renderItem = this._renderItem.bind(this)
  }

  shouldComponentUpdate( nextProps) {
    return this.props.data != nextProps.data
  }
  
  _renderItem = ({item}) => {
    return <CountryItem onPress={this.props.onPress} item={item}/>
  }

  render() {
    const {data} = this.props

    return (
      <View style={appStyles.container} >
        <FlatList style={styles.container} 
          data={data} 
          renderItem={this._renderItem}
          windowSize={6}
          // ListHeaderComponent={this._renderHeader}
          // refreshing={refreshing}
          // onScroll={this._onScroll}
          // extraData={index}
          // onRefresh={() => this._refresh(true)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex:1
  },
  text: {
    textAlign: "left",
    color:colors.clearBlue
  },
  image: {
    width: '100%',
    height: 110,
    resizeMode: 'cover'
  },
  productList : {
    flexDirection: 'row',
    marginTop:20,
    marginBottom:10,
    marginHorizontal:20
  },
  lowPrice : {
    ... appStyles.normal12Text,
    fontSize : isDeviceSize('small') ? 10 : 12,
    color : colors.black
  },
  lowPriceView : {
    width: isDeviceSize('small') ? 30 : 41,
    height: 22,
    borderRadius: 1,
    backgroundColor: colors.whiteTwo,
    alignItems:"center",
    justifyContent:"center"
  },
  priceRow : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent:"center"
  },
  price : {
    flexDirection: 'row',
    alignItems:"center"
  },
  priceNumber : {
      // fontFamily: "Roboto-Regular",
      fontSize: isDeviceSize('small') ? 18 : 20 ,
      fontWeight: "bold",
      fontStyle: "normal",
      lineHeight: 24,
      letterSpacing: 0.19,
      color: colors.clearBlue,
      textAlign: "left"
  },
  cntry : {
    ... appStyles.bold14Text,
    fontSize : isDeviceSize('small') ? 12 : 14,
    marginTop:11,
    marginBottom: isDeviceSize('small') ? 4 : 9
  }
});

export default StoreList