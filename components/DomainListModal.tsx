import React, {memo} from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {colors} from '@/constants/Colors';
import AppText from './AppText';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';
import {actions as modalActions} from '@/redux/modules/modal';

export const emailDomainList = [
  'naver.com',
  'gmail.com',
  'daum.net',
  'icloud.com',
  'kakao.com',
  'nate.com',
];

const styles = StyleSheet.create({
  container: {
    marginTop: 'auto',
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  menuItem: {
    padding: 20,
    backgroundColor: colors.white,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuItemText: {
    ...appStyles.medium18,
    lineHeight: 22,
    color: colors.black,
  },
});

const DomainListModal = ({setDomain}: {setDomain: (v: string) => void}) => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
        <Pressable
          style={{flex: 1}}
          onPress={() => dispatch(modalActions.closeModal())}
        />
        <View style={styles.container}>
          {emailDomainList.map((v) => (
            <Pressable
              key={v}
              style={styles.menuItem}
              onPress={() => {
                setDomain(v);
                dispatch(modalActions.closeModal());
              }}>
              <AppText style={styles.menuItemText}>{v}</AppText>
            </Pressable>
          ))}
          <Pressable
            key="input"
            style={[styles.menuItem, {borderBottomWidth: 0}]}
            onPress={() => {
              setDomain('input');
              dispatch(modalActions.closeModal());
            }}>
            <AppText style={styles.menuItemText}>{i18n.t('his:input')}</AppText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default memo(DomainListModal);
