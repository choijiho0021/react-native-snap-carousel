import React, {useCallback} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';

import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import AppIcon from '@/components/AppIcon';
import AppSvgIcon from '@/components/AppSvgIcon';
import {UsDeviceInputType} from './DraftInputPage';

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

  uploadText: {
    ...appStyles.semiBold16Text,
    lineHeight: 24,
    color: colors.clearBlue,
  },
  eidFrame: {
    padding: 16,
    gap: 8,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

type UsDeviceInputProps = {
  onClickInfo: (val: boolean) => void;
  onClickButton: (val: boolean) => void;
  inputType: UsDeviceInputType;
};

// TODO : 이름 변경하고 장바구니 모달도 해당 컴포넌트 사용하기
const UsDeviceInput: React.FC<UsDeviceInputProps> = ({
  onClickInfo,
  onClickButton,
  inputType,
}) => {
  const renderTitle = useCallback(() => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
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

        {inputType !== 'none' && (
          <Pressable
            style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}
            onPress={() => onClickButton(true)}>
            <AppText style={styles.uploadText}>{'다른 업로드 방법'}</AppText>
            <AppSvgIcon name="arrowRightBlue16" />
          </Pressable>
        )}
      </View>
    );
  }, [onClickButton, onClickInfo, inputType]);

  const renderUploadButton = useCallback(() => {
    return (
      <View style={{gap: 8, marginBottom: 40}}>
        {renderTitle()}

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
    );
  }, [onClickButton, renderTitle]);

  const renderManualButton = useCallback(() => {
    return (
      <View style={{marginBottom: 40}}>
        {renderTitle()}

        <View style={{marginTop: 8}}>
          <AppText style={[appStyles.normal14Text, {color: colors.greyish}]}>
            {'EID'}
          </AppText>

          <Pressable
            style={styles.eidFrame}
            onPress={() => {
              console.log('@@@ onPress 클릭');
            }}>
            <AppText style={[appStyles.normal16Text, {color: colors.greyish}]}>
              {'글자'}
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
              {'글자테스트'}
            </AppText>
          </Pressable>
        </View>
      </View>
    );
  }, [renderTitle]);

  const renderContent = useCallback(() => {
    switch (inputType) {
      case 'manual':
        return renderManualButton();
      default:
        return renderUploadButton();
    }
  }, [inputType, renderManualButton, renderUploadButton]);

  return <>{renderContent()}</>;
};

export default connect(({product}: RootState) => ({
  product,
}))(UsDeviceInput);
