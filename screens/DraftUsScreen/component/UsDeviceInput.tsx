import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppIcon from '@/components/AppIcon';
import AppSvgIcon from '@/components/AppSvgIcon';

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

type UsDeviceInputProps = {
  onClickInfo: (val: boolean) => void;
  onClickButton: (val: boolean) => void;
};

// TODO : 이름 변경하고 장바구니 모달도 해당 컴포넌트 사용하기
const UsDeviceInput: React.FC<UsDeviceInputProps> = ({
  onClickInfo,
  onClickButton,
}) => {
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

          <AppSvgIcon name="alarmFill" onPress={() => onClickInfo(true)} />
        </View>

        <Pressable
          style={styles.DeviceBoxBtnFrame}
          onPress={() => {
            onClickButton(true);
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
};

export default connect(({product}: RootState) => ({
  product,
}))(UsDeviceInput);
