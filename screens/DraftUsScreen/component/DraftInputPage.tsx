import React, {useState} from 'react';
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

const styles = StyleSheet.create({});

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
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  return (
    <>
      <View style={{paddingHorizontal: 20, flex: 1}}>
        <View style={{marginVertical: 24, width: '50%'}}>
          <AppText style={appStyles.bold24Text}>
            {i18n.t(selected ? 'us:device:title' : 'us:step1:title')}
          </AppText>
        </View>

        {selected && (
          <UsDeviceInput
            onClickInfo={setInfoModalVisible}
            onClickButton={setUploadModalVisible}
          />
        )}
        <UsDateInput selected={selected} onClick={setDateModalVisible} />
      </View>

      <UsDeviceInfoModal
        visible={infoModalVisible}
        setVisible={setInfoModalVisible}
      />

      <UsDeviceInputModal
        visible={uploadModalVisible}
        setVisible={setUploadModalVisible}
      />
    </>
  );
};

export default connect(({product}: RootState) => ({
  product,
}))(DraftInputPage);
