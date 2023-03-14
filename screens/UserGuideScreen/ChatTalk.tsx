import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {ChannelIO} from 'react-native-channel-plugin';
import {RootState} from '@reduxjs/toolkit';
import {connect} from 'react-redux';
import {AccountModelState} from '@/redux/modules/account';
import AppSnackBar from '@/components/AppSnackBar';
import i18n from '@/utils/i18n';
import Env from '@/environment';
import AppActivityIndicator from '@/components/AppActivityIndicator';

const {appId, esimGlobal, talkPluginKey} = Env.get();

const ChatTalk = ({
  account,
  isClicked,
  setChatTalkClicked,
}: {
  account: AccountModelState;
  isClicked: boolean;
  setChatTalkClicked: (v: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [showSnackBar, setShowSnackbar] = useState(false);
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

  const openChannelTalk = useCallback(async () => {
    setLoading(true);
    const settings = {
      pluginKey: talkPluginKey,
      profile: account.loggedIn
        ? {
            id: account.userId,
            name: `${appId} - ${account.mobile}`,
            mobileNumber: account.mobile,
            email: account.email,
            mobileStr: account.mobile,
            orderUrl: `https://esim.rokebi.com/ko/admin/op/order/search?title=${account.mobile}&mail=&items_per_page=10`,
          }
        : undefined,
    };

    if (await ChannelIO.isBooted()) {
      ChannelIO.showMessenger();
      setLoading(false);
    } else {
      ChannelIO.boot(settings).then((result) => {
        if (result.status === 'SUCCESS') {
          ChannelIO.showMessenger();
        } else {
          setShowSnackbar(true);
        }
        setLoading(false);
      });
    }
  }, [account.email, account.loggedIn, account.mobile, account.userId]);

  useEffect(() => {
    if (esimGlobal) ChannelIO.boot(talkSettings);
  }, [talkSettings]);

  useEffect(() => {
    if (isClicked) {
      openChannelTalk();
      setChatTalkClicked(false);
    }
  }, [isClicked, openChannelTalk, setChatTalkClicked]);

  return (
    <View>
      <AppActivityIndicator visible={loading} />
      <AppSnackBar
        visible={showSnackBar}
        onClose={() => setShowSnackbar(false)}
        textMessage={i18n.t('contact:OpenChFail')}
      />
    </View>
  );
};

export default connect(({account}: RootState) => ({
  account,
}))(ChatTalk);
