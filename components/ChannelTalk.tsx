import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Image, Pressable, Text, TextStyle, View, ViewStyle} from 'react-native';
import {ChannelIO} from 'react-native-channel-plugin';
import Env from '@/environment';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {RootState} from '@/redux';
import {AccountModelState} from '@/redux/modules/account';

const {esimGlobal, isProduction, isIOS, talkPluginKey} = Env.get();

type ChannelTalkProps = {
  account: AccountModelState;
};

const ChannelTalk: React.FC<ChannelTalkProps> = ({account}) => {
  useEffect(() => {
    const settings = {
      pluginKey: talkPluginKey,
      // memberId: 'a9e043c1-4ea9-4e7c-945e-fa89a61fce85',
      channelButtonOption: {
        xMargin: 16,
        yMargin: 100,
        position: 'right',
      },
      profile: {
        id: account.userId,
        name: `Rokebi - ${account.mobile}`,
        mobileNumber: account.mobile,
        email: 'test@naver.com',
        memberId: account.mobile,
      },
      // profile: {
      //   mobileNumber: '01010002000',
      //   name: 'test',
      //   email: 'test@naver.com',
      // },
    };

    ChannelIO.boot(settings).then(() => {
      // ChannelIO.showChannelButton();
      // ChannelIO.updateUser(user).then((result) => {
      //   console.log('aaaaa result', result);
      //   // result.error
      //   // result.user
      // });
    });
  }, [account.mobile, account.userId]);

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

// export default ChannelTalk;

export default connect(
  ({account}: RootState) => ({
    account,
  }),
  () => ({}),
)(ChannelTalk);
