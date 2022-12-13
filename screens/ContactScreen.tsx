import Analytics from 'appcenter-analytics';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, StyleSheet, View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {ChannelIO} from 'react-native-channel-plugin';
import KakaoSDK from '@/components/NativeModule/KakaoSDK';
import AppBackButton from '@/components/AppBackButton';
import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppModal from '@/components/AppModal';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import Env from '@/environment';
import {RootState} from '@/redux';
import {actions as notiActions, NotiModelState} from '@/redux/modules/noti';
import {actions as toastActions} from '@/redux/modules/toast';
import i18n from '@/utils/i18n';
import {navigate} from '@/navigation/navigation';
import AppSnackBar from '@/components/AppSnackBar';
import {isDeviceSize} from '@/constants/SliderEntry.style';
import {AccountModelState} from '../redux/modules/account';

const {channelId, esimGlobal, talkPluginKey} = Env.get();

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.whiteTwo,
    flex: 1,
  },
  bottomContainer: {
    backgroundColor: colors.white,
    flex: 1,
    paddingVertical: isDeviceSize('medium') ? 32 : 40,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  itemTitle: {
    ...appStyles.bold16Text,
    fontWeight: '600',
    fontSize: isDeviceSize('medium') ? 16 : 18,
    color: colors.black,
    lineHeight: 22,
    letterSpacing: -1,
  },
  showSearchBar: {
    marginRight: 20,
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 162,
  },
  absoluteView: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: colors.white,
    marginTop: 120,
    paddingHorizontal: 12,
  },
  btnBlue: {
    flex: 1,
    height: 136,
    marginHorizontal: 8,
    justifyContent: 'center',
    backgroundColor: colors.clearBlue,
    borderRadius: 3,
    alignItems: 'center',
  },
  contactInfo: {
    ...appStyles.bold22Text,
    lineHeight: 30,
    fontWeight: '600',
    fontSize: isDeviceSize('medium') ? 22 : 24,
    paddingTop: 14,
  },
  contactInfo2: {
    ...appStyles.bold18Text,
    lineHeight: 24,
    fontWeight: '600',
    fontSize: isDeviceSize('medium') ? 18 : 20,
    color: colors.black,
    marginBottom: 8,
  },
  contactInfoTime: {
    ...appStyles.normal12Text,
    fontSize: isDeviceSize('medium') ? 12 : 14,
    color: colors.warmGrey,
    textAlign: 'left',
    lineHeight: 18,
    marginBottom: 28,
  },
  contactListItem: {
    backgroundColor: colors.white,
    marginVertical: 8,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.whiteTwo,

    shadowColor: colors.shadow1,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 0},
  },
  contactListItemRow: {
    flexDirection: 'row',
    height: isDeviceSize('medium') ? 74 : 88,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
type MenuItem = {
  key: string;
  title: string;
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
      style={styles.contactListItem}
      onPress={() => {
        if (onPress) onPress(item.key);
      }}>
      <View style={styles.contactListItemRow}>
        <View style={{flexDirection: 'row'}}>
          <AppIcon
            style={{alignSelf: 'center', marginHorizontal: 20}}
            name={item.icon}
          />
          <AppText style={styles.itemTitle}>{item.title}</AppText>
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

type ContactScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<ParamListBase, string>;

  noti: NotiModelState;
  account: AccountModelState;
};

const ContactScreen: React.FC<ContactScreenProps> = (props) => {
  const {navigation, route, noti, account} = props;

  const data = useMemo(
    () => [
      {
        key: 'Board',
        title: i18n.t('contact:boardTitle'),
        icon: 'imgBoard',
        page: 'Contact Board',
      },
      esimGlobal
        ? {
            key: 'FB',
            title: i18n.t('contact:fbMsg'),
            icon: 'fbMsg',
            page: 'Open FB Messenger',
          }
        : {
            key: 'Ktalk',
            title: i18n.t('contact:ktalkTitle'),
            icon: 'kakaoChannel',
            page: 'Open Kakao Talk',
          },
    ],
    [],
  );
  const talkSettings = useMemo(
    () => ({
      pluginKey: talkPluginKey,
      channelButtonOption: {
        xMargin: 16,
        yMargin: 100,
        position: 'right',
      },
      profile: {
        mobileNumber: account.mobile,
        name: `global ${account.mobile}`,
        email: account.email,
      },
    }),
    [account.email, account.mobile],
  );
  const [showModal, setShowModal] = useState(false);
  const [showSnackBar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (esimGlobal) ChannelIO.boot(talkSettings);
  }, [talkSettings]);

  useEffect(() => {
    navigation.setOptions({
      title: null,
      headerLeft: () => <AppBackButton title={i18n.t('contact:title')} />,
      headerRight: () => (
        <AppButton
          key="search"
          style={styles.showSearchBar}
          onPress={() =>
            navigation.navigate('Noti', {
              mode: 'info',
              title: i18n.t('contact:notice'),
            })
          }
          iconName="btnNotice"
        />
      ),
    });

    Analytics.trackEvent('Page_View_Count', {page: 'Service Center'});
  }, [navigation]);

  useEffect(() => {
    if (noti.result) setShowModal(true);
  }, [noti.result]);

  const onPress = useCallback(
    (key: string) => {
      switch (key) {
        case 'Faq':
          navigation.navigate('Faq');
          break;
        case 'Board':
          navigate(navigation, route, 'HomeStack', {
            tab: 'HomeStack',
            screen: 'ContactBoard',
          });
          break;
        case 'Guide':
          navigation.navigate('UserGuide');
          break;

        case 'FB':
          if (esimGlobal) ChannelIO.showMessenger();

          // Linking.openURL(`fb-messenger-public://user-thread/${fbUser}`).catch(
          //   () =>
          //     AppAlert.info(i18n.t('acc:moveToFbDown'), '', () =>
          //       Linking.openURL('http://appstore.com/Messenger'),
          //     ),
          // );
          break;

        case 'Ktalk':
          KakaoSDK.KakaoChannel.chat(channelId).catch(() => {
            setShowSnackbar(true);
          });
          break;
        default:
          break;
      }
    },
    [navigation, route],
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.infoContainer}>
        <AppText style={styles.contactInfo}>{i18n.t('contact:info')}</AppText>
        <AppIcon name="imgNotiDokebi" style={{marginRight: 12}} />
      </View>

      <View style={styles.absoluteView}>
        {['Faq', 'Guide'].map((elm) => (
          <Pressable
            key={elm}
            style={styles.btnBlue}
            onPress={() => onPress(elm)}>
            <AppIcon style={{marginBottom: 16}} name={`img${elm}`} />
            <AppText style={[appStyles.bold16Text, {color: colors.white}]}>
              {i18n.t(`contact:${elm.toLowerCase()}`)}
            </AppText>
          </Pressable>
        ))}
      </View>

      <View style={styles.bottomContainer}>
        <AppText style={styles.contactInfo2}>{i18n.t('contact:info2')}</AppText>
        <AppText style={styles.contactInfoTime}>
          {i18n.t('contact:workTimeDesc')}
        </AppText>
        {data.map((item) => (
          <ContactListItem key={item.key} item={item} onPress={onPress} />
        ))}
      </View>

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
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackbar(false)}
        textMessage={i18n.t('contact:kakaoOpenChFail')}
      />
    </ScrollView>
  );
};

export default connect(
  ({account, noti, status}: RootState) => ({
    account,
    noti,
    pending: status.pending[notiActions.sendAlimTalk.typePrefix] || false,
  }),
  (dispatch) => ({
    action: {
      toast: bindActionCreators(toastActions, dispatch),
    },
  }),
)(ContactScreen);
