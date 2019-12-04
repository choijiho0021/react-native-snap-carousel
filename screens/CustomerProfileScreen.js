import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList
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

class CustomerProfileScreen extends Component {
  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({navigation, title:i18n.t('pym:delivery')}),
  })

  constructor(props) {
    super(props)

    this.state = {
      checked: {},
      querying: undefined, 
    }    
    this._onChecked = this._onChecked.bind(this)
    this._deleteProfile = this._deleteProfile.bind(this)

  }

  componentDidMount() {

    this.props.action.order.getCustomerProfile(this.props.account.userId, this.props.account)
  }

  _onChecked(){
    console.log('cust state', this.state)
    
  }

  _deleteProfile() {
    console.log('account!!!!!', this.props)
    const { userId, auth } = this.props.account

    // this.setState({
    //   querying: true
    // })

    console.log('user Id', userId)
    console.log('auth', auth)

    // console.log('key item', item)

    // orderApi.delCustomerProfile(key, auth).then( resp => {
    //   if ( resp.result == 0) {
    //     // reload data
    //     orderApi.getCustomerProfile( userId, auth).then( 
    //       AppAlert.confirm('삭제를 완료하였습니다.')
    //     )
    //   }
    //   else {
    //     AppAlert.error( i18n.t('purchase:failedToDelete'))
    //   }
    // }).catch(_ => {
    //   AppAlert.error( i18n.t('purchase:failedToDelete'))
    // }).finally(() => {
    //   this.setState({
    //     querying: false
    //   })
    // })
  }

  _renderItem = ({item}) => {
    
    console.log('item', item)
    console.log(' props', this.props)
    // console.log('mobile', mobile)

      return (
        <View style={styles.cardSize}>
          <View style={{marginTop:19}}>
            <View style={styles.profileTitle}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                <Text style={styles.profileTitleText}>{item.alias}</Text>                            
                <View style={{flexDirection: 'row'}}>
                <AppButton title={i18n.t('modify')}
                            //  style={styles.buttonBorder} 
                            style={{backgroundColor: colors.white}}
                            titleStyle={styles.chgButtonText}
                            onPress={() => this.props.navigation.navigate('CustomerProfile')}/>
                  <View style={styles.buttonBorder}></View>                      
                      <AppButton title={i18n.t('delete')} 
                            style={{backgroundColor: colors.white}}
                            titleStyle={[styles.chgButtonText, {paddingRight: 20}]}
                            onPress={this._deleteProfile}/>

                </View>     
                  {/* <Text style={{alignItems: 'flex-end'}}>{i18n.t('modify')}</Text> */}
                  {/* <Text style={{alignItems: 'flex-end', flex: 1}}>{i18n.t('delete')}</Text> */}
              </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
              <AddressCard textStyle={styles.addrCardText}
                           mobileStyle={[styles.addrCardText, styles.colorWarmGrey]}
                           style={styles.addrCard}
                           //mobile={item.field_recipient_number}
                           profile={item}/>
              <View style={{flexDirection: 'column', justifyContent: 'flex-end'}}>
                <View style={{height: 56, justifyContent: 'center', width: 62}}>
                      {/* onPress={()=>this._onPress}> */}
                  <AppIcon name="btnCheck" checked={0}/>
                </View>
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
  }
});

const mapStateToProps = (state) => ({
  account: state.account.toJS(),
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