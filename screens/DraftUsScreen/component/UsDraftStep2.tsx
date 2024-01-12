import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
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

  return (
    <>
      <View style={{paddingHorizontal: 20, flex: 1}}>
        <View style={{marginVertical: 24, width: '50%'}}>
          <AppText style={appStyles.bold24Text}>
            {i18n.t(actDate ? 'us:device:title' : 'us:step1:title')}
          </AppText>
        </View>

        {actDate && (
          <UsDeviceInput
            onClickInfo={setInfoModalVisible}
            onClickButton={setUploadModalVisible}
            inputType={deviceInputType}
            value={deviceData}
            setValue={setDeviceData}
          />
        )}
        <UsDateInput actDate={actDate} onClick={setDateModalVisible} />
      </View>

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
