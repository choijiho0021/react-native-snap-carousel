import React, {useCallback, useEffect, useRef} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'underscore';
import AppButton from '@/components/AppButton';
import AppText from '@/components/AppText';
import {colors} from '@/constants/Colors';
import {appStyles} from '@/constants/Styles';
import {RootState} from '@/redux';
import {AccountModelState} from '@/redux/modules/account';
import {actions as orderActions, OrderAction} from '@/redux/modules/order';
import i18n from '@/utils/i18n';
import {API} from '@/redux/api';
import AppTextInput from '@/components/AppTextInput';
import AppSvgIcon from '@/components/AppSvgIcon';
import {actions as modalActions, ModalAction} from '@/redux/modules/modal';

import AppModalContent from '@/components/ModalContent/AppModalContent';
import AppStyledText from '@/components/AppStyledText';
import {VoucherType} from './VoucherBottomAlert';

const styles = StyleSheet.create({
  confirm: {
    ...appStyles.confirm,
  },

  modalText: {
    ...appStyles.normal16Text,
    lineHeight: 26,
    letterSpacing: -0.32,
    color: colors.warmGrey,
  },
  modalBoldText: {
    ...appStyles.semiBold16Text,
    lineHeight: 26,
    letterSpacing: -0.32,
    color: colors.black,
  },
  textContainer: {
    position: 'relative',
    ...appStyles.medium18,
    height: 52,
    marginTop: 20,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    ...appStyles.roboto16Text,
    letterSpacing: -0.16,
  },
  input: {
    opacity: 0,
    height: 0,
  },
});

type VoucherTabProps = {
  account: AccountModelState;

  amount: number;
  setShowAlert: (val: boolean) => void;
  setVoucherType: (val: VoucherType) => void;
  setVoucherCode: (val: string) => void;
  voucherCode: string;
  action: {
    order: OrderAction;
    modal: ModalAction;
  };
};

const VoucherTab: React.FC<VoucherTabProps> = ({
  account: {iccid, token, balance = 0},
  action,
  setShowAlert,
  setVoucherType,
  setVoucherCode,
  voucherCode,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (iccid && token) {
        action.order.getSubs({iccid, token});
      }
    };
  }, [action.order, iccid, token]);

  const handleFocus = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onSubmit = useCallback(() => {
    if (iccid && token) {
      console.log('@@@ voucherCode : ', voucherCode);
      API.Account.getVoucherType({iccid, code: voucherCode}).then((rsp) => {
        if (rsp?.result === 0) {
          const {title, amount, expire_desc} = rsp?.objects;

          setShowAlert(true);
          setVoucherType({
            title,
            amount: parseInt(amount, 10),
            expireDesc: expire_desc,
          });
        } else {
          action.modal.renderModal(() => (
            <AppModalContent
              type="info2"
              buttonBoxStyle={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              okButtonStyle={{marginBottom: 1}}
              onOkClose={() => {
                action.modal.closeModal();
              }}>
              <View style={{marginLeft: 30}}>
                <AppStyledText
                  text={i18n.t(`esim:recharge:voucher:regist:fail`)}
                  textStyle={styles.modalText}
                  format={{b: styles.modalBoldText}}
                />
              </View>
            </AppModalContent>
          ));
        }
      });
    }
  }, [action.modal, iccid, setShowAlert, setVoucherType, token, voucherCode]);
  const getMaskedPlaceholder = useCallback(
    (type: 'placeholder' | 'text') => {
      const code = voucherCode + '●●●●●●●●●●●●●●●●'.slice(voucherCode.length);
      const formattedCodeWithSpaces = code.replace(/.{4}/g, '$&  ');
      const text = formattedCodeWithSpaces.replace(/●/g, '').trim();

      if (type === 'placeholder') {
        return formattedCodeWithSpaces.replace(/[0-9]/g, '').trim();
      }

      if ((text.length % 6) - 4 === 0) {
        return `${text}  `;
      }

      return text;
    },
    [voucherCode],
  );

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          marginHorizontal: 20,
        }}>
        <View style={{flexDirection: 'row', marginTop: 32, gap: 6}}>
          <AppSvgIcon name="voucherIcon" />
          <AppText style={[appStyles.normal16Text]}>
            {i18n.t('mypage:voucher:code')}
          </AppText>
        </View>
        <Pressable onPress={handleFocus} style={styles.textContainer}>
          <AppText style={styles.placeholder}>
            <AppText style={{color: colors.black}}>
              {getMaskedPlaceholder('text')}
            </AppText>
            <AppText style={{color: colors.greyish}}>
              {getMaskedPlaceholder('placeholder')}
            </AppText>
          </AppText>
        </Pressable>
        <View style={{flexDirection: 'row', gap: 6, marginTop: 6}}>
          <AppText
            style={[
              appStyles.bold14Text,
              {lineHeight: 20, color: colors.clearBlue},
            ]}>
            TIP
          </AppText>
          <AppText
            style={[
              appStyles.medium14,
              {lineHeight: 20, color: colors.warmGrey},
            ]}>
            {i18n.t('mypage:voucher:noti')}
          </AppText>
        </View>
        <AppTextInput
          ref={inputRef}
          style={styles.input}
          value={voucherCode}
          onChangeText={(val: string) => {
            setVoucherCode(val);
          }}
          keyboardType="numeric"
          maxLength={16}
        />
      </ScrollView>
      <AppButton
        title={i18n.t('mypage:voucher:use')}
        titleStyle={[appStyles.medium18, {color: colors.white}]}
        disabled={voucherCode.length !== 16}
        onPress={() => onSubmit()}
        style={styles.confirm}
        type="primary"
      />
    </>
  );
};

export default connect(
  ({account}: RootState) => ({account}),
  (dispatch) => ({
    action: {
      order: bindActionCreators(orderActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  }),
)(VoucherTab);
