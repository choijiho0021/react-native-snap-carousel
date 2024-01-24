import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import MlkitOcr from 'react-native-mlkit-ocr';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import {appStyles} from '@/constants/Styles';
import UsDateInput from './UsDateInput';
import UsDeviceInfoModal from './UsDeviceInfoModal';
import UsDeviceInputModal from './UsDeviceInputModal';
import UsDeviceInput from './UsDeviceInput';
import {DeviceDataType} from '..';

const styles = StyleSheet.create({});

type UsDraftStep2Props = {
  actDate: string;
  setDateModalVisible: (val: boolean) => void;
  deviceData: DeviceDataType;
  setDeviceData: (val: DeviceDataType) => void;
  deviceInputType: UsDeviceInputType;
  setDeviceInputType: (val: UsDeviceInputType) => void;
};

export type UsDeviceInputType = 'none' | 'barcode' | 'capture' | 'manual';

// TODO : 이름 변경하고 장바구니 모달도 해당 컴포넌트 사용하기
const UsDraftStep2: React.FC<UsDraftStep2Props> = ({
  actDate,
  setDateModalVisible,
  deviceData,
  setDeviceData,
  deviceInputType,
  setDeviceInputType,
}) => {
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  const blockAnimation = useRef(false);
  const animatedValue = useRef(new Animated.Value(40)).current;

  const extractTextFromImage = useCallback(
    async (imagePath: string) => {
      try {
        if (MlkitOcr) {
          let imei2 = '';
          let eid = '';
          const result = await MlkitOcr.detectFromFile(imagePath);

          result.forEach((r, i) => {
            const {text} = r;
            let temp = '';
            if (text.includes('IMEI2')) {
              if (text.length > 10) {
                temp = text.split('IMEI2')[1].replace(/\s/g, '');
              } else {
                temp = result[i + 1].text
                  .replace(/\s/g, '')
                  .replace(/\n/g, '')
                  .split('/')[0]
                  .replace(/o/g, '0');
              }
              if (temp.length === 15 && !Number.isNaN(temp)) imei2 = temp;
            } else if (text.includes('EID')) {
              if (text.length > 10) {
                temp = text.split('EID')[1].replace(/\s/g, '');
              } else {
                temp = result[i + 1].text
                  .replace(/\s/g, '')
                  .replace(/\n/g, '')
                  .split('/')[0]
                  .replace(/o/g, '0');
              }
              if (temp.length === 32 && !Number.isNaN(temp)) eid = temp;
            }
          });

          setDeviceData({eid, imei2});
        } else {
          console.error('@@@@ MlkitOcr is null or undefined');
        }
      } catch (error) {
        console.log('@@@@ error', error);
      }
    },
    [setDeviceData],
  );

  const onClickDeviceInputBtn = useCallback(
    async (type: UsDeviceInputType) => {
      if (type === 'capture') {
        if (ImagePicker) {
          const image = await ImagePicker.openPicker({
            includeBase64: true,
            writeTempFile: false,
            mediaType: 'photo',
            forceJpb: true,
            compressImageQuality: 0.1,
          });
          await extractTextFromImage(image.path);
        }
      }
      setDeviceInputType(type);
      setUploadModalVisible(false);
    },
    [extractTextFromImage, setDeviceInputType],
  );

  useEffect(() => {
    console.log('deviceInputType : ', deviceInputType);
  }, [deviceInputType]);

  useEffect(() => {
    if (actDate !== '') {
      const showTop = () => {
        if (!blockAnimation.current) {
          blockAnimation.current = true;
          Animated.timing(animatedValue, {
            toValue: deviceInputType === 'none' ? 140 : 300,
            duration: deviceInputType === 'none' ? 600 : 0,
            easing: Easing.ease,
            useNativeDriver: false,
          }).start(() => {
            blockAnimation.current = false;
          });
        }
      };

      showTop(true);
    }
  }, [actDate, animatedValue, deviceInputType]);

  return (
    <>
      <KeyboardAwareScrollView
        enableOnAndroid
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 20, flex: 1}}>
        <View style={{marginVertical: 24}}>
          <AppText style={appStyles.bold24Text}>
            {i18n.t(actDate ? 'us:device:title' : 'us:step1:title')}
          </AppText>
        </View>

        {actDate && (
          <UsDeviceInput
            animatedValue={animatedValue}
            onClickInfo={setInfoModalVisible}
            onClickButton={setUploadModalVisible}
            inputType={deviceInputType}
            value={deviceData}
            setValue={setDeviceData}
          />
        )}
        <UsDateInput
          animatedValue={animatedValue}
          actDate={actDate}
          onClick={setDateModalVisible}
        />
      </KeyboardAwareScrollView>

      <UsDeviceInfoModal
        visible={infoModalVisible}
        setVisible={setInfoModalVisible}
      />

      <UsDeviceInputModal
        visible={uploadModalVisible}
        setVisible={setUploadModalVisible}
        onClickButton={onClickDeviceInputBtn}
      />
    </>
  );
};

export default connect(({product}: RootState) => ({
  product,
}))(UsDraftStep2);
