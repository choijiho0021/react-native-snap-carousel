import React, {ReactNode} from 'react';
import {Modal, Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '@reduxjs/toolkit';
import AppSvgIcon from '@/components/AppSvgIcon';
import AppText from '@/components/AppText';

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
});

type AppBottomModalProps = {
  visible: boolean;
  isCloseBtn: boolean;
  onClose: () => void;
  title?: string;
  body: ReactNode;
  height: number;
  isCloseTouch: boolean;
};

const AppBottomModal: React.FC<AppBottomModalProps> = ({
  visible,
  isCloseBtn,
  onClose,
  title,
  body,
  height,
  isCloseTouch = true,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => onClose()}>
      <Pressable
        style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)'}}
        onPress={isCloseTouch ? onClose : () => {}}>
        <SafeAreaView key="modal" style={[styles.storeBox, {height}]}>
          <Pressable>
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
          </Pressable>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
};

// export default memo(AppBottomModal);

export default connect(({product}: RootState) => ({
  product,
}))(AppBottomModal);
