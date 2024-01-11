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
import {DeviceDataType, UsDeviceInputType} from './UsDraftStep2';
import AppTextInput from '@/components/AppTextInput';

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
    ...appStyles.medium16,
    lineHeight: 24,
    padding: 16,
    gap: 8,
    borderColor: colors.lightGrey,
    borderRadius: 3,
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
  value: DeviceDataType;
  setValue: (val: DeviceDataType) => void;
};

// TODO : 이름 변경하고 장바구니 모달도 해당 컴포넌트 사용하기
const UsDeviceInput: React.FC<UsDeviceInputProps> = ({
  onClickInfo,
  onClickButton,
  inputType,
  value,
  setValue,
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
            {i18n.t('us:deviceInfo')}
          </AppText>

          <AppSvgIcon name="alarmFill" onPress={() => onClickInfo(true)} />
        </View>

        {inputType !== 'none' && (
          <Pressable
            style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}
            onPress={() => onClickButton(true)}>
            <AppText style={styles.uploadText}>
              {i18n.t(`us:device:upload:another`)}
            </AppText>
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

        {['eid', 'imei2'].map((r) => {
          const isEid = r === 'eid';
          const text = isEid ? value.eid : value.imei2;

          return (
            <View key={r} style={{marginTop: isEid ? 8 : 24, gap: 6}}>
              <AppText
                style={[appStyles.normal14Text, {color: colors.greyish}]}>
                {i18n.t(`us:${r}`)}
              </AppText>

              <AppTextInput
                key={r}
                style={[
                  styles.eidFrame,
                  {borderColor: text > 0 ? colors.clearBlue : colors.lightGrey},
                ]}
                maxLength={isEid ? 32 : 15}
                multiline
                keyboardType="numeric"
                value={text}
                onChangeText={(str) => {
                  setValue(
                    isEid ? {...value, eid: str} : {...value, imei2: str},
                  );
                }}
                placeholder={i18n.t(`us:device:placeholder`)}
              />

              {((isEid && text.length !== 32) ||
                (!isEid && text.length !== 15)) && (
                <View
                  style={{gap: 6, flexDirection: 'row', alignItems: 'center'}}>
                  {text.length > 0 && <AppSvgIcon name="checkRedSmall" />}
                  <AppText
                    style={[
                      appStyles.medium14,
                      {
                        color:
                          text.length > 0 ? colors.redError : colors.clearBlue,
                        lineHeight: 20,
                      },
                    ]}>
                    {i18n.t(
                      text.length > 0
                        ? `us:device:validate:${r}`
                        : `us:device:validate:empty`,
                    )}
                  </AppText>
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  }, [renderTitle, setValue, value]);

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
