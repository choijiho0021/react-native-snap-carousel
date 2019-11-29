import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux'

import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import * as productActions from '../redux/modules/product'
import FlatListIcon from '../components/FlatListIcon'
import utils from '../utils/utils'
import { bindActionCreators } from 'redux'
import AppButton from '../components/AppButton'

//
// 각 국가별 상품 목록을 보여준다.
//
class ProductScreen extends Component {
  static navigationOptions = {
    title: i18n.t('product')
  }

  constructor(props) {
    super(props)

    this.state = {
      data: [],
      selected: "",
    }
  }

  componentDidMount() {
    const {idx, prodList} = this.props.product,
      prod = prodList[idx]

    this.setState({
      data: prodList.filter(item => item.ccode == prod.ccode).map(item => ({
        ... item,
        key: item.uuid,
      }))
    })
  }

  _onSelect = (key) => () => {
    this.setState({
      selected: key
    })
  }

  _onPress = () => {
    const selected = this.state.data.find((item) => (item.key === this.state.selected))
    if ( selected) {
      this.props.ProductActions.addProduct( selected.key, selected.name)
    }
    this.props.navigation.goBack()
  }


  _renderItem = ({item}) => {
    const selected = item.key == this.state.selected
    return (
      <TouchableOpacity onPress={this._onSelect(item.key)}>
        <View style={appStyles.itemRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={[styles.price, {width: selected ? "30%" : "40%"}]}>{`${utils.numberToCommaString(item.price)} ${i18n.t('won')}`}</Text>
          { selected && <FlatListIcon name="ios-checkmark"/> }
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList style={styles.list} data={this.state.data} renderItem={this._renderItem}
          extraData={this.state.selected} />
        <AppButton containerStyle={appStyles.button} 
          onPress={this._onPress}>{i18n.t('select')}</AppButton>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  list : {
    flex: 1,
    width: "100%",
  },
  name : {
    ... appStyles.itemValue,
    width: "60%"
  },
  price : {
    ... appStyles.itemValue,
    textAlign: 'right'
  }
});

const mapStateToProps = (state) => ({
  product: state.product.toJS()
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    ProductActions: bindActionCreators(productActions, dispatch),
  })
)(ProductScreen)