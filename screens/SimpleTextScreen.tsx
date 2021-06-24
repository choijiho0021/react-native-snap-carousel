import React, {Component} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import WebView from 'react-native-webview';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import {colors} from '@/constants/Colors';
import {appStyles, htmlDetailWithCss} from '@/constants/Styles';
import Env from '@/environment';
import {API} from '@/submodules/rokebi-utils';
import i18n from '@/utils/i18n';
import utils from '@/submodules/rokebi-utils/utils';
import {actions as infoActions} from '@/redux/modules/info';
import {RootState} from '@/redux';

const {baseUrl} = Env.get();

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.whiteTwo,
  },
  text: {
    ...appStyles.normal14Text,
    color: colors.warmGrey,
  },
  bodyTitle: {
    ...appStyles.normal16Text,
    color: colors.black,
  },
  buttonStyle: {
    width: '48%',
    height: 40,
    borderRadius: 3,
    backgroundColor: colors.clearBlue,
  },
  button: {
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: '#ffffff',
  },
});
class SimpleTextScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      querying: false,
      body: '',
      mode: undefined,
      isMounted: false,
    };

    this.controller = new AbortController();
    this.onMessage = this.onMessage.bind(this);
  }

  componentDidMount() {
    const {params} = this.props.route;
    let key;
    let body;
    let bodyTitle;
    let mode;

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={params && params.title} />,
    });

    if (params) {
      key = params.key;
      body = params.text;
      bodyTitle = params.bodyTitle;
      mode = params.mode;
    }

    this.setState({mode});
    this.stateSet({isMounted: true});

    if (body) {
      this.setState({body, bodyTitle});
    } else if (key) {
      this.setState({
        querying: true,
      });

      if (key === 'noti') {
        API.Page.getPageByTitle(params.bodyTitle, this.controller)
          .then((resp) => {
            if (
              resp.result === 0 &&
              resp.objects.length > 0 &&
              this.state.isMounted
            ) {
              this.setState({
                body: resp.objects[0].body,
              });
            } else throw Error('Failed to get contract');
          })
          .catch((err) => {
            console.log('failed', err);
            AppAlert.error(i18n.t('set:fail'));
          })
          .finally(() => {
            if (this.state.isMounted) {
              this.setState({
                querying: false,
              });
            }
          });
      } else {
        API.Page.getPageByCategory(key, this.controller)
          .then((resp) => {
            if (
              resp.result === 0 &&
              resp.objects.length > 0 &&
              this.state.isMounted
            ) {
              this.setState({
                body: resp.objects[0].body,
              });
            } else throw Error('Failed to get contract');
          })
          .catch((err) => {
            console.log('failed', err);
            AppAlert.error(i18n.t('set:fail'));
          })
          .finally(() => {
            if (this.state.isMounted) {
              this.setState({
                querying: false,
              });
            }
          });
      }
    } else {
      this.setState({body: i18n.t('err:body')});
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.route.params !== prevProps.route.params) {
      this.stateSet(this.props.route.params);
    }
  }

  componentWillUnmount() {
    this.stateSet({isMounted: false});
    this.controller.abort();
  }

  onMessage(event) {
    const cmd = JSON.parse(event.nativeEvent.data);

    switch (cmd.key) {
      // uuid를 받아서 해당 페이지로 이동 추가
      case 'moveToPage':
        if (cmd.value) {
          const item = this.props.info.infoList.find(
            (elm) => elm.uuid === cmd.value,
          );
          this.props.navigation.navigate('SimpleText', {
            key: 'noti',
            title: i18n.t('set:noti'),
            bodyTitle: item.title,
            body: item.body,
            mode: 'noti',
          });
        }
        break;
      // Faq로 이동
      case 'moveToFaq':
        if (cmd.value) {
          const moveTo = cmd.value.split('/');
          this.props.navigation.navigate('Faq', {
            key: moveTo[0],
            num: moveTo[1],
          });
        }
        break;
      default:
    }
  }

  defineSource = (mode) => {
    const {body = '', bodyTitle = ''} = this.state;

    if (mode === 'text')
      return (
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            {bodyTitle && (
              <Text style={styles.bodyTitle}>{`${bodyTitle}\n\n`}</Text>
            )}
            <Text style={styles.text}>{utils.htmlToString(body)}</Text>
          </View>
        </ScrollView>
      );
    if (mode === 'uri')
      return (
        <WebView
          source={{uri: body}}
          style={styles.container}
          onMessage={this.onMessage}
        />
      );

    return (
      <WebView
        style={styles.container}
        originWhitelist={['*']}
        onMessage={this.onMessage}
        source={{html: htmlDetailWithCss(body), baseUrl}}
      />
    );
  };

  stateSet(val) {
    this.setState({
      ...val,
    });
  }

  render() {
    const {querying, mode = 'html'} = this.state;

    return (
      <SafeAreaView style={styles.screen}>
        <AppActivityIndicator visible={querying} />
        {this.defineSource(mode)}
        {Platform.OS === 'ios' && (
          <AppButton
            style={styles.button}
            title={i18n.t('ok')}
            onPress={() => this.props.navigation.goBack()}
          />
        )}
      </SafeAreaView>
    );
  }
}

// export default SimpleTextScreen;
export default connect(
  ({info}: RootState) => ({info}),
  (dispatch) => ({
    action: {
      info: bindActionCreators(infoActions, dispatch),
    },
  }),
)(SimpleTextScreen);
