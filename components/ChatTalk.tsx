import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Image, Pressable} from 'react-native';
import {ChannelIO} from 'react-native-channel-plugin';
import {RootState} from '@reduxjs/toolkit';
import {connect} from 'react-redux';
import VersionCheck from 'react-native-version-check';
import DeviceInfo from 'react-native-device-info';
import {AccountModelState} from '@/redux/modules/account';
import AppSnackBar from '@/components/AppSnackBar';
import i18n from '@/utils/i18n';
import Env from '@/environment';
import AppActivityIndicator from '@/components/AppActivityIndicator';

const {appId, talkPluginKey, esimGlobal} = Env.get();

const ChatTalk = ({
  account,
  visible = false,
  isClicked = false,
  bottom = 20,
  setChatTalkClicked,
}: {
  account: AccountModelState;
  visible?: boolean;
  isClicked?: boolean;
  bottom?: number;
  setChatTalkClicked?: (v: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [showSnackBar, setShowSnackbar] = useState(false);
  const settings = useMemo(
    () => ({
      pluginKey: talkPluginKey,
      profile: account.loggedIn
        ? {
            id: account.userId,
            language: esimGlobal ? 'en' : 'ko',
            name: `${appId} - ${account.mobile}`,
            mobileNumber: account.mobile,
            email: account.email,
            mobileStr: account.mobile,
            orderUrl: `https://${appId}.rokebi.com/ko/admin/op/order/search?title=${account.mobile}&mail=&items_per_page=10`,
            appVersion: `${VersionCheck.getCurrentVersion()}(${DeviceInfo.getBuildNumber()})`,
          }
        : {
            language: esimGlobal ? 'en' : 'ko',
            appVersion: `${VersionCheck.getCurrentVersion()}/${DeviceInfo.getBuildNumber()}`,
          },
    }),
    [account.email, account.loggedIn, account.mobile, account.userId],
  );

  const openChannelTalk = useCallback(async () => {
    setLoading(true);

    ChannelIO.boot(settings).then((result) => {
      if (result.status === 'SUCCESS') {
        ChannelIO.showMessenger();
      } else {
        setShowSnackbar(true);
      }
      setLoading(false);
    });
  }, [settings]);

  useEffect(() => {
    if (isClicked && setChatTalkClicked !== undefined) {
      openChannelTalk();
      setChatTalkClicked(false);
    }
  }, [isClicked, openChannelTalk, setChatTalkClicked]);

  return (
    <Fragment>
      <AppActivityIndicator visible={loading} />
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackbar(false)}
        textMessage={i18n.t('contact:OpenChFail')}
      />
      {visible && (
        <Pressable
          style={{
            position: 'absolute',
            right: 10,
            bottom,
          }}
          onPress={() => openChannelTalk()}>
          <Image
            style={{width: 60, height: 60}}
            source={require('../assets/images/esim/channelTalk.png')}
            resizeMode="stretch"
          />
        </Pressable>
      )}
    </Fragment>
  );
};

export default connect(({account}: RootState) => ({
  account,
}))(ChatTalk);
