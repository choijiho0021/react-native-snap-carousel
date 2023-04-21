import React, {memo, useCallback} from 'react';
import {Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import WebView from 'react-native-webview';
import {actions as modalActions} from '@/redux/modules/modal';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import AppText from '@/components/AppText';
import AppButton from '@/components/AppButton';

const styles = StyleSheet.create({
  okBtnContainer: {
    backgroundColor: colors.white,
    marginBottom: 16,
    marginTop: 12,
  },
  okButton: {
    ...appStyles.normal16Text,
    height: 52,
    backgroundColor: colors.clearBlue,
    textAlign: 'center',
    color: '#ffffff',
  },
  container: {
    marginTop: 'auto',
    paddingTop: 32,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  underLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  bottomText: {
    ...appStyles.medium14,
    lineHeight: 20,
    color: colors.warmGrey,
  },
});

type LocalModalProps = {
  localOpKey: string;
  html: string;
  onPress: () => void;
};

const LocalModal: React.FC<LocalModalProps> = ({localOpKey, html, onPress}) => {
  const dispatch = useDispatch();
  const okHandler = useCallback(() => {
    dispatch(modalActions.closeModal());
    onPress?.();
  }, [dispatch, onPress]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
        <Pressable
          style={{flex: 1}}
          onPress={() => dispatch(modalActions.closeModal())}
        />
        <View style={[styles.container, {height: 520}]}>
          <WebView style={{flex: 1}} originWhitelist={['*']} source={{html}} />
          <View style={styles.okBtnContainer}>
            <AppButton
              style={styles.okButton}
              title={i18n.t('local:ok')}
              type="primary"
              onPress={() => {
                okHandler();
              }}
            />
          </View>
          <Pressable
            style={styles.bottom}
            onPress={() => {
              AsyncStorage.setItem(
                `esim.show.local.modal.${localOpKey}`,
                moment().format('YYYY-MM-DD HH:mm:ss'),
              );
              okHandler();
            }}>
            <View style={styles.underLine}>
              <AppText style={styles.bottomText}>{i18n.t('close:day')}</AppText>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default memo(LocalModal);
