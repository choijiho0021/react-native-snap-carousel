import React, {Component} from 'react';
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

class CountryItem extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps) {
    
    const oldData = this.props.item.data,
      newData = nextProps.item.data

    //데이터중 바뀐게 있다면 다시 그린다
    return JSON.stringify(oldData) !== JSON.stringify(newData)

    // ccode 목록이 달라지면, 다시 그린다. 
    // return newData.findIndex((elm,idx) => _.isEmpty(oldData[idx]) || elm == undefined  ? true : elm.ccode != oldData[idx].ccode) >= 0
  }

  render() {
    const {item} = this.props

    return (
      <View key={item.key} style={styles.productList}>
        {item.data.map((elm,idx) => (
            // 1개인 경우 사이 간격을 맞추기 위해서 width를 image만큼 넣음
          elm ? <View key={elm.ccode + idx} style={{flex:1, marginLeft:idx == 1 ? 14 : 0}}>
            <TouchableOpacity onPress={() => this.props.onPress && this.props.onPress(elm.uuid)}>
              <Image key={"img"} source={{uri:api.httpImageUrl(elm.imageUrl)}} style={styles.image}/>
              {/* cntry가 Set이므로 첫번째 값을 가져오기 위해서 values().next().value를 사용함 */}
              <Text key={"cntry"} style={styles.cntry}>{elm.categoryId == productApi.category.multi ? elm.name : elm.cntry.values().next().value}</Text>
              <View style={styles.priceRow}>
                <View style={styles.price}>
                  <Text key={"price"} style={styles.priceNumber}>{utils.numberToCommaString(elm.pricePerDay)}</Text> 
                  <Text key={"days"} style={[appStyles.normal16Text,styles.text]}>{` ${i18n.t('won')}/Day`}</Text>
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
    return _.isEmpty(item) ? {ccode:'nodata'} : <CountryItem onPress={this.props.onPress} item={item}/>
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
    resizeMode: 'cover',
    borderRadius:10
  },
  productList : {
    flexDirection: 'row',
    marginTop:20,
    marginBottom:10,
    marginHorizontal:20
  },
  lowPrice : {
    ... appStyles.normal12Text,
    color : colors.black
  },
  lowPriceView : {
    width: 41,
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
      fontSize: 20,
      fontWeight: "bold",
      fontStyle: "normal",
      lineHeight: 24,
      letterSpacing: 0.19,
      color: colors.clearBlue,
      textAlign: "left"
  },
  cntry : {
    ... appStyles.bold14Text,
    marginTop:11,
    marginBottom:9
  }
});

export default StoreList