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
import UsDateInput from './UsDateInput';
import UsDeviceInputModal from './UsDeviceInputModal';

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
});

type DraftInputPageProps = {
  selected: string;
  setDateModalVisible: (val: boolean) => void;
  setSnackBar: (val: string) => void;
};

// TODO : 이름 변경하고 장바구니 모달도 해당 컴포넌트 사용하기
const DraftInputPage: React.FC<DraftInputPageProps> = ({
  selected,
  setDateModalVisible,
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

  const renderDeviceInput = useCallback(() => {
    return (
      <>
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
      </>
    );
  }, []);

  return (
    <>
      <View style={{paddingHorizontal: 20, flex: 1}}>
        <View style={{marginVertical: 24, width: '50%'}}>
          <AppText style={appStyles.bold24Text}>
            {i18n.t(selected ? 'us:device:title' : 'us:step1:title')}
          </AppText>
        </View>

        {selected && renderDeviceInput()}

        <UsDateInput selected={selected} onClick={setDateModalVisible} />
      </View>

      {/* <AppBottomModal
        visible={visible}
        isCloseBtn={false}
        onClose={() => {
          setVisible(false);
        }}
        title={modalTitle}
        body={modalBody}
      /> */}

      <UsDeviceInputModal visible={visible} setVisible={setVisible} />

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
}))(DraftInputPage);
