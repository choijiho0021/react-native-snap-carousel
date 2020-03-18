import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
  Platform
} from 'react-native';

import i18n from '../utils/i18n'
import AppBackButton from '../components/AppBackButton';
import _ from 'underscore'
import AppActivityIndicator from '../components/AppActivityIndicator';
import pageApi from '../utils/api/pageApi';
import AppAlert from '../components/AppAlert';
import { colors } from '../constants/Colors';
import { appStyles, htmlWithCss } from '../constants/Styles';
import AppButton from '../components/AppButton';
import WebView from 'react-native-webview';
import utils from '../utils/utils';
import getEnvVars from '../environment'
const { baseUrl } = getEnvVars();

class SimpleTextScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <AppBackButton navigation={navigation} title={navigation.getParam('title')} />,
  })

  constructor(props) {
    super(props)

    this.state = {
      querying: false,
      body: '',
      markAsRead: false,
      disable: true,
      mode: undefined
    }

    this._isMounted = false
    this.controller = new AbortController()
  }

  componentDidMount() {
    const key = this.props.navigation.getParam('key')
    const body = this.props.navigation.getParam('text')
    const bodyTitle = this.props.navigation.getParam('bodyTitle')
    const mode = this.props.navigation.getParam('mode')
    
    this.setState({mode})

    this._isMounted = true

    if (body) {
      this.setState({ body, bodyTitle })
    }
    else if (key) {
      this.setState({
        querying: true
      })

      pageApi.getPageByCategory(key, this.controller).then(resp => { 
        if ( resp.result == 0 && resp.objects.length > 0 && this._isMounted) {
          this.setState({
            body: resp.objects[0].body,
            disable: false
          })
        }
        else throw Error('Failed to get contract')
      }).catch( err => {
        console.log('failed', err)
        AppAlert.error(i18n.t('set:fail'))
      }).finally(_ => {
        if ( this._isMounted ) {
          this.setState({
            querying: false
          })
        }
      })
    }
    else {
      this.setState({body:i18n.t('err:body')})
    }
  }

  componentDidUpdate(prevProps) {
    if ( this.props.navigation.state.params != prevProps.navigation.state.params) {
      const body = this.props.navigation.getParam('text')
      const bodyTitle = this.props.navigation.getParam('bodyTitle')
      const mode = this.props.navigation.getParam('mode')

      this.setState({mode, body, bodyTitle})
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    this.controller.abort()
  }

  render() {
    const {querying, body, bodyTitle, mode = 'html'} = this.state

    return (
      <SafeAreaView style={styles.screen}>
        <AppActivityIndicator visible={querying} />
        { mode == 'text' ?
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
              { bodyTitle && <Text style={styles.bodyTitle}>{bodyTitle +'\n\n'}</Text> }
              <Text style={styles.text}>{utils.htmlToString(body) }</Text>
            </View>
          </ScrollView> :
          mode == 'uri' ?
          <WebView source={{ uri: body}} style={styles.container} /> :
          <WebView style={styles.container}
            originWhitelist={['*']}
            source={{html: htmlWithCss(bodyTitle, body), baseUrl}} />
        }
        {
          Platform.OS === 'ios' && <AppButton style={styles.button} title={i18n.t('ok')} 
            onPress={() => this.props.navigation.goBack()}/> 
        }
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems:'stretch',
    paddingTop: 40,
    paddingHorizontal: 20
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.whiteTwo
  },
  text: {
    ... appStyles.normal14Text,
    color: colors.warmGrey
  },
  bodyTitle: {
    ... appStyles.normal16Text,
    color: colors.black
  },
  buttonContainer: {
    flexDirection:'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.white,
    width: '100%',
    height: 80
  },
  titleStyle: {
    ... appStyles.normal18Text,
    textAlign: "center",
    color: colors.white
  },
  buttonStyle: {
    width: '48%',
    height: 40,
    borderRadius: 3,
    backgroundColor: colors.clearBlue,
  },
  button: {
    ... appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: "center",
    color: "#ffffff"
  }
});

export default SimpleTextScreen