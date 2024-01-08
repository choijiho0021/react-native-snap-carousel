import React, {
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import AppSvgIcon from '@/components/AppSvgIcon';
import {Currency, RkbProdByCountry} from '@/redux/api/productApi';
import {API} from '@/redux/api';
import {PurchaseItem} from '@/redux/models/purchaseItem';
import i18n from '@/utils/i18n';
import Env from '@/environment';
import AppText from '@/components/AppText';

import {ProductModelState, getDiscountRate} from '@/redux/modules/product';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';

const styles = StyleSheet.create({
  storeBox: {
    position: 'absolute',
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderColor: colors.line,
    shadowColor: colors.black8,
    height: 272,
    bottom: 0,
    width: '100%',
  },
  modalClose: {
    justifyContent: 'center',
    // height: 56,
    alignItems: 'flex-end',
    width: 26,
    height: 26,
  },
  head: {
    height: 74,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 6,
  },
  store: {
    paddingTop: 32,
    paddingBottom: 48,
    height: 164,
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  storeName: {
    ...appStyles.medium18,
    color: colors.black,
  },
});

type DatePickerModalProps = {
  visible: boolean;
  isCloseBtn: boolean;
  onClose: () => void;
  title: string;
  body: ReactNode;
  height: number;
};

// TODO : 이름 변경하고 장바구니 모달도 해당 컴포넌트 사용하기
const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  isCloseBtn,
  onClose = true,
  title,
  body,
  height,
}) => {
  return (
    <Modal visible={visible} transparent>
      <Pressable
        style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)'}}
        onPress={onClose}>
        <SafeAreaView key="modal" style={[styles.storeBox, {height}]}>
          {title && (
            <View style={styles.head}>
              <AppText style={appStyles.bold18Text}>{title}</AppText>
              {isCloseBtn && (
                <View style={styles.modalClose}>
                  <AppSvgIcon
                    name="closeModal"
                    key="closeModal"
                    onPress={onClose}
                  />
                </View>
              )}
            </View>
          )}
          {body}
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
};

// export default memo(DatePickerModal);

export default connect(({product}: RootState) => ({
  product,
}))(DatePickerModal);
