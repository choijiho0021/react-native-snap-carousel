import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {appStyles} from "../constants/Styles"
import i18n from '../utils/i18n'
import AppButton from '../components/AppButton'
import utils from '../utils/utils';
import LabelText from '../components/LabelText';
import { colors } from '../constants/Colors';
import AppIcon from '../components/AppIcon';
import * as orderActions from '../redux/modules/order'
import * as accountActions from '../redux/modules/account'
import moment from 'moment'
import AppActivityIndicator from '../components/AppActivityIndicator'
import Constants from 'expo-constants'
import AppAlert from '../components/AppAlert';
import _ from 'underscore'
import AppUserPic from '../components/AppUserPic';
import AppModal from '../components/AppModal';
import AppBackButton from '../components/AppBackButton';
import pageApi from '../utils/api/pageApi';
import AppFlatListItem from '../components/AppFlatListItem';


class GuideScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: AppBackButton({ navigation, title: i18n.t('guide:title') }),
  })

  constructor(props) {
    super(props)
    this.state = {
      querying: false,
      data: []
    }
  }

  componentDidMount() {
    this._refreshData()
  }

  _refreshData() {
    this.setState({
      querying: true
    })

    pageApi.getPageByCategory('FAQ').then(resp => {
      if ( resp.result == 0 && resp.objects.length > 0) {
        this.setState({
          data: resp.objects
        })
      }
    }).catch(err => {
      console.log('failed to get page', err)
    }).finally(_ => {
      this.setState({
        querying: false
      })
    })

  }

  _header() {
    return(
      <View>
        <View style={styles.box}>
          <Text style={styles.text}>{i18n.t('guide:buy')}</Text>
          <Image source={require('../assets/images/main/img.png')} />
        </View>
        <View style={styles.faqBox}>
          <Text style={styles.faq}>FAQ</Text>
        </View>
        <View style={styles.divider}/>
        <View style={styles.tipBox}>
          <Text style={styles.tip}>{i18n.t('guide:tip')}</Text>
        </View>
      </View>
    )
  }

  _renderItem({item}) {
    return (
      <AppFlatListItem key={item.key} item={item} />
    )
  }

  render() {
    const { data} = this.state

    return (
      <View style={styles.container}>
        <FlatList data={data} renderItem={this._renderItem} 
          ListHeaderComponent={this._header} />
      </View>
    )
  }

}


const styles = StyleSheet.create({
  tipBox: {
    height: 71,
    justifyContent: 'center',
    borderBottomColor: colors.whiteTwo,
    borderBottomWidth: 1
  },
  tip: {
    ... appStyles.bold18Text,
    marginLeft: 20
  },
  container: {
    flex:1,
    alignItems: 'stretch'
  },
  box: {
    height: 346,
    backgroundColor: colors.lightPeriwinkle,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  text: {
    ... appStyles.bold18Text,
    color: colors.white,
    marginTop: 40,
  },
  faq: {
    ... appStyles.normal16Text,
    color: colors.clearBlue,
    textAlign: 'center',
  },
  faqBox: {
    height: 48,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.clearBlue,
    marginVertical: 30,
    marginHorizontal: 20,
    alignContent: 'center',
    justifyContent: 'center'
  },
  divider: {
    height: 10,
    backgroundColor: colors.whiteTwo
  }
});

const mapStateToProps = state => ({
  account: state.account.toJS(),
  order: state.order.toJS(),
  auth: accountActions.auth( state.account),
  pending: state.pender.pending[orderActions.GET_ORDERS] || 
    state.pender.pending[accountActions.UPLOAD_PICTURE] || false,
})

export default connect(mapStateToProps)(GuideScreen)