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
import {appStyles} from '../constants/Styles';
import i18n from '../utils/i18n';
import AppBackButton from '../components/AppBackButton';
import {colors} from '../constants/Colors';
import AppIcon from '../components/AppIcon';
import * as infoActions from '../redux/modules/info';
import * as notiActions from '../redux/modules/noti';
import * as toastActions from '../redux/modules/toast';
import AppModal from '../components/AppModal';
import Env from '../environment';
import {Toast} from '../constants/CustomTypes';

const {channelId} = Env.get();

const styles = StyleSheet.create({
  title: {
    ...appStyles.title,
    marginLeft: 20,
  },
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

const ContactListItem0 = ({item}) => {
  return (
    <Pressable
      onPress={() => {
        Analytics.trackEvent('Page_View_Count', {page: item.page});
        item.onPress();
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
class ContactScreen extends Component {
  constructor(props) {
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

    this.cancelKtalk = null;
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => (
        <AppBackButton
          navigation={this.props.navigation}
          title={i18n.t('contact:title')}
        />
      ),
    });

    Analytics.trackEvent('Page_View_Count', {page: 'Service Center'});
  }

  componentDidUpdate(prevProps) {
    if (
      !_.isUndefined(this.props.noti.result) &&
      prevProps.noti.result !== this.props.noti.result
    ) {
      this.showModal(true);
    }
  }

  renderItem = ({item}) => {
    return <ContactListItem item={item} />;
  };

  showModal = (value) => {
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
    const {showModal} = this.state;

    return (
      <View style={styles.container}>
        <FlatList data={this.state.data} renderItem={this.renderItem} />

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

const mapStateToProps = (state) => ({
  info: state.info.toJS(),
  account: state.account.toJS(),
  noti: state.noti.toJS(),
  pending: state.pender.pending[notiActions.SEND_ALIM_TALK] || false,
});

export default connect(mapStateToProps, (dispatch) => ({
  action: {
    info: bindActionCreators(infoActions, dispatch),
    noti: bindActionCreators(notiActions, dispatch),
    toast: bindActionCreators(toastActions, dispatch),
  },
}))(ContactScreen);
