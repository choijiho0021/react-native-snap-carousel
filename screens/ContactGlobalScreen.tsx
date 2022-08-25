import {StackNavigationProp} from '@react-navigation/stack';
import Analytics from 'appcenter-analytics';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, Linking, Pressable, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import KakaoSDK from '@/components/NativeModule/KakaoSDK';
import AppAlert from '@/components/AppAlert';
import AppBackButton from '@/components/AppBackButton';
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

const ContactListItem0 = ({
  item,
  onPress,
}: {
  item: MenuItem;
  onPress?: (k: string) => void;
}) => {
  return (
    <Pressable
      onPress={() => {
        Analytics.trackEvent('Page_View_Count', {page: item.page});
        if (onPress) onPress(item.key);
      }}>
      <View style={styles.row}>
        <AppText style={styles.itemTitle}>{item.value}</AppText>
        {onPress && (
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

const ContactGlobalScreen: React.FC<ContactScreenProps> = ({
  navigation,
  info,
  noti,
  action,
}) => {
  const data = useMemo(
    () =>
      [
        {
          key: 'noti',
          value: i18n.t('contact:notice'),
          page: 'Notice',
        },
        {
          key: 'faq',
          value: i18n.t('contact:faq'),
          page: 'FAQ',
        },
        {
          key: 'board',
          value: i18n.t('contact:board'),
          page: 'Contact Board',
        },
        {
          key: 'ktalk',
          value: i18n.t(esimGlobal ? 'contact:facebookMsg' : 'contact:ktalk'),
          page: 'Open Kakao Talk',
        },
      ].concat(
        esimGlobal
          ? []
          : [
              {
                key: 'call',
                value: i18n.t('contact:call'),
                page: 'Call Center',
              },
            ],
      ),
    [],
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('contact:title')} />,
    });

    Analytics.trackEvent('Page_View_Count', {page: 'Service Center'});
  }, [navigation]);

  /*
  componentDidUpdate(prevProps: ContactScreenProps) {
    if (
      !!this.props.noti.result &&
      prevProps.noti.result !== this.props.noti.result
    ) {
      this.showModal(true);
    }
  }
  */

  const onPress = useCallback(
    (key: string) => {
      switch (key) {
        case 'noti':
          navigation.navigate('Noti', {
            mode: 'info',
            title: i18n.t('contact:notice'),
          });
          break;
        case 'faq':
          navigation.navigate('Faq');
          break;
        case 'board':
          navigation.navigate('ContactBoard');
          break;
        case 'ktalk':
          if (esimGlobal) {
            Linking.openURL(
              `fb-messenger-public://user-thread/${fbUser}`,
            ).catch(() =>
              AppAlert.info(i18n.t('acc:moveToFbDown'), '', () =>
                Linking.openURL(
                  'https://apps.apple.com/kr/app/messenger/id454638411',
                ),
              ),
            );
          } else {
            KakaoSDK.KakaoChannel.chat(channelId).catch((_) => {
              action.toast.push(Toast.NOT_OPENED);
            });
          }

          break;
        case 'call':
          Linking.openURL(`tel:0317103969`);
          break;
        default:
          break;
      }
    },
    [action.toast, navigation],
  );

  const renderItem = useCallback(
    ({item}: {item: MenuItem}) => {
      return <ContactListItem item={item} onPress={onPress} />;
    },
    [onPress],
  );

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

  return (
    <View style={styles.container}>
      <FlatList data={data} renderItem={renderItem} />

      <AppModal
        title={
          noti.result === 0 || _.isUndefined(noti.result)
            ? i18n.t('set:sendAlimTalk')
            : i18n.t('set:failedToSendAlimTalk')
        }
        type="info"
        onOkClose={() => setShowModal(false)}
        visible={showModal}
      />
    </View>
  );
};

export default connect(
  ({info, noti, status}: RootState) => ({
    info,
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
)(ContactGlobalScreen);
