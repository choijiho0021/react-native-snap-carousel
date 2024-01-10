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

const styles = StyleSheet.create({
  modalText: {
    ...appStyles.bold18Text,
    color: colors.black,
    lineHeight: 22,
  },
  modalNotiText2: {
    ...appStyles.medium14,
    color: colors.warmGrey,
  },
  modalNotiTextBold2: {
    ...appStyles.bold14Text,
    color: colors.warmGrey,
  },
  modalNotiText: {
    ...appStyles.semiBold14Text,
    color: colors.black,
    lineHeight: 22,
  },
  modalNotiTextBold: {
    ...appStyles.semiBold14Text,
    color: colors.clearBlue,
    lineHeight: 22,
  },

  guideImg: {
    width: 335,
    height: 79,
  },
});

type UsDeviceInputModalProps = {
  visible: boolean;
  setVisible: (val: boolean) => void;
};

// TODO : 이름 변경하고 장바구니 모달도 해당 컴포넌트 사용하기
const UsDeviceInputModal: React.FC<UsDeviceInputModalProps> = ({
  setVisible,
  visible,
}) => {
  const uploadModalTitle = useMemo(() => {
    return (
      <View style={{paddingVertical: 24, paddingHorizontal: 4}}>
        <AppText style={appStyles.bold24Text}>{'단말 정보 업로드'}</AppText>
      </View>
    );
  }, []);

  const uploadModalBody = useMemo(() => {
    return (
      <View style={{paddingHorizontal: 20}}>
        <Image
          style={{width: '100%', marginBottom: 8}}
          source={require('@/assets/images/esim/deviceInfoUpload.png')}
          resizeMode="contain"
        />

        <View style={{marginBottom: 48}}>
          <AppStyledText
            text={
              '다이얼에서 <b>*#06#</b>을 누르면 나오는 단말 정보 화면을 준비해 주세요.'
            }
            textStyle={[appStyles.medium16, {color: colors.black}]}
            format={{b: [appStyles.bold16Text, {color: colors.clearBlue}]}}
          />
        </View>

        <View style={{gap: 16}}>
          <Pressable
            onPress={() => setVisible(false)}
            style={{
              alignItems: 'center',
              paddingVertical: 15,
              backgroundColor: colors.clearBlue,
            }}>
            <AppText
              style={[
                appStyles.medium18,
                {color: colors.white, lineHeight: 26},
              ]}>
              {'바코드로 스캔하기(디자인 안나옴)'}
            </AppText>
          </Pressable>

          <Pressable
            onPress={() => setVisible(false)}
            style={{
              alignItems: 'center',
              paddingVertical: 15,
              backgroundColor: colors.clearBlue,
            }}>
            <AppText
              style={[
                appStyles.medium18,
                {color: colors.white, lineHeight: 26},
              ]}>
              {'캡처 화면 업로드하기'}
            </AppText>
          </Pressable>

          <Pressable
            onPress={() => setVisible(false)}
            style={{
              alignItems: 'center',
              paddingVertical: 15,
              borderWidth: 1,
              borderColor: colors.clearBlue,
            }}>
            <AppText
              style={[
                appStyles.medium18,
                {color: colors.clearBlue, lineHeight: 26},
              ]}>
              {'수동 직접 입력하기'}
            </AppText>
          </Pressable>
        </View>
      </View>
    );
  }, [setVisible]);

  return (
    <AppBottomModal
      visible={visible}
      isCloseBtn={false}
      onClose={() => {
        setVisible(false);
      }}
      title={uploadModalTitle}
      body={uploadModalBody}
    />
  );
};

export default connect(({product}: RootState) => ({
  product,
}))(UsDeviceInputModal);
