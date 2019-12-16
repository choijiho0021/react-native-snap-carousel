import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
} from 'react-native';
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import i18n from '../utils/i18n'
import * as profileActions from '../redux/modules/profile'
import { Platform } from '@unimodules/core';
import { TextField } from 'react-native-material-textfield'
import Icon from 'react-native-vector-icons/Ionicons';
import AppButton from '../components/AppButton';
import addressApi from '../utils/api/addressApi';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Address from '../components/Address'
import _ from 'underscore'
import {colors} from '../constants/Colors'
import { appStyles } from '../constants/Styles';
import AppBackButton from '../components/AppBackButton';

class FindAddressScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('purchase:address')} />
  })

  constructor(props) {
    super(props)

    this.state = {
      addr : undefined,
      links : undefined,
      data : []
    }

    this._onChangeText = this._onChangeText.bind(this)
    this._findAddr = this._findAddr.bind(this)
    this._renderItem = this._renderItem.bind(this)
  }

  _onChangeText = (key) => (value) => {
    this.setState({
      [key] : value
    })
  }

  _search() {
    return (
      <Icon name={Platform.OS == 'ios' ? 'ios-search' : 'md-search'} size={32} />
    )
  }

  _findAddr = (page=1) => () => {
    const { addr } = this.state

    addressApi.find(addr, page).then( resp => {
      this.setState({
        links: resp.links,
        data : resp.objects
      })

    })
  }

  _onPress = (addr) => () => {
    
    //리덕스 저장
    this.props.action.profile.updateProfileAddress(addr)
    this.props.navigation.goBack()

  }

  _renderPagination() {
    const {links} = this.state,
      {totalCount = 0, countPerPage =1, currentPage=1} = _.isArray(links) && links.length > 0 ? links[0] : {},
      totalPage = Math.ceil( Number(totalCount) / Number(countPerPage))

    return (
      <View style={styles.pagination} >
        <Text>{i18n.t('addr:totalCnt').replace('%%', totalCount)}</Text>
        <Icon name="ios-arrow-back" size={24} onPress={this._findAddr( Math.max( 1, Number(currentPage) -1))}/>
        <Text>{`${currentPage} / ${totalPage}`}</Text>
        <Icon name="ios-arrow-forward" size={24} onPress={this._findAddr( Math.min(totalPage, Number(currentPage) +1))}/>
      </View>
    )
  }

  _renderItem({item}) {
    return (
      <TouchableOpacity onPress={this._onPress(item)}>
        <Address item={item}/>
      </TouchableOpacity>
    )
  }

  render() {
    const { addr, data } = this.state

    return (
      <View style={{flex:1}}>
        <View style={styles.modal}>
          <View style={[styles.textFieldBox, {borderBottomColor: colors.black}]}>
            <TextField containerStyle={styles.field}
              style={{fontSize:14}}
              label={i18n.t('purchase:findAddr')}
              returnKeyType='done'
              enablesReturnKeyAutomatically={true}
              onChangeText={this._onChangeText('addr')}
              onEndEditing={this._findAddr()}
              renderAccessory={this._search}
              value={addr} />
            <AppButton style = {styles.showSearchBar} onPress={() => this._findAddr()} iconName="btnSearchOff" />
          </View>
          <View style={styles.divider}/>
          { 
            addr ? this._renderPagination() :           
            <View style={styles.mrgLeft40}>
              <Text style={styles.searchEx, styles.boldText16}>{i18n.t('purchase:searchEx')}</Text>
              <Text style={styles.searchEx}>{i18n.t('purchase:roadBuildingNo')}</Text>
              <Text style={styles.searchEx}>{i18n.t('purchase:areaBunji')}</Text>
              <Text style={styles.searchEx}>{i18n.t('purchase:areaBuilding')}</Text>
            </View>     
          }
          <FlatList data={data} renderItem={this._renderItem} keyExtractor={item => item.bdMgtSn}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  field: {
    // marginHorizontal: 20,
    // padding: 5,
    // width: "100%",
    height: 46,
  },
  modal: {
      flex: 1,
      justifyContent: "flex-start",
      backgroundColor: 'white'
  },
  divider: {
    marginHorizontal: 0,
    marginVertical: 20,
    height: 10,
    backgroundColor: colors.whiteTwo
  },  
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  textFieldBox: {
    // height: 46, 
    marginHorizontal: 20, 
    // marginBottom: 20,
    // borderBottomWidth: 1,
  },
  searchEx: {
    ... appStyles.normal14Text,
    letterSpacing: 0.15,
    lineHeight: 30
  },
  mrgLeft40: {
    marginLeft: 40
  },
  boldText16: {
    fontSize: 16, 
    lineHeight: 30,
    fontWeight: 'bold', 
    color: colors.black,
  },
  showSearchBar : {
    marginRight:20,
    paddingBottom: 16,
    alignSelf: 'flex-end',
    width: 15,
    height: 16
  }
});

// export default FindAddressScreen
export default connect(undefined, 
  (dispatch) => ({
    action: {
      profile : bindActionCreators(profileActions, dispatch),
    }
  })
)(FindAddressScreen)