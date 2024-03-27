import React, {
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppStyledText from '@/components/AppStyledText';
import AppBottomModal from './AppBottomModal';
import {UsDeviceInputType} from './UsDraftStep2';
import Env from '@/environment';

const {isIOS} = Env.get();
const styles = StyleSheet.create({});

type UsDeviceInputModalProps = {
  visible: boolean;
  setVisible: (val: boolean) => void;
  onClickButton: (val: UsDeviceInputType) => void;
};

// TODO : 이름 변경하고 장바구니 모달도 해당 컴포넌트 사용하기
const UsDeviceInputModal: React.FC<UsDeviceInputModalProps> = ({
  setVisible,
  visible,
  onClickButton,
}) => {
  const uploadModalTitle = useMemo(() => {
    return (
      <View
        style={{
          paddingVertical: isIOS ? 24 : 0,
          paddingHorizontal: 4,
        }}>
        <AppText style={[appStyles.bold24Text]}>
          {i18n.t('us:device:modal:input:title')}
        </AppText>
      </View>
    );
  }, []);

  const uploadModalBody = useMemo(() => {
    return (
      <View style={{paddingHorizontal: 20, paddingBottom: 20}}>
        <Image
          style={{width: '100%', marginBottom: 8}}
          source={require('@/assets/images/esim/deviceInfoUpload.png')}
          resizeMode="contain"
        />

        <View style={{marginBottom: 48}}>
          <AppStyledText
            text={i18n.t('us:device:modal:input:text')}
            textStyle={[appStyles.medium16, {color: colors.black}]}
            format={{b: [appStyles.bold16Text, {color: colors.clearBlue}]}}
          />
        </View>

        <View style={{gap: 16}}>
          {['capture', 'manual'].map((type) => (
            <Pressable
              key={type}
              onPress={() => {
                onClickButton(type);
              }}
              style={{
                alignItems: 'center',
                paddingVertical: 15,
                borderWidth: type === 'capture' ? 0 : 1,
                borderColor: colors.clearBlue,
                backgroundColor:
                  type === 'capture' ? colors.clearBlue : colors.white,
              }}>
              <AppText
                style={[
                  appStyles.medium18,
                  {
                    color: type === 'capture' ? colors.white : colors.clearBlue,
                    lineHeight: 26,
                  },
                ]}>
                {i18n.t(`us:device:modal:input:button:${type}`)}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }, [onClickButton]);

  return (
    <AppBottomModal
      visible={visible}
      isCloseBtn={false}
      onClose={() => {
        setVisible(false);
      }}
      height={isIOS ? 550 : 480}
      headerStyle={{height: isIOS ? 124 : 80}}
      title={uploadModalTitle}
      body={uploadModalBody}
    />
  );
};

export default connect(({product}: RootState) => ({
  product,
}))(UsDeviceInputModal);
