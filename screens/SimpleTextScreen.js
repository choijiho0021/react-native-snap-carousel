import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
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
      disable: true
    }

    this._isMounted = false
    this.controller = new AbortController()
  }

  componentDidMount() {
    const key = this.props.navigation.getParam('key')
    const body = this.props.navigation.getParam('text')
    const bodyTitle = this.props.navigation.getParam('bodyTitle')
    const mode = this.props.navigation.getParam('mode')

    this._isMounted = true

    if (mode) {
      this.setState({ mode })
    }

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

  componentWillUnmount() {
    this._isMounted = false
    this.controller.abort()
  }

  _onOk = async () => {
    const onOk = this.props.navigation.getParam('onOk')

    if ( _.isFunction(onOk) ) {
      await onOk()
    }
    this.props.navigation.goBack()
  }

  _onClose = async () => {
    const onClose = this.props.navigation.getParam('onClose')

    if ( _.isFunction(onClose) ) {
      await onClose()
    }
    this.props.navigation.goBack()
  }

  render() {
    const {querying, body, bodyTitle, mode } = this.state,
      disable = this.state.disable || ! this.state.markAsRead

    return (
      <SafeAreaView style={styles.screen}>
        <AppActivityIndicator visible={querying} />
        <WebView style={styles.container}
          originWhitelist={['*']}
          source={{html: htmlWithCss(bodyTitle, body)}} />
        {
          mode === 'confirm' &&
            <View style={styles.buttonContainer}>
              <AppButton onPress={this._onClose}
                style={styles.buttonStyle}
                titleStyle={styles.titleStyle} 
                title={i18n.t('cancel')}/>
              <AppButton disabled={disable}
                onPress={this._onOk}
                style={styles.buttonStyle}
                titleStyle={styles.titleStyle} 
                title={i18n.t('cfm:accept')}/>
            </View> 
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