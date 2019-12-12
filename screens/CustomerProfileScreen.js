import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';
import i18n from '../utils/i18n'
import {appStyles} from '../constants/Styles'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as accountActions from '../redux/modules/account'
import * as orderActions from '../redux/modules/order'
import { SafeAreaView } from 'react-navigation'
import _ from 'underscore'
import AppBackButton from '../components/AppBackButton';
import AddressCard from '../components/AddressCard';
import { colors } from '../constants/Colors';
import AppButton from '../components/AppButton';
import { ScrollView } from 'react-native-gesture-handler';
import AppIcon from '../components/AppIcon';
import orderApi from '../utils/api/orderApi';
import AppAlert from '../components/AppAlert';

class CustomerProfileScreen extends Component {
  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({navigation, title:i18n.t('pym:delivery')}),
  })

  constructor(props) {
    super(props)

    this.state = {
      checked: {},
      querying: undefined, 
      update: false,
    }    

    this._onChecked = this._onChecked.bind(this)
    this._deleteProfile = this._deleteProfile.bind(this)

  }

  componentDidMount() {

    this.props.action.order.getCustomerProfile(this.props.account.userId, this.props.account)

  }

  componentDidUpdate(){

  }
  // _onChecked(){
  //   console.log('cust state', this.state)
    
  // }

  _onChecked(uuid) {
    console.log('uuid, ', uuid)
    const { checked} = this.state

    console.log('this state, ', this.state)
    console.log('checked, ', checked)

    this.setState({
      checked: {
        [uuid]: ! checked[uuid]
      }
    })

    console.log('checked, ',checked)
  }

  _deleteProfile(uuid) {
    console.log('account!!!!!', this.props)
    const { account } = this.props

    this.setState({
      querying: true
    })

    console.log('uuid', uuid)
    console.log('token', account)

    // console.log('key item', item)

    // orderApi.delCustomerProfile(uuid, account).then(resp => {
    //   console.log('delete', resp)
    // }).catch(_ => {
    //   console.log('Error delete')
    // })

    orderApi.delCustomerProfile(uuid, account).then(resp => {
      if ( resp.result != 0) 
      {
      //   // reload data
      //   orderApi.getCustomerProfile( account.userId, auth).then( 
      //     AppAlert.confirm('삭제를 완료하였습니다.')
      //   )
      // }
      // else {
        AppAlert.error( i18n.t('purchase:failedToDelete'))
      }else{
        console.log('삭제 성공')
        AppAlert.confirm(i18n.t('purchase:delAddr'))

      }
    }).catch(_ => {
      AppAlert.error( i18n.t('purchase:failedToDelete'))
    }).finally(() => {
      console.log('성공')
      this.setState({
        querying: false
      })
    })
  }

  // onRefresh = data => {
  //   console.log(data)
  //   this.setState({
  //     ... this.state.update,      
  //     update: ! update
  //   });
  // }

  _renderItem = ({item}) => {
    
    console.log('item', item)
    console.log(' props', this.props)
    // console.log('mobile', mobile)
    console.log('item uuid', item.uuid)

    console.log('state check', this.state.checked)
    // this.props.order.profile.filter(check => check.isBasicAddr == true ).uuid == item.uuid ? this._onChecked(item.uuid) : null

      return (
        <View style={[styles.cardSize, this.state.checked[item.uuid] == true ? styles.checkedBorder : null]}>
          <View style={{marginTop:19}}>
            <View style={styles.profileTitle}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                <Text style={[styles.profileTitleText, 
                            this.state.checked[item.uuid] == true ? styles.checkedColor : null]}>{item.alias}</Text>                            
                <View style={{flexDirection: 'row'}}>
                <AppButton title={i18n.t('modify')}
                            //  style={styles.buttonBorder} 
                            style={{backgroundColor: colors.white}}
                            titleStyle={styles.chgButtonText}
                            onPress={() => this.props.navigation.navigate('AddProfile', {update:item})}/>
                            {/* onPress={() => this.props.navigation.navigate('AddProfile', {update:item, refresh: this.onRefresh })}/> */}
                  <View style={styles.buttonBorder}></View>                      
                      <AppButton title={i18n.t('delete')} 
                            style={{backgroundColor: colors.white}}
                            titleStyle={[styles.chgButtonText, {paddingRight: 20}]}
                            onPress={()=>this._deleteProfile(item.uuid)}/>
                </View>     
              </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
              <AddressCard textStyle={styles.addrCardText}
                           mobileStyle={[styles.addrCardText, styles.colorWarmGrey]}
                           style={styles.addrCard}
                           key={item.uuid}
                           //mobile={item.field_recipient_number}
                           profile={item}/>
              <View style={{flexDirection: 'column', justifyContent: 'flex-end', padding:20}}>
                <TouchableOpacity style={{height: 56, justifyContent:'flex-end', alignItems: 'flex-end', width: 62}}
                                  onPress={()=>this._onChecked(item.uuid)}>
                  <AppIcon name="btnCheck" key={item.uuid} checked={this.state.checked[item.uuid] || false}/>
                </TouchableOpacity>
              </View>  
            </View>
          </View>
        </View> 
      )
  }

  render() {
    console.log('this.props.order.profile', this.props.order.profile)
    console.log('this.props.account.mobile', this.props.account.mobile)

    return (
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <FlatList data={this.props.order.profile} 
                    keyExtractor={item => item.uuid}
                    renderItem={this._renderItem} 
                    ListFooterComponent={<AppButton title={i18n.t('add')} 
                                                    textStyle={appStyles.confirmText}
                                                    //disabled={_.isEmpty(selected)}
                                                    onPress={()=>this.props.navigation.navigate('AddProfile')}
                                                    style={[appStyles.confirm, {marginTop: 20}]}/>} />
        </SafeAreaView>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ... appStyles.container,
    alignItems: 'stretch'
  },
  cardSize: {
    marginHorizontal: 20,
    marginTop: 20,
    //height: 160,
    borderRadius:3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.lightGrey
  },
  addrCard: {
    marginLeft: 20,
    marginTop: 7,
    marginBottom: 17,
    width: '65%'
  },
  addrCardText: {
    ... appStyles.normal14Text,
    color: colors.black,
    lineHeight: 24
  },
  profileTitle: {
    marginBottom: 6, 
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  profileTitleText: {
    // alignItems: 'flex-start',
    height: 19, 
    marginHorizontal: 20, 
    fontSize: 16, 
    fontWeight: 'bold'
  },
  chgButtonText: {
    fontSize: 12, 
    lineHeight: 19, 
    fontWeight: 'normal', 
    color: colors.warmGrey,
    paddingHorizontal: 15,
  },
  buttonBorder: {
    width: 1,
    height: 20,
    backgroundColor: colors.lightGrey,
  },
  colorWarmGrey: {
    color: colors.warmGrey
  },
  checkedBorder: {
    borderColor: colors.clearBlue
  },
  checkedColor: {
    color: colors.clearBlue
  }
});

const mapStateToProps = (state) => ({
  account: state.account.toJS(),
  auth: accountActions.auth(state.account),
  order: state.order.toJS()
})

// export default CustomerProfileScreen
export default connect(mapStateToProps, 
  (dispatch) => ({
    action: {
      account : bindActionCreators(accountActions, dispatch),
      order : bindActionCreators(orderActions, dispatch),  
    }
  })
)(CustomerProfileScreen)