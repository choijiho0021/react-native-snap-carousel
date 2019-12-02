import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

import i18n from '../utils/i18n'
import AppBackButton from '../components/AppBackButton';
import _ from 'underscore'
import AppActivityIndicator from '../components/AppActivityIndicator';
import pageApi from '../utils/api/pageApi';
import AppAlert from '../components/AppAlert';
import { colors } from '../constants/Colors';
import { appStyles } from '../constants/Styles';
import utils from '../utils/utils';

class SimpleTextScreen extends Component {
  static navigationOptions = (navigation) => ({
    headerLeft: AppBackButton({navigation, title:navigation.navigation.getParam('title')}),
    tabBarVisible: false,
  })

  constructor(props) {
    super(props)

    this.state = {
      querying: false,
      body: ''
    }
  }

  componentDidMount() {
    const key = this.props.navigation.getParam('key')
    const body = this.props.navigation.getParam('text')
    const bodyTitle = this.props.navigation.getParam('bodyTitle')

    if(body){
      this.setState({body:body, bodyTitle:bodyTitle})
    }
    else if (key){
      this.setState({
        querying: true
      })
  
      pageApi.getPageByCategory(key).then(resp => { 
        if ( resp.result == 0 && resp.objects.length > 0) {
          this.setState({
            body: resp.objects[0].body
          })
        }
        else throw Error('Failed to get contract')
      }).catch( err => {
        console.log('failed', err)
        AppAlert.error(i18n.t('set:fail'))
      }).finally(_ => {
        this.setState({
          querying: false
        })
      })
    }
    else{
      this.setState({body:i18n.t('err:body')})
    }
  }

  render() {
    const {querying, body, bodyTitle} = this.state

    return (
      <View style={styles.container}>
        <AppActivityIndicator visible={querying} />
        { bodyTitle ? <Text style={styles.bodyTitle}>{bodyTitle +'\n\n'}</Text> : null}
        <Text style={styles.text}>{utils.htmlToString(body)}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'stretch',
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: colors.whiteTwo
  },
  text: {
    ... appStyles.normal14Text,
    color: colors.warmGrey
  },
  bodyTitle: {
    ... appStyles.normal16Text,
    color: colors.black
  }
});

export default SimpleTextScreen