import React, {memo, useCallback} from 'react';
import {Linking, Platform, StyleSheet, View} from 'react-native';
import AppModal from '@/components/AppModal';
import AppButton from '@/components/AppButton';
import {colors} from '@/constants/Colors';
import i18n from '@/utils/i18n';
import {appStyles} from '@/constants/Styles';
import AppText from '@/components/AppText';
import Env from '@/environment';
import AppTextJoin from '@/components/AppTextJoin';
import AppIcon from '@/components/AppIcon';

const {appStoreUrl} = Env.get();

const styles = StyleSheet.create({
  bottom: {
    marginBottom: 30,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  btn: {
    height: 52,
    flex: 1,
    marginHorizontal: 10,
  },
  laterBtn: {
    height: 52,
    flex: 1,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
});
type AppVerModalProps = {
  visible?: boolean;
  option?: string;
  onOkClose?: () => void;
};

const AppVerModal: React.FC<AppVerModalProps> = ({
  visible,
  option,
  onOkClose,
}) => {
  const renderBottom = useCallback(
    () => (
      <View style={styles.bottom}>
        {option === 'O' && (
          <AppButton
            title={i18n.t('app:updateLater')}
            style={styles.laterBtn}
            pressedStyle={{
              ...styles.laterBtn,
              backgroundColor: colors.whiteTwo,
            }}
            titleStyle={{
              ...appStyles.medium18,
              color: colors.black,
              alignSelf: 'center',
            }}
            onPress={() => onOkClose?.()}
          />
        )}
        <AppButton
          title={i18n.t('app:updateNow')}
          style={[styles.btn, {backgroundColor: colors.clearBlue}]}
          pressedStyle={{
            ...styles.btn,
            backgroundColor: colors.dodgerBlue,
          }}
          titleStyle={{
            ...appStyles.medium18,
            color: 'white',
            alignSelf: 'center',
          }}
          onPress={() => {
            const url =
              Platform.OS === 'ios' || Platform.OS === 'android'
                ? appStoreUrl[Platform.OS]
                : '';
            Linking.canOpenURL(url)
              .then((supported) => {
                if (supported) {
                  return Linking.openURL(url);
                }
                return console.log(`Unsupported url: ${url}`);
              })
              .catch((err) => console.error('An error occurred', err));
          }}
        />
      </View>
    ),
    [onOkClose, option],
  );

  return (
    <AppModal
      justifyContent="flex-end"
      contentStyle={{
        marginHorizontal: 0,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: 'white',
      }}
      bottom={renderBottom}
      visible={visible}>
      <View style={{marginBottom: 20, marginTop: 32, marginHorizontal: 20}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginRight: 12,
          }}>
          <View>
            <AppText style={appStyles.bold22Text}>
              {i18n.t('app:updateTitle-1')}
            </AppText>
            <AppTextJoin
              data={[
                {
                  text: i18n.t('app:updateTitle-2'),
                  textStyle: {...appStyles.bold22Text, color: colors.clearBlue},
                },
                {
                  text: i18n.t('app:updateTitle-3'),
                  textStyle: appStyles.bold22Text,
                },
              ]}
            />
          </View>
          <AppIcon name="updateImg" />
        </View>
        <AppText key="1" style={{...appStyles.normal16Text, marginTop: 12}}>
          {i18n.t('app:updateMandatory')}
        </AppText>
      </View>
    </AppModal>
  );
};

export default memo(AppVerModal);
