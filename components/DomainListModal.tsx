import React, {memo} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {colors} from '@/constants/Colors';
import AppText from './AppText';
import {appStyles} from '@/constants/Styles';
import i18n from '@/utils/i18n';

export const emailDomainList = [
  'naver.com',
  'gmail.com',
  'daum.net',
  'icloud.com',
  'kakao.com',
  'nate.com',
];

const styles = StyleSheet.create({
  menu: {
    width: 254,
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: colors.black10,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 64,
    shadowOpacity: 1,
  },
  menuItem: {
    height: 44,
    backgroundColor: colors.menu,
    borderBottomColor: colors.menuBorder,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
});

const DomainListModal = ({
  visible,
  style,
  onClose,
}: {
  visible: boolean;
  style: ViewStyle;
  onClose: (v: string) => void;
}) => {
  return (
    <Modal visible={visible} transparent>
      <Pressable style={{flex: 1}} onPress={() => onClose('')}>
        <ScrollView style={[styles.menu, style]}>
          {emailDomainList.map((v) => (
            <Pressable
              key={v}
              style={styles.menuItem}
              onPress={() => onClose(v)}>
              <AppText style={appStyles.medium18}>{v}</AppText>
            </Pressable>
          ))}
          <Pressable
            key="input"
            style={[styles.menuItem, {borderBottomWidth: 0}]}
            onPress={() => onClose('input')}>
            <AppText style={appStyles.medium18}>{i18n.t('his:input')}</AppText>
          </Pressable>
        </ScrollView>
      </Pressable>
    </Modal>
  );
};

export default memo(DomainListModal);
