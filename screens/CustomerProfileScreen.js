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
      checked: {}
    }    
    this._onChecked = this._onChecked.bind(this)
  }

  componentDidMount() {

    // console.log(this.props.order)
    // console.log(this.props.account)
    // this.props.action.order.getCustomerProfile(this.props.account.userId, this.props.account)
    // console.log(this.props.order)
  }

  _onChecked(){
    console.log('cust state', this.state)
    
  }

  _renderItem = ({item}) => {
    
    console.log('item', item)
    console.log(' props', this.props)
    // console.log('mobile', mobile)

      return (
        <View style={styles.cardSize}>
          <View style={{marginTop:19}}>
            <View style={[styles.profileTitle, {justifyContent: 'space-between'}]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.profileTitleText}>{item.organization}</Text>
              {/* <Text style={styles.profileTitleText}>{item.alias}</Text> */}
              
                <View style={{flexDirection: 'row'}}>
                  <AppButton title={i18n.t('modify')} 
                            textStyle={styles.chgButtonText}
                            style={{backgroundColor: colors.warmGrey}}
                            onPress={() => this.props.navigation.navigate('CustomerProfile')}/>
                  {/* <View style={{width: 1, height: 20, backgroundColor: colors.lightGrey}}></View>                              */}
                  <AppButton title={i18n.t('delete')} 
                            textStyle={styles.chgButtonText}
                            style={{backgroundColor: colors.warmGrey}}
                            onPress={() => this.props.navigation.navigate('CustomerProfile')}/>
                </View>     
                  {/* <Text style={{alignItems: 'flex-end'}}>{i18n.t('modify')}</Text> */}
                  {/* <Text style={{alignItems: 'flex-end', flex: 1}}>{i18n.t('delete')}</Text> */}
              </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
              <AddressCard textStyle={styles.addrCardText}
                           mobileStyle={[styles.addrCardText, styles.colorWarmGrey]}
                           style={styles.addrCard}
                           mobile={item.recipientNumber}
                           profile={item}/>
              {/* <View style={{justifyContent: 'flex-end', paddingRight: 20}}> */}
                <View style={{flexDirection: 'column', justifyContent: 'flex-end'}}>
                  <View style={{height: 56, justifyContent: 'center', width: 62}}
                        onPress={()=>this._onChecked}>
                    <AppIcon name="btnCheck" checked={()=>_onChecked}/>
                  </View>
                </View>
              {/* </View>                                                   */}
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
                    renderItem={this._renderItem} />
          <AppButton title={i18n.t('add')} 
                    textStyle={appStyles.confirmText}
                    //disabled={_.isEmpty(selected)}
                    onPress={()=>this.navigation.navigate('FindAddress')}
                    style={[appStyles.confirm, {marginTop: 20}]}/>
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
    flexDirection: 'row'
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
    color: colors.black
  },
  chgButton: {
    width: 50, 
    height: 36, 
    borderRadius: 3, 
    backgroundColor: colors.warmGrey, 
    marginHorizontal: 20
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