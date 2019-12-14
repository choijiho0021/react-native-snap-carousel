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
import * as accountActions from '../redux/modules/account'
import utils from '../utils/utils';
import userApi from '../utils/api/userApi';
import { bindActionCreators } from 'redux'
import AppIcon from '../components/AppIcon';
import { colors } from '../constants/Colors';
import HTML from 'react-native-render-html';
import { ScrollView } from 'react-native-gesture-handler';
import AppBackButton from '../components/AppBackButton';

class ViewDetailScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={i18n.t('view:detail')}/>
  })

  constructor(props) {
    super(props)

    this.state = {
      body: "Please wait for data"
    }
  }

  componentDidMount() {
    const body = this.props.navigation.getParam('body')

    if ( body ) {
      this.setState({
        body
      })
    }
  }
  

  render() {
    const {body} = this.state

    return (
      <ScrollView style={styles.container}>
        {/* <Text>{body}</Text> */}
        {// <HTML html={body} />
        } 
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  }
});

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps, 
  (dispatch) => ({
    action : {
      account : bindActionCreators(accountActions, dispatch)
    }
  })
)(ViewDetailScreen)