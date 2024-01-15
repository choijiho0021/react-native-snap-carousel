import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';

import {appStyles} from '@/constants/Styles';
import UsDateInput from './UsDateInput';
import UsDeviceInfoModal from './UsDeviceInfoModal';
import UsDeviceInputModal from './UsDeviceInputModal';
import UsDeviceInput from './UsDeviceInput';
import {DeviceDataType} from '..';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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

  const onClickDeviceInputBtn = useCallback(
    (type: UsDeviceInputType) => {
      setDeviceInputType(type);
      setUploadModalVisible(false);
    },
    [setDeviceInputType],
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
        <View style={{marginVertical: 24, width: '50%'}}>
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
