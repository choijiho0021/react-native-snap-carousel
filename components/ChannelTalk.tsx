import React, {useEffect} from 'react';
import {Image, Pressable} from 'react-native';
import {ChannelIO} from 'react-native-channel-plugin';
import {connect} from 'react-redux';
import Env from '@/environment';
import {RootState} from '@/redux';
import {AccountModelState} from '@/redux/modules/account';

const {talkPluginKey, appId} = Env.get();

type ChannelTalkProps = {
  account: AccountModelState;
};

const ChannelTalk: React.FC<ChannelTalkProps> = ({account}) => {
  useEffect(() => {
    const settings = {
      pluginKey: talkPluginKey,
      channelButtonOption: {
        xMargin: 16,
        yMargin: 100,
        position: 'right',
      },
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

    ChannelIO.boot(settings);
  }, [account.email, account.loggedIn, account.mobile, account.userId]);

  return (
    <Pressable
      style={{position: 'absolute', right: 0, bottom: 100}}
      onPress={() => ChannelIO.showMessenger()}>
      <Image
        style={{width: 60, height: 60}}
        source={require('../assets/images/esim/channelTalk.png')}
        resizeMode="stretch"
      />
    </Pressable>
  );
};

export default connect(
  ({account}: RootState) => ({
    account,
  }),
  () => ({}),
)(ChannelTalk);
