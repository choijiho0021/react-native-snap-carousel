import KakaoSDK from '@actbase/react-native-kakaosdk';
import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {Component, memo} from 'react';
import {Linking, Pressable, StyleSheet, View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppModal from '@/components/AppModal';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {HomeStackParamList} from '@/navigation/navigation';
import {RootState} from '@/redux';
import {actions as infoActions, InfoModelState} from '@/redux/modules/info';
import {actions as notiActions, NotiModelState} from '@/redux/modules/noti';
import {
  actions as toastActions,
  Toast,
  ToastAction,
} from '@/redux/modules/toast';
import i18n from '@/utils/i18n';

const {channelId, esimGlobal, fbUser} = Env.get();

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  bottomContainer: {
    backgroundColor: colors.whiteTwo,
    marginTop: 156,
    flex: 1,
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  itemTitle: {
    ...appStyles.bold16Text,
    color: colors.black,
  },
  itemDesc: {
    ...appStyles.normal12Text,
    color: colors.warmGrey,
    textAlign: 'left',
  },
  showSearchBar: {
    marginRight: 20,
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 24,
  },
  absoluteView: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    marginTop: 114,
    marginHorizontal: 12,
  },
  btnBlue: {
    flex: 1,
    height: 136,
    marginHorizontal: 8,
    justifyContent: 'center',
    backgroundColor: colors.clearBlue,
    alignItems: 'center',
  },
});

type MenuItem = {
  key: string;
  title: string;
  desc: string;
  page: string;
  icon: string;
  onPress?: () => void;
};

const ContactListItem0 = ({
  item,
  onPress,
}: {
  item: MenuItem;
  onPress?: (k: string) => void;
}) => {
  return (
    <Pressable
      style={{backgroundColor: colors.white, marginVertical: 8}}
      onPress={() => {
        if (onPress) onPress(item.key);
      }}>
      <View
        style={{
          flexDirection: 'row',
          height: 78,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          <AppIcon
            style={{alignSelf: 'center', marginHorizontal: 20}}
            name={item.icon}
          />
          <View>
            <AppText style={styles.itemTitle}>{item.title}</AppText>
            <AppText style={styles.itemDesc}>{item.desc}</AppText>
          </View>
        </View>
        {onPress && (
          <AppIcon
            style={{alignSelf: 'center', marginRight: 20}}
            name="iconArrowRight"
          />
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
          key: 'Board',
          title: i18n.t('contact:boardTitle'),
          desc: i18n.t('contact:boardDesc'),
          icon: 'imgBoard',
          page: 'Contact Board',
        },
        {
          key: 'Ktalk',
          title: i18n.t('contact:ktalkTitle'),
          desc: i18n.t('contact:ktalkDesc'),
          icon: 'kakaoChannel',
          page: 'Open Kakao Talk',
        },
        {
          key: 'Call',
          title: i18n.t('contact:callTitle'),
          desc: i18n.t('contact:callDesc'),
          icon: 'btnCnter',
          page: 'Call Center',
        },
      ],
      showModal: false,
    };

    this.showModal = this.showModal.bind(this);
    this.onPress = this.onPress.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('contact:title')} />,
      headerRight: () => (
        <AppButton
          key="search"
          style={styles.showSearchBar}
          onPress={() =>
            this.props.navigation.navigate('Noti', {
              mode: 'info',
              title: i18n.t('contact:notice'),
            })
          }
          iconName="btnNotice"
        />
      ),
    });

    Analytics.trackEvent('Page_View_Count', {page: 'Service Center'});
  }

  componentDidUpdate(prevProps: ContactScreenProps) {
    if (
      !!this.props.noti.result &&
      prevProps.noti.result !== this.props.noti.result
    ) {
      this.showModal(true);
    }
  }

  onPress = (key: string) => {
    const {navigation} = this.props;

    switch (key) {
      case 'Faq':
        navigation.navigate('Faq');
        break;
      case 'Board':
        navigation.navigate('ContactBoard');
        break;
      case 'Guide':
        navigation.navigate('UserGuide');
        break;
      case 'Ktalk':
        if (esimGlobal) {
          Linking.openURL(`fb-messenger-public://user-thread/${fbUser}`).catch(
            () =>
              AppAlert.info(i18n.t('acc:moveToFbDown'), '', () =>
                Linking.openURL(
                  'https://apps.apple.com/kr/app/messenger/id454638411',
                ),
              ),
          );
        } else {
          KakaoSDK.Channel.chat(channelId).catch((_) => {
            this.props.action.toast.push(Toast.NOT_OPENED);
          });
        }

        break;
      case 'Call':
        Linking.openURL(`tel:0317103969`);
        break;
      default:
        break;
    }
  };

  showModal = (value: boolean) => {
    this.setState({showModal: value});
  };

  render() {
    const {showModal, data} = this.state;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.infoContainer}>
          <AppText style={[appStyles.bold18Text, {paddingTop: 14}]}>
            {i18n.t('contact:info')}
          </AppText>
          <AppIcon name="imgNotiDokebi" style={{marginRight: 12}} />
        </View>

        <View style={styles.absoluteView}>
          {['Faq', 'Guide'].map((elm) => (
            <Pressable style={styles.btnBlue} onPress={() => this.onPress(elm)}>
              <AppIcon style={{marginBottom: 16}} name={`img${elm}`} />
              <AppText style={[appStyles.bold16Text, {color: colors.white}]}>
                {i18n.t(`contact:${elm.toLowerCase()}`)}
              </AppText>
            </Pressable>
          ))}
        </View>

        <View style={styles.bottomContainer}>
          <AppText
            style={[
              appStyles.bold16Text,
              {color: colors.black, marginBottom: 24},
            ]}>
            {i18n.t('contact:info2')}
          </AppText>
          {data.map((item) => (
            <ContactListItem item={item} onPress={this.onPress} />
          ))}
        </View>

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
      </ScrollView>
    );
  }
}

export default connect(
  ({info, account, noti, status}: RootState) => ({
    info,
    account,
    noti,
    pending: status.pending[notiActions.sendAlimTalk.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      info: bindActionCreators(infoActions, dispatch),
      noti: bindActionCreators(notiActions, dispatch),
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(ContactScreen);
