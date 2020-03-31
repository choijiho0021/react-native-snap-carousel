import React, {Component, PureComponent} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import i18n from '../utils/i18n'
import {appStyles} from '../constants/Styles'
import * as simActions from '../redux/modules/sim'
import * as accountActions from '../redux/modules/account'
import * as notiActions from '../redux/modules/noti'
import * as infoActions from '../redux/modules/info'
import * as cartActions from '../redux/modules/cart'
import _ from 'underscore'
import AppActivityIndicator from '../components/AppActivityIndicator'
import { Animated } from 'react-native';
import { colors } from '../constants/Colors';
import AppButton from '../components/AppButton';

class UsimScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <Text style={styles.title}>{i18n.t('appTitle')}</Text>
    )
  })

  constructor(props) {
    super(props)

    this.state = {

    }

 }

  componentDidMount() {

  }

  componentDidUpdate( prevProps) {
    
  }

  render() {

    return(
      <ScrollView style={styles.container}>
        <View style={{backgroundColor: colors.clearBlue, height: 280, paddingHorizontal: 20}}>
          <View style={{flex:1, flexDirection: 'row', marginTop: 30, justifyContent: 'space-between'}}>
            <Text style={[appStyles.normal16Text, {color: colors.white,}]}>로깨비 캐시</Text>
            <AppButton title={'유심변경'} 
              titleStyle={[appStyles.normal12Text, {color: colors.white}]}
              style={{borderWidth:1, borderColor: colors.white, paddingHorizontal: 4, paddingTop: 3, borderRadius: 11.5, height: 25}}
              iconName={'iconRefresh'} direction={'row'}
              size={16}
              iconStyle={{margin:3}}/>
          </View>
          <Text></Text>

        </View>
        <AppActivityIndicator visible={this.props.loginPending}/>
        
        
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    ... appStyles.title,
    marginLeft: 20,
    
  },
});

const mapStateToProps = (state) => ({
  account : state.account.toJS(),
  auth: accountActions.auth(state.account),
  noti : state.noti.toJS(),
  info : state.info.toJS(),
  loginPending: state.pender.pending[accountActions.LOGIN] || false,
  sync : state.sync.toJS()
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      sim: bindActionCreators(simActions, dispatch),
      account: bindActionCreators(accountActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
      cart: bindActionCreators(cartActions, dispatch),
      info: bindActionCreators(infoActions, dispatch)
    }
  })
)(UsimScreen)