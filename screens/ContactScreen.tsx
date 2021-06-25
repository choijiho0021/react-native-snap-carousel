import React, {Component, memo} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Linking,
  Pressable,
} from 'react-native';
import Analytics from 'appcenter-analytics';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'underscore';
import KakaoSDK from '@actbase/react-native-kakaosdk';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AppBackButton from '@/components/AppBackButton';
import {colors} from '@/constants/Colors';
import AppIcon from '@/components/AppIcon';
import {actions as infoActions, InfoModelState} from '@/redux/modules/info';
import {actions as notiActions, NotiModelState} from '@/redux/modules/noti';
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import AppModal from '@/components/AppModal';
import Env from '@/environment';
import {Toast} from '@/constants/CustomTypes';
import {RootState} from '@/redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '@/navigation/MainTabNavigator';

const {channelId} = Env.get();

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'stretch',
  },
  row: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomColor: colors.whiteTwo,
    borderBottomWidth: 1,
  },
  itemTitle: {
    ...appStyles.normal16Text,
    color: colors.black,
  },
});

type MenuItem = {
  key: string;
  value: string;
  page: string;
  onPress?: () => void;
};

const ContactListItem0 = ({item}: {item: MenuItem}) => {
  return (
    <Pressable
      onPress={() => {
        Analytics.trackEvent('Page_View_Count', {page: item.page});
        if (item.onPress) item.onPress();
      }}>
      <View style={styles.row}>
        <Text style={styles.itemTitle}>{item.value}</Text>
        {item.onPress && (
          <AppIcon style={{alignSelf: 'center'}} name="iconArrowRight" />
        )}
      </View>
    </Pressable>
  );
};

const ContactListItem = memo(ContactListItem0);

type ContactScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Contact'
>;

type ContactScreenProps = {
  navigation: ContactScreenNavigationProp;
  info: InfoModelState;
  noti: NotiModelState;
  action: {
    toast: ToastAction;
  };
};

type ContactScreenState = {
  data: MenuItem[];
  showModal: boolean;
};

class ContactScreen extends Component<ContactScreenProps, ContactScreenState> {
  constructor(props: ContactScreenProps) {
    super(props);

    this.state = {
      data: [
        {
          key: 'noti',
          value: i18n.t('contact:notice'),
          page: 'Notice',
          onPress: () => {
            this.props.navigation.navigate('Noti', {
              mode: 'info',
              title: i18n.t('contact:notice'),
              info: this.props.info.infoList,
            });
          },
        },
        {
          key: 'faq',
          value: i18n.t('contact:faq'),
          page: 'FAQ',
          onPress: () => {
            this.props.navigation.navigate('Faq');
          },
        },
        {
          key: 'board',
          value: i18n.t('contact:board'),
          page: 'Contact Board',
          onPress: () => {
            this.props.navigation.navigate('ContactBoard');
          },
        },
        {
          key: 'ktalk',
          value: i18n.t('contact:ktalk'),
          page: 'Open Kakao Talk',
          onPress: () => {
            this.openKTalk();
          },
        },
        {
          key: 'call',
          value: i18n.t('contact:call'),
          page: 'Call Center',
          onPress: () => {
            Linking.openURL(`tel:0317103969`);
          },
        },
      ],
      showModal: false,
    };

    this.openKTalk = this.openKTalk.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('contact:title')} />,
    });

    Analytics.trackEvent('Page_View_Count', {page: 'Service Center'});
  }

  componentDidUpdate(prevProps: ContactScreenProps) {
    if (
      !_.isUndefined(this.props.noti.result) &&
      prevProps.noti.result !== this.props.noti.result
    ) {
      this.showModal(true);
    }
  }

  renderItem = ({item}: {item: MenuItem}) => {
    return <ContactListItem item={item} />;
  };

  showModal = (value: boolean) => {
    this.setState({showModal: value});
  };

  openKTalk = () => {
    KakaoSDK.Channel.chat(channelId).catch((_) => {
      this.props.action.toast.push(Toast.NOT_OPENED);
    });

    /*
    const resendable = this.props.noti.result !== 0 ||
      (this.props.noti.lastSent instanceof Date ? Math.round( (new Date() - this.props.noti.lastSent)/ (1000*60) ) > 0 : true)

    if ( ! this.props.account.loggedIn ) {
      this.props.navigation.navigate('Auth')
      return;
    }

    if (this.props.pending || ! resendable ) {
      this.showModal(true)
      return;
    }

    if ( this.cancelKtalk ) {
      this.cancelKtalk()
      this.cancelKtalk = null
    }

    const sendKtalk = this.props.action.noti.initAndSendAlimTalk({
      mobile: this.props.account.mobile,
      abortController: new AbortController()
    })

    this.cancelKtalk = sendKtalk.cancel
    sendKtalk.catch( err => console.log("failed to send alimtalk", err))

    */
  };

  render() {
    const {showModal, data} = this.state;

    return (
      <View style={styles.container}>
        <FlatList data={data} renderItem={this.renderItem} />

        <AppModal
          title={
            this.props.noti.result === 0 ||
            _.isUndefined(this.props.noti.result)
              ? i18n.t('set:sendAlimTalk')
              : i18n.t('set:failedToSendAlimTalk')
          }
          type="info"
          onOkClose={() => this.showModal(false)}
          visible={showModal}
        />
      </View>
    );
  }
}

export default connect(
  ({info, account, noti, pender}: RootState) => ({
    info,
    account,
    noti,
    pending: pender.pending[notiActions.SEND_ALIM_TALK] || false,
  }),
  (dispatch) => ({
    action: {
      info: bindActionCreators(infoActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(ContactScreen);
