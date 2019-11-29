import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';
import {bindActionCreators} from 'redux'
import i18n from '../utils/i18n'
import {connect} from 'react-redux'
import {appStyles} from '../constants/Styles'
import { colors } from '../constants/Colors';
import AppIcon from '../components/AppIcon';
import utils from '../utils/utils';
import _ from 'underscore'
import * as notiActions from '../redux/modules/noti'
import * as accountActions from '../redux/modules/account'
// import Icon from 'react-native-vector-icons/Ionicons';
import AppBackButton from '../components/AppBackButton';

class NotiScreen extends Component {
  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({navigation, title:i18n.t('set:noti')})
  })

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {mobile} = this.props.account
    if(mobile){
      this.props.action.noti.getNotiList(mobile)
    }
  }

  _onPress = (uuid,body) => () => {
    this.props.action.noti.readNoti(uuid, this.props.auth )
    //todo:notitype에 따라서 이동하는 경로가 바뀌어야 함
    this.props.navigation.navigate('SimpleText', {key:'noti', text:body})
  }

  _renderItem = ({item}) => {
      return (
        <TouchableOpacity onPress={this._onPress(item.uuid,item.body)}>
          <View key={item.uuid} style={styles.notibox}>
            <View key='notitext' style={styles.notiText} >
              <Text key='created' style={styles.created}>{item.created}</Text>
              <Text key='title' style={styles.title}>{item.title}</Text>
              <Text key='body' style={styles.body} numberOfLines={3} ellipsizeMode={'tail'} >{utils.htmlToString(item.body)}
              </Text>
            </View>
            <View key='iconview' style={styles.Icon}>
              <AppIcon key='icon' name="iconArrowRight" size={10} />
            </View>
          </View>
        </TouchableOpacity>
      )
  }

  render() {
    const {notiList} = this.props.noti

    return (
      <View key={"container"} style={styles.container}>
        <FlatList 
          data={notiList} 
          renderItem={this._renderItem }
          // keyExtractor={(_,idx) => idx + ''}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ... appStyles.container,
    alignItems: 'stretch'
  },
  notibox:{
    height: 98,
    marginBottom: 30,
    marginHorizontal:20,
    marginVertical:15,
    alignItems:'center',
    justifyContent:'space-between',
    flexDirection: "row"
  },
  created: {
    ... appStyles.normal12Text,
    textAlign:'left'
  },
  title:{
    ... appStyles.normal16Text,
    marginBottom:11,
    marginTop:5
  },
  renderItem : {
    height: 98,
    alignItems:'center',
    justifyContent:'space-between',
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  notiText:{
    height:98,
    flex:8,
  },
  body: {
    ... appStyles.normal14Text,
    height:48,
    lineHeight: 24,
    letterSpacing: 0.23,
    color: colors.warmGrey
  },
  Icon : {
    flex:2,
    justifyContent:'center',
    alignItems:'flex-end',
    height:98
  }
});

const mapStateToProps = (state) => ({
  account : state.account.toJS(),
  auth: accountActions.auth(state.account),
  noti : state.noti.toJS()
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      account: bindActionCreators(accountActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
    }
  })
)(NotiScreen)