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
    headerLeft: AppBackButton({navigation, title:i18n.t('set:' + navigation.navigation.getParam('key').toLowerCase())}),
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

  render() {
    const {querying, body} = this.state

    return (
      <View style={styles.container}>
        <AppActivityIndicator visible={querying} />
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
  }
});

export default SimpleTextScreen