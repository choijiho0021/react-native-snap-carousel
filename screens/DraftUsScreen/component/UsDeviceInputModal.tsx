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
import AppIcon from '@/components/AppIcon';
import moment from 'moment';
import AppSvgIcon from '@/components/AppSvgIcon';
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
  const modalTitle = useMemo(() => {
    return (
      <View style={{marginBottom: 24}}>
        <AppText style={appStyles.bold24Text}>
          {'잠깐! 사용 가능한\nSIM인지 확인해주세요.'}
        </AppText>
      </View>
    );
  }, []);

  const modalBody = useMemo(() => {
    return (
      <View style={{paddingHorizontal: 20, marginTop: 24}}>
        <View style={{gap: 8, marginBottom: 24}}>
          <AppText style={styles.modalText}>
            {i18n.t('us:device:modal:noti1')}
          </AppText>
          <View
            style={{
              borderWidth: 1,
              padding: 12,
              borderColor: colors.lightGrey,
            }}>
            <AppStyledText
              text={i18n.t('us:device:modal:noti2')}
              textStyle={styles.modalNotiText2}
              format={{b: styles.modalNotiTextBold2}}
            />
          </View>
        </View>
        <View>
          <View style={{flexDirection: 'row', gap: 8, marginBottom: 8}}>
            <AppSvgIcon name="emojiCheck" />
            <AppText style={appStyles.bold18Text}>{'확인 방법'}</AppText>
          </View>
          <View style={{marginBottom: 6}}>
            <AppText style={appStyles.bold16Text}>{'IOS (애플)'}</AppText>
          </View>
          <View style={{marginBottom: 8}}>
            <AppStyledText
              text={
                '<b>설정>일반>정보</b>에서 <b>IMEI2가 사용 가능한 SIM인지 확인</b>해주세요.'
              }
              textStyle={styles.modalNotiText}
              format={{b: styles.modalNotiTextBold}}
            />
          </View>

          <Image
            style={{width: '100%', marginBottom: 12}}
            source={require('@/assets/images/esim/guideIMEI2.png')}
            resizeMode="contain"
          />

          <View>
            <View style={{marginBottom: 6}}>
              <AppText style={appStyles.bold16Text}>
                {'AOS (안드로이드)'}
              </AppText>
            </View>

            <View style={{marginBottom: 36}}>
              <AppStyledText
                text={
                  '<b>설정>일반>정보</b>에서 <b>IMEI2가 사용 가능한 SIM인지 확인</b>해주세요. 사용하고 있는 eSIM이 있다면, <b>미국 상품 사용 전 꼭 OFF해주세요.</b>'
                }
                textStyle={styles.modalNotiText}
                format={{b: styles.modalNotiTextBold}}
              />
            </View>
          </View>
          <Pressable
            onPress={() => setVisible(false)}
            style={{
              alignItems: 'center',
              paddingVertical: 13,
              borderWidth: 1,
              borderColor: colors.lightGrey,
            }}>
            <AppText style={[appStyles.medium18, {color: colors.black}]}>
              {'확인'}
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
      title={modalTitle}
      body={modalBody}
    />
  );
};

export default connect(({product}: RootState) => ({
  product,
}))(UsDeviceInputModal);
