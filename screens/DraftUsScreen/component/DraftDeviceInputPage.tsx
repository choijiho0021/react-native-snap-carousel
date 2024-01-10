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
import AppSvgIcon from '@/components/AppSvgIcon';
import moment from 'moment';
import AppStyledText from '@/components/AppStyledText';
import AppBottomModal from './AppBottomModal';

const styles = StyleSheet.create({
  DeviceBoxBtnFrame: {
    padding: 16,
    gap: 8,
    borderRadius: 3,
    backgroundColor: colors.clearBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  DateBoxBtnFrame: {
    padding: 16,
    gap: 8,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notiText: {
    ...appStyles.medium14,
    color: colors.black,
  },
  notiTextBold: {
    ...appStyles.bold14Text,
    color: colors.clearBlue,
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
  guideImg: {
    width: 335,
    height: 79,
  },
});

type DraftDeviceInputPageProps = {
  selected: string;
  onClick: (val: boolean) => void;
  setSnackBar: (val: string) => void;
};

// TODO : 이름 변경하고 장바구니 모달도 해당 컴포넌트 사용하기
const DraftDeviceInputPage: React.FC<DraftDeviceInputPageProps> = ({
  selected,
  onClick,
  setSnackBar,
}) => {
  const [visible, setVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

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
  }, []);

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
  }, []);

  return (
    <>
      <View style={{paddingHorizontal: 20, flex: 1}}>
        <View style={{marginVertical: 24, width: '50%'}}>
          <AppText style={appStyles.bold24Text}>
            {i18n.t('us:device:title')}
          </AppText>
        </View>
        <View style={{gap: 8, marginBottom: 40}}>
          <View style={{flexDirection: 'row', gap: 6, alignItems: 'center'}}>
            <AppText
              style={[
                appStyles.bold16Text,
                {color: colors.black, lineHeight: 22},
              ]}>
              {i18n.t('us:device:info')}
            </AppText>

            <AppSvgIcon name="alarmFill" onPress={() => setVisible(true)} />
          </View>

          <Pressable
            style={styles.DeviceBoxBtnFrame}
            onPress={() => {
              setUploadModalVisible(true);
            }}>
            <AppText style={[appStyles.medium18, {color: colors.white}]}>
              {i18n.t('us:device:upload')}
            </AppText>
            <AppIcon
              style={{alignSelf: 'center', justifyContent: 'center'}}
              name="plusWhite"
            />
          </Pressable>
        </View>

        <View style={{gap: 8, marginBottom: 8}}>
          <AppText style={[appStyles.normal14Text, {color: colors.greyish}]}>
            {i18n.t('us:date:text')}
          </AppText>

          <Pressable
            style={styles.DateBoxBtnFrame}
            onPress={() => {
              console.log('@@@ onPress 클릭');
              onClick(true);
              //   setShowPicker(true);
            }}>
            <AppText
              style={[
                appStyles.normal16Text,
                {color: selected === '' ? colors.greyish : colors.black},
              ]}>
              {selected === ''
                ? i18n.t('us:date:placeHolder')
                : moment(selected).format('YYYY년 MM월 DD일')}
            </AppText>
            <AppText
              style={[
                appStyles.semiBold14Text,
                {
                  color: colors.clearBlue,
                  alignSelf: 'center',
                  justifyContent: 'center',
                },
              ]}>
              {i18n.t('modify')}
            </AppText>
          </Pressable>
        </View>

        <View style={{gap: 6}}>
          {['1', '2'].map((i) => (
            <View style={{gap: 6, flexDirection: 'row'}}>
              <AppSvgIcon name="checkedBlueSmall" />
              <AppStyledText
                text={i18n.t(`us:device:notice${i}`)}
                textStyle={styles.notiText}
                format={{b: styles.notiTextBold}}
              />
            </View>
          ))}
        </View>
      </View>
      <AppBottomModal
        visible={visible}
        isCloseBtn={false}
        onClose={() => {
          setVisible(false);
        }}
        title={modalTitle}
        body={modalBody}
      />

      <AppBottomModal
        visible={uploadModalVisible}
        isCloseBtn={false}
        onClose={() => {
          setUploadModalVisible(false);
        }}
        title={uploadModalTitle}
        body={uploadModalBody}
      />
    </>
  );
};

export default connect(({product}: RootState) => ({
  product,
}))(DraftDeviceInputPage);
