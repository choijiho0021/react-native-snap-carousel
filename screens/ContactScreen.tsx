import KakaoSDK from '@actbase/react-native-kakaosdk';
import Analytics from 'appcenter-analytics';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Linking, Pressable, StyleSheet, View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import AppAlert from '@/components/AppAlert';
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
import {actions as toastActions, ToastAction} from '@/redux/modules/toast';
import i18n from '@/utils/i18n';
import {navigate} from '@/navigation/navigation';
import AppSnackBar from '@/components/AppSnackBar';
import {isDeviceSize} from '@/constants/SliderEntry.style';

const {channelId, esimGlobal, fbUser} = Env.get();

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.whiteTwo,
    flex: 1,
  },
  bottomContainer: {
    backgroundColor: colors.whiteTwo,
    flex: 1,
    paddingVertical: isDeviceSize('medium') ? 32 : 40,
    paddingHorizontal: 20,
  },
  itemTitle: {
    ...appStyles.bold16Text,
    fontWeight: '600',
    fontSize: isDeviceSize('medium') ? 16 : 18,
    color: colors.black,
    lineHeight: 22,
  },
  itemDesc: {
    ...appStyles.normal12Text,
    fontSize: isDeviceSize('medium') ? 12 : 14,
    color: colors.warmGrey,
    textAlign: 'left',
    lineHeight: 20,
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
    paddingBottom: isDeviceSize('medium') ? 156 : 182,
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
    marginBottom: 24,
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
      style={{
        backgroundColor: colors.white,
        marginVertical: 8,
        borderRadius: 3,
      }}
      onPress={() => {
        if (onPress) onPress(item.key);
      }}>
      <View
        style={{
          flexDirection: 'row',
          height: isDeviceSize('medium') ? 78 : 92,
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

type ContactScreenProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<ParamListBase, string>;

  noti: NotiModelState;
  action: {
    toast: ToastAction;
  };
};

const ContactScreen: React.FC<ContactScreenProps> = (props) => {
  const {navigation, route, noti, action} = props;

  const data = useMemo(
    () => [
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
        icon: 'callCenter',
        page: 'Call Center',
      },
    ],
    [],
  );
  const [showModal, setShowModal] = useState(false);
  const [showSnackBar, setShowSnackbar] = useState(false);

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
        case 'Ktalk':
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
            KakaoSDK.Channel.chat(channelId).catch((_) => {
              setShowSnackbar(true);
            });
          }

          break;
        case 'Call':
          Linking.openURL(`tel:0317103969`);
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
