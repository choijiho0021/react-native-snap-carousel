import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput
} from 'react-native';
import i18n from '../utils/i18n'
import { appStyles } from '../constants/Styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as accountActions from '../redux/modules/account'
import * as orderActions from '../redux/modules/order'
import { SafeAreaView } from 'react-navigation'
import _ from 'underscore'
import AppBackButton from '../components/AppBackButton';
import { colors } from '../constants/Colors';
import AppButton from '../components/AppButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from 'react-native-picker-select';
import Triangle from '../components/Triangle';
import findEngAddress from '../utils/findEngAddress'

class AddProfileScreen extends Component {
  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({ navigation, title: i18n.t('purchase:address') }),
  })

  constructor(props) {
    super(props)

    this.state = {
      prefix: "010",
      profile: {
        alias: undefined,
        recipient: undefined,
        recipient_num: undefined,
        province: undefined,
        city: undefined,
        organization: undefined,
        zipNo: undefined,
        addr1: undefined,
        addr2: undefined,
        detailAddr: undefined
      },
      errors: undefined
    }

    this._onChangeText = this._onChangeText.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  // componentDidMount() {
  //   // this.props.action.order.getCustomerProfile(this.props.account.userId, this.props.account)
  //   // console.log(this.props.order)
  // }
/*
  shouldComponentUpdate(nextProps) {
    console.log('nextProps', nextProps)
    console.log(this.props)
    const str = nextProps.order.addr.siNm + ' ' + nextProps.order.addr.sggNm
    const addr = nextProps.order.addr.roadAddr
    console.log('update - addr1', str)
    console.log('replace',
        nextProps.order.addr.roadAddr.replace(nextProps.order.addr.siNm, '').replace(nextProps.order.addr.sggNm, '')
    )
    // console.log('replace ',
    // this.props.order.addr.roadAddr.replace(this.props.order.addr.siNm,'').replace(this.props.order.addr.sggNm,''))
    if (this.props.order.addr.roadAddr != nextProps.order.addr.roadAddr) {
        this.setState({
            profile: {
                ...this.state.profile,
                addr1: nextProps.order.addr.roadAddrPart1,
                addr2: nextProps.order.addr.roadAddrPart2,
                zipNo: nextProps.order.addr.zipNo
            }
        })
        return true;
    }
    return false;
  }
  */
  componentDidUpdate(prevProps) {
    if(this.props.order.addr.roadAddr != prevProps.order.addr.roadAddr){
      console.log('prevProps', prevProps)
      console.log(this.props)
      const province_num = this.props.order.addr.admCd.substring(0,2)
      const city_num = this.props.order.addr.admCd.substring(2,5)

      this.setState({
          profile: {
            ... this.state.profile,
            addr1: this.props.order.addr.roadAddrPart1,
            addr2: this.props.order.addr.roadAddrPart2,
            zipNo: this.props.order.addr.zipNo,
            province: findEngAddress.city[province_num].province,
            city: findEngAddress.city[province_num][city_num]
        }
      })
    }
  }

  _onSubmit() {
    console.log('this props', this.props)
    console.log('this state', this.state)
    this.props.action.order.addCustomerProfile(this.state.profile, this.props.order.profile ,this.props.account)
    this.props.navigation.navigate('PymMethod')
  }
  _onChangeText = (key) => (value) => {

    const item = key.substring(key.indexOf('.') + 1)
    const idx = key.indexOf('.')
    const val = item == 'recipient_num'? (this.state.prefix+value) : value

    if (idx == -1) {
      this.setState({
        [key]: value
      })
    } else {
      this.setState({
        profile: {
          ... this.state.profile,
          [item]: val
        }
      })
    }

  }

  render() {
    console.log('Profile state', this.state)
    console.log('Profile props', this.props)
    console.log('addr1', this.props.order.addr.roadAddrPart1)
    console.log('addr2', this.props.order.addr.roadAddrPart2)
    
    const str = this.props.order.addr.siNm + ' ' + this.props.order.addr.sggNm
    const { prefix } = this.state

    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        extraScrollHeight={60}
        innerRef={ref => { this.scroll = ref; }}>
        <SafeAreaView style={styles.container}>
          <View style={{ flex: 1 }}>
            <View style={{ margin: 20 }}>
              <View style={styles.textRow}>
                <Text style={styles.textTitle}>{i18n.t('addr:addrAlias')}</Text>
                <TextInput style={styles.textBox}
                  onChangeText={this._onChangeText('profile.alias')} />
              </View>
              <View style={styles.textRow}>
                <Text style={styles.textTitle}>{i18n.t('addr:recipient')}</Text>
                <TextInput style={[styles.textBox, { paddingLeft: 20 }]}
                  placeholder={i18n.t('addr:enterWithin50')}
                  onChangeText={this._onChangeText('profile.recipient')} />
              </View>
              <View style={styles.textRow}>
                <Text style={styles.textTitle}>{i18n.t('addr:recipientNumber')}</Text>
                <View style={[styles.container, this.props.style]}>
                  <View style={styles.pickerWrapper}>
                    <RNPickerSelect style={{
                      placeholder: styles.placeholder,
                      iconContainer: {
                        top: 4,
                        right: 10,
                      },
                    }}
                      onValueChange={this._onChangeText("prefix")}
                      items={["010", "011", "017", "018", "019"].map(item => ({
                        label: item,
                        value: item
                      }))}
                      value={prefix}
                      Icon={() => {
                        return (<Triangle width={8} />)
                      }}
                    />
                  </View>
                </View>
                <TextInput style={[styles.textBox, { width: '56%' }]}
                  onChangeText={this._onChangeText('profile.recipient_num')} />
              </View>
              <View style={[styles.textRow, { marginBottom: 10 }]}>
                <Text style={styles.textTitle}>{i18n.t('addr:address')}</Text>
                <TextInput style={[styles.textBox, { width: '61%' }]}
                           onPress={() => this.props.navigation.navigate('FindAddress')}
                           value={_.isEmpty(this.props.order.addr) ?  null : str} />
                <AppButton title={i18n.t('addr:search')}
                           style={style=styles.findButton}
                           onPress={() => this.props.navigation.navigate('FindAddress')} />
              </View>
              <View style={styles.findTextRow}>
                <TextInput style={styles.textBox}
                           value={_.isEmpty(this.props.order.addr) ? null : this.props.order.addr.roadAddr.replace(str,'')} />
                
              </View>
              <View style={styles.findTextRow}>
                <TextInput style={styles.textBox}
                           onChangeText={this._onChangeText('profile.detailAddr')} />
              </View>
            </View>
            <AppButton title={i18n.t('save')}
                       textStyle={appStyles.confirmText}
                       //disabled={_.isEmpty(selected)}
                       onPress={this._onSubmit}
                       style={appStyles.confirm} />

          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...appStyles.container,
    alignItems: 'stretch'
  },
  placeHolder: {
    ...appStyles.normal14Text,
    color: colors.greyish
  },
  textRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  findTextRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20, // textRow    
    marginBottom: 10,
    justifyContent: 'flex-end'
  },
  findButton: {
    backgroundColor: colors.warmGrey, 
    borderRadius: 3, 
    width: '18%', 
    height: 36, 
    marginLeft: 10
  },
  textBox: {
    width: '82%',
    height: 36,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.lightGrey
  },
  textTitle: {
    ...appStyles.normal14Text,
    fontWeight: 'normal',
    color: colors.warmGrey,
    alignSelf: 'center',
    width: '18%'
  },
  addrCard: {
    marginLeft: 20,
    marginTop: 7,
    width: '65%'
  },
  addrCardText: {
    ...appStyles.normal14Text,
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
  },
  pickerWrapper: {
    ...appStyles.borderWrapper,
    width: 76, //28%
    paddingLeft: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  // placeholder: {
  //   ... appStyles.normal12Text,
  //   color: colors.black
  // },
});

const mapStateToProps = (state) => ({
  account: state.account.toJS(),
  order: state.order.toJS(),
})

// export default CustomerProfileScreen
export default connect(mapStateToProps,
  (dispatch) => ({
    action: {
      account: bindActionCreators(accountActions, dispatch),
      order: bindActionCreators(orderActions, dispatch),
    }
  })
)(AddProfileScreen)
