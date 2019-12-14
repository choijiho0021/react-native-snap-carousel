import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions
} from 'react-native';

import i18n from '../utils/i18n'
import AppBackButton from '../components/AppBackButton';
import _ from 'underscore'
import AppActivityIndicator from '../components/AppActivityIndicator';
import pageApi from '../utils/api/pageApi';
import AppAlert from '../components/AppAlert';
import { colors } from '../constants/Colors';
import { appStyles } from '../constants/Styles';
import { ScrollView } from 'react-native-gesture-handler';
import utils from '../utils/utils';
import AppButton from '../components/AppButton';

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
  }

  componentDidMount() {
    const key = this.props.navigation.getParam('key')
    const body = this.props.navigation.getParam('text')
    const bodyTitle = this.props.navigation.getParam('bodyTitle')
    const mode = this.props.navigation.getParam('mode')

    if(body){
      this.setState({body:body, bodyTitle:bodyTitle})
    }
    else if (key){
      this.setState({
        querying: true,
        disable: true
      })
  
      pageApi.getPageByCategory(key).then(resp => { 
        if ( resp.result == 0 && resp.objects.length > 0) {
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
        this.setState({
          querying: false
        })
      })
    }
    else{
      this.setState({body:i18n.t('err:body')})
    }

    if (mode) {
      this.setState({ mode })
    }
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

  _isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      this.setState({ markAsRead: true })
    }
  }

  _isEnableToScroll = (contentWidth, contentHeight) => {
    const {height, width} = Dimensions.get('window')

    if ( height > contentHeight + 80 ) {
      this.setState({ markAsRead: true })
    }
    else {
      this.setState({ markAsRead: false })
    }
  }

  render() {
    const {querying, body, bodyTitle, mode } = this.state,
      disable = this.state.disable || ! this.state.markAsRead

    return (
      <View style={styles.screen}>
        <ScrollView style={styles.scrollContainer}
          onScroll={({nativeEvent}) => this._isCloseToBottom(nativeEvent)}
          onContentSizeChange={(contentWidth, contentHeight) => { this._isEnableToScroll(contentWidth, contentHeight) }}>
          <View style={styles.container}>
            <AppActivityIndicator visible={querying} />
            { bodyTitle ? <Text style={styles.bodyTitle}>{bodyTitle +'\n\n'}</Text> : null}
            <Text style={styles.text}>{utils.htmlToString(body) + '\n\n'}</Text>
          </View>
        </ScrollView>
        {
            mode === 'confirm' ?
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
              </View> :
              null
          }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    position: 'relative',
    height: '100%'
  },
  container: {
    flex: 1,
    alignItems:'stretch',
    paddingTop: 40,
    paddingHorizontal: 20
  },
  scrollContainer: {
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
    height: 80,
    position: 'absolute',
    bottom: 0
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
  }
});

export default SimpleTextScreen