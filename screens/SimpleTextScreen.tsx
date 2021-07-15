import React, {Component, memo, useState} from 'react';
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
import WebView, {WebViewMessageEvent} from 'react-native-webview';
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
import {actions as infoActions, InfoModelState} from '@/redux/modules/info';
import {RootState} from '@/redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {
  HomeStackParamList,
  SimpleTextScreenMode,
} from '@/navigation/navigation';
import {AccountModelState} from '@/redux/modules/account';
import AppModal from '@/components/AppModal';
import AppUserPic from '@/components/AppUserPic';

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

type SimpleTextScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'SimpleText'
>;

type SimpleTextScreenRouteProp = RouteProp<HomeStackParamList, 'SimpleText'>;

type EventStatus = 'open' | 'closed' | 'joined';

type SimpleTextScreenProps = {
  navigation: SimpleTextScreenNavigationProp;
  route: SimpleTextScreenRouteProp;
  info: InfoModelState;
  account: AccountModelState;
  eventStatus: EventStatus;
};

type SimpleTextScreenState = {
  querying: boolean;
  body?: string;
  mode?: SimpleTextScreenMode;
  isMounted: boolean;
  bodyTitle?: string;
  promoResult?: string;
};

class SimpleTextScreen extends Component<
  SimpleTextScreenProps,
  SimpleTextScreenState
> {
  controller: AbortController;

  constructor(props: SimpleTextScreenProps) {
    super(props);

    this.state = {
      querying: false,
      body: '',
      isMounted: false,
    };

    this.controller = new AbortController();
    this.onMessage = this.onMessage.bind(this);
    this.getContent = this.getContent.bind(this);
    this.onPress = this.onPress.bind(this);
  }

  componentDidMount() {
    const {params} = this.props.route;
    const {key, text: body, bodyTitle, mode, rule} = params || {};

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={params?.title} />,
    });

    this.setState({mode, isMounted: true});

    if (body) {
      this.setState({body, bodyTitle});
    } else if (key) {
      this.getContent({key, bodyTitle});
    } else {
      this.setState({body: i18n.t('err:body')});
    }
  }

  componentWillUnmount() {
    this.setState({isMounted: false});
    this.controller.abort();
  }

  onMessage(event: WebViewMessageEvent) {
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
            bodyTitle: item?.title,
            body: item?.body,
            mode: 'html',
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

  async onPress() {
    const {rule} = this.props.route.params;
    const {iccid, token, loggedIn} = this.props.account;

    if (!loggedIn) {
      // 로그인 화면으로 이동
      this.props.navigation.navigate('Auth');
    } else if (rule) {
      this.setState({promoResult: 'promo:join:ing', querying: true});
      const resp = await API.Promotion.join({rule, iccid, token});
      this.setState({
        querying: false,
        promoResult:
          resp.result === 0 && resp.objects[0]?.available > 0
            ? 'promo:join:joined'
            : 'promo:join:fail',
      });
    } else {
      this.props.navigation.goBack();
    }
  }

  async getContent({key, bodyTitle}: {key: string; bodyTitle?: string}) {
    this.setState({
      querying: true,
    });

    try {
      const resp =
        key === 'noti'
          ? await API.Page.getPageByTitle(bodyTitle, this.controller)
          : await API.Page.getPageByCategory(key);

      if (
        resp.result === 0 &&
        resp.objects.length > 0 &&
        this.state.isMounted // async call이므로 isMounted는 이전과 다를수 있음
      ) {
        this.setState({
          body: resp.objects[0].body,
        });
      } else throw Error('Failed to get contract');
    } catch (err) {
      console.log('failed', err);
      AppAlert.error(i18n.t('set:fail'));
    } finally {
      if (this.state.isMounted) {
        this.setState({
          querying: false,
        });
      }
    }
  }

  defineSource = (mode: SimpleTextScreenMode) => {
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

  render() {
    const {querying, promoResult, mode = 'html'} = this.state;
    const {
      eventStatus,
      account: {loggedIn},
      navigation,
    } = this.props;
    const {rule, image} = this.props.route.params;

    let title = 'ok';
    if (rule) {
      if (loggedIn) title = `promo:join:${eventStatus}`;
      else title = 'promo:login';
    }

    return (
      <SafeAreaView style={styles.screen}>
        <AppActivityIndicator visible={querying} />
        {this.defineSource(mode)}
        {Platform.OS === 'ios' && (
          <AppButton
            style={styles.button}
            title={i18n.t(title)}
            disabled={
              eventStatus === 'joined' || promoResult === 'promo:join:ing'
            }
            onPress={this.onPress}
          />
        )}
        <AppModal
          type="close"
          visible={!!promoResult && promoResult !== 'promo:join:ing'}
          closeButtonTitle={i18n.t('redirect')}
          onOkClose={() => {
            this.setState({promoResult: undefined});
            navigation.navigate('EsimStack', {
              screen: 'Esim',
            });
          }}>
          <AppUserPic
            url={
              promoResult === 'promo:join:joined'
                ? image?.success
                : image?.failure
            }
            crop={false}
            style={{width: 300, height: 300 * 1.3}}
          />
        </AppModal>
      </SafeAreaView>
    );
  }
}

const SimpleTextScreen0 = (props: SimpleTextScreenProps) => {
  const [eventStatus, setEventStatus] = useState<EventStatus>('open');

  useFocusEffect(
    React.useCallback(() => {
      const getPromo = async () => {
        const {rule} = props.route.params;
        if (rule) {
          const resp = await API.Promotion.check({rule});
          // available 값이 0보다 크면 프로모션 참여 가능하다.
          if (resp.result === 0) {
            if (resp.objects[0]?.hold > 0) setEventStatus('joined');
            else if (resp.objects[0]?.available > 0) setEventStatus('open');
            else setEventStatus('closed');
          }
        }
      };
      getPromo();
    }, [props.route.params]),
  );

  return <SimpleTextScreen {...props} eventStatus={eventStatus} />;
};

// export default SimpleTextScreen;
export default connect(
  ({info, account}: RootState) => ({info, account}),
  (dispatch) => ({
    action: {
      info: bindActionCreators(infoActions, dispatch),
    },
  }),
)(memo(SimpleTextScreen0));
