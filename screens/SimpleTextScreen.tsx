import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component, memo, useState} from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppActivityIndicator from '@/components/AppActivityIndicator';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppModal from '@/components/AppModal';
import AppText from '@/components/AppText';
import AppUserPic from '@/components/AppUserPic';
import {colors} from '@/constants/Colors';
import {appStyles, htmlDetailWithCss} from '@/constants/Styles';
import Env from '@/environment';
import {
  HomeStackParamList,
  SimpleTextScreenMode,
} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {API} from '@/redux/api';
import utils from '@/redux/api/utils';
import {AccountModelState} from '@/redux/modules/account';
import {
  actions as infoActions,
  InfoAction,
  InfoModelState,
} from '@/redux/modules/info';
import i18n from '@/utils/i18n';
import AppAlert from '@/components/AppAlert';

const {baseUrl} = Env.get();
const {width} = Dimensions.get('window');

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
  isProdEvent: boolean;
  isInviteEvent: boolean;

  pending: boolean;

  action: {
    info: InfoAction;
  };
};

type SimpleTextScreenState = {
  body?: string;
  mode?: SimpleTextScreenMode;
  bodyTitle?: string;
  promoResult?: string;
  loading: boolean;
  infoMapKey: string;
};

class SimpleTextScreen extends Component<
  SimpleTextScreenProps,
  SimpleTextScreenState
> {
  controller: AbortController;

  constructor(props: SimpleTextScreenProps) {
    super(props);

    this.state = {
      body: '',
      infoMapKey: '',
      loading: false,
    };

    this.controller = new AbortController();
    this.onMessage = this.onMessage.bind(this);
    this.getContent = this.getContent.bind(this);
    this.onPress = this.onPress.bind(this);
  }

  componentDidMount() {
    const {params} = this.props.route;
    const {key, text: body, bodyTitle, mode = 'html', cmd} = params || {};

    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={params?.title} />,
    });

    this.setState({mode, loading: mode !== 'text'});

    if (body) {
      this.setState({body, bodyTitle});
    } else if (key) {
      this.getContent({key, bodyTitle});
    } else {
      this.setState({body: i18n.t('err:body')});
    }
  }

  componentDidUpdate(prevProps: SimpleTextScreenProps) {
    if (this.props.info !== prevProps.info) {
      const {infoMap} = this.props.info;
      this.setState(({infoMapKey}) => ({
        body: infoMap.get(infoMapKey, [])[0]?.body,
      }));
    }

    if (
      this.props.route.params &&
      this.props.route.params !== prevProps.route.params
    ) {
      const {body, bodyTitle} = this.props.route.params;
      this.setState({body, bodyTitle});
    }
  }

  componentWillUnmount() {
    this.controller.abort();
  }

  onMessage(event: WebViewMessageEvent) {
    const cmd = JSON.parse(event.nativeEvent.data);

    console.log('@@@ on message', cmd);

    switch (cmd.key) {
      // uuid를 받아서 해당 페이지로 이동 추가
      case 'moveToPage':
        if (cmd.value) {
          this.props.action.info.getItem(cmd.value).then(({payload: item}) => {
            if (item?.title && item?.body) {
              this.props.navigation.navigate('SimpleText', {
                key: 'noti',
                title: i18n.t('set:noti'),
                bodyTitle: item?.title,
                body: item?.body,
                mode: 'html',
              });
            } else {
              AppAlert.error(i18n.t('info:init:err'));
            }
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
    const {
      account: {iccid, token, loggedIn, userId},
      isProdEvent,
      isInviteEvent,
    } = this.props;

    if (rule && isProdEvent) {
      if (!loggedIn) {
        // 로그인 화면으로 이동
        this.props.navigation.navigate('Auth');
      } else {
        this.setState({promoResult: 'promo:join:ing'});
        const resp = await API.Promotion.join({rule, iccid, token});
        this.setState({
          promoResult:
            resp.result === 0 && resp.objects[0]?.available > 0
              ? 'promo:join:joined'
              : 'promo:join:fail',
        });
      }
    } else if (rule && isInviteEvent && userId) {
      if (!loggedIn) {
        // 로그인 화면으로 이동
        this.props.navigation.navigate('Auth');
      } else {
        await API.Promotion.invite(userId);
      }
    } else {
      this.props.navigation.goBack();
    }
  }

  getContent({key, bodyTitle}: {key: string; bodyTitle?: string}) {
    const {infoMap} = this.props.info;
    const infoMapKey = key === 'noti' && bodyTitle ? bodyTitle : key;
    this.setState({infoMapKey});
    if (infoMap.has(infoMapKey)) {
      this.setState({
        body: infoMap.get(infoMapKey, [])[0]?.body,
      });
    } else if (key === 'noti' && bodyTitle) {
      this.props.action.info.getInfoByTitle(infoMapKey);
    } else {
      this.props.action.info.getInfoList(infoMapKey);
    }
  }

  defineSource = (mode: SimpleTextScreenMode) => {
    const {body = '', bodyTitle = ''} = this.state;

    if (mode === 'text')
      return (
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            {bodyTitle && (
              <AppText style={styles.bodyTitle}>{`${bodyTitle}\n\n`}</AppText>
            )}
            <AppText style={styles.text}>{utils.htmlToString(body)}</AppText>
          </View>
        </ScrollView>
      );

    if (mode === 'uri')
      return (
        <WebView
          source={{uri: body}}
          style={styles.container}
          onMessage={this.onMessage}
          onLoadEnd={({nativeEvent: {loading}}) => {
            this.setState({loading});
          }}
        />
      );

    return (
      <WebView
        style={styles.container}
        originWhitelist={['*']}
        onMessage={this.onMessage}
        source={{html: htmlDetailWithCss(body), baseUrl}}
        onLoadEnd={({nativeEvent: {loading}}) => {
          this.setState({loading});
        }}
      />
    );
  };

  render() {
    const {loading, promoResult, mode = 'html'} = this.state;
    const {
      pending,
      eventStatus,
      isProdEvent,
      account: {loggedIn},
      navigation,
    } = this.props;
    const {image} = this.props.route.params;

    let title = 'ok';
    if (isProdEvent) {
      if (loggedIn) title = `promo:join:${eventStatus}`;
      else title = 'promo:login';
    }

    return (
      <SafeAreaView style={styles.screen}>
        {this.defineSource(mode)}
        <AppActivityIndicator visible={pending || loading} />
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
          // children과 wrapper view 사이에 padding 간격이 있는데, 찾을 수 없어서 padding:5를 적용하여 layour을 맞춤
          contentStyle={{
            marginHorizontal: (width - 333) / 2,
          }}
          closeButtonTitle={i18n.t(
            promoResult === 'promo:join:joined' ? 'redirect' : 'close',
          )}
          buttonBackgroundColor="white"
          buttonTitleColor={colors.black}
          onOkClose={() => {
            this.setState({promoResult: undefined});
            if (promoResult === 'promo:join:joined')
              navigation.navigate('EsimStack', {
                screen: 'Esim',
              });
            else navigation.goBack();
          }}>
          <AppUserPic
            url={
              promoResult === 'promo:join:joined'
                ? image?.success
                : image?.failure
            }
            crop={false}
            style={{width: 333, height: 444}}
          />
        </AppModal>
      </SafeAreaView>
    );
  }
}

const SimpleTextScreen0 = (props: SimpleTextScreenProps) => {
  const [eventStatus, setEventStatus] = useState<EventStatus>('closed');
  const [isProdEvent, setIsProdEvent] = useState(false);
  const [isInviteEvent, setIsInviteEvent] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const getPromo = async () => {
        const {rule} = props.route.params;

        if (rule?.sku) {
          setIsProdEvent(true);
          const resp = await API.Promotion.check(rule.sku);
          // available 값이 0보다 크면 프로모션 참여 가능하다.
          if (resp.result === 0) {
            if (resp.objects[0]?.hold > 0) setEventStatus('joined');
            else if (resp.objects[0]?.available > 0) setEventStatus('open');
            else setEventStatus('closed');
          }
        }
        if (rule?.invite) {
          setIsInviteEvent(true);
        }
      };
      getPromo();
    }, [props.route.params]),
  );

  return (
    <SimpleTextScreen
      {...props}
      eventStatus={eventStatus}
      isProdEvent={isProdEvent}
      isInviteEvent={isInviteEvent}
    />
  );
};

// export default SimpleTextScreen;
export default connect(
  ({info, account, status}: RootState) => ({
    info,
    account,
    pending:
      status.pending[infoActions.getInfoList.typePrefix] ||
      status.pending[infoActions.getInfoByTitle.typePrefix] ||
      false,
  }),
  (dispatch) => ({
    action: {
      info: bindActionCreators(infoActions, dispatch),
    },
  }),
)(memo(SimpleTextScreen0));
